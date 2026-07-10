import { getLocal, setLocal } from "../utils/storage";

const CN: Record<string, { lat: number; lon: number }> = {};

export interface WeatherData {
  temp: number; humi: number; code: number; wind: number; feels: number; t: number; cn?: string;
}

function fetchCityGeo(cityName: string): Promise<{ lat: number; lon: number } | null> {
  if (CN[cityName]) return Promise.resolve(CN[cityName]);
  var cached = getLocal<{ lat: number; lon: number } | null>("geo_" + cityName, null);
  if (cached) return Promise.resolve(cached);
  return fetch(
    "https://geocoding-api.open-meteo.com/v1/search?name=" + encodeURIComponent(cityName) + "&count=1&language=zh&format=json",
    { signal: AbortSignal.timeout(4000) }
  ).then(function(r){return r.json();}).then(function(d){
    if(d&&d.results&&d.results[0]){var r=d.results[0];var o={lat:r.latitude,lon:r.longitude};setLocal("geo_"+cityName,o);return o;}
    return null;
  }).catch(function(){return null;});
}

function fetchWeather(lat: number, lon: number): Promise<WeatherData | null> {
  var key = lat.toFixed(1) + "_" + lon.toFixed(1);
  var cached = getLocal<WeatherData | null>("wea_" + key, null);
  if (cached && Date.now() - cached.t < 600000) return Promise.resolve(cached);
  return fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature&timezone=auto",
    { signal: AbortSignal.timeout(4000) }
  ).then(function(r){return r.json();}).then(function(d){
    if(d&&d.current){return{temp:d.current.temperature_2m,humi:d.current.relative_humidity_2m,code:d.current.weather_code,wind:d.current.wind_speed_10m,feels:d.current.apparent_temperature,t:Date.now()};}
    return null;
  }).catch(function(){return null;});
}

export function getCityWeather(name: string, callback: (d: WeatherData | null) => void): void {
  fetchCityGeo(name).then(function(geo){
    if(!geo){callback(null);return;}
    fetchWeather(geo.lat, geo.lon).then(function(w){callback(w);});
  });
}

export function mapWMO(code: number): string {
  if(code===0)return"clear";if(code>=1&&code<=3)return"cloudy";if(code>=45&&code<=48)return"fog";
  if((code>=51&&code<=67)||(code>=80&&code<=82))return"rain";
  if((code>=71&&code<=77)||(code>=85&&code<=86))return"snow";
  if(code>=95&&code<=99)return"thunder";return"clear";
}

export function mapWMOIntensity(code: number): number {
  if(code===0)return 30;if(code>=1&&code<=3)return 20+code*15;if(code>=45&&code<=48)return 30+(code-44)*15;
  if(code>=51&&code<=55)return 30+(code-50)*15;if(code>=56&&code<=57)return 40;
  if(code>=61&&code<=65)return 40+(code-60)*15;if(code>=66&&code<=67)return 50;
  if(code>=71&&code<=75)return 30+(code-70)*15;if(code>=76&&code<=77)return 40;
  if(code>=80&&code<=82)return 50+(code-79)*15;if(code>=85&&code<=86)return 50;
  if(code>=95&&code<=99)return 60+(code-94)*15;return 40;
}

export var WN: Record<string, string> = {clear:"Sunny",cloudy:"Cloudy",rain:"Rainy",snow:"Snowy",thunder:"Thunderstorm",fog:"Foggy",wind:"Windy"};
export var WN_ICON: Record<string, string> = {clear:"☀️",cloudy:"☁️",rain:"🌧️",snow:"❄️",thunder:"⛈️",fog:"🌫️",wind:"💨"};
