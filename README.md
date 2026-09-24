# Clima Global

Aplicación web de clima en español que muestra **clima actual**, **pronóstico a 7 días** y **estadísticas climáticas históricas** de cualquier ciudad del mundo.

Frontend en JavaScript puro (ES Modules) con [Vite](https://vitejs.dev/). Los datos provienen de las APIs gratuitas de [Open-Meteo](https://open-meteo.com/) (sin clave de API).

## Características

- Búsqueda de ciudades con autocompletado (API de geocodificación de Open-Meteo).
- Tarjeta con el clima actual: temperatura, sensación térmica, humedad, precipitación, viento, presión y UV.
- Pronóstico diario de 7 días (máx/mín, lluvia y probabilidad de precipitación).
- Sección "Clima histórico": gráfico en canvas de la evolución de temperaturas y precipitación, con rangos configurables (7, 14, 30 y 90 días).
- Tabla de estadísticas: medias, extremos, desviación estándar, días lluviosos/secos y tendencia.
- Exportación de datos a CSV.
- Arquitectura por capas: domain, data, services, controllers, ui, core.
- Caché en memoria con TTL, manejo centralizado de errores y eventos.

## Estructura

```
clima-global/
├─ index.html
├─ package.json
├─ vite.config.js
├─ README.md
├─ public/
│  └─ favicon.svg
└─ src/
   ├─ main.js
   ├─ config/
   │  ├─ env.js            # URL base y variables de entorno (VITE_*)
   │  └─ api.config.js     # endpoints, variables y parámetros de las APIs
   ├─ core/
   │  ├─ ApiError.js       # error de dominio para la API
   │  ├─ ApiClient.js      # cliente HTTP con timeout y caché
   │  ├─ EventBus.js       # pub/sub de eventos
   │  ├─ Store.js          # estado global reactivo
   │  └─ App.js            # composición raíz de la aplicación
   ├─ domain/
   │  ├─ Location.js
   │  ├─ CurrentWeather.js
   │  ├─ DailyForecast.js
   │  ├─ ClimateRecord.js
   │  ├─ ClimateSummary.js
   │  └─ WeatherBundle.js
   ├─ data/
   │  ├─ CacheService.js
   │  ├─ GeocodingRepository.js
   │  ├─ ForecastRepository.js
   │  └─ ArchiveRepository.js
   ├─ services/
   │  ├─ LocationService.js
   │  ├─ WeatherService.js
   │  ├─ ClimateService.js
   │  └─ ExportService.js
   ├─ controllers/
   │  ├─ SearchController.js
   │  ├─ ForecastController.js
   │  └─ ClimateController.js
   ├─ ui/
   │  ├─ components/
   │  │  ├─ BaseComponent.js
   │  │  ├─ SearchBar.js
   │  │  ├─ CurrentCard.js
   │  │  ├─ ForecastList.js
   │  │  ├─ ClimateChart.js
   │  │  ├─ StatsTable.js
   │  │  ├─ Spinner.js
   │  │  └─ Toast.js
   │  └─ views/
   │     ├─ HomeView.js
   │     └─ ClimateView.js
   ├─ utils/
   │  ├─ date.js
   │  ├─ format.js
   │  ├─ statistics.js
   │  ├─ weatherCodes.js
   │  ├─ debounce.js
   │  └─ dom.js
   └─ styles/
      ├─ tokens.css
      ├─ main.css
      └─ components.css
```

## Instalación y uso

```bash
npm install
npm run dev        # entorno de desarrollo (abre el navegador en http://localhost:5173)
npm run build      # compila a la carpeta dist/
npm run preview    # previsualiza el build
```

## Configuración (variables de entorno)

Opcional. Se definen en un archivo `.env` en la raíz del proyecto.

| Variable               | Descripción                          | Valor por defecto                     |
| ---------------------- | ------------------------------------ | ------------------------------------- |
| `VITE_FORECAST_URL`    | Base de la API de pronóstico         | `https://api.open-meteo.com/v1`       |
| `VITE_GEOCODING_URL`   | Base de la API de geocodificación    | `https://geocoding-api.open-meteo.com/v1` |
| `VITE_ARCHIVE_URL`     | Base de la API de archivo climático  | `https://archive-api.open-meteo.com/v1`  |
| `VITE_REQUEST_TIMEOUT` | Timeout de peticiones (ms)           | `10000`                               |
| `VITE_CACHE_TTL`       | Duración de la caché en memoria (ms) | `600000`                              |
| `VITE_DEFAULT_CITY`    | Ciudad que se carga al iniciar       | `Madrid`                              |

## APIs utilizadas

- [Geocodificación](https://open-meteo.com/en/docs/geocoding-api) — búsqueda de ciudades.
- [Pronóstico](https://open-meteo.com/en/docs) — clima actual y pronóstico diario.
- [Archivo histórico](https://open-meteo.com/en/docs/historical-weather-api) — registros diarios pasados.