const state = {
    role: 'student', // student | driver | admin
    timer: 8,
    timerSpeed: 24,
    user: JSON.parse(sessionStorage.getItem('velocity_user')) || null,
    fleet: JSON.parse(localStorage.getItem('velocity_fleet')) || (window.MockData ? window.MockData.buses : [])
};

// Mock API Layer
const MockAPI = {
    login: (email, password, role) => {
        return new Promise((resolve) => {
            const trimmedEmail = email.trim().toLowerCase();
            const user = window.MockData.users.find(u => u.email.toLowerCase() === trimmedEmail);
            
            if (!user) {
                resolve({ success: false, message: 'Account not found. Please register first.' });
            } else if (user.password !== password) {
                resolve({ success: false, message: 'Incorrect password.' });
            } else if (user.role !== role) {
                resolve({ success: false, message: `This account is registered as a ${user.role.toUpperCase()}. Please switch the tab above.` });
            } else {
                resolve({ success: true, data: user });
            }
        });
    },
    register: (userData) => {
        return new Promise((resolve) => {
            const exists = window.MockData.users.find(u => u.email === userData.email);
            if (exists) {
                resolve({ success: false, message: 'User already exists' });
            } else {
                const newUser = {
                    id: window.MockData.users.length + 1,
                    ...userData
                };
                window.MockData.users.push(newUser);
                window.saveVelocityData(window.MockData);
                resolve({ success: true, data: newUser });
            }
        });
    },
    getRoutes: () => {
        return Promise.resolve({ success: true, data: window.MockData.routes });
    },
    getRouteById: (id) => {
        const route = window.MockData.routes.find(r => r.id === id);
        return Promise.resolve({ success: !!route, data: route });
    },
    getBuses: () => {
        return Promise.resolve({ success: true, data: state.fleet });
    },
    getBusById: (id) => {
        const bus = state.fleet.find(b => b.busId === id);
        return Promise.resolve({ success: !!bus, data: bus });
    },
    updateBusLocation: (busId, lat, lng, speed) => {
        const busIndex = state.fleet.findIndex(b => b.busId === busId);
        if (busIndex !== -1) {
            state.fleet[busIndex].lastLocation = { lat, lng, speed, updatedAt: new Date() };
            // Sync fleet back to MockData users if needed, or just keep fleet in global MockData
            window.MockData.buses = state.fleet;
            window.saveVelocityData(window.MockData);
            return Promise.resolve({ success: true });
        }
        return Promise.resolve({ success: false });
    }
};

window.MockAPI = MockAPI;

// Initialize Theme and Auth on load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    // Only check auth if not on login page
    if (!document.getElementById('page-login')) {
        checkAuth();
    }
});

function initTheme() {
    const isDark = localStorage.getItem('velocity_dark_mode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-theme');
    }
    
    // Auto-detect admin theme from filename or session
    if (window.location.pathname.includes('admin') || (state.user && state.user.role === 'admin')) {
        document.body.classList.add('theme-admin');
    }
}

function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-theme');
    const isDark = body.classList.contains('dark-theme');
    localStorage.setItem('velocity_dark_mode', isDark);
    
    // Update any toggle switches on the page
    const switches = document.querySelectorAll('.toggle-switch[data-type="dark-mode"]');
    switches.forEach(s => {
        if (isDark) s.classList.add('active');
        else s.classList.remove('active');
    });
}

function checkAuth() {
    if (!state.user && !window.location.pathname.includes('index.html')) {
        window.location.href = 'index.html';
    }
}

// Role tabs logic for Login Page
function switchLoginRole(element) {
    document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
    element.classList.add('active');
    state.role = element.dataset.role;
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-pass').value;
    const isRegister = document.body.classList.contains('mode-register');

    if (isRegister) {
        const name = document.getElementById('reg-name').value;
        MockAPI.register({ name, email, password, role: state.role }).then(res => {
            if (res.success) {
                showToast('Registration Successful!', 'Sign in with your new account');
                toggleLoginMode();
            } else {
                alert(res.message);
            }
        });
    } else {
        MockAPI.login(email, password, state.role)
        .then(data => {
            if (data.success) {
                sessionStorage.setItem('velocity_user', JSON.stringify(data.data));
                const role = data.data.role;
                showToast('Login Successful!', `Welcome back, ${data.data.name}`);
                setTimeout(() => {
                    if (role === 'student') window.location.href = 'student-dashboard.html';
                    else if (role === 'driver') window.location.href = 'driver-dashboard.html';
                    else if (role === 'admin') window.location.href = 'admin-dashboard.html';
                }, 800);
            } else {
                alert(data.message || 'Login failed');
            }
        })
        .catch(() => {
            alert('An error occurred during login');
        });
    }
}

