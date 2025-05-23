import React from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2"; // importante!

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);


 function formatarData(isoString) {
  const data = new Date(isoString);

  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const hora = String(data.getHours()).padStart(2, '0');
  const minuto = String(data.getMinutes()).padStart(2, '0');

  return `${dia}/${mes} - ${hora}:${minuto}`;
}

export default function Grafico({ dados }) {
  const labels = dados.map((item) => formatarData(item.hora));
  const temperaturas = dados.map((item) => item.temperatura);
  const chuvas = dados.map((item) => item.chuva); // Supondo que item.chuva contenha o valor da chuva

  const data = {
    labels,
    datasets: [
      {
        label: "Temperatura (°C)",
        data: temperaturas,
        borderColor: "#ff6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
        fill: true,
        pointRadius: 2,
        pointHoverRadius: 6,
        pointBorderWidth: 1
      },
      {
        label: "Chuva (mm)",
        data: chuvas,
        borderColor: "#36a2eb",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.4,
        fill: true,
        pointRadius: 2,
        pointHoverRadius: 6,
        pointBorderWidth: 1
      },
      {
        label: "Chuva (mm)",
        data: chuvas,
        borderColor: "#36a2eb",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.4,
        fill: true,
        pointRadius: 2,
        pointHoverRadius: 6,
        pointBorderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Temperatura e Chuva por Hora",
        font: { size: 20, weight: "bold", family: "Inter" },
        color: "#000000"
      },
      legend: {
        labels: { color: "#000000", font: { size: 14 } }
      }
    },
    scales: {
      x: {
        ticks: { color: "#000000" },
        grid: { color: "#cccccc" }
      },
      y: {
        ticks: { color: "#000000" },
        grid: { color: "#cccccc" },
        beginAtZero: true
      }
    }
  };

  return (
    <div style={{ height: "400px", width: "800px" }}>
      <Line data={data} options={options} />
    </div>
  );
}

