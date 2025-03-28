// WebSocket connection for real-time updates
const ws = new WebSocket(`ws://${window.location.hostname}:${window.location.port}`);

// Dashboard state
let notifications = [];
let transactions = [];
let balanceHistory = [];

// Mobile-specific functionality
let touchStartY = 0;
let pullToRefreshEnabled = true;
let currentTab = 'dashboard';

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async () => {
    await loadUserData();
    await loadBalances();
    await loadTransactions();
    initializeCharts();
    setupWebSocket();
    initializePullToRefresh();
    initializeSwipeableCards();
    initializeBottomSheet();
    setupTabNavigation();
});

// Load user data
async function loadUserData() {
    try {
        const response = await fetch('/api/user', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const userData = await response.json();
        document.getElementById('username').textContent = userData.username;
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Load balances
async function loadBalances() {
    try {
        const response = await fetch('/api/balances', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const balances = await response.json();
        
        document.getElementById('xrpBalance').textContent = balances.xrp.toFixed(2);
        document.getElementById('xrpChange').textContent = 
            `${balances.xrpChange >= 0 ? '+' : ''}${balances.xrpChange.toFixed(2)}%`;
        
        updateFiatBalance(balances.fiat);
    } catch (error) {
        console.error('Error loading balances:', error);
    }
}

// Update fiat balance display
function updateFiatBalance(fiatBalances) {
    const currency = document.getElementById('fiatCurrencySelect').value;
    const balance = fiatBalances[currency] || 0;
    document.getElementById('fiatBalance').textContent = formatCurrency(balance, currency);
    document.getElementById('fiatCurrency').textContent = currency;
}

// Format currency
function formatCurrency(amount, currency) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    });
    return formatter.format(amount);
}

// Load transactions
async function loadTransactions() {
    try {
        const response = await fetch('/api/transactions', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        transactions = await response.json();
        updateTransactionsList();
    } catch (error) {
        console.error('Error loading transactions:', error);
    }
}

// Update transactions list
function updateTransactionsList() {
    const tbody = document.getElementById('transactionsList');
    tbody.innerHTML = '';

    transactions.slice(0, 10).forEach(tx => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="py-3">
                <span class="px-3 py-1 rounded-full text-sm ${
                    tx.type === 'send' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }">${tx.type}</span>
            </td>
            <td class="py-3">${formatCurrency(tx.amount, tx.currency)}</td>
            <td class="py-3">${tx.counterparty}</td>
            <td class="py-3">
                <span class="px-3 py-1 rounded-full text-sm ${getStatusStyle(tx.status)}">
                    ${tx.status}
                </span>
            </td>
            <td class="py-3">${new Date(tx.date).toLocaleDateString()}</td>
        `;
        tbody.appendChild(row);
    });
}

// Get status style
function getStatusStyle(status) {
    switch (status.toLowerCase()) {
        case 'completed':
            return 'bg-green-100 text-green-600';
        case 'pending':
            return 'bg-yellow-100 text-yellow-600';
        case 'failed':
            return 'bg-red-100 text-red-600';
        default:
            return 'bg-gray-100 text-gray-600';
    }
}

// Initialize charts
function initializeCharts() {
    // Balance history chart
    const balanceCtx = document.getElementById('balanceChart').getContext('2d');
    new Chart(balanceCtx, {
        type: 'line',
        data: {
            labels: balanceHistory.map(b => b.date),
            datasets: [{
                label: 'XRP Balance',
                data: balanceHistory.map(b => b.xrp),
                borderColor: '#2563eb',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });

    // Transaction analytics chart
    const txCtx = document.getElementById('transactionChart').getContext('2d');
    new Chart(txCtx, {
        type: 'doughnut',
        data: {
            labels: ['Sent', 'Received'],
            datasets: [{
                data: [
                    transactions.filter(tx => tx.type === 'send').length,
                    transactions.filter(tx => tx.type === 'receive').length
                ],
                backgroundColor: ['#dc2626', '#16a34a']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
}

// WebSocket setup
function setupWebSocket() {
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
            case 'transaction':
                handleNewTransaction(data.transaction);
                break;
            case 'balance':
                handleBalanceUpdate(data.balance);
                break;
            case 'notification':
                handleNotification(data.notification);
                break;
        }
    };
}

// Handle new transaction
function handleNewTransaction(transaction) {
    transactions.unshift(transaction);
    updateTransactionsList();
    // Update charts
    initializeCharts();
}

// Handle balance update
function handleBalanceUpdate(balance) {
    document.getElementById('xrpBalance').textContent = balance.xrp.toFixed(2);
    updateFiatBalance(balance.fiat);
}

// Handle notification
function handleNotification(notification) {
    notifications.unshift(notification);
    updateNotificationBadge();
    updateNotificationsList();
}

// Update notification badge
function updateNotificationBadge() {
    const badge = document.getElementById('notificationBadge');
    const unread = notifications.filter(n => !n.read).length;
    
    if (unread > 0) {
        badge.textContent = unread;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

// Update notifications list
function updateNotificationsList() {
    const list = document.getElementById('notificationsList');
    list.innerHTML = '';

    notifications.forEach(notification => {
        const div = document.createElement('div');
        div.className = `p-4 rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-blue-50'}`;
        div.innerHTML = `
            <div class="flex items-center justify-between">
                <span class="text-sm font-medium ${notification.read ? 'text-gray-600' : 'text-blue-600'}">
                    ${notification.message}
                </span>
                <span class="text-xs text-gray-500">
                    ${new Date(notification.timestamp).toLocaleTimeString()}
                </span>
            </div>
        `;
        list.appendChild(div);
    });
}

