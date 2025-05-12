"use client";
import { useEffect, useRef } from "react";
import { Box } from "@mui/material";

export default function CloudsBackground() {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  useEffect(() => {
    let canceled = false;

    async function loadVanta() {
      const VANTA = await import("vanta/dist/vanta.clouds.min");
      const THREE = await import("three");

      if (!canceled) {
        vantaEffect.current = VANTA.default({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          skyColor: 0xafe9ff,
          cloudColor: 0xe6e6e6,
          cloudShadowColor: 0xd7f1ff,
          sunColor: 0xfae5c0,
          sunGlareColor: 0xb2d6ff,
          sunlightColor: 0xdcffff,
          speed: 1,
        });
      }
    }

    loadVanta();

    return () => {
      canceled = true;
      if (vantaEffect.current) vantaEffect.current.destroy();
    };
  }, []);

  return (
    <Box
      ref={vantaRef}
      sx={{
        position: "absolute",
        top: "-15vh",
        left: 0,
        width: "100%",
        height: "110%",
        zIndex: -10,
      }}
    />
  );
}
