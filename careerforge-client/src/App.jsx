import { useState, useEffect } from "react";
import ResetPassword from "./pages/ResetPassword";

import {
  loginUser,
  forgotPassword,
  getProfile,
  updateProfile,
  getDashboard,
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  getLearningGoals,
  createLearningGoal,
  updateLearningGoal,
  deleteLearningGoal,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "./services/api";



import "./App.css";
import JobApplications from "./pages/JobApplications";

function App() {
  
  // Theme state
const [theme, setTheme] = useState(() => {
return localStorage.getItem("careerforge-theme") || "light";
});

// Apply theme and save preference
useEffect(() => {
document.documentElement.setAttribute("data-theme", theme);
localStorage.setItem("careerforge-theme", theme);
}, [theme]);

// Toggle theme
function toggleTheme() {
setTheme((currentTheme) =>
currentTheme === "light" ? "dark" : "light"
);
}


  const [activePage, setActivePage] = useState("Dashboard");

  const [token, setToken] = useState(
    () => sessionStorage.getItem("careerforge_token") || ""
  );

  const [profile, setProfile] = useState(null);

  const [editFullName, setEditFullName] = useState("");
const [profileMessage, setProfileMessage] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
const [forgotEmail, setForgotEmail] = useState("");
const [forgotMessage, setForgotMessage] = useState("");
const [forgotLoading, setForgotLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [skills, setSkills] = useState([]);
  // Learning Goals States
const [learningGoals, setLearningGoals] = useState([]);

const [goalTitle, setGoalTitle] = useState("");
const [goalTechnology, setGoalTechnology] = useState("ASP.NET Core");
const [goalTargetDate, setGoalTargetDate] = useState("");
const [goalProgress, setGoalProgress] = useState(0);
const [goalStatus, setGoalStatus] = useState("Not Started");

const [editingGoalId, setEditingGoalId] = useState(null);
const [editGoalTitle, setEditGoalTitle] = useState("");
const [editGoalTechnology, setEditGoalTechnology] = useState("ASP.NET Core");
const [editGoalTargetDate, setEditGoalTargetDate] = useState("");
const [editGoalProgress, setEditGoalProgress] = useState(0);
const [editGoalStatus, setEditGoalStatus] = useState("Not Started");


// PROJECTS STATES
const [projects, setProjects] = useState([]);

const [projectTitle, setProjectTitle] = useState("");
const [projectDescription, setProjectDescription] = useState("");
const [projectTechnologies, setProjectTechnologies] = useState("");
const [projectGitHubUrl, setProjectGitHubUrl] = useState("");
const [projectLiveDemoUrl, setProjectLiveDemoUrl] = useState("");

const [editingProjectId, setEditingProjectId] = useState(null);
const [editProjectTitle, setEditProjectTitle] = useState("");
const [editProjectDescription, setEditProjectDescription] = useState("");
const [editProjectTechnologies, setEditProjectTechnologies] = useState("");
const [editProjectGitHubUrl, setEditProjectGitHubUrl] = useState("");
const [editProjectLiveDemoUrl, setEditProjectLiveDemoUrl] = useState("");



  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [skillName, setSkillName] = useState("");
const [skillCategory, setSkillCategory] = useState("Backend");
const [skillLevel, setSkillLevel] = useState("Beginner");
const [skillProgress, setSkillProgress] = useState(0);
const [editingSkillId, setEditingSkillId] = useState(null);
const [editSkillName, setEditSkillName] = useState("");
const [editSkillCategory, setEditSkillCategory] = useState("Backend");
const [editSkillLevel, setEditSkillLevel] = useState("Beginner");
const [editSkillProgress, setEditSkillProgress] = useState(0);

    async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);

      const receivedToken =
        data.token || data.accessToken || data.jwtToken;

      if (!receivedToken) {
        throw new Error(
          "Login successful, but the token property was not found in the response."
        );
      }

      sessionStorage.setItem("careerforge_token", receivedToken);
      setToken(receivedToken);
      setPassword("");
    } catch (err) {
      setError(err.message || "Unable to log in.");
    } finally {
      setLoading(false);
    }
  }

async function handleForgotPassword(event) {
  event.preventDefault();

  setForgotMessage("");
  setForgotLoading(true);

  try {
  const data = await forgotPassword(forgotEmail);

setForgotMessage(
  "Password reset instructions have been sent to your email."
);
} catch (err) {
  setForgotMessage(
    err.message || "Unable to process your request. Please try again."
  );
} finally {
  setForgotLoading(false);
}
}

