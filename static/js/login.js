class LoginSystem {
    constructor() {
        this.form = document.getElementById('login-form');
        this.employeeId = document.getElementById('employee-id');
        this.password = document.getElementById('password');
        this.loginBtn = document.getElementById('login-btn');
        this.messageContainer = document.getElementById('message-container');
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleLogin(e));
        
        // Add input event listeners for real-time validation
        this.employeeId.addEventListener('input', () => this.clearMessages());
        this.password.addEventListener('input', () => this.clearMessages());
    }
    
    async handleLogin(e) {
        e.preventDefault();
        
        const employeeId = this.employeeId.value.trim();
        const password = this.password.value.trim();
        
        if (!employeeId || !password) {
            this.showMessage('Please enter both Employee ID and password', 'error');
            return;
        }
        
        this.setLoading(true);
        this.clearMessages();
        
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ employee_id: employeeId, password: password })
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                this.showMessage('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = data.redirect || '/dashboard';
                }, 1000);
            } else {
                this.showMessage(data.message || 'Login failed', 'error');
                this.setLoading(false);
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showMessage('Network error. Please try again.', 'error');
            this.setLoading(false);
        }
    }
    
    showMessage(message, type) {
        this.messageContainer.innerHTML = `
            <div class="message ${type}">
                ${message}
            </div>
        `;
    }
    
    clearMessages() {
        this.messageContainer.innerHTML = '';
    }
    
    setLoading(isLoading) {
        const btnText = this.loginBtn.querySelector('.btn-text');
        const spinner = this.loginBtn.querySelector('.spinner');
        
        if (isLoading) {
            btnText.style.display = 'none';
            spinner.style.display = 'inline-block';
            this.loginBtn.disabled = true;
        } else {
            btnText.style.display = 'inline';
            spinner.style.display = 'none';
            this.loginBtn.disabled = false;
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new LoginSystem();
});