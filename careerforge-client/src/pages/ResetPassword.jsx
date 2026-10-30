import { useState } from "react";
import { resetPassword } from "../services/api";

function ResetPassword() {
 const queryParams = new URLSearchParams(window.location.search);

const email = queryParams.get("email") || "";
const token = queryParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!email || !token) {
      setMessage("Invalid or missing password reset link.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const data = await resetPassword(email, token, newPassword);
      setMessage(data.message || "Password reset successful!");

    setTimeout(() => {
  window.location.href = "/";
}, 2000);
    } catch (error) {
      setMessage(error.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="brand-icon">C</div>

        <h1>Reset Password</h1>
        <p>Enter and confirm your new password.</p>

        <label htmlFor="newPassword">New Password</label>
        <input
          id="newPassword"
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          minLength={8}
          required
        />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          minLength={8}
          required
        />

        {message && (
          <p
            className={
              message.toLowerCase().includes("successful")
                ? "success-message"
                : "error-message"
            }
          >
            {message}
          </p>
        )}

        <button
          className="primary-button login-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