function handleLogout() {
  sessionStorage.removeItem("careerforge_token");
  setToken("");
  setProfile(null);
  setEmail("");
  setPassword("");
  setError("");
}

    async function loadDashboard(currentToken) {
    setLoading(true);
    setError("");

    try {
      const data = await getDashboard(currentToken);
      setDashboardData(data);
    } catch (err) {
      setError(err.message || "Unable to load dashboard.");

      if (err.message.includes("401")) {
        sessionStorage.removeItem("careerforge_token");
        setToken("");
      }
    } finally {
      setLoading(false);
    }
  }

 async function loadProfile(currentToken) {
try {
const data = await getProfile(currentToken);


setProfile(data);
setEditFullName(data.fullName || "");


} catch (err) {
console.error("Profile loading failed:", err);
}
}


async function handleUpdateProfile(event) {
event.preventDefault();
setProfileMessage("");

try {
const data = await updateProfile(token, editFullName.trim());


await loadProfile(token);
setEditFullName(data.fullName);

setProfileMessage("Profile updated successfully!");


} catch (err) {
setProfileMessage(err.message || "Profile update failed.");
}
}


  async function loadSkills(currentToken) {
  try {
    setError("");

    const data = await getSkills(currentToken);
    setSkills(data);
  } catch (err) {
    setError(err.message || "Unable to load skills.");
  }
}

// Load Learning Goals
async function loadLearningGoals(currentToken) {
  try {
    setError("");

    const data = await getLearningGoals(currentToken);
    setLearningGoals(data);
  } catch (err) {
    setError(err.message || "Unable to load learning goals.");
  }
}


// LOAD PROJECTS FROM BACKEND
async function loadProjects(currentToken) {
  try {
    setError("");
    const data = await getProjects(currentToken);
    setProjects(data);
  } catch (err) {
    setError(err.message || "Unable to load projects.");
  }
}



// Add Learning Goal
async function handleAddLearningGoal(event) {
  event.preventDefault();

  if (!goalTitle.trim() || !goalTargetDate) {
    setError("Please enter a goal title and target date.");
    return;
  }

  try {
    setLoading(true);
    setError("");

    await createLearningGoal(token, {
      title: goalTitle.trim(),
      technology: goalTechnology,
      targetDate: goalTargetDate,
      progress: Number(goalProgress),
      status: goalStatus,
    });

    setGoalTitle("");
    setGoalTechnology("ASP.NET Core");
    setGoalTargetDate("");
    setGoalProgress(0);
    setGoalStatus("Not Started");

    await loadLearningGoals(token);
    await loadDashboard(token);
  } catch (err) {
    setError(err.message || "Unable to create learning goal.");
  } finally {
    setLoading(false);
  }
}


// ADD PROJECT
async function handleAddProject(event) {
  event.preventDefault();

  if (!projectTitle.trim() || !projectDescription.trim() || !projectTechnologies.trim()) {
    setError("Please enter project title, description, and technologies.");
    return;
  }

  try {
    setError("");
    setLoading(true);

    await createProject(token, {
      title: projectTitle.trim(),
      description: projectDescription.trim(),
      technologies: projectTechnologies.trim(),
      gitHubUrl: projectGitHubUrl.trim(),
      liveDemoUrl: projectLiveDemoUrl.trim(),
    });

    setProjectTitle("");
    setProjectDescription("");
    setProjectTechnologies("");
    setProjectGitHubUrl("");
    setProjectLiveDemoUrl("");

    await loadProjects(token);
    await loadDashboard(token);
  } catch (err) {
    setError(err.message || "Unable to create project.");
  } finally {
    setLoading(false);
  }
}


// EDIT PROJECT - FILL FORM
function handleEditProjectClick(project) {
  setEditingProjectId(project.id);
  setEditProjectTitle(project.title || "");
  setEditProjectDescription(project.description || "");
  setEditProjectTechnologies(project.technologies || "");
  setEditProjectGitHubUrl(project.gitHubUrl || "");
  setEditProjectLiveDemoUrl(project.liveDemoUrl || "");
}

// UPDATE PROJECT
async function handleUpdateProject(event) {
  event.preventDefault();

  if (
    !editProjectTitle.trim() ||
    !editProjectDescription.trim() ||
    !editProjectTechnologies.trim()
  ) {
    setError("Please enter project title, description, and technologies.");
    return;
  }

  try {
    setLoading(true);
    setError("");

    await updateProject(token, editingProjectId, {
      title: editProjectTitle.trim(),
      description: editProjectDescription.trim(),
      technologies: editProjectTechnologies.trim(),
      gitHubUrl: editProjectGitHubUrl.trim(),
      liveDemoUrl: editProjectLiveDemoUrl.trim(),
    });

    setEditingProjectId(null);

    await loadProjects(token);
    await loadDashboard(token);
  } catch (err) {
    setError(err.message || "Unable to update project.");
  } finally {
    setLoading(false);
  }
}


