# Zustand Integration - Complete Explanation

## Overview
Your project now uses **Zustand** for state management across all components. This replaces local `useState` calls with centralized, persistent stores that are shared across your entire app.

---

## 📦 Created Stores

### 1. **authStore.js** - Authentication State Management
**Location:** `src/stores/authStore.js`

**What it manages:**
- `user` - Current logged-in user object
- `token` - Auth token
- `isAuthenticated` - Boolean flag
- `isLoading` - Loading state during auth operations

**Key Methods:**
- `initializeAuth()` - Check token and restore session on app start
- `login(email, password)` - Handle user login
- `logout()` - Clear auth state
- `setUser(user)` - Update user data
- `getUser()` - Retrieve current user

**Usage Example:**
```javascript
import { useAuthStore } from "../src/stores";

export default function MyComponent() {
  const { user, logout, isAuthenticated } = useAuthStore();
  
  return <Text>{user?.email}</Text>;
}
```

---

### 2. **readingsStore.js** - Readings & Stats State
**Location:** `src/stores/readingsStore.js`

**What it manages:**
- `readings` - Array of blood pressure readings
- `stats` - Statistics (latest readings, averages, etc.)
- `isLoading` - Loading state
- `error` - Error messages

**Key Methods:**
- `setReadings(readings)` - Save readings array
- `setStats(stats)` - Save statistics
- `addReading(reading)` - Add new reading to store
- `clearReadings()` - Reset all readings
- `getReadings()` - Retrieve readings
- `getStats()` - Retrieve stats

**Usage Example:**
```javascript
import { useReadingsStore } from "../src/stores";

export default function HistoryScreen() {
  const { readings, setReadings } = useReadingsStore();
  
  useEffect(() => {
    // Fetch and save
    const data = await fetchReadings();
    setReadings(data);
  }, [setReadings]);
  
  return <FlatList data={readings} />;
}
```

---

### 3. **uiStore.js** - UI State Management
**Location:** `src/stores/uiStore.js`

**What it manages:**
- `activeTab` - Currently active navigation tab
- `theme` - App theme (light/dark)
- `isModalOpen` - Modal visibility state
- `modalContent` - Modal content

**Key Methods:**
- `setActiveTab(tab)` - Change active tab
- `setTheme(theme)` - Change theme
- `openModal(content)` - Show modal
- `closeModal()` - Hide modal
- `toggleModal(isOpen, content)` - Toggle modal state

---

## 🔄 Updated Components

### **app/login.js**
**What Changed:**
- ✅ Now uses `useAuthStore().login()` instead of calling `authService` directly
- ✅ Zustand's `isLoading` state shows "Logging in..." button text
- ✅ Auth state automatically persisted and available app-wide

**Explanation:**
```javascript
// Before: Direct service call
await authService.login(email, password);

// After: Zustand store (synced with store)
const { login, isLoading } = useAuthStore();
await login(email, password);
// User data now in global store!
```

---

### **app/register.js**
**What Changed:**
- ✅ Updated to use `axios` instead of `fetch`
- ✅ Uses Railway/dev URLs properly configured

**Why Axios:**
- Cleaner API than fetch (no need for `.json()`)
- Automatic JSON serialization
- Better error handling
- Works with interceptors

---

### **app/index.js (Dashboard)**
**What Changed:**
- ✅ Gets `user` from `useAuthStore()` instead of React Query
- ✅ Saves stats to `useReadingsStore()`
- ✅ More efficient - user stays in store after login

**Flow:**
1. User logs in → saved to auth store
2. Stats fetched and saved to readings store
3. Dashboard uses store values directly
4. Stats persist even if component unmounts

---

### **app/add-reading.js**
**What Changed:**
- ✅ Uses `useReadingsStore().addReading()` to update store
- ✅ New readings instantly available to other components
- ✅ Loading state managed locally

**Real-time Sync:**
```javascript
const { addReading } = useReadingsStore();

// After successful save:
addReading(newReading); // Updates store
// History component instantly sees new reading!
```

---

### **app/history.js**
**What Changed:**
- ✅ Gets readings from `useReadingsStore()`
- ✅ No local `useState` - uses global store
- ✅ Data persists when navigating away

