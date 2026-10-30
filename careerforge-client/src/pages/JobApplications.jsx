
import { useEffect, useState } from "react";
import {
  getJobApplications,
  createJobApplication,
  updateJobApplication,
  deleteJobApplication,
} from "../services/api";

const emptyForm = {
  companyName: "",
  jobTitle: "",
  location: "",
  status: "Applied",
  appliedDate: new Date().toISOString().split("T")[0],
  interviewDate: "",
  notes: "",
};

function JobApplications({ token, theme }) {
  const summaryCardStyle = {
  background: theme === "dark" ? "#1e293b" : "#ffffff",
  color: theme === "dark" ? "#f8fafc" : "#1f2937",
  padding: "20px",
  borderRadius: "12px",
  border: theme === "dark"
    ? "1px solid #334155"
    : "1px solid #e5e7eb",
  boxShadow: theme === "dark"
    ? "0 2px 6px rgba(0,0,0,0.2)"
    : "0 2px 6px rgba(0,0,0,0.05)",
};
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("All");
const [sortBy, setSortBy] = useState("newest");
  const totalApplications = applications.length;

const appliedCount = applications.filter(
  (app) => app.status === "Applied"
).length;

const interviewCount = applications.filter(
  (app) => app.status === "Interview Scheduled"
).length;

const selectedCount = applications.filter(
  (app) => app.status === "Selected"
).length;
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const filteredApplications = applications.filter((application) => {
const search = searchTerm.trim().toLowerCase();

const matchesSearch =
(application.companyName || "").toLowerCase().includes(search) ||
(application.jobTitle || "").toLowerCase().includes(search) ||
(application.location || "").toLowerCase().includes(search);

const matchesStatus =
statusFilter === "All" || application.status === statusFilter;

return matchesSearch && matchesStatus;
});

const sortedApplications = [...filteredApplications].sort((a, b) => {
  if (sortBy === "newest") {
    return new Date(b.appliedDate || 0) - new Date(a.appliedDate || 0);
  }

  if (sortBy === "oldest") {
    return new Date(a.appliedDate || 0) - new Date(b.appliedDate || 0);
  }

  if (sortBy === "company") {
    return (a.companyName || "").localeCompare(b.companyName || "");
  }

  return 0;
});

  async function loadApplications() {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        throw new Error("Please log in to view job applications.");
      }

      const data = await getJobApplications(token);
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load job applications.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
    // Load applications when this page mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!token) {
        throw new Error("Please log in before saving an application.");
      }

     const payload = {
  companyName: form.companyName,
  jobTitle: form.jobTitle,
  location: form.location,
  status: form.status,
  appliedDate: form.appliedDate,
  interviewDate: form.interviewDate || null,
  notes: form.notes,
};

      if (editingId !== null) {
        await updateJobApplication(token, editingId, payload);
        setSuccess("Job application updated successfully.");
      } else {
        await createJobApplication(token, payload);
        setSuccess("Job application added successfully.");
      }

      resetForm();
      await loadApplications();
    } catch (err) {
      setError(err.message || "Unable to save job application.");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(application) {
    setEditingId(application.id);

    setForm({
      companyName: application.companyName || "",
      jobTitle: application.jobTitle || "",
      location: application.location || "",
      status: application.status || "Applied",
      appliedDate: application.applicationDate
        ? application.applicationDate.split("T")[0]
        : new Date().toISOString().split("T")[0],
      interviewDate: application.interviewDate
        ? application.interviewDate.split("T")[0]
        : "",
      notes: application.notes || "",
    });

    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job application?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      if (!token) {
        throw new Error("Please log in before deleting an application.");
      }

      await deleteJobApplication(token, id);

      setApplications((previous) =>
        previous.filter((application) => application.id !== id)
      );

      if (editingId === id) {
        resetForm();
      }

      setSuccess("Job application deleted successfully.");
    } catch (err) {
      setError(err.message || "Unable to delete job application.");
    }
  }

const statusColors = {
  Applied: "#ca8a04",
  "Interview Scheduled": "#2563eb",
  Interviewing: "#2563eb",
  Selected: "#16a34a",
  Offered: "#16a34a",
  Rejected: "#dc2626",
  "Not Applied": "#64748b",
};
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Job Applications</h1>
          <p style={styles.subtitle}>
            Track your job search and manage your applications.
          </p>
        </div>

        <div style={styles.counter}>
          Total Applications: {applications.length}
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>
          {editingId !== null ? "Edit Application" : "Add Job Application"}
        </h2>

