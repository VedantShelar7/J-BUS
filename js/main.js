const state = {
    role: 'student', // student | driver | admin
    timer: 8,
    timerSpeed: 24,
    user: JSON.parse(sessionStorage.getItem('velocity_user')) || null,
    fleet: JSON.parse(localStorage.getItem('velocity_fleet')) || (window.MockData ? window.MockData.buses : []),
    notifications: [],
    liveBuses: []
};

// Mock API Layer
const MockAPI = {
    login: async (email, password, role) => {
        try {
            const trimmedEmail = email.trim().toLowerCase();
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: trimmedEmail, password, role })
            });
            return await res.json();
        } catch (e) {
            console.error('Login fetch error:', e);
            return { success: false, message: 'Server connection failed.' };
        }
    },
    register: async (userData) => {
        try {
            const trimmedEmail = userData.email.trim().toLowerCase();
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...userData, email: trimmedEmail })
            });
            return await res.json();
        } catch (e) {
            console.error('Register fetch error:', e);
            return { success: false, message: 'Server connection failed.' };
        }
    },
    getRoutes: async () => {
        try {
            const res = await fetch('/api/routes');
            return await res.json();
        } catch (e) {
            console.error('getRoutes error:', e);
            return { success: false, data: [] };
        }
    },
    getRouteById: async (id) => {
        try {
            const res = await fetch(`/api/routes/${id}`);
            return await res.json();
        } catch (e) {
            console.error('getRouteById error:', e);
            return { success: false, data: null };
        }
    },
    getBuses: async () => {
        try {
            const res = await fetch('/api/buses');
            return await res.json();
        } catch (e) {
            console.error('getBuses error:', e);
            return { success: false, data: [] };
        }
    },
    getBusById: async (id) => {
        try {
            const res = await fetch(`/api/buses/${id}`);
            return await res.json();
        } catch (e) {
            console.error('getBusById error:', e);
            return { success: false, data: null };
        }
    },
    updateBusLocation: async (busId, lat, lng, speed, isLive = null, assignedRoute = null) => {
        try {
            const body = { lat, lng, speed };
            if (isLive !== null) body.isLive = isLive;
            if (assignedRoute !== null) body.assignedRoute = assignedRoute;
            const res = await fetch(`/api/buses/${busId}/location`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            return await res.json();
        } catch (e) {
            console.error('updateBusLocation error:', e);
            return { success: false };
        }
    }
};

window.MockAPI = MockAPI;

