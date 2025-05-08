"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useWebSocketBigScreen from "@/hooks/useWebSocketBigScreen";
import { FourSquare } from "react-loading-indicators";
import { motion } from "framer-motion";
import FooterBigScreen from "@/app/components/FooterBigScreen";

export default function BigScreenPage() {
  const router = useRouter();
  const { currentMedia, isLoading, currentLanguage } = useWebSocketBigScreen();
  const [showContent, setShowContent] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

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

  const pinpoint = currentMedia?.pinpoint;

  return (
    <Box
      sx={{
        position: "relative",
        background: "linear-gradient(to bottom, #004e7c, #9ddced)",
        width: "100vw",
        height: "100vh",
        display: "flex",
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

        {!isLoading && showContent && currentMedia?.media?.type === "image" && (
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

        {!isLoading && showContent && currentMedia?.media?.type === "video" && (
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
        {pinpoint?.file?.url && (
          <motion.img
            src={pinpoint.file.url}
            alt="Pinpoint"
            initial={{ y: 0 }}
            animate={{ y: [0, -15, 0] }} // float up by 15px, then back to center
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              top: `${pinpoint.position.y}%`,
              left: `${pinpoint.position.x}%`,
              maxWidth: "400px",
              height: "auto",
              transform: "translate(-50%, -50%)",
              objectFit: "cover",
            }}
          />
        )}
      </Box>

      <FooterBigScreen />
    </Box>
  );
}
