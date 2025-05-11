"use client";
import { useRef, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Input } from "@mui/icons-material"; // MUI Icon
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const CarbonSlider = ({ value = 50, onChange }) => {
  const trackRef = useRef(null);
  const [trackWidth, setTrackWidth] = useState(200);

  const x = useMotionValue(value);

  useEffect(() => {
    animate(x, value, { duration: 0.2 });
  }, [value]);

  useEffect(() => {
    if (trackRef.current) {
      setTrackWidth(trackRef.current.offsetWidth);
    }
  }, []);

  const inputRange = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const outputRange = [
    "#00c851", "#33d17c", "#a8e63f", "#f1c40f",
    "#ffbb33", "#ff9933", "#ff7043", "#ff4444",
    "#e53935", "#d32f2f", "#b71c1c"
  ];

  const xPercent = useTransform(x, (v) => `${v}%`);
  const pixelLeft = useTransform(x, (v) => {
    const maxOffset = trackWidth - 20; // 20 = thumb width
    return `${(v / 100) * maxOffset}px`;
  });
  const color = useTransform(x, inputRange, outputRange);

  const updateFromPosition = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    const relX = clientX - rect.left;
    const percent = clamp((relX / rect.width) * 100, 0, 100);
    x.set(percent);
    onChange?.(Math.round(percent));
  };

  return (
    <Box
      ref={trackRef}
      sx={{
        width: 200,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#eee",
        position: "relative",
        overflow: "hidden",
        boxShadow: "inset 0 0 8px rgba(0,0,0,0.15)",
        cursor: "pointer",
        userSelect: "none",
      }}
      onClick={(e) => updateFromPosition(e.clientX)}
      onMouseMove={(e) => {
        if (e.buttons === 1) updateFromPosition(e.clientX);
      }}
    >
      {/* Fill */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: xPercent,
          background: color,
          borderRadius: "inherit",
          transition: "width 0.2s ease",
        }}
      />

      {/* Thumb */}
      <motion.div
        drag="x"
        dragConstraints={trackRef}
        dragElastic={0}
        style={{
          position: "absolute",
          top: "50%",
          left: pixelLeft,
          width: 20,
          height: 20,
          borderRadius: "50%",
          backgroundColor: "#fff",
          border: "2px solid #333",
          transform: "translateY(-50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          opacity:0,
          boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
        }}
        onDrag={(e, info) => updateFromPosition(info.point.x)}
        whileTap={{ scale: 1.2 }}
      />
        
    </Box>
  );
};

export default CarbonSlider;
