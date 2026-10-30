const API_BASE_URL = "https://localhost:7146/api";

export async function getDashboard(token) {
  const response = await fetch(`${API_BASE_URL}/Dashboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Dashboard API failed: ${response.status}`);
  }

  return await response.json();
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/Auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}


export async function getProfile(token) {
  const response = await fetch(`${API_BASE_URL}/Auth/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load profile: ${response.status}`);
  }

  return await response.json();
}

export async function updateProfile(token, fullName) {
const response = await fetch(`${API_BASE_URL}/Auth/profile`, {
method: "PUT",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${token}`,
},
body: JSON.stringify({
fullName,
}),
});

const data = await response.json();

if (!response.ok) {
throw new Error(data.message || "Profile update failed");
}

return data;
}


export async function getSkills(token) {
  const response = await fetch(`${API_BASE_URL}/Skills`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load skills: ${response.status}`);
  }

  return await response.json();
}

export async function deleteSkill(token, skillId) {
  const response = await fetch(`${API_BASE_URL}/Skills/${skillId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete skill: ${response.status}`);
  }
}

export async function updateSkill(token, skillId, skill) {
  const response = await fetch(`${API_BASE_URL}/Skills/${skillId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(skill),
  });

  if (!response.ok) {
    throw new Error(`Failed to update skill: ${response.status}`);
  }

  // PUT API agar response body return nahi karti, toh bhi kaam karega.
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }

  return null;
}

export async function createSkill(token, skill) {
  const response = await fetch(`${API_BASE_URL}/Skills`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(skill),
  });

  if (!response.ok) {
    throw new Error(`Failed to add skill: ${response.status}`);
  }

  return await response.json();
}

// ===============================
// LEARNING GOALS API
// ===============================

// Get all learning goals
export async function getLearningGoals(token) {
  const response = await fetch(`${API_BASE_URL}/LearningGoals`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load learning goals: ${response.status}`);
  }

  return await response.json();
}

// Create learning goal
export async function createLearningGoal(token, goal) {
  const response = await fetch(`${API_BASE_URL}/LearningGoals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(goal),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Failed to create learning goal: ${response.status}`);
  }

  return await response.json();
}

// Update learning goal
export async function updateLearningGoal(token, goalId, goal) {
  const response = await fetch(`${API_BASE_URL}/LearningGoals/${goalId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(goal),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Failed to update learning goal: ${response.status}`);
  }

  return await response.json();
}

// Delete learning goal
export async function deleteLearningGoal(token, goalId) {
  const response = await fetch(`${API_BASE_URL}/LearningGoals/${goalId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete learning goal: ${response.status}`);
  }

  return true;
}


// GET ALL PROJECTS
export async function getProjects(token) {
  const response = await fetch(`${API_BASE_URL}/Projects`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load projects: ${response.status}`);
  }

  return await response.json();
}

// CREATE PROJECT
export async function createProject(token, project) {
  const response = await fetch(`${API_BASE_URL}/Projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(project),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Failed to create project: ${response.status}`);
  }

  return await response.json();
}

// UPDATE PROJECT
export async function updateProject(token, projectId, project) {
  const response = await fetch(`${API_BASE_URL}/Projects/${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(project),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Failed to update project: ${response.status}`);
  }

  return await response.json();
}

// DELETE PROJECT
export async function deleteProject(token, projectId) {
  const response = await fetch(`${API_BASE_URL}/Projects/${projectId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete project: ${response.status}`);
  }

  return true;
}


// ===============================
// JOB APPLICATIONS API
// ===============================

// GET ALL JOB APPLICATIONS
export async function getJobApplications(token) {
  const response = await fetch(`${API_BASE_URL}/JobApplications`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      message || `Failed to load job applications: ${response.status}`
    );
  }

  return await response.json();
}

// CREATE JOB APPLICATION
export async function createJobApplication(token, application) {
  const response = await fetch(`${API_BASE_URL}/JobApplications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(application),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      message || `Failed to create job application: ${response.status}`
    );
  }

  return await response.json();
}

// UPDATE JOB APPLICATION
export async function updateJobApplication(
  token,
  applicationId,
  application
) {
  const response = await fetch(
    `${API_BASE_URL}/JobApplications/${applicationId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(application),
    }
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      message || `Failed to update job application: ${response.status}`
    );
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }

  return null;
}

// DELETE JOB APPLICATION
export async function deleteJobApplication(token, applicationId) {
  const response = await fetch(
    `${API_BASE_URL}/JobApplications/${applicationId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      message || `Failed to delete job application: ${response.status}`
    );
  }

  return true;
}


// ===============================
// FORGOT PASSWORD API
// ===============================

export async function forgotPassword(email) {
  const response = await fetch(`${API_BASE_URL}/Auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to send password reset email.");
  }

  return data;
}

// ===============================
// RESET PASSWORD API
// ===============================

export async function resetPassword(email, token, newPassword) {
  const response = await fetch(`${API_BASE_URL}/Auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      token,
      newPassword,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to reset password.");
  }

  return data;
}
