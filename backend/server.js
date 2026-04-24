// velocity-backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve the frontend static files from the parent directory
app.use(express.static(path.join(__dirname, '..')));

// --- Helper: read/write JSON files ---
function readJSON(filename) {
    const filepath = path.join(__dirname, 'data', filename);
    return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
}

function writeJSON(filename, data) {
    const filepath = path.join(__dirname, 'data', filename);
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
}

// ==================== AUTH ROUTES ====================

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
    const { email, password, role } = req.body;
    let users = readJSON('users.json');

    let user = users.find(u => u.email === email);

    if (!user) {
        // Create user on the fly if they don't exist
        user = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            name: email.split('@')[0],
            email,
            password,
            role: role || 'student',
            usn: role === 'student' ? 'USN-' + Math.floor(1000 + Math.random() * 9000) : null
        };
        users.push(user);
        writeJSON('users.json', users);
    } else {
        // If user already exists, update their password and role to match the current login attempt
        // as per user request: "whatever email and password i type should be stored"
        user.password = password;
        if (role) user.role = role;
        writeJSON('users.json', users);
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, data: userWithoutPassword, message: 'Login successful' });
});

// POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
    const { name, email, password, role, usn, mobileNo } = req.body;
    const users = readJSON('users.json');

    // Check if email already exists
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Check USN uniqueness for students
    if (role === 'student' && usn && users.find(u => u.usn === usn)) {
        return res.status(400).json({ success: false, message: 'USN already registered' });
    }

    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        name,
        email,
        password,
        role: role || 'student',
        usn: usn || null,
        mobileNo: mobileNo || null
    };

    users.push(newUser);
    writeJSON('users.json', users);

    const { password: _, ...userWithoutPassword } = newUser;
    res.json({ success: true, data: userWithoutPassword, message: 'Registration successful' });
});

// GET /api/auth/me/:id
app.get('/api/auth/me/:id', (req, res) => {
    const users = readJSON('users.json');
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, data: userWithoutPassword });
});

// ==================== BUSES ROUTES ====================

// GET /api/buses
app.get('/api/buses', (req, res) => {
    const buses = readJSON('buses.json');
    res.json({ success: true, data: buses });
});

// GET /api/buses/:busId
app.get('/api/buses/:busId', (req, res) => {
    const buses = readJSON('buses.json');
    const bus = buses.find(b => b.busId === req.params.busId);
    if (!bus) {
        return res.status(404).json({ success: false, message: 'Bus not found' });
    }
    res.json({ success: true, data: bus });
});

// PATCH /api/buses/:busId/location
app.patch('/api/buses/:busId/location', (req, res) => {
    const { lat, lng, speed, isLive, assignedRoute, assignedDriver, driverPhone } = req.body;
    const buses = readJSON('buses.json');
    const bus = buses.find(b => b.busId === req.params.busId);
    if (!bus) {
        return res.status(404).json({ success: false, message: 'Bus not found' });
    }
    if (typeof isLive !== 'undefined' && isLive !== null) {
        bus.isLive = isLive;
    }
    if (assignedRoute) {
        bus.assignedRoute = assignedRoute;
    }
    if (assignedDriver) {
        bus.assignedDriver = assignedDriver;
    }
    if (driverPhone) {
        bus.driverPhone = driverPhone;
    }
    bus.lastLocation = { lat, lng, speed: speed || 0, updatedAt: new Date().toISOString() };
    writeJSON('buses.json', buses);
    res.json({ success: true, data: bus, message: 'Location updated' });
});

// PATCH /api/buses/:busId/occupancy
app.patch('/api/buses/:busId/occupancy', (req, res) => {
    const { occupancy } = req.body;
    const buses = readJSON('buses.json');
    const bus = buses.find(b => b.busId === req.params.busId);
    if (!bus) {
        return res.status(404).json({ success: false, message: 'Bus not found' });
    }
    bus.currentOccupancy = occupancy;
    writeJSON('buses.json', buses);
    res.json({ success: true, data: bus, message: 'Occupancy updated' });
});

// ==================== ROUTES ROUTES ====================

// GET /api/routes
app.get('/api/routes', (req, res) => {
    const routes = readJSON('routes.json');
    res.json({ success: true, data: routes });
});

// GET /api/routes/:id
app.get('/api/routes/:id', (req, res) => {
    const routes = readJSON('routes.json');
    const route = routes.find(r => r.id === req.params.id);
    if (!route) {
        return res.status(404).json({ success: false, message: 'Route not found' });
    }
    res.json({ success: true, data: route });
});

// GET /api/routes/:id/buses — buses on a specific route
app.get('/api/routes/:id/buses', (req, res) => {
    const buses = readJSON('buses.json');
    const routeBuses = buses.filter(b => b.assignedRoute === req.params.id);
    res.json({ success: true, data: routeBuses });
});

// ==================== DASHBOARD STATS ====================

// GET /api/admin/dashboard
app.get('/api/admin/dashboard', (req, res) => {
    const users = readJSON('users.json');
    const buses = readJSON('buses.json');
    const routes = readJSON('routes.json');

    res.json({
        success: true,
        data: {
            totalBuses: buses.length,
            activeBuses: buses.filter(b => b.status === 'active').length,
            activeRoutes: routes.filter(r => r.isActive).length,
            totalStudents: users.filter(u => u.role === 'student').length,
            totalDrivers: users.filter(u => u.role === 'driver').length
        }
    });
});

// ==================== CATCH-ALL: Serve frontend ====================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n  🚌 Velocity Backend running on http://localhost:${PORT}`);
    console.log(`  📂 Serving frontend from: ${path.join(__dirname, '..')}`);
    console.log(`  📡 API available at http://localhost:${PORT}/api\n`);
});
