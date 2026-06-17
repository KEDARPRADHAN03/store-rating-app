# Store Rating Platform

A full-stack web application where users can submit ratings (1-5) for stores. Built with NestJS, PostgreSQL, and React.

## Tech Stack
- **Backend:** NestJS, TypeORM, PostgreSQL
- **Frontend:** React, Material UI
- **Auth:** JWT

## User Roles
1. **System Administrator** - manages users and stores, views dashboard stats
2. **Normal User** - signs up, browses stores, submits/edits ratings
3. **Store Owner** - views ratings and average rating for their store

## Setup Instructions

### 1. Database Setup
- Install PostgreSQL
- Create a database named `store_rating_db`

### 2. Backend Setup