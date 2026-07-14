import { useEffect, useState } from "react";

type WeatherState =
  | { message: string; source: "default" }
  | { message: string; source: "open-meteo" };

type OpenMeteoCurrent = {
  current?: {
    precipitation?: number;
    rain?: number;
    showers?: number;
    snowfall?: number;
    weather_code?: number;
  };
};

const defaultWeather: WeatherState = {
  message: "Good weather for building small, useful things.",
  source: "default",
};

const rainyWeatherCodes = new Set([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82]);

function isRainyWeather(data: OpenMeteoCurrent) {
  const current = data.current;

  if (!current) return false;

  const precipitation =
    (current.precipitation ?? 0) +
    (current.rain ?? 0) +
    (current.showers ?? 0) +
    (current.snowfall ?? 0);

  return precipitation > 0 || rainyWeatherCodes.has(current.weather_code ?? -1);
}

function getCurrentPosition() {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      maximumAge: 1000 * 60 * 30,
      timeout: 6000,
    });
  });
}

export function WeatherNote() {
  const [weather, setWeather] = useState<WeatherState>(defaultWeather);

  useEffect(() => {
    if (!navigator.geolocation) return;

    let isMounted = true;

    async function loadWeather() {
      try {
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;
        const params = new URLSearchParams({
          current: "precipitation,rain,showers,snowfall,weather_code",
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          timezone: "auto",
        });
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);

        if (!response.ok) return;

        const data = (await response.json()) as OpenMeteoCurrent;

        if (!isMounted) return;

        setWeather({
          message: isRainyWeather(data)
            ? "It's raining where you are. Good weather for reviewing my projects."
            : "Looks clear enough to wander through a few projects.",
          source: "open-meteo",
        });
      } catch {
        if (isMounted) setWeather(defaultWeather);
      }
    }

    void loadWeather();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <p className="terminal-weather-note">
      <span className="terminal-meta-label">
        <span className="terminal-meta-icon" aria-hidden="true">☀</span> weather
      </span>{" "}
      {weather.message}
      {weather.source === "open-meteo" ? (
        <>
          {" "}
          <a href="https://open-meteo.com/" rel="noreferrer" target="_blank">
            weather: open-meteo
          </a>
        </>
      ) : null}
    </p>
  );
}
