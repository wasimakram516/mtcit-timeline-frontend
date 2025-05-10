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
          backgroundColor: 0xffffff,
          skyColor: 0x68b8d7,
          cloudColor: 0xadc1de,
          cloudShadowColor: 0x183550,
          sunColor: 0xffffff,
          sunGlareColor: 0x164152,
          sunlightColor: 0xffffff,
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
        top: "-35vh",
        left: 0,
        width: "100%",
        height: "110%",
        zIndex: -10,
      }}
    />
  );
}
