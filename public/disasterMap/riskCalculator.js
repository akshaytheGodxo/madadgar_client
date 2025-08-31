// Risk Calculator - Core engine for disaster risk assessment

class RiskCalculator {
    constructor() {
        this.currentSeason = this.getCurrentSeason();
        this.riskFactors = new Map();
    }

    // Calculate comprehensive disaster risk for a location
    async calculateLocationRisk(lat, lon, weatherData = null, earthquakeData = []) {
        try {
            const risks = {
                flood: { level: 'low', score: 0, details: '', factors: [], distance: null },
                earthquake: { level: 'low', score: 0, details: '', factors: [], distance: null },
                landslide: { level: 'low', score: 0, details: '', factors: [], distance: null },
                cyclone: { level: 'low', score: 0, details: '', factors: [], distance: null },
                drought: { level: 'low', score: 0, details: '', factors: [], distance: null }
            };

            // Calculate each disaster risk
            await Promise.all([
                this.calculateFloodRisk(lat, lon, weatherData).then(result => risks.flood = result),
                this.calculateEarthquakeRisk(lat, lon, earthquakeData).then(result => risks.earthquake = result),
                this.calculateLandslideRisk(lat, lon, weatherData).then(result => risks.landslide = result),
                this.calculateCycloneRisk(lat, lon, weatherData).then(result => risks.cyclone = result),
                this.calculateDroughtRisk(lat, lon, weatherData).then(result => risks.drought = result)
            ]);

            // Apply seasonal adjustments
            this.applySeasonalAdjustments(risks);

            // Apply weather-based modifications
            if (weatherData) {
                this.applyWeatherAdjustments(risks, weatherData);
            }

            // Calculate overall risk level
            const overallRisk = this.calculateOverallRisk(risks);

            return {
                individual: risks,
                overall: overallRisk,
                recommendations: this.generateRecommendations(risks),
                lastUpdated: new Date().toISOString()
            };

        } catch (error) {
            console.error('Risk calculation failed:', error);
            throw new Error('Unable to calculate risk assessment');
        }
    }

    // Calculate flood risk based on location and weather
    async calculateFloodRisk(lat, lon, weatherData) {
        let riskScore = 0;
        let riskFactors = [];
        let nearestDistance = Infinity;
        let details = '';

        try {
            // Check proximity to flood-prone regions
            for (const region of DISASTER_REGIONS.floods) {
                const distance = this.calculateDistance(lat, lon, region.lat, region.lng);
                
                if (distance < region.radius && distance < nearestDistance) {
                    nearestDistance = distance;
                    const proximityScore = this.calculateProximityScore(distance, region.radius, region.risk);
                    riskScore = Math.max(riskScore, proximityScore);
                    
                    riskFactors.push(`${Math.round(distance/1000)}km from ${region.name}`);
                    details = region.details;
                }
            }

            // Weather-based flood risk factors
            if (weatherData) {
                const precipitation = this.estimatePrecipitation(weatherData);
                const pressure = weatherData.main?.pressure || 1013;
                const humidity = weatherData.main?.humidity || 50;

                if (precipitation > 50) {
                    riskScore += 20;
                    riskFactors.push('Heavy rainfall detected');
                } else if (precipitation > 25) {
                    riskScore += 10;
                    riskFactors.push('Moderate rainfall expected');
                }

                if (pressure < 980) {
                    riskScore += 15;
                    riskFactors.push('Low pressure system detected');
                }

                if (humidity > 85) {
                    riskScore += 5;
                    riskFactors.push('Very high humidity levels');
                }
            }

            // River proximity check (simplified)
            const riverRisk = this.checkRiverProximity(lat, lon);
            if (riverRisk.isNearRiver) {
                riskScore += riverRisk.riskScore;
                riskFactors.push(riverRisk.description);
            }

            // Topographical factors
            const topoRisk = this.checkTopographicalRisk(lat, lon, 'flood');
            riskScore += topoRisk.score;
            if (topoRisk.factors.length > 0) {
                riskFactors.push(...topoRisk.factors);
            }

            return {
                level: this.scoreToRiskLevel(riskScore),
                score: riskScore,
                details: details || this.getDefaultFloodDetails(riskScore),
                factors: riskFactors,
                distance: nearestDistance === Infinity ? null : Math.round(nearestDistance / 1000)
            };

        } catch (error) {
            console.error('Flood risk calculation failed:', error);
            return this.getDefaultRisk('flood');
        }
    }

