import { useEffect, useState } from "react";
import axios from "axios";
import Grafico from "../components/Grafico";
import Navbar from "../components/Navbar";
import Container from "../components/Container";

export default function Home() {
  const [clima, setClima] = useState(null);
  const [daily, setDaily] = useState(null);
  const [latitude, setLatitude] = useState(-20.4203);
  const [longitude, setLongitude] = useState(-49.9783);
  const [cidade, setCidade] = useState(""); // cidade buscada

  // Buscar coordenadas pela cidade
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
    console.log("Cidade selecionada:", cidade);
    setLatitude(cidade.lat);
    setLongitude(cidade.lon);
    setCidade(cidade.label);
  };
  
  // Buscar clima quando latitude/longitude mudarem
  useEffect(() => {
    if (latitude && longitude) {
      axios
        .get("https://api.open-meteo.com/v1/jma", {
          params: {
            latitude,
            longitude,
            hourly: "temperature_2m,rain",
            daily: "temperature_2m_min,temperature_2m_max",
            timezone: "auto",
          },
        })
        .then((res) => {
          setClima(res.data.hourly);
          setDaily(res.data.daily);
        })
        .catch((err) => {
          console.error("Erro ao buscar clima:", err);
        });
    }
  }, [latitude, longitude]);

  if (!clima || !daily) return <p>Carregando clima...</p>;

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


      <h2>Previsão por hora {cidade && `para ${cidade}`}</h2>
      <Grafico dados={dadosGrafico}  dadosDiarios={dadosDiarios}/>

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
