// Weather API utilities using OpenWeatherMap

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BANGALORE_COORDS = { lat: 12.9716, lon: 77.5946 }; // Bangalore coordinates

export type WeatherData = {
  date: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  weather: string;
  description: string;
  rain_probability: number;
  humidity: number;
};

export async function getWeatherForecast(): Promise<WeatherData[]> {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${BANGALORE_COORDS.lat}&lon=${BANGALORE_COORDS.lon}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const data = await response.json();

    // Process forecast data - get one forecast per day for next 5 days
    const dailyForecasts: WeatherData[] = [];
    const processedDates = new Set<string>();

    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dateStr = date.toISOString().split("T")[0];

      // Take noon forecast (12:00) for each day
      const hour = date.getHours();
      if (hour >= 11 && hour <= 13 && !processedDates.has(dateStr)) {
        processedDates.add(dateStr);
        dailyForecasts.push({
          date: dateStr,
          temp: Math.round(item.main.temp),
          feels_like: Math.round(item.main.feels_like),
          temp_min: Math.round(item.main.temp_min),
          temp_max: Math.round(item.main.temp_max),
          weather: item.weather[0].main,
          description: item.weather[0].description,
          rain_probability: item.pop * 100, // probability of precipitation
          humidity: item.main.humidity,
        });
      }
    });

    return dailyForecasts.slice(0, 7); // Return up to 7 days
  } catch (error) {
    console.error("Weather API Error:", error);
    return [];
  }
}

export async function getCurrentWeather() {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${BANGALORE_COORDS.lat}&lon=${BANGALORE_COORDS.lon}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch current weather");
    }

    const data = await response.json();

    return {
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      weather: data.weather[0].main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
    };
  } catch (error) {
    console.error("Current Weather API Error:", error);
    return null;
  }
}

// Analyze weather and generate inventory suggestions
export function generateWeatherInsights(forecast: WeatherData[]) {
  if (!forecast || forecast.length === 0) {
    return {
      summary: "Weather data unavailable",
      suggestions: [],
    };
  }

  const avgTemp = forecast.reduce((sum, day) => sum + day.temp, 0) / forecast.length;
  const rainyDays = forecast.filter((day) => day.rain_probability > 50).length;
  const hotDays = forecast.filter((day) => day.temp > 30).length;
  const coldDays = forecast.filter((day) => day.temp < 20).length;

  const suggestions = [];

  // Hot weather suggestions
  if (hotDays >= 4 || avgTemp > 28) {
    suggestions.push({
      type: "hot",
      priority: "high",
      title: "Hot Weather Ahead ☀️",
      description: `${hotDays} hot days expected (avg ${Math.round(avgTemp)}°C). Customers will prefer cold beverages.`,
      actions: [
        "Stock up on cold brew ingredients",
        "Prepare extra iced coffee",
        "Promote cold beverages",
        "Ensure ice machine is full",
      ],
    });
  }

  // Rainy weather suggestions
  if (rainyDays >= 3) {
    suggestions.push({
      type: "rain",
      priority: "high",
      title: "Rainy Week Expected 🌧️",
      description: `${rainyDays} rainy days expected. Perfect weather for hot beverages and comfort food.`,
      actions: [
        "Stock up on hot coffee beans",
        "Prepare extra chai/tea",
        "Stock comfort food (pastries, muffins)",
        "Promote hot beverages",
      ],
    });
  }

  // Pleasant weather suggestions
  if (avgTemp >= 20 && avgTemp <= 28 && rainyDays < 2) {
    suggestions.push({
      type: "pleasant",
      priority: "medium",
      title: "Perfect Weather 😊",
      description: "Pleasant weather ahead. Great for outdoor seating and balanced menu.",
      actions: [
        "Promote outdoor seating",
        "Balance hot and cold beverages",
        "Feature seasonal specials",
      ],
    });
  }

  // Cold weather suggestions
  if (coldDays >= 3 || avgTemp < 22) {
    suggestions.push({
      type: "cold",
      priority: "medium",
      title: "Cooler Days Ahead 🍂",
      description: `${coldDays} cool days expected (avg ${Math.round(avgTemp)}°C). Hot beverages will be popular.`,
      actions: [
        "Stock hot chocolate",
        "Prepare masala chai",
        "Promote hot beverages",
        "Feature warm pastries",
      ],
    });
  }

  const summary = suggestions.length > 0
    ? `${suggestions.length} weather-based opportunities identified for the next week`
    : "Weather conditions are stable";

  return { summary, suggestions };
}
