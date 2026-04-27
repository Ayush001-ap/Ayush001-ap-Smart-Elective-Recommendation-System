const user = requireAuth(['student', 'admin']);

if (user) {
  attachLogout('logout');
  const coursesEl = document.getElementById('courses');
  const backLink = document.getElementById('back-link');

  backLink.href = user.role === 'admin' ? './admin-dashboard.html' : './student-dashboard.html';

  const loadCourses = async () => {
    try {
      const courses = await apiRequest('/courses');
      coursesEl.innerHTML = '';

      courses.forEach((course) => {
        const card = document.createElement('article');
        card.className = 'card course-card';
        
        const prerequisitesText = course.prerequisites.length > 0 
          ? course.prerequisites.join(', ')
          : 'None';

        card.innerHTML = `
          <h3>${course.name}</h3>
          <p>${course.description}</p>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <span class="chip">${course.category}</span>
            <span class="chip">${course.difficultyLevel}</span>
          </div>
          <div class="course-info">
            <span class="info-label">Prerequisites</span>
            <p class="info-value">${prerequisitesText}</p>
          </div>
        `;

        if (user.role === 'admin') {
          const actionsDiv = document.createElement('div');
          actionsDiv.className = 'card-actions';
          
          const editBtn = document.createElement('button');
          editBtn.className = 'btn btn-outline';
          editBtn.textContent = 'Update';
          editBtn.addEventListener('click', async () => {
            const updatedDescription = prompt('Update description:', course.description);
            if (updatedDescription === null) return;

            const updatedCategory = prompt('Update category:', course.category);
            if (updatedCategory === null) return;

            const updatedDifficulty = prompt(
              'Update difficulty (Beginner/Intermediate/Advanced):',
              course.difficultyLevel
            );
            if (updatedDifficulty === null) return;

            const updatedPrerequisites = prompt(
              'Update prerequisites (comma separated):',
              course.prerequisites.join(', ')
            );
            if (updatedPrerequisites === null) return;

            try {
              await apiRequest(`/courses/${course._id}`, {
                method: 'PUT',
                body: JSON.stringify({
                  description: updatedDescription.trim(),
                  category: updatedCategory.trim(),
                  difficultyLevel: updatedDifficulty.trim(),
                  prerequisites: updatedPrerequisites
                    .split(',')
                    .map((item) => item.trim())
                    .filter(Boolean)
                })
              });
              loadCourses();
            } catch (error) {
              alert(error.message);
            }
          });

          const deleteBtn = document.createElement('button');
          deleteBtn.className = 'btn danger';
          deleteBtn.textContent = 'Delete';
          deleteBtn.addEventListener('click', async () => {
            if (confirm(`Are you sure you want to delete "${course.name}"?`)) {
              try {
                await apiRequest(`/courses/${course._id}`, { method: 'DELETE' });
                loadCourses();
              } catch (error) {
                alert(error.message);
              }
            }
          });
          
          actionsDiv.appendChild(editBtn);
          actionsDiv.appendChild(deleteBtn);
          card.appendChild(actionsDiv);
        }

        coursesEl.appendChild(card);
      });

      if (courses.length === 0) {
        coursesEl.innerHTML = '<p class="centered-empty">No courses available right now. Ask admin to add courses.</p>';
      }
    } catch (error) {
      coursesEl.innerHTML = `<p class="not-eligible">${error.message}</p>`;
    }
  };

  loadCourses();
}
