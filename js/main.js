const state = {
    role: 'student',
    timer: 8,
    timerSpeed: 24,
    user: JSON.parse(sessionStorage.getItem('velocity_user')) || null,
    notifications: [],
    liveBuses: []
};

// API Layer
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
    updateBusLocation: async (busId, lat, lng, speed, isLive = null, assignedRoute = null, assignedDriver = null, driverPhone = null) => {
        try {
            const body = { lat, lng, speed };
            if (isLive !== null) body.isLive = isLive;
            if (assignedRoute !== null) body.assignedRoute = assignedRoute;
            if (assignedDriver !== null) body.assignedDriver = assignedDriver;
            if (driverPhone !== null) body.driverPhone = driverPhone;
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
    },
    getAdminDashboard: async () => {
        try {
            const res = await fetch('/api/admin/dashboard');
            return await res.json();
        } catch (e) {
            console.error('getAdminDashboard error:', e);
            return { success: false, data: {} };
        }
    }
};

window.MockAPI = MockAPI;

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    if (!document.getElementById('page-login')) {
        checkAuth();
        populateUserUI();
        initNotifications();
        startNotificationPoller();
    }
});

function initTheme() {
    const isDark = localStorage.getItem('velocity_dark_mode') === 'true';
    if (isDark) document.body.classList.add('dark-theme');
    if (window.location.pathname.includes('admin') || (state.user && state.user.role === 'admin')) {
        document.body.classList.add('theme-admin');
    }
}

function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-theme');
    const isDark = body.classList.contains('dark-theme');
    localStorage.setItem('velocity_dark_mode', isDark);
    const switches = document.querySelectorAll('.toggle-switch[data-type="dark-mode"]');
    switches.forEach(s => { if (isDark) s.classList.add('active'); else s.classList.remove('active'); });
}

function checkAuth() {
    if (!state.user && !window.location.pathname.includes('index.html')) {
        window.location.href = 'index.html';
    }
}

// ==================== POPULATE USER UI ====================
// Replaces all hardcoded placeholders with session user data
function populateUserUI() {
    if (!state.user) return;
    const user = state.user;
    
    // Sidebar user card
    const sidebarName = document.querySelector('.user-card-info h4');
    const sidebarSub = document.querySelector('.user-card-info p');
    const sidebarAvatar = document.querySelector('.user-card-avatar img');
    
    if (sidebarName) sidebarName.innerText = user.name;
    if (sidebarSub) {
        if (user.role === 'student') sidebarSub.innerText = user.usn ? 'USN: ' + user.usn : 'Student';
        else if (user.role === 'driver') sidebarSub.innerText = 'Driver';
        else sidebarSub.innerText = 'System Administrator';
    }
    if (sidebarAvatar) {
        const bg = user.role === 'admin' ? '0F172A' : user.role === 'driver' ? '10B981' : '0F172A';
        sidebarAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=${bg}&color=fff`;
    }
    
    // Topbar avatar
    document.querySelectorAll('.topbar-right .avatar img').forEach(img => {
        const bg = user.role === 'admin' ? '0F172A' : user.role === 'driver' ? '10B981' : '0F172A';
        img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=${bg}&color=fff`;
    });
    
    // Admin sidebar name
    const adminSidebarName = document.getElementById('sidebar-user-name');
    if (adminSidebarName) adminSidebarName.innerText = user.name;
    
    // Topbar user name display
    const topbarUserName = document.getElementById('topbar-user-name');
    if (topbarUserName) topbarUserName.innerText = user.name;
}

// ==================== LOGIN / REGISTER ====================
function switchLoginRole(element) {
    document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
    element.classList.add('active');
    state.role = element.dataset.role;
    
    // Toggle USN field visibility based on role (only in register mode)
    const usnGroup = document.getElementById('reg-usn-group');
    if (usnGroup && document.body.classList.contains('mode-register')) {
        usnGroup.style.display = state.role === 'student' ? 'block' : 'none';
    }
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-pass').value;
    const isRegister = document.body.classList.contains('mode-register');

    if (isRegister) {
        const name = document.getElementById('reg-name').value;
        const mobileNo = document.getElementById('reg-mobile').value || null;
        const usn = document.getElementById('reg-usn') ? document.getElementById('reg-usn').value || null : null;
        
        if (!name) { alert('Please enter your full name.'); return; }
        if (!mobileNo) { alert('Please enter your mobile number.'); return; }
        if (state.role === 'student' && !usn) { alert('Please enter your USN.'); return; }
        
        MockAPI.register({ name, email, password, role: state.role, mobileNo, usn }).then(res => {
            if (res.success) {
                showToast('Registration Successful!', 'Sign in with your new account');
                toggleLoginMode();
            } else {
                alert(res.message);
            }
        });
    } else {
        showLoadingScreen();
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
                hideLoadingScreen();
                alert(data.message || 'Login failed');
            }
        })
        .catch(() => {
            hideLoadingScreen();
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
    const regUsnGroup = document.getElementById('reg-usn-group');

    if (document.body.classList.contains('mode-register')) {
        title.innerText = 'Create Account';
        subtitle.innerText = 'Join the Velocity transit network today.';
        btn.innerText = 'Register for Velocity';
        footerText.innerHTML = 'Already have an account? <a href="#" onclick="toggleLoginMode()" style="color:var(--primary); font-weight:600;">Sign In</a>';
        if(regNameGroup) regNameGroup.style.display = 'block';
        if(regMobileGroup) regMobileGroup.style.display = 'block';
        if(regUsnGroup) regUsnGroup.style.display = state.role === 'student' ? 'block' : 'none';
    } else {
        title.innerText = 'Welcome back';
        subtitle.innerText = 'Please enter your details to sign in.';
        btn.innerText = 'Sign In to Velocity';
        footerText.innerHTML = 'Don\'t have an account? <a href="#" onclick="toggleLoginMode()" style="color:var(--primary); font-weight:600;">Create Account</a>';
        if(regNameGroup) regNameGroup.style.display = 'none';
        if(regMobileGroup) regMobileGroup.style.display = 'none';
        if(regUsnGroup) regUsnGroup.style.display = 'none';
    }
}

// ==================== LOADING SCREEN ====================
function showLoadingScreen() {
    let ls = document.getElementById('loading-screen');
    if (!ls) {
        ls = document.createElement('div');
        ls.id = 'loading-screen';
        ls.className = 'loading-screen';
        ls.innerHTML = `
            <div class="loading-content">
                <div class="loading-icon">
                    <svg class="icon" viewBox="0 0 24 24"><path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/></svg>
                </div>
                <div class="loading-text">Velocity</div>
                <div class="loading-spinner"></div>
            </div>`;
        document.body.appendChild(ls);
    }
    ls.classList.remove('fade-out');
    ls.style.display = 'flex';
}

function hideLoadingScreen() {
    const ls = document.getElementById('loading-screen');
    if (ls) {
        ls.classList.add('fade-out');
        setTimeout(() => { ls.style.display = 'none'; }, 500);
    }
}

// ==================== DROPDOWN / NAV / SIDEBAR ====================
function toggleDropdown(id) {
    document.querySelectorAll('.dropdown-menu').forEach(el => {
        if(el.id !== id) el.classList.remove('active');
    });
    const d = document.getElementById(id);
    if(d) d.classList.toggle('active');
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-menu').forEach(d => d.classList.remove('active'));
    }
});