// DELETE PROJECT
async function handleDeleteProject(projectId, projectTitle) {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${projectTitle}"?`
  );

  if (!confirmed) {
    return;
  }

  try {
    setLoading(true);
    setError("");

    await deleteProject(token, projectId);

    if (editingProjectId === projectId) {
      setEditingProjectId(null);
    }

    await loadProjects(token);
    await loadDashboard(token);
  } catch (err) {
    setError(err.message || "Unable to delete project.");
  } finally {
    setLoading(false);
  }
}




// Edit Learning Goal - Fill Form
function handleEditGoalClick(goal) {
  setEditingGoalId(goal.id);
  setEditGoalTitle(goal.title);
  setEditGoalTechnology(goal.technology);
  setEditGoalTargetDate(goal.targetDate?.split("T")[0] || "");
  setEditGoalProgress(goal.progress);
  setEditGoalStatus(goal.status);
}

// Update Learning Goal
async function handleUpdateLearningGoal(event) {
  event.preventDefault();

  if (!editGoalTitle.trim() || !editGoalTargetDate) {
    setError("Please enter a goal title and target date.");
    return;
  }

  try {
    setLoading(true);
    setError("");

    await updateLearningGoal(token, editingGoalId, {
      title: editGoalTitle.trim(),
      technology: editGoalTechnology,
      targetDate: editGoalTargetDate,
      progress: Number(editGoalProgress),
      status: editGoalStatus,
    });

    setEditingGoalId(null);
    await loadLearningGoals(token);
    await loadDashboard(token);
  } catch (err) {
    setError(err.message || "Unable to update learning goal.");
  } finally {
    setLoading(false);
  }
}

async function handleAddSkill(event) {
  event.preventDefault();

  try {
    setError("");
    setLoading(true);

    const newSkill = {
      name: skillName,
      category: skillCategory,
      level: skillLevel,
      progress: Number(skillProgress),
    };

    const { createSkill } = await import("./services/api");

    await createSkill(token, newSkill);

    setSkillName("");
    setSkillCategory("Backend");
    setSkillLevel("Beginner");
    setSkillProgress(0);

    await loadSkills(token);
    await loadDashboard(token);
  } catch (err) {
    setError(err.message || "Unable to add skill.");
  } finally {
    setLoading(false);
  }
}

async function handleDeleteSkill(skillId, skillName) {
  const confirmed = window.confirm(
    `Are you sure you want to delete ${skillName}?`
  );

  if (!confirmed) return;

  try {
    setError("");
    setLoading(true);

    const { deleteSkill } = await import("./services/api");

    await deleteSkill(token, skillId);

    await loadSkills(token);
    await loadDashboard(token);
  } catch (err) {
    setError(err.message || "Unable to delete skill.");
  } finally {
    setLoading(false);
  }
}

function handleEditClick(skill) {
  setEditingSkillId(skill.id);
  setEditSkillName(skill.name);
  setEditSkillCategory(skill.category);
  setEditSkillLevel(skill.level);
  setEditSkillProgress(skill.progress);
}

async function handleUpdateSkill(event) {
  event.preventDefault();

  try {
    setError("");
    setLoading(true);

    const { updateSkill } = await import("./services/api");

    const updatedSkill = {
      name: editSkillName,
      category: editSkillCategory,
      level: editSkillLevel,
      progress: Number(editSkillProgress),
    };

    await updateSkill(token, editingSkillId, updatedSkill);

    setEditingSkillId(null);

    await loadSkills(token);
    await loadDashboard(token);
  } catch (err) {
    setError(err.message || "Unable to update skill.");
  } finally {
    setLoading(false);
  }
}

// Delete Learning Goal
async function handleDeleteLearningGoal(goalId, goalTitle) {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${goalTitle}"?`
  );

  if (!confirmed) return;

  try {
    setLoading(true);
    setError("");

    await deleteLearningGoal(token, goalId);

    await loadLearningGoals(token);
    await loadDashboard(token);
  } catch (err) {
    setError(err.message || "Unable to delete learning goal.");
  } finally {
    setLoading(false);
  }
}


useEffect(() => {
  if (token) {
    loadDashboard(token);
    loadSkills(token);
    loadLearningGoals(token);
    loadProjects(token);
    loadProfile(token);
  }
}, [token]);

const menuItems = [
{ name: "Dashboard", icon: "▦" },
{ name: "Skills", icon: "✧" },
{ name: "Learning Goals", icon: "◎" },
{ name: "Projects", icon: "▣" },
{ name: "Job Applications", icon: "▤" },
{ name: "Profile", icon: "👤" },
];


  const stats = [
  {
    title: "Total Skills",
    value: dashboardData?.totalSkills ?? "—",
    icon: "✧",
    color: "purple",
  },
  {
    title: "Learning Goals",
    value: dashboardData?.totalLearningGoals ?? "—",
    icon: "◎",
    color: "blue",
  },
  {
    title: "My Projects",
    value: dashboardData?.totalProjects ?? "—",
    icon: "▣",
    color: "orange",
  },
  {
    title: "Job Applications",
    value: dashboardData?.totalJobApplications ?? "—",
    icon: "▤",
    color: "green",
  },
];

