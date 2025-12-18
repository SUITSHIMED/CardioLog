# 🫀 CardioLog — Cardiac Health Tracker

A full-stack mobile application for tracking, analyzing, and managing blood pressure readings — built with React Native (Expo) and Node.js/Express.

---

## Overview

### Concept
**CardioLog** is a high-performance mobile blood pressure tracking app that replaces error-prone paper logs with a secure, cloud-synced digital diary featuring real-time data sync, visual trend analysis, and exportable reports.

### Problem Solved
Hypertension management requires **consistent, accurate logging**. CardioLog eliminates manual tracking by offering:
- Automatic categorization of blood pressure readings
- Historical data visualization
- PDF/CSV export for medical consultations

---

## Tech Stack

### Frontend (React Native + Expo)
- **Navigation**: Expo Router (file-based)
- **State Management**: 
  - `Zustand` (UI state)
  - `React Query` (server data fetching & caching)
- **Storage**: `AsyncStorage` (tokens, settings)
- **Animations**: `React Native Reanimated`
- **UI**: Optimized `FlatList` with pagination
- **Charts**: `react-native-chart-kit` + `react-native-svg`
- **Language**: **JavaScript (ES6+)** — no TypeScript

### Backend (Node.js + Express)
- **Runtime**: Node.js with ES Modules (`"type": "module"`)
- **Architecture**: MVC (Models, Views, Controllers)
- **ORM**: Sequelize (PostgreSQL)
- **Auth**: JWT + Bcrypt (password hashing)
- **Database**: PostgreSQL (hosted locally or on Supabase)
- **Tools**: DBeaver (schema design & migrations)

---

## App Screens (7)

| Screen | Purpose |
|-------|--------|
| **1. Splash & Auth** | Login / Signup via JWT |
| **2. Dashboard (Home)** | Summary stats (latest reading, weekly average) |
| **3. Add Measurement** | Form to log systolic, diastolic, pulse, and note |
| **4. History Log** | Scrollable list of readings (with pull-to-refresh) |
| **5. Trend Analysis** | Charts showing daily/weekly BP trends |
| **6. Medical Profile** | Edit age, weight, blood type |
| **7. Settings & Export** | App preferences + generate PDF/CSV report |

---

## Database Schema (PostgreSQL)

### Models (Sequelize)

```js
User {
  id: UUID (PK)
  email: string (unique)
  password: string (hashed)
  createdAt, updatedAt
}

Profile {
  userId: UUID (FK → User.id, unique)
  age: integer
  weight: float
  bloodType: string
}

Reading {
  id: UUID (PK)
  userId: UUID (FK → User.id)
  systolic: integer
  diastolic: integer
  pulse: integer
  category: string  // "Normal", "Hypertension Stage 1"
  note: string
  createdAt: Date
}