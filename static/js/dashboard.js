// class Dashboard {
//     constructor() {
//         this.messageContainer = document.getElementById('message-container');
//         this.loadingOverlay = document.getElementById('loading-overlay');
//         this.init();
//     }
    
//     init() {
//         // Work log form submission
//         const workLogForm = document.getElementById('work-log-form');
//         if (workLogForm) {
//             workLogForm.addEventListener('submit', (e) => this.handleWorkLogSubmit(e));
//         }
        
//         // Password change form
//         const passwordForm = document.getElementById('change-password-form');
//         if (passwordForm) {
//             passwordForm.addEventListener('submit', (e) => this.handlePasswordChange(e));
//         }
        
//         // Check for messages in URL
//         this.checkUrlParams();
//     }
    
//     async markAttendance(type) {
//         this.showLoading(true);
//         this.clearMessages();
        
//         try {
//             const response = await fetch('/api/mark-attendance', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ type: type })
//             });
            
//             const data = await response.json();
            
//             if (response.ok && data.success) {
//                 this.showMessage(data.message, 'success');
//                 setTimeout(() => {
//                     window.location.reload();
//                 }, 2000);
//             } else {
//                 if (data.code === 'WIFI_REQUIRED') {
//                     this.showMessage('Please connect to office WiFi to mark WFO', 'warning');
//                 } else {
//                     this.showMessage(data.message || 'Error marking attendance', 'error');
//                 }
//                 this.showLoading(false);
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             this.showMessage('Network error. Please try again.', 'error');
//             this.showLoading(false);
//         }
//     }
    
//     async handleWorkLogSubmit(e) {
//         e.preventDefault();
        
//         const description = document.getElementById('work-description').value.trim();
//         const hours = document.getElementById('hours-worked').value;
        
//         if (!description) {
//             this.showMessage('Please enter work description', 'error');
//             return;
//         }
        
//         this.showLoading(true);
//         this.clearMessages();
        
//         try {
//             const response = await fetch('/api/submit-work-log', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     work_description: description,
//                     hours_worked: hours
//                 })
//             });
            
//             const data = await response.json();
            
//             if (response.ok && data.success) {
//                 this.showMessage('Work log submitted successfully!', 'success');
//                 setTimeout(() => {
//                     window.location.reload();
//                 }, 2000);
//             } else {
//                 this.showMessage(data.message || 'Error submitting work log', 'error');
//                 this.showLoading(false);
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             this.showMessage('Network error. Please try again.', 'error');
//             this.showLoading(false);
//         }
//     }
    
//     async showHistory(type) {
//         this.showLoading(true);
        
//         try {
//             const endpoint = type === 'attendance' ? '/api/attendance-history' : '/api/work-log-history';
//             const response = await fetch(endpoint);
//             const data = await response.json();
            
//             if (response.ok && data.success) {
//                 this.displayHistoryModal(type, data.records);
//             } else {
//                 this.showMessage('Error loading history', 'error');
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             this.showMessage('Network error', 'error');
//         } finally {
//             this.showLoading(false);
//         }
//     }
    
//     displayHistoryModal(type, records) {
//         const modal = document.getElementById('history-modal');
//         const title = document.getElementById('modal-title');
//         const body = document.getElementById('modal-body');
        
//         title.textContent = type === 'attendance' ? 'Attendance History' : 'Work Log History';
        
//         if (records.length === 0) {
//             body.innerHTML = '<p class="no-records">No records found</p>';
//         } else {
//             let html = '<div class="history-list">';
            
//             if (type === 'attendance') {
//                 records.forEach(record => {
//                     html += `
//                         <div class="history-item">
//                             <div class="history-date">${record.date}</div>
//                             <div class="history-time">${record.time}</div>
//                             <div class="history-type ${record.type.toLowerCase()}">${record.type}</div>
//                         </div>
//                     `;
//                 });
//             } else {
//                 records.forEach(record => {
//                     html += `
//                         <div class="history-item">
//                             <div class="history-date">${record.date}</div>
//                             <div class="history-desc">${record.description}</div>
//                             <div class="history-hours">${record.hours}h</div>
//                         </div>
//                     `;
//                 });
//             }
            
//             html += '</div>';
//             body.innerHTML = html;
//         }
        
//         modal.style.display = 'block';
//     }
    
