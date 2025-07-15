import React, { useContext, useState } from "react";
import { CreationStoreContext } from "./CreationStore.control";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import Logo from "../../assets/images/3techLogoDarkMode.png";

const categoryOptions = [
  { value: "fashion", label: "Fashion" },
  { value: "electronics", label: "Electronics" },
  { value: "groceries", label: "Groceries" },
  { value: "books", label: "Books" },
];
const CreationStore = () => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState(null);
  const { storeSchema, onSubmit } = useContext(CreationStoreContext);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(storeSchema) });
  return (
    <>
      <div className="signup-background">
        <div className="signup-container">
          <div className="signup-card">
            {/* Left Section: Create Account */}
            <div className="signup-left">
              <h2>{t("Create Store")}</h2>
              <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="form-group">
                    <label className="mb-1 form-control-label">
                      {t("Store Name")} <span className="text-danger">*</span>
                    </label>
                    <Controller
                      name="name"
                      type="text"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <input
                          className={`form-control mb-1 ${
                            errors?.name ? "error-input" : ""
                          }`}
                          type="text"
                          value={value}
                          onChange={onChange}
                          placeholder={t("Enter store name")}
                          autoComplete="false"
                        />
                      )}
                      defaultValue=""
                    />
                    <small>{errors?.name?.message}</small>
                  </div>
                </div>
                <div className="row">
                  <div className="form-group">
                    <label className="mb-1 form-control-label">
                      {t("Store Category")}{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <Controller
                      name="category"
                      type="text"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <input
                          className={`form-control mb-1 ${
                            errors?.category ? "error-input" : ""
                          }`}
                          type="text"
                          value={value}
                          onChange={onChange}
                          placeholder={t("Select your category")}
                          autoComplete="false"
                        />
                      )}
                      defaultValue=""
                    />
                    <small>{errors?.category?.message}</small>
                  </div>
                </div>
                <div className="row">
                  <div className="form-group">
                    <label className="mb-1 form-control-label">
                      {t("Store Logo")} <span className="text-danger">*</span>
                    </label>
                    <Controller
                      name="image"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <>
                          <input
                            type="file"
                            accept="image/*"
                            className="form-control mb-2"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                onChange(file);
                                setPreview(URL.createObjectURL(file)); 
                              }
                            }}
                          />
                          {preview ? (
                            <div className="img-preview mt-2">
                              <img
                                src={preview}
                                alt="Preview"
                                style={{
                                  height: "100px",
                                  width: "100px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                  border: "1px solid #ddd",
                                }}
                              />
                            </div>
                          ) : (
                            <p className="text-muted mt-2">
                              {t("No image selected")}
                            </p>
                          )}
                        </>
                      )}
                    />
                    <small>{errors?.image?.message}</small>
                  </div>
                </div>
                <button type="submit" className="btn signup-btn">
                  {t("Create")}
                </button>
              </form>
            </div>
            <div className="signup-right">
              <div className="logo-container">
                <img src={Logo} alt="Company Logo" className="company-logo" />
              </div>
              <h3>{t("Welcome To Your Website!")}</h3>
              <p className="web-p">
                {t(
                  "Manage sales, inventory, and customer insights seamlessly with a POS system designed for modern businesses. Streamline operations, boost efficiency, and deliver exceptional customer experiences. Empower your business with real-time data and smart decision-making tools."
                )}
              </p>
              <p className="mobile-p">
                {t(
                  "Manage sales, inventory, and customer insights seamlessly with a POS  system designed for modern businesses."
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreationStore;
