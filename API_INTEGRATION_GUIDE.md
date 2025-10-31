# Backend API Integration Guide

## Overview
Complete integration of Admin Authentication, Forgot Password Flow, and Staff Management with the CareConnect backend.

---

## 🔐 Authentication APIs

### Base URL
```
http://ec2-13-210-204-245.ap-southeast-2.compute.amazonaws.com:3001/api/v1
```

### 1. Login
**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "email": "admin@example.com",  // Can be email or username
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login Successfully",
  "data": {
    "id": 1,
    "role": "admin",  // or "staff"
    "fullname": "John Doe",
    "username": "johndoe",
    "email": "admin@example.com",
    "profile_img": "http://...",
    "status": true,
    "token": "eyJhbGciOiJIUz..."
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Email/Username or Password is incorrect!"
}
```

---

### 2. Forgot Password (Send OTP)
**Endpoint:** `POST /auth/forgot-password`

**Request:**
```json
{
  "email": "admin@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP has been sent. Check your email!",
  "otp": "123456"  // For development/testing only
}
```

---

### 3. Verify OTP
**Endpoint:** `POST /auth/verify-otp`

**Request:**
```json
{
  "email": "admin@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified Successfully"
}
```

---

### 4. Reset Password
**Endpoint:** `POST /auth/reset-password`

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "newPassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password Changed Successfully"
}
```

---

## 👥 Staff Management APIs

**Note:** All staff endpoints require authentication. Include the JWT token in headers:
```
Authorization: Bearer {token}
```

### 1. Create Staff
**Endpoint:** `POST /staff`

**Request:**
```json
{
  "fullname": "Jane Smith",
  "username": "janesmith",
  "email": "jane@example.com",
  "password": "password123",
  "profile_img": "base64_or_url",  // Optional
  "status": 1  // 1 = active, 0 = blocked
}
```

**Response:**
```json
{
  "success": true,
  "message": "Staff created successfully",
  "data": {
    "id": 2,
    "role": "staff",
    "fullname": "Jane Smith",
    "username": "janesmith",
    "email": "jane@example.com",
    "profile_img": null,
    "status": true
  }
}
```

---

### 2. List All Staff
**Endpoint:** `GET /staff`

**Response:**
```json
{
  "success": true,
  "message": "Staff list",
  "data": [
    {
      "id": 2,
      "role": "staff",
      "fullname": "Jane Smith",
      "username": "janesmith",
      "email": "jane@example.com",
      "profile_img": null,
      "status": true
    }
  ]
}
```

---

### 3. Get Staff By ID
**Endpoint:** `GET /staff/:id`

**Response:**
```json
{
  "success": true,
  "message": "Staff details",
  "data": {
    "id": 2,
    "role": "staff",
    "fullname": "Jane Smith",
    "username": "janesmith",
    "email": "jane@example.com",
    "profile_img": null,
    "status": true
  }
}
```

---

### 4. Update Staff
**Endpoint:** `PUT /staff/:id`

**Request:**
```json
{
  "fullname": "Jane Doe",
  "email": "janedoe@example.com",
  "password": "newPassword123",  // Optional
  "status": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Staff updated successfully",
  "data": { /* updated staff object */ }
}
```

---

### 5. Toggle Staff Status
**Endpoint:** `PATCH /staff/:id/toggle-status`

**Response:**
```json
{
  "success": true,
  "message": "Staff activated"  // or "Staff blocked"
}
```

---

### 6. Delete Staff (Soft Delete)
**Endpoint:** `DELETE /staff/:id`

**Response:**
```json
{
  "success": true,
  "message": "Staff deleted successfully"
}
```

---

## 📁 Frontend Integration

### Services Created

#### 1. `src/services/authService.ts`
Handles all authentication-related operations:
- `login()` - User login
- `forgotPassword()` - Send OTP
- `verifyOTP()` - Verify OTP code
- `resetPassword()` - Reset password
- `logout()` - Clear session
- `getToken()` - Get stored token
- `getUserData()` - Get user info
- `isAuthenticated()` - Check auth status
- `isAdmin()` - Check admin role
- `isStaff()` - Check staff role

#### 2. `src/services/staffService.ts`
Handles staff management operations:
- `createStaff()` - Create new staff
- `listStaff()` - Get all staff
- `getStaffById()` - Get staff details
- `updateStaff()` - Update staff info
- `toggleStaffStatus()` - Activate/block staff
- `deleteStaff()` - Soft delete staff

---

### Pages Updated

1. **Login Page** (`src/pages/Login.tsx`)
   - Full API integration
   - Error handling
   - Loading states
   - Success message display from password reset

