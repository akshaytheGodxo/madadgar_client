// Map Controller for handling map visualization and interactions

class MapController {
    constructor() {
        this.map = null;
        this.currentLocationMarker = null;
        this.riskCircles = [];
        this.weatherMarkers = [];
        this.earthquakeMarkers = [];
        this.alertMarkers = [];
        this.layerGroups = {
            floods: L.layerGroup(),
            earthquakes: L.layerGroup(), 
            landslides: L.layerGroup(),
            cyclones: L.layerGroup(),
            droughts: L.layerGroup()
        };
    }

    // Initialize the map
    initializeMap() {
        try {
            // Create map with India-focused settings
            this.map = L.map('map', {
                center: CONFIG.map.defaultCenter,
                zoom: CONFIG.map.defaultZoom,
                maxZoom: CONFIG.map.maxZoom,
                minZoom: CONFIG.map.minZoom,
                zoomControl: true,
                attributionControl: true
            });

            // Set bounds to India
            this.map.setMaxBounds(CONFIG.map.maxBounds);

            // Add base tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors | India Disaster Prediction System',
                maxZoom: CONFIG.map.maxZoom
            }).addTo(this.map);

            // Add layer groups to map
            Object.values(this.layerGroups).forEach(layerGroup => {
                layerGroup.addTo(this.map);
            });

            // Add map controls
            this.addMapControls();

