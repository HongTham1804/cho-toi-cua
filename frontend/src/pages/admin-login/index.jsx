import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, UserRound } from "lucide-react";
import { loginAdmin } from "../../services/adminAuthApi";
import logoMain from "../../assets/logo-main.png";
import "./admin-login.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await loginAdmin({ identifier, password, remember });
      navigate("/admin-dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(error.message || "Không thể đăng nhập quản trị.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <div className="admin-login-brand">
          <div className="admin-login-brand-overlay" />
          <img className="admin-login-corner-logo" src={logoMain} alt="Chợ Tới Cửa" />
          <div className="admin-login-brand-content">
            <div>
              <h1>Chợ Tới Cửa</h1>
              <p>Không gian quản trị dành cho chủ hệ thống.</p>
            </div>
          </div>
        </div>

        <div className="admin-login-form-panel">
          <div className="admin-login-heading">
            <span>Quản trị hệ thống</span>
            <h2>Đăng nhập Admin</h2>
          </div>

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <label className="admin-login-field" htmlFor="admin-identifier">
              <span>Email</span>
              <div className="admin-login-input-wrap">
                <UserRound size={18} />
                <input
                  id="admin-identifier"
                  type="text"
                  placeholder="admin@example.com"
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  required
                />
              </div>
            </label>

            <label className="admin-login-field" htmlFor="admin-password">
              <span>Mật khẩu</span>
              <div className="admin-login-input-wrap">
                <Lock size={18} />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu quản trị"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button
                  type="button"
                  className="admin-login-eye"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <label className="admin-login-remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />
              <span>Ghi nhớ đăng nhập</span>
            </label>

            {errorMessage && <p className="admin-login-error">{errorMessage}</p>}

            <button className="admin-login-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
