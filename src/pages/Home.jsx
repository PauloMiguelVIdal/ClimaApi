import { useEffect, useState } from "react";
import axios from "axios";
import Grafico from "../components/Grafico";
import Navbar from "../components/Navbar";
import Container from "../components/Container";
import ClimaAtualCard from "../components/ClimaAtualCard";

const weatherCodeMap = {
  0: "Céu limpo",
  1: "Principalmente claro",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Névoa",
  48: "Névoa com gelo",
  51: "Garoa leve",
  53: "Garoa moderada",
  55: "Garoa densa",
  56: "Garoa congelante leve",
  57: "Garoa congelante densa",
  61: "Chuva leve",
  63: "Chuva moderada",
  65: "Chuva forte",
  66: "Chuva congelante leve",
  67: "Chuva congelante forte",
  71: "Neve leve",
  73: "Neve moderada",
  75: "Neve forte",
  77: "Grãos de neve",
  80: "Aguaceiros leves",
  81: "Aguaceiros moderados",
  82: "Aguaceiros violentos",
  85: "Aguaceiros de neve leves",
  86: "Aguaceiros de neve fortes",
  95: "Tempestade",
  96: "Tempestade com granizo leve",
  99: "Tempestade com granizo forte"
};

export default function Home() {
  const [clima, setClima] = useState(null);
  const [daily, setDaily] = useState(null);
  const [atual, setAtual] = useState(null);
  const [extras, setExtras] = useState(null);
  const [latitude, setLatitude] = useState(-23.5489);
  const [longitude, setLongitude] = useState(-46.6388);
  const [cidade, setCidade] = useState("São Paulo, São Paulo");

  const buscarCoordenadas = async (nomeCidade) => {
    try {
      const res = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: nomeCidade,
          format: "json",
          limit: 1,
        },
      });

      if (res.data.length > 0) {
        const { lat, lon } = res.data[0];
        setLatitude(parseFloat(lat));
        setLongitude(parseFloat(lon));
        setCidade(nomeCidade);
      } else {
        alert("Cidade não encontrada.");
      }
    } catch (error) {
      console.error("Erro no geocoding:", error);
    }
  };

  const handleBuscarCidade = (cidade) => {
    setLatitude(cidade.lat);
    setLongitude(cidade.lon);
    setCidade(cidade.label);
  };

  useEffect(() => {
    if (latitude && longitude) {
      axios
        .get("https://api.open-meteo.com/v1/forecast", {
          params: {
            latitude,
            longitude,
            current_weather: true,
            hourly: "temperature_2m,rain,uv_index,visibility,pressure_msl,dew_point_2m",
            daily: "temperature_2m_min,temperature_2m_max",
            timezone: "auto",
          },
        })
        .then((res) => {
          setAtual({
            ...res.data.current_weather,
            descricao: weatherCodeMap[res.data.current_weather.weathercode] || "Desconhecido",
          });
          setClima(res.data.hourly);
          setDaily(res.data.daily);
          setExtras({
            uv: res.data.hourly.uv_index?.[0],
            visibility: res.data.hourly.visibility?.[0],
            pressure: res.data.hourly.pressure_msl?.[0],
            dewPoint: res.data.hourly.dew_point_2m?.[0],
          });
        })
        .catch((err) => {
          console.error("Erro ao buscar clima:", err);
        });
    }
  }, [latitude, longitude]);

  if (!clima || !daily || !atual) return <p>Carregando clima...</p>;

  const dadosGrafico = clima.time.map((hora, index) => ({
    hora,
    temperatura: clima.temperature_2m[index],
    chuva: clima.rain[index],
  }));

  const dadosDiarios = daily.time.map((data, index) => ({
    data,
    temperaturaMin: daily.temperature_2m_min[index],
    temperaturaMax: daily.temperature_2m_max[index],
  }));

  return (
    <div>
      <Navbar onBuscarCidade={handleBuscarCidade} />

      <ClimaAtualCard climaAtual={atual} cidade={cidade} extras={extras} />

      {/* <h2>Previsão por hora {cidade && `para ${cidade}`}</h2> */}
      <Grafico dados={dadosGrafico} dadosDiarios={dadosDiarios} />

      {/* <h2>Resumo diário</h2>
      {dadosDiarios.map((item, index) => (
        <Container
          key={index}
          data={item.data}
          temperaturaMin={item.temperaturaMin}
          temperaturaMax={item.temperaturaMax}
        />
      ))} */}
    </div>
  );
}