    // Calculate earthquake risk
    async calculateEarthquakeRisk(lat, lon, earthquakeData = []) {
        let riskScore = 0;
        let riskFactors = [];
        let nearestDistance = Infinity;
        let details = '';

        try {
            // Check proximity to seismic zones
            for (const region of DISASTER_REGIONS.earthquakes) {
                const distance = this.calculateDistance(lat, lon, region.lat, region.lng);
                
                if (distance < region.radius && distance < nearestDistance) {
                    nearestDistance = distance;
                    const proximityScore = this.calculateProximityScore(distance, region.radius, region.risk);
                    riskScore = Math.max(riskScore, proximityScore);
                    
                    riskFactors.push(`${Math.round(distance/1000)}km from ${region.name}`);
                    details = region.details;
                }
            }

            // Recent earthquake activity
            if (earthquakeData && earthquakeData.length > 0) {
                const recentQuakes = earthquakeData.filter(eq => {
                    const eventTime = new Date(eq.properties?.time || 0);
                    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                    return eventTime > weekAgo;
                });

                if (recentQuakes.length > 0) {
                    const maxMagnitude = Math.max(...recentQuakes.map(eq => eq.properties?.mag || 0));
                    const quakeScore = maxMagnitude >= 5 ? 30 : maxMagnitude >= 4 ? 20 : 10;
                    riskScore += quakeScore;
                    riskFactors.push(`${recentQuakes.length} recent earthquakes (max: M${maxMagnitude.toFixed(1)})`);
                }
            }

            // Historical seismic activity
            const historicalRisk = this.checkHistoricalSeismicActivity(lat, lon);
            riskScore += historicalRisk.score;
            if (historicalRisk.factors.length > 0) {
                riskFactors.push(...historicalRisk.factors);
            }

            return {
                level: this.scoreToRiskLevel(riskScore),
                score: riskScore,
                details: details || this.getDefaultEarthquakeDetails(riskScore),
                factors: riskFactors,
                distance: nearestDistance === Infinity ? null : Math.round(nearestDistance / 1000)
            };

        } catch (error) {
            console.error('Earthquake risk calculation failed:', error);
            return this.getDefaultRisk('earthquake');
        }
    }

    // Calculate landslide risk
    async calculateLandslideRisk(lat, lon, weatherData) {
        let riskScore = 0;
        let riskFactors = [];
        let nearestDistance = Infinity;
        let details = '';

        try {
            // Check proximity to landslide-prone areas
            for (const region of DISASTER_REGIONS.landslides) {
                const distance = this.calculateDistance(lat, lon, region.lat, region.lng);
                
                if (distance < region.radius && distance < nearestDistance) {
                    nearestDistance = distance;
                    const proximityScore = this.calculateProximityScore(distance, region.radius, region.risk);
                    riskScore = Math.max(riskScore, proximityScore);
                    
                    riskFactors.push(`${Math.round(distance/1000)}km from ${region.name}`);
                    details = region.details;
                }
            }

            // Terrain and elevation factors
            const terrainRisk = this.checkTerrainStability(lat, lon);
            riskScore += terrainRisk.score;
            if (terrainRisk.factors.length > 0) {
                riskFactors.push(...terrainRisk.factors);
            }

            // Weather conditions affecting landslide risk
            if (weatherData) {
                const precipitation = this.estimatePrecipitation(weatherData);
                const windSpeed = weatherData.wind?.speed || 0;

                if (precipitation > 75) {
                    riskScore += 25;
                    riskFactors.push('Extremely heavy rainfall - high landslide risk');
                } else if (precipitation > 50) {
                    riskScore += 15;
                    riskFactors.push('Heavy rainfall increases landslide risk');
                } else if (precipitation > 25) {
                    riskScore += 8;
                    riskFactors.push('Moderate rainfall - watch for slope instability');
                }

                if (windSpeed > 15) {
                    riskScore += 5;
                    riskFactors.push('Strong winds may affect slope stability');
                }
            }

            return {
                level: this.scoreToRiskLevel(riskScore),
                score: riskScore,
                details: details || this.getDefaultLandslideDetails(riskScore),
                factors: riskFactors,
                distance: nearestDistance === Infinity ? null : Math.round(nearestDistance / 1000)
            };

        } catch (error) {
            console.error('Landslide risk calculation failed:', error);
            return this.getDefaultRisk('landslide');
        }
    }

