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

**CONTENT-TYPE** : application/json

**AUTHORIZATION HEADER**: none

**METHOD**: POST

**BODY**:`{
    "username":"devcosmas",
    "password":"pass123",
    "email":"buikem0112@gmail.com"
}`

**RESPONSE**:`{
    "status": "success",
    "message": "Sign up complete",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZjJmZGZjZDQ5ZWNkNDk3NzFjYWYxZSIsImlhdCI6MTcxMDQyMzU0OSwiZXhwIjoxNzEwNDI3MTQ5fQ.BMRYWP51VYfZ2BJM6NWuq1sgPWev5WQ8QgOpoIF2ndI",
    "user": {
        "email": "buikem0112@gmail.com",
        "username": "devcosmas",
        "password": "$2b$12$BFNKHkusoWzVcbuzM2waz.3KTpeApYWZGiszoieWt4XZRR/LMMvuK",
        "active": true,
        "_id": "65f2fdfcd49ecd49771caf1e",
        "__v": 0
    }
}`

### Login

**Login an existing User**

##### BASEURL/api/user/login

**CONTENT-TYPE** : application/json

**AUTHORIZATION HEADER**: none

**METHOD**: POST

**BODY**:`{
 "password":"pass123",
 "email":"buikem0112@gmail.com"
}`

**RESPONSE**:`{
    "status": "success",
    "message": "You are logged in now",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1Y2I3OTQxNWRkN2YxYzk4OGFlNzNiNiIsImlhdCI6MTcxMDQyMzIxNiwiZXhwIjoxNzEwNDI2ODE2fQ.HlyIslW67RJrih6rYbfTh_vc_wOKAxLSv4vdEUIlP5g",
    "user": {
        "_id": "65cb79415dd7f1c988ae73b6",
        "email": "buikem0112@gmail.com",
        "username": "newUserName00",
        "password": "$2b$12$gKzXwCFhNjY2QciZuL4nGO9j7tCUm5wsj1ssGAJzFnjjqvZRIReie",
        "active": true,
        "__v": 0
    }
}`


### Update me (user)

**Update an existing User detail (email and username is only allowed)**

##### BASEURL/api/user/forget_Password

**CONTENT-TYPE** : application/json

**METHOD**: PATCH

**AUTHORIZATION HEADER**: Bearer Token

**BODY**:`{
    "username":"new human"
}`

**RESPONSE**:`{
    "status": "SUCCESS",
    "message": "Your profile is updated",
    "size": 1,
    "data": {
        "_id": "65cb79415dd7f1c988ae73b6",
        "email": "buikem0112@gmail.com",
        "username": "new human",
        "active": true,
        "__v": 0
    }
}`

### Send reset password token

**Send password reset token to email address**

##### BASEURL/api/user/forget_Password

**CONTENT-TYPE** : application/json

**METHOD**: POST

**AUTHORIZATION HEADER**: none

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

**CONTENT-TYPE** : application/json

**METHOD**: POST

**AUTHORIZATION HEADER**: Bearer Token

**BODY**: none

**RESPONSE**:`{
    "message": "You have been successfully logged out"
}`
