# Trail Finder API 2023

## v1.0.0

## About The Project
A RESTful API server for user to discover trails worldwide. This API is built with Node.js, Express framework, and MySQL.
[Check this picture getting usage inspiration](https://imgur.com/qfVXPlD)

## Usage
Welcome to our brand new web program, designed exclusively for hiking enthusiasts! This platform offers features that allow users to log in, record, explore, and share favorite hiking journeys.

_Check this out to view more - [documentation](https://)

### Base URL
After downloading the project codes, please utilize your preferred server deployment tool (such as Google Cloud or Heroku, etc.) to deploy the website and then initiate the launch.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/jiasyuanchu/Trail-Finder.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create database via SQL WorkBench(enter in WorkBench Application)
   ```sh
   create database trail-finder-project
   ```
4. Create models
   ```sh
   npx sequelize db:migrate
   ```
5. Create built-in data via seeds
   ```sh
   npx sequelize db:seed:all
   ```
6. Establish .env file and put passowrds in
   ```sh
   IMGUR_CLIENT_ID= 'YOUR PASSWORD'
   JWT_SECRET= 'YOUR PASSWORD'
   ```
7. Start the server
   ```sh
   - MacOS
    npm run start
   - Windows OS
    npm run startWin
   ```

## Getting Started
Use the default accounts to login
   ```sh
   - User
    account: user1
    email: user1@example.com
    password: 1234
   - Admin
    account: root
    email: root@example.com
    password: 12345678
   ```

## Environment
- node: ^v14.16.0,
- nodemon

## Built With
- bcrypt-nodejs: ^0.0.3,
- bcryptjs: ^2.4.3,
- body-parser: ^1.20.2,
- cors: ^2.8.5,
- dotenv: ^16.3.1,
- express: ^4.18.2,
- express-handlebars: ^4.0.6,
- express-session: ^1.17.3,
- faker: ^4.1.0,
- fast-xml-parser: ^4.2.6,
- imgur: ^1.0.2,
- jsonwebtoken: ^9.0.1,
- method-override: ^3.0.0,
- multer: ^1.4.5-lts.1,
- mysql2: ^3.5.2,
- passport: ^0.4.1,
- passport-jwt: ^4.0.1,
- passport-local: ^1.0.0,
- sequelize: ^6.32.1,
- sequelize-cli: ^6.6.1,
- tslib: ^2.5.3

## Contributors
- Kevin_L [https://github.com/av124773](https://github.com/av124773)
- Chia-Hsuan Chu [https://github.com/jiasyuanchu](https://github.com/jiasyuanchu)