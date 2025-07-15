import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "../../assets/images/3techLogoDarkMode.png";
import "./Login.css";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom"; // Import Link from React Router
import useGTMEventTracker from "../../components/GoogleTagManager/useGTMEventTracker";
import api from "../../api/latestApi";
import { login } from "../../api/apiEndpoints";
import { successToast, errorToast, emailRgx } from "../../core/core-index";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../context/AuthContext";

const LoginFormschema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .matches(emailRgx, "Please enter a valid email")
    .max(64)
    .trim(),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(LoginFormschema) });
  const { t } = useTranslation();
  const trackEvent = useGTMEventTracker();
  const navigate = useNavigate();
  const { setStoreData, setUserData } = useAuth()
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (data) => {
    const formData = {
      email: data.email,
      password: data.password,
    };
    try {
      const response = await api.post(login, formData);
      if (response.code === 200) {
        const userData = response.data;
        localStorage.setItem("token", userData.token);
        setUserData(userData.customer);
        setStoreData(userData?.store)
        successToast("Login Successfully");
        // Redirect based on isStore property
        if (userData.user.isStore !== true) {
          // User doesn't have a store, redirect to store creation
          navigate("/store-creation");
        } else {
          // User has a store, redirect to dashboard
          navigate("/");
        }
      } else {
        errorToast(response?.data?.message)
      }
    } catch (error) {
      console.error(
        "Login Error:",
        error.response ? error.response.data : error
      );
      errorToast(
        error.response
          ? error.response.data.message
          : "Invalid credentials or server error"
      );
    }
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <div className="login-card">
          <div className="login-left">
            <h2>{t("Sign In")}</h2>
            <p>
              {t("Create a new account?")}{" "}
              <Link
                to="/signup"
                className="signup-link"
                onClick={() =>
                  trackEvent(
                    "click on Signup link",
                    "Navigation",
                    "Click",
                    "Signup link in Login page"
                  )
                }
              >
                {t("SignUp")}
              </Link>
            </p>
            <form className="login-form" onSubmit={handleSubmit(handleLogin)}>
              <div className="row mb-2">
                <div className="form-group">
                  <label htmlFor="fullName" className="mb-1 form-control-label">
                    {t("Email")} <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="email"
                    type="text"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <input
                        className={`form-control mb-2 ${errors?.fullName ? "error-input" : ""
                          }`}
                        type="text"
                        value={value}
                        onChange={onChange}
                        placeholder={t("Enter your email")}
                        autoComplete="false"
                      />
                    )}
                    defaultValue=""
                  />
                  <small>{errors?.email?.message}</small>
                </div>
              </div>
              <div className="row mb-2">
                <div className="form-group">
                  <label htmlFor="fullName" className="mb-1 form-control-label">
                    {t("Password")} <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <div className="pass-group">
                        <input
                          className={`form-control mb-2 ${errors?.password ? "error-input" : ""
                            }`}
                          type={showPassword ? "text" : "password"}
                          value={value}
                          onChange={onChange}
                          placeholder={t("Enter your password")}
                          autoComplete="false"
                        />
                        <span
                          className="toggle-password "
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i
                            className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"
                              }`}
                          ></i>
                        </span>
                      </div>
                    )}
                    defaultValue=""
                  />
                  <small>{errors?.password?.message}</small>
                </div>
              </div>

              <button
                type="submit"
                className="btn login-btn mt-3"
                onClick={() =>
                  trackEvent(
                    "click on User-login button",
                    "Navigation",
                    "Click",
                    "User-login button"
                  )
                }
              >
                {t("Login")}
              </button>
            </form>
          </div>

          <div className="login-right">
            <div className="logo-container">
              <img src={Logo} alt="Company Logo" className="company-logo" />
            </div>
            <h3>{t("Hello 👋")}</h3>
            <p className="web-p">
              {t(
                "Launch your online store with the 3tech platform and facilitate the sales process with a payment gateway and shipping companies with 3tech to make your vision a reality"
              )}
            </p>
            <p className="mobile-p">
              {t(
                "Launch your online store with the 3tech platform and facilitate the sales process with a payment gateway and shipping companies with 3tech to make your vision a reality"
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
