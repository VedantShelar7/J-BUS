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
            "estimatedDuration": 35,
            "stops": [
                { "name": "Mahantesh Nagar", "order": 1, "lat": 15.8652, "lng": 74.5021 },
                { "name": "Subhash Nagar", "order": 2, "lat": 15.8610, "lng": 74.5028 },
                { "name": "Ramteerth Nagar", "order": 3, "lat": 15.8580, "lng": 74.5024 },
                { "name": "Tilakwadi", "order": 4, "lat": 15.8545, "lng": 74.5020 },
                { "name": "KLE Campus", "order": 5, "lat": 15.8510, "lng": 74.5016 },
                { "name": "Angol Cross", "order": 6, "lat": 15.8475, "lng": 74.5013 },
                { "name": "JCER", "order": 7, "lat": 15.8438, "lng": 74.5012 }
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
                { "name": "Vadgaon", "order": 1, "lat": 15.8780, "lng": 74.5210 },
                { "name": "Udyamnagar", "order": 2, "lat": 15.8740, "lng": 74.5180 },
                { "name": "Shivaji Nagar", "order": 3, "lat": 15.8700, "lng": 74.5150 },
                { "name": "Khade Bazar", "order": 4, "lat": 15.8660, "lng": 74.5120 },
                { "name": "Camp Road", "order": 5, "lat": 15.8610, "lng": 74.5085 },
                { "name": "Angol Road", "order": 6, "lat": 15.8520, "lng": 74.5040 },
                { "name": "JCER", "order": 7, "lat": 15.8438, "lng": 74.5012 }
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
                { "name": "RTO Office", "order": 1, "lat": 15.8558, "lng": 74.5198 },
                { "name": "Goaves", "order": 2, "lat": 15.8540, "lng": 74.5165 },
                { "name": "Gandhi Nagar", "order": 3, "lat": 15.8520, "lng": 74.5135 },
                { "name": "Hindwadi", "order": 4, "lat": 15.8500, "lng": 74.5100 },
                { "name": "Angol Junction", "order": 5, "lat": 15.8472, "lng": 74.5058 },
                { "name": "Udyambag Cross", "order": 6, "lat": 15.8452, "lng": 74.5030 },
                { "name": "JCER", "order": 7, "lat": 15.8438, "lng": 74.5012 }
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
                { "name": "Sambra", "order": 1, "lat": 15.8629, "lng": 74.6111 },
                { "name": "Hindalga", "order": 2, "lat": 15.8605, "lng": 74.5820 },
                { "name": "Nehru Nagar", "order": 3, "lat": 15.8580, "lng": 74.5580 },
                { "name": "Udyambag", "order": 4, "lat": 15.8545, "lng": 74.5320 },
                { "name": "Angol Bridge", "order": 5, "lat": 15.8500, "lng": 74.5120 },
                { "name": "Angol Road", "order": 6, "lat": 15.8465, "lng": 74.5060 },
                { "name": "JCER", "order": 7, "lat": 15.8438, "lng": 74.5012 }
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
                { "name": "Saptapur", "order": 3, "lat": 15.8610, "lng": 74.4955 },
                { "name": "Shahapur", "order": 4, "lat": 15.8565, "lng": 74.4980 },
                { "name": "Fort Area", "order": 5, "lat": 15.8520, "lng": 74.4998 },
                { "name": "Angol Road", "order": 6, "lat": 15.8472, "lng": 74.5005 },
                { "name": "JCER", "order": 7, "lat": 15.8438, "lng": 74.5012 }
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
                "lat": 15.8652,
                "lng": 74.5021,
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
                "lat": 15.8780,
                "lng": 74.5210,
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
                "lat": 15.8558,
                "lng": 74.5198,
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
    if (!localStorage.getItem('velocity_routes_v2')) {
        localStorage.removeItem('velocity_full_data');
        localStorage.removeItem('velocity_fleet');
        localStorage.setItem('velocity_routes_v2', 'true');
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

