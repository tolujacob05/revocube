import { useState, useEffect } from "react";

export const useLottieAnimation = (duration = 12000) => {
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPlaying(false);
    }, duration); // Pause after the specified duration

    return () => clearTimeout(timer);
  }, [duration]);

  const handleMouseEnter = () => setIsPlaying(true);

  const handleMouseLeave = () => setIsPlaying(false);

  return { isPlaying, handleMouseEnter, handleMouseLeave };
};
