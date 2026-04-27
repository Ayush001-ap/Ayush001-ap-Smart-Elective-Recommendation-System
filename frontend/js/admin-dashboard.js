const user = requireAuth(['admin']);

if (user) {
  attachLogout();

  const courseForm = document.getElementById('course-form');
  const courseMessage = document.getElementById('course-message');
  const analyticsEl = document.getElementById('analytics');
  const studentsEl = document.getElementById('students');

  const toArray = (value) =>
    value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

  const renderAnalytics = (analytics) => {
    analyticsEl.innerHTML = `
      <article class="card">
        <h4>📚 Total Students</h4>
        <p class="stat-value">${analytics.totalStudents}</p>
        <p class="muted">Currently registered accounts</p>
      </article>
      <article class="card">
        <h4>📖 Total Courses</h4>
        <p class="stat-value">${analytics.totalCourses}</p>
        <p class="muted">Courses in catalog</p>
      </article>
      <article class="card">
        <h4>👤 Total Admins</h4>
        <p class="stat-value">${analytics.totalAdmins}</p>
        <p class="muted">Admin accounts</p>
      </article>
      <article class="card">
        <h4>⭐ Top Recommended</h4>
        <p>${analytics.mostRecommended
          .slice(0, 2)
          .map((course) => `<strong>${course.name}</strong> (${course.recommendationCount})`)
          .join(' • ') || 'No data'}</p>
        <p class="muted">Most recommended courses</p>
      </article>
    `;
  };

  const loadAnalytics = async () => {
    try {
      const analytics = await apiRequest('/admin/analytics');
      renderAnalytics(analytics);
    } catch (error) {
      analyticsEl.innerHTML = `<p class="not-eligible">${error.message}</p>`;
    }
  };

  const loadStudents = async () => {
    try {
      const students = await apiRequest('/admin/students');
      studentsEl.innerHTML = '';
      students.forEach((student) => {
        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `
          <h4>${student.name}</h4>
          <p style="margin: 0.3rem 0; font-size: 0.9rem;"><strong>Email:</strong> ${student.email}</p>
          <p style="margin: 0.3rem 0; font-size: 0.85rem; color: var(--muted);">
            <span class="chip">${student.role}</span>
            ${student.interests.length > 0 ? '• Interests: ' + student.interests.join(', ') : ''}
          </p>
        `;
        studentsEl.appendChild(card);
      });

      if (students.length === 0) {
        studentsEl.innerHTML = '<p class="centered-empty">No students registered yet.</p>';
      }
    } catch (error) {
      studentsEl.innerHTML = `<p class="not-eligible">${error.message}</p>`;
    }
  };

  courseForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    courseMessage.textContent = '';

    const payload = {
      name: document.getElementById('name').value.trim(),
      category: document.getElementById('category').value.trim(),
      difficultyLevel: document.getElementById('difficultyLevel').value,
      prerequisites: toArray(document.getElementById('prerequisites').value),
      description: document.getElementById('description').value.trim()
    };

    try {
      await apiRequest('/courses', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      courseMessage.textContent = 'Course added successfully';
      courseForm.reset();
      loadAnalytics();
    } catch (error) {
      courseMessage.textContent = error.message;
    }
  });

  loadAnalytics();
  loadStudents();
}
