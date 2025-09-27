// Inventory Management JavaScript

class InventoryManager {
    constructor() {
        this.inventory = [];
        this.filteredInventory = [];
        this.currentFilters = {
            categories: [],
            status: [],
            search: ''
        };
        this.init();
    }

    init() {
        this.loadInventory();
        this.setupEventListeners();
        this.updateDashboard();
        this.initializeChart();
        this.checkLowStockAlerts();
    }

    setupEventListeners() {
        // Add item button
        const addItemBtn = document.getElementById('add-item-btn');
        const addItemModal = document.getElementById('add-item-modal');
        const addItemClose = document.getElementById('add-item-close');
        const addItemForm = document.getElementById('add-item-form');

        if (addItemBtn) {
            addItemBtn.addEventListener('click', () => {
                addItemModal.classList.add('active');
            });
        }

        if (addItemClose) {
            addItemClose.addEventListener('click', () => {
                addItemModal.classList.remove('active');
            });
        }

        if (addItemForm) {
            addItemForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addNewItem();
            });
        }

        // Edit item functionality
        const editItemModal = document.getElementById('edit-item-modal');
        const editItemClose = document.getElementById('edit-item-close');
        const editItemForm = document.getElementById('edit-item-form');

        if (editItemClose) {
            editItemClose.addEventListener('click', () => {
                editItemModal.classList.remove('active');
            });
        }

        if (editItemForm) {
            editItemForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateItem();
            });
        }

        // Search functionality
        const searchInput = document.getElementById('inventory-search');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => {
                this.currentFilters.search = searchInput.value;
                this.filterInventory();
            }, 300));
        }

        // Category filters
        const categoryFilters = document.querySelectorAll('.category-filter input');
        categoryFilters.forEach(filter => {
            filter.addEventListener('change', () => {
                this.updateCategoryFilters();
            });
        });

        // Status filters
        const statusFilters = document.querySelectorAll('.status-filter input');
        statusFilters.forEach(filter => {
            filter.addEventListener('change', () => {
                this.updateStatusFilters();
            });
        });

        // View controls
        const viewBtns = document.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                viewBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.changeView(e.target.dataset.view);
            });
        });

        // Import/Export buttons
        const importBtn = document.getElementById('import-btn');
        const exportBtn = document.getElementById('export-btn');

        if (importBtn) {
            importBtn.addEventListener('click', () => {
                this.importInventory();
            });
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportInventory();
            });
        }

        // Stock alert modal
        const stockAlertModal = document.getElementById('stock-alert-modal');
        const stockAlertClose = document.getElementById('stock-alert-close');
        const orderAllBtn = document.getElementById('order-all-btn');
        const dismissAlertsBtn = document.getElementById('dismiss-alerts-btn');

        if (stockAlertClose) {
            stockAlertClose.addEventListener('click', () => {
                stockAlertModal.classList.remove('active');
            });
        }

        if (orderAllBtn) {
            orderAllBtn.addEventListener('click', () => {
                this.orderLowStockItems();
            });
        }

        if (dismissAlertsBtn) {
            dismissAlertsBtn.addEventListener('click', () => {
                stockAlertModal.classList.remove('active');
            });
        }

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
            }
        });
    }

    loadInventory() {
        // Load from localStorage or use sample data
        const savedInventory = localStorage.getItem('inventory');
        if (savedInventory) {
            this.inventory = JSON.parse(savedInventory);
        } else {
            // Sample inventory data
            this.inventory = [
                {
                    id: 1,
                    name: "Fresh Tomatoes",
                    category: "vegetables",
                    quantity: 25,
                    unit: "kg",
                    price: 45,
                    minStock: 10,
                    description: "Fresh red tomatoes for cooking",
                    image: "../images/tomatoes.jpg",
                    lastUpdated: new Date().toISOString()
                },
                {
                    id: 2,
                    name: "Onions",
                    category: "vegetables",
                    quantity: 8,
                    unit: "kg",
                    price: 35,
                    minStock: 15,
                    description: "Fresh onions for daily cooking",
                    image: "../images/onions.jpg",
                    lastUpdated: new Date().toISOString()
                },
                {
                    id: 3,
                    name: "Basmati Rice",
                    category: "grains",
                    quantity: 50,
                    unit: "kg",
                    price: 120,
                    minStock: 20,
                    description: "Premium basmati rice",
                    image: "../images/basmati-rice.jpg",
                    lastUpdated: new Date().toISOString()
                },
                {
                    id: 4,
                    name: "Mixed Spices",
                    category: "spices",
                    quantity: 5,
                    unit: "kg",
                    price: 85,
                    minStock: 8,
                    description: "Complete spice mix for Indian cooking",
                    image: "../images/mixed-spices.jpg",
                    lastUpdated: new Date().toISOString()
                },
                {
                    id: 5,
                    name: "Cooking Oil",
                    category: "oils",
                    quantity: 12,
                    unit: "l",
                    price: 180,
                    minStock: 10,
                    description: "Pure cooking oil",
                    image: "../images/oil.avif",
                    lastUpdated: new Date().toISOString()
                },
                {
                    id: 6,
                    name: "Stainless Steel Kadai",
                    category: "utensils",
                    quantity: 3,
                    unit: "pcs",
                    price: 450,
                    minStock: 5,
                    description: "Heavy-duty cooking kadai",
                    image: "../images/kadai.webp",
                    lastUpdated: new Date().toISOString()
                }
            ];
            this.saveInventory();
        }

        this.filteredInventory = [...this.inventory];
        this.renderInventory();
    }

    saveInventory() {
        localStorage.setItem('inventory', JSON.stringify(this.inventory));
    }

    addNewItem() {
        const form = document.getElementById('add-item-form');
        const formData = new FormData(form);
        
        const newItem = {
            id: Date.now(),
            name: formData.get('name'),
            category: formData.get('category'),
            quantity: parseInt(formData.get('quantity')),
            unit: formData.get('unit'),
            price: parseFloat(formData.get('price')),
            minStock: parseInt(formData.get('minStock')),
            description: formData.get('description'),
            image: '../assets/placeholder.jpg',
            lastUpdated: new Date().toISOString()
        };

        this.inventory.push(newItem);
        this.saveInventory();
        this.filterInventory();
        this.updateDashboard();
        this.updateChart();

        // Close modal and reset form
        document.getElementById('add-item-modal').classList.remove('active');
        form.reset();

        this.showNotification('Item added successfully!', 'success');
    }

    editItem(itemId) {
        const item = this.inventory.find(i => i.id === itemId);
        if (!item) return;

        // Populate edit form
        document.getElementById('edit-item-id').value = item.id;
        document.getElementById('edit-item-name').value = item.name;
        document.getElementById('edit-item-category').value = item.category;
        document.getElementById('edit-item-quantity').value = item.quantity;
        document.getElementById('edit-item-unit').value = item.unit;
        document.getElementById('edit-item-price').value = item.price;
        document.getElementById('edit-item-min-stock').value = item.minStock;
        document.getElementById('edit-item-description').value = item.description;

        // Show modal
        document.getElementById('edit-item-modal').classList.add('active');
    }

    updateItem() {
        const form = document.getElementById('edit-item-form');
        const formData = new FormData(form);
        const itemId = parseInt(formData.get('id'));

        const itemIndex = this.inventory.findIndex(i => i.id === itemId);
        if (itemIndex === -1) return;

        this.inventory[itemIndex] = {
            ...this.inventory[itemIndex],
            name: formData.get('name'),
            category: formData.get('category'),
            quantity: parseInt(formData.get('quantity')),
            unit: formData.get('unit'),
            price: parseFloat(formData.get('price')),
            minStock: parseInt(formData.get('minStock')),
            description: formData.get('description'),
            lastUpdated: new Date().toISOString()
        };

        this.saveInventory();
        this.filterInventory();
        this.updateDashboard();
        this.updateChart();

        // Close modal
        document.getElementById('edit-item-modal').classList.remove('active');

        this.showNotification('Item updated successfully!', 'success');
    }

    deleteItem(itemId) {
        if (confirm('Are you sure you want to delete this item?')) {
            this.inventory = this.inventory.filter(i => i.id !== itemId);
            this.saveInventory();
            this.filterInventory();
            this.updateDashboard();
            this.updateChart();

            this.showNotification('Item deleted successfully!', 'success');
        }
    }

    updateStock(itemId, change) {
        const itemIndex = this.inventory.findIndex(i => i.id === itemId);
        if (itemIndex === -1) return;

        this.inventory[itemIndex].quantity += change;
        if (this.inventory[itemIndex].quantity < 0) {
            this.inventory[itemIndex].quantity = 0;
        }

        this.inventory[itemIndex].lastUpdated = new Date().toISOString();
        this.saveInventory();
        this.filterInventory();
        this.updateDashboard();
        this.updateChart();

        this.showNotification('Stock updated successfully!', 'success');
    }

    filterInventory() {
        this.filteredInventory = this.inventory.filter(item => {
            // Search filter
            if (this.currentFilters.search) {
                const searchTerm = this.currentFilters.search.toLowerCase();
                const matchesSearch = item.name.toLowerCase().includes(searchTerm) ||
                                    item.category.toLowerCase().includes(searchTerm) ||
                                    item.description.toLowerCase().includes(searchTerm);
                if (!matchesSearch) return false;
            }

            // Category filter
            if (this.currentFilters.categories.length > 0) {
                if (!this.currentFilters.categories.includes(item.category)) {
                    return false;
                }
            }

            // Status filter
            if (this.currentFilters.status.length > 0) {
                const itemStatus = this.getItemStatus(item);
                if (!this.currentFilters.status.includes(itemStatus)) {
                    return false;
                }
            }

            return true;
        });

        this.renderInventory();
        this.updateCategoryCounts();
    }

    updateCategoryFilters() {
        const categoryFilters = document.querySelectorAll('.category-filter input:checked');
        this.currentFilters.categories = Array.from(categoryFilters).map(filter => filter.value);
        this.filterInventory();
    }

    updateStatusFilters() {
        const statusFilters = document.querySelectorAll('.status-filter input:checked');
        this.currentFilters.status = Array.from(statusFilters).map(filter => filter.value);
        this.filterInventory();
    }

    getItemStatus(item) {
        if (item.quantity === 0) return 'out-of-stock';
        if (item.quantity <= item.minStock) return 'low-stock';
        return 'in-stock';
    }

    renderInventory() {
        const tbody = document.getElementById('inventory-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (this.filteredInventory.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2rem;">
                        <i class="fas fa-search" style="font-size: 2rem; color: var(--text-secondary); margin-bottom: 1rem; display: block;"></i>
                        <h3>No items found</h3>
                        <p>Try adjusting your filters or add new items</p>
                    </td>
                </tr>
            `;
            return;
        }

        this.filteredInventory.forEach(item => {
            const status = this.getItemStatus(item);
            const stockPercentage = item.minStock > 0 ? (item.quantity / item.minStock) * 100 : 100;
            const stockLevel = stockPercentage > 100 ? 'high' : stockPercentage > 50 ? 'medium' : 'low';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="item-info">
                    <!--
                    <div class="item-image">
                      <img src="${item.image}" alt="${item.name}" onerror="this.src='../images/tomatos.jpg'">
                    </div>
                    -->
                        <div class="item-details">
                            <h4>${item.name}</h4>
                            <p>${item.description}</p>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="category-badge">${this.getCategoryName(item.category)}</span>
                </td>
                <td>
                    <div class="stock-level">
                        <div class="stock-bar">
                            <div class="stock-fill ${stockLevel}" style="width: ${Math.min(stockPercentage, 100)}%"></div>
                        </div>
                        <span class="stock-text">${item.quantity} ${item.unit}</span>
                    </div>
                </td>
                <td>₹${item.price}</td>
                <td>₹${(item.quantity * item.price).toFixed(2)}</td>
                <td>
                    <span class="status-badge ${status}">${this.getStatusName(status)}</span>
                </td>
                <td>
                    <div class="item-actions">
                        <button class="action-btn edit" onclick="inventoryManager.editItem(${item.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn" onclick="inventoryManager.updateStock(${item.id}, 1)" title="Add Stock">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="action-btn" onclick="inventoryManager.updateStock(${item.id}, -1)" title="Remove Stock">
                            <i class="fas fa-minus"></i>
                        </button>
                        <button class="action-btn delete" onclick="inventoryManager.deleteItem(${item.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    getCategoryName(category) {
        const categories = {
            'vegetables': 'Vegetables',
            'spices': 'Spices',
            'grains': 'Grains',
            'utensils': 'Utensils',
            'packaging': 'Packaging',
            'oils': 'Oils',
            'dairy': 'Dairy'
        };
        return categories[category] || category;
    }

    getStatusName(status) {
        const statuses = {
            'in-stock': 'In Stock',
            'low-stock': 'Low Stock',
            'out-of-stock': 'Out of Stock'
        };
        return statuses[status] || status;
    }

    updateDashboard() {
        const totalItems = document.getElementById('total-items');
        const lowStockCount = document.getElementById('low-stock-count');
        const pendingOrders = document.getElementById('pending-orders');
        const totalValue = document.getElementById('total-value');

        if (totalItems) {
            totalItems.textContent = this.inventory.length;
        }

        if (lowStockCount) {
            const lowStockItems = this.inventory.filter(item => this.getItemStatus(item) === 'low-stock');
            lowStockCount.textContent = lowStockItems.length;
        }

        if (pendingOrders) {
            // This would come from orders data in a real app
            pendingOrders.textContent = '0';
        }

        if (totalValue) {
            const total = this.inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0);
            totalValue.textContent = `₹${total.toFixed(2)}`;
        }
    }

    updateCategoryCounts() {
        const categoryFilters = document.querySelectorAll('.category-filter');
        categoryFilters.forEach(filter => {
            const category = filter.querySelector('input').value;
            const count = category === 'all' ? 
                this.inventory.length : 
                this.inventory.filter(item => item.category === category).length;
            
            const countSpan = filter.querySelector('.count');
            if (countSpan) {
                countSpan.textContent = `(${count})`;
            }
        });
    }

    initializeChart() {
        const ctx = document.getElementById('stock-chart');
        if (!ctx) return;

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Stock Levels',
                    data: [],
                    borderColor: '#FF6B35',
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Stock Level Trends'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        this.updateChart();
    }

    updateChart() {
        if (!this.chart) return;

        // Get last 7 days of data (simulated)
        const labels = [];
        const data = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }));
            
            // Simulate stock data (in a real app, this would come from historical data)
            const baseStock = this.inventory.reduce((sum, item) => sum + item.quantity, 0);
            const variation = Math.random() * 20 - 10; // ±10 variation
            data.push(Math.max(0, baseStock + variation));
        }

        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = data;
        this.chart.update();
    }

    checkLowStockAlerts() {
        const lowStockItems = this.inventory.filter(item => this.getItemStatus(item) === 'low-stock');
        
        if (lowStockItems.length > 0) {
            this.showLowStockAlert(lowStockItems);
        }
    }

    showLowStockAlert(items) {
        const alertItems = document.getElementById('alert-items');
        if (!alertItems) return;

        alertItems.innerHTML = '';
        
        items.forEach(item => {
            const alertItem = document.createElement('div');
            alertItem.className = 'alert-item';
            alertItem.innerHTML = `
                <div class="alert-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.description}</p>
                </div>
                <div class="alert-item-stock">
                    <div class="current">${item.quantity} ${item.unit}</div>
                    <div class="min">Min: ${item.minStock} ${item.unit}</div>
                </div>
            `;
            alertItems.appendChild(alertItem);
        });

        // Show modal after a delay
        setTimeout(() => {
            document.getElementById('stock-alert-modal').classList.add('active');
        }, 1000);
    }

    orderLowStockItems() {
        const lowStockItems = this.inventory.filter(item => this.getItemStatus(item) === 'low-stock');
        
        // In a real app, this would create orders in the marketplace
        this.showNotification(`Order created for ${lowStockItems.length} low stock items`, 'success');
        
        // Close modal
        document.getElementById('stock-alert-modal').classList.remove('active');
    }

    importInventory() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.parseCSV(e.target.result);
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    parseCSV(csvText) {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');
        
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
                const values = lines[i].split(',');
                const item = {
                    id: Date.now() + i,
                    name: values[0] || '',
                    category: values[1] || 'vegetables',
                    quantity: parseInt(values[2]) || 0,
                    unit: values[3] || 'kg',
                    price: parseFloat(values[4]) || 0,
                    minStock: parseInt(values[5]) || 0,
                    description: values[6] || '',
                    image: '../assets/placeholder.jpg',
                    lastUpdated: new Date().toISOString()
                };
                this.inventory.push(item);
            }
        }
        
        this.saveInventory();
        this.filterInventory();
        this.updateDashboard();
        this.updateChart();
        
        this.showNotification('Inventory imported successfully!', 'success');
    }

    exportInventory() {
        const headers = ['Name', 'Category', 'Quantity', 'Unit', 'Price', 'Min Stock', 'Description'];
        const csvContent = [
            headers.join(','),
            ...this.inventory.map(item => [
                item.name,
                item.category,
                item.quantity,
                item.unit,
                item.price,
                item.minStock,
                item.description
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        this.showNotification('Inventory exported successfully!', 'success');
    }

    changeView(view) {
        const inventoryDisplay = document.querySelector('.inventory-display');
        if (view === 'list') {
            inventoryDisplay.classList.add('list-view');
        } else {
            inventoryDisplay.classList.remove('list-view');
        }
    }

    showNotification(message, type = 'info') {
        if (window.streetConnectApp && window.streetConnectApp.showNotification) {
            window.streetConnectApp.showNotification(message, type);
        } else {
            alert(message);
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize inventory manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.inventoryManager = new InventoryManager();
}); 