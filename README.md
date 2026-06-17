# Store Rating Platform

A full-stack web application where users can submit ratings (1-5) for stores. Built with NestJS, PostgreSQL, and React.

## Tech Stack

- Backend: NestJS, TypeORM, PostgreSQL
- Frontend: React, Material UI
- Auth: JWT

## User Roles

1. System Administrator - manages users and stores, views dashboard stats
2. Normal User - signs up, browses stores, submits/edits ratings
3. Store Owner - views ratings and average rating for their store

## Setup Instructions

### 1. Database Setup

Install PostgreSQL and create a database named store_rating_db

### 2. Backend Setup

Run the following commands in the backend folder:

    cd backend
    npm install

Create a .env file in the backend folder with the following content:

    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=postgres
    DB_PASSWORD=your_password
    DB_NAME=store_rating_db
    JWT_SECRET=your_secret_key

Then run the backend:

    npm run start:dev

Backend runs on http://localhost:3000

### 3. Frontend Setup

Run the following commands in the frontend folder:

    cd frontend
    npm install
    npm start

Frontend runs on http://localhost:3001 (or next available port)

## Creating the First Admin User

1. Sign up a normal user via the /signup page
2. In PostgreSQL, run the following SQL command:

    UPDATE users SET role = 'admin' WHERE email = 'your_email_here';

## Form Validations

- Name: 20-60 characters
- Address: Max 400 characters
- Password: 8-16 characters, must include 1 uppercase letter and 1 special character
- Email: Standard email format