//     async handlePasswordChange(e) {
//         e.preventDefault();
        
//         const currentPassword = document.getElementById('current-password').value;
//         const newPassword = document.getElementById('new-password').value;
//         const confirmPassword = document.getElementById('confirm-password').value;
        
//         if (newPassword !== confirmPassword) {
//             this.showPasswordMessage('New passwords do not match', 'error');
//             return;
//         }
        
//         if (newPassword.length < 6) {
//             this.showPasswordMessage('Password must be at least 6 characters', 'error');
//             return;
//         }
        
//         this.showLoading(true);
        
//         try {
//             const response = await fetch('/api/change-password', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     current_password: currentPassword,
//                     new_password: newPassword,
//                     confirm_password: confirmPassword
//                 })
//             });
            
//             const data = await response.json();
            
//             if (response.ok && data.success) {
//                 this.showPasswordMessage('Password changed successfully!', 'success');
//                 setTimeout(() => {
//                     window.location.reload();
//                 }, 2000);
//             } else {
//                 this.showPasswordMessage(data.message || 'Error changing password', 'error');
//                 this.showLoading(false);
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             this.showPasswordMessage('Network error', 'error');
//             this.showLoading(false);
//         }
//     }
    
//     showChangePasswordModal() {
//         document.getElementById('password-modal').style.display = 'block';
//     }
    
//     closeModal() {
//         document.getElementById('history-modal').style.display = 'none';
//     }
    
//     closePasswordModal() {
//         document.getElementById('password-modal').style.display = 'none';
//         document.getElementById('change-password-form').reset();
//         document.getElementById('password-message').innerHTML = '';
//     }
    
//     showMessage(message, type) {
//         this.messageContainer.innerHTML = `
//             <div class="message ${type}">
//                 ${message}
//             </div>
//         `;
        
//         // Auto hide after 5 seconds
//         setTimeout(() => {
//             this.messageContainer.innerHTML = '';
//         }, 5000);
//     }
    
//     showPasswordMessage(message, type) {
//         const container = document.getElementById('password-message');
//         container.innerHTML = `
//             <div class="message ${type}">
//                 ${message}
//             </div>
//         `;
//     }
    
//     clearMessages() {
//         this.messageContainer.innerHTML = '';
//     }
    
//     showLoading(show) {
//         this.loadingOverlay.style.display = show ? 'flex' : 'none';
//     }
    
//     checkUrlParams() {
//         const urlParams = new URLSearchParams(window.location.search);
//         const message = urlParams.get('message');
//         const type = urlParams.get('type');
        
//         if (message) {
//             this.showMessage(decodeURIComponent(message), type || 'info');
//         }
//     }
// }

// // Initialize
// document.addEventListener('DOMContentLoaded', () => {
//     window.dashboard = new Dashboard();
// });

// // Global functions for onclick handlers
// function markAttendance(type) {
//     window.dashboard.markAttendance(type);
// }

// function showHistory(type) {
//     window.dashboard.showHistory(type);
// }

// function showChangePasswordModal() {
//     window.dashboard.showChangePasswordModal();
// }

// function closeModal() {
//     window.dashboard.closeModal();
// }

// function closePasswordModal() {
//     window.dashboard.closePasswordModal();
// }



// static/js/dashboard.js

let selectedAttendance = null;

function toggleMenu() {
    document.querySelector('.nav-menu').classList.toggle('active');
}

// Attendance Modal Functions
function openAttendanceModal() {
    document.getElementById('attendanceModal').classList.add('active');
}

function closeAttendanceModal() {
    document.getElementById('attendanceModal').classList.remove('active');
    selectedAttendance = null;
    document.querySelectorAll('.attendance-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    hideAttendanceMessage();
}

function selectAttendance(type) {
    selectedAttendance = type;
    document.querySelectorAll('.attendance-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    document.getElementById(`opt${type}`).classList.add('selected');
    
    // Show warning for WFO if not on office WiFi
    if (type === 'WFO' && !wifiStatus) {
        showAttendanceMessage('You are not connected to Office WiFi. WFO may not be allowed.', 'warning');
    } else {
        hideAttendanceMessage();
    }
}

async function submitAttendance() {
    if (!selectedAttendance) {
        showAttendanceMessage('Please select attendance type', 'error');
        return;
    }

    const btn = document.getElementById('submitAttendanceBtn');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner small"></span> Submitting...';

    try {
        const response = await fetch('/api/mark-attendance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: selectedAttendance
            })
        });

        const data = await response.json();

        if (data.success) {
            showAttendanceMessage(data.message, 'success');
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            showAttendanceMessage(data.message, 'error');
            btn.disabled = false;
            btn.innerHTML = 'Confirm Attendance';
            
            if (data.code === 'WIFI_REQUIRED') {
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        }
    } catch (error) {
        console.error('Error:', error);
        showAttendanceMessage('Network error. Please try again.', 'error');
        btn.disabled = false;
        btn.innerHTML = 'Confirm Attendance';
    }
}

