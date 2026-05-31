import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Aurora from "../components/Aurora";
import { COLORS, FONT, RADIUS } from "../styles/theme";
import { Logo, GoogleIcon } from "../components/Icons";
import { useAuth } from "../contexts/AuthContext";
import OrcidPromptModal from "../components/OrcidPromptModal";

const HomePage = () => {
  const navigate = useNavigate();
  const { login, user, loading, showOrcidModal, setShowOrcidModal } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const handleGoogleLogin = () => {
    window.google.accounts.id.initialize({
      client_id: "1089389799172-pe5fqqpah4glvkv622ti19bd9ik37fd4.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.prompt(); // opens Google popup
  };

  const handleCredentialResponse = async (response) => {
    try {
      await login(response.credential);
    } catch (err) {
      console.error("FULL ERROR:", err.response?.data || err.message);
    }
  };

  const handleOrcidDismiss = (linked) => {
    setShowOrcidModal(false);
    navigate("/dashboard");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return null; // Will redirect
  }

  return (
    <div className="home-container">
      {/* Aurora Background */}
      <Aurora
        colorStops={["#8061fc", "#2500b7", "#000000", "#2200a8"]}
        amplitude={1.9}
        blend={0.8}
      />

      {/* Foreground Content */}
      <div className="home-overlay">
        <div className="signin-content">
          {/* Brand */}
          <div className="brand">
            <Logo size={32} />
            <span className="brand-text">RIMS</span>
          </div>

          {/* Headline */}
          <h1 className="headline">
            Research Information
            <br />
            Management System
          </h1>

          {/* Subtitle */}
          <p className="subtitle">
            Advancing academic excellence through
            <br />
            innovative research management
          </p>

          <div className="divider" />

          {/* Google Sign-in Button */}
          <button
            className="signin-button"
            onClick={handleGoogleLogin}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(0,0,0,0.3)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = "none")
            }
          >
            <GoogleIcon size={20} />
            <span>Sign in with Google</span>
          </button>

          {/* Support Link */}
          <div className="support">
            <p>
              Having trouble logging in?{" "}
              <a href="#">Contact Support</a>
            </p>
          </div>
        </div>
      </div>

      {/* Component Styles */}
      <style>{`
        .home-container {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
        }

        .home-overlay {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          text-align: center;
          padding: 20px;
          color: #ffffff;
        }

        .signin-content {
          max-width: 520px;
          width: 100%;
          font-family: ${FONT.sans};
        }

        .brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 30px;
        }

        .brand-text {
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
        }

        .headline {
          font-family: ${FONT.serif};
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 400;
          line-height: 1.2;
          margin-bottom: 12px;
        }

        .subtitle {
          color: rgba(255, 255, 255, 0.85);
          font-size: 16px;
          margin-bottom: 30px;
        }

        .divider {
          width: 60%;
          height: 1px;
          background: rgba(255, 255, 255, 0.4);
          margin: 0 auto 30px auto;
        }

        .signin-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          padding: 14px 20px;
          border: 1.5px solid rgba(255, 255, 255, 0.5);
          border-radius: ${RADIUS.lg};
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(10px);
          cursor: pointer;
          width: 100%;
          max-width: 320px;
          margin: 0 auto;
          color: #ffffff;
          transition: all 0.2s ease;
          font-size: 16px;
          font-weight: 500;
        }

        .user-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(
            135deg,
            ${COLORS.crimsonLight},
            ${COLORS.teal}
          );
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 700;
          font-size: 14px;
          flex-shrink: 0;
        }

        .user-details {
          text-align: left;
          flex: 1;
        }

        .user-name {
          font-size: 13px;
          font-weight: 600;
        }

        .user-email {
          font-size: 12px;
          opacity: 0.85;
        }

        .support {
          margin-top: 40px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.8);
        }

        .support a {
          color: #7cff67;
          text-decoration: underline;
        }

        @media (max-width: 640px) {
          .headline {
            font-size: 28px;
          }

          .signin-button {
            max-width: 100%;
          }
        }
      `}</style>

      {showOrcidModal && <OrcidPromptModal onDismiss={handleOrcidDismiss} />}
    </div>
  );
};

export default HomePage;