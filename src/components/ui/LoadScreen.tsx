// LoadScreen.tsx
import backgroundImage from "/assets/rayologo.png"; // Adjust the path as necessary

const LoadScreen = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black">
      <img src={backgroundImage} alt="Background" className="h-32 w-32" />{" "}
      {/* Size 32x32 pixels */}
    </div>
  );
};

export default LoadScreen;
