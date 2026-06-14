# CRM Lead Management System 🚀

A full-stack **Customer Relationship Management (CRM)** application designed to manage website-generated client leads. The system allows administrators to track leads, update their status, add follow-up notes, and manage the complete lead lifecycle.

## 📌 Project Overview

Businesses receive multiple customer inquiries through website contact forms. Managing these leads manually can be difficult.

This CRM system provides a centralized platform to:

* Store client leads
* Track lead status
* Add notes and follow-ups
* Manage customer conversion workflow


---

## 🛠️ Tech Stack

### Frontend

* React.js
* HTML5
* CSS3
* JavaScript
* Axios

### Backend

* Node.js
* Express.js
* REST API

### Database

* MySQL

---

## ✨ Features

### 🔹 Lead Management

* View all client leads
* Add new leads
* Update lead information
* Delete leads

### 🔹 Lead Status Tracking

Manage lead progress using:

* 🆕 New
* 📞 Contacted
* ✅ Converted

### 🔹 Notes & Follow-ups

* Add important customer notes
* Track communication history
* Maintain follow-up information

### 🔹 Admin Authentication

* Secure admin login
* Protected API routes
* Token-based authorization

---

## 📂 Project Structure

```
CRM/
│
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── server.js
│   ├── package.json
│
├── database/
│   └── schema.sql
│
└── README.md
```

---

# ⚙️ Installation & Setup

## 1. Clone Repository

```bash
git clone https://github.com/HarshitSingh2024-byte/FUTURE_FS_02.git
```

Go inside the project:

```bash
cd FUTURE_FS_02
```

---

# 🗄️ Database Setup (MySQL)

Open MySQL Workbench or MySQL Command Line.

Create database:

```sql
CREATE DATABASE crm;
```

Select database:

```sql
USE crm;
```

Run the SQL file:

```
database/schema.sql
```

This will create the required tables.

---

# 🔧 Backend Setup

Go to backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Configure MySQL connection inside:

```
backend/server.js
```

Update:

```javascript
host: "localhost",
user: "root",
password: "YOUR_PASSWORD",
database: "crm"
```

Start backend:

```bash
npm start
```

Backend runs on:

```
http://localhost:5000
```

---

# 🎨 Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start React application:

```bash
npm start
```

Frontend runs on:

```
http://localhost:3000
```

---

# 🔐 Admin Login

Default credentials:

```
Username: atom
Password: 1234
```

(Admin credentials can be changed using environment variables.)

---

# 🔌 API Endpoints

## Authentication

### Login

```
POST /auth/login
```

---

## Leads

### Get all leads

```
GET /leads
```

### Create lead

```
POST /leads
```

### Update lead

```
PUT /leads/:id
```

### Delete lead

```
DELETE /leads/:id
```

---

# 📸 Application Screenshots

(Add screenshots of your dashboard here)

Example:

```
screenshots/
 ├── login.png
 ├── dashboard.png
 └── leads.png
```

---

# 🎯 Learning Outcomes

Through this project, I learned:

* Building REST APIs
* CRUD operations
* React frontend integration
* Backend development using Express
* MySQL database management
* Authentication and authorization
* Connecting frontend with backend services

---

# 🚀 Future Improvements

Possible enhancements:

* Advanced search and filtering
* Email notifications
* Lead analytics dashboard
* Role-based access control
* Deployment using cloud services

---

# 👨‍💻 Author

**Harshit Singh**

GitHub:
https://github.com/HarshitSingh2024-byte

---

⭐ If you like this project, consider giving it a star!