<div style={styles.summaryGrid}>
 <div style={summaryCardStyle}>
    <h3>Total Applications</h3>
    <p>{totalApplications}</p>
  </div>

<div style={summaryCardStyle}>
    <h3>Applied</h3>
    <p>{appliedCount}</p>
  </div>

  <div style={summaryCardStyle}>
    <h3>Interview Scheduled</h3>
    <p>{interviewCount}</p>
  </div>

<div style={summaryCardStyle}>
    <h3>Selected</h3>
    <p>{selectedCount}</p>
  </div>
</div>


        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            <label style={styles.label}>
              Company Name *
              <input
                style={styles.input}
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="e.g. TCS"
                required
              />
            </label>

            <label style={styles.label}>
              Job Title *
              <input
                style={styles.input}
                name="jobTitle"
                value={form.jobTitle}
                onChange={handleChange}
                placeholder=".NET Full Stack Developer"
                required
              />
            </label>

            <label style={styles.label}>
              Location
              <input
                style={styles.input}
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Nagpur / Remote"
              />
            </label>

            <label style={styles.label}>
              Status *
              <select
                style={styles.input}
                name="status"
                value={form.status}
                onChange={handleChange}
                required
              >
                <option value="Applied">Applied</option>
                <option value="Interview Scheduled">
                  Interview Scheduled
                </option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offered">Offered</option>
                <option value="Rejected">Rejected</option>
              </select>
            </label>

            <label style={styles.label}>
              Application Date *
              <input
                style={styles.input}
                type="date"
               name="appliedDate"
