"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useWebSocketBigScreen from "@/hooks/useWebSocketBigScreen";
import { FourSquare } from "react-loading-indicators";
import { motion } from "framer-motion";
import FooterBigScreen from "@/app/components/FooterBigScreen";
import CloudsBackground from "../components/CloudsBackground";

export default function BigScreenPage() {
  const router = useRouter();
  const {
    currentMedia,
    isLoading,
    currentLanguage,
    allMedia,
    carbonActive,
    carbonLevel,
  } = useWebSocketBigScreen();
  const [showContent, setShowContent] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const getCarbonColor = (value) => {
    if (value < 20) return "#00c851"; // green
    if (value < 40) return "#a8e63f"; // yellow-green
    if (value < 60) return "#ffbb33"; // orange
    if (value < 80) return "#ff4444"; // red
    return "#3e0d0d"; // dark red
  };

  useEffect(() => {
    if (isLoading) {
      setShowLoader(true);
      setShowContent(false);
    } else {
      const timer = setTimeout(() => {
        setShowLoader(false);
        setShowContent(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, currentMedia]);

  if (carbonActive) {
    const carbonColor = getCarbonColor(carbonLevel);
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Box
          sx={{
            width: "100vw",
            height: "100vh",
            background: carbonColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Box
            component="img"
            src="/omanCity.png"
            alt="City Overlay"
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "contain",
              zIndex: 2,
            }}
          />
        </Box>
      </motion.div>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        display: "flex",
      }}
    >
      {/* ✅ Background Component */}
      <CloudsBackground />

      {/* Main Content */}
      <Box
        sx={{
          position: "relative",
          flex: "1 1 auto",
          display: "flex",
          flexDirection: "row",
          zIndex: 10, // foreground layer
        }}
      >
        {/* LEFT 70% */}
        <Box
          sx={{
            flex: "0 0 70%",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <IconButton
            sx={{
              position: "absolute",
              top: 20,
              left: 20,
              color: "#fff",
              zIndex: 9999,
            }}
            onClick={() => router.push("/")}
          >
            <ArrowBackIcon />
          </IconButton>

          {showLoader && (
            <Box sx={{ zIndex: 2 }}>
              <FourSquare
                color={["#32cd32", "#96D8EA", "#cd32cd", "#cd8032"]}
                size="large"
              />
            </Box>
          )}

          {!isLoading && showContent && !currentMedia && (
            <Box sx={{ position: "relative", width: "100%", height: "90%" }}>
              <Box
                component="img"
                src={currentLanguage === "en" ? "/CoverEn.gif" : "CoverAr.gif"}
                alt="Display Image"
                sx={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </Box>
          )}

          {!isLoading &&
            showContent &&
            currentMedia?.media?.type === "image" && (
              <Box
                component="img"
                src={currentMedia.media.url}
                alt="Display Image"
                sx={{
                  width: "90%",
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: "2rem",
                  zIndex: 2,
                }}
              />
            )}

          {!isLoading &&
            showContent &&
            currentMedia?.media?.type === "video" && (
              <Box
                component="video"
                src={currentMedia.media.url}
                autoPlay
                muted
                loop
                sx={{
                  width: "90%",
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: "2rem",
                  zIndex: 2,
                }}
              />
            )}
        </Box>

        {/* RIGHT 30% */}
        <Box
          sx={{
            flex: "0 0 30%",
            position: "relative",
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 10,
          }}
        >
          <Box
            component="img"
            src="/road.png"
            alt="Road"
            sx={{
              position: "absolute",
              bottom: 0,
              right: -200,
              height: "90%",
              objectFit: "contain",
            }}
          />
          {allMedia
            .filter((m) => m.pinpoint?.file?.url)
            .map((m) => {
              const isActive = currentMedia?._id === m._id;
              const pin = m.pinpoint;

              return (
                <motion.img
                  key={m._id}
                  src={pin.file.url}
                  alt="Pinpoint"
                  initial={false}
                  animate={isActive ? { y: [0, -15, 0] } : { y: 0 }}
                  transition={
                    isActive
                      ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      : {}
                  }
                  style={{
                    position: "absolute",
                    top: `${pin.position.y}%`,
                    left: `${pin.position.x}%`,
                    transform: "translate(-50%, -50%)",
                    zIndex: isActive ? 3 : 1,
                    opacity: isActive ? 1 : 0.9,
                  }}
                />
              );
            })}
        </Box>

        <FooterBigScreen />
      </Box>
    </Box>
  );
}
