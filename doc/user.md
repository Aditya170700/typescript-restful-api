# User API Spec

## Register User

Endpoint : POST /api/users

Request Body :
```json
{
  "username": "aditya",
  "password": "password",
  "name": "Aditya Ricki"
}
```

Response Body (Success) :
```json
{
  "data": {
      "username": "aditya",
      "name": "Aditya Ricki"
  }
}
```

Response Body (Failed) :
```json
{
  "errors": "Message"
}
```

## Login User

Endpoint : POST /api/users/login

Request Body :
```json
{
  "username": "aditya",
  "password": "password"
}
```

Response Body (Success) :
```json
{
  "data": {
      "username": "aditya",
      "name": "Aditya Ricki",
      "token": "{uuid}"
  }
}
```

Response Body (Failed) :
```json
{
  "errors": "Message"
}
```

## Get User

Endpoint : GET /api/users/current

Request header :
- X-API-TOKEN : token

Response Body (Success) :
```json
{
  "data": {
      "username": "aditya",
      "name": "Aditya Ricki"
  }
}
```

Response Body (Failed) :
```json
{
  "errors": "Message"
}
```

## Update User

Endpoint : PATCH /api/users/current

Request header :
- X-API-TOKEN : token

Request Body :
```json
{
  "username": "aditya", // nullable
  "password": "password" // nullable
}
```

Response Body (Success) :
```json
{
  "data": {
      "username": "aditya",
      "name": "Aditya Ricki"
  }
}
```

Response Body (Failed) :
```json
{
  "errors": "Message"
}
```

## Logout user

Endpoint : DELETE /api/users/current

Request header :
- X-API-TOKEN : token

Response Body (Success) :
```json
{
  "data": true
}
```

Response Body (Failed) :
```json
{
  "errors": "Message"
}
```