// Toggle notifications panel
function toggleNotifications() {
    const panel = document.getElementById('notificationsPanel');
    panel.classList.toggle('translate-x-full');
    
    if (!panel.classList.contains('translate-x-full')) {
        // Mark notifications as read
        notifications.forEach(n => n.read = true);
        updateNotificationBadge();
        updateNotificationsList();
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('hidden');
}

// Pull to refresh
function initializePullToRefresh() {
    const content = document.querySelector('main');
    const indicator = document.querySelector('.pull-to-refresh');

    content.addEventListener('touchstart', (e) => {
        if (!pullToRefreshEnabled) return;
        touchStartY = e.touches[0].clientY;
        indicator.classList.remove('hidden');
    });

    content.addEventListener('touchmove', (e) => {
        if (!pullToRefreshEnabled) return;
        const touchY = e.touches[0].clientY;
        const diff = touchY - touchStartY;

        if (diff > 0 && content.scrollTop <= 0) {
            e.preventDefault();
            indicator.classList.add('active');
        }
    });

    content.addEventListener('touchend', async (e) => {
        if (!pullToRefreshEnabled) return;
        const touchY = e.changedTouches[0].clientY;
        const diff = touchY - touchStartY;

        if (diff > 60 && content.scrollTop <= 0) {
            indicator.classList.add('active');
            await refreshData();
        }

        indicator.classList.remove('active', 'hidden');
    });
}

// Refresh data
async function refreshData() {
    try {
        await Promise.all([
            loadBalances(),
            loadTransactions(),
            loadNotifications()
        ]);
        
        // Show success indicator
        showToast('Updated successfully');
    } catch (error) {
        showToast('Failed to update', 'error');
    }
}

// Swipeable cards
function initializeSwipeableCards() {
    const cards = document.querySelectorAll('.swipeable-card');
    
    cards.forEach(card => {
        let startX = 0;
        let currentX = 0;

        card.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            card.style.transition = 'none';
        });

        card.addEventListener('touchmove', (e) => {
            currentX = e.touches[0].clientX;
            const diff = currentX - startX;
            
            if (diff < 0) { // Only allow left swipe
                card.style.transform = `translateX(${diff}px)`;
                const actions = card.querySelector('.actions');
                if (actions) {
                    actions.style.transform = `translateX(${diff + 100}px)`;
                }
            }
        });

        card.addEventListener('touchend', () => {
            card.style.transition = 'transform 0.3s ease';
            const diff = currentX - startX;
            
            if (diff < -50) { // Threshold for showing actions
                card.style.transform = 'translateX(-100px)';
                const actions = card.querySelector('.actions');
                if (actions) {
                    actions.style.transform = 'translateX(0)';
                }
            } else {
                card.style.transform = 'translateX(0)';
                const actions = card.querySelector('.actions');
                if (actions) {
                    actions.style.transform = 'translateX(100%)';
                }
            }
        });
    });
}

// Bottom sheet
function initializeBottomSheet() {
    const sheet = document.getElementById('settingsSheet');
    const handle = sheet.querySelector('.bottom-sheet-handle');
    let startY = 0;
    let currentY = 0;

    handle.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        sheet.style.transition = 'none';
    });

    handle.addEventListener('touchmove', (e) => {
        currentY = e.touches[0].clientY;
        const diff = currentY - startY;
        
        if (diff > 0) { // Only allow downward swipe
            sheet.style.transform = `translateY(${diff}px)`;
        }
    });

    handle.addEventListener('touchend', () => {
        sheet.style.transition = 'transform 0.3s ease';
        const diff = currentY - startY;
        
        if (diff > 100) { // Threshold for closing
            closeBottomSheet();
        } else {
            sheet.style.transform = 'translateY(0)';
        }
    });
}

// Tab navigation
function setupTabNavigation() {
    const tabs = document.querySelectorAll('.mobile-nav-item');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
}

function switchTab(tab) {
    currentTab = tab;
    
    // Handle tab switching animation
    const main = document.querySelector('main');
    main.style.opacity = '0';
    
    setTimeout(() => {
        switch(tab) {
            case 'dashboard':
                loadDashboard();
                break;
            case 'send':
                window.location.href = '/send.html';
                break;
            case 'scan':
                openQRScanner();
                break;
            case 'receive':
                window.location.href = '/receive.html';
                break;
        }
        main.style.opacity = '1';
    }, 150);
}

// Settings
function showSettings() {
    const sheet = document.getElementById('settingsSheet');
    sheet.classList.add('active');
}

function closeBottomSheet() {
    const sheet = document.getElementById('settingsSheet');
    sheet.style.transform = 'translateY(100%)';
    setTimeout(() => {
        sheet.classList.remove('active');
        sheet.style.transform = '';
    }, 300);
}

function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    // Save preference to localStorage
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('darkMode', isDark);
}

// Toast notifications
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-20 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg text-white text-sm ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } transition-opacity duration-300 z-50`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// QR Scanner
function openQRScanner() {
    if ('mediaDevices' in navigator) {
        window.location.href = '/scan.html';
    } else {
        showToast('Camera access not supported', 'error');
    }
}

// Handle mobile back button
window.addEventListener('popstate', () => {
    if (document.getElementById('settingsSheet').classList.contains('active')) {
        closeBottomSheet();
    }
});

// Settings dialog
function loadDashboard() {
    // Implement dashboard functionality
    alert('Dashboard functionality coming soon!');
}

// Logout
function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
}
