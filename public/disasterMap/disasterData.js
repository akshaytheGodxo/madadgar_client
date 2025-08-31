// India-specific disaster-prone regions database
// Based on historical data and government sources

const DISASTER_REGIONS = {
    // Flood-prone regions across India
    floods: [
        // Northeast India - Assam valley
        { 
            lat: 26.2006, lng: 92.9376, radius: 50000, risk: 'high',
            name: 'Assam Valley', state: 'Assam',
            details: 'Brahmaputra river flooding, annual monsoon impact'
        },
        // West Bengal - Gangetic plains
        { 
            lat: 22.9868, lng: 87.8550, radius: 40000, risk: 'high',
            name: 'Gangetic Plains', state: 'West Bengal',
            details: 'River Ganges overflow, cyclonic storms from Bay of Bengal'
        },
        // Maharashtra - Konkan coast
        { 
            lat: 19.7515, lng: 75.7139, radius: 45000, risk: 'high',
            name: 'Western Maharashtra', state: 'Maharashtra',
            details: 'Heavy monsoon rains, river Krishna flooding'
        },
        // Punjab - River systems
        { 
            lat: 30.7333, lng: 76.7794, radius: 35000, risk: 'medium',
            name: 'Punjab Rivers', state: 'Punjab',
            details: 'Sutlej and Beas river flooding during monsoon'
        },
        // Chhattisgarh - Central India
        { 
            lat: 21.2787, lng: 81.8661, radius: 50000, risk: 'high',
            name: 'Chhattisgarh Basin', state: 'Chhattisgarh',
            details: 'Mahanadi river system, heavy rainfall flooding'
        },
        // Kerala - Western Ghats
        { 
            lat: 10.8505, lng: 76.2711, radius: 30000, risk: 'high',
            name: 'Kerala Coast', state: 'Kerala',
            details: 'Southwest monsoon, coastal and river flooding'
        },
        // Bihar - Ganges plain
        { 
            lat: 25.0961, lng: 85.3131, radius: 45000, risk: 'high',
            name: 'Bihar Plains', state: 'Bihar',
            details: 'Ganges and tributaries flooding, flat topography'
        },
        // Odisha - Coastal region
        { 
            lat: 20.9517, lng: 85.0985, radius: 40000, risk: 'high',
            name: 'Odisha Coast', state: 'Odisha',
            details: 'Cyclonic storms, deltaic region flooding'
        }
    ],

    // Earthquake-prone seismic zones
    earthquakes: [
        // Kashmir - Zone V (highest risk)
        { 
            lat: 34.0837, lng: 74.7973, radius: 80000, risk: 'critical',
            name: 'Kashmir Valley', state: 'Jammu & Kashmir',
            details: 'Zone V seismic activity, major fault lines, frequent tremors'
        },
        // Himachal Pradesh - Zone IV & V
        { 
            lat: 32.2432, lng: 77.1892, radius: 60000, risk: 'high',
            name: 'Himachal Hills', state: 'Himachal Pradesh',
            details: 'Himalayan seismic belt, active tectonic plates'
        },
        // Sikkim - Zone IV
        { 
            lat: 27.0238, lng: 88.2636, radius: 40000, risk: 'high',
            name: 'Sikkim Region', state: 'Sikkim',
            details: 'Eastern Himalayan seismic zone, Nepal earthquake impact'
        },
        // Assam - Zone V
        { 
            lat: 26.2006, lng: 92.9376, radius: 70000, risk: 'critical',
            name: 'Assam Seismic Zone', state: 'Assam',
            details: 'Highest seismic activity in India, frequent earthquakes'
        },
        // Mizoram - Zone V
        { 
            lat: 23.6102, lng: 92.4219, radius: 50000, risk: 'high',
            name: 'Mizoram Hills', state: 'Mizoram',
            details: 'Indo-Myanmar seismic belt, tectonic activity'
        },
        // Uttarakhand - Zone IV & V
        { 
            lat: 30.0668, lng: 79.0193, radius: 55000, risk: 'high',
            name: 'Uttarakhand Region', state: 'Uttarakhand',
            details: 'Central seismic gap, Himalayan fault system'
        },
        // Gujarat - Zone III & IV
        { 
            lat: 23.0225, lng: 72.5714, radius: 45000, risk: 'medium',
            name: 'Gujarat Region', state: 'Gujarat',
            details: '2001 Bhuj earthquake zone, active fault lines'
        },
        // Maharashtra - Zone III
        { 
            lat: 18.5204, lng: 73.8567, radius: 35000, risk: 'medium',
            name: 'Western Maharashtra', state: 'Maharashtra',
            details: 'Koyna region seismic activity, reservoir induced'
        }
    ],

    // Landslide-prone hilly and mountainous regions
    landslides: [
        // Wayanad, Kerala - Recent major landslides
        { 
            lat: 11.1271, lng: 76.0795, radius: 25000, risk: 'critical',
            name: 'Wayanad Hills', state: 'Kerala',
            details: 'Recent catastrophic landslides, steep terrain, heavy rainfall'
        },
        // Himachal Pradesh - Extensive hilly terrain
        { 
            lat: 32.2432, lng: 77.1892, radius: 40000, risk: 'critical',
            name: 'Himachal Pradesh', state: 'Himachal Pradesh', 
            details: 'Unstable slopes, deforestation, road cutting activities'
        },
        // Uttarakhand - Himalayan region
        { 
            lat: 30.0668, lng: 79.0193, radius: 35000, risk: 'high',
            name: 'Uttarakhand Hills', state: 'Uttarakhand',
            details: '2013 Kedarnath disaster zone, fragile geology'
        },
        // Darjeeling, West Bengal
        { 
            lat: 27.0410, lng: 88.2663, radius: 20000, risk: 'high',
            name: 'Darjeeling Hills', state: 'West Bengal',
            details: 'Tea garden slopes, monsoon triggered landslides'
        },
        // Meghalaya - Shillong plateau
        { 
            lat: 25.4670, lng: 91.3662, radius: 25000, risk: 'medium',
            name: 'Meghalaya Plateau', state: 'Meghalaya',
            details: 'Coal mining activities, heavy rainfall, loose soil'
        },
        // Mumbai - Western Ghats
        { 
            lat: 19.2183, lng: 72.9781, radius: 20000, risk: 'medium',
            name: 'Mumbai Hills', state: 'Maharashtra',
            details: 'Monsoon rains, urban development on slopes'
        },
        // Ooty, Tamil Nadu
        { 
            lat: 11.4064, lng: 76.6932, radius: 18000, risk: 'medium',
            name: 'Nilgiri Hills', state: 'Tamil Nadu',
            details: 'Western Ghats region, tea plantations, slope instability'
        },
        // Kodaikanal region
        { 
            lat: 10.2381, lng: 77.4892, radius: 15000, risk: 'medium',
            name: 'Kodaikanal Hills', state: 'Tamil Nadu',
            details: 'Hill station area, deforestation impacts'
        }
    ],

    // Cyclone-prone coastal regions
    cyclones: [
        // Odisha coast - Frequent cyclones
        { 
            lat: 19.8135, lng: 85.8312, radius: 60000, risk: 'critical',
            name: 'Odisha Coast', state: 'Odisha',
            details: 'Bay of Bengal cyclones, Super Cyclone 1999 zone'
        },
        // Andhra Pradesh coast
        { 
            lat: 15.9129, lng: 79.7400, radius: 50000, risk: 'high',
            name: 'Andhra Coast', state: 'Andhra Pradesh',
            details: 'Frequent cyclonic storms from Bay of Bengal'
        },
        // Tamil Nadu coast
        { 
            lat: 11.0168, lng: 79.8145, radius: 45000, risk: 'high',
            name: 'Tamil Nadu Coast', state: 'Tamil Nadu',
            details: 'Northeast monsoon cyclones, Chennai floods'
        },
        // West Bengal coast
        { 
            lat: 21.5222, lng: 87.9523, radius: 40000, risk: 'high',
            name: 'Bengal Coast', state: 'West Bengal',
            details: 'Frequent cyclones, Sundarbans delta region'
        },
        // Gujarat coast
        { 
            lat: 21.7679, lng: 72.1519, radius: 55000, risk: 'medium',
            name: 'Gujarat Coast', state: 'Gujarat',
            details: 'Arabian Sea cyclones, industrial coastline'
        }
    ],

    // Drought-prone regions
    droughts: [
        // Rajasthan - Desert region
        { 
            lat: 27.0238, lng: 74.2179, radius: 80000, risk: 'high',
            name: 'Rajasthan Desert', state: 'Rajasthan',
            details: 'Thar desert, low rainfall, water scarcity'
        },
        // Maharashtra - Marathwada region
        { 
            lat: 19.0176, lng: 76.2711, radius: 60000, risk: 'high',
            name: 'Marathwada', state: 'Maharashtra',
            details: 'Rain shadow region, frequent droughts'
        },
        // Karnataka - North Karnataka
        { 
            lat: 15.3173, lng: 75.7139, radius: 50000, risk: 'medium',
            name: 'North Karnataka', state: 'Karnataka',
            details: 'Deccan plateau, erratic rainfall patterns'
        },
        // Telangana - Semi-arid region
        { 
            lat: 18.1124, lng: 79.0193, radius: 45000, risk: 'medium',
            name: 'Telangana Region', state: 'Telangana',
            details: 'Semi-arid climate, dependent on monsoons'
        }
    ]
};