    // Calculate cyclone risk
    async calculateCycloneRisk(lat, lon, weatherData) {
        let riskScore = 0;
        let riskFactors = [];
        let nearestDistance = Infinity;
        let details = '';

        try {
            // Check if location is coastal
            const coastalProximity = this.checkCoastalProximity(lat, lon);
            if (!coastalProximity.isCoastal) {
                return {
                    level: 'low',
                    score: 0,
                    details: 'Inland location - minimal cyclone risk',
                    factors: ['Located far from coastline'],
                    distance: null
                };
            }

            // Check proximity to cyclone-prone regions
            for (const region of DISASTER_REGIONS.cyclones) {
                const distance = this.calculateDistance(lat, lon, region.lat, region.lng);
                
                if (distance < region.radius && distance < nearestDistance) {
                    nearestDistance = distance;
                    const proximityScore = this.calculateProximityScore(distance, region.radius, region.risk);
                    riskScore = Math.max(riskScore, proximityScore);
                    
                    riskFactors.push(`${Math.round(distance/1000)}km from ${region.name}`);
                    details = region.details;
                }
            }

            // Add coastal proximity bonus
            riskScore += coastalProximity.riskBonus;
            riskFactors.push(`${coastalProximity.distanceFromCoast}km from coast`);

            // Seasonal cyclone risk
            const currentMonth = new Date().getMonth();
            if ((currentMonth >= 9 && currentMonth <= 11) || (currentMonth >= 3 && currentMonth <= 5)) {
                riskScore += 10;
                riskFactors.push('Currently in cyclone season');
            }

            // Weather patterns indicating cyclone potential
            if (weatherData) {
                const pressure = weatherData.main?.pressure || 1013;
                const windSpeed = weatherData.wind?.speed || 0;
                const humidity = weatherData.main?.humidity || 50;

                if (pressure < 970) {
                    riskScore += 20;
                    riskFactors.push('Very low atmospheric pressure detected');
                } else if (pressure < 990) {
                    riskScore += 10;
                    riskFactors.push('Low pressure system present');
                }

                if (windSpeed > 20) {
                    riskScore += 15;
                    riskFactors.push('High wind speeds detected');
                } else if (windSpeed > 12) {
                    riskScore += 8;
                    riskFactors.push('Elevated wind speeds');
                }

                if (humidity > 90) {
                    riskScore += 5;
                    riskFactors.push('Very high humidity levels');
                }
            }

            return {
                level: this.scoreToRiskLevel(riskScore),
                score: riskScore,
                details: details || this.getDefaultCycloneDetails(riskScore),
                factors: riskFactors,
                distance: nearestDistance === Infinity ? null : Math.round(nearestDistance / 1000)
            };

        } catch (error) {
            console.error('Cyclone risk calculation failed:', error);
            return this.getDefaultRisk('cyclone');
        }
    }

