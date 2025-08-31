// UI Controller - Manages all user interface interactions and updates

class UIController {
    constructor() {
        this.elements = {
            locationInfo: document.getElementById('locationInfo'),
            disasterCards: document.getElementById('disasterCards'),
            alertBanner: document.getElementById('alertBanner'),
            alertMessage: document.getElementById('alertMessage'),
            locationBtn: document.querySelector('.location-btn')
        };
        
        this.isLoading = false;
        this.currentLocation = null;
        this.lastUpdate = null;
    }

    // Show loading state
    showLoading(message = CONFIG.messages.loading) {
        this.isLoading = true;
        this.updateLocationButton(true);
        
        if (this.elements.locationInfo) {
            this.elements.locationInfo.style.display = 'block';
            this.elements.locationInfo.innerHTML = `
                <div class="spinner"></div>
                <p>${message}</p>
            `;
        }
    }

    // Hide loading state
    hideLoading() {
        this.isLoading = false;
        this.updateLocationButton(false);
        
        if (this.elements.locationInfo) {
            this.elements.locationInfo.style.display = 'none';
        }
    }

    // Update location button state
    updateLocationButton(disabled = false, text = null) {
        if (this.elements.locationBtn) {
            this.elements.locationBtn.disabled = disabled;
            
            if (text) {
                this.elements.locationBtn.innerHTML = text;
            } else if (disabled) {
                this.elements.locationBtn.innerHTML = '🔄 Analyzing...';
            } else {
                this.elements.locationBtn.innerHTML = '📍 Get My Location & Check Risk';
            }
        }
    }

    // Display error message
    showError(message, includeRetry = true) {
        this.hideLoading();
        
        if (this.elements.locationInfo) {
            this.elements.locationInfo.style.display = 'block';
            this.elements.locationInfo.innerHTML = `
                <div class="error-message">
                    <strong>❌ ${message}</strong>
                    ${includeRetry ? `
                        <br><br>
                        <button class="retry-btn" onclick="getCurrentLocation()">
                            Try Again
                        </button>
                    ` : ''}
                </div>
            `;
        }
    }

    // Display success message
    showSuccess(message) {
        if (this.elements.locationInfo) {
            this.elements.locationInfo.style.display = 'block';
            this.elements.locationInfo.innerHTML = `
                <div class="success-message">
                    <strong>✅ ${message}</strong>
                </div>
            `;
            
            // Auto-hide after 3 seconds
            setTimeout(() => {
                this.hideLoading();
            }, 3000);
        }
    }

    // Update disaster risk cards
    updateDisasterCards(riskAssessment) {
        if (!this.elements.disasterCards || !riskAssessment) return;

        const { individual: risks, overall, recommendations } = riskAssessment;
        this.elements.disasterCards.innerHTML = '';

        // Create cards for each disaster type
        const disasters = [
            { type: 'flood', icon: '🌊', name: 'Flood Risk' },
            { type: 'earthquake', icon: '🏔️', name: 'Earthquake Risk' },
            { type: 'landslide', icon: '⛰️', name: 'Landslide Risk' },
            { type: 'cyclone', icon: '🌀', name: 'Cyclone Risk' },
            { type: 'drought', icon: '🏜️', name: 'Drought Risk' }
        ];

        disasters.forEach(disaster => {
            const risk = risks[disaster.type];
            if (!risk) return;

            const card = this.createDisasterCard(disaster, risk);
            this.elements.disasterCards.appendChild(card);
        });

        // Add overall risk summary card
        if (overall) {
            const overallCard = this.createOverallRiskCard(overall, recommendations);
            this.elements.disasterCards.insertBefore(overallCard, this.elements.disasterCards.firstChild);
        }

        // Add weather information if available
        this.addWeatherInfoCard();

        // Update last updated time
        this.lastUpdate = new Date();
        this.addLastUpdatedInfo();
    }

