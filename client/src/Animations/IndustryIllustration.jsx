import Lottie from "lottie-react";
import factoryAnimation from "../assets/animations/factory.json"; // Download from lottiefiles

export default function IndustryIllustration() {
  return (
    <div className="w-100 pt-10">
      <Lottie animationData={factoryAnimation} loop={true} />
    </div>
  );
}
