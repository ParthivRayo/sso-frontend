// Home.js
import SignInLink from "@/components/ui/SignInLink";
import SignUpLink from "@/components/ui/SignUpLink";

const Home = () => {
  return (
    <div className="flex h-screen flex-col justify-between overflow-hidden bg-primary-blue text-white">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="w-full"></div>
        <h1 className="mb-20 mt-10 text-6xl font-bold">
          Empower <span className="italic text-primary-pink">Ease</span>
        </h1>
        <div className="mb-20 flex items-center justify-center space-x-4">
          <SignInLink />
          <SignUpLink />
        </div>
      </div>
    </div>
  );
};

export default Home;
