import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "../../assets/images/3techLogoDarkMode.png";
import "./Signup.css";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom"; // Import Link from React Router
import useGTMEventTracker from "../../components/GoogleTagManager/useGTMEventTracker";
import api from "../../api/latestApi";
//import GoogleButton from 'react-google-button';
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase"; // adjust path if needed
import { register, googleSignup } from "../../api/apiEndpoints";
import { FcGoogle } from "react-icons/fc";
import {
  successToast,
  errorToast,
  emailRgx,
  SpecialCharacters,
  passwordRegex,
} from "../../core/core-index";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
const RegisterFormschema = yup.object({
  fullName: yup.string().required("Full Name is required").nullable(),
  email: yup
    .string()
    .required("Email is required")
    .matches(emailRgx, "Please enter a valid email")
    .max(64)
    .trim(),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password should be at least 6 characters")
    .max(10, "Password should be maximum 10 characters")
    .matches(SpecialCharacters, "At least one special character")
    .matches(passwordRegex, "At least one uppercase & lowercase")
    .trim(),
});

const Signup = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(RegisterFormschema) });

  const { t } = useTranslation();
  const trackEvent = useGTMEventTracker();

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const handleSignup = async (data) => {
    const formData = {
      fullName: data?.fullName,
      email: data?.email,
      password: data?.password
    }
    try {
      const response = await api.post(register, formData);
      if (response.code === 200) {
        successToast("Signup successful! Please verify your email.");
        localStorage.setItem("unverifiedEmail", formData.email);
        navigate("/verify-email");
      } else {
        errorToast(response.data.message || "Signup failed.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      errorToast("Something went wrong.");
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();
      const response = await api.post(googleSignup, { token });
      const userData = await response.data;

      if (response.code === 200) {
        successToast("Google Sign-in successful!");
        localStorage.setItem("token", userData.token);

        // Redirect based on isStore property
        if (userData.user.isStore === false) {
          // User doesn't have a store, redirect to store creation
          navigate("/store-creation");
        } else {
          // User has a store, redirect to dashboard
          navigate("/");
        }
      } else {
        errorToast(response.data.message);
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      errorToast("Google Sign-in failed.");
    }
  };

  return (
    <div className="signup-background">
      <div className="signup-container">
        <div className="signup-card">
          {/* Left Section: Create Account */}
          <div className="signup-left">
            <h2>{t("Create Account")}</h2>
            <p>
              {t("Already have an account?")}{" "}
              <Link
                to="/login"
                className="login-link"
                onClick={() =>
                  trackEvent(
                    "click on login link",
                    "Navigation",
                    "Click",
                    "Login link in SignUp page"
                  )
                }
              >
                {t("Login")}
              </Link>
            </p>
            <form className="signup-form" onSubmit={handleSubmit(handleSignup)}>
              <div className="row mb-2">
                <div className="form-group">
                  <label htmlFor="fullName" className="mb-1 form-control-label">
                    {t("Full Name")} <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="fullName"
                    type="text"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <input
                        className={`form-control mb-1 ${errors?.fullName ? "error-input" : ""
                          }`}
                        type="text"
                        value={value}
                        onChange={onChange}
                        placeholder={t("Enter your Full Name")}
                        autoComplete="false"
                      />
                    )}
                    defaultValue=""
                  />
                  <small>{errors?.fullName?.message}</small>
                </div>
              </div>
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
                  <label htmlFor="fullName" className="mb-1form-control-label">
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
              <button type="submit" className="btn signup-btn">
                {t("Sign Up")}
              </button>
            </form>
            <button
              type="button"
              className="btn google-btn mt-3 d-flex align-items-center justify-content-center gap-2"
              onClick={handleGoogleSignup}
            >
              <FcGoogle size={20} />
              Continue with Google
            </button>
          </div>

          <div className="signup-right">
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

export default Signup;