            console.log('Map initialized successfully');
            return true;
        } catch (error) {
            console.error('Failed to initialize map:', error);
            return false;
        }
    }

    // Add custom map controls
    addMapControls() {
        // Layer control for different disaster types
        const overlayMaps = {
            "🌊 Flood Zones": this.layerGroups.floods,
            "🏔️ Earthquake Zones": this.layerGroups.earthquakes,
            "⛰️ Landslide Zones": this.layerGroups.landslides,
            "🌀 Cyclone Zones": this.layerGroups.cyclones,
            "🏜️ Drought Zones": this.layerGroups.droughts
        };

        L.control.layers(null, overlayMaps, {
            position: 'topright',
            collapsed: false
        }).addTo(this.map);

        // Scale control
        L.control.scale({
            position: 'bottomleft',
            metric: true,
            imperial: false
        }).addTo(this.map);

        // Custom info control
        this.addInfoControl();
    }

    // Add information control
    addInfoControl() {
        const info = L.control({ position: 'topleft' });

        info.onAdd = function(map) {
            this._div = L.DomUtil.create('div', 'info-control');
            this._div.style.cssText = `
                background: rgba(255, 255, 255, 0.9);
                border-radius: 8px;
                padding: 10px;
                font-size: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                max-width: 200px;
            `;
            this.update();
            return this._div;
        };

        info.update = function(props) {
            this._div.innerHTML = '<h4>🇮🇳 India Disaster Monitor</h4>' + 
                (props ? 
                    `<b>${props.name}</b><br/>
                     Risk: ${props.risk}<br/>
                     Type: ${props.type}` :
                    'Click on risk zones for details');
        };

        info.addTo(this.map);
        this.infoControl = info;
    }

    // Set current location and center map
    setCurrentLocation(lat, lon, zoomLevel = 10) {
        try {
            // Remove existing marker
            if (this.currentLocationMarker) {
                this.map.removeLayer(this.currentLocationMarker);
            }

            // Create custom icon for current location
            const locationIcon = L.divIcon({
                className: 'current-location-marker',
                html: '📍',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            // Add new marker
            this.currentLocationMarker = L.marker([lat, lon], { icon: locationIcon })
                .addTo(this.map)
                .bindPopup(`
                    <div style="text-align: center;">
                        <strong>📍 Your Location</strong><br>
                        <small>Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}</small>
                    </div>
                `)
                .openPopup();

            // Center and zoom to location
            this.map.setView([lat, lon], zoomLevel);

            // Add pulsing animation to current location
            this.addLocationPulse(lat, lon);

            return true;
        } catch (error) {
            console.error('Failed to set current location:', error);
            return false;
        }
    }

    // Add pulsing animation for current location
    addLocationPulse(lat, lon) {
        const pulseIcon = L.divIcon({
            className: 'location-pulse',
            html: '',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        // Add CSS for pulse animation
        const style = document.createElement('style');
        style.textContent = `
            .location-pulse {
                background: #4285f4;
                border-radius: 50%;
                animation: pulse 2s infinite;
                opacity: 0.8;
            }
            @keyframes pulse {
                0% {
                    transform: scale(0.8);
                    opacity: 0.8;
                }
                50% {
                    transform: scale(1.2);
                    opacity: 0.4;
                }
                100% {
                    transform: scale(0.8);
                    opacity: 0.8;
                }
            }
        `;
        document.head.appendChild(style);

        L.marker([lat, lon], { icon: pulseIcon }).addTo(this.map);
    }

    // Draw disaster risk zones
    drawDisasterZones() {
        try {
            // Clear existing circles
            this.clearAllRiskCircles();

            // Draw zones for each disaster type
            Object.entries(DISASTER_REGIONS).forEach(([disasterType, regions]) => {
                regions.forEach(region => {
                    this.createRiskCircle(region, disasterType);
                });
            });

            console.log('Disaster zones drawn successfully');
            return true;
        } catch (error) {
            console.error('Failed to draw disaster zones:', error);
            return false;
        }
    }

    // Create individual risk circle
    createRiskCircle(region, disasterType) {
        const color = CONFIG.riskColors[region.risk];
        const disasterConfig = DISASTER_TYPES[disasterType.toUpperCase()];
        
        const circle = L.circle([region.lat, region.lng], {
            color: color,
            fillColor: color,
            fillOpacity: CONFIG.riskOpacity.fill,
            opacity: CONFIG.riskOpacity.border,
            radius: region.radius,
            weight: 2
        });

        // Add popup with detailed information
        const popupContent = this.createPopupContent(region, disasterType, disasterConfig);
        circle.bindPopup(popupContent);

        // Add hover effects
        circle.on('mouseover', (e) => {
            e.target.setStyle({
                fillOpacity: CONFIG.riskOpacity.hover,
                weight: 3
            });
            
            if (this.infoControl) {
                this.infoControl.update({
                    name: region.name || `${disasterType} zone`,
                    risk: region.risk.toUpperCase(),
                    type: disasterType.toUpperCase()
                });
            }
        });

        circle.on('mouseout', (e) => {
            e.target.setStyle({
                fillOpacity: CONFIG.riskOpacity.fill,
                weight: 2
            });
            
            if (this.infoControl) {
                this.infoControl.update();
            }
        });

        // Add to appropriate layer group
        if (this.layerGroups[disasterType]) {
            circle.addTo(this.layerGroups[disasterType]);
        }

        // Store reference
        this.riskCircles.push(circle);

        return circle;
    }

    // Create popup content for risk circles
    createPopupContent(region, disasterType, disasterConfig) {
        return `
            <div style="min-width: 200px; font-family: Arial, sans-serif;">
                <div style="background: ${disasterConfig?.color || '#333'}; color: white; padding: 8px; margin: -10px -10px 10px -10px; border-radius: 4px 4px 0 0;">
                    <strong>${disasterConfig?.icon || '⚠️'} ${region.name || 'Risk Zone'}</strong>
                </div>
                <table style="width: 100%; font-size: 12px;">
                    <tr>
                        <td><strong>Disaster Type:</strong></td>
                        <td>${disasterType.charAt(0).toUpperCase() + disasterType.slice(1)}</td>
                    </tr>
                    <tr>
                        <td><strong>Risk Level:</strong></td>
                        <td>
                            <span style="background: ${CONFIG.riskColors[region.risk]}; color: white; padding: 2px 6px; border-radius: 10px; font-size: 10px;">
                                ${region.risk.toUpperCase()}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td><strong>Coverage:</strong></td>
                        <td>${Math.round(region.radius / 1000)} km radius</td>
                    </tr>
                    ${region.state ? `
                    <tr>
                        <td><strong>State:</strong></td>
                        <td>${region.state}</td>
                    </tr>` : ''}
                </table>
                ${region.details ? `
                <div style="margin-top: 10px; padding: 8px; background: #f5f5f5; border-radius: 4px; font-size: 11px;">
                    <strong>Details:</strong> ${region.details}
                </div>` : ''}
            </div>
        `;
    }

    // Add weather visualization
    addWeatherVisualization(weatherData, lat, lon) {
        try {
            // Remove existing weather markers
            this.clearWeatherMarkers();

            if (!weatherData) return;

            // Create weather icon based on conditions
            const weatherIcon = this.getWeatherIcon(weatherData);
            const weatherMarker = L.marker([lat, lon], { 
                icon: weatherIcon,
                zIndexOffset: 1000 
            });

            const popupContent = `
                <div style="text-align: center; min-width: 150px;">
                    <h4>🌤️ Current Weather</h4>
                    <div style="font-size: 24px; margin: 10px 0;">${Math.round(weatherData.main?.temp || 25)}°C</div>
                    <div style="margin: 5px 0;">
                        <strong>Condition:</strong> ${weatherData.weather?.[0]?.main || 'Clear'}
                    </div>
                    <div style="margin: 5px 0;">
                        <strong>Humidity:</strong> ${weatherData.main?.humidity || 50}%
                    </div>
                    <div style="margin: 5px 0;">
                        <strong>Wind Speed:</strong> ${Math.round((weatherData.wind?.speed || 5) * 3.6)} km/h
                    </div>
                    <div style="margin: 5px 0;">
                        <strong>Pressure:</strong> ${weatherData.main?.pressure || 1013} hPa
                    </div>
                </div>
            `;

            weatherMarker.bindPopup(popupContent);
            weatherMarker.addTo(this.map);
            this.weatherMarkers.push(weatherMarker);

            return true;
        } catch (error) {
            console.error('Failed to add weather visualization:', error);
            return false;
        }
    }

    // Get weather icon based on conditions
    getWeatherIcon(weatherData) {
        const temp = weatherData.main?.temp || 25;
        const condition = weatherData.weather?.[0]?.main?.toLowerCase() || 'clear';
        const windSpeed = weatherData.wind?.speed || 0;

        let iconText = '☀️'; // Default sunny

        if (condition.includes('rain')) iconText = '🌧️';
        else if (condition.includes('cloud')) iconText = '☁️';
        else if (condition.includes('storm')) iconText = '⛈️';
        else if (temp > 35) iconText = '🌡️';
        else if (temp < 10) iconText = '❄️';
        else if (windSpeed > 10) iconText = '💨';

        return L.divIcon({
            className: 'weather-icon',
            html: `<div style="font-size: 20px; text-align: center; background: rgba(255,255,255,0.8); border-radius: 50%; padding: 5px;">${iconText}</div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });
    }

    // Add earthquake markers
    addEarthquakeMarkers(earthquakes) {
        try {
            this.clearEarthquakeMarkers();

            earthquakes.forEach(earthquake => {
                const magnitude = earthquake.properties?.mag || 0;
                const coords = earthquake.geometry?.coordinates || [0, 0];
                
                if (coords[1] && coords[0]) { // Valid coordinates
                    const marker = this.createEarthquakeMarker(coords[1], coords[0], earthquake);
                    this.earthquakeMarkers.push(marker);
                }
            });

            return true;
        } catch (error) {
            console.error('Failed to add earthquake markers:', error);
            return false;
        }
    }

    // Create earthquake marker
    createEarthquakeMarker(lat, lon, earthquake) {
        const magnitude = earthquake.properties?.mag || 0;
        const size = Math.max(10, magnitude * 5); // Scale size with magnitude
        const color = magnitude >= 5 ? '#ff0000' : magnitude >= 4 ? '#ff9900' : '#ffcc00';

        const icon = L.divIcon({
            className: 'earthquake-marker',
            html: `
                <div style="
                    width: ${size}px; 
                    height: ${size}px; 
                    background: ${color}; 
                    border: 2px solid white;
                    border-radius: 50%; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                    font-size: ${Math.max(8, size/3)}px;
                    color: white;
                    font-weight: bold;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                ">${magnitude.toFixed(1)}</div>
            `,
            iconSize: [size, size],
            iconAnchor: [size/2, size/2]
        });

        const marker = L.marker([lat, lon], { icon });

        const time = new Date(earthquake.properties?.time).toLocaleString();
        const popupContent = `
            <div style="min-width: 180px;">
                <h4>🏔️ Earthquake Alert</h4>
                <div><strong>Magnitude:</strong> ${magnitude.toFixed(1)}</div>
                <div><strong>Location:</strong> ${earthquake.properties?.place || 'Unknown'}</div>
                <div><strong>Time:</strong> ${time}</div>
                <div style="margin-top: 10px; padding: 8px; background: ${magnitude >= 5 ? '#ffebee' : '#fff3e0'}; border-radius: 4px; font-size: 12px;">
                    <strong>${magnitude >= 5 ? 'Significant' : 'Minor'} Earthquake</strong><br>
                    ${magnitude >= 5 ? 'May cause damage to structures' : 'Generally felt but rarely causes damage'}
                </div>
            </div>
        `;

        marker.bindPopup(popupContent);
        marker.addTo(this.map);

        return marker;
    }

    // Highlight high-risk areas around current location
    highlightLocalRisks(lat, lon, risks) {
        try {
            // Create gradient circles showing risk levels
            const riskLevels = ['critical', 'high', 'medium', 'low'];
            const radii = [5000, 10000, 20000, 50000]; // 5km, 10km, 20km, 50km

            riskLevels.forEach((level, index) => {
                const hasRisk = Object.values(risks).some(risk => risk.level === level);
                
                if (hasRisk) {
                    const circle = L.circle([lat, lon], {
                        color: CONFIG.riskColors[level],
                        fillColor: CONFIG.riskColors[level],
                        fillOpacity: 0.1,
                        opacity: 0.3,
                        radius: radii[index],
                        weight: 1,
                        dashArray: level === 'critical' ? '10, 5' : null
                    });

                    circle.bindPopup(`
                        <div style="text-align: center;">
                            <strong>${level.toUpperCase()} Risk Zone</strong><br>
                            <small>${radii[index] / 1000}km radius from your location</small>
                        </div>
                    `);

                    circle.addTo(this.map);
                    this.riskCircles.push(circle);
                }
            });

            return true;
        } catch (error) {
            console.error('Failed to highlight local risks:', error);
            return false;
        }
    }

    // Clear various marker types
    clearCurrentLocationMarker() {
        if (this.currentLocationMarker) {
            this.map.removeLayer(this.currentLocationMarker);
            this.currentLocationMarker = null;
        }
    }

    clearAllRiskCircles() {
        this.riskCircles.forEach(circle => {
            this.map.removeLayer(circle);
        });
        this.riskCircles = [];
    }

    clearWeatherMarkers() {
        this.weatherMarkers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.weatherMarkers = [];
    }

    clearEarthquakeMarkers() {
        this.earthquakeMarkers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.earthquakeMarkers = [];
    }

    clearAlertMarkers() {
        this.alertMarkers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.alertMarkers = [];
    }

    // Clear all overlays
    clearAllOverlays() {
        this.clearCurrentLocationMarker();
        this.clearAllRiskCircles();
        this.clearWeatherMarkers();
        this.clearEarthquakeMarkers();
        this.clearAlertMarkers();
    }

    // Fit map to show all risk zones
    fitToRiskZones() {
        if (this.riskCircles.length > 0) {
            const group = new L.featureGroup(this.riskCircles);
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    }

    // Add emergency facilities (hospitals, fire stations, etc.)
    addEmergencyFacilities(lat, lon) {
        // This could be expanded to show real emergency facility data
        const facilities = [
            { type: 'hospital', icon: '🏥', name: 'Nearest Hospital', distance: '2.5 km' },
            { type: 'fire', icon: '🚒', name: 'Fire Station', distance: '1.8 km' },
            { type: 'police', icon: '🚓', name: 'Police Station', distance: '3.2 km' }
        ];

        facilities.forEach((facility, index) => {
            // Place facilities at random nearby locations for demo
            const offsetLat = lat + (Math.random() - 0.5) * 0.02;
            const offsetLon = lon + (Math.random() - 0.5) * 0.02;

            const marker = L.marker([offsetLat, offsetLon], {
                icon: L.divIcon({
                    className: 'facility-marker',
                    html: `<div style="font-size: 16px; background: white; padding: 2px; border-radius: 50%; border: 2px solid #4285f4;">${facility.icon}</div>`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                })
            });

            marker.bindPopup(`
                <div style="text-align: center;">
                    <strong>${facility.icon} ${facility.name}</strong><br>
                    <small>~${facility.distance} away</small>
                </div>
            `);

            marker.addTo(this.map);
            this.alertMarkers.push(marker);
        });
    }

    // Get map bounds
    getMapBounds() {
        return this.map.getBounds();
    }

    // Export map as image (if needed)
    exportMapImage() {
        // This would require additional libraries like leaflet-image
        console.log('Map export functionality would be implemented here');
    }
}