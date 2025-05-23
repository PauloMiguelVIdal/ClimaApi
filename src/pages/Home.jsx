import { useEffect, useState } from "react";
import axios from "axios";
import Grafico from "../components/Grafico";
import Navbar from "../components/Navbar";
import Container from "../components/Container";

export default function Home() {
  const [clima, setClima] = useState(null);
  const [daily, setDaily] = useState(null);

  useEffect(() => {
    axios.get("https://api.open-meteo.com/v1/jma", {
      params: {
        latitude: -20.4203,
        longitude: -49.9783,
        hourly: "temperature_2m,rain",
        daily: "temperature_2m_min,temperature_2m_max",
        timezone: "auto"
      }
    })
    .then(res => {
      console.log("Dados da API:", res.data); // DEBUG
      setClima(res.data.hourly);
      setDaily(res.data.daily);
    })
    .catch(err => {
      console.error("Erro ao buscar dados:", err);
    });
  }, []);

  if (!clima || !daily) return <p>Carregando clima...</p>;

  // Dados por hora para o gráfico
  const dadosGrafico = clima.time.map((hora, index) => ({
    hora,
    temperatura: clima.temperature_2m[index],
    chuva: clima.rain[index],
  }));

  // Dados diários com mínimas e máximas
  const dadosDiarios = daily.time.map((data, index) => ({
    data,
    temperaturaMin: daily.temperature_2m_min[index],
    temperaturaMax: daily.temperature_2m_max[index],
  }));

  return (
    <div>
      <Navbar />
      <h2>Previsão por hora</h2>
      <Grafico dados={dadosGrafico} />

      <h2>Resumo diário</h2>
      {dadosDiarios.map((item, index) => (
        <Container
          key={index}
          data={item.data}
          temperaturaMin={item.temperaturaMin}
          temperaturaMax={item.temperaturaMax}
        />
      ))}
    </div>
  );
}
