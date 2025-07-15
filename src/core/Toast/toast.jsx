let messageApi = null;

export const setMessageApi = (api) => {
  messageApi = api;
};

const showToast = (type, content) => {
  if (!messageApi) return console.warn("messageApi not set!");
  messageApi.open({ type, content });
};

export const successToast = (message) => showToast("success", message);
export const errorToast = (message) => showToast("error", message);
export const infoToast = (message) => showToast("info", message);
export const warningToast = (message) => showToast("warning", message);
export const fielderrorToast = errorToast;
export const customerrorToast = errorToast;

export const loadingToast = () => {
  if (!messageApi) return console.warn("messageApi not set!");
  const key = 'loading_key';
  messageApi.open({
    type: 'loading',
    content: 'Loading...',
    key,
    duration: 0,
  });
  return () => messageApi.destroy(key);
};
