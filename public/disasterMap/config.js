// Configuration file for the India Disaster Prediction System

const CONFIG = {
    // API Configuration
    apis: {
        openweather: {
            baseUrl: 'https://api.openweathermap.org/data/2.5',
            key: 'YOUR_OPENWEATHER_API_KEY', // Get from https://openweathermap.org/api
        },
        usgs: {
            earthquake: 'https://earthquake.usgs.gov/fdsnws/event/1',
            flood: 'https://api.waterdata.usgs.gov'
        },
        imd: {
            // India Meteorological Department API
            baseUrl: 'https://api.imd.gov.in', // Placeholder - check IMD for actual API
        },
        isro: {
            // ISRO Bhuvan API for disaster monitoring
            baseUrl: 'https://bhuvan-app1.nrsc.gov.in/api', // Placeholder - check ISRO for actual API
        }
    },

    // Map Configuration
    map: {
        defaultCenter: [20.5937, 78.9629], // Center of India
        defaultZoom: 5,
        maxZoom: 18,
        minZoom: 4,
        maxBounds: [
            [6.4627, 68.1097],  // Southwest corner of India
            [35.5044, 97.3953]  // Northeast corner of India
        ]
    },

    // Risk Zone Colors
    riskColors: {
        low: '#4CAF50',      // Green
        medium: '#FF9800',   // Orange  
        high: '#F44336',     // Red
        critical: '#9C27B0'  // Purple
    },

    // Risk Zone Opacity
    riskOpacity: {
        fill: 0.3,
        border: 0.8,
        hover: 0.5
    },

    // Geolocation Settings
    geolocation: {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000
    },

    // Disaster Alert Thresholds (in meters)
    alertThresholds: {
        immediate: 5000,    // 5km - immediate danger
        nearby: 20000,      // 20km - nearby risk
        regional: 50000     // 50km - regional awareness
    },

    // Data Refresh Intervals (in milliseconds)
    refreshIntervals: {
        weather: 600000,    // 10 minutes
        earthquake: 300000, // 5 minutes
        alerts: 180000      // 3 minutes
    },

    // Monsoon Season Configuration
    monsoon: {
        startMonth: 5,  // June (0-indexed)
        endMonth: 9,    // October (0-indexed)
        riskMultiplier: 1.5
    },

    // Demo Mode Configuration
    demo: {
        enabled: true,
        autoLoadDelay: 3000, // 3 seconds
        cities: [
            { lat: 28.6139, lng: 77.2090, name: "New Delhi" },
            { lat: 19.0760, lng: 72.8777, name: "Mumbai" },
            { lat: 22.5726, lng: 88.3639, name: "Kolkata" },
            { lat: 13.0827, lng: 80.2707, name: "Chennai" },
            { lat: 12.9716, lng: 77.5946, name: "Bangalore" },
            { lat: 17.3850, lng: 78.4867, name: "Hyderabad" }
        ]
    },

    // UI Messages
    messages: {
        loading: "Detecting location and analyzing risks...",
        locationError: "Unable to detect location. Please allow location access or try again.",
        dataError: "Failed to fetch disaster data. Please check your internet connection.",
        analysisComplete: "Risk analysis completed successfully.",
        noRisk: "No immediate risk detected in your area.",
        highRisk: "High risk detected in your area. Please stay alert!"
    },

    // Animation Settings
    animations: {
        markerBounce: true,
        circleAnimation: true,
        cardTransition: 300,
        alertFade: 500
    }
};

// Risk Level Definitions
const RISK_LEVELS = {
    LOW: {
        name: 'Low',
        color: CONFIG.riskColors.low,
        description: 'Minimal risk - Normal precautions recommended'
    },
    MEDIUM: {
        name: 'Medium', 
        color: CONFIG.riskColors.medium,
        description: 'Moderate risk - Stay informed and prepared'
    },
    HIGH: {
        name: 'High',
        color: CONFIG.riskColors.high,
        description: 'High risk - Take immediate precautions'
    },
    CRITICAL: {
        name: 'Critical',
        color: CONFIG.riskColors.critical,
        description: 'Extreme risk - Follow emergency protocols'
    }
};

// Disaster Types Configuration
const DISASTER_TYPES = {
    FLOOD: {
        name: 'Flood',
        icon: '🌊',
        color: '#2196F3',
        priority: 1
    },
    EARTHQUAKE: {
        name: 'Earthquake',
        icon: '🏔️', 
        color: '#FF5722',
        priority: 2
    },
    LANDSLIDE: {
        name: 'Landslide',
        icon: '⛰️',
        color: '#8BC34A',
        priority: 3
    },
    CYCLONE: {
        name: 'Cyclone',
        icon: '🌀',
        color: '#9C27B0',
        priority: 4
    },
    DROUGHT: {
        name: 'Drought',
        icon: '🏜️',
        color: '#FF9800',
        priority: 5
    }
};

// Export configuration for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, RISK_LEVELS, DISASTER_TYPES };
}