import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router.tsx";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./lib/authConfig.ts";
import "@babel/polyfill";

import "./index.css";

const clientId =
  "276094879389-gsk0c669f2gfpavksl1rn7osa6og7i3t.apps.googleusercontent.com"; // Replace with your actual Google client ID

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <GoogleOAuthProvider clientId={clientId}>
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </MsalProvider>
  </React.StrictMode>,
);
