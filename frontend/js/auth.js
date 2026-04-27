const getCurrentUser = () => {
  const userRaw = localStorage.getItem('user');
  return userRaw ? JSON.parse(userRaw) : null;
};

const requireAuth = (allowedRoles = []) => {
  const token = localStorage.getItem('token');
  const user = getCurrentUser();

  if (!token || !user) {
    window.location.href = './login.html';
    return null;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    window.location.href = user.role === 'admin' ? './admin-dashboard.html' : './student-dashboard.html';
    return null;
  }

  return user;
};

const attachLogout = (buttonId = 'logout') => {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  btn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = './login.html';
  });
};
