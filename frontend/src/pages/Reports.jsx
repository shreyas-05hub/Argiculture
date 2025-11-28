import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('last7days');
  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const loadReportsData = () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setReportsData({
          overview: {
            totalRevenue: 125000,
            totalOrders: 345,
            totalProducts: 89,
            activeCustomers: 167,
            revenueGrowth: 15.2,
            orderGrowth: 8.7,
            customerGrowth: 12.3
          },
          sales: {
            daily: [
              { date: '2024-01-01', revenue: 12000, orders: 34 },
              { date: '2024-01-02', revenue: 15000, orders: 42 },
              { date: '2024-01-03', revenue: 11000, orders: 31 },
              { date: '2024-01-04', revenue: 18000, orders: 48 },
              { date: '2024-01-05', revenue: 16000, orders: 45 },
              { date: '2024-01-06', revenue: 14000, orders: 38 },
              { date: '2024-01-07', revenue: 17000, orders: 47 }
            ],
            byCategory: [
              { category: 'Grains', revenue: 45000, percentage: 36 },
              { category: 'Vegetables', revenue: 38000, percentage: 30.4 },
              { category: 'Fruits', revenue: 22000, percentage: 17.6 },
              { category: 'Dairy', revenue: 15000, percentage: 12 },
              { category: 'Spices', revenue: 5000, percentage: 4 }
            ]
          },
          products: {
            topSelling: [
              { id: 1, name: 'Premium Wheat', sales: 145, revenue: 17400 },
              { id: 2, name: 'Fresh Tomato', sales: 132, revenue: 6600 },
              { id: 3, name: 'Basmati Rice', sales: 98, revenue: 14700 },
              { id: 4, name: 'Organic Potatoes', sales: 87, revenue: 4350 },
              { id: 5, name: 'Golden Corn', sales: 76, revenue: 6840 }
            ],
            lowStock: [
              { id: 6, name: 'Brown Rice', stock: 5, threshold: 20 },
              { id: 7, name: 'Green Chili', stock: 8, threshold: 15 },
              { id: 8, name: 'Red Onion', stock: 12, threshold: 25 }
            ]
          },
          customers: {
            newCustomers: 45,
            returningCustomers: 122,
            topCustomers: [
              { id: 1, name: 'Farm Fresh Mart', orders: 23, total: 23450 },
              { id: 2, name: 'Green Valley Stores', orders: 18, total: 18700 },
              { id: 3, name: 'Organic Corner', orders: 15, total: 15600 },
              { id: 4, name: 'Village Market', orders: 12, total: 12300 },
              { id: 5, name: 'City Supermarket', orders: 10, total: 9800 }
            ]
          }
        });
        setLoading(false);
      }, 1000);
    };

    loadReportsData();
  }, [dateRange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getGrowthColor = (growth) => {
    if (growth > 0) return 'text-success';
    if (growth < 0) return 'text-danger';
    return 'text-muted';
  };

  const getGrowthIcon = (growth) => {
    if (growth > 0) return 'bi-arrow-up';
    if (growth < 0) return 'bi-arrow-down';
    return 'bi-dash';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="container-fluid p-4">
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading reports...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container-fluid p-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h3 mb-1 text-dark fw-bold">Analytics & Reports</h1>
                <p className="text-muted mb-0">Comprehensive insights into your marketplace performance</p>
              </div>
              <div className="d-flex gap-2">
                <select 
                  className="form-select"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  style={{ width: 'auto' }}
                >
                  <option value="today">Today</option>
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="last90days">Last 90 Days</option>
                  <option value="custom">Custom Range</option>
                </select>
                <button className="btn btn-success">
                  <i className="bi bi-download me-2"></i>
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="row mb-4">
          <div className="col-12">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  <i className="bi bi-speedometer2 me-2"></i>
                  Overview
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'sales' ? 'active' : ''}`}
                  onClick={() => setActiveTab('sales')}
                >
                  <i className="bi bi-graph-up me-2"></i>
                  Sales Report
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
                  onClick={() => setActiveTab('products')}
                >
                  <i className="bi bi-box-seam me-2"></i>
                  Products
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'customers' ? 'active' : ''}`}
                  onClick={() => setActiveTab('customers')}
                >
                  <i className="bi bi-people me-2"></i>
                  Customers
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'inventory' ? 'active' : ''}`}
                  onClick={() => setActiveTab('inventory')}
                >
                  <i className="bi bi-clipboard-data me-2"></i>
                  Inventory
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="row">
            {/* Key Metrics */}
            <div className="col-12 mb-4">
              <div className="row">
                <div className="col-md-3 mb-3">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="card-title text-muted mb-2">Total Revenue</h6>
                          <h3 className="fw-bold text-primary">{formatCurrency(reportsData.overview.totalRevenue)}</h3>
                          <small className={getGrowthColor(reportsData.overview.revenueGrowth)}>
                            <i className={`bi ${getGrowthIcon(reportsData.overview.revenueGrowth)} me-1`}></i>
                            {Math.abs(reportsData.overview.revenueGrowth)}% vs previous period
                          </small>
                        </div>
                        <div className="bg-primary bg-opacity-10 p-3 rounded">
                          <i className="bi bi-currency-rupee fs-4 text-primary"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="card-title text-muted mb-2">Total Orders</h6>
                          <h3 className="fw-bold text-success">{reportsData.overview.totalOrders}</h3>
                          <small className={getGrowthColor(reportsData.overview.orderGrowth)}>
                            <i className={`bi ${getGrowthIcon(reportsData.overview.orderGrowth)} me-1`}></i>
                            {Math.abs(reportsData.overview.orderGrowth)}% vs previous period
                          </small>
                        </div>
                        <div className="bg-success bg-opacity-10 p-3 rounded">
                          <i className="bi bi-cart-check fs-4 text-success"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="card-title text-muted mb-2">Active Products</h6>
                          <h3 className="fw-bold text-warning">{reportsData.overview.totalProducts}</h3>
                          <small className="text-muted">In marketplace</small>
                        </div>
                        <div className="bg-warning bg-opacity-10 p-3 rounded">
                          <i className="bi bi-box fs-4 text-warning"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="card-title text-muted mb-2">Active Customers</h6>
                          <h3 className="fw-bold text-info">{reportsData.overview.activeCustomers}</h3>
                          <small className={getGrowthColor(reportsData.overview.customerGrowth)}>
                            <i className={`bi ${getGrowthIcon(reportsData.overview.customerGrowth)} me-1`}></i>
                            {Math.abs(reportsData.overview.customerGrowth)}% vs previous period
                          </small>
                        </div>
                        <div className="bg-info bg-opacity-10 p-3 rounded">
                          <i className="bi bi-people fs-4 text-info"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts and Additional Metrics */}
            <div className="col-lg-8 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white">
                  <h5 className="card-title mb-0">Revenue Trend</h5>
                </div>
                <div className="card-body">
                  <div className="text-center py-5">
                    <i className="bi bi-bar-chart display-4 text-muted"></i>
                    <p className="text-muted mt-2">Revenue chart visualization would be here</p>
                    <small className="text-muted">Integrate with charts library like Chart.js or Recharts</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white">
                  <h5 className="card-title mb-0">Sales by Category</h5>
                </div>
                <div className="card-body">
                  {reportsData.sales.byCategory.map((category, index) => (
                    <div key={category.category} className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-medium">{category.category}</span>
                        <span className="text-muted">{category.percentage}%</span>
                      </div>
                      <div className="progress" style={{ height: '8px' }}>
                        <div 
                          className="progress-bar" 
                          style={{ 
                            width: `${category.percentage}%`,
                            backgroundColor: `hsl(${index * 60}, 70%, 45%)`
                          }}
                        ></div>
                      </div>
                      <small className="text-muted">{formatCurrency(category.revenue)}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sales Report Tab */}
        {activeTab === 'sales' && (
          <div className="row">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Sales Report</h5>
                  <div className="btn-group">
                    <button className="btn btn-outline-secondary btn-sm">Daily</button>
                    <button className="btn btn-outline-secondary btn-sm">Weekly</button>
                    <button className="btn btn-outline-secondary btn-sm active">Monthly</button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Revenue</th>
                          <th>Orders</th>
                          <th>Average Order Value</th>
                          <th>Growth</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportsData.sales.daily.map((day, index) => (
                          <tr key={day.date}>
                            <td>{new Date(day.date).toLocaleDateString()}</td>
                            <td className="fw-bold text-success">{formatCurrency(day.revenue)}</td>
                            <td>{day.orders}</td>
                            <td>{formatCurrency(day.revenue / day.orders)}</td>
                            <td>
                              <span className="badge bg-success">
                                <i className="bi bi-arrow-up me-1"></i>
                                {Math.floor(Math.random() * 20) + 5}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="row">
            <div className="col-lg-6 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white">
                  <h5 className="card-title mb-0">Top Selling Products</h5>
                </div>
                <div className="card-body">
                  <div className="list-group list-group-flush">
                    {reportsData.products.topSelling.map((product, index) => (
                      <div key={product.id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                        <div>
                          <h6 className="mb-1">{product.name}</h6>
                          <small className="text-muted">{product.sales} units sold</small>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-success">{formatCurrency(product.revenue)}</div>
                          <small className="text-muted">Revenue</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Low Stock Alert</h5>
                  <span className="badge bg-danger">{reportsData.products.lowStock.length} items</span>
                </div>
                <div className="card-body">
                  <div className="list-group list-group-flush">
                    {reportsData.products.lowStock.map((product) => (
                      <div key={product.id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                        <div>
                          <h6 className="mb-1">{product.name}</h6>
                          <small className="text-muted">Threshold: {product.threshold} units</small>
                        </div>
                        <div className="text-end">
                          <div className={`fw-bold ${product.stock < 10 ? 'text-danger' : 'text-warning'}`}>
                            {product.stock} units
                          </div>
                          <small className="text-muted">Current stock</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="row">
            <div className="col-lg-4 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-people-fill display-4 text-primary mb-3"></i>
                  <h3>{reportsData.customers.newCustomers}</h3>
                  <p className="text-muted mb-0">New Customers</p>
                  <small className="text-success">
                    <i className="bi bi-arrow-up me-1"></i>
                    12% growth
                  </small>
                </div>
              </div>
            </div>

            <div className="col-lg-4 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-arrow-repeat display-4 text-success mb-3"></i>
                  <h3>{reportsData.customers.returningCustomers}</h3>
                  <p className="text-muted mb-0">Returning Customers</p>
                  <small className="text-success">
                    <i className="bi bi-arrow-up me-1"></i>
                    8% growth
                  </small>
                </div>
              </div>
            </div>

            <div className="col-lg-4 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-star-fill display-4 text-warning mb-3"></i>
                  <h3>73%</h3>
                  <p className="text-muted mb-0">Customer Retention Rate</p>
                  <small className="text-success">
                    <i className="bi bi-arrow-up me-1"></i>
                    5% improvement
                  </small>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white">
                  <h5 className="card-title mb-0">Top Customers</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Total Orders</th>
                          <th>Total Spent</th>
                          <th>Last Order</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportsData.customers.topCustomers.map((customer) => (
                          <tr key={customer.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                                  <i className="bi bi-building text-primary"></i>
                                </div>
                                <div>
                                  <div className="fw-bold">{customer.name}</div>
                                  <small className="text-muted">Business Customer</small>
                                </div>
                              </div>
                            </td>
                            <td>{customer.orders}</td>
                            <td className="fw-bold text-success">{formatCurrency(customer.total)}</td>
                            <td>2 days ago</td>
                            <td>
                              <span className="badge bg-success">Active</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="row">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white">
                  <h5 className="card-title mb-0">Inventory Summary</h5>
                </div>
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col-md-3 mb-3">
                      <div className="border rounded p-3">
                        <i className="bi bi-box-seam display-6 text-primary mb-2"></i>
                        <h4>89</h4>
                        <p className="text-muted mb-0">Total Products</p>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="border rounded p-3">
                        <i className="bi bi-check-circle display-6 text-success mb-2"></i>
                        <h4>76</h4>
                        <p className="text-muted mb-0">In Stock</p>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="border rounded p-3">
                        <i className="bi bi-exclamation-triangle display-6 text-warning mb-2"></i>
                        <h4>8</h4>
                        <p className="text-muted mb-0">Low Stock</p>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="border rounded p-3">
                        <i className="bi bi-x-circle display-6 text-danger mb-2"></i>
                        <h4>5</h4>
                        <p className="text-muted mb-0">Out of Stock</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h6 className="mb-3">Inventory Turnover by Category</h6>
                    <div className="row">
                      {[
                        { category: 'Grains', turnover: '12.5', color: 'primary' },
                        { category: 'Vegetables', turnover: '8.2', color: 'success' },
                        { category: 'Fruits', turnover: '6.8', color: 'warning' },
                        { category: 'Dairy', turnover: '15.3', color: 'info' },
                        { category: 'Spices', turnover: '4.2', color: 'secondary' }
                      ].map((item, index) => (
                        <div key={item.category} className="col-md-2 col-6 mb-3">
                          <div className="text-center">
                            <div className={`bg-${item.color} bg-opacity-10 rounded-circle p-3 mx-auto mb-2`}>
                              <i className={`bi bi-arrow-repeat text-${item.color} fs-4`}></i>
                            </div>
                            <h5 className="mb-1">{item.turnover}</h5>
                            <small className="text-muted">{item.category}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bootstrap Icons */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
        />
      </div>
    </AdminLayout>
  );
};

export default Reports;