    // Calculate drought risk
    async calculateDroughtRisk(lat, lon, weatherData) {
        let riskScore = 0;
        let riskFactors = [];
        let nearestDistance = Infinity;
        let details = '';

        try {
            // Check proximity to drought-prone regions
            for (const region of DISASTER_REGIONS.droughts) {
                const distance = this.calculateDistance(lat, lon, region.lat, region.lng);
                
                if (distance < region.radius && distance < nearestDistance) {
                    nearestDistance = distance;
                    const proximityScore = this.calculateProximityScore(distance, region.radius, region.risk);
                    riskScore = Math.max(riskScore, proximityScore);
                    
                    riskFactors.push(`${Math.round(distance/1000)}km from ${region.name}`);
                    details = region.details;
                }
            }

            // Seasonal drought risk
            const currentMonth = new Date().getMonth();
            if (currentMonth >= 2 && currentMonth <= 5) { // March to June - pre-monsoon
                riskScore += 15;
                riskFactors.push('Pre-monsoon season increases drought risk');
            }

            // Weather conditions affecting drought risk
            if (weatherData) {
                const temp = weatherData.main?.temp || 25;
                const humidity = weatherData.main?.humidity || 50;
                const pressure = weatherData.main?.pressure || 1013;

                if (temp > 40) {
                    riskScore += 20;
                    riskFactors.push('Extreme heat conditions');
                } else if (temp > 35) {
                    riskScore += 12;
                    riskFactors.push('Very high temperatures');
                } else if (temp > 30) {
                    riskScore += 6;
                    riskFactors.push('High temperatures');
                }

                if (humidity < 20) {
                    riskScore += 15;
                    riskFactors.push('Very low humidity levels');
                } else if (humidity < 30) {
                    riskScore += 8;
                    riskFactors.push('Low humidity conditions');
                }

                if (pressure > 1020) {
                    riskScore += 8;
                    riskFactors.push('High pressure system - stable dry conditions');
                }
            }

            // Regional climate patterns
            const climateRisk = this.checkRegionalClimate(lat, lon);
            riskScore += climateRisk.droughtScore;
            if (climateRisk.factors.length > 0) {
                riskFactors.push(...climateRisk.factors);
            }

            return {
                level: this.scoreToRiskLevel(riskScore),
                score: riskScore,
                details: details || this.getDefaultDroughtDetails(riskScore),
                factors: riskFactors,
                distance: nearestDistance === Infinity ? null : Math.round(nearestDistance / 1000)
            };

        } catch (error) {
            console.error('Drought risk calculation failed:', error);
            return this.getDefaultRisk('drought');
        }
    }

    // Apply seasonal risk adjustments
    applySeasonalAdjustments(risks) {
        const currentMonth = new Date().getMonth();
        const season = SEASONAL_RISKS[this.currentSeason];
        
        if (season && season.increasedRisks) {
            season.increasedRisks.forEach(riskType => {
                if (risks[riskType]) {
                    const oldScore = risks[riskType].score;
                    risks[riskType].score = Math.min(100, oldScore * season.riskMultiplier);
                    risks[riskType].level = this.scoreToRiskLevel(risks[riskType].score);
                    
                    if (oldScore < risks[riskType].score) {
                        risks[riskType].factors.push(`${this.currentSeason} season increases ${riskType} risk`);
                    }
                }
            });
        }
    }

    // Apply weather-based adjustments
    applyWeatherAdjustments(risks, weatherData) {
        const temp = weatherData.main?.temp || 25;
        const humidity = weatherData.main?.humidity || 50;
        const pressure = weatherData.main?.pressure || 1013;
        const windSpeed = weatherData.wind?.speed || 0;

        // Extreme weather conditions affect multiple risks
        if (temp > 45 || temp < 0) {
            Object.keys(risks).forEach(riskType => {
                risks[riskType].score += 5;
                risks[riskType].level = this.scoreToRiskLevel(risks[riskType].score);
            });
        }

        // Very low pressure affects multiple disasters
        if (pressure < 960) {
            ['flood', 'cyclone'].forEach(riskType => {
                risks[riskType].score += 10;
                risks[riskType].level = this.scoreToRiskLevel(risks[riskType].score);
                risks[riskType].factors.push('Extreme low pressure system');
            });
        }

        // High winds affect landslides and cyclones
        if (windSpeed > 25) {
            ['landslide', 'cyclone'].forEach(riskType => {
                risks[riskType].score += 8;
                risks[riskType].level = this.scoreToRiskLevel(risks[riskType].score);
                risks[riskType].factors.push('Very strong winds detected');
            });
        }
    }

