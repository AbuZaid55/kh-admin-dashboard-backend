# Khwaahish Backend


## API Endpoints

### User Authentication

#### Register

1. **Send OTP**
   - **Endpoint:** `/user/auth/register/phone-otp`
   - **Method:** `POST`
   - **Description:** Sends an OTP to the user's phone number for registration.
   - **Request Body:**
     ```json
     {
       "phone": "string"
     }
     ```
   - **Response:**
       ```json
     {
       "message": "OTP SENT SUCCESS",
       "otp": "string"
     }
     ```

2. **Verify OTP**
   - **Endpoint:** `/user/auth/register/phone-otp-verify`
   - **Method:** `POST`
   - **Description:** Verifies the OTP sent to the user's phone number and completes the registration process.
   - **Request Body:**
     ```json
     {
       "phone": "string",
       "otp": "string"
     }
     ```
   - **Response:**
     ```json
     {
       "message": "Registration successful",
       "passkey": "string"
     }
     ```

#### Login

1. **Send OTP**
   - **Endpoint:** `/user/auth/login/phone-otp`
   - **Method:** `POST`
   - **Description:** Sends an OTP to the user's phone number for login.
   - **Request Body:**
     ```json
     {
       "phone": "string"
     }
     ```
   - **Response:**
     ```json
     {
       "message": "OTP SENT SUCCESS",
       "otp": "string"
     }
     ```

2. **Verify OTP**
   - **Endpoint:** `/user/auth/login/phone-otp-verify`
   - **Method:** `POST`
   - **Description:** Verifies the OTP sent to the user's phone number and logs the user in.
   - **Request Body:**
     ```json
     {
       "phone": "string",
       "otp": "string"
     }
     ```
   - **Response:**
     ```json
     {
       "message": "Login successful",
       "token": "string"
     }
     ```

3. **Login with Passkey**
   - **Endpoint:** `/user/auth/login/passkey`
   - **Method:** `POST`
   - **Description:** Logs the user in using a passkey.
   - **Request Body:**
     ```json
     {
       "phone": "string",
       "passkey": "string"
     }
     ```
   - **Response:**
     ```json
     {
       "message": "Login successful",
       "token": "string"
     }
     ```

#### Logout

1. **Logout**
   - **Endpoint:** `/user/auth/logout`
   - **Method:** `POST`
   - **Description:** Logs the user out by clearing the authentication token.
   - **Response:**
     ```json
     {
       "message": "Logged out successfully"
     }
     ```

## Middleware

- **API Key Middleware:** Checks for a valid API key in the request headers or query parameters.
- **Error Middleware:** Handles errors and sends appropriate responses to the client.

## Setup

1. Clone the repository.
2. Install dependencies:
   ```sh
   npm install
   nodemon index.js
   ```