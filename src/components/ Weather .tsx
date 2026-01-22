import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGeoLocation } from "@/components/api/geo";
import { fetchWeather } from "@/components/api/weather";

/* =======================
   COMPONENT
======================= */
const Weather = () => {
  const [searchTerm, setSearchTerm] = useState("Lagos");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null,
  );

  /* =======================
     GEOLOCATION (FIRST VISIT)
  ======================= */
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      () => {
        // permission denied → fallback to search
      },
    );
  }, []);

  /* =======================
     GEO QUERY (CITY SEARCH)
  ======================= */
  const geoQuery = useQuery({
    queryKey: ["geo", searchTerm],
    enabled: !!searchTerm && !coords,
    queryFn: () => fetchGeoLocation(searchTerm),
  });

  const latitude = coords?.lat ?? geoQuery.data?.results?.[0]?.latitude;
  const longitude = coords?.lon ?? geoQuery.data?.results?.[0]?.longitude;
  const locationName = geoQuery.data?.results?.[0]?.name ?? "Your Location";
  const country = geoQuery.data?.results?.[0]?.country ?? "";

  /* =======================
     WEATHER QUERY
  ======================= */
  const weatherQuery = useQuery({
    queryKey: ["weather", latitude, longitude],
    enabled: !!latitude && !!longitude,
    queryFn: () => fetchWeather(latitude!, longitude!),
  });

  if (weatherQuery.isPending) return <p>Loading weather...</p>;
  if (weatherQuery.isError || !weatherQuery.data)
    return <p>Error loading weather</p>;

  const { current_weather, hourly, daily } = weatherQuery.data;

  /* =======================
     DAY SELECTOR LOGIC
  ======================= */
  const activeDay = selectedDay ?? daily.time[0];

  const hourlyForDay = useMemo(() => {
    return hourly.time
      .map((time, index) => ({
        time,
        temperature: hourly.temperature_2m[index],
        feelsLike: hourly.apparent_temperature[index],
        humidity: hourly.relative_humidity_2m[index],
        precipitation: hourly.precipitation[index],
        code: hourly.weathercode[index],
      }))
      .filter((item) => item.time.startsWith(activeDay));
  }, [hourly, activeDay]);

  /* =======================
     ICON MAPPER
  ======================= */
  const getIcon = (code: number) => {
    if (code === 0) return "☀️";
    if (code <= 3) return "⛅";
    if (code <= 67) return "🌧️";
    if (code <= 77) return "❄️";
    return "⛈️";
  };

  /* =======================
     VOICE SEARCH (OPTIONAL)
  ======================= */
  const handleVoiceSearch = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice search not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      setCoords(null); // override geolocation
      setSearchTerm(event.results[0][0].transcript);
    };

    recognition.start();
  };

  /* =======================
     UI
  ======================= */
  return (
    <section style={{ maxWidth: "900px", margin: "2rem auto" }}>
      {/* Search */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          value={searchTerm}
          onChange={(e) => {
            setCoords(null);
            setSearchTerm(e.target.value);
          }}
          placeholder="Search city..."
          style={{ flex: 1, padding: "0.6rem" }}
        />
        <button onClick={handleVoiceSearch}>🎤</button>
      </div>

      {/* Current Weather */}
      <h2>
        {locationName} {country && `, ${country}`}
      </h2>
      <p style={{ fontSize: "2.5rem" }}>
        {current_weather.temperature}°C {getIcon(current_weather.weathercode)}
      </p>

      {/* Extra Metrics */}
      <div style={{ display: "flex", gap: "1.5rem" }}>
        <p>Feels like: {hourly.apparent_temperature[0]}°C</p>
        <p>Humidity: {hourly.relative_humidity_2m[0]}%</p>
        <p>Wind: {current_weather.windspeed} km/h</p>
        <p>Precipitation: {hourly.precipitation[0]} mm</p>
      </div>

      {/* Day Selector */}
      <h3 style={{ marginTop: "2rem" }}>Hourly Forecast</h3>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {daily.time.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            style={{
              background: day === activeDay ? "#333" : "#eee",
              color: day === activeDay ? "#fff" : "#000",
            }}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Hourly Forecast */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          overflowX: "auto",
          marginTop: "1rem",
        }}
      >
        {hourlyForDay.map((hour) => (
          <div key={hour.time} style={{ textAlign: "center" }}>
            <p>{hour.time.split("T")[1]}</p>
            <p>{hour.temperature}°C</p>
            <p>{getIcon(hour.code)}</p>
          </div>
        ))}
      </div>

      {/* 7-Day Forecast */}
      <h3 style={{ marginTop: "2rem" }}>7-Day Forecast</h3>
      {daily.time.map((day, index) => (
        <div key={day} style={{ display: "flex", gap: "1rem" }}>
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
