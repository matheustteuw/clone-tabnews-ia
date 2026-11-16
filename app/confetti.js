"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// O confete é decorativo: carrega em um chunk separado, só no navegador,
// para não pesar no bundle inicial nem atrasar a hidratação.
const ReactConfetti = dynamic(() => import("react-confetti"), { ssr: false });

export default function Confetti() {
  const [size, setSize] = useState(null);

  useEffect(() => {
    function updateSize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  if (!size) return null;

  return (
    <ReactConfetti
      width={size.width}
      height={size.height}
      recycle={false}
      numberOfPieces={500}
      style={{ position: "fixed", inset: 0, pointerEvents: "none" }}
    />
  );
}
