const loginForm = document.getElementById('login-form');
const message = document.getElementById('message');
const roleButtons = document.querySelectorAll('.role-btn');
const adminPasscodeWrap = document.getElementById('admin-passcode-wrap');
const adminPasscodeInput = document.getElementById('adminPasscode');
const passwordInput = document.getElementById('password');
const passwordToggle = document.getElementById('password-toggle');
const passcodeToggle = document.getElementById('passcode-toggle');

let selectedRole = 'student';

// Password visibility toggle
if (passwordToggle) {
  passwordToggle.addEventListener('click', (e) => {
    e.preventDefault();
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    passwordToggle.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
  });
}

if (passcodeToggle) {
  passcodeToggle.addEventListener('click', (e) => {
    e.preventDefault();
    const type = adminPasscodeInput.type === 'password' ? 'text' : 'password';
    adminPasscodeInput.type = type;
    passcodeToggle.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
  });
}

roleButtons.forEach((button) => {
  button.addEventListener('click', () => {
    selectedRole = button.dataset.role;

    roleButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    if (selectedRole === 'admin') {
      adminPasscodeWrap.classList.add('show');
      adminPasscodeInput.required = true;
    } else {
      adminPasscodeWrap.classList.remove('show');
      adminPasscodeInput.required = false;
      adminPasscodeInput.value = '';
    }
  });
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  message.textContent = '';
  message.className = 'status';

  const email = document.getElementById('email').value.trim();
  const password = passwordInput.value;
  const adminPasscode = adminPasscodeInput.value;

  try {
    const data = await apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role: selectedRole, adminPasscode })
    });

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.student));
    message.textContent = 'Login successful. Redirecting...';
    message.className = 'status success';

    setTimeout(() => {
      window.location.href = data.student.role === 'admin' ? './admin-dashboard.html' : './student-dashboard.html';
    }, 500);
  } catch (error) {
    message.textContent = error.message;
    message.className = 'status error';
  }
});