// Historical disaster events for reference
const HISTORICAL_DISASTERS = {
    majorEarthquakes: [
        { year: 2001, location: 'Bhuj, Gujarat', magnitude: 7.7 },
        { year: 2005, location: 'Kashmir', magnitude: 7.6 },
        { year: 2011, location: 'Sikkim', magnitude: 6.9 },
        { year: 2015, location: 'Nepal (affecting North India)', magnitude: 7.8 }
    ],
    majorFloods: [
        { year: 2013, location: 'Kedarnath, Uttarakhand' },
        { year: 2018, location: 'Kerala' },
        { year: 2019, location: 'Assam, Bihar' },
        { year: 2020, location: 'Hyderabad, Telangana' }
    ],
    majorLandslides: [
        { year: 2013, location: 'Kedarnath, Uttarakhand' },
        { year: 2017, location: 'Himachal Pradesh' },
        { year: 2018, location: 'Kerala, Kodagu' },
        { year: 2024, location: 'Wayanad, Kerala' }
    ],
    majorCyclones: [
        { year: 1999, location: 'Super Cyclone, Odisha' },
        { year: 2014, location: 'Cyclone Hudhud, Andhra Pradesh' },
        { year: 2019, location: 'Cyclone Fani, Odisha' },
        { year: 2020, location: 'Cyclone Amphan, West Bengal' }
    ]
};

