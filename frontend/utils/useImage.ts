import { useEffect, useRef, useState } from "react";

export default function useImage<T extends HTMLElement>() {
  const [imageProps, setImageProps] = useState<{
    height: number;
    width: number;
  }>({
    height: 0,
    width: 0,
  });

  // Create a ref that is typed based on T
  const ref = useRef<T | null>(null);

  useEffect(() => {
    function setDimensions() {
      if (ref.current && "getBoundingClientRect" in ref.current) {
        const { height, width } = ref.current.getBoundingClientRect();
        setImageProps({ height, width });
      }
    }
    window.addEventListener("resize", setDimensions);
    setDimensions();
    return () => window.removeEventListener("resize", setDimensions);
  }, []);

  return { imageProps, ref };
}
