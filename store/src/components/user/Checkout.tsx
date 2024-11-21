import { useRef } from "react";
import Lottie from "react-lottie-player";
import checkout from "@/assets/json/checkout.json";
import { useLottieAnimation } from "@/lib/utils/lottie-animation";

function Checkout() {
  const lottieRef = useRef(null);
  const { isPlaying, handleMouseEnter, handleMouseLeave } =
    useLottieAnimation(12000);
  return (
    <>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Lottie
          loop={isPlaying}
          animationData={checkout}
          play={isPlaying}
          ref={lottieRef}
          className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80"
        />
      </div>
    </>
  );
}

export default Checkout;
