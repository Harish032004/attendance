// static/js/script.js

class AttendanceSystem {
    constructor() {
        this.employeeId = '';
        this.employeeName = '';
        this.isValidEmployee = false;
        this.initialized = false;
        
        this.init();
    }
    
    init() {
        // Check if we're on the main page (not wifi error page)
        if (document.getElementById('employee-id')) {
            this.cacheElements();
            this.attachEventListeners();
            this.startClock();
            this.initialized = true;
        }
    }
    
    cacheElements() {
        this.employeeIdInput = document.getElementById('employee-id');
        this.idValidationMessage = document.getElementById('id-validation-message');
        this.employeeInfo = document.getElementById('employee-info');
        this.employeeNameDisplay = document.getElementById('employee-name');
        this.markButton = document.getElementById('mark-attendance-btn');
        this.messageContainer = document.getElementById('message-container');
        this.successOverlay = document.getElementById('success-overlay');
        this.todayStatus = document.getElementById('today-status');
    }
    
    attachEventListeners() {
        // Employee ID input with debounce
        let debounceTimer;
        this.employeeIdInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => this.validateEmployeeId(e.target.value), 500);
        });
        
        // Mark attendance button
        this.markButton.addEventListener('click', () => this.markAttendance());
    }
    
    startClock() {
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000);
    }
    
    updateDateTime() {
        const now = new Date();
        
        // Update date
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateElement.textContent = now.toLocaleDateString('en-US', options);
        }
        
        // Update time
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            timeElement.textContent = now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
            });
        }
    }
    
    async validateEmployeeId(employeeId) {
        // Clear previous messages
        this.clearMessages();
        
        if (!employeeId || employeeId.length === 0) {
            this.showValidationMessage('Please enter Employee ID', 'error');
            this.resetEmployeeInfo();
            this.markButton.disabled = true;
            return;
        }
        
        // Show loading state
        this.showValidationMessage('Validating...', 'info');
        
        try {
            const response = await fetch('/api/validate-employee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ employee_id: employeeId })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                if (data.valid) {
                    this.employeeId = employeeId;
                    this.employeeName = data.name;
                    this.isValidEmployee = true;
                    
                    this.showValidationMessage('✓ Employee ID verified', 'success');
                    this.employeeIdInput.classList.remove('error');
                    this.employeeIdInput.classList.add('success');
                    
                    // Show employee name
                    this.employeeNameDisplay.textContent = data.name;
                    this.employeeInfo.style.display = 'block';
                    
                    // Check if attendance already marked today
                    this.checkTodayAttendance(employeeId);
                    
                    this.markButton.disabled = false;
                } else {
                    this.showValidationMessage(data.message || 'Invalid Employee ID', 'error');
                    this.resetEmployeeInfo();
                    this.markButton.disabled = true;
                }
            } else {
                this.handleApiError(data);
            }
        } catch (error) {
            console.error('Validation error:', error);
            this.showValidationMessage('Network error. Please try again.', 'error');
            this.resetEmployeeInfo();
            this.markButton.disabled = true;
        }
    }
    
    async checkTodayAttendance(employeeId) {
        try {
            const response = await fetch(`/api/attendance-status/${employeeId}`);
            const data = await response.json();
            
            if (response.ok) {
                if (data.marked_today) {
                    this.showMessage(
                        `⚠️ Attendance already marked today at ${data.time}`,
                        'warning'
                    );
                    this.markButton.disabled = true;
                } else {
                    this.todayStatus.style.display = 'none';
                }
            }
        } catch (error) {
            console.error('Error checking attendance:', error);
        }
    }
    
  async markAttendance() {
    if (!this.isValidEmployee) {
        this.showMessage('Please enter a valid Employee ID', 'error');
        return;
    }
    
    // Disable button
    this.markButton.disabled = true;
    this.markButton.innerHTML = '<span class="spinner"></span> Processing...';
    
    try {
        const response = await fetch('/api/mark-attendance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                employee_id: this.employeeId,
                employee_name: this.employeeName
            })
        });
        
        const data = await response.json();
        console.log("Response:", data);
        
        if (!data.success && data.already_marked) {
            this.showMessage(`⚠️ ${data.message}`, 'warning');
            this.markButton.disabled = false;
            this.markButton.textContent = 'Mark Attendance';
        }
        else if (data.success) {
            this.showSuccessAnimation();
            this.showMessage(`✅ ${data.message}`, 'success');
            
            setTimeout(() => {
                this.resetForm();
            }, 3000);
        } else {
            this.showMessage(`❌ ${data.message || 'Error'}`, 'error');
            this.markButton.disabled = false;
            this.markButton.textContent = 'Mark Attendance';
        }
    } catch (error) {
        console.error('Error:', error);
        this.showMessage('❌ Network error', 'error');
        this.markButton.disabled = false;
        this.markButton.textContent = 'Mark Attendance';
    }
}  
    showSuccessAnimation() {
        this.successOverlay.style.display = 'flex';
        
        setTimeout(() => {
            this.successOverlay.style.display = 'none';
        }, 2000);
    }
    
    showMessage(message, type) {
        this.messageContainer.innerHTML = `
            <div class="message ${type}">
                ${message}
            </div>
        `;
    }
    
    showValidationMessage(message, type) {
        this.idValidationMessage.innerHTML = message;
        this.idValidationMessage.className = `validation-message ${type}`;
    }
    
    clearMessages() {
        this.idValidationMessage.innerHTML = '';
        this.messageContainer.innerHTML = '';
    }
    
    resetEmployeeInfo() {
        this.employeeInfo.style.display = 'none';
        this.employeeNameDisplay.textContent = '';
        this.employeeId = '';
        this.employeeName = '';
        this.isValidEmployee = false;
        this.employeeIdInput.classList.remove('success', 'error');
    }
    
    resetForm() {
        this.employeeIdInput.value = '';
        this.resetEmployeeInfo();
        this.markButton.disabled = true;
        this.markButton.textContent = 'Mark Attendance';
        this.todayStatus.style.display = 'none';
    }
    
    handleApiError(data) {
        if (data.code === 'WIFI_REQUIRED') {
            this.showMessage('Please connect to Office WiFi', 'error');
            // Redirect to refresh page and show wifi error
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            this.showMessage(data.error || 'Server error', 'error');
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AttendanceSystem();
});