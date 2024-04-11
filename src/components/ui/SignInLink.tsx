// SignInLink.js
import { Link } from "react-router-dom";

const SignInLink = () => {
  return (
    <Link
      to="/sign-in"
      className="inline-block rounded-full bg-primary-pink px-10 py-5 text-3xl font-bold text-white shadow-md transition duration-300 ease-in-out hover:bg-pink-700 hover:shadow-lg"
    >
      Login
    </Link>
  );
};

export default SignInLink;
