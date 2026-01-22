import axios from "axios";

/* ---------- TYPES ---------- */
export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  weathercode: number;
}

export interface HourlyData {
  time: string[];
  temperature_2m: number[];
  apparent_temperature: number[];
  relative_humidity_2m: number[];
  precipitation: number[];
  wind_speed_10m: number[];
  weathercode: number[];
}

export interface DailyData {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  weathercode: number[];
}

export interface WeatherResponse {
  current_weather: CurrentWeather;
  hourly: HourlyData;
  daily: DailyData;
}

/* ---------- API FUNCTION ---------- */
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

export const fetchWeather = async (
  latitude: number,
  longitude: number,
): Promise<WeatherResponse> => {
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
};
