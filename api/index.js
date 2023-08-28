const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")
app.use(express.json())


const users = [
    {
        id: "1",
        username: "John",
        password: "John0908",
        isAdmin: true
    },
    {
        id: "2",
        username: "Jane",
        password: "Jane0908",
        isAdmin: false
    },
]

let refreshTokens = []

app.post("/api/refresh", (req, res) => {
    //Take the refresh token from user
    const refreshToken = req.body.token

    //Send error (no token / invalid)
    if (!refreshToken) return res.status(401).json("No (longer) authenticated")
    if(!refreshTokens.includes(refreshToken)) return res.status(403).json("Refresh token is not valid")
    jwt.verify(refreshToken, "myRefreshSecretKey", (err, user) => {
        if(err) console.log(err)
        refreshTokens = refreshTokens.filter((token) => token !== refreshToken)

        //all good? create new access token, refresh token
        const newAccessToken = generateAccessToken(user)
        const newRefreshToken = generateRefreshToken(user)

        refreshTokens.push(newRefreshToken)

        res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        })
    })

    
})

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, isAdmin: user.isAdmin },
        "mySecretKey",
        {expiresIn: "5s"}
    )
}

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id, isAdmin: user.isAdmin },
        "myRefreshSecretKey",
    )
}


const verify = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (authHeader) {
        const token = authHeader.split(" ")[1]

        jwt.verify(token, "mySecretKey", (err, user) => {
            if (err) {
                return res.status(403).json("Token is not valid")
            }

            req.user = user
            next()
        })
    } else {
        res.status(401).json("Not Authenticated")
    }
}

app.post("/api/logout", verify, (req, res)=>{
    const refreshToken = req.body.token
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken)
    res.status(200).json(refreshToken)
})

app.post("/api/login", (req, res) => {
    const { username, password } = req.body
    const user = users.find(u => {
        return u.username === username && u.password === password
    })
    if (user) {
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)
        refreshTokens.push(refreshToken)

        res.json({
            username: user.username,
            isAdmin: user.isAdmin,
            accessToken,
            refreshToken,
        })
    }
    else {
        res.status(400).json("Username or password incorrect")
    }
})

app.delete("/api/users/:userId", verify, (req, res) => {
    if (req.user.id === req.params.userId || req.user.isAdmin) {
        res.status(200).json("User has been deleted.")
    } else {
        res.status(403).json("You are not allowed to delete this user.")
    }
})

app.listen(5000, () => {
    console.log("Backend server is running")
})