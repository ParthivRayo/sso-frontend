import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container">
      <h1 className="text-4xl">Empower Ease</h1>
      <Link to="/sign-in" className="mr-4">
        Sign In
      </Link>
      <Link to="/sign-up">Sign Up</Link>
    </div>
  );
};
export default Home;
