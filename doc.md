## Introduction

Briefly Api is a simple software that provide you the opportunity to shorten long web link to a short and simple sharable links. The simple analytic tools that comes with the briefly api allows for keeping track of your link individually.

## Table of Contents

# 1\. Introduction

# 2\. Endpoints

## 2.1. User Management

### 2.1a Sign Up

### 2.1b Login

### 2.1c updateMe

### 2.1d Forget Password

### 2.1e Reset Password

### 2.1f Logout

## 2.2. Shorten Url Management

### 2.2a create a short URL

### 2.2b Find All url by User id

### 2.2c Update URL name

### 2.2d Delete URL

# TECH STACK

Node js, Express js, Typescript and mongoose.

# DATABASE

MongoDb (NOSQL)

# SCHEMAS

#### User Schema

`const userSchema = new Schema(
{ email: {
type: String,
required: [true, 'Email is required'],
trim: true, unique: true,
lowercase: true,
validate: { validator: function (value: string) { return validator.isEmail(value); },
message: 'Invalid email address', }, }, username: { type: String, unique: true, },
password: { type: String, required: [true, 'Password is required'], trim: true, },
resetPasswordToken: String,
resetTimeExp: Date, active: { type: Boolean, default: true, },})`

#### Shortened Url Schema:

`const UrlSchema = new Schema({
shortUrl: { type: String, trim: true, unique: true, lowercase: true, },
originalUrl: { type: String,trim: true,required: [true, 'valid url required'], validate: { validator: (value: string) => validator.isURL(value), message: 'Invalid URL', }, }, whoVisited: { type: [String], default: [], },
visitationCount: {type: Number, default: 0, },
userId: {type: Schema.Types.ObjectId, ref: 'User', },
newUrl: String,
createdAt: {type: Date, default: Date.now(),
},})`.

## API REQUEST

### Sign Up

**Sign Up a new user**

##### BASEURL/api/user/register

**CONTENT-TYPE** : `application/json`

**AUTHORIZATION HEADER**: `none`

**METHOD**: `POST`

**BODY**:`{
    "username":"devuuuuuuuucossmas",
    "password":"pass123",
    "email":"examplhhghghgjhse@gmail.com"
}`

**RESPONSE**:`{
    "status": "success",
    "message": "Sign up complete",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZjJmZGZjZDQ5ZWNkNDk3NzFjYWYxZSIsImlhdCI6MTcxMDQyMzU0OSwiZXhwIjoxNzEwNDI3MTQ5fQ.BMRYWP51VYfZ2BJM6NWuq1sgPWev5WQ8QgOpoIF2ndI",
    "user": {
        "email": "exp@gmail.com",
        "username": "human",
        "password": "$2b$12$BFNKHkusoWzVcbuzM2waz.3KTpeApYWZGiszoieWt4XZRR/LMMvuK",
        "active": true,
        "_id": "65f2fdfcd49ecd49771caf1e",
        "__v": 0
    }
}`

### Login

**Login an existing User**

##### BASEURL/api/user/login

**CONTENT-TYPE** : `application/json`

**AUTHORIZATION HEADER**: `none`

**METHOD**: `POST`

**BODY**:`{
 "password":"don",
 "email":"buikem0112@gmail.com"
}`

**RESPONSE**:`{
    "status": "success",
    "message": "You are logged in now",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1Y2I3OTQxNWRkN2YxYzk4OGFlNzNiNiIsImlhdCI6MTcxMDQyMzIxNiwiZXhwIjoxNzEwNDI2ODE2fQ.HlyIslW67RJrih6rYbfTh_vc_wOKAxLSv4vdEUIlP5g",
    "user": {
        "_id": "65cb79415dd7f1c988ae73b6",
        "email": "buikem0112@gmail.com",
        "photo": "user-1708276370612.png",
        "username": "newUserName00",
        "password": "$2b$12$gKzXwCFhNjY2QciZuL4nGO9j7tCUm5wsj1ssGAJzFnjjqvZRIReie",
        "active": true,
        "__v": 0
    }
}`

**Note**: To test in postman. Click on "run in postman" at the top right corner of the website.

### Update me (user)

**Update an existing User detail (email and username is only allowed)**

##### BASEURL/api/user/forget_Password

**CONTENT-TYPE** : `application/json`

**METHOD**: `PATCH`

**AUTHORIZATION HEADER**: `Bearer Token`

**BODY**:`{
    "username":"new human"
}`

