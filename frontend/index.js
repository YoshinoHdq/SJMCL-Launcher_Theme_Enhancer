(function() {
  // src/utils/storage.ts
  var PREFIX = "lte-";
  function getLocal(key, defaultValue) {
    try {
      const v = localStorage.getItem(PREFIX + key);
      return v !== null ? JSON.parse(v) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }
  function setLocal(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (e) {
    }
  }

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

  // src/engine/theme-effects.ts
  var THEME_OPTIONS = [
    { v: "rain", l: "Rain" },
    { v: "snow", l: "Snow" },
    { v: "sand", l: "Sandstorm" },
    { v: "stars", l: "Starry Sky" },
    { v: "aurora", l: "Aurora" },
    { v: "leaves", l: "Falling Leaves" },
    { v: "water", l: "Underwater" },
    { v: "fire", l: "Fire" },
    { v: "sunset", l: "Sunset" },
    { v: "mc", l: "Minecraft" },
    { v: "enchanting", l: "Enchanting" },
    { v: "code", l: "Code" },
    { v: "dust", l: "Dust" },
    { v: "freeze", l: "Freeze" },
    { v: "sculk", l: "Sculk" },
    { v: "blank", l: "Blank (清除所有粒子)" }
  ];
  var themeEffects = {};
  themeEffects.rain = {
    init: function(c2) {
      const p = [];
      for (let i = 0; i < 200; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          len: 10 + Math.random() * 25,
          sp: 4 + Math.random() * 8,
          op: 0.2 + Math.random() * 0.4,
          w: 0.5 + Math.random() * 1.5
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      const grd = ctx.createLinearGradient(0, h * 0.3, 0, h);
      grd.addColorStop(0, "rgba(30,40,80,0.1)");
      grd.addColorStop(1, "rgba(30,40,80,0.3)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < p.length; i++) {
        const d = p[i], a = d.op * (int / 100);
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + 1, d.y - d.len);
        ctx.strokeStyle = "rgba(120,150,220," + a + ")";
        ctx.lineWidth = d.w;
        ctx.stroke();
        d.y += d.sp;
        d.x += Math.sin(frm * 0.01 + i) * 0.3;
        if (d.y > h + 20) {
          d.y = -20;
          d.x = Math.random() * w;
        }
      }
    }
  };
  themeEffects.snow = {
    init: function(c2) {
      var p = [];
      for (var i = 0; i < 200; i++) {
        p.push({ x: Math.random() * c2.width, y: Math.random() * c2.height, sp: 0.2 + Math.random() * 0.8, op: 0.2 + Math.random() * 0.6, phase: Math.random() * Math.PI * 2, frame: Math.floor(Math.random() * 8), sz: 8 + Math.floor(Math.random() * 16), drift: (Math.random() - 0.5) * 0.8 });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      var grd = ctx.createLinearGradient(0, 0, 0, h);
      grd.addColorStop(0, "rgba(200,220,240," + 0.05 * int / 100 + ")");
      grd.addColorStop(1, "rgba(200,220,240," + 0.15 * int / 100 + ")");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);
      var img = window._ltePI && window._ltePI.snow;
      for (var i = 0; i < p.length; i++) {
        var d = p[i], a = d.op * (int / 100);
        if (a < 0.02) continue;
        var sy = d.frame * 32;
        var s = Math.round(d.sz * (1.5 + 1.5 * int / 100));
        if (img && img.complete) {
          ctx.drawImage(img, 0, sy, 64, 32, Math.round(d.x - s / 2), Math.round(d.y - s / 2), s, s / 2);
        }
        d.y += d.sp;
        d.x += Math.sin(frm * 0.01 + d.phase) * d.drift;
        d.phase += 5e-3;
        if (d.y > h + 20) {
          d.y = -20;
          d.x = Math.random() * w;
          d.frame = Math.floor(Math.random() * 8);
        }
      }
    }
  };
  themeEffects.sand = {
    init: function(c2) {
      const p = [];
      for (let i = 0; i < 300; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          sz: 1 + Math.random() * 3,
          sp: 2 + Math.random() * 8,
          op: 0.1 + Math.random() * 0.3
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(150,120,60," + 0.08 * int / 100 + ")";
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < p.length; i++) {
        const d = p[i], a = d.op * (int / 100);
        ctx.fillStyle = "rgba(200,170,100," + a + ")";
        ctx.fillRect(d.x, d.y, d.sz, d.sz);
        d.x += d.sp + Math.sin(frm * 0.01 + i) * 2;
        d.y += (Math.random() - 0.5) * 0.5;
        if (d.x > w + 5) {
          d.x = -5;
          d.y = Math.random() * h;
        }
      }
    }
  };
  themeEffects.stars = {
    init: function(c2) {
      const p = [];
      for (let i = 0; i < 150; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          sz: 0.5 + Math.random() * 2.5,
          op: 0.3 + Math.random() * 0.7,
          phase: Math.random() * Math.PI * 2,
          speed: 5e-3 + Math.random() * 0.02
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(10,10,30," + 0.3 * int / 100 + ")";
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < p.length; i++) {
        const d = p[i], twinkle = 0.5 + 0.5 * Math.sin(frm * d.speed + d.phase);
        const a = d.op * twinkle * (int / 100);
        ctx.fillStyle = "rgba(255,240,200," + a + ")";
        ctx.shadowColor = "rgba(255,240,200," + a * 0.5 + ")";
        ctx.shadowBlur = d.sz * 4;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.sz, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  };
  






themeEffects.aurora = {
    init:function(c2){var p=[];var W=c2.width,H=c2.height;
for(var ci=0;ci<3;ci++){
p.push({x:ci*W*0.28+W*0.05,y:H*0.02+Math.random()*0.03*H,w:W*0.55+Math.random()*0.15*W,ht:H*0.18+Math.random()*0.07*H,op:0.3+Math.random()*0.12,hu:100+ci*30+Math.random()*20,wa:12+Math.random()*18,wf:0.003+Math.random()*0.003,wph:Math.random()*Math.PI*2,fa:8+Math.random()*14,ff:0.01+Math.random()*0.006,fph:Math.random()*Math.PI*2,ds:0.001+Math.random()*0.002,dph:Math.random()*Math.PI*2});}
p.push({x:W*0.05,y:H*0.03,w:W*0.95,ht:H*0.2,op:0.08,hu:130,wa:30,wf:0.003,wph:0,fa:18,ff:0.008,fph:1,ds:0.0015,dph:0,isBase:true});return p;},
draw:function(ctx,ww,hh,p,int,frm){
ctx.clearRect(0,0,ww,hh);
var br=0.7+0.3*Math.sin(frm*0.0012);
for(var ci=0;ci<p.length;ci++){var b=p[ci];var a=b.op*0.5;if(a<0.01)continue;
b.dph+=b.ds;var dx=Math.sin(b.dph)*ww*0.08;var bx=b.x+dx;
var pts=40,tP=[],bP=[];
for(var i=0;i<=pts;i++){var t=i/pts,x=bx+t*b.w;
var wv=Math.sin(frm*b.wf+t*Math.PI*2+b.wph)*b.wa;
var bwv=Math.sin(frm*b.wf*0.5+t*Math.PI*2+b.wph)*b.wa*0.5;
var fd=Math.sin(frm*b.ff+t*Math.PI*4+b.fph)*b.fa;
tP.push({x:x,y:b.y+wv*0.25+fd*0.12});
bP.push({x:x,y:b.y+b.ht+bwv+fd*0.2});}
ctx.beginPath();ctx.moveTo(tP[0].x,tP[0].y);
for(var i=1;i<tP.length;i++)ctx.lineTo(tP[i].x,tP[i].y);
for(var i=bP.length-1;i>=0;i--)ctx.lineTo(bP[i].x,bP[i].y);
ctx.closePath();
var hu=b.hu+Math.sin(frm*0.002)*15;
var grd=ctx.createLinearGradient(0,b.y,0,b.y+b.ht);
if(b.isBase){
grd.addColorStop(0,"hsla("+hu+",70%,60%,"+a*0.08+")");
grd.addColorStop(0.5,"hsla("+(hu+10)+",75%,65%,"+a*0.2+")");
grd.addColorStop(1,"hsla("+(hu+20)+",75%,65%,"+a*0.4*br+")");}
else{
var btA=Math.min(a*br*1.2,0.7);
grd.addColorStop(0,"hsla("+hu+",75%,60%,"+a*0.08+")");
grd.addColorStop(0.15,"hsla("+(hu+8)+",80%,65%,"+a*0.2+")");
grd.addColorStop(0.35,"hsla("+(hu+15)+",85%,70%,"+a*0.35+")");
grd.addColorStop(0.55,"hsla("+(hu+20)+",90%,78%,"+a*0.5+")");
grd.addColorStop(0.72,"hsla("+(hu+25)+",90%,85%,"+btA*0.7+")");
grd.addColorStop(0.86,"hsla("+(hu+28)+",88%,92%,"+btA*0.8+")");
grd.addColorStop(1,"hsla("+(hu+30)+",85%,96%,"+btA+")");}
ctx.fillStyle=grd;ctx.fill();}
// Bottom glow
ctx.globalCompositeOperation="lighter";
for(var ci=0;ci<p.length-1;ci++){var b=p[ci];if(b.isBase)continue;
var a=b.op*0.4;b.dph+=b.ds;var dx=Math.sin(b.dph)*ww*0.08;var bx=b.x+dx;
var pts=40,bP=[];
for(var i=0;i<=pts;i++){var t=i/pts,x=bx+t*b.w;
var bwv=Math.sin(frm*b.wf*0.5+t*Math.PI*2+b.wph)*b.wa*0.5;
var fd=Math.sin(frm*b.ff+t*Math.PI*4+b.fph)*b.fa;
bP.push({x:x,y:b.y+b.ht+bwv+fd*0.2});}
var ga=br*0.12;if(ga<0.02)continue;
var gh=12+8*br;
var hu=b.hu+Math.sin(frm*0.002)*15;
ctx.beginPath();ctx.moveTo(bP[0].x,bP[0].y);
for(var i=1;i<bP.length;i++)ctx.lineTo(bP[i].x,bP[i].y);
for(var i=bP.length-1;i>=0;i--)ctx.lineTo(bP[i].x,bP[i].y+gh);
ctx.closePath();
var gg=ctx.createLinearGradient(0,bP[Math.floor(bP.length/2)].y,0,bP[Math.floor(bP.length/2)].y+gh);
gg.addColorStop(0,"hsla("+(hu+25)+",85%,90%,"+ga*0.8+")");
gg.addColorStop(0.5,"hsla("+(hu+28)+",85%,92%,"+ga*0.4+")");
gg.addColorStop(1,"hsla("+(hu+30)+",80%,94%,0)");
ctx.fillStyle=gg;ctx.fill();}
ctx.globalCompositeOperation="source-over";}
  };







  themeEffects.leaves = {
    init: function(c2) {
      const p = [];
      for (let i = 0; i < 80; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          sz: 4 + Math.random() * 8,
          sp: 0.3 + Math.random() * 1.2,
          op: 0.4 + Math.random() * 0.5,
          rot: Math.random() * Math.PI * 2,
          phase: Math.random() * Math.PI * 2,
          hue: 30 + Math.random() * 60
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      const grd = ctx.createLinearGradient(0, 0, 0, h);
      grd.addColorStop(0, "rgba(60,30,10,0.05)");
      grd.addColorStop(1, "rgba(60,30,10,0.15)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < p.length; i++) {
        const d = p[i], sz = d.sz * (int / 100), a = d.op * (int / 100);
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(d.rot + frm * 0.01 * d.sp);
        ctx.fillStyle = "hsla(" + d.hue + ",80%,50%," + a + ")";
        ctx.beginPath();
        ctx.ellipse(0, 0, sz, sz * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        d.y += d.sp;
        d.x += Math.sin(frm * 0.02 + d.phase) * 1.5;
        d.rot += 0.02;
        if (d.y > h + 10) {
          d.y = -10;
          d.x = Math.random() * w;
        }
      }
    }
  };
  themeEffects.water = {
    init: function(c2) {
      const p = [];
      for (let i = 0; i < 150; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          sz: 2 + Math.random() * 8,
          sp: 0.1 + Math.random() * 0.5,
          op: 0.1 + Math.random() * 0.3,
          phase: Math.random() * Math.PI * 2
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(10,40,80," + 0.15 * int / 100 + ")";
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < p.length; i++) {
        const d = p[i], a = d.op * (int / 100), sz = d.sz * (int / 100);
        ctx.fillStyle = "rgba(100,180,255," + a * 0.3 + ")";
        ctx.beginPath();
        ctx.arc(d.x, d.y, sz, 0, Math.PI * 2);
        ctx.fill();
        d.y += d.sp;
        d.x += Math.sin(frm * 0.01 + d.phase) * 0.5;
        if (d.y > h + 10) {
          d.y = -10;
          d.x = Math.random() * w;
        }
      }
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = "rgba(200,230,255," + 0.02 * int / 100 + ")";
        ctx.beginPath();
        ctx.moveTo(w * 0.2 + i * w * 0.3 + Math.sin(frm * 1e-3 + i) * 30, 0);
        ctx.lineTo(w * 0.15 + i * w * 0.3 + Math.sin(frm * 1e-3 + i + 1) * 30, h);
        ctx.lineTo(w * 0.25 + i * w * 0.3 + Math.sin(frm * 1e-3 + i + 2) * 30, h);
        ctx.closePath();
        ctx.fill();
      }
    }
  };
  themeEffects.fire = {
    init: function(c2) {
      var p = [];
      for (var i = 0; i < 250; i++) {
        p.push({ x: Math.random() * c2.width, y: c2.height * 0.6 + Math.random() * c2.height * 0.4, sz: 2 + Math.floor(Math.random() * 6), sp: 0.2 + Math.random() * 1, op: 0.1 + Math.random() * 0.4, hue: 10 + Math.floor(Math.random() * 35), sat: 70 + Math.floor(Math.random() * 30), light: 40 + Math.floor(Math.random() * 35), phase: Math.random() * Math.PI * 2, drift: (Math.random() - 0.5) * 2, scale: 0.3 + Math.random() * 0.8, type: Math.random() > 0.4 ? "flame" : "ember" });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      var bgGrd = ctx.createRadialGradient(w * 0.5, h * 0.8, 0, w * 0.5, h * 0.8, Math.max(w, h) * 0.7);
      bgGrd.addColorStop(0, "rgba(80,20,0," + 0.25 * int / 100 + ")");
      bgGrd.addColorStop(0.5, "rgba(40,10,0," + 0.15 * int / 100 + ")");
      bgGrd.addColorStop(1, "rgba(10,5,0," + 0.05 * int / 100 + ")");
      ctx.fillStyle = bgGrd;
      ctx.fillRect(0, 0, w, h);
      var flameImg = window._ltePI && window._ltePI.flame;
      for (var i = 0; i < p.length; i++) {
        var d = p[i], sz = Math.max(d.sz * (int / 100), 1), a = d.op * (int / 100);
        if (a < 0.02) continue;
        if (d.y < h * 0.5) {
          a *= Math.max(0, d.y / (h * 0.5));
        }
        var brightness = 0.85 + 0.15 * Math.sin(frm * 8e-3 + d.phase);
        if (d.type === "flame") {
          if (flameImg && flameImg.complete) {
            var s = Math.round(sz * d.scale * 2.5);
            ctx.shadowColor = "hsla(" + d.hue + ",100%,40%," + a * 0.3 * brightness + ")";
            ctx.shadowBlur = 6;
            ctx.drawImage(flameImg, Math.round(d.x - s / 2), Math.round(d.y - s / 2), s, s);
            ctx.shadowBlur = 0;
          } else {
            ctx.fillStyle = "hsla(" + d.hue + "," + d.sat + "%," + d.light * brightness + "%," + a + ")";
            ctx.fillRect(Math.round(d.x - sz), Math.round(d.y - sz), Math.round(sz * 2), Math.round(sz * 2));
          }
        } else {
          ctx.fillStyle = "hsla(" + d.hue + ",100%," + 50 * brightness + "%," + a + ")";
          ctx.fillRect(Math.round(d.x), Math.round(d.y), Math.round(Math.max(sz, 1)), Math.round(Math.max(sz, 1)));
        }
        d.y -= d.sp * brightness;
        d.x += Math.sin(frm * 0.015 + d.phase) * d.drift;
        if (d.y < -10 || d.y > h) {
          d.y = h - Math.random() * h * 0.1;
          d.x = Math.random() * w;
          d.type = Math.random() > 0.4 ? "flame" : "ember";
        }
      }
    }
  };
  themeEffects.sunset = {
    init: function(c2) {
      const p = [];
      for (let i = 0; i < 100; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          sz: 1 + Math.random() * 3,
          sp: 0.1 + Math.random() * 0.4,
          op: 0.1 + Math.random() * 0.3,
          phase: Math.random() * Math.PI * 2
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      const grd = ctx.createLinearGradient(0, 0, 0, h);
      grd.addColorStop(0, "rgba(255,180,80," + 0.15 * int / 100 + ")");
      grd.addColorStop(0.4, "rgba(255,100,50," + 0.15 * int / 100 + ")");
      grd.addColorStop(1, "rgba(80,40,80," + 0.3 * int / 100 + ")");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);
      const sunY = h * 0.65 + Math.sin(frm * 3e-3) * 10;
      const sun = ctx.createRadialGradient(w * 0.5, sunY, 0, w * 0.5, sunY, 100);
      sun.addColorStop(0, "rgba(255,220,150," + 0.3 * int / 100 + ")");
      sun.addColorStop(0.5, "rgba(255,150,50," + 0.15 * int / 100 + ")");
      sun.addColorStop(1, "rgba(255,100,50,0)");
      ctx.fillStyle = sun;
      ctx.beginPath();
      ctx.arc(w * 0.5, sunY, 100, 0, Math.PI * 2);
      ctx.fill();
      for (let i = 0; i < p.length; i++) {
        const d = p[i], a = d.op * (int / 100);
        ctx.fillStyle = "rgba(255,200,100," + a * 0.5 + ")";
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.sz, 0, Math.PI * 2);
        ctx.fill();
        d.y += d.sp;
        d.x += Math.sin(frm * 5e-3 + d.phase) * 0.3;
        if (d.y > h + 5) {
          d.y = -5;
          d.x = Math.random() * w;
        }
      }
    }
  };
  themeEffects.mc = {
    init: function(c2) {
      const p = [];
      for (let i = 0; i < 60; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          sz: 3 + Math.random() * 10,
          sp: 0.2 + Math.random() * 0.8,
          op: 0.3 + Math.random() * 0.6,
          phase: Math.random() * Math.PI * 2,
          col: Math.floor(Math.random() * 3)
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(30,30,30," + 0.2 * int / 100 + ")";
      ctx.fillRect(0, 0, w, h);
      const cols = ["#7CB342", "#5D9CEC", "#FFD54F", "#8D6E63", "#E57373", "#BA68C8"];
      for (let i = 0; i < p.length; i++) {
        const d = p[i], sz = d.sz * (int / 100), a = d.op * (int / 100);
        ctx.fillStyle = cols[d.col % cols.length];
        ctx.globalAlpha = a;
        ctx.fillRect(d.x - sz / 2, d.y - sz / 2, sz, sz);
        ctx.globalAlpha = 1;
        d.y += d.sp * Math.sin(frm * 0.02 + d.phase);
        d.x += Math.cos(frm * 0.015 + d.phase) * 0.5;
        if (d.y > h + 10 || d.y < -10) {
          d.y = Math.random() * h;
          d.x = Math.random() * w;
        }
      }
    }
  };
  themeEffects.enchanting = {
    init: function(c2) {
      const p = [];
      const glyphs2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (let i = 0; i < 60; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          sz: 16 + Math.random() * 22,
          sp: 0.15 + Math.random() * 0.5,
          op: 0.25 + Math.random() * 0.55,
          rot: Math.random() * Math.PI * 2,
          rotSp: (Math.random() - 0.5) * 0.01,
          phase: Math.random() * Math.PI * 2,
          wx: (Math.random() - 0.5) * 0.5,
          char: glyphs2[Math.floor(Math.random() * glyphs2.length)]
        });
      }
      for (let i = 0; i < 100; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          sz: 0.5 + Math.random() * 3,
          sp: 0.05 + Math.random() * 0.3,
          op: 0.15 + Math.random() * 0.65,
          life: Math.random() * 100,
          phase: Math.random() * Math.PI * 2,
          isSparkle: true,
          hue: 260 + Math.random() * 60
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      const bgX = w * 0.5 + Math.sin(frm * 1e-3) * w * 0.05;
      const bgY = h * 0.5 + Math.cos(frm * 15e-4) * h * 0.05;
      const bgGrd = ctx.createRadialGradient(bgX, bgY, 0, bgX, bgY, Math.max(w, h) * 0.7);
      bgGrd.addColorStop(0, "rgba(60,12,80," + 0.35 * int / 100 + ")");
      bgGrd.addColorStop(0.4, "rgba(35,8,55," + 0.25 * int / 100 + ")");
      bgGrd.addColorStop(0.7, "rgba(15,3,30," + 0.15 * int / 100 + ")");
      bgGrd.addColorStop(1, "rgba(5,1,10," + 0.05 * int / 100 + ")");
      ctx.fillStyle = bgGrd;
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < p.length; i++) {
        const d = p[i];
        if (!d.isSparkle) continue;
        d.life += 0.05;
        const twinkle = 0.3 + 0.7 * Math.sin(d.life * 0.012 + d.phase);
        const a = d.op * twinkle * (int / 100);
        if (a < 0.01) continue;
        ctx.fillStyle = "hsla(" + d.hue + ",80%,70%," + a + ")";
        ctx.shadowColor = "hsla(" + d.hue + ",80%,60%," + a * 0.6 + ")";
        ctx.shadowBlur = d.sz * 4;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.sz * twinkle, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        d.y += d.sp * Math.sin(d.life * 0.04);
        d.x += Math.cos(d.life * 0.025 + d.phase) * 0.2;
        if (d.y > h + 5 || d.y < -5) {
          d.y = Math.random() * h;
          d.x = Math.random() * w;
        }
      }
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let i = 0; i < p.length; i++) {
        const d = p[i];
        if (d.isSparkle) continue;
        const sz = d.sz * (int / 100);
        const a = d.op * (int / 100);
        if (a < 0.01) continue;
        const floatY = Math.sin(frm * 0.012 + d.phase) * 10;
        const floatX = Math.sin(frm * 8e-3 + d.phase * 1.3) * 6;
        ctx.save();
        ctx.translate(d.x + floatX, d.y + floatY);
        ctx.rotate(d.rot + Math.sin(frm * 8e-3 + d.phase) * 0.08);
        ctx.font = Math.round(sz) + "px GalacticSGA, serif";
        ctx.shadowColor = "rgba(180,80,255," + a * 0.9 + ")";
        ctx.shadowBlur = 20 + 15 * Math.sin(frm * 3e-3 + d.phase);
        ctx.fillStyle = "rgba(160,80,255," + a * 0.15 + ")";
        ctx.fillText(d.char, 5, 5);
        ctx.fillStyle = "rgba(200,140,255," + a * 0.25 + ")";
        ctx.fillText(d.char, 2, 2);
        ctx.shadowColor = "rgba(220,150,255," + a * 0.5 + ")";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "rgba(230,180,255," + a + ")";
        ctx.fillText(d.char, 0, 0);
        ctx.shadowBlur = 0;
        ctx.restore();
        d.y -= d.sp;
        d.x += d.wx + Math.sin(frm * 8e-3 + d.phase) * 0.3;
        d.rot += d.rotSp;
        if (d.y < -40) {
          d.y = h + 30;
          d.x = Math.random() * w;
          d.char = glyphs[Math.floor(Math.random() * glyphs.length)];
        }
      }
    }
  };
  themeEffects.code = {
    init: function(c2) {
      const columns = [];
      const colWidth = 22;
      const colCount = Math.floor(c2.width / colWidth);
      for (let i = 0; i < colCount; i++) {
        const len = 10 + Math.floor(Math.random() * 20);
        const chars = [];
        const timers = [];
        for (let j = 0; j < len; j++) {
          chars.push(Math.random() > 0.5 ? "0" : "1");
          timers.push(Math.floor(Math.random() * 200));
        }
        columns.push({
          x: i * colWidth + Math.random() * 4,
          y: -Math.random() * c2.height * 1.2,
          speed: 1 + Math.random() * 2.5,
          length: len,
          phase: Math.random() * Math.PI * 2,
          chars,
          morphTimers: timers
        });
      }
      return columns;
    },
    draw: function(ctx, w, h, columns, int, frm) {
      ctx.clearRect(0, 0, w, h);
      const bgGrd = ctx.createLinearGradient(0, 0, 0, h);
      bgGrd.addColorStop(0, "rgba(0,8,0," + 0.15 * int / 100 + ")");
      bgGrd.addColorStop(1, "rgba(0,20,5," + 0.3 * int / 100 + ")");
      ctx.fillStyle = bgGrd;
      ctx.fillRect(0, 0, w, h);
      const fontSize = Math.round(20 + 16 * int / 100);
      ctx.font = fontSize + "px MinecraftPixel, 'Courier New', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const rowHeight = fontSize * 0.95;
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        col.y += col.speed;
        if (col.y - col.length * rowHeight > h) {
          col.y = -col.length * rowHeight - Math.random() * 80;
          col.speed = 1 + Math.random() * 2.5;
          for (let j = 0; j < col.length; j++) {
            col.chars[j] = Math.random() > 0.5 ? "0" : "1";
            col.morphTimers[j] = Math.floor(Math.random() * 50);
          }
        }
        for (let j = 0; j < col.length; j++) {
          const charY = col.y - j * rowHeight;
          if (charY < -rowHeight * 2 || charY > h + rowHeight) continue;
          col.morphTimers[j]++;
          if (col.morphTimers[j] > 60 + Math.floor(Math.random() * 120)) {
            col.morphTimers[j] = 0;
            col.chars[j] = Math.random() > 0.5 ? "0" : "1";
          }
          const ratio = j / col.length;
          const columnFade = Math.sin(frm * 3e-3 + col.phase) * 0.15 + 0.5;
          const a = (1 - ratio * 0.85) * columnFade * (int / 100);
          if (a < 0.02) continue;
          const isHead = j === 0;
          const isMid = j < col.length * 0.3;
          if (isHead) {
            ctx.fillStyle = "rgba(180,255,180," + Math.min(a * 2, 1) + ")";
            ctx.shadowColor = "rgba(0,255,100," + Math.min(a * 0.7, 0.5) + ")";
            ctx.shadowBlur = 15;
          } else if (isMid) {
            ctx.fillStyle = "rgba(120,230,120," + a * 0.8 + ")";
            ctx.shadowColor = "rgba(0,200,80," + a * 0.3 + ")";
            ctx.shadowBlur = 8;
          } else {
            ctx.fillStyle = "rgba(60,180,60," + a * 0.5 + ")";
            ctx.shadowColor = "rgba(0,150,50," + a * 0.1 + ")";
            ctx.shadowBlur = 3;
          }
          ctx.fillText(col.chars[j], col.x, charY);
          ctx.shadowBlur = 0;
        }
      }
    }
  };
  themeEffects.blank = {
    init: function(c2) {
      return [];
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
    }
  };
  themeEffects.dust = {
    init: function(c2) {
      var p = [];
      for (var i = 0; i < 200; i++) {
        p.push({ x: Math.random() * c2.width, y: Math.random() * c2.height * -1, sz: 2 + Math.floor(Math.random() * 4), sp: 0.2 + Math.random() * 0.6, op: 0.2 + Math.random() * 0.5, phase: Math.random() * Math.PI * 2, drift: (Math.random() - 0.5) * 0.8, colorIdx: Math.floor(Math.random() * 8) });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(180,160,120," + 0.08 * int / 100 + ")";
      ctx.fillRect(0, 0, w, h);
      var sizes = [2, 3, 4, 5];
      for (var i = 0; i < p.length; i++) {
        var d = p[i], sz = d.sz * (int / 100), a = d.op * (int / 100);
        if (a < 0.02) continue;
        ctx.fillStyle = "rgba(" + (180 + Math.floor(Math.random() * 40)) + "," + (160 + Math.floor(Math.random() * 40)) + "," + (140 + Math.floor(Math.random() * 40)) + "," + a + ")";
        ctx.fillRect(Math.round(d.x), Math.round(d.y), Math.round(Math.max(sz, 1)), Math.round(Math.max(sz, 1)));
        d.y += d.sp;
        d.x += Math.sin(frm * 5e-3 + d.phase) * d.drift;
        if (d.y > h + 10) {
          d.y = -10;
          d.x = Math.random() * w;
          d.colorIdx = Math.floor(Math.random() * 8);
        }
      }
    }
  };
  




themeEffects.freeze = {
    init:function(c2){
      var p=[];
      // Layer1: 555 big crystals (thick 5.0)
      for(var i=0;i<55;i++){
        var e=Math.floor(Math.random()*4);
        p.push({_type:0,
          x:e===0?Math.random()*c2.width:e===1?c2.width+5:e===2?Math.random()*c2.width:-5,
          y:e===0?-5:e===1?Math.random()*c2.height:e===2?c2.height+5:Math.random()*c2.height,
          size:28+Math.floor(Math.random()*22),sp:0.01+Math.random()*0.02,
          op:0.7+Math.random()*0.3,phase:Math.random()*Math.PI*2,
          growDir:e,breathPhase:Math.random()*Math.PI*2,
          branch:1+Math.floor(Math.random()*2),maxDist:80+Math.random()*70,
          dist:0,growing:true,thick:5.0
        });
      }
      // Layer2: thin flickering crystals
      for(var i=0;i<70;i++){
        var e=Math.floor(Math.random()*4);
        p.push({_type:1,
          x:e===0?Math.random()*c2.width:e===1?c2.width+8:e===2?Math.random()*c2.width:-8,
          y:e===0?-8:e===1?Math.random()*c2.height:e===2?c2.height+8:Math.random()*c2.height,
          size:8+Math.random()*16,sp:0.02+Math.random()*0.04,
          op:0.2+Math.random()*0.3,phase:Math.random()*Math.PI*2,
          growDir:e,breathPhase:Math.random()*Math.PI*2,
          branch:1+Math.floor(Math.random()*2),maxDist:40+Math.random()*50,
          dist:0,growing:true,thick:1.0,
          extendTime:Math.random()*100,extendSpeed:0.003+Math.random()*0.008,
          flickerSpeed:0.008+Math.random()*0.02,flickerPhase:Math.random()*Math.PI*2
        });
      }
      // Layer3: Snow particles (1.3x normal snow size)
      for(var i=0;i<120;i++){
        p.push({_type:2,
          x:Math.random()*c2.width,y:Math.random()*c2.height,
          sp:0.2+Math.random()*0.8,op:0.2+Math.random()*0.5,
          phase:Math.random()*Math.PI*2,frame:Math.floor(Math.random()*8),
          sz:10+Math.floor(Math.random()*20),drift:(Math.random()-0.5)*0.8
        });
      }
      return p;
    },
    drawSnowflake:function(ctx,cx,cy,size,a,breath,subL,flicker,thick){
      if(subL<0||size<3)return;
      var fade=1-subL*0.3,fv=flicker!==undefined?0.5+0.5*flicker:1;
      var alpha=a*0.6*breath*fade*fv;
      if(alpha<0.015)return;
      ctx.strokeStyle="rgba(100,175,215,"+alpha+")";
      ctx.lineWidth=(thick||1.0)*(1.2-subL*0.2);
      for(var i=0;i<6;i++){
        var a2=Math.PI/3*i+Math.PI/6,ex=cx+size*Math.cos(a2),ey=cy+size*Math.sin(a2);
        ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(ex,ey);ctx.stroke();
        var sub=size*0.35;
        for(var j=1;j<=2;j++){
          var t=j/3,bx=cx+size*t*Math.cos(a2),by=cy+size*t*Math.sin(a2),sa1=a2+Math.PI/4,sa2=a2-Math.PI/4;
          ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx+sub*Math.cos(sa1),by+sub*Math.sin(sa1));ctx.stroke();
          ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx+sub*Math.cos(sa2),by+sub*Math.sin(sa2));ctx.stroke();
        }
        if(subL>0)this.drawSnowflake(ctx,ex,ey,size*0.3,a*0.6,breath,subL-1,flicker,thick);
      }
    },
    draw:function(ctx,w,h,p,int,frm){
      var self=this;
      ctx.clearRect(0,0,w,h);
      var fg=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,Math.max(w,h)*0.6);
      fg.addColorStop(0,"rgba(8,30,40,"+0.08*int/100+")");
      fg.addColorStop(0.6,"rgba(4,18,25,"+0.15*int/100+")");
      fg.addColorStop(1,"rgba(2,6,10,"+0.25*int/100+")");
      ctx.fillStyle=fg;ctx.fillRect(0,0,w,h);
      
      var snowImg=window._ltePI&&window._ltePI.snow;
      for(var i=0;i<p.length;i++){
        var d=p[i];
        if(!isFinite(d.x)||!isFinite(d.y))continue;
        // Layer3: snow particles
        if(d._type===2){
          var a=d.op*(int/100);
          if(a<0.02||!snowImg||!snowImg.complete)continue;
          var sy=d.frame*32;
          var s=Math.round(d.sz*(1.5+1.5*int/100)*1.3);
          ctx.drawImage(snowImg,0,sy,64,32,Math.round(d.x-s/2),Math.round(d.y-s/2),s,s/2);
          d.y+=d.sp;d.x+=Math.sin(frm*0.01+d.phase)*d.drift;d.phase+=5e-3;
          if(d.y>h+20){d.y=-20;d.x=Math.random()*w;d.frame=Math.floor(Math.random()*8);}
          continue;
        }
        var a=d.op*(int/100);
        if(a<0.02)continue;
        var br=0.8+0.2*Math.sin(frm*4e-3+d.breathPhase),fv=1;
        if(d._type===1){
          d.flickerPhase+=d.flickerSpeed;
          if(d.growing){d.dist+=d.sp;if(d.dist>=d.maxDist){d.growing=false;d.extendTime=0;}}
          else{d.extendTime+=d.extendSpeed;var wv=Math.sin(d.extendTime+d.phase);d.dist=d.maxDist*(1+wv*0.2);if(wv<-0.19&&Math.random()<0.003){d.growing=true;d.dist=0;d.growDir=Math.floor(Math.random()*4);d.x=d.growDir===0?Math.random()*w:d.growDir===1?w+8:d.growDir===2?Math.random()*w:-8;d.y=d.growDir===0?-8:d.growDir===1?Math.random()*h:d.growDir===2?h+8:Math.random()*h;d.maxDist=40+Math.random()*50;}}
          fv=0.5+0.5*Math.sin(d.flickerPhase);
        }else{
          d.dist+=d.sp*(d.growing?1:-1);
          if(d.dist>d.maxDist||d.dist<2)d.growing=!d.growing;
        }
        var cx=d.x,cy=d.y;
        if(d.growDir===0)cy+=d.dist;else if(d.growDir===1)cx-=d.dist;else if(d.growDir===2)cy-=d.dist;else cx+=d.dist;
        if(cx<-200||cx>w+200||cy<-200||cy>h+200)continue;
        var fs=d.size*(0.5+0.5*int/100)*br;
        self.drawSnowflake(ctx,cx,cy,fs,a,br,d.branch,fv,d.thick||1.0);
      }
    }
  };






themeEffects.sculk = {
    init:function(c2){
      var p=[];
      var L=[
        {z:0,sc:0.65,ba:0.45,cr:0.45},
        {z:1,sc:1.0,ba:0.70,cr:0.35},
        {z:2,sc:1.5,ba:0.95,cr:0.20}
      ];
      var gc=[20,180,180];
      for(var li=0;li<3;li++){
        var l=L[li],cnt=Math.floor(130*l.cr);
        for(var i=0;i<cnt;i++){
          var bs=12+Math.random()*22;
          p.push({
            bx:Math.random()*c2.width,by:Math.random()*c2.height,x:0,y:0,
            bs:bs,ds:bs*l.sc,
            st:Math.floor(Math.random()*3),
            ph:Math.random()*Math.PI*4,ts:0.004+Math.random()*0.009,
            da:Math.random()*Math.PI*2,fp:0.5+Math.random()*1.8,
            rt:Math.random()*Math.PI*2,rs:(Math.random()-0.5)*0.009,
            ba:l.ba,dp:l.z
          });
        }
      }
      return p;
    },
    drawShape:function(ctx,t,s,a){
      ctx.fillStyle="rgba(20,180,180,1)";
      if(t===0){
        ctx.fillRect(-s*0.4,-s*0.8,s*0.8,s*0.22);
        ctx.fillRect(-s*0.8,-s*0.4,s*0.22,s*0.8);
        ctx.fillRect(s*0.18,-s*0.4,s*0.22,s*0.8);
        ctx.fillRect(-s*0.4,s*0.18,s*0.8,s*0.22);
        ctx.fillRect(-s*0.65,-s*0.65,s*0.22,s*0.22);
        ctx.fillRect(s*0.43,-s*0.65,s*0.22,s*0.22);
        ctx.fillRect(-s*0.65,s*0.43,s*0.22,s*0.22);
        ctx.fillRect(s*0.43,s*0.43,s*0.22,s*0.22);
      }else if(t===1){
        ctx.fillRect(-s*0.4,-s*0.8,s*0.8,s*0.22);
        ctx.fillRect(-s*0.8,-s*0.4,s*0.22,s*0.8);
        ctx.fillRect(s*0.18,-s*0.4,s*0.22,s*0.45);
        ctx.fillRect(-s*0.4,s*0.4,s*0.8,s*0.22);
        ctx.fillRect(s*0.43,-s*0.65,s*0.22,s*0.22);
        ctx.fillRect(s*0.43,s*0.1,s*0.22,s*0.55);
      }else{
        ctx.fillRect(-s*0.7,-s*0.2,s*0.22,s*0.22);
        ctx.fillRect(-s*0.45,-s*0.45,s*0.22,s*0.22);
        ctx.fillRect(-s*0.2,-s*0.7,s*0.22,s*0.22);
        ctx.fillRect(s*0.4,s*0.3,s*0.22,s*0.22);
        ctx.fillRect(s*0.4,-s*0.4,s*0.22,s*0.7);
      }
    },
    draw:function(ctx,w,h,p,int,frm){
      ctx.clearRect(0,0,w,h);
      
      ctx.fillStyle="rgba(8,30,40,0.06)";
      ctx.fillRect(0,0,w,h);
      
      var gc=[20,180,180],dc=[0,110,110],lc=[80,220,230];
      for(var i=0;i<p.length;i++){
        var d=p[i];
        d.ph+=d.ts;d.da+=0.007;
        var x=d.bx+Math.sin(d.da)*22*d.fp,y=d.by+Math.cos(d.da)*14*d.fp;
        d.rt+=d.rs;
        var br=0.5+0.5*Math.sin(d.ph),ra=d.ba*br*(int/100);
        if(ra<0.02)continue;
        ctx.save();ctx.translate(x,y);ctx.rotate(d.rt);
        var gl=ctx.createRadialGradient(0,0,0,0,0,d.ds*2.2);
        gl.addColorStop(0,"rgba("+lc.join(",")+","+ra*0.45+")");
        gl.addColorStop(0.5,"rgba("+gc.join(",")+","+ra*0.22+")");
        gl.addColorStop(1,"rgba("+dc.join(",")+",0)");
        ctx.fillStyle=gl;ctx.fillRect(-d.ds*2.2,-d.ds*2.2,d.ds*4.4,d.ds*4.4);
        ctx.globalAlpha=ra;this.drawShape(ctx,d.st,d.ds,ra);
        ctx.restore();
      }
    }
  };



  var _tc = null;
  var _ta = null;
  var _tp = [];
  var _tt = "rain";
  var _ti = 50;
  var _trun = false;
  var _tfrm = 0;
  function makeThemeCanvas() {
    if (_tc) return _tc;
    _tc = document.createElement("canvas");
    _tc.id = "lte-th-bg";
    _tc.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:2;pointer-events:none;";
    document.body.insertBefore(_tc, document.body.firstChild);
    _tc.width = window.innerWidth;
    _tc.height = window.innerHeight;
    return _tc;
  }
  function removeThemeCanvas() {
    if (_ta) {
      cancelAnimationFrame(_ta);
      _ta = null;
    }
    if (_tc && _tc.parentNode) _tc.parentNode.removeChild(_tc);
    _tc = null;
    _tp = [];
    _trun = false;
    window._trun = false;
    _tfrm = 0;
  }
  function themeAnimLoop() {
    _tfrm++;
    if (_tc && _trun) {
      try {
        const ctx = _tc.getContext("2d");
        if (ctx && themeEffects[_tt]) {
          themeEffects[_tt].draw(ctx, _tc.width, _tc.height, _tp.filter(function(x) {
            return isFinite(x.x) && isFinite(x.y);
          }), _ti, _tfrm);
        }
      } catch (_e) {
      }
    }
    _ta = requestAnimationFrame(themeAnimLoop);
  }
  function startThemeEffects(type, intensity) {
    if (_trun) stopThemeEffects();
    _tt = type || "rain";
    _ti = intensity || 50;
    _trun = true;
    window._trun = true;
    _tfrm = 0;
    const c2 = makeThemeCanvas();
    if (themeEffects[_tt]) _tp = themeEffects[_tt].init(c2);
    themeAnimLoop();
    const rs = function() {
      if (_tc) {
        _tc.width = window.innerWidth;
        _tc.height = window.innerHeight;
        if (themeEffects[_tt]) _tp = themeEffects[_tt].init(_tc);
      }
    };
    window.addEventListener("resize", rs);
    window._lteThResize = rs;
  }
  function updateThemeEffects(type, intensity) {
    if (type !== null && type !== void 0) {
      _tt = type;
      if (_tc && themeEffects[_tt]) _tp = themeEffects[_tt].init(_tc);
    }
    if (intensity !== null && intensity !== void 0) _ti = intensity;
  }
  function stopThemeEffects() {
    _trun = false;
    window._trun = false;
    if (_ta) {
      cancelAnimationFrame(_ta);
      _ta = null;
    }
    if (window._lteThResize) {
      window.removeEventListener("resize", window._lteThResize);
      window._lteThResize = null;
    }
    removeThemeCanvas();
  }
  var _vvideo = null;
  var _vurl = null;
  var _vactive = false;
  var _vpaused = false;
  var _vvol = 0.5;
  try {
    const sv = localStorage.getItem("lte-vvol");
    if (sv) _vvol = parseFloat(sv);
  } catch (e) {
  }
  function pickVideoFile() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.onchange = function(e) {
      const file = e.target.files[0];
      if (!file) return;
      videoKill();
      _vurl = URL.createObjectURL(file);
      _vactive = true;
      _vpaused = false;
      videoPlay();
      try {
        localStorage.setItem("lte-vname", file.name);
      } catch (e2) {
      }
    };
    input.click();
  }
  function videoPlay() {
    if (!_vurl) return;
    if (!_vvideo || !_vvideo.parentNode) {
      if (_vvideo && _vvideo.parentNode) _vvideo.parentNode.removeChild(_vvideo);
      _vvideo = document.createElement("video");
      _vvideo.id = "lte-video-bg";
      _vvideo.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);min-width:100vw;min-height:100vh;width:auto;height:auto;z-index:0;object-fit:cover;pointer-events:none;";
      _vvideo.src = _vurl;
      _vvideo.loop = true;
      _vvideo.muted = false;
      _vvideo.volume = _vvol;
      _vvideo.playsInline = true;
      _vactive = true;
      _vpaused = false;
      document.body.insertBefore(_vvideo, document.body.firstChild);
      _vvideo.play().catch(function() {
      });
      return;
    }
    _vpaused = false;
    _vvideo.play().catch(function() {
    });
  }
  function videoPause() {
    if (_vvideo) {
      _vvideo.pause();
      _vpaused = true;
    }
  }
  function videoKill() {
    _vactive = false;
    _vpaused = false;
    if (_vvideo && _vvideo.parentNode) _vvideo.parentNode.removeChild(_vvideo);
    _vvideo = null;
    if (_vurl) {
      URL.revokeObjectURL(_vurl);
      _vurl = null;
    }
  }
  function videoVolume(v) {
    _vvol = v;
    if (_vvideo) _vvideo.volume = v;
    try {
      localStorage.setItem("lte-vvol", String(v));
    } catch (e) {
    }
  }

  // src/locales/en.ts
  var en = {
    cityWeather: "City Weather",
    themeEnhancer: "Theme Enhancer",
    active: "Active",
    standby: "Standby",
    cityWeatherDesc: "Real-time weather with atmospheric particle effects",
    themeEnhancerDesc: "Video background + 12 custom particle effects",
    searchCity: "Search City",
    searchPlaceholder: "Search city...",
    loading: "Loading...",
    fetchData: "Fetching...",
    humidity: "Humidity",
    wind: "Wind",
    feels: "Feels",
    clear: "Clear",
    cloudy: "Cloudy",
    rain: "Rain",
    snow: "Snow",
    thunderstorm: "Thunderstorm",
    foggy: "Fog",
    windy: "Windy",
    atmosphereEffect: "Atmosphere Effect",
    particleEffects: "Particle Effects",
    saturationOverlay: "saturation overlay",
    themeEffects: "Theme Effects",
    on: "ON",
    off: "OFF",
    video: "Video",
    play: "▶ Play",
    pause: "⏸  Pause",
    remove: "🗑  Remove",
    change: "📁  Change",
    selectVideo: "Select Video File",
    stop: "⏹  Stop",
    start: "▶ Start",
    intensity: "Intensity",
    effectType: "Effect Type",
    volume: "Volume",
    videoLayer: "z-index: 0 (bottom layer)",
    effectRain: "🌧  Rain",
    effectSnow: "❄️  Snow",
    effectSandstorm: "🌪  Sandstorm",
    effectStarrySky: "✨  Starry Sky",
    effectAurora: "🌌  Aurora",
    effectFallingLeaves: "🍃  Falling Leaves",
    effectUnderwater: "🌊  Underwater",
    effectFire: "🔥  Fire",
    effectSunset: "🌅  Sunset",
    effectMinecraft: "🎮  Vigor",
    effectEnchanting: "✨  Enchanting",
    effectCode: "💻  Code (Stealth Hacker)",
    effectDust: "💨 Dust",
    effectFreeze: "❄️ Freeze",
    effectSculk: "🌑 Sculk",
    effectBlank: "🧹 Blank (Clear All)",
    running: "Running",
    stopped: "Stopped",
    sectionCityWeather: "🌤  City Weather",
    sectionVideoBackground: "🎬  Video Background",
    sectionThemeParticles: "✨  Theme Particle Effects",
    typeCityName: "Type a city name...",
    wmoClear: "Sunny",
    wmoCloudy: "Cloudy",
    wmoFog: "Foggy",
    wmoRain: "Rainy",
    wmoSnow: "Snowy",
    wmoThunder: "Thunderstorm",
    author: "Author",
    version: "Version",
    help: "Help",
    layerOrder: "Layer order: Video (z:0) -> Weather (z:1) -> Theme (z:2)",
    enchantingDesc: "Minecraft enchantment table atmosphere with galactic glyphs",
    codeDesc: "Falling 0s and 1s in the style of digital rain"
  };
  var en_default = en;

  // src/locales/zh.ts
  var zh = {
    cityWeather: "城市天气",
    themeEnhancer: "主题增强",
    active: "运行中",
    standby: "待机",
    cityWeatherDesc: "实时天气与氛围粒子特效",
    themeEnhancerDesc: "视频背景 + 12 种自定义粒子效果",
    searchCity: "搜索城市",
    searchPlaceholder: "搜索城市...",
    loading: "加载中...",
    fetchData: "获取数据中...",
    humidity: "湿度",
    wind: "风速",
    feels: "体感",
    clear: "晴",
    cloudy: "多云",
    rain: "雨",
    snow: "雪",
    thunderstorm: "雷暴",
    foggy: "雾",
    windy: "大风",
    atmosphereEffect: "氛围效果",
    particleEffects: "粒子特效",
    saturationOverlay: "饱和度覆盖",
    themeEffects: "主题特效",
    on: "开",
    off: "关",
    video: "视频",
    play: "▶ 播放",
    pause: "⏸  暂停",
    remove: "🗑  移除",
    change: "📁  更换",
    selectVideo: "选择视频文件",
    stop: "⏹  停止",
    start: "▶ 开始",
    intensity: "强度",
    effectType: "效果类型",
    volume: "音量",
    videoLayer: "z-index: 0（底层）",
    effectRain: "🌧  雨天",
    effectSnow: "❄️  雪天",
    effectSandstorm: "🌪  沙暴",
    effectStarrySky: "✨  星空",
    effectAurora: "🌌  极光",
    effectFallingLeaves: "🍃  落叶",
    effectUnderwater: "🌊  海底",
    effectFire: "🔥  火焰",
    effectSunset: "🌅  日落",
    effectMinecraft: "🎮  活力",
    effectEnchanting: "✨  附魔",
    effectCode: "💻  低调的黑客",
    effectDust: "💨 灰尘",
    effectFreeze: "❄️ 冻结",
    effectSculk: "🌑 幽匿",
    effectBlank: "🧹  空白（清除所有粒子）",
    running: "运行中",
    stopped: "已停止",
    sectionCityWeather: "🌤  城市天气",
    sectionVideoBackground: "🎬  视频背景",
    sectionThemeParticles: "✨  主题粒子特效",
    typeCityName: "输入城市名称...",
    wmoClear: "晴朗",
    wmoCloudy: "多云",
    wmoFog: "有雾",
    wmoRain: "有雨",
    wmoSnow: "有雪",
    wmoThunder: "雷暴",
    author: "作者",
    version: "版本",
    help: "帮助",
    layerOrder: "层级：视频 (z:0) → 天气 (z:1) → 主题 (z:2)",
    enchantingDesc: "Minecraft 附魔台氛围，银河字母辉光效果",
    codeDesc: "0 和 1 数字雨，极客风格"
  };
  var zh_default = zh;

  // src/locales/index.ts
  var locales = { en: en_default, zh: zh_default };
  function useLocale(host) {
    const [locale] = host.state.useExtensionState("locale", "en");
    const strings = locales[locale] || en_default;
    return function(key) {
      var _a, _b;
      return (_b = (_a = strings[key]) != null ? _a : en_default[key]) != null ? _b : key;
    };
  }

  // src/widgets/home-widget.ts
  function wmoLocaleKey(type) {
    const m = {
      clear: "wmoClear",
      cloudy: "wmoCloudy",
      rain: "wmoRain",
      snow: "wmoSnow",
      thunder: "wmoThunder",
      fog: "wmoFog",
      windy: "wmoClear"
    };
    return m[type] || "wmoClear";
  }
  function fxLocaleKey(v) {
    const m = {
      rain: "effectRain",
      snow: "effectSnow",
      sand: "effectSandstorm",
      stars: "effectStarrySky",
      aurora: "effectAurora",
      leaves: "effectFallingLeaves",
      water: "effectUnderwater",
      fire: "effectFire",
      sunset: "effectSunset",
      mc: "effectMinecraft",
      enchanting: "effectEnchanting",
      code: "effectCode",
      blank: "effectBlank",
      dust: "effectDust",
      freeze: "effectFreeze",
      sculk: "effectSculk"
    };
    return m[v] || "effectRain";
  }
  function createCityWeatherWidget(api) {
    const React = api.React;
    const ChakraUI = api.ChakraUI;
    const { useState, useEffect, useCallback, useMemo } = React;
    const el = React.createElement;
    const { Box, VStack, HStack, Text, Button } = ChakraUI;
    function weaGradient(type) {
      var m = { clear: "linear-gradient(135deg,rgba(255,200,80,0.35),rgba(255,120,30,0.08))", cloudy: "linear-gradient(135deg,rgba(100,130,160,0.35),rgba(60,70,90,0.08))", rain: "linear-gradient(135deg,rgba(40,80,160,0.4),rgba(15,40,80,0.08))", snow: "linear-gradient(135deg,rgba(180,210,240,0.3),rgba(200,220,250,0.08))", thunder: "linear-gradient(135deg,rgba(50,25,80,0.45),rgba(15,8,30,0.1))", fog: "linear-gradient(135deg,rgba(120,130,140,0.3),rgba(80,85,90,0.08))", wind: "linear-gradient(135deg,rgba(70,140,170,0.3),rgba(40,80,100,0.08))" };
      return m[type] || m.clear;
    }
    function weaAccent(type) {
      var m = { clear: "#ffcc44", cloudy: "#8899aa", rain: "#4488dd", snow: "#aaccff", thunder: "#8844cc", fog: "#99a0a8", wind: "#66bbdd" };
      return m[type] || m.clear;
    }
    function tempColor(t) {
      if (t < 0) return "#66b3ff";
      if (t < 10) return "#88ccff";
      if (t < 20) return "#ffcc44";
      if (t < 30) return "#ff8833";
      return "#ff4444";
    }
    function weaAnim(type) {
      var m = { clear: "pulse 3s ease-in-out infinite", cloudy: "drift 4s ease-in-out infinite", rain: "none", snow: "snowfall 5s ease-in-out infinite", thunder: "flicker 0.5s ease-in-out infinite", fog: "drift 6s ease-in-out infinite", wind: "drift 2s ease-in-out infinite" };
      return m[type] || "none";
    }
    return function CityWeatherWidget() {
      const host = api.getHostContext();
      const es = host.state.useExtensionState;
      const [city, setCity] = es("cw_city", "");
      const [wInfo, setWInfo] = es("cw_wi", null);
      const [input, setInput] = useState("");
      const [loading, setLoading] = useState(false);
      const t = useLocale(host);
      useEffect(function() {
        if (!document.getElementById("lte-wx-keys")) {
          var s = document.createElement("style");
          s.id = "lte-wx-keys";
          s.textContent = "@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.7;transform:scale(1.08)}}@keyframes drift{0%,100%{transform:translateX(0)}50%{transform:translateX(6px)}}@keyframes snowfall{0%,100%{transform:translateY(0)rotate(0deg)}50%{transform:translateY(8px)rotate(10deg)}}@keyframes flicker{0%,100%{opacity:1}50%{opacity:0.3}}@keyframes shine{0%{background-position:-200% 0}100%{background-position:200% 0}}";
          document.head.appendChild(s);
        }
      }, []);
      const searchCity = useCallback(function() {
        const v = input.trim();
        if (!v) return;
        setLoading(true);
        setWInfo(null);
        setCity(v);
        try {
          localStorage.setItem("lte-cw_city", JSON.stringify(v));
        } catch (e) {
        }
        getCityWeather(v, function(d) {
          setLoading(false);
          if (d) setWInfo(d);
        });
      }, [input]);
      const weaType = wInfo ? mapWMO(wInfo.code) : "clear";
      const weatherIcon = wInfo ? WN_ICON[weaType] || "" : "";
      const grad = weaGradient(weaType);
      const accent = weaAccent(weaType);
      const tColor = wInfo ? tempColor(wInfo.temp) : "white";
      const anim = wInfo ? weaAnim(weaType) : "none";
      return el(
        Box,
        {
          p: 4,
          borderRadius: "2xl",
          bg: "rgba(8,12,24,0.92)",
          backdropFilter: "blur(4px)",
          border: "1px solid rgba(255,255,255,0.1)",
          position: "relative",
          overflow: "hidden"
        },
        // Animated weather gradient overlay
        wInfo ? el(Box, {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          style: { background: grad, opacity: 0.8, transition: "background 0.6s ease" }
        }) : null,
        // Accent border line
        el(Box, {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          h: "2px",
          style: { background: "linear-gradient(90deg, " + accent + ", #7b2ff7)", transition: "background 0.5s ease" },
          pointerEvents: "none"
        }),
        el(
          VStack,
          { spacing: 3, align: "stretch", position: "relative", zIndex: 1 },
          el(Text, { fontSize: "xs", fontWeight: "bold", color: "white", letterSpacing: "0.5px", textTransform: "uppercase" }, t("cityWeather")),
          el(
            HStack,
            { spacing: 2 },
            el("input", {
              placeholder: t("searchPlaceholder"),
              value: input,
              onInput: function(e) {
                setInput(e.target.value);
              },
              onKeyDown: function(e) {
                if (e.key === "Enter") searchCity();
              },
              style: {
                flex: 1,
                padding: "6px 10px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.08)",
                color: "#e2e8f0",
                border: "1px solid rgba(255,255,255,0.15)",
                fontSize: "13px",
                outline: "none"
              }
            }),
            el(
              Button,
              { size: "xs", colorScheme: "blue", onClick: searchCity, isDisabled: !input.trim() || loading, borderRadius: "10px" },
              loading ? "..." : "🔍"
            )
          ),
          wInfo ? el(
            Box,
            {
              p: 3,
              borderRadius: "xl",
              style: { border: "1px solid " + accent + "40", transition: "border-color 0.5s ease" },
              bg: "rgba(255,255,255,0.04)"
            },
            el(
              VStack,
              { spacing: 2, align: "center" },
              el(Text, { fontSize: "11px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "medium" }, city || ""),
              el(
                HStack,
                { spacing: 1, align: "center" },
                el("span", { style: { fontSize: "40px", fontWeight: "300", color: tColor, lineHeight: "1", transition: "color 0.5s ease, textShadow 0.5s ease", textShadow: "0 0 8px " + accent + "60, 0 0 16px " + accent + "30" } }, wInfo.temp + "°"),
                el(Text, { fontSize: "14px", color: "rgba(255,255,255,0.5)", mt: "6px" }, "C")
              ),
              el(
                HStack,
                { spacing: 1, align: "center" },
                el(Text, { fontSize: "24px", style: { animation: anim, display: "inline-block" } }, weatherIcon),
                el(Text, { fontSize: "13px", color: "rgba(255,255,255,0.7)", fontWeight: "500" }, t(wmoLocaleKey(weaType)))
              ),
              el(Box, { h: "1px", bg: "rgba(255,255,255,0.06)", w: "100%" }),
              el(
                HStack,
                { spacing: 4, justify: "center" },
                el(
                  VStack,
                  { spacing: 0, align: "center" },
                  el(Text, { fontSize: "10px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }, t("humidity")),
                  el(Text, { fontSize: "14px", color: "white", fontWeight: "600" }, wInfo.humi + "%")
                ),
                el(
                  VStack,
                  { spacing: 0, align: "center" },
                  el(Text, { fontSize: "10px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }, t("wind")),
                  el(Text, { fontSize: "14px", color: "white", fontWeight: "600" }, wInfo.wind + " km/h")
                ),
                wInfo.feels ? el(
                  VStack,
                  { spacing: 0, align: "center" },
                  el(Text, { fontSize: "10px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }, t("feels")),
                  el(Text, { fontSize: "14px", color: "white", fontWeight: "600" }, wInfo.feels + "°")
                ) : null
              )
            )
          ) : el(
            Box,
            { p: 3, borderRadius: "xl", bg: "rgba(255,255,255,0.04)", textAlign: "center" },
            el(
              Text,
              { fontSize: "sm", color: "rgba(255,255,255,0.4)" },
              city ? el("span", null, t("loading")) : el("span", null, t("searchCity"))
            )
          )
        )
      );
    };
  }
  function createThemeEnhancerWidget(api) {
    const React = api.React;
    const ChakraUI = api.ChakraUI;
    const { useState, useEffect } = React;
    const el = React.createElement;
    const { Box, VStack, HStack, Text, Badge, Button } = ChakraUI;
    function useVidState() {
      const [s, setS] = useState({ active: window._vactive || false, paused: window._vpaused || false, vol: window._vvol || 0.5 });
      useEffect(function() {
        const id = setInterval(function() {
          setS({ active: window._vactive || false, paused: window._vpaused || false, vol: window._vvol || 0.5 });
        }, 150);
        return function() {
          clearInterval(id);
        };
      }, []);
      return s;
    }
    return function ThemeEnhancerWidget() {
      const host = api.getHostContext();
      const es = host.state.useExtensionState;
      const vs = useVidState();
      const t = useLocale(host);
      var _tt2 = window._tt || "rain";
      var _ti2 = window._ti || 50;
      var _trun2 = window._trun || false;
      const [selType, setSelType] = useState(_tt2);
      const [selInt, setSelInt] = useState(_ti2);
      function toggleTheme() {
        if (window._trun) {
          stopThemeEffects();
        } else {
          startThemeEffects(selType, selInt);
        }
      }
      function changeType(v) {
        setSelType(v);
        window._tt = v;
        
        if(v==="blank"){stopThemeEffects();}else if(window._trun){updateThemeEffects(v);}
      }
      function changeInt(v) {
        var n = parseInt(v);
        setSelInt(n);
        window._ti = n;
        
        if (window._trun) updateThemeEffects(null, n);
      }
      return el(
        Box,
        {
          p: 4,
          borderRadius: "2xl",
          bg: "rgba(8,12,24,0.9)",
          backdropFilter: "blur(4px)",
          border: "1px solid rgba(255,255,255,0.1)",
          position: "relative",
          overflow: "hidden"
        },
        el(Box, {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          h: "2px",
          bg: "linear-gradient(90deg, #7b2ff7, #ff6b6b)",
          pointerEvents: "none"
        }),
        el(
          VStack,
          { spacing: 3, align: "stretch", position: "relative", zIndex: 1 },
          el(
            HStack,
            { justify: "space-between", align: "center" },
            el(Text, { fontSize: "xs", fontWeight: "bold", color: "white", letterSpacing: "0.5px", textTransform: "uppercase" }, t("themeEnhancer")),
            el(
              HStack,
              { spacing: 2 },
              el(
                Badge,
                { colorScheme: window._trun ? "green" : "gray", variant: "solid", fontSize: "xs", borderRadius: "full", px: 2 },
                window._trun ? t("on") : t("off")
              ),
              vs.active ? el(Badge, { colorScheme: "blue", variant: "solid", fontSize: "xs", borderRadius: "full", px: 2 }, t("video")) : null
            )
          ),
          // Video section
          el(
            Box,
            { p: 2, borderRadius: "lg", bg: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" },
            el(
              VStack,
              { spacing: 2, align: "stretch" },
              el(
                HStack,
                { spacing: 1, flex: 1 },
                /*pause removed*/
                el(Button, {
                  size: "xs",
                  colorScheme: "red",
                  variant: "ghost",
                  px: 1,
                  fontSize: "11px",
                  onClick: videoKill
                }, t("remove")),
                el(Button, {
                  size: "xs",
                  colorScheme: "green",
                  variant: "ghost",
                  px: 1,
                  fontSize: "11px",
                  onClick: pickVideoFile
                }, t("change"))
              ),
              el(
                Box,
                null,
                el(Text, { fontSize: "xs", color: "rgba(255,255,255,0.4)", mb: 1 }, t("volume") + ": " + Math.round(vs.vol * 100) + "%"),
                el("input", {
                  type: "range",
                  min: 0,
                  max: 1,
                  step: 0.01,
                  defaultValue: vs.vol,
                  onChange: function(e) {
                    videoVolume(parseFloat(e.target.value));
                  },
                  style: { width: "100%", accentColor: "#4299ff", height: "4px", cursor: "pointer" }
                })
              )
            )
          ),
          el(
            Box,
            { p: 2, borderRadius: "lg", bg: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" },
            el(
              VStack,
              { spacing: 2, align: "stretch" },
              el("select", {
                value: selType,
                onChange: function(e) {
                  changeType(e.target.value);
                },
                style: {
                  width: "100%",
                  padding: "6px 8px",
                  borderRadius: "8px",
                  background: "rgba(20,28,58,0.95)",
                  color: "#c8d0e0",
                  border: "1px solid rgba(100,150,255,0.3)",
                  fontSize: "12px",
                  cursor: "pointer",
                  outline: "none"
                }
              }, THEME_OPTIONS.map(function(o) {
                return el("option", { value: o.v, key: o.v }, t(fxLocaleKey(o.v)));
              })),
              el(
                HStack,
                { spacing: 2, align: "center" },
                el(Button, {
                  size: "xs",
                  colorScheme: window._trun ? "red" : "green",
                  borderRadius: "8px",
                  onClick: toggleTheme
                }, window._trun ? t("stop") : t("start")),
                el(
                  Box,
                  { flex: 1 },
                  el("input", {
                    type: "range",
                    min: 10,
                    max: 100,
                    step: 5,
                    value: selInt,
                    onChange: function(e) {
                      changeInt(e.target.value);
                    },
                    style: { width: "100%", accentColor: "#4299ff", height: "4px", cursor: "pointer" }
                  })
                ),
                el(Text, { fontSize: "10px", color: "rgba(255,255,255,0.4)", minW: "28px", textAlign: "right" }, selInt + "%")
              )
            )
          )
        )
      );
    };
  }

  // src/pages/settings-page.ts
  function wmoLocaleKey2(type) {
    const m = {
      clear: "wmoClear",
      cloudy: "wmoCloudy",
      rain: "wmoRain",
      snow: "wmoSnow",
      thunder: "wmoThunder",
      fog: "wmoFog",
      windy: "wmoClear"
    };
    return m[type] || "wmoClear";
  }
  function fxLocaleKey2(v) {
    const m = {
      rain: "effectRain",
      snow: "effectSnow",
      sand: "effectSandstorm",
      stars: "effectStarrySky",
      aurora: "effectAurora",
      leaves: "effectFallingLeaves",
      water: "effectUnderwater",
      fire: "effectFire",
      sunset: "effectSunset",
      mc: "effectMinecraft",
      enchanting: "effectEnchanting",
      code: "effectCode",
      blank: "effectBlank",
      dust: "effectDust",
      freeze: "effectFreeze",
      sculk: "effectSculk"
    };
    return m[v] || "effectRain";
  }
  function createSettingsPage(api) {
    const React = api.React;
    const ChakraUI = api.ChakraUI;
    const { useState, useEffect, useCallback } = React;
    const el = React.createElement;
    const { Box, VStack, HStack, Text, Badge, Switch, Button, Input, Heading } = ChakraUI;
    function useVidState() {
      const [s, setS] = useState({
        active: window._vactive || false,
        paused: window._vpaused || false,
        vol: window._vvol || 0.5
      });
      useEffect(function() {
        const id = setInterval(function() {
          setS({
            active: window._vactive || false,
            paused: window._vpaused || false,
            vol: window._vvol || 0.5
          });
        }, 150);
        return function() {
          clearInterval(id);
        };
      }, []);
      return s;
    }
    return function SettingsPage() {
      const host = api.getHostContext();
      const es = host.state.useExtensionState;
      const vs = useVidState();
      const [locale, setLocale] = es("locale", "en");
      const t = useLocale(host);
      const [city, setCity] = es("cw_city", "");
      const [wInfo, setWInfo] = es("cw_wi", null);
      const [input, setInput] = useState(city || "");
      const [loading, setLoading] = useState(false);
      const [tType, setTType] = useState(window._tt || "rain");
      const [tInt, setTInt] = useState(window._ti || 50);
            function searchCitySetting() {
        var v = input.trim();
        if (!v) return;
        setLoading(true);
        setWInfo(null);
        setCity(v);
        try {
          localStorage.setItem("lte-cw_city", JSON.stringify(v));
        } catch (e) {
        }
        getCityWeather(v, function(d) {
          setLoading(false);
          if (d) {
            setWInfo(d);
            var weaType = mapWMO(d.code), inten = mapWMOIntensity(d.code);
          }
        });
      }
      function changeThemeType(v) {
        setTType(v);
        window._tt = v;
        
        if(v==="blank"){stopThemeEffects();}else if(window._trun){updateThemeEffects(v);}
      }
      function changeThemeInt(v) {
        var n = parseInt(v);
        setTInt(n);
        window._ti = n;
        
        if (window._trun) updateThemeEffects(null, n);
      }
      function toggleTheme() {
        if (window._trun) {
          stopThemeEffects();
        } else {
          startThemeEffects(tType, tInt);
        }
      }
      return el(
        Box,
        {
          p: 6,
          borderRadius: "2xl",
          bg: "rgba(8,12,24,0.95)",
          backdropFilter: "blur(4px)",
          border: "1px solid rgba(255,255,255,0.08)"
        },
        el(
          VStack,
          { spacing: 6, align: "stretch" },
          // ===== Language Selector =====
          el(
            Box,
            { p: 3, borderRadius: "lg", bg: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" },
            el(
              HStack,
              { spacing: 3, align: "center" },
              el(Text, { fontSize: "sm", color: "gray.300", fontWeight: "500" }, "Language / 语言"),
              el(Button, {
                size: "sm",
                colorScheme: locale === "en" ? "blue" : "gray",
                variant: locale === "en" ? "solid" : "outline",
                borderRadius: "8px",
                onClick: function() {
                  setLocale("en");
                }
              }, "English"),
              el(Button, {
                size: "sm",
                colorScheme: locale === "zh" ? "blue" : "gray",
                variant: locale === "zh" ? "solid" : "outline",
                borderRadius: "8px",
                onClick: function() {
                  setLocale("zh");
                }
              }, "中文")
            )
          ),
          // ===== Section: City Weather =====
          el(
            Box,
            null,
            el(
              HStack,
              { spacing: 2, mb: 3, align: "center" },
              el(Box, { w: "18px", h: "18px", borderRadius: "sm", bg: "blue.500" }),
              el(Heading, { size: "sm", color: "white", fontWeight: "600" }, t("sectionCityWeather"))
            ),
            el(
              Box,
              { p: 3, borderRadius: "lg", bg: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" },
              el(
                VStack,
                { spacing: 3, align: "stretch" },
                el(
                  HStack,
                  { spacing: 2 },
                  el("input", {
                    placeholder: t("typeCityName"),
                    value: input,
                    onInput: function(e) {
                      setInput(e.target.value);
                    },
                    onKeyDown: function(e) {
                      if (e.key === "Enter") searchCitySetting();
                    },
                    style: {
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: "10px",
                      background: "rgba(255,255,255,0.08)",
                      color: "#e2e8f0",
                      border: "1px solid rgba(255,255,255,0.15)",
                      fontSize: "14px",
                      outline: "none"
                    }
                  }),
                  el(
                    Button,
                    { size: "sm", colorScheme: "blue", borderRadius: "10px", onClick: searchCitySetting, isDisabled: !input.trim() || loading },
                    loading ? "..." : "🔍"
                  )
                ),
                wInfo ? el(
                  HStack,
                  { spacing: 4, p: 2, borderRadius: "md", bg: "rgba(255,255,255,0.04)" },
                  el(
                    VStack,
                    { spacing: 0 },
                    el(Text, { fontSize: "sm", color: "gray.300", fontWeight: "500" }, city || ""),
                    el(Text, { fontSize: "2xl", fontWeight: "bold", color: "orange.300", lineHeight: "1.2" }, wInfo.temp + "°C")
                  ),
                  el(
                    VStack,
                    { spacing: 1, flex: 1 },
                    el(Text, { fontSize: "xs", color: "gray.400" }, "💧 " + t("humidity") + ": " + wInfo.humi + "%"),
                    el(Text, { fontSize: "xs", color: "gray.400" }, "💨 " + t("wind") + ": " + wInfo.wind + " km/h"),
                    wInfo.feels ? el(Text, { fontSize: "xs", color: "gray.400" }, "🌡 " + t("feels") + ": " + wInfo.feels + "°C") : null,
                    el(Text, { fontSize: "xs", color: "cyan.300" }, "☁ " + t(wmoLocaleKey2(mapWMO(wInfo.code))) + " (Code: " + wInfo.code + ")")
                  )
                ) : el(
                  Text,
                  { fontSize: "sm", color: "gray.500", textAlign: "center" }
                )
              )
            )
          ),
          // ===== Section: Video Background =====
          el(
            Box,
            null,
            el(
              HStack,
              { spacing: 2, mb: 3, align: "center" },
              el(Box, { w: "18px", h: "18px", borderRadius: "sm", bg: "green.500" }),
              el(Heading, { size: "sm", color: "white", fontWeight: "600" }, t("sectionVideoBackground"))
            ),
            el(
              Box,
              { p: 3, borderRadius: "lg", bg: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" },
              el(
                VStack,
                { spacing: 3, align: "stretch" },
                el(
                  HStack,
                  { justify: "space-between", align: "center" },
                  el(
                    Badge,
                    { colorScheme: vs.active ? "green" : "gray", variant: "solid", fontSize: "sm", px: 2, py: 1, borderRadius: "full" },
                    vs.active ? "▶ " + t("play") : "⏹ " + t("stopped")
                  ),
                  el(Text, { fontSize: "xs", color: "gray.500" }, t("videoLayer"))
                ),
                vs.active ? el(
                  VStack,
                  { spacing: 2, align: "stretch" },
                  el(
                    HStack,
                    { spacing: 2 },
                    el(Button, {
                      size: "sm",
                      colorScheme: "blue",
                      flex: 1,
                      borderRadius: "10px",
                      onClick: function() {
                        if (window._vpaused) videoPlay();
                        else videoPause();
                      }
                    }, vs.paused ? "▶" : "⏸"),
                    el(Button, { size: "sm", colorScheme: "green", flex: 1, borderRadius: "10px", onClick: pickVideoFile }, t("change")),
                    el(Button, { size: "sm", colorScheme: "red", flex: 1, borderRadius: "10px", onClick: videoKill }, t("remove"))
                  ),
                  el(
                    Box,
                    null,
                    el(Text, { fontSize: "sm", color: "gray.300", mb: 1 }, t("volume") + ": " + Math.round(vs.vol * 100) + "%"),
                    el("input", {
                      type: "range",
                      min: 0,
                      max: 1,
                      step: 0.01,
                      defaultValue: vs.vol,
                      onChange: function(e) {
                        videoVolume(parseFloat(e.target.value));
                      },
                      style: { width: "100%", accentColor: "#4299ff" }
                    })
                  )
                ) : el(
                  Button,
                  { size: "lg", colorScheme: "green", w: "100%", py: 8, borderRadius: "xl", onClick: pickVideoFile, minH: "140px" },
                  el(
                    VStack,
                    { spacing: 3, align: "center" },
                    el(Text, { fontSize: "2xl" }, "📁"),
                    el(Text, { fontSize: "sm", fontWeight: "500" }, t("selectVideo")),
                    el(Text, { fontSize: "xs", color: "gray.400" }, "MP4 / WebM / OGG")
                  )
                )
              )
            )
          ),
          // ===== Section: Theme Particle Effects =====
          el(
            Box,
            null,
            el(
              HStack,
              { spacing: 2, mb: 3, align: "center" },
              el(Box, { w: "18px", h: "18px", borderRadius: "sm", bg: "purple.500" }),
              el(Heading, { size: "sm", color: "white", fontWeight: "600" }, t("sectionThemeParticles"))
            ),
            el(
              Box,
              { p: 3, borderRadius: "lg", bg: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" },
              el(
                VStack,
                { spacing: 3, align: "stretch" },
                el(
                  HStack,
                  { justify: "space-between", align: "center" },
                  el(Text, { fontSize: "sm", color: "gray.300", fontWeight: "500" }, t("effectType")),
                  el(
                    Badge,
                    { colorScheme: window._trun ? "green" : "gray", variant: "solid", fontSize: "sm", borderRadius: "full", px: 2 },
                    window._trun ? t("running") : t("stopped")
                  )
                ),
                el("select", {
                  value: tType,
                  onChange: function(e) {
                    changeThemeType(e.target.value);
                  },
                  style: {
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    background: "rgba(20,28,58,0.95)",
                    color: "#c8d0e0",
                    border: "1px solid rgba(100,150,255,0.3)",
                    fontSize: "14px",
                    cursor: "pointer",
                    outline: "none"
                  }
                }, THEME_OPTIONS.map(function(o) {
                  return el("option", { value: o.v, key: o.v }, t(fxLocaleKey2(o.v)));
                })),
                el(
                  HStack,
                  { spacing: 3, align: "center" },
                  el(Button, {
                    size: "sm",
                    colorScheme: window._trun ? "red" : "green",
                    borderRadius: "10px",
                    px: 4,
                    onClick: toggleTheme
                  }, window._trun ? t("stop") : t("start"))
                ),
                el(
                  Box,
                  null,
                  el(
                    HStack,
                    { justify: "space-between" },
                    el(Text, { fontSize: "sm", color: "gray.300" }, t("intensity")),
                    el(Text, { fontSize: "sm", color: "cyan.300", fontWeight: "600" }, "" + tInt + "%")
                  ),
                  el("input", {
                    type: "range",
                    min: 10,
                    max: 100,
                    step: 5,
                    value: tInt,
                    onChange: function(e) {
                      changeThemeInt(e.target.value);
                    },
                    style: { width: "100%", accentColor: "#4299ff" }
                  })
                )
              )
            )
          ),
          // ===== Section: Help =====
          el(
            Box,
            { p: 3, borderRadius: "lg", bg: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" },
            el(
              VStack,
              { spacing: 1, align: "stretch" },
              el(Text, { fontSize: "xs", color: "gray.500" }, t("version") + " 0.1.1"),
              el(Text, { fontSize: "xs", color: "gray.500" }, t("author") + ": hemekewayoshino"),
              el(Box, { h: "1px", bg: "rgba(255,255,255,0.06)", my: 1 }),
              el(Text, { fontSize: "xs", color: "gray.500" }, t("layerOrder"))
            )
          )
        )
      );
    };
  }

  // src/index.ts
  function getToken() {
    var _a, _b, _c;
    let t = ((_b = (_a = document.currentScript) == null ? void 0 : _a.dataset) == null ? void 0 : _b.extensionToken) || "";
    if (t) return t;
    const scripts = document.querySelectorAll("script");
    for (let i = 0; i < scripts.length; i++) {
      const tok = (_c = scripts[i].dataset) == null ? void 0 : _c.extensionToken;
      if (tok) return tok;
    }
    return "";
  }
  var TOKEN = getToken();
  if (typeof window.registerExtension !== "function") {
    throw new Error("SJMCL host is unavailable");
  }
  window.registerExtension(function(api) {
    try {
      const u = api.resolveAssetUrl("assets/galactic.ttf");
      const f = new FontFace("GalacticSGA", "url(" + u + ")");
      f.load().then(function() {
        document.fonts.add(f);
      }).catch(function() {
      });
    } catch (e) {
    }
    try {
      const u = api.resolveAssetUrl("assets/Minecraft.ttf");
      const f = new FontFace("MinecraftPixel", "url(" + u + ")");
      f.load().then(function() {
        document.fonts.add(f);
      }).catch(function() {
      });
    } catch (e) {
    }
    window._ltePI = {};
    function lp(key, path) {
      var i2 = new Image();
      i2.src = api.resolveAssetUrl(path);
      window._ltePI[key] = i2;
    }
    lp("snow", "assets/particles/snow.png");
    lp("flame", "assets/particles/flame.png");
    for (var i = 0; i < 11; i++) lp("sculk_soul_" + i, "assets/particles/sculk/sculk_soul_" + i + ".png");
    for (var i = 0; i < 7; i++) lp("sculk_charge_" + i, "assets/particles/sculk/sculk_charge_" + i + ".png");
    for (var i = 0; i < 4; i++) lp("sculk_charge_pop_" + i, "assets/particles/sculk/sculk_charge_pop_" + i + ".png");
    return {
      homeWidgets: [
        {
          key: "city-weather",
          title: "City Weather",
          description: "Real-time weather with atmospheric particle effects",
          icon: "cloud-sun",
          Component: createCityWeatherWidget(api)
        },
        {
          key: "theme-enhancer",
          title: "Theme Enhancer",
          description: "Video background + 12 custom particle effects",
          icon: "palette",
          Component: createThemeEnhancerWidget(api)
        }
      ],
      settingsPage: {
        Component: createSettingsPage(api)
      }
    };
  }, TOKEN);
})();
