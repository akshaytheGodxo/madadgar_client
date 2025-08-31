// API Service for fetching real-time disaster and weather data

class APIService {
    constructor() {
        this.cache = new Map();
        this.requestQueue = [];
        this.isRateLimited = false;
    }

    // Generic API request handler with caching and error handling
    async makeRequest(url, options = {}, cacheKey = null, cacheDuration = 300000) {
        try {
            // Check cache first
            if (cacheKey && this.cache.has(cacheKey)) {
                const cached = this.cache.get(cacheKey);
                if (Date.now() - cached.timestamp < cacheDuration) {
                    return cached.data;
                }
            }

            // Handle rate limiting
            if (this.isRateLimited) {
                throw new Error('Rate limit exceeded. Please try again later.');
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                if (response.status === 429) {
                    this.isRateLimited = true;
                    setTimeout(() => { this.isRateLimited = false; }, 60000); // 1 minute cooldown
                }
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // Cache the result
            if (cacheKey) {
                this.cache.set(cacheKey, {
                    data: data,
                    timestamp: Date.now()
                });
            }

            return data;
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // Get current weather data from OpenWeatherMap
    async getCurrentWeather(lat, lon) {
        if (!CONFIG.apis.openweather.key || CONFIG.apis.openweather.key === 'YOUR_OPENWEATHER_API_KEY') {
            // Return mock data if no API key
            return this.getMockWeatherData(lat, lon);
        }

        try {
            const url = `${CONFIG.apis.openweather.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${CONFIG.apis.openweather.key}&units=metric`;
            const cacheKey = `weather_${lat}_${lon}`;
            
            return await this.makeRequest(url, {}, cacheKey, CONFIG.refreshIntervals.weather);
        } catch (error) {
            console.warn('Weather API failed, using mock data:', error);
            return this.getMockWeatherData(lat, lon);
        }
    }

    // Get weather forecast
    async getWeatherForecast(lat, lon) {
        if (!CONFIG.apis.openweather.key || CONFIG.apis.openweather.key === 'YOUR_OPENWEATHER_API_KEY') {
            return this.getMockForecastData(lat, lon);
        }

        try {
            const url = `${CONFIG.apis.openweather.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${CONFIG.apis.openweather.key}&units=metric`;
            const cacheKey = `forecast_${lat}_${lon}`;
            
            return await this.makeRequest(url, {}, cacheKey, CONFIG.refreshIntervals.weather);
        } catch (error) {
            console.warn('Forecast API failed, using mock data:', error);
            return this.getMockForecastData(lat, lon);
        }
    }

    // Get earthquake data from USGS
    async getEarthquakeData(lat, lon, radius = 100) {
        try {
            const url = `${CONFIG.apis.usgs.earthquake}/query?format=geojson&latitude=${lat}&longitude=${lon}&maxradiuskm=${radius}&minmagnitude=3.0&limit=20&orderby=time`;
            const cacheKey = `earthquake_${lat}_${lon}_${radius}`;
            
            const data = await this.makeRequest(url, {}, cacheKey, CONFIG.refreshIntervals.earthquake);
            return data.features || [];
        } catch (error) {
            console.warn('Earthquake API failed, using mock data:', error);
            return this.getMockEarthquakeData(lat, lon);
        }
    }

    // Get disaster alerts from government sources
    async getDisasterAlerts(lat, lon) {
        try {
            // This would integrate with IMD or ISRO APIs when available
            // For now, return mock alerts based on location and season
            return this.getMockDisasterAlerts(lat, lon);
        } catch (error) {
            console.warn('Disaster alerts API failed:', error);
            return [];
        }
    }

    // Get flood monitoring data
    async getFloodData(lat, lon) {
        try {
            // Integration with flood monitoring systems
            // For now, return calculated flood risk based on location
            return this.calculateFloodRisk(lat, lon);
        } catch (error) {
            console.warn('Flood data API failed:', error);
            return { risk: 'unknown', details: 'Data unavailable' };
        }
    }

    // Mock weather data generator
    getMockWeatherData(lat, lon) {
        const temp = 20 + Math.random() * 25; // 20-45°C
        const humidity = 30 + Math.random() * 70; // 30-100%
        const pressure = 990 + Math.random() * 40; // 990-1030 hPa
        const windSpeed = Math.random() * 20; // 0-20 m/s
        
        // Adjust for Indian climate patterns
        const isCoastal = this.isCoastalArea(lat, lon);
        const isMountainous = this.isMountainousArea(lat, lon);
        
        return {
            main: {
                temp: temp,
                humidity: isCoastal ? Math.max(60, humidity) : humidity,
                pressure: isMountainous ? Math.max(pressure - 20, 950) : pressure
            },
            wind: {
                speed: isCoastal ? windSpeed * 1.5 : windSpeed
            },
            weather: [{
                main: this.getWeatherCondition(temp, humidity),
                description: 'Simulated weather data'
            }],
            name: this.getNearestCityName(lat, lon)
        };
    }

    // Mock forecast data
    getMockForecastData(lat, lon) {
        const forecastList = [];
        for (let i = 0; i < 8; i++) {
            const temp = 18 + Math.random() * 28;
            const humidity = 40 + Math.random() * 50;
            
            forecastList.push({
                dt: Date.now() / 1000 + (i * 3600 * 3), // 3-hour intervals
                main: {
                    temp: temp,
                    humidity: humidity,
                    pressure: 1000 + Math.random() * 20
                },
                wind: {
                    speed: Math.random() * 15
                },
                weather: [{
                    main: this.getWeatherCondition(temp, humidity),
                    description: `Forecast ${i + 1}`
                }]
            });
        }
        
        return { list: forecastList };
    }

    // Mock earthquake data
    getMockEarthquakeData(lat, lon) {
        const earthquakes = [];
        const numEarthquakes = Math.floor(Math.random() * 3); // 0-2 recent earthquakes
        
        for (let i = 0; i < numEarthquakes; i++) {
            const magnitude = 3.0 + Math.random() * 4.0; // 3.0 - 7.0
            const distance = Math.random() * 100; // Within 100km
            const angle = Math.random() * Math.PI * 2;
            
            earthquakes.push({
                properties: {
                    mag: magnitude,
                    place: `${Math.round(distance)}km from your location`,
                    time: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000, // Within last 7 days
                    title: `M ${magnitude.toFixed(1)} - Simulated earthquake`
                },
                geometry: {
                    coordinates: [
                        lon + (distance / 111) * Math.cos(angle), // Rough conversion to degrees
                        lat + (distance / 111) * Math.sin(angle)
                    ]
                }
            });
        }
        
        return earthquakes;
    }

    // Mock disaster alerts
    getMockDisasterAlerts(lat, lon) {
        const alerts = [];
        const currentMonth = new Date().getMonth();
        
        // Monsoon season alerts
        if (currentMonth >= 5 && currentMonth <= 9) {
            if (this.isFloodProneArea(lat, lon)) {
                alerts.push({
                    severity: 'Moderate',
                    event: 'Flood Watch',
                    description: 'Heavy rainfall expected in your area. Monitor local water levels.',
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                });
            }
            
            if (this.isLandslideProneArea(lat, lon)) {
                alerts.push({
                    severity: 'Minor',
                    event: 'Landslide Advisory',
                    description: 'Monsoon season increases landslide risk in hilly areas.',
                    expires: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
                });
            }
        }
        
        // Cyclone season alerts for coastal areas
        if ((currentMonth >= 9 && currentMonth <= 11) && this.isCoastalArea(lat, lon)) {
            alerts.push({
                severity: 'Minor',
                event: 'Cyclone Watch',
                description: 'Post-monsoon cyclone season. Stay alert for weather updates.',
                expires: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString()
            });
        }
        
        return alerts;
    }

    // Helper functions for geographic classification
    isCoastalArea(lat, lon) {
        // Check if location is within 50km of Indian coastline
        const coastalRegions = [
            { lat: 8.0883, lon: 77.5385, radius: 50 }, // Kerala coast
            { lat: 13.0827, lon: 80.2707, radius: 50 }, // Chennai coast  
            { lat: 19.0760, lon: 72.8777, radius: 50 }, // Mumbai coast
            { lat: 20.2961, lon: 85.8245, radius: 50 }, // Odisha coast
            { lat: 22.5726, lon: 88.3639, radius: 50 }  // Kolkata coast
        ];
        
        return coastalRegions.some(region => {
            const distance = this.calculateDistance(lat, lon, region.lat, region.lon);
            return distance <= region.radius * 1000;
        });
    }

    isMountainousArea(lat, lon) {
        // Check if location is in mountainous regions
        return lat > 28 || // Himalayas
               (lat > 10 && lat < 12 && lon > 76 && lon < 78) || // Western Ghats
               (lat > 15 && lat < 20 && lon > 73 && lon < 75);   // Western Ghats Maharashtra
    }

    isFloodProneArea(lat, lon) {
        return DISASTER_REGIONS.floods.some(region => {
            const distance = this.calculateDistance(lat, lon, region.lat, region.lng);
            return distance <= region.radius;
        });
    }

    isLandslideProneArea(lat, lon) {
        return DISASTER_REGIONS.landslides.some(region => {
            const distance = this.calculateDistance(lat, lon, region.lat, region.lng);
            return distance <= region.radius;
        });
    }

    calculateFloodRisk(lat, lon) {
        const floodRegion = DISASTER_REGIONS.floods.find(region => {
            const distance = this.calculateDistance(lat, lon, region.lat, region.lng);
            return distance <= region.radius;
        });

        if (floodRegion) {
            const distance = this.calculateDistance(lat, lon, floodRegion.lat, floodRegion.lng);
            const proximity = 1 - (distance / floodRegion.radius);
            
            return {
                risk: proximity > 0.7 ? 'high' : proximity > 0.4 ? 'medium' : 'low',
                details: floodRegion.details,
                distance: Math.round(distance / 1000)
            };
        }

        return { risk: 'low', details: 'No immediate flood risk detected', distance: null };
    }

    // Utility functions
    getWeatherCondition(temp, humidity) {
        if (temp > 35) return 'Hot';
        if (temp < 10) return 'Cold';
        if (humidity > 80) return 'Humid';
        if (humidity < 30) return 'Dry';
        return 'Clear';
    }

    getNearestCityName(lat, lon) {
        const cities = [
            { name: 'Delhi', lat: 28.6139, lon: 77.2090 },
            { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
            { name: 'Kolkata', lat: 22.5726, lon: 88.3639 },
            { name: 'Chennai', lat: 13.0827, lon: 80.2707 },
            { name: 'Bangalore', lat: 12.9716, lon: 77.5946 },
            { name: 'Hyderabad', lat: 17.3850, lon: 78.4867 }
        ];

        let nearestCity = cities[0];
        let minDistance = this.calculateDistance(lat, lon, cities[0].lat, cities[0].lon);

        cities.forEach(city => {
            const distance = this.calculateDistance(lat, lon, city.lat, city.lon);
            if (distance < minDistance) {
                minDistance = distance;
                nearestCity = city;
            }
        });

        return `Near ${nearestCity.name}`;
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c;
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
    }

    // Get cache statistics
    getCacheStats() {
        return {
            size: this.cache.size,
            entries: Array.from(this.cache.keys())
        };
    }
}