# 🚢 ENTNT Ship Maintenance Dashboard (Frontend Only)

[![Deployed Project](https://img.shields.io/badge/View%20Live-ENTNT%20Dashboard-blue?style=flat-square&logo=github)](https://akshat-ak47.github.io/ENTNT_SHIP_MANAGEMENT)

> **Note:** This is a simulated project created for learning purposes. It is frontend-only and runs entirely on the browser using localStorage.

---

## 📌 Project Overview

The **ENTNT Ship Maintenance Dashboard** is a role-based frontend web application developed using **React**. It simulates a real-world ship maintenance system where users like Admins, Inspectors, and Engineers can manage and monitor ships, components, maintenance jobs, and inspections — all using browser `localStorage` for data persistence.

---

## 🔐 Login Credentials for Testing

You can test the application using these hardcoded credentials. Make sure to select the **correct role** from the UI before logging in.

| Role       | Email                | Password     |
|------------|----------------------|--------------|
| Admin      | admin@entnt.in       | admin123     |
| Inspector  | inspector@entnt.in   | inspect123   |
| Engineer   | engineer@entnt.in    | engine123    |

---

## 👤 User Roles and Access

### 🔑 Login Page
- Choose role: Admin, Inspector, or Engineer
- Enter corresponding email and password
- Role-based UI with specific permissions
- Data stored in `localStorage` (simulated backend)

---

### 🛠️ Admin Dashboard
- View system KPIs (jobs, components, etc.)
- Manage ships: Add/Delete
- Manage components: Add/Delete
- Manage jobs: Add/Delete
- Manage users: Add/Delete
- Notification center: View alerts

---

### 🕵️ Inspector Dashboard
- View inspection KPIs (passed, failed, pending)
- Add/Delete inspections
- View component inspection history
- View/Add/Delete maintenance jobs
- View notifications

---

### 🧑‍🔧 Engineer Dashboard
- View job KPIs (status, defects, completion trends)
- Manage assigned jobs and update status:
  - In Progress, Completed, Issue Found, Delayed, Not Started
- View assigned components
- Calendar for scheduled jobs
- View notifications

---

## 🧰 Technologies Used

- **Frontend**: React (with Functional Components & Hooks)
- **Routing**: React Router
- **State Management**: Context API
- **Styling**: TailwindCSS
- **Charts**: Recharts
- **Persistence**: localStorage (no backend)
- **Deployment**: GitHub Pages

---

## 🚀 Live Demo

You can access the live app here:  
🔗 [https://akshat-ak47.github.io/ENTNT_SHIP_MANAGEMENT](https://akshat-ak47.github.io/ENTNT_SHIP_MANAGEMENT)

---

## 🛠️ Installation & Local Setup

To run this project locally:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Akshat-ak47/ENTNT_SHIP_MANAGEMENT.git
   cd ENTNT_SHIP_MANAGEMENT
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```
The app will run at http://localhost:3000/ by default.

##🤝 Contributing
Contributions are welcome! If you'd like to improve this project:

    1. Fork the repository

    2. Create your feature branch: git checkout -b feature/YourFeature
    ```git checkout -b feature/YourFeature```

    3. Commit your changes: git commit -m 'Add YourFeature'
    ```git push origin feature/YourFeature```

    4. Push to the branch: git push origin feature/YourFeature
    ```git push origin feature/YourFeature```

    5. Open a pull request

