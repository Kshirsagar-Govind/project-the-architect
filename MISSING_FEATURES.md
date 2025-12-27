# Missing Frontend Features Analysis

This document lists all backend features that exist but are **NOT yet implemented in the frontend**.

## 🔴 Critical Missing Features

### 1. **Activity Logs** ❌
- **Backend Status**: ✅ Fully implemented
  - Model: `activityLog.model.ts`
  - Middleware: `activityLog.middleware.ts` (logs all API requests)
- **Frontend Status**: ❌ Not implemented
- **Required Actions**:
  - Create API endpoint/route for fetching activity logs (GET `/api/activity-logs`)
  - Create Activity Logs page (`/pages/ActivityLog/list.activityLog.tsx`)
  - Display logs with filtering by:
    - User email
    - Date range
    - HTTP method
    - URL pattern
  - **Access**: Admin only (recommended)

---

### 2. **Notifications System** ❌
- **Backend Status**: ⚠️ Partially implemented
  - Controller: `notification.controller.ts` exists
  - Model: `notification.model.ts` exists
  - Functions: `sendNotification`, `broadcastNotification`, `seenNotification`
  - **Issue**: No routes registered in `app.ts`
- **Frontend Status**: ❌ Not implemented
- **Required Actions**:
  - **Backend**: Register notification routes in `app.ts`
    ```typescript
    // Add to app.ts
    import notificationRoutes from './routes/notification.routes';
    app.use('/api/notification', notificationRoutes);
    ```
  - **Backend**: Create `routes/notification.routes.ts`
  - **Frontend**: Create notification components:
    - Notification bell icon with badge count
    - Notification dropdown/list
    - Notification detail page
    - Mark as read functionality
  - **Access**: All authenticated users

---

### 3. **Refresh Token Implementation** ❌
- **Backend Status**: ✅ Fully implemented
  - Route: `POST /api/auth/refresh-token`
  - Controller: `refreshToken` in `auth.controller.ts`
  - Test: `auth.test.ts` includes refresh token test
- **Frontend Status**: ❌ Not implemented
- **Required Actions**:
  - Implement token refresh logic in axios interceptor
  - Store refresh token in localStorage/sessionStorage
  - Auto-refresh token before expiration
  - Handle token refresh on 401 errors
- **File to Update**: `src/api/axios.ts`

---

### 4. **File Upload Functionality** ❌
- **Backend Status**: ✅ Partially implemented
  - Route: `POST /api/auth/file-upload` (mentioned in routes)
  - Controller: `fileUpload` in `auth.controller.ts`
- **Frontend Status**: ❌ Not implemented
- **Required Actions**:
  - Project file upload (appFile in project model)
  - Vulnerability proof-of-concept file upload
  - Create file upload component
  - Display uploaded files in project/vulnerability views
- **Note**: Project model has `appFile` field that needs UI

---

### 5. **Reports/Export Functionality** ❌ (User Mentioned)
- **Backend Status**: ⚠️ Not explicitly found
  - No dedicated report controller/route
  - Could use existing endpoints with filters
- **Frontend Status**: ❌ Not implemented
- **Required Actions**:
  - Create Reports page (`/pages/Report/list.report.tsx`)
  - Export functionality for:
    - Vulnerability reports (PDF/CSV/Excel)
    - Project reports
    - Client reports
    - Activity logs export
  - Filtering and date range selection
  - **Access**: Admin, Manager (recommended)

---

### 6. **Credits Management** ❌
- **Backend Status**: ⚠️ Controller exists but empty
  - Controller: `credit.controller.ts` (empty file)
  - Model: `credits.model.ts` exists
- **Frontend Status**: ❌ Not implemented
- **Required Actions**:
  - **Backend**: Implement credit management endpoints
  - **Frontend**: Create Credits pages:
    - List credits
    - Purchase credits
    - Credit history
  - Display credits in client dashboard
  - **Access**: Admin, Client

---

## 🟡 Partially Implemented / Needs Enhancement

### 7. **Client Login** ⚠️
- **Backend Status**: ✅ Fully implemented
  - Route: `POST /api/client/login`
  - Test: `client.test.ts` includes login test
- **Frontend Status**: ✅ Implemented but may need verification
  - File: `LoginClient.tsx` exists
- **Action Needed**: Verify if LoginClient.tsx properly uses the `/api/client/login` endpoint

---

### 8. **Password Reset Flow** ⚠️
- **Backend Status**: ✅ Fully implemented
  - Routes: `/api/auth/forget-password`, `/api/auth/reset-password`
- **Frontend Status**: ✅ Implemented
  - Files: `ForgetPassword.tsx`, `ResetPassword.tsx`
- **Action Needed**: Verify complete flow works end-to-end

---

## 📋 Summary Table

| Feature | Backend Status | Frontend Status | Priority | Estimated Effort |
|---------|---------------|-----------------|----------|------------------|
| Activity Logs | ✅ Complete | ❌ Missing | High | Medium |
| Notifications | ⚠️ Partial (no routes) | ❌ Missing | High | High |
| Refresh Token | ✅ Complete | ❌ Missing | Medium | Low |
| File Upload | ⚠️ Partial | ❌ Missing | High | Medium |
| Reports/Export | ❌ Not found | ❌ Missing | High | High |
| Credits | ⚠️ Partial (empty) | ❌ Missing | Medium | High |
| Client Login | ✅ Complete | ✅ Done | Low | - |
| Password Reset | ✅ Complete | ✅ Done | Low | - |

---

## 🎯 Recommended Implementation Order

1. **Refresh Token** (Low effort, high impact for UX)
2. **File Upload** (High priority for project/vulnerability functionality)
3. **Activity Logs** (Admin visibility, security audit)
4. **Notifications** (Requires backend routes first, then frontend)
5. **Reports/Export** (Business value, analytics)
6. **Credits** (Requires backend implementation first)

---

## 📝 Notes

- All test cases in `Backend/the-architect/test/controller/` have corresponding backend implementations
- Some features (like notifications) need backend routes registered before frontend work
- Reports functionality may need to be built using existing API endpoints with proper filtering

---

## 🔍 Files to Check

**Backend Controllers to Review:**
- `app/controller/notification.controller.ts` - Has functions but no routes
- `app/controller/credit.controller.ts` - Empty, needs implementation
- `app/controller/auth.controller.ts` - Has `fileUpload` function

**Backend Routes Missing:**
- Notification routes need to be created and registered
- Activity log routes need to be created (if frontend access needed)

**Frontend Pages to Create:**
- `/pages/ActivityLog/list.activityLog.tsx`
- `/pages/Notification/list.notification.tsx`
- `/pages/Report/list.report.tsx`
- `/pages/Credits/list.credits.tsx` (after backend implementation)

