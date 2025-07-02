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
        totalBalance: 71828.19
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
            
            // Handle both text icons and local image files
            const iconHtml = asset.icon.startsWith('/images/') 
                ? `<img src="${asset.icon}" alt="${asset.symbol}" class="w-6 h-6">`
                : asset.icon;
            
            assetItem.innerHTML = `
                <div class="flex items-center">
                    <div class="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg font-bold mr-3">
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

        // Sample portfolio data for the chart
        const chartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Portfolio Value',
                data: [18500, 19200, 21300, 20800, 23400, 24567],
                borderColor: '#00C805',
                backgroundColor: 'rgba(0, 200, 5, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        };

        new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        display: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#9CA3AF'
                        }
                    },
                    y: {
                        display: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#9CA3AF',
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                elements: {
                    point: {
                        radius: 4,
                        hoverRadius: 6
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
