import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1 className="text-4xl">Empower Ease</h1>
      <Link to="/sign-in" className="mr-4">
        Login
      </Link>
      <Link to="/sign-up">Register</Link>
    </div>
  );
};
export default Home;