    // Calculate overall risk level
    calculateOverallRisk(risks) {
        const riskValues = Object.values(risks);
        const maxScore = Math.max(...riskValues.map(r => r.score));
        const averageScore = riskValues.reduce((sum, r) => sum + r.score, 0) / riskValues.length;
        
        // Weighted score (60% max risk, 40% average risk)
        const overallScore = (maxScore * 0.6) + (averageScore * 0.4);
        
        const criticalRisks = riskValues.filter(r => r.level === 'critical').length;
        const highRisks = riskValues.filter(r => r.level === 'high').length;
        
        return {
            level: this.scoreToRiskLevel(overallScore),
            score: Math.round(overallScore),
            criticalCount: criticalRisks,
            highCount: highRisks,
            primaryRisk: this.getPrimaryRisk(risks),
            confidence: this.calculateConfidence(risks)
        };
    }

    // Get primary (highest) risk
    getPrimaryRisk(risks) {
        let maxScore = 0;
        let primaryRisk = 'none';
        
        Object.entries(risks).forEach(([riskType, risk]) => {
            if (risk.score > maxScore) {
                maxScore = risk.score;
                primaryRisk = riskType;
            }
        });
        
        return {
            type: primaryRisk,
            level: risks[primaryRisk]?.level || 'low',
            score: maxScore
        };
    }

    // Calculate confidence in risk assessment
    calculateConfidence(risks) {
        let confidence = 100;
        
        // Reduce confidence if we have limited data
        const riskValues = Object.values(risks);
        const lowDataRisks = riskValues.filter(r => r.factors.length < 2).length;
        confidence -= (lowDataRisks * 10);
        
        // Reduce confidence for distant risks
        const distantRisks = riskValues.filter(r => r.distance && r.distance > 50).length;
        confidence -= (distantRisks * 5);
        
        return Math.max(60, confidence); // Minimum 60% confidence
    }

    // Generate safety recommendations
    generateRecommendations(risks) {
        const recommendations = [];
        const highRisks = [];
        
        // Collect high and critical risks
        Object.entries(risks).forEach(([riskType, risk]) => {
            if (risk.level === 'critical' || risk.level === 'high') {
                highRisks.push(riskType);
            }
        });
        
        if (highRisks.length === 0) {
            return [
                'Stay informed about weather conditions',
                'Maintain basic emergency preparedness',
                'Review evacuation routes periodically'
            ];
        }
        
        // Add specific recommendations for each high risk
        highRisks.forEach(riskType => {
            if (SAFETY_RECOMMENDATIONS[riskType]) {
                recommendations.push(...SAFETY_RECOMMENDATIONS[riskType].before.slice(0, 2));
            }
        });
        
        // Add general high-risk recommendations
        if (highRisks.length > 1) {
            recommendations.push('Multiple risks detected - enhance emergency preparedness');
        }
        
        if (risks.overall?.level === 'critical') {
            recommendations.unshift('⚠️ CRITICAL: Consider temporary relocation if possible');
        }
        
        return [...new Set(recommendations)].slice(0, 5); // Remove duplicates, limit to 5
    }

    // Helper functions
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

    calculateProximityScore(distance, maxRadius, baseRisk) {
        const proximity = 1 - (distance / maxRadius);
        const baseScores = { 'critical': 60, 'high': 40, 'medium': 25, 'low': 10 };
        return Math.round((baseScores[baseRisk] || 10) * proximity);
    }

    scoreToRiskLevel(score) {
        if (score >= 60) return 'critical';
        if (score >= 35) return 'high';
        if (score >= 15) return 'medium';
        return 'low';
    }

    getCurrentSeason() {
        const month = new Date().getMonth();
        if (month >= 5 && month <= 9) return 'monsoon';
        if (month >= 9 && month <= 11) return 'postMonsoon';
        if (month >= 11 || month <= 2) return 'winter';
        return 'summer';
    }

