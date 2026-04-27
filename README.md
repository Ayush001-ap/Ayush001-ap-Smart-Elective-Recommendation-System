# 🎓 Smart Elective Recommendation System

A full-stack web application that helps students discover and enroll in elective courses based on their interests and academic profile.

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express-4.x-black)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### For Students
- 🔐 Secure authentication (Login/Signup)
- 📊 Personal dashboard with enrolled courses
- 🎯 Interest-based course recommendations
- 📚 Browse and enroll in elective courses
- ⭐ View course details (description, difficulty, prerequisites)

### For Administrators
- 📈 Admin dashboard with analytics
- 👥 Manage students and courses
- 📊 View enrollment statistics
- 🔧 Course management (add/edit/delete)

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | HTML5, CSS3, JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens) |
| **Password Hashing** | bcryptjs |

## 📂 Project Structure

```
Smart-Elective-Recommendation-System/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── recommendationController.js
│   │   └── studentController.js
│   ├── middleware/
│   │   └── auth.js            # JWT authentication
│   ├── models/
│   │   ├── Course.js
│   │   └── Student.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── recommendationRoutes.js
│   │   └── studentRoutes.js
│   ├── package.json
│   ├── seed.js                # Database seeding script
│   └── server.js              # Entry point
├── frontend/
│   ├── admin-dashboard.html
│   ├── courses.html
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   ├── student-dashboard.html
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── admin-dashboard.js
│       ├── api.js
│       ├── auth.js
│       ├── courses.js
│       ├── login.js
│       ├── signup.js
│       ├── student-dashboard.js
│       └── theme.js
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ayush001-ap/Smart-Elective-Recommendation-System.git
   cd Smart-Elective-Recommendation-System
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp backend/.env.example backend/.env
   # Edit .env with your MongoDB URI and JWT secret
   ```

4. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open the frontend**
   - Navigate to `frontend/index.html` in your browser
   - Or use a local server: `npx serve frontend`

### Default Credentials

After running the seed script:
- **Student**: `student@example.com` / `password123`
- **Admin**: `admin@example.com` / `admin123`

## 🔗 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new student |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | Get all courses |
| GET | `/api/courses/:id` | Get course by ID |
| POST | `/api/courses` | Create course (admin) |
| PUT | `/api/courses/:id` | Update course (admin) |
| DELETE | `/api/courses/:id` | Delete course (admin) |

### Students
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | Get all students (admin) |
| GET | `/api/students/:id` | Get student by ID |
| PUT | `/api/students/:id` | Update student |
| POST | `/api/students/enroll` | Enroll in course |

### Recommendations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recommendations` | Get personalized recommendations |

## 🗃 Database Schema

### Student Collection

```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  completedCourses: [ObjectId],
  interests: [String],
  selectedCourses: [ObjectId],
  role: String (default: "student")
}
```

### Course Collection

```javascript
{
  name: String,
  description: String,
  category: String,
  difficultyLevel: String,
  prerequisites: [String],
  recommendationCount: Number
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

⭐ If you find this project helpful, please consider giving it a star!

## Sample Credentials

- Admin
  - Email: admin@example.com
  - Password: admin123
   - Admin Passcode: admin@123

- Students
  - Email: aarav@example.com
  - Password: student123
  - Email: priya@example.com
  - Password: student123

## Login Role Selection

The login page now includes buttons to choose who is logging in:

- Student
- Admin

Admin login requires an extra passcode (`ADMIN_ACCESS_PASSCODE`) in addition to email and password.