function switchNav(element, targetPage) {
    const parent = element.parentElement;
    parent.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    if (targetPage) window.location.href = targetPage;
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.collapsed-sidebar-btn');
    const isMobile = window.innerWidth <= 850;
    
    if (sidebar) {
        if (isMobile) {
            sidebar.classList.toggle('active');
            let overlay = document.querySelector('.sidebar-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'sidebar-overlay';
                document.body.appendChild(overlay);
                overlay.onclick = toggleSidebar;
            }
            overlay.classList.toggle('active');
        } else {
            sidebar.classList.toggle('collapsed');
            if (sidebar.classList.contains('collapsed')) {
                if (toggleBtn) toggleBtn.classList.add('visible');
            } else {
                if (toggleBtn) toggleBtn.classList.remove('visible');
            }
        }
        setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 305);
    }
}

function togglePanel(panelId) {
    const panel = document.getElementById(panelId) || document.querySelector('.' + panelId);
    if (panel) {
        panel.classList.toggle('collapsed');
        const btn = document.querySelector('.drawer-toggle[onclick*="' + panelId + '"]');
        if (btn) btn.classList.toggle('active');
        setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 305);
    }
}

function signOut() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}

// ==================== MODALS ====================
const modalOverlay = document.getElementById('modal-overlay');
function showModal(id) {
    if (!modalOverlay) return;
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

// ==================== TOAST NOTIFICATIONS ====================
function showToast(title, message) {
    // Try existing container first
    let container = document.querySelector('.toast-container');
    let content = document.querySelector('.toast-content');
    
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        container.innerHTML = '<div class="toast"><div class="toast-dot"></div><div class="toast-content"></div></div>';
        document.body.appendChild(container);
        content = container.querySelector('.toast-content');
    }
    if (!content) return;

    content.innerHTML = `<strong>${title}</strong> • ${message}`;
    container.classList.add('active');
    setTimeout(() => { container.classList.remove('active'); }, 4000);
}

function showEmergencyAlert() { showModal('modal-emergency'); }
function showAddRouteModal() { showModal('modal-add-route'); }
function showEndTripModal() { showModal('modal-end-trip'); }

// ==================== NOTIFICATION SYSTEM ====================
function initNotifications() {
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
        const dot = document.getElementById('notification-dot');
        if (dot) dot.style.display = 'none';
    }
}

function addNotification(title, message, type = 'info') {
    state.notifications.unshift({ id: Date.now(), title, message, time: new Date(), unread: true });
    
    const container = document.getElementById('notification-items');
    if (container) {
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
    
    showToast(title, message);
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

// ==================== NOTIFICATION POLLER ====================
let pollInterval = null;
function startNotificationPoller() {
    if (pollInterval) clearInterval(pollInterval);
    if (state.user && state.user.role !== 'driver') {
        pollInterval = setInterval(checkLiveBuses, 5000);
    }
}

async function checkLiveBuses() {
    const res = await MockAPI.getBuses();
    if (res.success) {
        const currentLive = res.data.filter(b => b.isLive);
        
        currentLive.forEach(bus => {
            const wasLive = state.liveBuses.find(b => b.busId === bus.busId);
            if (!wasLive) {
                const driverName = bus.assignedDriver || 'Unknown';
                const busNum = bus.busId;
                addNotification(
                    "🚌 Your bus has started!", 
                    `Driver ${driverName}, Bus ${busNum} is on the way.`
                );
            }
        });
        
        state.liveBuses = currentLive;
    }
}

// ==================== TOGGLE LOCATION (generic) ====================
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

// ==================== STUDENT TIMER ====================
setInterval(() => {
    const el = document.getElementById('student-timer');
    if (el) {
        if (state.timer === 0) {
            state.timer = Math.floor(Math.random() * 5) + 1;
        } else {
            if(Math.random() > 0.8) {
                state.timer -= 1;
                if(state.timer < 0) state.timer = 0;
            }
        }
        const txt = (state.timer < 10 ? '0'+state.timer : state.timer);
        el.innerHTML = `${txt}<span>mins</span>`;
    }
}, 1000);
