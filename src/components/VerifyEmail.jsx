import React, { useState, useEffect } from "react";
import api from "../api/latestApi";
import { useNavigate } from "react-router-dom";
import { verifyEmail, resendVerificationCode } from "../api/apiEndpoints";
import { successToast, errorToast } from "../core/core-index";
import { useTranslation } from "react-i18next";

const VerifyEmail = () => {
  const [resendTimer, setResendTimer] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const email = localStorage.getItem("unverifiedEmail");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  useEffect(() => {
    if (!email) {
      errorToast("No email found. Please register again.");
      navigate("/signup");
    }
  }, [email, navigate]);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    } else {
      setIsResendEnabled(true);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleResendCode = async () => {
    try {
      const response = await api.post(resendVerificationCode, { email });
      if (response.code === 200) {
        successToast("Verification code resent to your email.");
        setResendTimer(60);
      } else {
        errorToast(response.data.message || "Could not resend code.");
      }
    } catch (error) {
      console.error("Resend error:", error);
      errorToast("Failed to resend verification code.");
    }
  };

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (otp.length < 6) {
      errorToast("OPT length should be 6");
      return;
    }
    const data = {
      email,
      otp: enteredOtp,
    };
    const response = await api.post(verifyEmail, data);
    if (response.code === 200) {
      successToast("Email verified successfully!");
      localStorage.removeItem("unverifiedEmail");
      navigate("/login");
    } else {
      errorToast(response.data.message || "Verification failed");
    }
  };
  const handleChangeEmail = () => {
    navigate("/enter-email");
  };
  return (
    <>
      <div className="otp-verification-page">
        <div className="otp-container">
          <h1>{t("OTP Verification")}</h1>
          <p>{t("Enter the 6-digit OTP sent to your registered email.")}</p>
          <form onSubmit={handleOtpVerification} className="otp-form">
            <div className="otp-input-container">
              {otp.map((digit, index) => {
                return (
                  <input
                    id={`otp-input-${index}`}
                    type="text"
                    maxLength="1"
                    key={index}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="otp-input"
                  />
                );
              })}
            </div>
            <button type="submit" className="verify-button">
              {t("Verify OTP")}
            </button>
          </form>
          <button
            type="button"
            onClick={handleResendCode}
            className="resend-button"
            disabled={!isResendEnabled}
          >
            {isResendEnabled
              ? t("resend_otp")
              : t("resend_in_seconds", { count: resendTimer })}
          </button>
          {/* <p className="change-email-text">
            {t("Entered wrong email?")}{" "}
            <button
              type="button"
              onClick={handleChangeEmail}
              className="change-email-link"
            >
              {t("Change Email")}
            </button>
          </p> */}
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
