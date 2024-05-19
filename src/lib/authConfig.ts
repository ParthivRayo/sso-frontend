import { PublicClientApplication } from "@azure/msal-browser"; //import LogLevel if needed

const config = {
  auth: {
    clientId: "60d3822b-f99e-42a4-aec9-2b4057f419e3", // Replace with your Application (client) ID
    authority:
      "https://login.microsoftonline.com/d990e2ca-a17f-4f34-8c22-571ff19ea12f", // Replace with your Directory (tenant) ID
    redirectUri: "https://sso-frontend-xi.vercel.app",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      //loggerLevel: LogLevel.Info,
    },
  },
};

export const msalInstance = new PublicClientApplication(config);

export const loginRequest = {
  scopes: ["User.Read"],
};