2. **Forgot Password** (`src/pages/ForgotPassword.tsx`)
   - Send OTP via API
   - Email validation
   - Success/error messages

3. **OTP Verification** (`src/pages/OTPVerification.tsx`)
   - Verify OTP via API
   - Resend OTP functionality
   - 60-second countdown timer

4. **Reset Password** (`src/pages/ResetPassword.tsx`)
   - Reset password via API
   - Password strength validation
   - Success redirect to login

---

## 🔒 Authentication Flow

1. User enters email/username and password
2. Frontend calls `/auth/login`
3. Backend validates credentials
4. On success:
   - Backend returns JWT token + user data
   - Frontend stores token in `localStorage`
   - Frontend stores user data in `localStorage`
   - User redirected to dashboard

5. For subsequent API calls:
   - Frontend includes token in `Authorization` header
   - Backend validates token via middleware
   - Returns requested data or 401 Unauthorized

---

## 🔄 Password Reset Flow

1. User clicks "Forgot Password?" on login page
2. User enters email → Frontend calls `/auth/forgot-password`
3. Backend generates 6-digit OTP, stores in user record
4. User enters OTP → Frontend calls `/auth/verify-otp`
5. Backend validates OTP
6. User enters new password → Frontend calls `/auth/reset-password`
7. Backend updates password (hashed with bcrypt)
8. User redirected to login page

---

## 📊 Staff Management Flow

### Admin Actions:
1. **View Staff List**
   - GET `/staff`
   - Displays all active staff members

2. **Add New Staff**
   - POST `/staff`
   - Creates new staff account

3. **Edit Staff**
   - PUT `/staff/:id`
   - Updates staff information

4. **Block/Activate Staff**
   - PATCH `/staff/:id/toggle-status`
   - Toggles active/blocked status

5. **Delete Staff**
   - DELETE `/staff/:id`
   - Soft deletes staff (sets `isdeleted = 1`)

---

## 🛡️ Role-Based Access Control

### User Roles:
- **admin**: Full access to all features
- **staff**: Limited access (based on permissions)

### Implementation:
```typescript
// Check if user is admin
if (authService.isAdmin()) {
  // Show admin features
}

// Check if user is staff
if (authService.isStaff()) {
  // Show staff features
}
```

---

## 💾 Local Storage

### Stored Data:
1. **auth_token**: JWT token for API authentication
2. **user_data**: User information (id, role, email, etc.)

### Access:
```typescript
// Get token
const token = authService.getToken();

// Get user data
const user = authService.getUserData();
```

---

## 🚨 Error Handling

All API calls include try-catch blocks with:
- User-friendly error messages
- Toast notifications
- Error state management
- Loading states

Example:
```typescript
try {
  const response = await authService.login(credentials);
  // Handle success
} catch (error) {
  setError(error.message);
  toast({ title: "Error", description: error.message });
}
```

---

## ✅ Security Features

1. **Password Hashing**: bcrypt with salt rounds = 10
2. **JWT Authentication**: Secure token-based auth
3. **OTP Expiration**: OTP cleared after verification
4. **Soft Deletes**: Staff marked as deleted, not removed
5. **Status Checks**: Blocked/deleted users can't login
6. **Email Validation**: Frontend + backend validation
7. **Password Strength**: Min 8 chars, uppercase, lowercase, numbers

---

## 🧪 Testing

### Test Credentials:
Check your backend seeders or create test accounts via API.

### Development:
- OTP is returned in API response for testing
- Check console for API responses
- Use browser DevTools → Network tab to inspect requests

---

## 📝 Next Steps

1. ✅ Authentication integration complete
2. ✅ Forgot password flow complete
3. ✅ Staff management APIs integrated
4. 🔲 Update Team.tsx to use staffService
5. 🔲 Add protected routes based on roles
6. 🔲 Implement refresh token logic (if needed)
7. 🔲 Add file upload for profile images
8. 🔲 Implement email sending for OTP (currently returns OTP in response)

---

## 🆘 Troubleshooting

### Issue: 401 Unauthorized
- Check if token is stored: `localStorage.getItem('auth_token')`
- Verify token in request headers
- Check token expiration

### Issue: CORS Error
- Verify backend CORS configuration
- Check if BASE_URL is correct in `.env`

### Issue: OTP Not Working
- Check email field matches exactly
- Verify OTP is 6 digits
- Check backend logs for errors

---

## 📞 Support

For backend issues, check:
- `E:\Care Connect - Compliance Portal\care-connect-compliance-portal-backend\src\controllers\authController.js`
- `E:\Care Connect - Compliance Portal\care-connect-compliance-portal-backend\src\controllers\staffController.js`

For frontend issues, check:
- `src/services/authService.ts`
- `src/services/staffService.ts`

