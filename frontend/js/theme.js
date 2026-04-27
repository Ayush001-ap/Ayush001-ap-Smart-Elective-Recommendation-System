const setTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);

  const button = document.getElementById('theme-toggle');
  if (button) {
    const iconSpan = button.querySelector('.material-icons');
    if (iconSpan) {
      iconSpan.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
      const textSpan = button.querySelector('span:not(.material-icons)');
      if (textSpan && textSpan.textContent.includes('Mode')) {
        textSpan.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
      }
    } else {
      button.innerHTML = `<span class="material-icons" style="display: flex; align-items: center; justify-content: center; font-size: 1.4rem;">${theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>`;
      button.style.padding = '0.5rem';
      button.style.display = 'flex';
      button.style.alignItems = 'center';
      button.style.justifyContent = 'center';
    }
  }
};

const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);

  const button = document.getElementById('theme-toggle');
  if (button) {
    button.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      setTheme(current === 'light' ? 'dark' : 'light');
    });
  }
};

initializeTheme();