function toggleLoginMode() {
    document.body.classList.toggle('mode-register');
    const title = document.querySelector('.login-right h2');
    const subtitle = document.querySelector('.login-right-subtitle');
    const btn = document.querySelector('form button[type="submit"]');
    const footerText = document.querySelector('.login-footer');
    const regNameGroup = document.getElementById('reg-name-group');

    if (document.body.classList.contains('mode-register')) {
        title.innerText = 'Create Account';
        subtitle.innerText = 'Join the Velocity transit network today.';
        btn.innerText = 'Register for Velocity';
        footerText.innerHTML = 'Already have an account? <a href="#" onclick="toggleLoginMode()" style="color:var(--primary); font-weight:600;">Sign In</a>';
        if(regNameGroup) regNameGroup.style.display = 'block';
    } else {
        title.innerText = 'Welcome back';
        subtitle.innerText = 'Please enter your details to sign in.';
        btn.innerText = 'Sign In to Velocity';
        footerText.innerHTML = 'Don\'t have an account? <a href="#" onclick="toggleLoginMode()" style="color:var(--primary); font-weight:600;">Create Account</a>';
        if(regNameGroup) regNameGroup.style.display = 'none';
    }
}

// Dropdown Toggles
function toggleDropdown(id) {
    document.querySelectorAll('.dropdown-menu').forEach(el => {
        if(el.id !== id) el.classList.remove('active');
    });
    const d = document.getElementById(id);
    if(d) d.classList.toggle('active');
}

// Close dropdowns on outside click
document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-menu').forEach(d => d.classList.remove('active'));
    }
});

// Sidebar navigation active state
function switchNav(element, targetPage) {
    const parent = element.parentElement;
    parent.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    
    if (targetPage) {
        window.location.href = targetPage;
    }
}

// Collapsible Panels logic
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.collapsed-sidebar-btn');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
        if (sidebar.classList.contains('collapsed')) {
            if (toggleBtn) toggleBtn.classList.add('visible');
        } else {
            if (toggleBtn) toggleBtn.classList.remove('visible');
        }
        
        // Trigger map resize after transition
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 305);
    }
}

function togglePanel(panelId) {
    const panel = document.getElementById(panelId) || document.querySelector('.' + panelId);
    if (panel) {
        panel.classList.toggle('collapsed');
        const btn = document.querySelector('.drawer-toggle[onclick*="' + panelId + '"]');
        if (btn) btn.classList.toggle('active');

        // Trigger map resize after transition
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 305);
    }
}

// Sign Out (route to index.html)
function signOut() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}

// Modals
const modalOverlay = document.getElementById('modal-overlay');
function showModal(id) {
    if (!modalOverlay) return; // Prevent errors if modal not on page
    document.querySelectorAll('#modal-overlay > div').forEach(m => m.style.display = 'none');
    const specificModal = document.getElementById(id);
    if (specificModal) {
        specificModal.style.display = 'block';
        modalOverlay.style.display = 'flex';
        setTimeout(() => modalOverlay.style.opacity = '1', 10);
    }
}

function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.style.opacity = '0';
    setTimeout(() => modalOverlay.style.display = 'none', 200);
}

// Notifications
function showToast(title, message) {
    const container = document.querySelector('.toast-container');
    const content = document.querySelector('.toast-content');
    if (!container || !content) return;

    content.innerHTML = `<strong>${title}</strong> • ${message}`;
    container.classList.add('active');
    
    setTimeout(() => {
        container.classList.remove('active');
    }, 4000);
}

function showEmergencyAlert() { showModal('modal-emergency'); }
function showAddRouteModal() { showModal('modal-add-route'); }
function showEndTripModal() { showModal('modal-end-trip'); }

// Toggle Location visual
function toggleLocation(element) {
    const toggleBg = element;
    const toggleDot = element.firstElementChild;
    if (toggleBg.style.background === 'var(--border)') {
        toggleBg.style.background = 'var(--primary)';
        toggleDot.style.right = '2px';
        toggleDot.style.left = 'auto';
    } else {
        toggleBg.style.background = 'var(--border)';
        toggleDot.style.left = '2px';
        toggleDot.style.right = 'auto';
    }
}

// Countdown Timer logic for Student dash
// Since we have separate pages, check if the timer element exists
setInterval(() => {
    const el = document.getElementById('student-timer');
    if (el) {
        if (state.timer === 0) {
            state.timer = Math.floor(Math.random() * 5) + 1; // reset arrived logic
        } else {
            // mock countdown tick sometimes
            if(Math.random() > 0.8) {
                state.timer -= 1;
                if(state.timer < 0) state.timer = 0;
            }
        }
        const txt = (state.timer < 10 ? '0'+state.timer : state.timer);
        el.innerHTML = `${txt}<span>mins</span>`;
    }
}, 1000);
