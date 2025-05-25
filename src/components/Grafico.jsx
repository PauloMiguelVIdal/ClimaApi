import { Line } from "react-chartjs-2";
import { useMemo } from "react";
import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  LineController,
  BarController,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";

// Registre todos os componentes necessários
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  LineController,  // Controlador para gráficos de linha
  BarController,   // Controlador para gráficos de barra
  Title,
  CategoryScale,
  Tooltip,
  Legend,
  BarElement
);
const formatarData = (data) => {
  const d = new Date(data);
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const hora = String(d.getHours()).padStart(2, "0");
  const minuto = String(d.getMinutes()).padStart(2, "0");
  return `${dia}/${mes} - ${hora}:${minuto}`;
};

const formatarDataDia = (data) => {
  const d = new Date(data);
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  return `${dia}/${mes}`;
};


const criarLabelsUnicasPorDia = (labelsHora) => {
  const datasVistas = new Set();
  return labelsHora.map(label => {
    const dia = label.split(" - ")[0];
    if (datasVistas.has(dia)) {
      return "";
    } else {
      datasVistas.add(dia);
      return dia;
    }
  });
};

function obterEstiloDeFundo(horarioLocal) {
  const hora = new Date(horarioLocal).getHours();

  if (hora >= 5 && hora < 11) {
    // Manhã
    return {
      background: "radial-gradient(circle at top, #FFFAE5, #87CEFA)",
    };
  } else if (hora >= 11 && hora < 17) {
    // Tarde
    return {
      background: "radial-gradient(circle at center, #FFFACD, #00BFFF)",
    };
  } else if (hora >= 17 && hora < 20) {
    // Entardecer
    return {
      background: "radial-gradient(circle at bottom, #FFD580, #1E90FF)",
    };
  } else {
    // Noite/Madrugada
    return {
      background: "radial-gradient(circle at center, #0d1b2a, #1b263b)",
    };
  }
}

export default function Grafico({ dados, dadosDiarios }) {
  const labelsHora = dados.map((item) => formatarData(item.hora));
  const temperaturas = dados.map((item) => item.temperatura);
  const chuvas = dados.map((item) => item.chuva);

  const diasFormatados = dadosDiarios.map((item) => formatarDataDia(item.data));
  const temperaturaMin = dadosDiarios.map((item) => item.temperaturaMin);
  const temperaturaMax = dadosDiarios.map((item) => item.temperaturaMax);

  const temperaturaMinInterpolada = labelsHora.map((label) => {
    const dataLabel = label.split(" - ")[0];
    const index = diasFormatados.indexOf(dataLabel);
    return index !== -1 ? temperaturaMin[index] : null;
  });

  const temperaturaMaxInterpolada = labelsHora.map((label) => {
    const dataLabel = label.split(" - ")[0];
    const index = diasFormatados.indexOf(dataLabel);
    return index !== -1 ? temperaturaMax[index] : null;
  });

  const labelsX = criarLabelsUnicasPorDia(labelsHora);
  const estiloFundo = useMemo(() => {
    const agora = new Date();
    console.log("Hora atual:", agora.toString());
    console.log("Hora atual (getHours()):", agora.getHours());
    return obterEstiloDeFundo(agora);
  }, []);
  
  

  const data = {
    labels: labelsX,
    datasets: [
      {
        label: "Temp (°C)",
        data: temperaturas,
        borderColor: "#ff6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.6,
        fill: true,
        pointRadius: 0,
        borderWidth: 2,
        yAxisID: "y1",
        type: "line",
      },
      {
        label: "Temp Máx(°C)",
        data: temperaturaMaxInterpolada,
        borderColor: "#ffa600",
        backgroundColor: "rgba(255, 166, 0, 0.2)",
        tension: 0.4,
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
        spanGaps: true,
        yAxisID: "y1",
        type: "line",
      },
      {
        label: "Temp Mín (°C)",
        data: temperaturaMinInterpolada,
        borderColor: "#00cc99",
        backgroundColor: "rgba(0, 204, 153, 0.2)",
        tension: 0.4,
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
        spanGaps: true,
        yAxisID: "y1",
        type: "line",
      },
      {
        label: "Chuva",
        data: chuvas,
        type: "bar",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 0.7)",
        borderWidth: 1,
        yAxisID: "y2",
        type: "bar",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    layout: {
      padding: {
        bottom: 30,
      },
    },
    plugins: {
      title: {
        display: true,
        font: { size: 20, weight: "bold", family: "Inter" },
        color: "#000000",
        text: "Previsão por hora",
      },
      legend: {
        labels: {
          color: "#000000",
          font: { size: 14 },
          boxWidth: 12,
          padding: 20,
        },
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
        callbacks: {
          title: function (tooltipItems) {
            const index = tooltipItems[0].dataIndex;
            return labelsHora[index]; // mostra data e hora real
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#333",
          font: { size: 11 },
          maxRotation: 0,
          minRotation: 0,
          autoSkip: false,
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "left",
        ticks: {
          color: "#ff6384",
          beginAtZero: true,
        },
        grid: {
          display: false,
        },
      },
      y2: {
        type: "linear",
        display: true,
        position: "right",
        ticks: {
          color: "#36a2eb",
          beginAtZero: true,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  

  return (
<div
  style={{
    height: "400px",
    width: "100%",
    ...estiloFundo,
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    padding: "16px",
  }}
>
<Chart type="bar" data={data} options={options} />
    </div>
  );
}