// Seasonal risk patterns
const SEASONAL_RISKS = {
    monsoon: {
        months: [5, 6, 7, 8, 9], // June to October
        increasedRisks: ['floods', 'landslides'],
        riskMultiplier: 1.5
    },
    postMonsoon: {
        months: [9, 10, 11], // October to December
        increasedRisks: ['cyclones'],
        riskMultiplier: 1.3
    },
    winter: {
        months: [11, 12, 1, 2], // December to March
        increasedRisks: ['earthquakes'], // Cold weather can trigger seismic activity
        riskMultiplier: 1.1
    },
    summer: {
        months: [3, 4, 5], // April to June
        increasedRisks: ['droughts'],
        riskMultiplier: 1.4
    }
};

// State-wise disaster vulnerability
const STATE_VULNERABILITY = {
    'Assam': { primary: 'floods', secondary: 'earthquakes', tertiary: 'landslides' },
    'West Bengal': { primary: 'cyclones', secondary: 'floods', tertiary: 'earthquakes' },
    'Kerala': { primary: 'floods', secondary: 'landslides', tertiary: 'cyclones' },
    'Odisha': { primary: 'cyclones', secondary: 'floods', tertiary: 'droughts' },
    'Maharashtra': { primary: 'floods', secondary: 'droughts', tertiary: 'earthquakes' },
    'Gujarat': { primary: 'earthquakes', secondary: 'cyclones', tertiary: 'droughts' },
    'Rajasthan': { primary: 'droughts', secondary: 'floods', tertiary: 'earthquakes' },
    'Himachal Pradesh': { primary: 'earthquakes', secondary: 'landslides', tertiary: 'floods' },
    'Uttarakhand': { primary: 'landslides', secondary: 'earthquakes', tertiary: 'floods' },
    'Tamil Nadu': { primary: 'cyclones', secondary: 'floods', tertiary: 'droughts' },
    'Andhra Pradesh': { primary: 'cyclones', secondary: 'floods', tertiary: 'droughts' },
    'Karnataka': { primary: 'droughts', secondary: 'floods', tertiary: 'earthquakes' },
    'Punjab': { primary: 'floods', secondary: 'droughts', tertiary: 'earthquakes' },
    'Haryana': { primary: 'droughts', secondary: 'floods', tertiary: 'earthquakes' },
    'Bihar': { primary: 'floods', secondary: 'earthquakes', tertiary: 'droughts' },
    'Jharkhand': { primary: 'floods', secondary: 'droughts', tertiary: 'earthquakes' },
    'Chhattisgarh': { primary: 'floods', secondary: 'droughts', tertiary: 'earthquakes' },
    'Madhya Pradesh': { primary: 'floods', secondary: 'droughts', tertiary: 'earthquakes' },
    'Uttar Pradesh': { primary: 'floods', secondary: 'earthquakes', tertiary: 'droughts' }
};