    // Create individual disaster risk card
    createDisasterCard(disaster, risk) {
        const card = document.createElement('div');
        card.className = `disaster-card ${risk.level}`;
        
        card.innerHTML = `
            <div class="disaster-title">
                <span>${disaster.icon}</span>
                <span>${disaster.name}</span>
                <span class="risk-level ${risk.level}">${this.capitalizeFirst(risk.level)}</span>
                ${risk.score ? `<span style="font-size: 0.8em; color: #666; margin-left: auto;">${risk.score}/100</span>` : ''}
            </div>
            <div class="disaster-details">
                ${risk.details || 'No immediate risk detected in your area.'}
                ${risk.distance ? `<br><small>📍 ${risk.distance}km from nearest risk zone</small>` : ''}
            </div>
            ${risk.factors && risk.factors.length > 0 ? `
                <div style="margin-top: 8px; font-size: 0.8em; color: #666;">
                    <strong>Risk factors:</strong>
                    <ul style="margin: 4px 0 0 16px; padding: 0;">
                        ${risk.factors.slice(0, 3).map(factor => `<li>${factor}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        `;

        // Add click handler for detailed view
        card.addEventListener('click', () => {
            this.showDetailedRiskModal(disaster, risk);
        });

        return card;
    }

    // Create overall risk summary card
    createOverallRiskCard(overall, recommendations) {
        const card = document.createElement('div');
        card.className = `disaster-card ${overall.level} overall-risk`;
        card.style.border = '3px solid';
        card.style.borderColor = CONFIG.riskColors[overall.level];
        
        card.innerHTML = `
            <div class="disaster-title" style="font-size: 1.2em;">
                <span>🎯</span>
                <span>Overall Risk Assessment</span>
                <span class="risk-level ${overall.level}">${this.capitalizeFirst(overall.level)}</span>
                <span style="font-size: 0.8em; color: #666; margin-left: auto;">${overall.score}/100</span>
            </div>
            <div class="disaster-details">
                <strong>Primary Risk:</strong> ${this.capitalizeFirst(overall.primaryRisk.type)} (${overall.primaryRisk.level})
                <br>
                <strong>Assessment Confidence:</strong> ${overall.confidence}%
                ${overall.criticalCount > 0 ? `<br><strong style="color: #d32f2f;">⚠️ ${overall.criticalCount} Critical Risk(s)</strong>` : ''}
                ${overall.highCount > 0 ? `<br><strong style="color: #f57c00;">⚡ ${overall.highCount} High Risk(s)</strong>` : ''}
            </div>
            ${recommendations && recommendations.length > 0 ? `
                <div style="margin-top: 10px; padding: 8px; background: #f5f5f5; border-radius: 4px;">
                    <strong>🛡️ Safety Recommendations:</strong>
                    <ul style="margin: 4px 0 0 16px; padding: 0; font-size: 0.9em;">
                        ${recommendations.slice(0, 3).map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        `;

        return card;
    }

    // Add weather information card
    addWeatherInfoCard() {
        // This would display current weather conditions
        // For now, we'll add a placeholder
        const weatherCard = document.createElement('div');
        weatherCard.className = 'weather-info';
        weatherCard.innerHTML = `
            <h4>🌤️ Current Conditions</h4>
            <div class="weather-stat">
                <span>Status:</span>
                <span>Monitoring weather patterns...</span>
            </div>
            <div style="font-size: 0.8em; color: #666; margin-top: 5px;">
                Weather data helps improve risk predictions
            </div>
        `;
        
        this.elements.disasterCards.appendChild(weatherCard);
    }

    // Add last updated information
    addLastUpdatedInfo() {
        if (!this.lastUpdate) return;

        const existingInfo = document.querySelector('.last-updated-info');
        if (existingInfo) existingInfo.remove();

        const updateInfo = document.createElement('div');
        updateInfo.className = 'last-updated-info';
        updateInfo.style.cssText = `
            text-align: center;
            font-size: 0.8em;
            color: #666;
            margin-top: 10px;
            padding: 5px;
            background: rgba(255,255,255,0.5);
            border-radius: 5px;
        `;
        updateInfo.innerHTML = `
            📅 Last updated: ${this.lastUpdate.toLocaleTimeString()}
            <button onclick="getCurrentLocation()" style="margin-left: 10px; padding: 2px 8px; border: none; background: #4CAF50; color: white; border-radius: 3px; cursor: pointer; font-size: 0.8em;">
                Refresh
            </button>
        `;

        this.elements.disasterCards.appendChild(updateInfo);
    }

    // Show/hide high risk alert banner
    showHighRiskAlert(riskAssessment) {
        if (!this.elements.alertBanner || !this.elements.alertMessage) return;

        const { individual: risks, overall } = riskAssessment;
        
        // Check for high or critical risks
        const highRisks = Object.entries(risks).filter(([_, risk]) => 
            risk.level === 'high' || risk.level === 'critical'
        );

        if (highRisks.length > 0 || overall.level === 'critical' || overall.level === 'high') {
            const criticalRisks = highRisks.filter(([_, risk]) => risk.level === 'critical');
            const riskTypes = highRisks.map(([type, _]) => this.capitalizeFirst(type));
            
            let alertType = '⚠️ High Risk Alert';
            let alertClass = 'show';
            
            if (criticalRisks.length > 0) {
                alertType = '🚨 CRITICAL ALERT';
                alertClass = 'show critical';
                this.elements.alertBanner.style.background = '#d32f2f';
            }

            this.elements.alertMessage.innerHTML = `
                <strong>${alertType}:</strong> 
                ${riskTypes.join(', ')} ${riskTypes.length > 1 ? 'risks' : 'risk'} detected in your area. 
                ${criticalRisks.length > 0 ? 'Consider immediate safety measures.' : 'Please stay alert and follow safety guidelines.'}
                <br><small>📞 Emergency: 108 | Disaster Helpline: 1078</small>
            `;
            
            this.elements.alertBanner.className = `alert-banner ${alertClass}`;
            
            // Auto-hide after 30 seconds for non-critical alerts
            if (criticalRisks.length === 0) {
                setTimeout(() => {
                    this.hideAlert();
                }, 30000);
            }
        } else {
            this.hideAlert();
        }
    }

    // Hide alert banner
    hideAlert() {
        if (this.elements.alertBanner) {
            this.elements.alertBanner.classList.remove('show', 'critical');
        }
    }

    // Show detailed risk modal
    showDetailedRiskModal(disaster, risk) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'risk-modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease-out;
        `;

        const modalContent = document.createElement('div');
        modalContent.className = 'risk-modal-content';
        modalContent.style.cssText = `
            background: white;
            border-radius: 15px;
            padding: 20px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            animation: slideIn 0.3s ease-out;
        `;

        modalContent.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 2px solid ${CONFIG.riskColors[risk.level]};">
                <span style="font-size: 2em; margin-right: 10px;">${disaster.icon}</span>
                <div>
                    <h2 style="margin: 0; color: #333;">${disaster.name}</h2>
                    <span class="risk-level ${risk.level}" style="font-size: 0.9em;">${this.capitalizeFirst(risk.level)} Risk</span>
                </div>
                <button onclick="this.closest('.risk-modal-overlay').remove()" style="margin-left: auto; background: none; border: none; font-size: 1.5em; cursor: pointer; padding: 5px;">×</button>
            </div>
            
            <div style="margin-bottom: 15px;">
                <div style="background: ${CONFIG.riskColors[risk.level]}20; padding: 10px; border-radius: 8px; border-left: 4px solid ${CONFIG.riskColors[risk.level]};">
                    <strong>Risk Assessment:</strong> ${risk.details}
                </div>
            </div>

            ${risk.distance ? `
                <div style="margin-bottom: 15px;">
                    <strong>📍 Distance from Risk Zone:</strong> ${risk.distance} km
                </div>
            ` : ''}

            ${risk.factors && risk.factors.length > 0 ? `
                <div style="margin-bottom: 15px;">
                    <strong>🔍 Contributing Factors:</strong>
                    <ul style="margin: 8px 0; padding-left: 20px;">
                        ${risk.factors.map(factor => `<li style="margin-bottom: 4px;">${factor}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}

            <div style="margin-bottom: 15px;">
                <strong>📊 Risk Score:</strong> 
                <div style="background: #f5f5f5; border-radius: 10px; height: 20px; position: relative; margin: 5px 0;">
                    <div style="background: ${CONFIG.riskColors[risk.level]}; height: 100%; width: ${risk.score}%; border-radius: 10px; transition: width 0.5s ease;"></div>
                    <span style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); font-size: 0.8em; font-weight: bold;">${risk.score}/100</span>
                </div>
            </div>

            ${this.getSafetyRecommendations(disaster.type, risk.level)}

            <div style="margin-top: 20px; text-align: center;">
                <button onclick="this.closest('.risk-modal-overlay').remove()" style="background: ${CONFIG.riskColors[risk.level]}; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 1em;">
                    Close
                </button>
            </div>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideIn {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Get safety recommendations for specific disaster type
    getSafetyRecommendations(disasterType, riskLevel) {
        const recommendations = SAFETY_RECOMMENDATIONS[disasterType];
        if (!recommendations) return '';

        const phase = riskLevel === 'critical' || riskLevel === 'high' ? 'during' : 'before';
        const recs = recommendations[phase] || recommendations.before;

        return `
            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; border-left: 4px solid #4CAF50;">
                <strong>🛡️ Safety Recommendations:</strong>
                <ul style="margin: 8px 0; padding-left: 20px;">
                    ${recs.map(rec => `<li style="margin-bottom: 6px;">${rec}</li>`).join('')}
                </ul>
                
                <div style="margin-top: 10px; padding: 8px; background: #fff; border-radius: 5px; font-size: 0.9em;">
                    <strong>📞 Emergency Contacts:</strong><br>
                    National Emergency: <strong>112</strong><br>
                    Disaster Helpline: <strong>1078</strong><br>
                    Police: <strong>100</strong> | Fire: <strong>101</strong> | Medical: <strong>102</strong>
                </div>
            </div>
        `;
    }

    // Show location information
    showLocationInfo(lat, lon, address = null) {
        this.currentLocation = { lat, lon, address };
        
        const locationDisplay = document.createElement('div');
        locationDisplay.className = 'location-display';
        locationDisplay.style.cssText = `
            background: rgba(76, 175, 80, 0.1);
            border: 1px solid rgba(76, 175, 80, 0.3);
            border-radius: 8px;
            padding: 10px;
            margin-bottom: 15px;
            font-size: 0.9em;
        `;

        locationDisplay.innerHTML = `
            <strong>📍 Current Location:</strong><br>
            ${address || `${lat.toFixed(4)}, ${lon.toFixed(4)}`}<br>
            <small style="color: #666;">
                Coordinates: ${lat.toFixed(6)}, ${lon.toFixed(6)}
            </small>
        `;

        // Remove existing location display
        const existing = document.querySelector('.location-display');
        if (existing) existing.remove();

        // Add to sidebar
        const sidebar = document.querySelector('.sidebar');
        if (sidebar && this.elements.locationInfo) {
            sidebar.insertBefore(locationDisplay, this.elements.locationInfo.nextSibling);
        }
    }

    // Update progress indicator
    updateProgress(step, totalSteps, message) {
        if (this.elements.locationInfo) {
            const progress = Math.round((step / totalSteps) * 100);
            
            this.elements.locationInfo.innerHTML = `
                <div style="text-align: center;">
                    <div class="spinner"></div>
                    <p>${message}</p>
                    <div style="background: #f0f0f0; border-radius: 10px; height: 6px; margin: 10px 0;">
                        <div style="background: #4CAF50; height: 100%; width: ${progress}%; border-radius: 10px; transition: width 0.3s ease;"></div>
                    </div>
                    <small>${step}/${totalSteps} - ${progress}%</small>
                </div>
            `;
        }
    }

    // Show statistics panel
    showStatistics(riskAssessment) {
        const stats = this.calculateStatistics(riskAssessment);
        
        const statsPanel = document.createElement('div');
        statsPanel.className = 'statistics-panel';
        statsPanel.style.cssText = `
            background: white;
            border-radius: 10px;
            padding: 15px;
            margin-top: 15px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        `;

        statsPanel.innerHTML = `
            <h4 style="margin-bottom: 10px; color: #333;">📊 Risk Statistics</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.9em;">
                <div>
                    <strong>Total Risks:</strong> ${stats.totalRisks}
                </div>
                <div>
                    <strong>Avg. Score:</strong> ${stats.averageScore}/100
                </div>
                <div>
                    <strong>High/Critical:</strong> ${stats.highRiskCount}
                </div>
                <div>
                    <strong>Confidence:</strong> ${stats.confidence}%
                </div>
            </div>
            <div style="margin-top: 10px; font-size: 0.8em; color: #666;">
                Risk assessment based on ${stats.factorCount} environmental factors
            </div>
        `;

        // Remove existing stats panel
        const existing = document.querySelector('.statistics-panel');
        if (existing) existing.remove();

        this.elements.disasterCards.appendChild(statsPanel);
    }

    // Calculate statistics from risk assessment
    calculateStatistics(riskAssessment) {
        const risks = Object.values(riskAssessment.individual);
        const totalRisks = risks.length;
        const averageScore = Math.round(risks.reduce((sum, risk) => sum + risk.score, 0) / totalRisks);
        const highRiskCount = risks.filter(risk => risk.level === 'high' || risk.level === 'critical').length;
        const factorCount = risks.reduce((sum, risk) => sum + (risk.factors?.length || 0), 0);
        
        return {
            totalRisks,
            averageScore,
            highRiskCount,
            confidence: riskAssessment.overall.confidence,
            factorCount
        };
    }

    // Animate risk level changes
    animateRiskChange(element, oldLevel, newLevel) {
        if (!element || oldLevel === newLevel) return;

        element.style.transition = 'all 0.5s ease';
        element.classList.remove(oldLevel);
        element.classList.add(newLevel);
        
        // Flash effect
        element.style.transform = 'scale(1.05)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    }

    // Add notification system
    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4CAF50' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10001;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
            word-wrap: break-word;
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span>${type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'}</span>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 1.2em; cursor: pointer; margin-left: auto;">×</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove after duration
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);

        // Add CSS for animations
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Utility functions
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    formatTimestamp(timestamp) {
        return new Date(timestamp).toLocaleString();
    }

    formatDistance(meters) {
        if (meters < 1000) {
            return `${Math.round(meters)} m`;
        }
        return `${(meters / 1000).toFixed(1)} km`;
    }

    // Clean up UI elements
    cleanup() {
        // Remove any existing modals
        document.querySelectorAll('.risk-modal-overlay').forEach(modal => modal.remove());
        
        // Remove notifications
        document.querySelectorAll('.notification').forEach(notification => notification.remove());
        
        // Reset alert banner
        this.hideAlert();
        
        // Reset loading state
        this.hideLoading();
    }

    // Export current data (for debugging or reporting)
    exportData() {
        return {
            currentLocation: this.currentLocation,
            lastUpdate: this.lastUpdate,
            isLoading: this.isLoading
        };
    }
}