// Initialize Theme and Auth on load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    // Only check auth if not on login page
    if (!document.getElementById('page-login')) {
        checkAuth();
        initNotifications();
        startNotificationPoller();
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
        const mobileNo = document.getElementById('reg-mobile').value || null;
        MockAPI.register({ name, email, password, role: state.role, mobileNo }).then(res => {
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
    const regMobileGroup = document.getElementById('reg-mobile-group');

    if (document.body.classList.contains('mode-register')) {
        title.innerText = 'Create Account';
        subtitle.innerText = 'Join the Velocity transit network today.';
        btn.innerText = 'Register for Velocity';
        footerText.innerHTML = 'Already have an account? <a href="#" onclick="toggleLoginMode()" style="color:var(--primary); font-weight:600;">Sign In</a>';
        if(regNameGroup) regNameGroup.style.display = 'block';
        if(regMobileGroup) regMobileGroup.style.display = 'block';
    } else {
        title.innerText = 'Welcome back';
        subtitle.innerText = 'Please enter your details to sign in.';
        btn.innerText = 'Sign In to Velocity';
        footerText.innerHTML = 'Don\'t have an account? <a href="#" onclick="toggleLoginMode()" style="color:var(--primary); font-weight:600;">Create Account</a>';
        if(regNameGroup) regNameGroup.style.display = 'none';
        if(regMobileGroup) regMobileGroup.style.display = 'none';
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
    
    // Check if we are on mobile/tablet (using the 850px breakpoint from CSS)
    const isMobile = window.innerWidth <= 850;
    
    if (sidebar) {
        if (isMobile) {
            // Mobile: Toggle active class for slide-in drawer
            sidebar.classList.toggle('active');
            
            // Toggle overlay
            let overlay = document.querySelector('.sidebar-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'sidebar-overlay';
                document.body.appendChild(overlay);
                overlay.onclick = toggleSidebar; // Close when clicking overlay
            }
            overlay.classList.toggle('active');
        } else {
            // Desktop: Toggle collapsed class for width shrink
            sidebar.classList.toggle('collapsed');
            if (sidebar.classList.contains('collapsed')) {
                if (toggleBtn) toggleBtn.classList.add('visible');
            } else {
                if (toggleBtn) toggleBtn.classList.remove('visible');
            }
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

// Notification System logic
function initNotifications() {
    // Create the panel if it doesn't exist
    let panel = document.querySelector('.notification-panel');
    if (!panel) {
        panel = document.createElement('div');
        panel.className = 'notification-panel';
        panel.innerHTML = `
            <div class="notification-header">
                <span style="font-weight:700; font-family:'Manrope';">Notifications</span>
                <span style="font-size:12px; color:var(--primary); cursor:pointer;" onclick="clearNotifications()">Clear All</span>
            </div>
            <div class="notification-content" id="notification-items">
                <div style="padding:40px 20px; text-align:center; color:var(--text-muted);">
                    <svg class="icon" viewBox="0 0 24 24" style="width:48px; height:48px; opacity:0.2; margin-bottom:12px;"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
                    <div>No new notifications</div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
    }
}

function toggleNotifications() {
    const panel = document.querySelector('.notification-panel');
    if (panel) {
        panel.classList.toggle('active');
        // Hide red dot when opening
        const dot = document.getElementById('notification-dot');
        if (dot) dot.style.display = 'none';
        
        // Reposition based on toggle target if needed, but CSS handles top/right
    }
}

function addNotification(title, message, type = 'info') {
    const id = Date.now();
    state.notifications.unshift({ id, title, message, time: new Date(), unread: true });
    
    // Update UI
    const container = document.getElementById('notification-items');
    if (container) {
        // Remove "No notifications" placeholder if it exists
        if (state.notifications.length === 1) container.innerHTML = '';
        
        const item = document.createElement('div');
        item.className = 'notification-item unread';
        item.innerHTML = `
            <div style="font-weight:600; font-size:14px; margin-bottom:4px;">${title}</div>
            <div style="font-size:12px; color:var(--text-muted); line-height:1.4;">${message}</div>
            <div style="font-size:10px; color:var(--primary); margin-top:8px; font-weight:600;">JUST NOW</div>
        `;
        container.prepend(item);
    }
    
    // Show Toast
    showToast(title, message);
    
    // Show Red Dot
    const dot = document.getElementById('notification-dot');
    if (dot) dot.style.display = 'block';
}

function clearNotifications() {
    state.notifications = [];
    const container = document.getElementById('notification-items');
    if (container) {
        container.innerHTML = `
            <div style="padding:40px 20px; text-align:center; color:var(--text-muted);">
                <svg class="icon" viewBox="0 0 24 24" style="width:48px; height:48px; opacity:0.2; margin-bottom:12px;"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
                <div>No new notifications</div>
            </div>
        `;
    }
}

let pollInterval = null;
function startNotificationPoller() {
    if (pollInterval) clearInterval(pollInterval);
    
    // Only students/admins need to poll for updates
    if (state.user && state.user.role !== 'driver') {
        pollInterval = setInterval(checkLiveBuses, 5000); // Check every 5 seconds
    }
}

async function checkLiveBuses() {
    const res = await MockAPI.getBuses();
    if (res.success) {
        const currentLive = res.data.filter(b => b.isLive);
        
        currentLive.forEach(bus => {
            // If this bus was NOT live in our previous state, trigger notification
            const wasLive = state.liveBuses.find(b => b.busId === bus.busId);
            if (!wasLive) {
                addNotification(
                    "Bus Live Now! 🚌", 
                    `Bus #${bus.busId.split('-')[1]} (${bus.assignedRoute.replace(/-/g, ' ')}) has started live tracking.`
                );
            }
        });
        
        state.liveBuses = currentLive;
    }
}

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
