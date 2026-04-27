const signupForm = document.getElementById('signup-form');
const message = document.getElementById('message');

const toArray = (value) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

signupForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  message.textContent = '';
  message.className = 'status';

  const payload = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    password: document.getElementById('password').value,
    completedCourses: toArray(document.getElementById('completedCourses').value),
    interests: toArray(document.getElementById('interests').value)
  };

  try {
    const data = await apiRequest('/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.student));
    message.textContent = 'Registration successful. Redirecting...';
    message.className = 'status success';
    
    setTimeout(() => {
      window.location.href = './student-dashboard.html';
    }, 500);
  } catch (error) {
    message.textContent = error.message;
    message.className = 'status error';
  }
});
