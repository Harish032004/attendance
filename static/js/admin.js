// static/js/admin.js

let attendanceChart, deptChart;

function toggleMenu() {
    document.querySelector('.nav-menu').classList.toggle('active');
}

async function loadDashboardData() {
    try {
        const response = await fetch('/api/admin/dashboard-stats');
        const data = await response.json();
        
        if (data.success) {
            updateStats(data.stats);
            updateDepartmentStats(data.dept_stats);
            updateActivityFeed(data.recent_activity);
            updateCharts(data);
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showError('Failed to load dashboard data');
    }
}

function updateStats(stats) {
    document.getElementById('totalEmployees').textContent = stats.total_employees || 0;
    document.getElementById('presentToday').textContent = stats.present_today || 0;
    document.getElementById('wfhToday').textContent = stats.wfh_today || 0;
    document.getElementById('leaveToday').textContent = stats.leave_today || 0;
    document.getElementById('notMarked').textContent = stats.not_marked || 0;
}

function updateDepartmentStats(deptStats) {
    const container = document.getElementById('deptStats');
    
    if (!deptStats || Object.keys(deptStats).length === 0) {
        container.innerHTML = '<div class="no-data">No department data available</div>';
        return;
    }
    
    let html = '';
    
    for (const [dept, stats] of Object.entries(deptStats)) {
        const presentPercent = stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(1) : 0;
        
        html += `
            <div class="dept-card">
                <div class="dept-name">${dept}</div>
                <div class="dept-stats">
                    <div class="dept-stat">
                        <div class="dept-stat-value">${stats.total}</div>
                        <div class="dept-stat-label">Total</div>
                    </div>
                    <div class="dept-stat">
                        <div class="dept-stat-value" style="color: var(--primary-color);">${stats.present}</div>
                        <div class="dept-stat-label">Present</div>
                    </div>
                    <div class="dept-stat">
                        <div class="dept-stat-value" style="color: var(--success-color);">${stats.wfh}</div>
                        <div class="dept-stat-label">WFH</div>
                    </div>
                    <div class="dept-stat">
                        <div class="dept-stat-value" style="color: var(--warning-color);">${stats.leave}</div>
                        <div class="dept-stat-label">Leave</div>
                    </div>
                </div>
                <div class="progress-bar">
                    <div class="progress-bar-fill" style="width: ${presentPercent}%"></div>
                </div>
                <div style="text-align: right; font-size: 0.85rem; margin-top: 5px; color: var(--text-muted);">
                    ${presentPercent}% present
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

function updateActivityFeed(activities) {
    const container = document.getElementById('activityFeed');
    
    if (!activities || activities.length === 0) {
        container.innerHTML = '<div class="no-data">No recent activities</div>';
        return;
    }
    
    let html = '';
    activities.forEach(activity => {
        const time = new Date(activity.time || activity.timestamp).toLocaleString();
        html += `
            <div class="activity-item">
                <div class="activity-icon">👤</div>
                <div class="activity-content">
                    <div class="activity-user">${activity.user || activity.user_name || 'System'}</div>
                    <div class="activity-action">${activity.action || 'Action'}</div>
                    <div class="activity-time">${time}</div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function updateCharts(data) {
    // Attendance Distribution Chart
    const ctx1 = document.getElementById('attendanceChart').getContext('2d');
    
    if (attendanceChart) {
        attendanceChart.destroy();
    }
    
    attendanceChart = new Chart(ctx1, {
        type: 'doughnut',
        data: {
            labels: ['Present', 'WFH', 'Leave', 'Not Marked'],
            datasets: [{
                data: [
                    data.stats.present_today || 0,
                    data.stats.wfh_today || 0,
                    data.stats.leave_today || 0,
                    data.stats.not_marked || 0
                ],
                backgroundColor: [
                    '#4361ee',
                    '#06d6a0',
                    '#ffd166',
                    '#8d99ae'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: 'white',
                        font: {
                            size: 12
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });

    // Department Chart
    const ctx2 = document.getElementById('deptChart').getContext('2d');
    const depts = Object.keys(data.dept_stats || {});
    const presentData = depts.map(d => (data.dept_stats[d]?.present || 0));
    
    if (deptChart) {
        deptChart.destroy();
    }
    
    deptChart = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: depts.length ? depts : ['No Data'],
            datasets: [{
                label: 'Present Today',
                data: presentData.length ? presentData : [0],
                backgroundColor: '#4361ee',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'white',
                        stepSize: 1
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'white',
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    });
}

function refreshData() {
    loadDashboardData();
    showMessage('Dashboard refreshed', 'success');
}

function exportReport() {
    window.location.href = '/admin/reports';
}

function showError(message) {
    // You can implement toast notifications here
    console.error(message);
}

function showMessage(message, type) {
    // You can implement toast notifications here
    console.log(`${type}: ${message}`);
}

// Auto-refresh every 5 minutes
setInterval(loadDashboardData, 300000);

// Initial load when DOM is ready
document.addEventListener('DOMContentLoaded', loadDashboardData);