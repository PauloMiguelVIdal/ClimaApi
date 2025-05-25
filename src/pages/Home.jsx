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
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [cidade, setCidade] = useState("");
  const [dados, setDados] = useState([]);
  const [background, setBackground] = useState("padrao");

  useEffect(() => {
    axios.get("https://ipapi.co/json/")
      .then((res) => {
        setLatitude(res.data.latitude);
        setLongitude(res.data.longitude);
        setCidade(`${res.data.city}, ${res.data.region}`);
        console.log(res.data.latitude, res.data.longitude);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const imagensClima = {
    chuva: "/backgrounds/chuva.png",
    neblina: "/backgrounds/neblina.png",
    neve: "/backgrounds/neve.png",
    nuvem: "/backgrounds/nuvem.png",
    tempestade: "/backgrounds/tempestade.png",
    tempo_limpo: "/backgrounds/tempo_limpo.png",
    padrao: "/backgrounds/padrao.png",
  };

  useEffect(() => {
    async function carregarDados() {
      try {
        const resposta = await fetch("https://api.open-meteo.com/v1/forecast?latitude=-23.55&longitude=-46.63&current=temperature_2m,weather_code&hourly=temperature_2m");
        const json = await resposta.json();

        const codigoClima = json.current.weather_code;

        const mapearCondicao = (codigo) => {
          if ([0, 1].includes(codigo)) return "tempo_limpo";
          if ([2, 3].includes(codigo)) return "nuvem";
          if ([45, 48].includes(codigo)) return "neblina";
          if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(codigo)) return "chuva";
          if ([71, 73, 75, 77, 85, 86].includes(codigo)) return "neve";
          if ([95, 96, 99].includes(codigo)) return "tempestade";
          return "padrao";
        };

        const condicao = mapearCondicao(codigoClima);

        setDados([{ temperatura: json.current.temperature_2m, condicao }]);
        setBackground(condicao);
      } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
        setBackground("padrao");
      }
    }

    carregarDados();
  }, []);

  function obterEstiloClima(condicao) {
    switch (condicao.toLowerCase()) {
      case "ensolarado":
      case "céu limpo":
        return {
          background: "linear-gradient(to top, #fefcea, #f1da36)",
        };
      case "parcialmente nublado":
      case "nuvens dispersas":
        return {
          background: "linear-gradient(to top, #d7d2cc, #304352)",
        };
      case "nublado":
        return {
          background: "linear-gradient(to top, #757f9a, #d7dde8)",
        };
      case "chuva":
      case "chuva leve":
      case "chuvisco":
        return {
          background: "linear-gradient(to top, #314755, #26a0da)",
        };
      case "tempestade":
        return {
          background: "linear-gradient(to top, #000000, #434343)",
        };
      case "neve":
        return {
          background: "linear-gradient(to top, #e6dada, #274046)",
        };
      case "neblina":
      case "névoa":
        return {
          background: "linear-gradient(to top, #bdc3c7, #2c3e50)",
        };
      default:
        return {
          background: "#e0f7fa",
        };
    }
  }

  const condicaoAtual = atual?.descricao || "padrão";
  const estiloClima = obterEstiloClima(condicaoAtual);

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

  const imagemDeFundo = imagensClima[background];
  const gradiente = obterEstiloClima(atual?.descricao || "padrão")?.background;

  return (
    <>
      <Navbar onBuscarCidade={handleBuscarCidade} condicaoClima={background} />
      <div
        className="min-h-screen w-full text-white"
        style={{
          backgroundImage: `${gradiente}, url(${imagemDeFundo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          paddingTop: "4rem",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          <ClimaAtualCard climaAtual={atual} cidade={cidade} extras={extras} />
          <Grafico dados={dadosGrafico} dadosDiarios={dadosDiarios} />
        </div>
      </div>
    </>
  );
}
