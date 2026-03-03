// static/js/charts.js

// Chart color palette
const chartColors = {
    primary: '#4361ee',
    success: '#06d6a0',
    warning: '#ffd166',
    error: '#ef476f',
    info: '#118ab2',
    purple: '#8338ec',
    pink: '#e83e8c',
    orange: '#fb5607',
    teal: '#20c997',
    gray: '#8d99ae'
};

// Chart default options
const defaultChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: {
                color: 'white',
                font: {
                    size: 12,
                    family: 'Inter'
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'rgba(255, 255, 255, 0.8)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1
        }
    }
};

// Create attendance trend chart
function createAttendanceTrendChart(canvasId, data) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels || [],
            datasets: [{
                label: 'Present',
                data: data.present || [],
                borderColor: chartColors.primary,
                backgroundColor: 'rgba(67, 97, 238, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'WFH',
                data: data.wfh || [],
                borderColor: chartColors.success,
                backgroundColor: 'rgba(6, 214, 160, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Leave',
                data: data.leave || [],
                borderColor: chartColors.warning,
                backgroundColor: 'rgba(255, 209, 102, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            ...defaultChartOptions,
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
                        color: 'white'
                    }
                }
            }
        }
    });
}

// Create department distribution chart
function createDepartmentChart(canvasId, data) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    return new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.labels || [],
            datasets: [{
                data: data.values || [],
                backgroundColor: [
                    chartColors.primary,
                    chartColors.success,
                    chartColors.warning,
                    chartColors.error,
                    chartColors.info,
                    chartColors.purple,
                    chartColors.pink,
                    chartColors.orange,
                    chartColors.teal
                ],
                borderWidth: 0
            }]
        },
        options: {
            ...defaultChartOptions,
            plugins: {
                ...defaultChartOptions.plugins,
                legend: {
                    position: 'right',
                    labels: {
                        color: 'white',
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

// Create monthly summary chart
function createMonthlySummaryChart(canvasId, data) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels || [],
            datasets: [{
                label: 'Present',
                data: data.present || [],
                backgroundColor: chartColors.primary,
                borderRadius: 6
            }, {
                label: 'WFH',
                data: data.wfh || [],
                backgroundColor: chartColors.success,
                borderRadius: 6
            }, {
                label: 'Leave',
                data: data.leave || [],
                backgroundColor: chartColors.warning,
                borderRadius: 6
            }]
        },
        options: {
            ...defaultChartOptions,
            scales: {
                y: {
                    stacked: true,
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
                    stacked: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'white'
                    }
                }
            }
        }
    });
}