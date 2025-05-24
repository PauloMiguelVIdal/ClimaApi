import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

// Função para formatar data e hora para exibição
const formatarData = (data) => {
  const d = new Date(data);
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const hora = String(d.getHours()).padStart(2, "0");
  const minuto = String(d.getMinutes()).padStart(2, "0");
  return `${dia}/${mes} - ${hora}:${minuto}`;
};

// Função para formatar data diária no mesmo formato que o label do gráfico
const formatarDataDia = (data) => {
  const d = new Date(data);
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  return `${dia}/${mes}`;
};

export default function Grafico({ dados, dadosDiarios }) {
  const labelsHora = dados.map((item) => formatarData(item.hora));
  const temperaturas = dados.map((item) => item.temperatura);
  const chuvas = dados.map((item) => item.chuva);

  // Formatar as datas diárias
  const diasFormatados = dadosDiarios.map((item) => formatarDataDia(item.data));
  const temperaturaMin = dadosDiarios.map((item) => item.temperaturaMin);
  const temperaturaMax = dadosDiarios.map((item) => item.temperaturaMax);

  // Preencher os dados diários com nulls para alinhamento com as horas
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

  const data = {
    labels: labelsHora,
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
        pointBorderWidth: 1,
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
        pointBorderWidth: 1,
      },
      {
        label: "Temperatura Máxima (°C)",
        data: temperaturaMaxInterpolada,
        borderColor: "#ffa600",
        backgroundColor: "rgba(255, 166, 0, 0.2)",
        tension: 0.2,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBorderWidth: 1,
        spanGaps: true,
      },
      {
        label: "Temperatura Mínima (°C)",
        data: temperaturaMinInterpolada,
        borderColor: "#00cc99",
        backgroundColor: "rgba(0, 204, 153, 0.2)",
        tension: 0.2,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBorderWidth: 1,
        spanGaps: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Temperatura, Chuva e Máximas/Mínimas",
        font: { size: 20, weight: "bold", family: "Inter" },
        color: "#000000",
      },
      legend: {
        labels: { color: "#000000", font: { size: 14 } },
      },
    },
    scales: {
      x: {
        ticks: { color: "#000000" },
        grid: { color: "#cccccc" },
      },
      y: {
        ticks: { color: "#000000" },
        grid: { color: "#cccccc" },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <Line data={data} options={options} />
    </div>
  );
}
