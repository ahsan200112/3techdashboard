import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../api/latestApi";
import { editMail } from "../api/apiEndpoints";
import { errorToast, successToast } from "../core/core-index";

const ChangeEmail = () => {
  const { t } = useTranslation();
  const oldEmail = localStorage.getItem("unverifiedEmail");
  const [email, setEmail] = useState(localStorage.getItem("unverifiedEmail"));
  const handleUpdateEmail = async () => {
    const response = await api.post(editMail, { oldEmail, newEmail: email });
    // if (response.code === 200) {
    //   navigate("/verify-email");
    //   localStorage.setItem("unverifiedEmail", email);
    //   successToast("OTP send to new mail");
    // } else {
    //   errorToast(response.data.message);
    // }
  };
  return (
    <>
      <div className="otp-verification-page">
        <div className="otp-container">
          <h1>{t("Update Email")}</h1>
          <p>{t("Enter your active mail to send a OTP")}</p>
          <div className="update-email-section d-flex">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter correct email"
              className="email-input"
            />
            <button onClick={handleUpdateEmail} className="update-email-button">
              Edit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangeEmail;