**RESPONSE**:`{
    "status": "SUCCESS",
    "message": "Your profile is updated",
    "size": 1,
    "data": {
        "_id": "65f2fdfcd49ecd49771caf1e",
        "email": "exp@gmail.com",
        "username": "new human",
        "active": true,
        "__v": 0
    }
}`

### Send reset password token

**Send password reset token to email address**

##### BASEURL/api/user/forget_Password

**CONTENT-TYPE** : `application/json`

**METHOD**: POST

**AUTHORIZATION HEADER**: `none`

**BODY**:`{
    "email": "buikem0112@gmail.com"
}`

**RESPONSE**:`{
    "status": "success",
    "message": "Your password reset token has been sent. Check your mailbox"
}`

### Logout

**Logout an existing user from a session**

##### BASEURL/api/user/logout

**CONTENT-TYPE** : `application/json`

**METHOD**: `POST`

**AUTHORIZATION HEADER**: `Bearer Token`

**BODY**: none

**RESPONSE**:`{
    "message": "You have been successfully logged out"
}`

### Create new url

**Create a new short link**

##### BASEURL/createUrl

**CONTENT-TYPE** : `application/json`

**METHOD**: `POST`

**AUTHORIZATION HEADER**: `Bearer Token`

**BODY**:`{
    "originalUrl":"https://dashboard.render.com/select-repo?type=static"
}`

**RESPONSE**:`{
    "status": "success",
    "message": "New Link Created",
    "newDoc": {
        "shortUrl": "dezkvuo8c",
        "originalUrl": "https://briefly-26p0.onrender.com/login",
        "whoVisited": [],
        "visitationCount": 0,
        "userId": {
            "_id": "65cb79415dd7f1c988ae73b6",
            "email": "buikem0112@gmail.com",
            "username": "newUserName00",
            "password": "$2b$12$RqtEoTEdlrW5J0sbfle8semrCGy6yzfgupERMZrhWkxp6HIdx.Njq",
            "active": true,
            "__v": 0,
            "resetPasswordToken": "912576",
            "resetTimeExp": "2024-03-12T16:20:57.623Z"
        },
        "newUrl": "http://localhost:8000/dezkvUO8C",
        "createdAt": "2024-03-12T16:28:21.043Z",
        "_id": "65f0830f3af71f67bbd129bf",
        "__v": 0
    }
}`

## Redirect Url

**redirect shorten lik to the orginal link content**

##### `BASEURL/${shordId}`

**CONTENT-TYPE** : application/json

**METHOD**: `GET`

**AUTHORIZATION HEADER**: `none`

**BODY**:`none`

**RESPONSE**: `html content of the orginal url`

## Update url shortId to a customized name

**Set new custom name for shortened link**

##### `BASEURL/updateUrl/${shordId}`

**CONTENT-TYPE** : `application/json`

**METHOD**: `PATCH`

**AUTHORIZATION HEADER**: `Bearer Token`
**BODY**:`{
    "shortUrl":"render_repo"
}`'

**RESPONSE**: `{
    "status": "success",
    "message": "update successfull",
    "updatedUrl": {
        "_id": "65f3012fe0669ebace7e3b43",
        "shortUrl": "render_repo",
        "originalUrl": "https://dashboard.render.com/select-repo?type=static",
        "whoVisited": [
            "::1"
        ],
        "visitationCount": 1,
        "userId": "65cb79415dd7f1c988ae73b6",
        "newUrl": "http://localhost:8000/render_repo",
        "createdAt": "2024-03-14T13:47:44.157Z",
        "__v": 1
    }
}`

## Delete url

**Delete existing url from the database**

##### `BASEURL/deleteUrl/${id}`

**CONTENT-TYPE** : `application/json`

**METHOD**: `DELETE`

**AUTHORIZATION HEADER**: `Bearer Token`

**BODY**:`none`

**RESPONSE**: `{
    "status": "success",
    "message": "You have deleted this Url"
}`

## find all user's only urls

**Find all url related to a perticular user**

##### `BASEURL/findAll`

**CONTENT-TYPE** : `application/json`

**METHOD**: `GET`

**AUTHORIZATION HEADER**: `Bearer Token`

**BODY**:`none`

