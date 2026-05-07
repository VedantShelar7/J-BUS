/**
 * Velocity - Mock Data Layer (Belgaum, Karnataka Edition)
 */

const DEFAULT_MOCK_DATA = {
    users: [
        {
            "id": 6,
            "name": "sumit",
            "email": "sumit@gmail.com",
            "password": "123456",
            "role": "driver"
        },
        {
            "id": 1,
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
                { "name": "JCER Belagavi", "order": 3, "lat": 15.8438, "lng": 74.5012 }
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
                { "name": "JCER Belagavi", "order": 2, "lat": 15.8438, "lng": 74.5012 }
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
                { "name": "JCER Belagavi", "order": 2, "lat": 15.8438, "lng": 74.5012 }
            ]
        }
    ],
    buses: [
        {
            "busId": "V-101",
            "capacity": 50,
            "currentOccupancy": 0,
            "status": "idle",
            "assignedDriver": "",
            "assignedRoute": "",
            "lastLocation": { "lat": 15.8790, "lng": 74.5159, "speed": 0 }
        },
        {
            "busId": "V-102",
            "capacity": 50,
            "currentOccupancy": 0,
            "status": "idle",
            "assignedDriver": "",
            "assignedRoute": "",
            "lastLocation": { "lat": 15.8336, "lng": 74.5242, "speed": 0 }
        }
    ]
};

function getVelocityData() {
    const saved = localStorage.getItem('velocity_full_data');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('velocity_full_data', JSON.stringify(DEFAULT_MOCK_DATA));
    return DEFAULT_MOCK_DATA;
}

function saveVelocityData(data) {
    localStorage.setItem('velocity_full_data', JSON.stringify(data));
    window.MockData = data;
}

window.MockData = getVelocityData();
window.saveVelocityData = saveVelocityData;