const currentPath = window.location.pathname;

if (currentPath === "/reset-password") {
  return <ResetPassword />;
}
// Calculate overall learning progress
const totalLearningProgress =
  learningGoals.length > 0
    ? Math.round(
        learningGoals.reduce(
          (total, goal) => total + Number(goal.progress || 0),
          0
        ) / learningGoals.length
      )
    : 0;
    if (!token) {
    return (
      <div className="login-page">
      {showForgotPassword ? (
  <form className="login-card" onSubmit={handleForgotPassword}>
    <div className="brand-icon">C</div>

    <h1>Forgot Password?</h1>

    <p>
      Enter your registered email address. We'll send you a password reset link.
    </p>

    <label htmlFor="forgotEmail">Email address</label>

    <input
      id="forgotEmail"
      type="email"
      placeholder="Enter your registered email"
      value={forgotEmail}
      onChange={(event) => setForgotEmail(event.target.value)}
      required
    />
    

    {forgotMessage && (
  <p
    className={
      forgotMessage.includes("invalid") ||
      forgotMessage.includes("Unable") ||
      forgotMessage.includes("Failed")
        ? "error-message"
        : "success-message"
    }
  >
    {forgotMessage}
  </p>
)}

    <button
      className="primary-button login-button"
      type="submit"
      disabled={forgotLoading}
    >
      {forgotLoading ? "Sending..." : "Send Reset Link"}
    </button>

    <button
      type="button"
      className="forgot-password-link"
      onClick={() => {
        setShowForgotPassword(false);
        setForgotMessage("");
      }}
    >
      ← Back to Sign In
    </button>
  </form>
) : (
  <form className="login-card" onSubmit={handleLogin}>
          <div className="brand-icon">C</div>

          <h1>Welcome to CareerForge</h1>
          <p>Sign in to continue your career journey.</p>

          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <div className="forgot-password-row">
  <button
    type="button"
    className="forgot-password-link"
    onClick={() => {
      setForgotEmail(email);
      setForgotMessage("");
      setShowForgotPassword(true);
    }}
  >
    Forgot Password?
  </button>
</div>

          {error && <p className="error-message">{error}</p>}

          <button className="primary-button login-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>

          <small>Your CareerForge workspace awaits.</small>
        </form>
      )}
      </div>
    );
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">C</div>
          <div>
            <h2>CareerForge</h2>
            <span>CAREER DEVELOPMENT</span>
          </div>
        </div>

        <p className="menu-label">WORKSPACE</p>

        <nav className="navigation">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`nav-item ${
                activePage === item.name ? "active" : ""
              }`}
              onClick={() => setActivePage(item.name)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.name}
              {item.name === "Job Applications" && ( <span className="nav-badge">
{dashboardData?.totalJobApplications ?? 0} </span>
)}

            </button>
          ))}
        </nav>

        <button
type="button"
className="theme-toggle"
onClick={toggleTheme}

>

<span>{theme === "light" ? "🌙" : "☀️"}</span>
{theme === "light" ? "Dark Mode" : "Light Mode"} </button>


        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">✦</div>
            <h3>Keep growing!</h3>
            <p>Small steps today lead to big achievements tomorrow.</p>
          </div>

<div className="profile">
  <div className="avatar">
    {(profile?.fullName || "M").charAt(0).toUpperCase()}
  </div>

  <div className="profile-info">
    <strong>{profile?.fullName || "Loading profile..."}</strong>
    <span>{profile?.role || ".NET Developer"}</span>
  </div>

<span className="profile-menu">•••</span>

</div>

          
<button
  type="button"
  className="logout-button"
  onClick={handleLogout}
>
  ↪ Logout