function showAttendanceMessage(message, type) {
    const msgDiv = document.getElementById('attendanceMessage');
    msgDiv.style.display = 'block';
    msgDiv.className = `alert ${type}`;
    msgDiv.innerHTML = `
        <div class="alert-icon">${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : '❌'}</div>
        <div class="alert-content">
            <div class="alert-message">${message}</div>
        </div>
    `;
}

function hideAttendanceMessage() {
    document.getElementById('attendanceMessage').style.display = 'none';
}

// Work Log Functions
function openWorkLogModal() {
    document.getElementById('workLogModal').classList.add('active');
    updateCharCounter();
}

function closeWorkLogModal() {
    document.getElementById('workLogModal').classList.remove('active');
    document.getElementById('workDescription').value = '';
    document.getElementById('hoursWorked').value = '8';
    hideWorkLogMessage();
}

function updateCharCounter() {
    const desc = document.getElementById('workDescription').value;
    const counter = document.getElementById('charCounter');
    const length = desc.length;
    
    counter.textContent = `${length}/20 characters`;
    
    if (length < 20) {
        counter.className = 'char-counter warning';
    } else {
        counter.className = 'char-counter success';
    }
}

async function submitWorkLog() {
    const description = document.getElementById('workDescription').value.trim();
    const hours = document.getElementById('hoursWorked').value;

    if (!description) {
        showWorkLogMessage('Please enter work description', 'error');
        return;
    }

    if (description.length < 20) {
        showWorkLogMessage('Work description must be at least 20 characters', 'error');
        return;
    }

    const btn = document.getElementById('submitWorkLogBtn');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner small"></span> Submitting...';

    try {
        const response = await fetch('/api/submit-work-log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                work_description: description,
                hours_worked: hours
            })
        });

        const data = await response.json();

        if (data.success) {
            showWorkLogMessage(data.message, 'success');
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            showWorkLogMessage(data.message, 'error');
            btn.disabled = false;
            btn.innerHTML = 'Submit Work Log';
        }
    } catch (error) {
        console.error('Error:', error);
        showWorkLogMessage('Network error. Please try again.', 'error');
        btn.disabled = false;
        btn.innerHTML = 'Submit Work Log';
    }
}

function showWorkLogMessage(message, type) {
    const msgDiv = document.getElementById('workLogMessage');
    msgDiv.style.display = 'block';
    msgDiv.className = `alert ${type}`;
    msgDiv.innerHTML = `
        <div class="alert-icon">${type === 'success' ? '✅' : '❌'}</div>
        <div class="alert-content">
            <div class="alert-message">${message}</div>
        </div>
    `;
}

function hideWorkLogMessage() {
    document.getElementById('workLogMessage').style.display = 'none';
}

// Close modals when clicking outside
window.onclick = function(event) {
    const attendanceModal = document.getElementById('attendanceModal');
    const workLogModal = document.getElementById('workLogModal');
    
    if (event.target === attendanceModal) {
        closeAttendanceModal();
    }
    if (event.target === workLogModal) {
        closeWorkLogModal();
    }
}

// Auto-refresh status every minute
setInterval(async () => {
    try {
        const response = await fetch('/api/check-status');
        const data = await response.json();
        
        // Update UI if status changed
        if (data.attendance && data.attendance.marked && !todayAttendance?.marked) {
            window.location.reload();
        }
        if (data.work_log && data.work_log.submitted && !todayWorkLog?.submitted) {
            window.location.reload();
        }
    } catch (error) {
        console.error('Status check error:', error);
    }
}, 60000);