/**
 * Velocity - Mock Data Layer (Belgaum, Karnataka Edition)
 * Centered around Belgaum city and Vadagaon area.
 */

const DEFAULT_MOCK_DATA = {
    users: [
        {
            "id": 1,
            "name": "Alex Rivers",
            "email": "student@velocity.com",
            "password": "password123",
            "role": "student",
            "usn": "2024-001"
        },
        {
            "id": 2,
            "name": "Ravi Kumar",
            "email": "sumit@gmail.com",
            "password": "123456",
            "role": "driver",
            "busId": "V-101"
        },
        {
            "id": 3,
            "name": "Vedant",
            "email": "vedant@gmail.com",
            "password": "123456",
            "role": "admin"
        }
    ],
    routes: [
        {
            "id": "route-1",
            "routeName": "Mahantesh Nagar → JCER",
            "routeCode": "Route 1",
            "type": "express",
            "color": "#E63946",
            "isActive": true,
            "estimatedDuration": 45,
            "stops": [
                { "name": "Ramdev Hotel", "order": 1, "lat": 15.87900307768512, "lng": 74.51594934524533 },
                { "name": "Dharmanath Circle", "order": 2, "lat": 15.875829723250984, "lng": 74.52224777331995 },
                { "name": "Shree Nagar", "order": 3, "lat": 15.87920070156194, "lng": 74.52566622971773 },
                { "name": "Sangoli", "order": 4, "lat": 15.880695391202302, "lng": 74.52978772623165 },
                { "name": "Vantamuri", "order": 5, "lat": 15.882234867173155, "lng": 74.5332521682169 },
                { "name": "Point 6", "order": 6, "lat": 15.881857391248344, "lng": 74.53795660794916 },
                { "name": "Harsha Hotel", "order": 7, "lat": 15.88738451509207, "lng": 74.54188388210139 },
                { "name": "Uday", "order": 8, "lat": 15.888582566092433, "lng": 74.54546654811654 },
                { "name": "Uday Next", "order": 9, "lat": 15.889379731279828, "lng": 74.54662930454572 },
                { "name": "Ganesh Circle", "order": 10, "lat": 15.88950645244764, "lng": 74.54888461856744 },
                { "name": "Kanbargi", "order": 11, "lat": 15.889720092111334, "lng": 74.5523694285382 },
                { "name": "Datta Mandir", "order": 12, "lat": 15.880123238413672, "lng": 74.53806499306003 },
                { "name": "Nandini", "order": 13, "lat": 15.87770284334685, "lng": 74.53674903853366 },
                { "name": "Sidnal", "order": 14, "lat": 15.875340327859975, "lng": 74.5332234373483 },
                { "name": "Mahantesh Nagar", "order": 15, "lat": 15.873375219406894, "lng": 74.52926305788544 },
                { "name": "Point 16", "order": 16, "lat": 15.87057771337475, "lng": 74.53063342358867 },
                { "name": "Lake", "order": 17, "lat": 15.86953114453762, "lng": 74.52916406740826 },
                { "name": "CBT", "order": 18, "lat": 15.862744885230722, "lng": 74.52376083211183 },
                { "name": "JCER Belagavi", "order": 19, "lat": 15.8438, "lng": 74.5012 }
            ]
        },
        {
            "id": "route-2",
            "routeName": "Vadgaon → JCER",
            "routeCode": "Route 2",
            "type": "regular",
            "color": "#2196F3",
            "isActive": true,
            "estimatedDuration": 25,
            "stops": [
                { "name": "Vadgaon Corner", "order": 1, "lat": 15.8336, "lng": 74.5242 },
                { "name": "Shahapur", "order": 2, "lat": 15.8440, "lng": 74.5120 },
                { "name": "JCER Belagavi", "order": 3, "lat": 15.8438, "lng": 74.5012 }
            ]
        },
        {
            "id": "route-3",
            "routeName": "RTO → JCER",
            "routeCode": "Route 3",
            "type": "regular",
            "color": "#4CAF50",
            "isActive": true,
            "estimatedDuration": 30,
            "stops": [
                { "name": "RTO Belagavi", "order": 1, "lat": 15.856, "lng": 74.506 },
                { "name": "Tilakwadi", "order": 2, "lat": 15.8545, "lng": 74.5020 },
                { "name": "JCER Belagavi", "order": 3, "lat": 15.8438, "lng": 74.5012 }
            ]
        },
        {
            "id": "route-4",
            "routeName": "Sambra → JCER",
            "routeCode": "Route 4",
            "type": "express",
            "color": "#FF9800",
            "isActive": true,
            "estimatedDuration": 40,
            "stops": [
                { "name": "Sambra Airport", "order": 1, "lat": 15.8629, "lng": 74.6111 },
                { "name": "Nehru Nagar", "order": 2, "lat": 15.8580, "lng": 74.5580 },
                { "name": "JCER Belagavi", "order": 3, "lat": 15.8438, "lng": 74.5012 }
            ]
        },
        {
            "id": "route-5",
            "routeName": "Hanuman Nagar → JCER",
            "routeCode": "Route 5",
            "type": "express",
            "color": "#9C27B0",
            "isActive": true,
            "estimatedDuration": 35,
            "stops": [
                { "name": "Hanuman Nagar", "order": 1, "lat": 15.8720, "lng": 74.4890 },
                { "name": "Khasbag", "order": 2, "lat": 15.8668, "lng": 74.4920 },
                { "name": "JCER Belagavi", "order": 3, "lat": 15.8438, "lng": 74.5012 }
            ]
        }
    ],
    buses: [
        {
            "busId": "V-101",
            "capacity": 50,
            "currentOccupancy": 45,
            "status": "active",
            "assignedDriver": "Ravi Kumar",
            "driverId": "DR-401",
            "assignedRoute": "route-1",
            "lastLocation": {
                "lat": 15.87900307768512,
                "lng": 74.51594934524533,
                "speed": 24,
                "updatedAt": null
            }
        },
        {
            "busId": "V-102",
            "capacity": 50,
            "currentOccupancy": 32,
            "status": "active",
            "assignedDriver": "John Doe",
            "driverId": "DR-402",
            "assignedRoute": "route-2",
            "lastLocation": {
                "lat": 15.8336,
                "lng": 74.5242,
                "speed": 32,
                "updatedAt": null
            }
        },
        {
            "busId": "V-103",
            "capacity": 50,
            "currentOccupancy": 15,
            "status": "active",
            "assignedDriver": "Sara Miller",
            "driverId": "DR-403",
            "assignedRoute": "route-3",
            "lastLocation": {
                "lat": 15.856,
                "lng": 74.506,
                "speed": 25,
                "updatedAt": null
            }
        },
        {
            "busId": "V-104",
            "capacity": 50,
            "currentOccupancy": 40,
            "status": "active",
            "assignedDriver": "Vikram Singh",
            "driverId": "DR-404",
            "assignedRoute": "route-4",
            "lastLocation": {
                "lat": 15.8629,
                "lng": 74.6111,
                "speed": 40,
                "updatedAt": null
            }
        },
        {
            "busId": "V-105",
            "capacity": 50,
            "currentOccupancy": 50,
            "status": "active",
            "assignedDriver": "Amit Patel",
            "driverId": "DR-405",
            "assignedRoute": "route-5",
            "lastLocation": {
                "lat": 15.8720,
                "lng": 74.4890,
                "speed": 30,
                "updatedAt": null
            }
        }
    ]
};

// Persistence Logic
function getVelocityData() {
    // Force clear for new routes
    if (!localStorage.getItem('velocity_routes_v4')) {
        localStorage.removeItem('velocity_full_data');
        localStorage.removeItem('velocity_fleet');
        localStorage.setItem('velocity_routes_v4', 'true');
    }

    const saved = localStorage.getItem('velocity_full_data');
    if (saved) {
        return JSON.parse(saved);
    }
    // Initialize if empty
    localStorage.setItem('velocity_full_data', JSON.stringify(DEFAULT_MOCK_DATA));
    return DEFAULT_MOCK_DATA;
}

function saveVelocityData(data) {
    localStorage.setItem('velocity_full_data', JSON.stringify(data));
    window.MockData = data;
}

// Global exposure
window.MockData = getVelocityData();
window.saveVelocityData = saveVelocityData;
