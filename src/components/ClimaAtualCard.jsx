import React from "react";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import GrainIcon from "@mui/icons-material/Grain";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import FilterDramaIcon from "@mui/icons-material/FilterDrama";
import { Card, CardContent, Typography, Box } from "@mui/material";

const weatherDescriptions = {
  0: { desc: "Céu limpo", icon: <WbSunnyIcon fontSize="large" /> },
  1: { desc: "Principalmente limpo", icon: <WbSunnyIcon fontSize="large" /> },
  2: { desc: "Parcialmente nublado", icon: <FilterDramaIcon fontSize="large" /> },
  3: { desc: "Nublado", icon: <FilterDramaIcon fontSize="large" /> },
  45: { desc: "Névoa", icon: <FilterDramaIcon fontSize="large" /> },
  48: { desc: "Névoa congelante", icon: <AcUnitIcon fontSize="large" /> },
  51: { desc: "Garoa leve", icon: <GrainIcon fontSize="large" /> },
  61: { desc: "Chuva leve", icon: <GrainIcon fontSize="large" /> },
  63: { desc: "Chuva moderada", icon: <GrainIcon fontSize="large" /> },
  80: { desc: "Chuvas passageiras", icon: <GrainIcon fontSize="large" /> },
  95: { desc: "Trovoadas", icon: <ThunderstormIcon fontSize="large" /> },
};

export default function ClimaAtualCard({ climaAtual, cidade, extras }) {
  const codigo = climaAtual.weathercode;
  const { desc, icon } = weatherDescriptions[codigo] || {
    desc: "Desconhecido",
    icon: <FilterDramaIcon fontSize="large" />,
  };

  return (
    <Card
      sx={{
        margin: 2,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderRadius: 2,
        // boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        border: "1px solid rgba(255, 255, 255, 0.18)",
        color: "#fff",
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ textAlign: "center", fontSize: { xs: "1.4rem", sm: "1.8rem" } }}
        >
          {cidade}
        </Typography>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-evenly"
          gap={2}
          mb={1}
          flexDirection={{ xs: "column", sm: "row" }}
          textAlign={{ xs: "center", sm: "left" }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            {icon}
            <Typography
              variant="h4"
              sx={{ lineHeight: 1, fontSize: { xs: "2rem", sm: "2.5rem" } }}
            >
              {climaAtual.temperature}°C
            </Typography>
          </Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ fontSize: { xs: "1.5rem", sm: "2rem" }, marginTop: { xs: 1, sm: 0 } }}
          >
            {desc}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
