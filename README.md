# Node-Express Ecommerce API

## Overview
This API provides functionality for managing users including user registration, authentication, user details retrieval, user updates, and password management.

## Endpoints
### Create User
- **URL**: `/api/users`
- **Method**: `POST`
- **Description**: Register a new user.
- **Request Body**:
  - `username`: Username of the user.
  - `email`: Email address of the user.
  - `password`: Password for the user.
  - `address`: (Optional) Address of the user.
  - `phoneNumber`: (Optional) Phone number of the user.
  - `photo`: (Optional) Profile photo of the user.
  - `role`: (Optional) Role of the user (default: 'buyer').
- **Response**: 
  - `user`: User object containing user details excluding password.
  - `token`: JWT token for authentication.

### Login User
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Description**: Authenticate a user.
- **Request Body**:
  - `email` or `username`: Email address or username of the user.
  - `password`: Password for the user.
- **Response**: 
  - `user`: User object containing user details excluding password.
  - `token`: JWT token for authentication.

### Get User
- **URL**: `/api/users/:userID`
- **Method**: `GET`
- **Description**: Get details of a specific user.
- **Response**: 
  - `user`: User object containing user details excluding password.

### Get All Users
- **URL**: `/api/users`
- **Method**: `GET`
- **Description**: Get details of all users.
- **Response**: 
  - `users`: Array of user objects containing user details excluding password.

### Update User
- **URL**: `/api/users/:userID`
- **Method**: `PATCH`
- **Description**: Update details of a specific user.
- **Request Body**: 
  - Fields to be updated (e.g., `username`, `email`, `address`, `phoneNumber`, `photo`, `role`).
- **Response**: 
  - `user`: Updated user object containing user details.

### Delete User
- **URL**: `/api/users/:userID`
- **Method**: `DELETE`
- **Description**: Delete a specific user.

### Update Password
- **URL**: `/api/users/password`
- **Method**: `POST`
- **Description**: Update the password of a user.
- **Request Body**: 
  - `currentPassword`: Current password of the user.
  - `newPassword`: New password for the user.

### Forgot Password
- **URL**: `/api/users/password`
- **Method**: `POST`
- **Description**: Request a password reset OTP.
- **Request Body**: 
  - `email`: Email address of the user.

### Reset Password
- **URL**: `/api/auth/reset-password`
- **Method**: `POST`
- **Description**: Reset the password using OTP.
- **Request Body**: 
  - `email`: Email address of the user.
  - `otp`: One-time password sent to the user's email.
  - `newPassword`: New password for the user.


## Error Handling
- Errors are returned with appropriate HTTP status codes and error messages in JSON format.
