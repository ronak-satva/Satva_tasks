import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { ConfigProvider } from 'antd';

ReactDOM.createRoot(document.getElementById("root")).render(
   <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1e3a5f',
          },
        }}
      >
         <App />
      </ConfigProvider>
  </Provider>
);