**Before vs After:**
```javascript
// Before: Lost data when component unmounts
const [readings, setReadings] = useState([]);

// After: Data persists in Zustand
const { readings, setReadings } = useReadingsStore();
```

---

### **app/trends.js**
**What Changed:**
- ✅ Falls back to stored readings if API fails
- ✅ Readings from store combined with fresh data

**Smart Caching:**
```javascript
const { readings: storedReadings } = useReadingsStore();
const readings = data || storedReadings;
// Uses fresh data when available, cached data as fallback
```

---

### **app/profile.js**
**What Changed:**
- ✅ Uses `setUser()` after profile update to sync auth store
- ✅ Changed from `body: JSON.stringify()` to `data:` for axios

**Data Flow:**
```javascript
const { setUser } = useAuthStore();

mutation.mutate(newData);
// On success:
setUser(updatedProfile); // Updates auth store
// Dashboard now shows updated user info!
```

---

## 🎯 Key Benefits

| Feature | Before | After |
|---------|--------|-------|
| **State Management** | Local useState in each component | Centralized Zustand store |
| **Data Persistence** | Lost on component unmount | Persists across navigation |
| **Code Duplication** | Multiple useState for same data | Single store, many components |
| **Performance** | Unnecessary re-renders | Optimized subscriptions |
| **Debugging** | Hard to track state changes | Clear store state flow |
| **Testing** | Components tightly coupled | Easy to test in isolation |

---

## 🚀 Usage Pattern

### Import stores:
```javascript
import { useAuthStore, useReadingsStore, useUIStore } from "../src/stores";
```

### Use in components:
```javascript
export default function MyComponent() {
  // Get what you need
  const { user, logout } = useAuthStore();
  const { readings, addReading } = useReadingsStore();
  const { activeTab, setActiveTab } = useUIStore();
  
  // Use like normal state
  return <Text>{user?.name}</Text>;
}
```

### Update state:
```javascript
// All updates are instant and reactive
addReading(newData);
logout();
setActiveTab("history");
```

---

## 📱 Architecture Summary

```
┌─────────────────────────────────────────┐
│         Global Zustand Stores           │
│  ┌──────────────────────────────────┐   │
│  │     authStore (user, token)      │   │
│  │  readingsStore (readings, stats) │   │
│  │    uiStore (tabs, modals, etc)   │   │
│  └──────────────────────────────────┘   │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
    ┌───▼──┐  ┌───▼──┐  ┌───▼──┐
    │Login │  │History│  │Add   │
    │      │  │       │  │Read  │
    └──────┘  └───────┘  └──────┘
    
All components read/write to same stores!
```

---

## ✅ Next Steps

1. **Test the flow:**
   - Login → Check user is saved to store
   - Add reading → Check it appears in History
   - Navigate around → Data persists

2. **Optional: Initialize auth on app start**
   - Add `useAuthStore().initializeAuth()` in your root layout

3. **Add more stores as needed:**
   - Settings store
   - Notifications store
   - Cache store

---

## 📚 Files Updated

| File | Changes |
|------|---------|
| [app/login.js](app/login.js) | Uses useAuthStore |
| [app/register.js](app/register.js) | Uses axios |
| [app/index.js](app/index.js) | Uses authStore + readingsStore |
| [app/add-reading.js](app/add-reading.js) | Uses readingsStore.addReading |
| [app/history.js](app/history.js) | Uses readingsStore |
| [app/trends.js](app/trends.js) | Uses readingsStore |
| [app/profile.js](app/profile.js) | Uses setUser on update |
| [src/stores/authStore.js](src/stores/authStore.js) | NEW |
| [src/stores/readingsStore.js](src/stores/readingsStore.js) | NEW |
| [src/stores/uiStore.js](src/stores/uiStore.js) | NEW |
| [src/stores/index.js](src/stores/index.js) | NEW |

---

## 🐛 Debugging Tips

### Check store state in console:
```javascript
import { useAuthStore } from "../src/stores";

useAuthStore.subscribe(state => {
  console.log("Auth state changed:", state);
});
```

### React DevTools:
- Install React Native DevTools to inspect Zustand stores in real-time

---

**You're all set! Your app now has professional state management with Zustand.** 🎉