**RESPONSE**: `{
    "status": "success",
    "message": "This is a list of Your Urls",
    "size": 27,
    "data": [
        {
            "_id": "65f0830f3af71f67bbd129bf",
            "shortUrl": "dezkvuo8c",
            "originalUrl": "https://briefly-26p0.onrender.com/login",
            "whoVisited": [],
            "visitationCount": 0,
            "userId": "65cb79415dd7f1c988ae73b6",
            "newUrl": "http://localhost:8000/dezkvUO8C",
            "createdAt": "2024-03-12T16:28:21.043Z",
            "__v": 0
        },
        {
            "_id": "65f081afdd65acee161589a7",
            "shortUrl": "ike5qr9q2",
            "originalUrl": "https://www.postman.com/telecoms-astronomer-25151705/workspace/item-api/overview",
            "whoVisited": [],
            "visitationCount": 0,
            "userId": "65cb79415dd7f1c988ae73b6",
            "newUrl": "http://localhost:8000/ike5Qr9q2",
            "createdAt": "2024-03-12T16:24:07.907Z",
            "__v": 0
        },
        {
            "_id": "65f081770e04fb507da6ebe0",
            "shortUrl": "csh9dfk1f",
            "originalUrl": "https://www.postman.com/telecoms-astronomer-25151705/workspace/item-api/overview",
            "whoVisited": [],
            "visitationCount": 0,
            "userId": "65cb79415dd7f1c988ae73b6",
            "newUrl": "http://localhost:8000/csh9dfk1f",
            "createdAt": "2024-03-12T16:22:45.747Z",
            "__v": 0
        },
        {
            "_id": "65f081349974eca30c8a8e78",
            "shortUrl": "zmggettzz",
            "originalUrl": "https://www.postman.com/telecoms-astronomer-25151705/workspace/item-api/overview",
            "whoVisited": [],
            "visitationCount": 0,
            "userId": "65cb79415dd7f1c988ae73b6",
            "newUrl": "http://localhost:8000/ZMGGetTzZ",
            "createdAt": "2024-03-12T16:21:50.829Z",
            "__v": 0
        },
        {
            "_id": "65f080c7fd3b57ddfc71855f",
            "shortUrl": "_35_ujyzj",
            "originalUrl": "https://www.postman.com/telecoms-astronomer-25151705/workspace/item-api/overview",
            "whoVisited": [],
            "visitationCount": 0,
            "userId": "65cb79415dd7f1c988ae73b6",
            "newUrl": "http://localhost:8000/_35_uJYzJ",
            "createdAt": "2024-03-12T16:20:17.627Z",
            "__v": 0
        },
        {
            "_id": "65f080a7d5bd5109ebd3fc9c",
            "shortUrl": "wlo9-l5d8",
            "originalUrl": "https://www.postman.com/telecoms-astronomer-25151705/workspace/item-api/overview",
            "whoVisited": [],
            "visitationCount": 0,
            "userId": "65cb79415dd7f1c988ae73b6",
            "newUrl": "http://localhost:8000/wLO9-l5D8",
            "createdAt": "2024-03-12T16:19:42.169Z",
            "__v": 0
        },
        {
            "_id": "65f0802480ba886922e17b1a",
            "shortUrl": "eytj7mcfg",
            "originalUrl": "https://www.postman.com/telecoms-astronomer-25151705/workspace/item-api/overview",
            "whoVisited": [],
            "visitationCount": 0,
            "userId": "65cb79415dd7f1c988ae73b6",
            "newUrl": "http://localhost:8000/eyTj7McfG",
            "createdAt": "2024-03-12T16:17:32.144Z",
            "__v": 0
        },
        {
            "_id": "65f07ffe6048c07275823e7c",
            "shortUrl": "oqkaw7ofg",
            "originalUrl": "https://www.postman.com/telecoms-astronomer-25151705/workspace/item-api/overview",
            "whoVisited": [],
            "visitationCount": 0,
            "userId": "65cb79415dd7f1c988ae73b6",
            "newUrl": "http://localhost:8000/OQKAW7oFG",
            "createdAt": "2024-03-12T16:16:54.906Z",
            "__v": 0
        },
        {
            "_id": "65f080176048c07275823e80",
            "shortUrl": "w0f1bm2il",
            "originalUrl": "https://www.postman.com/telecoms-astronomer-25151705/workspace/item-api/overview",
            "whoVisited": [],
            "visitationCount": 0,
            "userId": "65cb79415dd7f1c988ae73b6",
            "newUrl": "http://localhost:8000/W0f1Bm2iL",
            "createdAt": "2024-03-12T16:16:54.906Z",
            "__v": 0
        },
        {
            "_id": "65f07fa116bcc9f77d371ce7",
            "shortUrl": "lx8m4gwlv",
            "originalUrl": "https://www.postman.com/telecoms-astronomer-25151705/workspace/item-api/overview",
            "whoVisited": [],
            "visitationCount": 0,
            "userId": "65cb79415dd7f1c988ae73b6",
            "newUrl": "http://localhost:8000/LX8m4Gwlv",
            "createdAt": "2024-03-12T16:09:24.736Z",
            "__v": 0
        },
        {
            "_id": "65f07faf16bcc9f77d371cea",
            "shortUrl": "w1fuf4gd-",
            "originalUrl": "https://www.postman.com/telecoms-astronomer-25151705/workspace/item-api/overview",
            "whoVisited": [],
            "visitationCount": 0,
            "userId": "65cb79415dd7f1c988ae73b6",
            "newUrl": "http://localhost:8000/w1fuf4Gd-",
            "createdAt": "2024-03-12T16:09:24.736Z",
            "__v": 0
        },
        {
            "_id": "65ea259cda4a4ae2e5a818b3",
            "shortUrl": "f7e9vrtm_",
            "originalUrl": "https://www.npmjs.com/package/react-use-clipboard",
            "whoVisited": [
                "::1"
            ],
            "visitationCount": 1,
            "userId": "65cb79415dd7f1c988ae73b6",
            "newUrl": "http://localhost:8000/f7e9VRtM_",
            "createdAt": "2024-03-07T20:05:04.299Z",
            "__v": 1
        },
        {
            "_id": "65e91679ddeba51f6b5afec1",
            "shortUrl": "erimus",
            "originalUrl": "https://www.google.com/search?q=matches+today&oq=&gs_lcrp=EgZjaHJvbWUqCQgBECMYJxjqAjIJCAAQIxgnGOoCMgkIARAjGCcY6gIyCQgCECMYJxjqAjIJCAMQIxgnGOoCMgkIBBAjGCcY6gIyCQgFECMYJxjqAjIJCAYQIxgnGOoCMgkIBxAjGCcY6gLSAQ0yMjE0MTk0MzRqMGo3qAIIsAIB&sourceid=chrome&ie=UTF-8",
            "whoVisited": [],
            "visitationCount": 0,
            "userId": "65cb79415dd7f1c988ae73b6",
            "newUrl": "http://localhost:8000/erimus",
            "createdAt": "2024-03-07T01:18:31.174Z",
            "__v": 0
        },
        {
            "_id": "65e91683ddeba51f6b5afec4",
            "shortUrl": "erimus1",
            "originalUrl": "https://www.google.com/search?q=matches+today&oq=&gs_lcrp=EgZjaHJvbWUqCQgBECMYJxjqAjIJCAAQIxgnGOoCMgkIARAjGCcY6gIyCQgCECMYJxjqAjIJCAMQIxgnGOoCMgkIBBAjGCcY6gIyCQgFECMYJxjqAjIJCAYQIxgnGOoCMgkIBxAjGCcY6gLSAQ0yMjE0MTk0MzRqMGo3qAIIsAIB&sourceid=chrome&ie=UTF-8",
            "whoVisited": [],
            "visitationCount": 0,
            "userId": "65cb79415dd7f1c988ae73b6",
            "newUrl": "http://localhost:8000/erimus1",
            "createdAt": "2024-03-07T01:18:31.174Z",
            "__v": 0
        },
        {
            "_id": "65e7da418744cbf86dd4506f",
            "shortUrl": "k2urv5drl",
            "originalUrl": "http://localhost:3000/dashboard",
            "whoVisited": [
                "::ffff:127.0.0.1"
            ],
            "visitationCount": 1,
            "userId": "65cb79415dd7f1c988ae73b6",
            "newUrl": "http://localhost:8000/K2uRV5dRl",
            "createdAt": "2024-03-06T00:48:05.744Z",
            "__v": 1
        },
        {
            "_id": "65e7db7c8744cbf86dd45075",
            "shortUrl": "vw8dqka7a",
            "originalUrl": "http://localhost:3000/dashboard",
            "whoVisited": [],
            "visitationCount": 0,
            "userId": "65cb79415dd7f1c988ae73b6",
            "newUrl": "http://localhost:8000/vW8dqka7A",
            "createdAt": "2024-03-06T00:48:05.744Z",
            "__v": 0
        },
        {
            "_id": "65e7dc548744cbf86dd4507b",
            "shortUrl": "fedblvcru",
            "originalUrl": "http://localhost:3000/dashboard",
            "whoVisited": [],
            "visitationCount": 0,
            "userId": "65cb79415dd7f1c988ae73b6",
            "newUrl": "http://localhost:8000/FEdblvcru",
            "createdAt": "2024-03-06T00:48:05.744Z",
            "__v": 0
        },
        {
            "_id": "65e7e2598744cbf86dd4508f",
            "shortUrl": "_97uckq1o",
            "originalUrl": "https://chat.openai.com/c/b305190f-0183-49e7-9bcf-1485dd1ecddc",
            "whoVisited": [],
            "visitationCount": 0,
            "userId": "65cb79415dd7f1c988ae73b6",
            "newUrl": "http://localhost:8000/_97uCkQ1O",
            "createdAt": "2024-03-06T00:48:05.744Z",
            "__v": 0
        },
        {
            "_id": "65e7462b0c883967bc842ea3",
            "shortUrl": "9ujhwykxk",
            "originalUrl": "dfffffff",
            "whoVisited": [],
            "visitationCount": 0,
            "userId": "65cb79415dd7f1c988ae73b6",
            "newUrl": "http://localhost:8000/9UjHWykXk",
            "createdAt": "2024-03-05T15:59:23.881Z",
            "__v": 0
        },
        {
            "_id": "65e750180c883967bc842ea6",
            "shortUrl": "nidg9j2ok",
            "originalUrl": "height: ;",
            "whoVisited": [],
            "visitationCount": 0,
            "userId": "65cb79415dd7f1c988ae73b6",
            "newUrl": "http://localhost:8000/niDg9J2oK",
            "createdAt": "2024-03-05T15:59:23.881Z",
            "__v": 0
        },
        {
            "_id": "65e5b11b5015125e5548a18e",
            "shortUrl": "gn_me0acm",
            "originalUrl": "https://chat.openai.com/c/a7fdd748-1760-44ad-908a-ba557a2af514",
            "whoVisited": [],
            "visitationCount": 0,
            "userId": "65cb79415dd7f1c988ae73b6",
            "newUrl": "http://localhost:8000/gn_ME0aCm",
            "createdAt": "2024-03-04T09:45:11.824Z",
            "__v": 0
        },
        {
            "_id": "65e5b4385015125e5548a7d2",
            "shortUrl": "hhhh",
            "originalUrl": "https://chat.openai.com/c/a7fdd748-1760-44ad-908a-ba557a2af514",
            "whoVisited": [],
            "visitationCount": 0,
            "userId": "65cb79415dd7f1c988ae73b6",
            "newUrl": "http://localhost:8000/hhhh",
            "createdAt": "2024-03-04T09:45:11.824Z",
            "__v": 0
        },
        {
            "_id": "65e5b4d55015125e5548a7e0",
            "shortUrl": "vlaqsbaji",
            "originalUrl": "https://chat.openai.com/c/a7fdd748-1760-44ad-908a-ba557a2af514",
            "whoVisited": [],
            "visitationCount": 0,
            "userId": "65cb79415dd7f1c988ae73b6",
            "newUrl": "http://localhost:8000/vlAQSBajI",
            "createdAt": "2024-03-04T09:45:11.824Z",
            "__v": 0
        },
        {
            "createdAt": "2024-03-14T13:47:44.157Z",
            "_id": "65e1c822892084abd6e4b6c5",
            "shortUrl": "qykhhpo20",
            "originalUrl": "http://localhost:3000/login",
            "whoVisited": [],
            "visitationCount": 0,
            "userId": "65cb79415dd7f1c988ae73b6",
            "newUrl": "http://localhost:8000/qYKhhPo20",
            "__v": 0
        },
        {
            "createdAt": "2024-03-14T13:47:44.157Z",
            "_id": "65e1c824892084abd6e4b6ff",
            "shortUrl": "1xqj3w1nk",
            "originalUrl": "http://localhost:3000/login",
            "whoVisited": [],
            "visitationCount": 0,
            "userId": "65cb79415dd7f1c988ae73b6",
            "newUrl": "http://localhost:8000/1xqJ3W1nK",
            "__v": 0
        },
        {
            "createdAt": "2024-03-14T13:47:44.157Z",
            "_id": "65e1c824892084abd6e4b702",
            "shortUrl": "tegabxpzd7",
            "originalUrl": "http://localhost:3000/login",
            "whoVisited": [],
            "visitationCount": 0,
            "userId": "65cb79415dd7f1c988ae73b6",
            "newUrl": "http://localhost:8000/TeGaBXPZD7",
            "__v": 0
        },
        {
            "createdAt": "2024-03-14T13:47:44.157Z",
            "_id": "65e1c92c99c22c3ce5a32b04",
            "shortUrl": "9khqo1piw",
            "originalUrl": "http://localhost:3000/login",
            "whoVisited": [],
            "visitationCount": 0,
            "userId": "65cb79415dd7f1c988ae73b6",
            "newUrl": "http://localhost:8000/9KHQO1pIw",
            "__v": 0
        }
    ]
}`
