"use client";
import { Box, IconButton, Typography, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useWebSocketController from "@/hooks/useWebSocketController";
import CarbonSlider from "@/app/components/CarbonSlider";
import LanguageSelector from "@/app/components/LanguageSelector";

export default function CarbonFootprintPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { sendCarbonMode, connected } = useWebSocketController();
  const [carbonValue, setCarbonValue] = useState(100);

  const translations = {
    en: {
      title: "Reduce carbon footprint...",
      subtitle: "and see the city turn green!",
    },
    ar: {
      title: "قلل من البصمة الكربونية...",
      subtitle: "وشاهد المدينة تتحول إلى الخُضرة!",
    },
  };

  useEffect(() => {
    if (connected) {
      sendCarbonMode(true, 100);
    }
  }, [connected]);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        bgcolor: "#d9d9d9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        px: 2,
      }}
    >
      {/* Back Button */}
      <IconButton
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
          color: "#333",
          zIndex: 10,
        }}
        onClick={() => {
          sendCarbonMode(false, 0);
          router.push("/controller");
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* Language Selector */}
      <Box sx={{ position: "absolute", top: 20, right: 20 }}>
        <LanguageSelector />
      </Box>

      {/* Main Content Box */}
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 500,
          p: 4,
          borderRadius: 4,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          dir={language === "ar" ? "rtl" : "ltr"}
          sx={{ color: "#333", letterSpacing: 1 }}
        >
          {translations[language]?.title || translations.en.title}
        </Typography>

        <CarbonSlider
          value={carbonValue}
          onChange={(val) => {
            setCarbonValue(val);
            sendCarbonMode(true, val);
          }}
        />

        <Typography
          variant="h6"
          fontWeight="bold"
          dir={language === "ar" ? "rtl" : "ltr"}
          sx={{ color: "#444", letterSpacing: 1 }}
        >
          {translations[language]?.subtitle || translations.en.subtitle}
        </Typography>
      </Paper>
    </Box>
  );
}
