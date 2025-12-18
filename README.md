Project Specifications - CardioLog (Cardiac Health Tracker)
1. Project Overview
1.1. Concept
"CardioLog" is a high-performance mobile blood pressure tracking application. It utilizes a modern full-stack architecture to provide users with secure data persistence, real-time synchronization, and advanced cardiac trend analysis.
1.2. Problem Statement
Hypertension management requires consistent data logging. CardioLog replaces unreliable paper logs with a cloud-synced, visual, and exportable digital diary.
1.3. Educational Objectives (Final Project)
•	Frontend: Implementation of Expo Router (File-based navigation), React Query (Server state), Zustand (Global state), and Reanimated (Smooth UI transitions).
•	Backend: Developing a RESTful API using Node.js and Express.js following the MVC (Model-View-Controller) pattern, utilizing ES Modules (import/export).
•	Database Management: Designing a relational schema in PostgreSQL, managed via Sequelize ORM and DBeaver.
2. Technical Stack (Full-Stack)
2.1. Frontend
•	Framework: React Native with Expo Router.
•	State Management: Zustand (Local UI state) and React Query (Server data fetching/caching).
•	Storage: AsyncStorage (for local settings/tokens).
•	Animations: React Native Reanimated for premium user experience.
•	UI Components: FlatList with optimized pagination for historical data.
•	Visualization: react-native-chart-kit (Frontend rendering) fed by aggregated backend data.
2.2. Backend (The API)
•	Environment: Node.js (configured with "type": "module" in package.json).
•	Framework: Express.js.
•	Architecture: MVC Pattern (Models for DB logic, Controllers for request handling, Routes for endpoints).
•	ORM: Sequelize. Used for defining models, handling associations, and performing database migrations/queries in a structured, object-oriented way.
•	Database: PostgreSQL (Relational data for users and readings).
•	Deployment/Hosting: Supabase (PostgreSQL hosting) or Firebase (for Auth/Storage).
3. Screen Structure (7 Screens)
S1. Splash & Auth Screen
Entry point using Expo Router's root layout. Handles login/signup via the Express Auth controller.
S2. Main Dashboard (Home)
The "Heart" of the app. Displays summary statistics fetched via React Query from the /api/readings/summary endpoint.
S3. Add Measurement Screen
A clean form using controlled components. Submits data to the backend via a POST request.
S4. History Log Screen
An optimized FlatList with pagination to handle large datasets of readings. Supports "Pull to Refresh" via React Query.
S5. Trend Analysis & Charts
Frontend renders charts based on pre-aggregated data from the backend (e.g., averages grouped by day).
S6. Medical Profile
User metadata storage (Age, Weight, Blood Type). Updates the /api/user/profile table via Sequelize.
S7. Settings & Export
Local configurations (AsyncStorage) and a trigger for the backend to generate a CSV/PDF report.
4. Backend Logic & Database Schema
4.1. MVC Structure
•	models/: Defines Sequelize schemas and associations for User, Profile, and Reading.
•	controllers/: Logic for calculating BP categories and weekly averages.
•	routes/: API endpoints using Express Router and ES Module imports.
4.2. Database Tables (Sequelize Models)
•	User Model: id (UUID), email, password, createdAt, updatedAt
•	Profile Model: userId (FK), age, weight, bloodType
•	Reading Model: id (UUID), userId (FK), systolic, diastolic, pulse, category, note, createdAt
5. Design & Visual Identity
•	Primary Color: #0D9488 (Teal).
•	Secondary: #0F172A (Slate Dark).
•	Visuals: Reanimated transitions between screens for a high-end feel.
