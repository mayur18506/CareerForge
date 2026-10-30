# CareerForge – Career & Skill Management Platform

CareerForge is a full-stack web application designed to help users manage their professional growth in one place. It allows users to track technical skills, set learning goals, manage projects, monitor job applications, and view their career progress through a personalized dashboard.

## 🚀 Features

* **User Authentication:** Secure registration and login using JWT authentication.
* **Dashboard:** View an overview of skills, learning goals, projects, and job applications.
* **Skill Management:** Add, update, and track skills with proficiency levels and progress.
* **Learning Goals:** Create learning goals, set target dates, and monitor progress.
* **Project Management:** Maintain a record of projects and their technologies.
* **Job Application Tracking:** Track companies, job roles, application statuses, and interview details.
* **Password Recovery:** Forgot-password and reset-password functionality.

## 🛠️ Technology Stack

### Backend

* C#
* ASP.NET Core Web API
* Entity Framework Core
* SQL Server
* JWT Authentication
* RESTful APIs

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3

### Development Tools

* Visual Studio
* Visual Studio Code
* SQL Server
* Git & GitHub
* Postman

## 📁 Project Structure

```text
CareerForge/
│
├── CareerForge.API/
│   ├── CareerForge.API/
│   │   ├── Controllers/
│   │   ├── Data/
│   │   ├── DTOs/
│   │   ├── Migrations/
│   │   ├── Models/
│   │   ├── Services/
│   │   ├── Program.cs
│   │   └── appsettings.json
│   └── CareerForge.API.slnx
│
├── careerforge-client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

Install the following tools before running the project:

* .NET SDK compatible with the backend project
* SQL Server
* Node.js and npm
* Visual Studio or Visual Studio Code

### 1. Clone the Repository

```bash
git clone https://github.com/mayur18506/CareerForge.git
cd CareerForge
```

### 2. Configure the Database

1. Open the backend solution:
   `CareerForge.API/CareerForge.API.slnx`
2. Configure your SQL Server connection string in `appsettings.json`.
3. Apply Entity Framework Core migrations using the Package Manager Console:

```powershell
Update-Database
```

### 3. Configure Application Secrets

Configure your JWT signing key using .NET User Secrets. Do not commit real secrets or passwords to GitHub.

```bash
dotnet user-secrets set "Jwt:Key" "YOUR_LONG_RANDOM_SECRET_KEY"
```

Configure email settings through User Secrets if you want to use the password recovery email functionality.

### 4. Run the Backend

Open the solution in Visual Studio and run the `CareerForge.API` project.

### 5. Run the Frontend

Open a terminal inside the frontend folder:

```bash
cd careerforge-client
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

## 📸 Screenshots

Screenshots of the application will be added here.

## 🔮 Future Improvements

* Responsive UI improvements
* Deployment to a cloud hosting platform
* Additional career analytics
* Enhanced user experience

## 👨‍💻 Developer

**Mayur Piprewar**

* GitHub: [mayur18506](https://github.com/mayur18506)
* LinkedIn: [Mayur Piprewar](https://www.linkedin.com/in/mayur-piprewar-310251291/)

---

⭐ If you find this project useful, consider giving it a star!
