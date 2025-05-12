"use client";
import { Box, IconButton, Typography } from "@mui/material";
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
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
        gap: 4,
      }}
    >
      <LanguageSelector />
      <IconButton
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
          color: "black",
          zIndex: 99,
        }}
        onClick={() => {
          sendCarbonMode(false, 0);
          router.push("/controller");
        }}
      >
        <ArrowBackIcon />
      </IconButton>
      <Typography
              variant="h4"
              fontWeight="bold"
              dir={language === "ar" ? "rtl" : "ltr"}
              sx={{
                color: "#333",
                letterSpacing: 1,
              }}
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
        variant="h5"
        fontWeight="bold"
        dir={language === "ar" ? "rtl" : "ltr"}
        sx={{ color: "#444", letterSpacing: 1 }}
      >
        {translations[language].subtitle}
      </Typography>
    </Box>
  );
}
