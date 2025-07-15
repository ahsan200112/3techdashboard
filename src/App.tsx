// src/App.tsx

import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/routes';
import './i18n';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { message, ConfigProvider } from 'antd';
import { setMessageApi } from './core/core-index';
import { LoadingProvider, useLoading } from './core/spinner/LoadingContext';
import { HashLoader } from 'react-spinners';
import { AuthProvider } from "./context/AuthContext.jsx"
const spinnerStyle: React.CSSProperties = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 9999,
};

const GlobalSpinner = () => {
  const { loading } = useLoading();
  return loading ? (
    <div style={spinnerStyle}>
      <HashLoader color="#DDDDDD" size={70} />
    </div>
  ) : null;
};

const App: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const savedLang = localStorage.getItem('i18nextLng') || 'en';
    document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
  }, []);

  useEffect(() => {
    setMessageApi(messageApi);
  }, [messageApi]);

  return (
    <LoadingProvider>
      <ConfigProvider>
        {contextHolder}
        <GlobalSpinner />
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
        <ToastContainer />
      </ConfigProvider>
    </LoadingProvider>
  );
};

export default App;
