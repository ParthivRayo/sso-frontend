import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "../App";
import Product from "../pages/Product";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
//import Home from "../pages/Home"; #Remove comments incase you want to add home page.

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index path="/" element={<SignIn />} />{" "}
      {/* Default route can be changed to home if home page is needed */}
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/product" element={<Product />} />
    </Route>,
  ),
);
