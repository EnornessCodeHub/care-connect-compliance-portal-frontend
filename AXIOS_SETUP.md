# Axios API Integration Guide

## Overview

The application now uses **Axios** instead of `fetch` for all API calls. This provides:

✅ **Automatic JSON parsing**  
✅ **Request/Response interceptors**  
✅ **Automatic 401 logout**  
✅ **Better error handling**  
✅ **TypeScript type safety**  
✅ **Cleaner, more readable code**

---

## 📁 File Structure

```
src/
├── lib/
│   └── axios.ts                    # Centralized axios instance with interceptors
├── services/
│   ├── authService.ts              # Authentication service (using axios)
│   ├── staffService.ts             # Staff CRUD operations (using axios)
│   └── example.service.ts          # Template for new services
```

---

## 🔧 Configuration

### `src/lib/axios.ts`

This file contains the centralized axios configuration:

```typescript
import axios from 'axios';
import authService from '@/services/authService';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,  // From .env file
  timeout: 30000,                           // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Request Interceptor

Automatically adds authentication token to all requests:

```typescript
api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token && config.headers) {
    config.headers['x-access-token'] = token;
  }
  return config;
});
```

### Response Interceptor

Automatically handles 401 errors and logs out the user:

```typescript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authService.logout();
      window.location.href = '/login';
      return Promise.reject(new Error('Session expired. Please login again.'));
    }
    return Promise.reject(error);
  }
);
```

---

## 🚀 Usage Examples

### 1. Simple GET Request

```typescript
import api from '@/lib/axios';

async function getStaffList() {
  const response = await api.get<StaffListResponse>('/staff');
  return response.data;
}
```

### 2. POST Request with Data

```typescript
async function createStaff(data: CreateStaffRequest) {
  const response = await api.post<StaffResponse>('/staff', data);
  return response.data;
}
```

### 3. PUT Request (Update)

```typescript
async function updateStaff(id: number, data: UpdateStaffRequest) {
  const response = await api.put<StaffResponse>(`/staff/${id}`, data);
  return response.data;
}
```

### 4. DELETE Request

```typescript
async function deleteStaff(id: number) {
  const response = await api.delete<{ success: boolean; message: string }>(`/staff/${id}`);
  return response.data;
}
```

### 5. GET with Query Parameters

```typescript
async function searchStaff(query: string, page: number = 1) {
  const response = await api.get<StaffListResponse>('/staff/search', {
    params: { query, page, limit: 10 }
  });
  return response.data;
}
```

### 6. File Upload

```typescript
async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post<UploadResponse>('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
}
```

### 7. Custom Timeout

```typescript
async function slowOperation(data: any) {
  const response = await api.post('/endpoint', data, {
    timeout: 60000 // 60 seconds
  });
  return response.data;
}
```

### 8. Custom Headers

```typescript
async function customRequest(data: any) {
  const response = await api.post('/endpoint', data, {
    headers: {
      'X-Custom-Header': 'custom-value',
      'X-Request-ID': generateRequestId(),
    }
  });
  return response.data;
}
```

---

## 🎯 Creating a New Service

Use the template in `src/services/example.service.ts`:

```typescript
import api from '@/lib/axios';

interface YourData {
  id: number;
  name: string;
}

interface YourResponse {
  success: boolean;
  message: string;
  data?: YourData;
}

class YourService {
  async getAll(): Promise<YourResponse> {
    const response = await api.get<YourResponse>('/your-endpoint');
    return response.data;
  }

  async create(data: Partial<YourData>): Promise<YourResponse> {
    const response = await api.post<YourResponse>('/your-endpoint', data);
    return response.data;
  }

