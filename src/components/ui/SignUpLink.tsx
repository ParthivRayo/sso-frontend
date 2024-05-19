// SignUpLink.js
import { Link } from "react-router-dom";

const SignUpLink = () => {
  return (
    <Link
      to="/sign-up"
      className="inline-block rounded-full bg-purple-600 px-10 py-5 text-3xl font-bold text-white shadow-md transition duration-300 ease-in-out hover:bg-purple-700 hover:shadow-lg"
    >
      Register
    </Link>
  );
};

export default SignUpLink;
