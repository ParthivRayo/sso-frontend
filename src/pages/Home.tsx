import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1 className="text-4xl">Empower Ease</h1>
      <Link to="/login" className="mr-4">
        Login
      </Link>
      <Link to="/register">Register</Link>
    </div>
  );
};
export default Home;
