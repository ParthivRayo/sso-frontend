import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "../App";
import SignIn from "../pages/SignIn";
import AfterLogin from "../pages/AfterLogin"; // Ensure you have an AfterLogin component

//import Home from "../pages/Home"; #Remove comments incase you want to add home page.

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index path="/" element={<SignIn />} />{" "}
      {/* Default route can be changed to home if home page is needed */}
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/after-login" element={<AfterLogin />} /> // Add this line
    </Route>,
  ),
);
