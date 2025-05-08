"use client";
import { useRouter } from "next/navigation";
import { Box, Typography, IconButton, Button } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import TvIcon from "@mui/icons-material/Tv";
import { Shift } from "ambient-cbg";

export default function Home() {
  const router = useRouter();

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      {/* 1) Fallback Gradient */}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "linear-gradient(to bottom, #004e7c, #9ddced)",
          zIndex: 0,
        }}
      />

      {/* 2) Shift Overlay */}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      >
        <Shift />
      </Box>

      {/* 3) Main Content */}
      <IconButton
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          color: "#fff",
          zIndex: 2,
        }}
        onClick={() => router.push("/login")}
      >
        <LoginIcon />
      </IconButton>

      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          background: "rgba(255, 255, 255, 0.2)",
          borderRadius: 4,
          padding: { xs: 3, sm: 5 },
          maxWidth: 500,
          width: "90%",
          textAlign: "center",
          boxShadow: "0 0 30px rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(6px)",
        }}
      >
        <Typography variant="h2" color="#fff" fontWeight="bold" gutterBottom>
          🎬 Interactive Timeline
        </Typography>

        <Typography variant="h6" sx={{ color: "whitesmoke", mb: 3 }}>
          Choose your mode to begin
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<ScreenShareIcon />}
            onClick={() => router.push("/controller")}
            sx={{
              backgroundColor: "primary.main",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
          >
            Controller
          </Button>

          <Button
            variant="contained"
            size="large"
            startIcon={<TvIcon />}
            onClick={() => router.push("/big-screen")}
            sx={{
              backgroundColor: "secondary.main",
              color: "#fff",
              "&:hover": {
                backgroundColor: "secondary.dark",
              },
            }}
          >
            Big Screen
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
