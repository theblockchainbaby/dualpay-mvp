document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // Sample user data
    const userData = {
        username: 'demo',
        totalBalance: 98499.19 // Updated to include stablecoins: 71828.19 + 5420.00 + 12500.75 + 8750.25
    };

    // Sample crypto assets with realistic data
    const assets = [
        {
            symbol: 'BTC',
            name: 'Bitcoin',
            balance: 0.5432,
            value: 57730.72, // 0.5432 * 106291.96
            change: '+2.34%',
            changeClass: 'text-green-500',
            icon: '/images/bitcoin-logo.svg'
        },
        {
            symbol: 'ETH',
            name: 'Ethereum',
            balance: 3.2145,
            value: 7832.71, // 3.2145 * 2436.40
            change: '+1.87%',
            changeClass: 'text-green-500',
            icon: '/images/ethereum-logo.svg'
        },
        {
            symbol: 'XRP',
            name: 'XRP',
            balance: 1250.75,
            value: 2751.65, // 1250.75 * 2.20
            change: '-0.52%',
            changeClass: 'text-red-500',
            icon: '/images/xrp-logo.svg'
        },
        {
            symbol: 'SOL',
            name: 'Solana',
            balance: 12.8934,
            value: 1920.63, // 12.8934 * 148.95
            change: '+4.12%',
            changeClass: 'text-green-500',
            icon: '/images/solana-logo.svg'
        },
        {
            symbol: 'ADA',
            name: 'Cardano',
            balance: 2845.50,
            value: 1593.48, // 2845.50 * 0.56
            change: '+1.23%',
            changeClass: 'text-green-500',
            icon: '/images/ada-logo.png'
        },
        {
            symbol: 'RLUSD',
            name: 'Ripple USD',
            balance: 5420.00,
            value: 5420.00, // 5420.00 * 1.00 (stablecoin)
            change: '+0.00%',
            changeClass: 'text-gray-400',
            icon: '/images/ripple-xrp-seeklogo.svg'
        },
        {
            symbol: 'USDT',
            name: 'Tether USD',
            balance: 12500.75,
            value: 12500.75, // 12500.75 * 1.00 (stablecoin)
            change: '+0.00%',
            changeClass: 'text-gray-400',
            icon: '/images/tether-usd-usdt-seeklogo.svg'
        },
        {
            symbol: 'USDC',
            name: 'USD Coin',
            balance: 8750.25,
            value: 8750.25, // 8750.25 * 1.00 (stablecoin)
            change: '+0.00%',
            changeClass: 'text-gray-400',
            icon: '/images/usd-coin-usdc-seeklogo.svg'
        }
    ];

    // Sample recent transactions
    const transactions = [
        {
            type: 'Received',
            asset: 'BTC',
            amount: '+0.0234',
            value: '+$1,245.67',
            date: '2 hours ago',
            icon: '↓',
            iconClass: 'text-green-500'
        },
        {
            type: 'Sent',
            asset: 'ETH',
            amount: '-0.5000',
            value: '-$1,220.00',
            date: '5 hours ago',
            icon: '↑',
            iconClass: 'text-red-500'
        },
        {
            type: 'Received',
            asset: 'XRP',
            amount: '+150.00',
            value: '+$90.75',
            date: '1 day ago',
            icon: '↓',
            iconClass: 'text-green-500'
        },
        {
            type: 'Swap',
            asset: 'SOL → ETH',
            amount: '2.5 SOL',
            value: '$420.15',
            date: '2 days ago',
            icon: '⟲',
            iconClass: 'text-blue-500'
        },
        {
            type: 'Sent',
            asset: 'BTC',
            amount: '-0.0100',
            value: '-$423.45',
            date: '3 days ago',
            icon: '↑',
            iconClass: 'text-red-500'
        }
    ];

    // Update UI elements
    function updateDashboard() {
        // Update username
        document.getElementById('username').textContent = userData.username;
        document.getElementById('username-header').textContent = userData.username;
        
        // Update balances
        document.getElementById('sidebarBalance').textContent = `$${userData.totalBalance.toLocaleString()}`;
        document.getElementById('totalBalance').textContent = `$${userData.totalBalance.toLocaleString()}`;
        
        // Update 24h change (sample calculation)
        const changeAmount = 456.78;
        const changePercent = ((changeAmount / userData.totalBalance) * 100).toFixed(2);
        document.getElementById('balanceChange').textContent = `+$${changeAmount} (+${changePercent}%)`;
        
        // Populate assets
        const assetList = document.getElementById('assetList');
        assetList.innerHTML = '';
        
        assets.forEach(asset => {
            const assetItem = document.createElement('li');
            assetItem.className = 'flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors';
            
            // Handle both text icons and local image files - all crypto icons now large and consistent
            const iconSize = asset.icon.startsWith('/images/') ? 'w-12 h-12' : 'w-6 h-6'; // Large size for all crypto icons
            const iconHtml = asset.icon.startsWith('/images/') 
                ? `<img src="${asset.icon}" alt="${asset.symbol}" class="${iconSize}">`
                : asset.icon;
            
            const containerSize = asset.icon.startsWith('/images/') ? 'w-16 h-16' : 'w-10 h-10'; // Large container for all crypto icons
            const containerBg = asset.icon.startsWith('/images/') ? '' : 'bg-gray-700'; // No background for crypto icons, keep for text icons
            
            assetItem.innerHTML = `
                <div class="flex items-center">
                    <div class="${containerSize} rounded-full ${containerBg} flex items-center justify-center text-lg font-bold mr-3">
                        ${iconHtml}
                    </div>
                    <div>
                        <p class="font-semibold">${asset.name}</p>
                        <p class="text-sm text-gray-400">${asset.balance} ${asset.symbol}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-semibold">$${asset.value.toLocaleString()}</p>
                    <p class="text-sm ${asset.changeClass}">${asset.change}</p>
                </div>
            `;
            assetList.appendChild(assetItem);
        });
        
        // Populate transactions
        const transactionList = document.getElementById('transactionList');
        transactionList.innerHTML = '';
        
        transactions.forEach(transaction => {
            const transactionItem = document.createElement('li');
            transactionItem.className = 'flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors';
            transactionItem.innerHTML = `
                <div class="flex items-center">
                    <div class="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg ${transaction.iconClass} mr-3">
                        ${transaction.icon}
                    </div>
                    <div>
                        <p class="font-semibold">${transaction.type}</p>
                        <p class="text-sm text-gray-400">${transaction.asset}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-semibold">${transaction.amount}</p>
                    <p class="text-sm text-gray-400">${transaction.value}</p>
                    <p class="text-xs text-gray-500">${transaction.date}</p>
                </div>
            `;
            transactionList.appendChild(transactionItem);
        });
    }

    // Initialize chart
    function initializeChart() {
        const ctx = document.getElementById('portfolioChart');
        if (!ctx) return;

        // Sample portfolio data for the chart (Jan to July 2025)
        const chartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
                label: 'Portfolio Value',
                data: [45250, 52100, 48800, 58300, 63750, 69200, 98499], // Progressive growth to current balance (includes stablecoins)
                borderColor: '#00C805',
                backgroundColor: 'rgba(0, 200, 5, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#00C805',
                pointBorderColor: '#00C805',
                pointHoverBackgroundColor: '#00C805',
                pointHoverBorderColor: '#ffffff',
                pointHoverBorderWidth: 2
            }]
        };

        new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(24, 24, 24, 0.9)',
                        titleColor: '#E0E0E0',
                        bodyColor: '#E0E0E0',
                        borderColor: '#00C805',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            title: function(context) {
                                return context[0].label + ' 2025';
                            },
                            label: function(context) {
                                return 'Portfolio Value: $' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#9CA3AF',
                            font: {
                                size: 12
                            }
                        }
                    },
                    y: {
                        display: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#9CA3AF',
                            font: {
                                size: 12
                            },
                            callback: function(value) {
                                return '$' + (value / 1000).toFixed(0) + 'k';
                            }
                        }
                    }
                },
                elements: {
                    point: {
                        radius: 5,
                        hoverRadius: 8,
                        borderWidth: 2
                    }
                }
            }
        });
    }

    // Logout functionality
    document.getElementById('logoutButton').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('authToken');
        window.location.href = '/login.html';
    });

    // Initialize everything
    updateDashboard();
    initializeChart();
});
