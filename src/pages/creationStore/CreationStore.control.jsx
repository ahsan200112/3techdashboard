import React, { createContext } from "react";
import * as yup from "yup";
import api from "../../api/latestApi";
import { errorToast, successToast } from "../../core/Toast/toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const storeSchema = yup.object().shape({
  name: yup.string().required("Store name is required"),
  category: yup.string().required("Category is required"),
});
const CreationStoreContext = createContext({
  storeSchema: storeSchema,
  onSubmit: () => { },
});


const CreationStoreController = (props) => {
  const navigate = useNavigate();
const { setStoreData } = useAuth();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("category", data.category);
      formData.append("image", data.image);

      const response = await api.post("/api/store/add", formData);
      if (response.code === 200) {
        successToast("Store created successfully");
        // Update user data in localStorage to reflect that they now have a store
        setStoreData(response.data);
        navigate("/");
      } else {
        errorToast(response.data.message);
      }
    } catch (error) { }
  };
  return (
    <CreationStoreContext.Provider value={{ storeSchema, onSubmit }}>
      {props.children}
    </CreationStoreContext.Provider>
  );
};

export { CreationStoreContext, CreationStoreController };