</button>


        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> <strong>{activePage}</strong>
          </div>

          <div className="topbar-right">
            <span className="status-dot"></span>
            <span className="status-text">Your workspace</span>
            <div className="top-avatar">M</div>
          </div>
        </header>

        <section className="page-content">
          <div className="welcome-row">
            <div>
              <p className="eyebrow">YOUR PERSONAL WORKSPACE</p>
              <h1>
                {activePage === "Dashboard"
                  ? "Welcome back, Mayur!"
                  : activePage}
              </h1>
              <p className="subtitle">
                {activePage === "Dashboard"
                  ? "Track your progress and keep building your future."
                  : `Manage your ${activePage.toLowerCase()} in one place.`}
              </p>
            </div>

            <div className="date-card">
              <span>✧</span>
              Keep moving forward
            </div>
          </div>

          {activePage === "Dashboard" ? (
            <>
              <div className="section-heading">
                <div>
                  <h2>Your overview</h2>
                  <p>Here's where you stand today.</p>
                </div>
                <span className="live-badge">
                  <span></span> Workspace overview
                </span>
              </div>

              <div className="stats-grid">
                {stats.map((stat) => (
                  <div className="stat-card" key={stat.title}>
                    <div className="stat-top">
                      <div className={`stat-icon ${stat.color}`}>
                        {stat.icon}
                      </div>
                      <span className="stat-menu">•••</span>
                    </div>
                    <p className="stat-title">{stat.title}</p>
                    <div className="stat-bottom">
                      <h3>{stat.value}</h3>
                      <span className="stat-caption">In your workspace</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="content-grid">
                <section className="panel progress-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Learning progress</h2>
                      <p>Keep developing your skills.</p>
                    </div>
                    <span className="panel-symbol">↗</span>
                  </div>

                  <div className="progress-summary">
                   <div
  className="progress-circle"
  style={{
    background: `conic-gradient(#7c5cff ${
      totalLearningProgress * 3.6
    }deg, #e8e5ff 0deg)`,
  }}
>
  <div>
    <strong>{totalLearningProgress}%</strong>
    <span>Completed</span>
  </div>
</div>
                    <div className="progress-details">
                     <h3>
  {learningGoals.length === 0
    ? "You're getting started"
    : totalLearningProgress === 100
      ? "Amazing work!"
      : "Keep up the progress!"}
</h3>
                      <p>
                        Complete your learning goals to see your progress
                        grow here.
                      </p>
                      <button
                        className="text-button"
                        onClick={() => setActivePage("Learning Goals")}
                      >
                        View learning goals →
                      </button>
                    </div>
                  </div>
                </section>

                <section className="panel quick-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Quick actions</h2>
                      <p>What would you like to do?</p>
                    </div>
                  </div>

                 

                  <button
                    className="quick-action"
                    onClick={() => setActivePage("Skills")}
                  >
                    <span className="action-icon purple">✧</span>
                    <span>
                      <strong>Manage skills</strong>
                      <small>Track your technical skills</small>
                    </span>
                    <span className="action-arrow">→</span>
                  </button>

                  <button
                    className="quick-action"
                    onClick={() => setActivePage("Projects")}
                  >
                    <span className="action-icon orange">▣</span>
                    <span>
                      <strong>View projects</strong>
                      <small>Showcase your work</small>
                    </span>
                    <span className="action-arrow">→</span>
                  </button>

                  <button
                    className="quick-action"
                    onClick={() => setActivePage("Job Applications")}
                  >
                    <span className="action-icon green">▤</span>
                    <span>
                      <strong>Track applications</strong>
                      <small>Follow your job search</small>
                    </span>
                    <span className="action-arrow">→</span>
                  </button>
                </section>
              </div>

              <section className="panel journey-panel">
                <div className="journey-icon">✦</div>
                <div>
                  <h2>Your journey, your progress.</h2>
                  <p>
                    Every skill learned and every project built brings you
                    one step closer to your career goals.
                  </p>
                </div>
                <button
                  className="primary-button"
                  onClick={() => setActivePage("Learning Goals")}
                >
                  Continue learning <span>→</span>
                </button>
              </section>
            </>

        ) : activePage === "Skills" ? (
  <section className="panel skills-panel">
    <div className="panel-heading">
      <div>


         <form onSubmit={handleAddSkill} className="skill-form">
  <h3>Add New Skill</h3>

  <div className="form-group">
    <label>Skill Name</label>
    <input
      type="text"
      value={skillName}
      onChange={(event) => setSkillName(event.target.value)}
      placeholder="e.g. C#"
      required
    />
  </div>

  <div className="form-group">
    <label>Category</label>
    <select
      value={skillCategory}
      onChange={(event) => setSkillCategory(event.target.value)}
    >
      <option value="Backend">Backend</option>
      <option value="Frontend">Frontend</option>
      <option value="Database">Database</option>
      <option value="Tools">Tools</option>
    </select>
  </div>

  <div className="form-group">
    <label>Level</label>
    <select
      value={skillLevel}
      onChange={(event) => setSkillLevel(event.target.value)}
    >
      <option value="Beginner">Beginner</option>
      <option value="Intermediate">Intermediate</option>
      <option value="Advanced">Advanced</option>
    </select>
  </div>

  <div className="form-group">
    <label>Progress: {skillProgress}%</label>
    <input
      type="range"
      min="0"
      max="100"
      value={skillProgress}
      onChange={(event) => setSkillProgress(event.target.value)}
    />
  </div>

  <button type="submit" className="primary-button" disabled={loading}>
    {loading ? "Adding..." : "+ Add Skill"}
  </button>
</form>
        <h2>My Skills</h2>
        <p>Manage your technical skills.</p>
      </div>

      <button
        className="primary-button"
        onClick={() => loadSkills(token)}
      >
        ↻ Refresh Skills
      </button>
    </div>

    
{editingSkillId !== null && (
  <form onSubmit={handleUpdateSkill} className="skill-form">
    <h3>Edit Skill</h3>

    <div className="form-group">
      <label>Skill Name</label>
      <input
        type="text"
        value={editSkillName}
        onChange={(event) => setEditSkillName(event.target.value)}
        required
      />
    </div>

    <div className="form-group">
      <label>Category</label>
      <select
        value={editSkillCategory}
        onChange={(event) => setEditSkillCategory(event.target.value)}
      >
        <option value="Backend">Backend</option>
        <option value="Frontend">Frontend</option>
        <option value="Database">Database</option>
        <option value="Tools">Tools</option>
      </select>
    </div>

    <div className="form-group">
      <label>Level</label>
      <select
        value={editSkillLevel}
        onChange={(event) => setEditSkillLevel(event.target.value)}
      >
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>
    </div>

    <div className="form-group">
      <label>Progress: {editSkillProgress}%</label>
      <input
        type="range"
        min="0"
        max="100"
        value={editSkillProgress}
        onChange={(event) => setEditSkillProgress(event.target.value)}
      />
    </div>

    <div className="skill-actions">
      <button type="submit" className="primary-button" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </button>

      <button
        type="button"
        className="delete-skill-button"
        onClick={() => setEditingSkillId(null)}
        disabled={loading}
      >
        Cancel
      </button>
    </div>
  </form>
)}

    {error && <p className="error-message">{error}</p>}

    {skills.length === 0 ? (
      <p>No skills found. Click Refresh Skills to load your skills.</p>
    ) : (
      <div className="skills-table-wrapper">
       <table className="skills-table">
  <thead>
    <tr>
      <th>Skill</th>
      <th>Category</th>
      <th>Level</th>
      <th>Progress</th>
      <th>Actions</th>
    </tr>
  </thead>

  <tbody>
    {skills.map((skill) => (
      <tr key={skill.id}>
        <td>
          <div className="skill-name-cell">
            <span className="skill-avatar">
              {skill.name.charAt(0).toUpperCase()}
            </span>
            <strong>{skill.name}</strong>
          </div>
        </td>

        <td>
          <span className="category-badge">
            {skill.category}
          </span>
        </td>

        <td>
          <span
            className={`level-badge ${skill.level.toLowerCase()}`}
          >
            {skill.level}
          </span>
        </td>

        <td>
          <div className="progress-cell">
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${skill.progress}%` }}
              />
            </div>
            <span className="progress-value">
              {skill.progress}%
            </span>
          </div>
        </td>

<td>
  <div className="skill-actions">
    <button
      type="button"
      className="edit-skill-button"
      onClick={() => handleEditClick(skill)}
      disabled={loading}
    >
      Edit
    </button>

    <button
      type="button"
      className="delete-skill-button"
      onClick={() => handleDeleteSkill(skill.id, skill.name)}
      disabled={loading}
    >
      Delete
    </button>
  </div>
</td>

      </tr>
    ))}
  </tbody>
</table>
      </div>
    )}
  </section>

) : activePage === "Learning Goals" ? (
  <section className="panel learning-goals-panel">
    <div className="panel-heading">
      <div>
        <h2>My Learning Goals</h2>
        <p>Track your learning journey and progress.</p>
      </div>

      <button
        className="primary-button"
        onClick={() => loadLearningGoals(token)}
        disabled={loading}
      >
        ↻ Refresh Goals
      </button>
    </div>

    {error && <p className="error-message">{error}</p>}

    <form onSubmit={handleAddLearningGoal} className="skill-form">
      <h3>+ Add Learning Goal</h3>

      <div className="form-group">
        <label>Goal Title</label>
        <input
          type="text"
          value={goalTitle}
          onChange={(event) => setGoalTitle(event.target.value)}
          placeholder="e.g. Master ASP.NET Core Web API"
          required
        />
      </div>

      <div className="form-group">
        <label>Technology</label>
        <select
          value={goalTechnology}
          onChange={(event) => setGoalTechnology(event.target.value)}
        >
          <option value="C#">C#</option>
          <option value="ASP.NET Core">ASP.NET Core</option>
          <option value="React.js">React.js</option>
          <option value="SQL Server">SQL Server</option>
          <option value="RESTful API">RESTful API</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label>Target Date</label>
        <input
          type="date"
          value={goalTargetDate}
          onChange={(event) => setGoalTargetDate(event.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Initial Progress: {goalProgress}%</label>
        <input
          type="range"
          min="0"
          max="100"
          value={goalProgress}
          onChange={(event) => setGoalProgress(Number(event.target.value))}
        />
      </div>

      <div className="form-group">
        <label>Status</label>
        <select
          value={goalStatus}
          onChange={(event) => setGoalStatus(event.target.value)}
        >
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <button type="submit" className="primary-button" disabled={loading}>
        {loading ? "Adding..." : "+ Add Goal"}
      </button>
    </form>

    {editingGoalId !== null && (
      <form onSubmit={handleUpdateLearningGoal} className="skill-form">
        <h3>Edit Learning Goal</h3>

        <div className="form-group">
          <label>Goal Title</label>
          <input
            type="text"
            value={editGoalTitle}
            onChange={(event) => setEditGoalTitle(event.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Technology</label>
          <select
            value={editGoalTechnology}
            onChange={(event) => setEditGoalTechnology(event.target.value)}
          >
            <option value="C#">C#</option>
            <option value="ASP.NET Core">ASP.NET Core</option>
            <option value="React.js">React.js</option>
            <option value="SQL Server">SQL Server</option>
            <option value="RESTful API">RESTful API</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Target Date</label>
          <input
            type="date"
            value={editGoalTargetDate}
            onChange={(event) => setEditGoalTargetDate(event.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Progress: {editGoalProgress}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={editGoalProgress}
            onChange={(event) => setEditGoalProgress(Number(event.target.value))}
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            value={editGoalStatus}
            onChange={(event) => setEditGoalStatus(event.target.value)}
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="skill-actions">
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            className="delete-skill-button"
            onClick={() => setEditingGoalId(null)}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    )}

    <h3 className="goals-list-heading">Your Learning Goals</h3>

    {learningGoals.length === 0 ? (
      <p>No learning goals found. Add a goal to get started.</p>
    ) : (
      <div className="skills-table-wrapper">
        <table className="skills-table">
          <thead>
            <tr>
              <th>Goal</th>
              <th>Technology</th>
              <th>Target Date</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {learningGoals.map((goal) => (
              <tr key={goal.id}>
                <td>
                  <div className="skill-name-cell">
                    <span className="skill-avatar">
                      {goal.title?.charAt(0).toUpperCase()}
                    </span>
                    <strong>{goal.title}</strong>
                  </div>
                </td>

                <td>
                  <span className="category-badge">{goal.technology}</span>
                </td>

                <td>
                  {goal.targetDate
                    ? new Date(goal.targetDate).toLocaleDateString()
                    : "Not set"}
                </td>

                <td>
                  <div className="progress-cell">
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                    <span className="progress-value">{goal.progress}%</span>
                  </div>
                </td>

                <td>
                  
<span
  className={`goal-status-badge ${
    goal.status?.toLowerCase().replace(/\s+/g, "-")
  }`}
>
  {goal.status}
</span>


                </td>

                <td>
                  <div className="skill-actions">
                    <button
                      type="button"
                      className="edit-skill-button"
                      onClick={() => handleEditGoalClick(goal)}
                      disabled={loading}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-skill-button"
                      onClick={() =>
                        handleDeleteLearningGoal(goal.id, goal.title)
                      }
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </section>


) : activePage === "Projects" ? (
  <section className="panel projects-panel">
    <div className="panel-heading">
      <div>
        <h2>My Projects</h2>
        <p>Build, manage, and showcase your work.</p>
      </div>

      <button
        type="button"
        className="primary-button"
        onClick={() => loadProjects(token)}
        disabled={loading}
      >
        ↻ Refresh Projects
      </button>
    </div>

    {error && <p className="error-message">{error}</p>}

    <form onSubmit={handleAddProject} className="skill-form">
      <h3>+ Add New Project</h3>

      <div className="form-group">
        <label>Project Title</label>
        <input
          type="text"
          value={projectTitle}
          onChange={(event) => setProjectTitle(event.target.value)}
          placeholder="e.g. CareerForge"
          maxLength={100}
          required
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={projectDescription}
          onChange={(event) => setProjectDescription(event.target.value)}
          placeholder="Describe your project..."
          rows={4}
          required
        />
      </div>

      <div className="form-group">
        <label>Technologies</label>
        <input
          type="text"
          value={projectTechnologies}
          onChange={(event) => setProjectTechnologies(event.target.value)}
          placeholder="C#, ASP.NET Core, React, SQL Server"
          maxLength={200}
          required
        />
      </div>

      <div className="form-group">
        <label>GitHub URL (optional)</label>
        <input
          type="url"
          value={projectGitHubUrl}
          onChange={(event) => setProjectGitHubUrl(event.target.value)}
          placeholder="https://github.com/username/project"
          maxLength={500}
        />
      </div>

      <div className="form-group">
        <label>Live Demo URL (optional)</label>
        <input
          type="url"
          value={projectLiveDemoUrl}
          onChange={(event) => setProjectLiveDemoUrl(event.target.value)}
          placeholder="https://your-project.com"
          maxLength={500}
        />
      </div>

      <button
        type="submit"
        className="primary-button"
        disabled={loading}
      >
        {loading ? "Adding..." : "+ Add Project"}
      </button>
    </form>

    {editingProjectId !== null && (
      <form onSubmit={handleUpdateProject} className="skill-form">
        <h3>Edit Project</h3>

        <div className="form-group">
          <label>Project Title</label>
          <input
            type="text"
            value={editProjectTitle}
            onChange={(event) => setEditProjectTitle(event.target.value)}
            maxLength={100}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={editProjectDescription}
            onChange={(event) => setEditProjectDescription(event.target.value)}
            rows={4}
            required
          />
        </div>

        <div className="form-group">
          <label>Technologies</label>
          <input
            type="text"
            value={editProjectTechnologies}
            onChange={(event) => setEditProjectTechnologies(event.target.value)}
            maxLength={200}
            required
          />
        </div>

        <div className="form-group">
          <label>GitHub URL</label>
          <input
            type="url"
            value={editProjectGitHubUrl}
            onChange={(event) => setEditProjectGitHubUrl(event.target.value)}
            maxLength={500}
          />
        </div>

        <div className="form-group">
          <label>Live Demo URL</label>
          <input
            type="url"
            value={editProjectLiveDemoUrl}
            onChange={(event) => setEditProjectLiveDemoUrl(event.target.value)}
            maxLength={500}
          />
        </div>

        <div className="skill-actions">
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            className="delete-skill-button"
            onClick={() => setEditingProjectId(null)}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    )}

    <h3 className="goals-list-heading">Your Projects</h3>

    {projects.length === 0 ? (
      <p>No projects found. Add your first project to get started.</p>
    ) : (
      <div className="projects-grid">
        {projects.map((project) => (
          <article className="project-card" key={project.id}>
            <div className="project-card-header">
              <div className="project-card-icon">{"</>"}</div>
              <span className="project-id">Project #{project.id}</span>
            </div>

            <h3>{project.title}</h3>
            <p className="project-description">{project.description}</p>

            <div className="project-technologies">
              {project.technologies}
            </div>

            <div className="project-links">
              {project.gitHubUrl && (
                <a
                  href={project.gitHubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub ↗
                </a>
              )}

              {project.liveDemoUrl && (
                <a
                  href={project.liveDemoUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Live Demo ↗
                </a>
              )}
            </div>

            <div className="skill-actions project-actions">
              <button
                type="button"
                className="edit-skill-button"
                onClick={() => handleEditProjectClick(project)}
                disabled={loading}
              >
                Edit
              </button>

              <button
                type="button"
                className="delete-skill-button"
                onClick={() => handleDeleteProject(project.id, project.title)}
                disabled={loading}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    )}
    </section>
) : activePage === "Job Applications" ? (
 <JobApplications token={token} theme={theme} />

) : activePage === "Profile" ? (
  <section className="panel profile-panel">
    <div className="panel-heading">
      <div>
        <h2>Profile Management</h2>
        <p>View and update your personal information.</p>
      </div>
    </div>

    <form onSubmit={handleUpdateProfile} className="profile-form">
      <div className="form-group">
        <label htmlFor="profileFullName">Full Name</label>
        <input
          id="profileFullName"
          type="text"
          value={editFullName}
          onChange={(event) => setEditFullName(event.target.value)}
          placeholder="Enter your full name"
          maxLength={100}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="profileEmail">Email Address</label>
        <input
          id="profileEmail"
          type="email"
          value={profile?.email || ""}
          readOnly
        />
      </div>

      {profileMessage && (
        <p className="profile-message">{profileMessage}</p>
      )}

      <button
        type="submit"
        className="primary-button"
        disabled={!editFullName.trim()}
      >
        Save Changes
      </button>
    </form>
  </section>

) : (
  <section className="panel placeholder-panel">
    <div className="placeholder-icon">✦</div>
    <h2>{activePage}</h2>
    <p>
      This section's functionality will be connected to your
      CareerForge API in the next steps.
    </p>
    <button
      className="primary-button"
      onClick={() => setActivePage("Dashboard")}
    >
      Back to Dashboard →
    </button>
  </section>
)}

          <footer className="footer">
            <span>© 2026 CareerForge</span>
            <span>Built for your next career milestone ✦</span>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;