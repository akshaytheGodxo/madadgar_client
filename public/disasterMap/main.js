// Main Application Controller - Orchestrates the entire disaster prediction system

class IndiaDisasterPredictor {
    constructor() {
        // Initialize all controllers
        this.apiService = new APIService();
        this.mapController = new MapController();
        this.riskCalculator = new RiskCalculator();
        this.uiController = new UIController();
        
        // Application state
        this.currentLocation = null;
        this.currentRiskAssessment = null;
        this.isInitialized = false;
        this.refreshInterval = null;
        
        // Initialize the application
        this.initialize();
    }

    // Initialize the application
    async initialize() {
        try {
            console.log('Initializing India Disaster Prediction System...');
            
            // Initialize map
            const mapInitialized = this.mapController.initializeMap();
            if (!mapInitialized) {
                throw new Error('Failed to initialize map');
            }
            
            // Draw disaster zones on map
            this.mapController.drawDisasterZones();
            
            // Set up auto-refresh for demo mode
            if (CONFIG.demo.enabled) {
                this.setupDemoMode();
            }
            
            this.isInitialized = true;
            console.log('System initialization completed');
            
            // Show welcome notification
            this.uiController.showNotification(
                'India Disaster Prediction System ready. Click "Get My Location" to start risk assessment.',
                'success',
                7000
            );
            
        } catch (error) {
            console.error('Initialization failed:', error);
            this.uiController.showError(
                'Failed to initialize the system. Please refresh the page.',
                true
            );
        }
    }

    // Set up demo mode
    setupDemoMode() {
        if (CONFIG.demo.autoLoadDelay > 0) {
            setTimeout(() => {
                if (!this.currentLocation) {
                    console.log('Auto-loading demo location...');
                    this.loadDemoLocation();
                }
            }, CONFIG.demo.autoLoadDelay);
        }
    }

    // Load a random demo location
    loadDemoLocation() {
        const randomCity = CONFIG.demo.cities[
            Math.floor(Math.random() * CONFIG.demo.cities.length)
        ];
        
        this.currentLocation = {
            lat: randomCity.lat,
            lng: randomCity.lng,
            address: randomCity.name,
            isDemo: true
        };
        
        this.uiController.showNotification(
            `Demo mode: Showing risk assessment for ${randomCity.name}`,
            'info',
            5000
        );
        
        this.analyzeLocationRisk();
    }