value={form.appliedDate}
                onChange={handleChange}
                required
              />
            </label>

            <label style={styles.label}>
              Interview Date
              <input
                style={styles.input}
                type="date"
                name="interviewDate"
                value={form.interviewDate}
                onChange={handleChange}
              />
            </label>

            <label style={{ ...styles.label, gridColumn: "1 / -1" }}>
              Notes
              <textarea
                style={{ ...styles.input, minHeight: "90px" }}
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Add interview details or other notes..."
              />
            </label>
          </div>

          <div style={styles.actions}>
            <button
              style={styles.primaryButton}
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId !== null
                  ? "Update Application"
                  : "Add Application"}
            </button>

            {editingId !== null && (
              <button
                style={styles.secondaryButton}
                type="button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Your Applications</h2>
        <p style={styles.subtitle}>
  Showing {filteredApplications.length} of {applications.length} applications
</p>

<div style={styles.formGrid}>
  <label style={styles.label}>
    Search Applications
    <input
      style={styles.input}
      type="text"
      placeholder="Search company, job title, or location..."
      value={searchTerm}
      onChange={(event) => setSearchTerm(event.target.value)}
    />
  </label>

  <label style={styles.label}>
    Filter by Status
    <select
      style={styles.input}
      value={statusFilter}
      onChange={(event) => setStatusFilter(event.target.value)}
    >
      <option value="All">All Statuses</option>
      <option value="Applied">Applied</option>
      <option value="Interview Scheduled">Interview Scheduled</option>
      <option value="Interviewing">Interviewing</option>
      <option value="Offered">Offered</option>
      <option value="Selected">Selected</option>
      <option value="Rejected">Rejected</option>
    </select>
  </label>
  <label style={styles.label}>
  Sort By
  <select
    style={styles.input}
    value={sortBy}
    onChange={(event) => setSortBy(event.target.value)}
  >
    <option value="newest">Newest First</option>
    <option value="oldest">Oldest First</option>
    <option value="company">Company Name (A–Z)</option>
  </select>
</label>
</div>

        {loading ? (
          <p style={styles.subtitle}>Loading applications...</p>
       ) : filteredApplications.length === 0 ? (

  <div style={styles.emptyState}>
    <h3>
      {applications.length === 0
        ? "No applications yet"
        : "No matching applications"}
    </h3>
    <p style={styles.subtitle}>
      {applications.length === 0
        ? "Add your first job application using the form above."
        : "Try a different search term or status filter."}
    </p>
    {applications.length > 0 && (
      <button
        type="button"
        style={styles.secondaryButton}
        onClick={() => {
          setSearchTerm("");
          setStatusFilter("All");
        }}
      >
        Clear Search & Filter
      </button>
    )}
  </div>
) : (

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Company</th>
                  <th style={styles.th}>Job Title</th>
                  <th style={styles.th}>Location</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Applied On</th>
                  <th style={styles.th}>Interview</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
  {sortedApplications.map((application) => (
    <tr key={application.id}>
                    <td style={styles.td}>
                      {application.companyName || "—"}
                    </td>
                    <td style={styles.td}>
                      {application.jobTitle || "—"}
                    </td>
                    <td style={styles.td}>
                      {application.location || "—"}
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          backgroundColor:
                            statusColors[application.status] || "#64748b",
                        }}
                      >
                        {application.status || "Applied"}
                      </span>
                    </td>
                   <td style={styles.td}>
  {application.appliedDate
    ? application.appliedDate.split("T")[0]
    : "—"}
</td>

                    <td style={styles.td}>
                      {application.interviewDate
                        ? application.interviewDate.split("T")[0]
                        : "—"}
                    </td>
                    <td style={styles.td}>
                      <div style={styles.rowActions}>
                        <button
                          style={styles.editButton}
                          onClick={() => handleEdit(application)}
                        >
                          Edit
                        </button>
                        <button
                          style={styles.deleteButton}
                          onClick={() => handleDelete(application.id)}
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
    </div>
  );
}

const styles = {
  page: {
    padding: "24px",
    color: "var(--text-primary, #172033)",
    background: "var(--app-bg, #f5f7fb)",
    minHeight: "100%",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },
  title: { margin: 0, fontSize: "28px" },
  subtitle: {
    color: "var(--text-secondary, #64748b)",
    marginTop: "8px",
  },
  counter: {
    padding: "12px 16px",
    borderRadius: "10px",
    background: "var(--panel-bg, #fff)",
    border: "1px solid var(--border-color, #e2e8f0)",
    fontWeight: 600,
  },
  card: {
    padding: "24px",
    marginBottom: "24px",
    borderRadius: "14px",
    background: "var(--panel-bg, #fff)",
    border: "1px solid var(--border-color, #e2e8f0)",
    boxShadow: "0 4px 16px rgba(15, 23, 42, 0.04)",
  },
  sectionTitle: { marginTop: 0, marginBottom: "20px", fontSize: "20px" },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    fontWeight: 600,
    fontSize: "14px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 12px",
    border: "1px solid var(--border-color, #e2e8f0)",
    borderRadius: "8px",
    background: "var(--input-bg, #fff)",
    color: "var(--text-primary, #172033)",
    font: "inherit",
  },
  actions: {
    display: "flex",
    gap: "12px",
    marginTop: "20px",
    flexWrap: "wrap",
  },
  primaryButton: {
    padding: "11px 18px",
    border: 0,
    borderRadius: "8px",
    background: "#6d5be7",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "11px 18px",
    border: "1px solid var(--border-color, #e2e8f0)",
    borderRadius: "8px",
    background: "var(--card-bg, #fff)",
    color: "var(--text-primary, #172033)",
    cursor: "pointer",
  },
  tableWrapper: { width: "100%", overflowX: "auto" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: "14px",
  },
  th: {
    padding: "13px 12px",
    background: "var(--hover-bg, #f1f5f9)",
    borderBottom: "1px solid var(--border-color, #e2e8f0)",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "13px 12px",
    borderBottom: "1px solid var(--border-color, #e2e8f0)",
    verticalAlign: "middle",
  },
  badge: {
    display: "inline-block",
    padding: "5px 9px",
    borderRadius: "20px",
    color: "#fff",
    fontSize: "12px",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  rowActions: { display: "flex", gap: "8px" },
  editButton: {
    padding: "7px 10px",
    border: 0,
    borderRadius: "6px",
    background: "#dbeafe",
    color: "#1d4ed8",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "7px 10px",
    border: 0,
    borderRadius: "6px",
    background: "#fee2e2",
    color: "#b91c1c",
    cursor: "pointer",
  },
  error: {
    padding: "12px 16px",
    marginBottom: "16px",
    borderRadius: "8px",
    background: "#fee2e2",
    color: "#991b1b",
  },
  success: {
    padding: "12px 16px",
    marginBottom: "16px",
    borderRadius: "8px",
    background: "#dcfce7",
    color: "#166534",
  },
  summaryGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "16px",
  marginBottom: "24px",
},

summaryCard: {
  background: "#1e293b",
  color: "#f8fafc",
  padding: "20px",
  borderRadius: "12px",
  border: "1px solid #334155",
  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
},

};

export default JobApplications;