    estimatePrecipitation(weatherData) {
        // Estimate precipitation based on weather conditions
        const humidity = weatherData.main?.humidity || 50;
        const pressure = weatherData.main?.pressure || 1013;
        const condition = weatherData.weather?.[0]?.main?.toLowerCase() || '';
        
        let precipitation = 0;
        
        if (condition.includes('rain')) precipitation += 50;
        if (condition.includes('storm')) precipitation += 75;
        if (condition.includes('drizzle')) precipitation += 15;
        
        if (humidity > 90) precipitation += 20;
        else if (humidity > 80) precipitation += 10;
        
        if (pressure < 980) precipitation += 15;
        else if (pressure < 1000) precipitation += 5;
        
        return Math.min(100, precipitation);
    }

    checkRiverProximity(lat, lon) {
        // Simplified river proximity check based on major Indian rivers
        const majorRivers = [
            { name: 'Ganges', lat: 25.3, lon: 83.0, risk: 15 },
            { name: 'Brahmaputra', lat: 26.2, lon: 90.6, risk: 20 },
            { name: 'Yamuna', lat: 28.4, lon: 77.3, risk: 12 },
            { name: 'Godavari', lat: 18.7, lon: 82.8, risk: 10 },
            { name: 'Krishna', lat: 16.2, lon: 81.1, risk: 10 },
            { name: 'Narmada', lat: 22.8, lon: 79.9, risk: 8 }
        ];
        
        for (const river of majorRivers) {
            const distance = this.calculateDistance(lat, lon, river.lat, river.lon);
            if (distance < 50000) { // Within 50km
                return {
                    isNearRiver: true,
                    riskScore: Math.max(0, river.risk * (1 - distance / 50000)),
                    description: `Near ${river.name} river system`
                };
            }
        }
        
        return { isNearRiver: false, riskScore: 0, description: '' };
    }

    checkTopographicalRisk(lat, lon, riskType) {
        // Simplified topographical risk assessment
        let score = 0;
        const factors = [];
        
        // Himalayan region (high elevation, steep slopes)
        if (lat > 28) {
            score += riskType === 'landslide' ? 15 : riskType === 'earthquake' ? 12 : 5;
            factors.push('Himalayan region - steep terrain');
        }
        
        // Western Ghats
        if ((lat > 10 && lat < 21) && (lon > 72 && lon < 78)) {
            score += riskType === 'landslide' ? 12 : riskType === 'flood' ? 8 : 3;
            factors.push('Western Ghats - hilly terrain');
        }
        
        // Eastern Ghats
        if ((lat > 11 && lat < 22) && (lon > 78 && lon < 87)) {
            score += riskType === 'landslide' ? 8 : riskType === 'flood' ? 6 : 2;
            factors.push('Eastern Ghats region');
        }
        
        // Coastal plains
        if (this.checkCoastalProximity(lat, lon).isCoastal) {
            score += riskType === 'flood' ? 10 : riskType === 'cyclone' ? 15 : 0;
            factors.push('Coastal plain - low elevation');
        }
        
        return { score, factors };
    }

    checkCoastalProximity(lat, lon) {
        // Check if location is near Indian coast
        const coastalPoints = [
            { lat: 8.5, lon: 76.9 }, // Kerala
            { lat: 11.1, lon: 79.8 }, // Tamil Nadu
            { lat: 15.9, lon: 80.3 }, // Andhra Pradesh
            { lat: 20.3, lon: 85.8 }, // Odisha
            { lat: 22.3, lon: 88.4 }, // West Bengal
            { lat: 19.1, lon: 72.9 }, // Maharashtra
            { lat: 21.8, lon: 72.2 }  // Gujarat
        ];
        
        let minDistance = Infinity;
        coastalPoints.forEach(point => {
            const distance = this.calculateDistance(lat, lon, point.lat, point.lon);
            minDistance = Math.min(minDistance, distance);
        });
        
        const isCoastal = minDistance < 100000; // Within 100km
        const distanceFromCoast = Math.round(minDistance / 1000);
        const riskBonus = isCoastal ? Math.max(5, 25 * (1 - minDistance / 100000)) : 0;
        
        return { isCoastal, distanceFromCoast, riskBonus };
    }

