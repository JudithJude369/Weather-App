import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/* =======================
   GEO TYPES
======================= */
interface GeoResult {
  latitude: number;
  longitude: number;
  name: string;
  country: string;
}

interface GeoResponse {
  results: GeoResult[];
}

/* =======================
   WEATHER TYPES
======================= */
interface CurrentWeather {
  temperature: number;
  windspeed: number;
  weathercode: number;
}

interface HourlyData {
  time: string[];
  temperature_2m: number[];
  apparent_temperature: number[];
  relative_humidity_2m: number[];
  precipitation: number[];
  wind_speed_10m: number[];
  weathercode: number[];
}

interface DailyData {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  weathercode: number[];
}

interface WeatherResponse {
  current_weather: CurrentWeather;
  hourly: HourlyData;
  daily: DailyData;
}

/* =======================
   API URLS
======================= */
const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

/* =======================
   COMPONENT
======================= */
const Weather = () => {
  const [searchTerm, setSearchTerm] = useState<string>("Lagos");

  /* ---------- GEO QUERY ---------- */
  const geoQuery = useQuery<GeoResponse>({
    queryKey: ["geo", searchTerm],
    enabled: !!searchTerm,
    queryFn: async () => {
      const res = await axios.get<GeoResponse>(GEO_URL, {
        params: {
          name: searchTerm,
          count: 1,
        },
      });
      return res.data;
    },
  });

  if (geoQuery.isPending) {
    return <h4 style={{ textAlign: "center" }}>Searching location...</h4>;
  }

  if (geoQuery.isError || !geoQuery.data?.results?.length) {
    return <h4 style={{ textAlign: "center" }}>Location not found</h4>;
  }

  const { latitude, longitude, name, country } = geoQuery.data.results[0];

  /* ---------- WEATHER QUERY ---------- */
  const weatherQuery = useQuery<WeatherResponse>({
    queryKey: ["weather", latitude, longitude],
    enabled: !!latitude && !!longitude,
    queryFn: async () => {
      const res = await axios.get<WeatherResponse>(WEATHER_URL, {
        params: {
          latitude,
          longitude,
          current_weather: true,
          hourly:
            "temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,wind_speed_10m,weathercode",
          daily:
            "temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum",
          forecast_days: 7,
          timezone: "auto",
        },
      });
      return res.data;
    },
  });

  if (weatherQuery.isPending) {
    return <h4 style={{ textAlign: "center" }}>Loading weather...</h4>;
  }

  if (weatherQuery.isError || !weatherQuery.data) {
    return <h4 style={{ textAlign: "center" }}>Weather error</h4>;
  }

  const { current_weather, hourly, daily } = weatherQuery.data;

  /* =======================
     HELPERS
  ======================= */
  const today = new Date().toISOString().split("T")[0];

  const todayHourly = hourly.time
    .map((time, index) => ({
      time,
      temperature: hourly.temperature_2m[index],
      weathercode: hourly.weathercode[index],
    }))
    .filter((item) => item.time.startsWith(today));

  const getIcon = (code: number): string => {
    if (code === 0) return "☀️";
    if (code <= 3) return "⛅";
    if (code <= 67) return "🌧️";
    if (code <= 77) return "❄️";
    return "⛈️";
  };

  /* =======================
     UI
  ======================= */
  return (
    <section style={{ maxWidth: "900px", margin: "2rem auto" }}>
      {/* Search */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search city..."
        style={{
          padding: "0.6rem",
          width: "100%",
          marginBottom: "1rem",
        }}
      />

      {/* Current Weather */}
      <h2>
        {name}, {country}
      </h2>
      <p style={{ fontSize: "2.5rem" }}>
        {current_weather.temperature}°C {getIcon(current_weather.weathercode)}
      </p>
      <p>Wind Speed: {current_weather.windspeed} km/h</p>

      {/* Hourly Forecast */}
      <h3 style={{ marginTop: "2rem" }}>Hourly Forecast (Today)</h3>
      <div style={{ display: "flex", gap: "1rem", overflowX: "auto" }}>
        {todayHourly.map((hour) => (
          <div key={hour.time} style={{ textAlign: "center" }}>
            <p>{hour.time.split("T")[1]}</p>
            <p>{hour.temperature}°C</p>
            <p>{getIcon(hour.weathercode)}</p>
          </div>
        ))}
      </div>

      {/* Daily Forecast */}
      <h3 style={{ marginTop: "2rem" }}>7-Day Forecast</h3>
      {daily.time.map((day, index) => (
        <div
          key={day}
          style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}
        >
          <p>{day}</p>
          <p>
            {daily.temperature_2m_min[index]}° /{" "}
            {daily.temperature_2m_max[index]}°
          </p>
          <p>{getIcon(daily.weathercode[index])}</p>
        </div>
      ))}
    </section>
  );
};

export default Weather;
