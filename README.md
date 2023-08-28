# JWTAuth

 - A small login application that uses JWT for user authentication
 - For this purpose, JWT uses tokens that contain:
    -  a header and a payload: encoded, but not encrypted - can be decoded using `https://jwt.io/` (In this case, the header contains information about the encryption algorithm used for the signature and the type of token, and the payload contains user information - id, if he's an admin, issue and expiration time)
    - a signature encrypted by taking the header + payload, and also a server side stored secret (this is also used to check whether the token is valid)
 - no database is used as this is for demonstration purposes, instead the server simply stores a list of users and refresh tokens (which are used to obtain new access tokens when they expire)

 ## Usage
 - Dependencies should be resolved, e.g. using the `yarn` command after running `npm init` and `npm i yarn`
 - Currently only two users are stored and are able to login (username / password / isAdmin):
    - Alex / testPass / true
    - Mike / testPass2 / false
- The login function is case-sensitive!
- Once logged in, the users have the ability to `delete` other users (the functionality is not actually implemented, it is symbolic for an action that can be only completed by some users - simple users can only delete their own account, while admins have full control)