    checkTerrainStability(lat, lon) {
        // Assess terrain stability for landslide risk
        let score = 0;
        const factors = [];
        
        // Known unstable regions
        const unstableRegions = [
            { lat: 30.1, lon: 79.0, name: 'Uttarakhand hills' },
            { lat: 32.2, lon: 77.2, name: 'Himachal hills' },
            { lat: 11.1, lon: 76.1, name: 'Western Ghats Kerala' }
        ];
        
        unstableRegions.forEach(region => {
            const distance = this.calculateDistance(lat, lon, region.lat, region.lon);
            if (distance < 100000) {
                score += Math.max(0, 20 * (1 - distance / 100000));
                factors.push(`Near ${region.name} - unstable slopes`);
            }
        });
        
        return { score, factors };
    }

    checkHistoricalSeismicActivity(lat, lon) {
        // Check historical earthquake patterns
        let score = 0;
        const factors = [];
        
        // Major fault lines and seismic zones
        const seismicZones = [
            { lat: 34.1, lon: 74.8, name: 'Kashmir fault', risk: 25 },
            { lat: 26.2, lon: 92.9, name: 'Assam gap', risk: 30 },
            { lat: 23.0, lon: 70.0, name: 'Kachchh fault', risk: 20 }
        ];
        
        seismicZones.forEach(zone => {
            const distance = this.calculateDistance(lat, lon, zone.lat, zone.lon);
            if (distance < 200000) {
                score += Math.max(0, zone.risk * (1 - distance / 200000));
                factors.push(`Near ${zone.name}`);
            }
        });
        
        return { score, factors };
    }

    checkRegionalClimate(lat, lon) {
        // Assess regional climate patterns
        let droughtScore = 0;
        const factors = [];
        
        // Arid and semi-arid regions
        if (lon < 75 && lat > 24 && lat < 30) { // Rajasthan
            droughtScore += 20;
            factors.push('Arid climate zone');
        } else if (lat > 16 && lat < 20 && lon > 74 && lon < 78) { // Marathwada
            droughtScore += 15;
            factors.push('Rain shadow region');
        } else if (lat > 14 && lat < 18 && lon > 75 && lon < 78) { // North Karnataka
            droughtScore += 12;
            factors.push('Semi-arid region');
        }
        
        return { droughtScore, factors };
    }

    // Default risk objects
    getDefaultRisk(riskType) {
        return {
            level: 'low',
            score: 0,
            details: `Unable to assess ${riskType} risk at this time`,
            factors: ['Risk assessment unavailable'],
            distance: null
        };
    }

    getDefaultFloodDetails(score) {
        if (score >= 60) return 'Extremely high flood risk - immediate evacuation may be necessary';
        if (score >= 35) return 'High flood risk - monitor water levels and be prepared to evacuate';
        if (score >= 15) return 'Moderate flood risk - stay alert during heavy rains';
        return 'Low flood risk - normal precautions sufficient';
    }

    getDefaultEarthquakeDetails(score) {
        if (score >= 60) return 'Critical earthquake risk - ensure structural safety';
        if (score >= 35) return 'High earthquake risk - secure heavy objects and know evacuation routes';
        if (score >= 15) return 'Moderate earthquake risk - basic earthquake preparedness recommended';
        return 'Low earthquake risk - maintain general awareness';
    }

    getDefaultLandslideDetails(score) {
        if (score >= 60) return 'Extreme landslide risk - avoid slopes and unstable areas';
        if (score >= 35) return 'High landslide risk - monitor slope conditions';
        if (score >= 15) return 'Moderate landslide risk - be cautious during heavy rains';
        return 'Low landslide risk - normal precautions sufficient';
    }

    getDefaultCycloneDetails(score) {
        if (score >= 60) return 'Critical cyclone risk - prepare for potential evacuation';
        if (score >= 35) return 'High cyclone risk - secure property and monitor weather alerts';
        if (score >= 15) return 'Moderate cyclone risk - stay informed about weather conditions';
        return 'Low cyclone risk - maintain general awareness';
    }

    getDefaultDroughtDetails(score) {
        if (score >= 60) return 'Severe drought conditions - implement water conservation immediately';
        if (score >= 35) return 'High drought risk - conserve water and monitor reservoir levels';
        if (score >= 15) return 'Moderate drought risk - practice water conservation';
        return 'Low drought risk - normal water management sufficient';
    }
}