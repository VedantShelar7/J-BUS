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
            "busId": "V-102"
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
            "routeName": "Vadgaon Route",
            "routeCode": "Route 14A",
            "type": "express",
            "isActive": true,
            "estimatedDuration": 35,
            "stops": [
                { "name": "Ganeshpur", "order": 1, "lat": 15.8856, "lng": 74.4969 },
                { "name": "RTO Belgaum", "order": 2, "lat": 15.8617, "lng": 74.5126 },
                { "name": "Vadgaon", "order": 3, "lat": 15.8390, "lng": 74.4975 },
                { "name": "Main Campus Gate", "order": 4, "lat": 15.8427, "lng": 74.5025 }
            ]
        },
        {
            "id": "route-2",
            "routeName": "North Campus Express",
            "routeCode": "Route 07B",
            "type": "express",
            "isActive": true,
            "estimatedDuration": 25,
            "stops": [
                { "name": "Main University Gate", "order": 1, "lat": 15.8427, "lng": 74.5025 },
                { "name": "Civil Hospital Junction", "order": 2, "lat": 15.8550, "lng": 74.5080 },
                { "name": "Chennamma Circle", "order": 3, "lat": 15.8590, "lng": 74.5110 },
                { "name": "Technical Hub", "order": 4, "lat": 15.8750, "lng": 74.5050 }
            ]
        },
        {
            "id": "route-3",
            "routeName": "West Side Shuttle",
            "routeCode": "Route 22C",
            "type": "regular",
            "isActive": true,
            "estimatedDuration": 40,
            "stops": [
                { "name": "Angadi College", "order": 1, "lat": 15.8200, "lng": 74.4800 },
                { "name": "Peeraanwaadi", "order": 2, "lat": 15.8250, "lng": 74.4900 },
                { "name": "Congress Road", "order": 3, "lat": 15.8380, "lng": 74.5050 },
                { "name": "Main Campus Gate", "order": 4, "lat": 15.8427, "lng": 74.5025 }
            ]
        }
    ],
    buses: [
        {
            "busId": "V-102",
            "capacity": 50,
            "currentOccupancy": 45,
            "status": "active",
            "assignedDriver": "Ravi Kumar",
            "driverId": "DR-402",
            "assignedRoute": "route-1",
            "lastLocation": {
                "lat": 15.8617,
                "lng": 74.5126,
                "speed": 24,
                "updatedAt": null
            }
        },
        {
            "busId": "V-108",
            "capacity": 50,
            "currentOccupancy": 32,
            "status": "active",
            "assignedDriver": "John Doe",
            "driverId": "DR-403",
            "assignedRoute": "route-2",
            "lastLocation": {
                "lat": 15.8590,
                "lng": 74.5110,
                "speed": 32,
                "updatedAt": null
            }
        },
        {
            "busId": "V-115",
            "capacity": 50,
            "currentOccupancy": 0,
            "status": "idle",
            "assignedDriver": "Sara Miller",
            "driverId": "DR-404",
            "assignedRoute": "route-3",
            "lastLocation": {
                "lat": 15.8250,
                "lng": 74.4900,
                "speed": 0,
                "updatedAt": null
            }
        }
    ]
};

// Persistence Logic
function getVelocityData() {
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
