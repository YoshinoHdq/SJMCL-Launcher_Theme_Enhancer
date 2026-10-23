// src/engine/weather.ts
  var CN = {
    "Beijing": { lat: 39.9, lon: 116.41 },
    "Shanghai": { lat: 31.23, lon: 121.47 },
    "Guangzhou": { lat: 23.13, lon: 113.26 },
    "Shenzhen": { lat: 22.54, lon: 114.06 },
    "Tianjin": { lat: 39.34, lon: 117.36 },
    "Chongqing": { lat: 29.43, lon: 106.5 },
    "Hangzhou": { lat: 30.27, lon: 120.15 },
    "Nanjing": { lat: 32.06, lon: 118.8 },
    "Wuhan": { lat: 30.59, lon: 114.31 },
    "Chengdu": { lat: 30.57, lon: 104.07 },
    "Xi'an": { lat: 34.34, lon: 108.94 },
    "Suzhou": { lat: 31.3, lon: 120.58 },
    "Changsha": { lat: 28.23, lon: 112.94 },
    "Zhengzhou": { lat: 34.75, lon: 113.63 },
    "Dongguan": { lat: 23.02, lon: 113.75 },
    "Qingdao": { lat: 36.07, lon: 120.33 },
    "Shenyang": { lat: 41.81, lon: 123.43 },
    "Ningbo": { lat: 29.87, lon: 121.54 },
    "Kunming": { lat: 25.04, lon: 102.68 },
    "Dalian": { lat: 38.91, lon: 121.62 },
    "Xiamen": { lat: 24.48, lon: 118.09 },
    "Hefei": { lat: 31.82, lon: 117.23 },
    "Foshan": { lat: 23.02, lon: 113.12 },
    "Fuzhou": { lat: 26.07, lon: 119.3 },
    "Harbin": { lat: 45.8, lon: 126.54 },
    "Jinan": { lat: 36.65, lon: 117 },
    "Wenzhou": { lat: 28, lon: 120.7 },
    "Changchun": { lat: 43.88, lon: 125.32 },
    "Shijiazhuang": { lat: 38.04, lon: 114.51 },
    "Changzhou": { lat: 31.81, lon: 119.97 },
    "Quanzhou": { lat: 24.91, lon: 118.59 },
    "Nanning": { lat: 22.82, lon: 108.37 },
    "Guiyang": { lat: 26.65, lon: 106.63 },
    "Nanchang": { lat: 28.68, lon: 115.86 },
    "Taiyuan": { lat: 37.87, lon: 112.55 },
    "Yantai": { lat: 37.46, lon: 121.45 },
    "Jiaxing": { lat: 30.77, lon: 120.76 },
    "Nantong": { lat: 31.98, lon: 120.89 },
    "Jinhua": { lat: 29.08, lon: 119.65 },
    "Zhuhai": { lat: 22.27, lon: 113.57 },
    "Huizhou": { lat: 23.1, lon: 114.42 },
    "Xuzhou": { lat: 34.27, lon: 117.17 },
    "Haikou": { lat: 20.04, lon: 110.33 },
    "Urumqi": { lat: 43.83, lon: 87.62 },
    "Shaoxing": { lat: 30, lon: 120.58 },
    "Zhongshan": { lat: 22.52, lon: 113.38 },
    "Taizhou": { lat: 28.66, lon: 121.42 },
    "Lanzhou": { lat: 36.06, lon: 103.82 },
    "Weifang": { lat: 36.71, lon: 119.16 },
    "Yangzhou": { lat: 32.39, lon: 119.41 },
    "Sanya": { lat: 18.25, lon: 109.51 },
    "Luoyang": { lat: 34.62, lon: 112.45 },
    "Hohhot": { lat: 40.84, lon: 111.75 },
    "Tangshan": { lat: 39.63, lon: 118.18 },
    "Zhenjiang": { lat: 32.19, lon: 119.43 },
    "Wuxi": { lat: 31.49, lon: 120.31 },
    "Liuzhou": { lat: 24.33, lon: 109.4 },
    "Handan": { lat: 36.6, lon: 114.47 },
    "Qufu": { lat: 35.58, lon: 116.99 },
    "Huangshan": { lat: 29.72, lon: 118.34 },
    "Lijiang": { lat: 26.86, lon: 100.23 },
    "Lhasa": { lat: 29.65, lon: 91.17 },
    "Xining": { lat: 36.62, lon: 101.78 },
    "Yinchuan": { lat: 38.47, lon: 106.28 },
    "Guilin": { lat: 25.27, lon: 110.29 },
    "Zhangjiajie": { lat: 29.12, lon: 110.48 },
    "Chengde": { lat: 40.97, lon: 117.94 },
    "Zhoushan": { lat: 30, lon: 122.2 },
    "Wuhu": { lat: 31.37, lon: 118.38 },
    "Baoding": { lat: 38.87, lon: 115.47 },
    "Xiangyang": { lat: 32.08, lon: 112.17 },
    "Hong Kong": { lat: 22.32, lon: 114.17 },
    "Macau": { lat: 22.2, lon: 113.55 },
    "Taipei": { lat: 25.03, lon: 121.57 },
    "Kaohsiung": { lat: 22.63, lon: 120.3 },
    "Taichung": { lat: 24.15, lon: 120.67 },
    "Tainan": { lat: 23, lon: 120.2 },
    "Tokyo": { lat: 35.68, lon: 139.69 },
    "Osaka": { lat: 34.69, lon: 135.5 },
    "Kyoto": { lat: 35.01, lon: 135.77 },
    "Yokohama": { lat: 35.45, lon: 139.64 },
    "Nagoya": { lat: 35.18, lon: 136.91 },
    "Sapporo": { lat: 43.06, lon: 141.35 },
    "Fukuoka": { lat: 33.59, lon: 130.4 },
    "Kobe": { lat: 34.69, lon: 135.2 },
    "Hiroshima": { lat: 34.4, lon: 132.46 },
    "Sendai": { lat: 38.27, lon: 140.87 },
    "Naha": { lat: 26.21, lon: 127.68 },
    "Seoul": { lat: 37.57, lon: 126.98 },
    "Busan": { lat: 35.18, lon: 129.08 },
    "Incheon": { lat: 37.46, lon: 126.71 },
    "Daegu": { lat: 35.87, lon: 128.6 },
    "Daejeon": { lat: 36.35, lon: 127.38 },
    "Gwangju": { lat: 35.17, lon: 126.91 },
    "Jeju": { lat: 33.5, lon: 126.53 },
    "Singapore": { lat: 1.35, lon: 103.82 },
    "Bangkok": { lat: 13.76, lon: 100.5 },
    "Kuala Lumpur": { lat: 3.14, lon: 101.69 },
    "Jakarta": { lat: -6.21, lon: 106.85 },
    "Manila": { lat: 14.6, lon: 120.98 },
    "Ho Chi Minh City": { lat: 10.82, lon: 106.63 },
    "Hanoi": { lat: 21.03, lon: 105.83 },
    "Phnom Penh": { lat: 11.57, lon: 104.88 },
    "Yangon": { lat: 16.84, lon: 96.17 },
    "Chiang Mai": { lat: 18.79, lon: 98.98 },
    "Da Nang": { lat: 16.05, lon: 108.2 },
    "Vientiane": { lat: 17.97, lon: 102.6 },
    "Bandung": { lat: -6.92, lon: 107.6 },
    "Surabaya": { lat: -7.25, lon: 112.75 },
    "Cebu": { lat: 10.32, lon: 123.89 },
    "Mumbai": { lat: 19.08, lon: 72.88 },
    "Delhi": { lat: 28.67, lon: 77.22 },
    "Bangalore": { lat: 12.97, lon: 77.59 },
    "Chennai": { lat: 13.08, lon: 80.27 },
    "Kolkata": { lat: 22.57, lon: 88.36 },
    "Hyderabad": { lat: 17.39, lon: 78.48 },
    "Pune": { lat: 18.52, lon: 73.86 },
    "Ahmedabad": { lat: 23.03, lon: 72.58 },
    "Jaipur": { lat: 26.91, lon: 75.79 },
    "Lucknow": { lat: 26.85, lon: 80.95 },
    "Dhaka": { lat: 23.81, lon: 90.41 },
    "Karachi": { lat: 24.86, lon: 67.01 },
    "Lahore": { lat: 31.55, lon: 74.36 },
    "Colombo": { lat: 6.93, lon: 79.84 },
    "Kathmandu": { lat: 27.72, lon: 85.32 },
    "Dubai": { lat: 25.2, lon: 55.27 },
    "Abu Dhabi": { lat: 24.45, lon: 54.38 },
    "Doha": { lat: 25.29, lon: 51.53 },
    "Kuwait City": { lat: 29.37, lon: 47.99 },
    "Riyadh": { lat: 24.71, lon: 46.68 },
    "Jeddah": { lat: 21.49, lon: 39.18 },
    "Muscat": { lat: 23.59, lon: 58.41 },
    "Tehran": { lat: 35.69, lon: 51.43 },
    "Baghdad": { lat: 33.31, lon: 44.36 },
    "Beirut": { lat: 33.89, lon: 35.5 },
    "Tel Aviv": { lat: 32.09, lon: 34.78 },
    "Amman": { lat: 31.95, lon: 35.93 },
    "Ankara": { lat: 39.93, lon: 32.86 },
    "Istanbul": { lat: 41.01, lon: 28.97 },
    "London": { lat: 51.51, lon: -0.13 },
    "Paris": { lat: 48.86, lon: 2.35 },
    "Berlin": { lat: 52.52, lon: 13.41 },
    "Madrid": { lat: 40.42, lon: -3.7 },
    "Rome": { lat: 41.9, lon: 12.5 },
    "Athens": { lat: 37.98, lon: 23.73 },
    "Vienna": { lat: 48.21, lon: 16.37 },
    "Prague": { lat: 50.08, lon: 14.42 },
    "Warsaw": { lat: 52.23, lon: 21.01 },
    "Budapest": { lat: 47.5, lon: 19.04 },
    "Amsterdam": { lat: 52.37, lon: 4.9 },
    "Brussels": { lat: 50.85, lon: 4.35 },
    "Stockholm": { lat: 59.33, lon: 18.07 },
    "Oslo": { lat: 59.91, lon: 10.75 },
    "Copenhagen": { lat: 55.68, lon: 12.57 },
    "Helsinki": { lat: 60.17, lon: 24.94 },
    "Lisbon": { lat: 38.72, lon: -9.14 },
    "Dublin": { lat: 53.35, lon: -6.26 },
    "Zurich": { lat: 47.38, lon: 8.54 },
    "Milan": { lat: 45.46, lon: 9.19 },
    "Munich": { lat: 48.14, lon: 11.58 },
    "Hamburg": { lat: 53.55, lon: 9.99 },
    "Frankfurt": { lat: 50.11, lon: 8.68 },
    "Barcelona": { lat: 41.39, lon: 2.17 },
    "Valencia": { lat: 39.47, lon: -0.38 },
    "Naples": { lat: 40.85, lon: 14.27 },
    "Venice": { lat: 45.44, lon: 12.32 },
    "Florence": { lat: 43.77, lon: 11.26 },
    "Moscow": { lat: 55.76, lon: 37.62 },
    "Saint Petersburg": { lat: 59.93, lon: 30.34 },
    "Kiev": { lat: 50.45, lon: 30.52 },
    "Minsk": { lat: 53.9, lon: 27.56 },
    "Bucharest": { lat: 44.43, lon: 26.1 },
    "Sofia": { lat: 42.7, lon: 23.32 },
    "Belgrade": { lat: 44.79, lon: 20.45 },
    "Zagreb": { lat: 45.82, lon: 15.98 },
    "New York": { lat: 40.71, lon: -74.01 },
    "Los Angeles": { lat: 34.05, lon: -118.24 },
    "Chicago": { lat: 41.88, lon: -87.63 },
    "San Francisco": { lat: 37.77, lon: -122.42 },
    "Toronto": { lat: 43.65, lon: -79.38 },
    "Vancouver": { lat: 49.28, lon: -123.12 },
    "Montreal": { lat: 45.5, lon: -73.57 },
    "Boston": { lat: 42.36, lon: -71.06 },
    "Seattle": { lat: 47.61, lon: -122.33 },
    "Miami": { lat: 25.76, lon: -80.19 },
    "Houston": { lat: 29.76, lon: -95.37 },
    "Dallas": { lat: 32.78, lon: -96.8 },
    "Washington DC": { lat: 38.91, lon: -77.04 },
    "Denver": { lat: 39.74, lon: -104.99 },
    "Las Vegas": { lat: 36.17, lon: -115.14 },
    "Portland": { lat: 45.52, lon: -122.68 },
    "Atlanta": { lat: 33.75, lon: -84.39 },
    "Philadelphia": { lat: 39.95, lon: -75.17 },
    "Phoenix": { lat: 33.45, lon: -112.07 },
    "San Diego": { lat: 32.72, lon: -117.16 },
    "Mexico City": { lat: 19.43, lon: -99.13 },
    "Cancun": { lat: 21.16, lon: -86.85 },
    "Sao Paulo": { lat: -23.55, lon: -46.63 },
    "Rio de Janeiro": { lat: -22.91, lon: -43.17 },
    "Buenos Aires": { lat: -34.61, lon: -58.38 },
    "Santiago": { lat: -33.45, lon: -70.66 },
    "Lima": { lat: -12.05, lon: -77.04 },
    "Bogota": { lat: 4.71, lon: -74.07 },
    "Caracas": { lat: 10.48, lon: -66.9 },
    "Quito": { lat: -0.18, lon: -78.47 },
    "Montevideo": { lat: -34.9, lon: -56.16 },
    "Brasilia": { lat: -15.79, lon: -47.88 },
    "Manaus": { lat: -3.12, lon: -60.01 },
    "Sydney": { lat: -33.87, lon: 151.21 },
    "Melbourne": { lat: -37.81, lon: 144.96 },
    "Brisbane": { lat: -27.47, lon: 153.03 },
    "Perth": { lat: -31.95, lon: 115.86 },
    "Adelaide": { lat: -34.93, lon: 138.6 },
    "Auckland": { lat: -36.85, lon: 174.76 },
    "Wellington": { lat: -41.29, lon: 174.78 },
    "Christchurch": { lat: -43.53, lon: 172.63 },
    "Cairo": { lat: 30.04, lon: 31.24 },
    "Cape Town": { lat: -33.92, lon: 18.42 },
    "Johannesburg": { lat: -26.2, lon: 28.04 },
    "Nairobi": { lat: -1.29, lon: 36.82 },
    "Lagos": { lat: 6.45, lon: 3.39 },
    "Casablanca": { lat: 33.57, lon: -7.58 },
    "Marrakech": { lat: 31.63, lon: -8 },
    "Addis Ababa": { lat: 9.03, lon: 38.74 },
    "Dar es Salaam": { lat: -6.79, lon: 39.21 },
    "Accra": { lat: 5.6, lon: -0.19 },
    "Dakar": { lat: 14.72, lon: -17.47 },
    "Tunis": { lat: 36.81, lon: 10.18 },
    "Algiers": { lat: 36.75, lon: 3.04 },
    "Khartoum": { lat: 15.51, lon: 32.56 },
    "Luanda": { lat: -8.84, lon: 13.23 }
  };
  function fetchCityGeo(cityName) {
    if (CN[cityName]) return Promise.resolve(CN[cityName]);
    const cached = getLocal("geo_" + cityName, null);
    if (cached) return Promise.resolve(cached);
    return fetch(
      "https://geocoding-api.open-meteo.com/v1/search?name=" + encodeURIComponent(cityName) + "&count=1&language=zh&format=json",
      { signal: AbortSignal.timeout(4e3) }
    ).then(function(r) {
      return r.json();
    }).then(function(d) {
      if (d && d.results && d.results[0]) {
        const r = d.results[0];
        const o = { lat: r.latitude, lon: r.longitude };
        setLocal("geo_" + cityName, o);
        return o;
      }
      return null;
    }).catch(function() {
      return null;
    });
  }
  function fetchWeather(lat, lon) {
    const key = lat.toFixed(1) + "_" + lon.toFixed(1);
    const cached = getLocal("wea_" + key, null);
    if (cached && Date.now() - cached.t < 6e5) return Promise.resolve(cached);
    return fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature&timezone=auto",
      { signal: AbortSignal.timeout(4e3) }
    ).then(function(r) {
      return r.json();
    }).then(function(d) {
      if (d && d.current) {
        const o = {
          temp: d.current.temperature_2m,
          humi: d.current.relative_humidity_2m,
          code: d.current.weather_code,
          wind: d.current.wind_speed_10m,
          feels: d.current.apparent_temperature,
          t: Date.now()
        };
        setLocal("wea_" + key, o);
        return o;
      }
      return null;
    }).catch(function() {
      return null;
    });
  }
  function getCityWeather(name, callback) {
    fetchCityGeo(name).then(function(geo) {
      if (!geo) {
        callback(null);
        return;
      }
      fetchWeather(geo.lat, geo.lon).then(function(w) {
        callback(w);
      });
    });
  }
  function mapWMO(code) {
    if (code === 0) return "clear";
    if (code >= 1 && code <= 3) return "cloudy";
    if (code >= 45 && code <= 48) return "fog";
    if (code >= 51 && code <= 67 || code >= 80 && code <= 82) return "rain";
    if (code >= 71 && code <= 77 || code >= 85 && code <= 86) return "snow";
    if (code >= 95 && code <= 99) return "thunder";
    return "clear";
  }
  function mapWMOIntensity(code) {
    if (code === 0) return 30;
    if (code >= 1 && code <= 3) return 20 + code * 15;
    if (code >= 45 && code <= 48) return 30 + (code - 44) * 15;
    if (code >= 51 && code <= 55) return 30 + (code - 50) * 15;
    if (code >= 56 && code <= 57) return 40;
    if (code >= 61 && code <= 65) return 40 + (code - 60) * 15;
    if (code >= 66 && code <= 67) return 50;
    if (code >= 71 && code <= 75) return 30 + (code - 70) * 15;
    if (code >= 76 && code <= 77) return 40;
    if (code >= 80 && code <= 82) return 50 + (code - 79) * 15;
    if (code >= 85 && code <= 86) return 50;
    if (code >= 95 && code <= 99) return 60 + (code - 94) * 15;
    return 40;
  }
  var WN_ICON = {
    clear: "☀️",
    cloudy: "☁️",
    rain: "🌧️",
    snow: "❄️",
    thunder: "⛈️",
    fog: "🌫️",
    wind: "💨"
  };

  