    // Get user's current location
    async getCurrentLocation() {
        try {
            // Prevent multiple simultaneous requests
            if (this.uiController.isLoading) {
                return;
            }

            this.uiController.showLoading('Detecting your location...');
            this.uiController.updateProgress(1, 4, 'Getting location permissions...');

            // Check if geolocation is supported
            if (!navigator.geolocation) {
                throw new Error('Geolocation is not supported by this browser');
            }

            // Get position with high accuracy
            const position = await this.getPositionPromise();
            
            this.currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: position.timestamp,
                isDemo: false
            };

            this.uiController.updateProgress(2, 4, 'Location detected. Getting address...');

            // Try to get readable address
            try {
                const address = await this.reverseGeocode(this.currentLocation.lat, this.currentLocation.lng);
                this.currentLocation.address = address;
            } catch (error) {
                console.warn('Failed to get address:', error);
                this.currentLocation.address = `${this.currentLocation.lat.toFixed(4)}, ${this.currentLocation.lng.toFixed(4)}`;
            }

            // Show location info
            this.uiController.showLocationInfo(
                this.currentLocation.lat, 
                this.currentLocation.lng, 
                this.currentLocation.address
            );

            // Set map location
            this.mapController.setCurrentLocation(
                this.currentLocation.lat, 
                this.currentLocation.lng, 
                10
            );

            // Analyze risks
            await this.analyzeLocationRisk();

        } catch (error) {
            console.error('Failed to get current location:', error);
            
            if (error.code === error.PERMISSION_DENIED) {
                this.uiController.showError(
                    'Location access denied. Please enable location permissions and try again.'
                );
            } else if (error.code === error.POSITION_UNAVAILABLE) {
                this.uiController.showError(
                    'Location information is unavailable. Trying demo mode...'
                );
                setTimeout(() => this.loadDemoLocation(), 2000);
            } else if (error.code === error.TIMEOUT) {
                this.uiController.showError(
                    'Location request timed out. Please try again.'
                );
            } else {
                this.uiController.showError(
                    'Unable to get your location. Loading demo location...'
                );
                setTimeout(() => this.loadDemoLocation(), 2000);
            }
        }
    }

    // Promise wrapper for geolocation
    getPositionPromise() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                resolve,
                reject,
                CONFIG.geolocation
            );
        });
    }

    // Analyze disaster risks for current location
    async analyzeLocationRisk() {
        if (!this.currentLocation) {
            this.uiController.showError('No location available for risk analysis');
            return;
        }

        try {
            this.uiController.updateProgress(3, 4, 'Analyzing disaster risks...');

            const { lat, lng } = this.currentLocation;

            // Fetch weather data
            this.uiController.updateProgress(3, 4, 'Getting weather data...');
            const weatherData = await this.apiService.getCurrentWeather(lat, lng);

            // Fetch earthquake data
            const earthquakeData = await this.apiService.getEarthquakeData(lat, lng, 200);

            // Fetch disaster alerts
            const alertData = await this.apiService.getDisasterAlerts(lat, lng);

            // Calculate comprehensive risk assessment
            this.uiController.updateProgress(4, 4, 'Calculating risk levels...');
            this.currentRiskAssessment = await this.riskCalculator.calculateLocationRisk(
                lat, lng, weatherData, earthquakeData
            );

            // Update UI with results
            this.updateUI();

            // Update map visualizations
            await this.updateMapVisualizations(weatherData, earthquakeData);

            this.uiController.hideLoading();
            this.uiController.showSuccess('Risk analysis completed successfully!');

            // Set up auto-refresh if enabled
            this.setupAutoRefresh();

            // Log results for debugging
            console.log('Risk Assessment Results:', this.currentRiskAssessment);

        } catch (error) {
            console.error('Risk analysis failed:', error);
            this.uiController.showError(
                'Failed to analyze disaster risks. Please try again.'
            );
        }
    }

    // Update all UI components
    updateUI() {
        if (!this.currentRiskAssessment) return;

        try {
            // Update disaster cards
            this.uiController.updateDisasterCards(this.currentRiskAssessment);

            // Show high risk alerts if needed
            this.uiController.showHighRiskAlert(this.currentRiskAssessment);

            // Show statistics
            this.uiController.showStatistics(this.currentRiskAssessment);

            // Update button text
            this.uiController.updateLocationButton(false, '🔄 Refresh Risk Assessment');

        } catch (error) {
            console.error('UI update failed:', error);
        }
    }

    // Update map visualizations
    async updateMapVisualizations(weatherData, earthquakeData) {
        if (!this.currentLocation) return;

        try {
            const { lat, lng } = this.currentLocation;

            // Add weather visualization
            if (weatherData) {
                this.mapController.addWeatherVisualization(weatherData, lat, lng);
            }

            // Add earthquake markers
            if (earthquakeData && earthquakeData.length > 0) {
                this.mapController.addEarthquakeMarkers(earthquakeData);
            }

            // Highlight local risks around user location
            if (this.currentRiskAssessment) {
                this.mapController.highlightLocalRisks(
                    lat, lng, 
                    this.currentRiskAssessment.individual
                );
            }

            // Add emergency facilities
            this.mapController.addEmergencyFacilities(lat, lng);

        } catch (error) {
            console.error('Map visualization update failed:', error);
        }
    }

    // Reverse geocoding to get readable address
    async reverseGeocode(lat, lng) {
        try {
            // Using a free reverse geocoding service
            const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
            );
            
            if (response.ok) {
                const data = await response.json();
                return `${data.city || data.locality || 'Unknown'}, ${data.principalSubdivision || data.countryName || 'India'}`;
            }
        } catch (error) {
            console.warn('Reverse geocoding failed:', error);
        }
        
        // Fallback to coordinates
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }

    // Set up automatic refresh
    setupAutoRefresh() {
        // Clear existing interval
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }

        // Set up new refresh interval (every 10 minutes)
        this.refreshInterval = setInterval(() => {
            if (this.currentLocation && !this.uiController.isLoading) {
                console.log('Auto-refreshing risk assessment...');
                this.analyzeLocationRisk();
            }
        }, 10 * 60 * 1000); // 10 minutes
    }

    // Manual refresh
    async refreshRiskAssessment() {
        if (this.currentLocation) {
            this.uiController.showNotification('Refreshing risk assessment...', 'info', 3000);
            await this.analyzeLocationRisk();
        } else {
            this.getCurrentLocation();
        }
    }

    // Handle location search (if needed)
    async searchLocation(query) {
        try {
            this.uiController.showLoading(`Searching for: ${query}...`);
            
            // This could integrate with a geocoding service
            // For now, we'll show an error
            throw new Error('Location search not yet implemented');
            
        } catch (error) {
            this.uiController.showError(
                'Location search is not available. Please use "Get My Location" instead.'
            );
        }
    }

    // Export data for sharing or debugging
    exportData() {
        return {
            location: this.currentLocation,
            riskAssessment: this.currentRiskAssessment,
            timestamp: new Date().toISOString(),
            systemInfo: {
                version: '1.0.0',
                initialized: this.isInitialized
            }
        };
    }

    // Handle errors globally
    handleError(error, context = 'Unknown') {
        console.error(`Error in ${context}:`, error);
        
        // Show user-friendly error message
        let message = 'An unexpected error occurred. Please try again.';
        
        if (error.name === 'NetworkError' || error.message.includes('fetch')) {
            message = 'Network error. Please check your internet connection.';
        } else if (error.name === 'TypeError') {
            message = 'A technical error occurred. Please refresh the page.';
        }
        
        this.uiController.showError(message);
    }

    // Clean up resources
    cleanup() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        this.mapController.clearAllOverlays();
        this.uiController.cleanup();
        this.apiService.clearCache();
    }

    // Get system status
    getSystemStatus() {
        return {
            initialized: this.isInitialized,
            hasLocation: !!this.currentLocation,
            hasAssessment: !!this.currentRiskAssessment,
            isLoading: this.uiController.isLoading,
            lastUpdate: this.uiController.lastUpdate,
            cacheStats: this.apiService.getCacheStats()
        };
    }
}

// Global function to be called by the UI
async function getCurrentLocation() {
    if (window.disasterPredictor) {
        await window.disasterPredictor.getCurrentLocation();
    }
}

// Global function to refresh assessment
async function refreshAssessment() {
    if (window.disasterPredictor) {
        await window.disasterPredictor.refreshRiskAssessment();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Starting India Disaster Prediction System...');
        window.disasterPredictor = new IndiaDisasterPredictor();
    } catch (error) {
        console.error('Failed to start application:', error);
        document.body.innerHTML = `
            <div style="text-align: center; padding: 50px; color: #f44336; font-family: sans-serif;">
                <h1>India Disaster Prediction System Failed to Start</h1>
                <p>${error.message}</p>
                <p>Please refresh the page and try again.</p>
            </div>
        `;
    }
});