// Emergency contact information by state
const EMERGENCY_CONTACTS = {
    national: {
        disaster: '1078',
        police: '100',
        fire: '101',
        ambulance: '102',
        ndrf: '011-24363260'
    },
    state: {
        'Delhi': { control_room: '011-23438091' },
        'Mumbai': { control_room: '022-22027990' },
        'Chennai': { control_room: '044-25619131' },
        'Kolkata': { control_room: '033-22143526' },
        'Bangalore': { control_room: '080-22425403' },
        'Hyderabad': { control_room: '040-27853508' }
    }
};

// Safety recommendations by disaster type
const SAFETY_RECOMMENDATIONS = {
    floods: {
        before: [
            'Stay informed about weather forecasts and flood warnings',
            'Keep emergency supplies ready (food, water, medications)',
            'Identify higher ground evacuation routes',
            'Secure important documents in waterproof containers'
        ],
        during: [
            'Move to higher ground immediately',
            'Avoid walking or driving through flood water',
            'Stay away from electrical lines and equipment',
            'Listen to emergency broadcasts for updates'
        ],
        after: [
            'Return only when authorities declare it safe',
            'Avoid flood-damaged buildings and infrastructure',
            'Boil water before drinking if supplies may be contaminated',
            'Document damage for insurance claims'
        ]
    },
    earthquakes: {
        before: [
            'Secure heavy furniture and appliances to walls',
            'Know safe spots in each room (under sturdy tables)',
            'Practice earthquake drills with family',
            'Keep emergency kit accessible'
        ],
        during: [
            'Drop, Cover, and Hold On',
            'Stay where you are - do not run outside',
            'If outdoors, move away from buildings and power lines',
            'If driving, stop safely and stay in vehicle'
        ],
        after: [
            'Check for injuries and provide first aid',
            'Inspect home for damage before entering',
            'Be prepared for aftershocks',
            'Stay tuned to emergency broadcasts'
        ]
    },
    landslides: {
        before: [
            'Learn about landslide risk in your area',
            'Monitor rainfall and slope conditions',
            'Plan evacuation routes and practice them',
            'Avoid building on steep slopes'
        ],
        during: [
            'Move away from the path of the landslide',
            'Run to the nearest high ground perpendicular to flow',
            'Avoid river valleys and low-lying areas',
            'Listen for unusual sounds indicating moving debris'
        ],
        after: [
            'Stay away from the slide area',
            'Watch for flooding which may occur after landslides',
            'Check for and report broken utility lines',
            'Allow experts to inspect slope stability'
        ]
    },
    cyclones: {
        before: [
            'Monitor weather forecasts and cyclone warnings',
            'Secure or remove outdoor objects',
            'Stock up on food, water, and essential supplies',
            'Reinforce windows with shutters or boards'
        ],
        during: [
            'Stay indoors and away from windows',
            'Do not go outside during the eye of the storm',
            'Stay in the strongest part of your building',
            'Listen to battery-powered radio for updates'
        ],
        after: [
            'Wait for official all-clear before going outside',
            'Watch for flooding and storm surge',
            'Avoid downed power lines and damaged buildings',
            'Help neighbors but do not enter damaged structures'
        ]
    },
    droughts: {
        before: [
            'Conserve water during normal times',
            'Install water-efficient fixtures and appliances',
            'Plant drought-resistant vegetation',
            'Learn about water sources in your area'
        ],
        during: [
            'Follow water use restrictions strictly',
            'Prioritize water use for drinking and cooking',
            'Check on elderly neighbors and relatives',
            'Report water waste to authorities'
        ],
        after: [
            'Continue water conservation practices',
            'Replant with drought-resistant species',
            'Implement long-term water saving measures',
            'Support community water management efforts'
        ]
    }
};

// Export all disaster data
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DISASTER_REGIONS,
        HISTORICAL_DISASTERS,
        SEASONAL_RISKS,
        STATE_VULNERABILITY,
        EMERGENCY_CONTACTS,
        SAFETY_RECOMMENDATIONS
    };
}