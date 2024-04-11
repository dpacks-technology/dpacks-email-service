# DPacks Email Microservice
## Description
This is a microservice that sends emails to users. It is built using Node.js and Express.js. It uses nodemailer to send emails.

## Installation
1. Clone the repository
2. Run `npm install` to install the dependencies
3. Create a `.env` file in the root directory and add the following environment variables:

```
API_KEY={API_KEY}
PORT=4005

# Google API
GOOGLE_API_SERVICE=gmail
GOOGLE_API_TYPE=OAuth2
GOOGLE_API_USER=dpacks.notifications@gmail.com
GOOGLE_API_CLIENT_ID={ID}
GOOGLE_API_CLIENT_SECRET={SECRET}
GOOGLE_API_REDIRECT_URL=https://developers.google.com/oauthplayground
GOOGLE_API_REFRESH_TOKEN={REFRESH_TOKEN}
```

4. Run `npm start` to start the server
5. The server will be running on `http://localhost:4005`
6. You can test the API using Postman
7. To send an email, make a POST request to `http://localhost:4005/api/v1/email/send` with the following JSON body:

```
{
    "api_key": "API_KEY",
    "to": "example@example.com",
    "subject": "Example Subject",
    "message": "Example Message",
    "size": "sm"
}
```
Size can be `sm`, `md`, or `lg`

## API Endpoints
1. POST `/api/v1/email/send` - Send an email
2. GET `/` - Test the email service

## Dependencies
1. Express.js
2. Nodemailer
3. Dotenv
4. Google OAuth2

## Copyright
&copy; 2024 DPacks. All Rights Reserved.