  async update(id: number, data: Partial<YourData>): Promise<YourResponse> {
    const response = await api.put<YourResponse>(`/your-endpoint/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<YourResponse> {
    const response = await api.delete<YourResponse>(`/your-endpoint/${id}`);
    return response.data;
  }
}

export default new YourService();
```

---

## 🔐 Authentication Flow

### 1. Login
```typescript
// User logs in
const response = await authService.login({ email, password });
// Token is automatically stored in localStorage
```

### 2. Authenticated Requests
```typescript
// All subsequent requests automatically include the token
const staff = await staffService.listStaff();
// Token is added via request interceptor
```

### 3. Session Expiry
```typescript
// If API returns 401:
// 1. Response interceptor catches it
// 2. authService.logout() is called
// 3. User is redirected to /login
// 4. Error message is shown
```

### 4. Manual Logout
```typescript
// User clicks logout
authService.logout();  // Clears localStorage
navigate('/login');    // Redirects to login
```

---

## ⚠️ Error Handling

### In Components

```typescript
try {
  const staff = await staffService.listStaff();
  // Success handling
} catch (error: any) {
  // 401 errors are already handled by interceptor
  // This catch block handles other errors
  toast({
    variant: "destructive",
    title: "Error",
    description: error.message || "An error occurred"
  });
}
```

### Error Types Handled

1. **401 Unauthorized** → Auto logout + redirect
2. **Network errors** → "No response from server"
3. **Timeout errors** → "Request timed out"
4. **Server errors (500)** → Error message from server
5. **Client errors (400)** → Validation error messages

---

## 🔧 Configuration Options

### Timeout

```typescript
// Default: 30 seconds
// Override per request:
const response = await api.post('/endpoint', data, {
  timeout: 60000 // 60 seconds
});
```

### Base URL

Set in `.env` file:
```env
VITE_BASE_URL="http://localhost:3001/api/v1"
```

### Headers

```typescript
// Global headers (set in axios.ts)
headers: {
  'Content-Type': 'application/json',
}

// Per-request headers
const response = await api.post('/endpoint', data, {
  headers: {
    'X-Custom': 'value'
  }
});
```

---

## 📊 Benefits Over Fetch

| Feature | Fetch | Axios |
|---------|-------|-------|
| JSON parsing | Manual | Automatic |
| Request/Response interceptors | ❌ | ✅ |
| Timeout support | Complex | Built-in |
| Auto logout on 401 | Manual | Automatic |
| TypeScript support | Basic | Excellent |
| Error handling | Manual | Built-in |
| Progress tracking | Complex | Built-in |
| Cancel requests | Complex | Built-in |

---

## 🎓 Best Practices

1. **Always use TypeScript types**
   ```typescript
   const response = await api.get<StaffListResponse>('/staff');
   ```

2. **Handle errors in components**
   ```typescript
   try {
     const data = await service.getData();
   } catch (error) {
     // Handle error
   }
   ```

3. **Use the centralized api instance**
   ```typescript
   import api from '@/lib/axios';  // ✅ Do this
   import axios from 'axios';      // ❌ Don't do this
   ```

4. **Let interceptors handle auth**
   ```typescript
   // ✅ Token added automatically
   await api.get('/staff');
   
   // ❌ Don't add token manually
   await api.get('/staff', {
     headers: { 'x-access-token': token }
   });
   ```

5. **Create service classes**
   - Keep API logic in service files
   - Export a singleton instance
   - Use clear method names

---

## 🐛 Troubleshooting

### Issue: 401 errors not triggering logout

**Solution:** Make sure you're using the centralized `api` instance from `@/lib/axios`, not a raw axios import.

### Issue: Token not being sent

**Solution:** Check that the token is stored in localStorage with key `auth_token`.

### Issue: CORS errors

**Solution:** Check backend CORS configuration. The backend must allow the `x-access-token` header.

### Issue: TypeScript errors

**Solution:** Ensure response interfaces match your backend API structure.

---

## 📚 Further Reading

- [Axios Documentation](https://axios-http.com/docs/intro)
- [Axios Interceptors](https://axios-http.com/docs/interceptors)
- [Handling Errors](https://axios-http.com/docs/handling_errors)

---

## ✨ Summary

With Axios, you get:
- ✅ Cleaner code (less boilerplate)
- ✅ Better error handling
- ✅ Automatic authentication
- ✅ Type safety
- ✅ Auto logout on session expiry
- ✅ Easy to extend and maintain

