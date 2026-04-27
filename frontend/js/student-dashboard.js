const user = requireAuth(['student']);
if (user) {
  attachLogout();
  document.getElementById('student-name').textContent = `${user.name} (${user.email})`;
  document.getElementById('interests').textContent =
    user.interests.length > 0 ? user.interests.join(', ') : 'No interests added';
  document.getElementById('completed').textContent =
    user.completedCourses.length > 0 ? user.completedCourses.join(', ') : 'No courses completed';

  // Edit Interests Logic
  const editBtn = document.getElementById('edit-interests-btn');
  const interestsDisplay = document.getElementById('interests-display');
  const interestsEdit = document.getElementById('interests-edit');
  const interestsInput = document.getElementById('interests-input');
  const saveBtn = document.getElementById('save-interests-btn');
  const cancelBtn = document.getElementById('cancel-interests-btn');

  editBtn.addEventListener('click', () => {
    interestsDisplay.style.display = 'none';
    interestsEdit.style.display = 'flex';
    editBtn.style.display = 'none';
    interestsInput.value = user.interests.join(', ');
  });

  cancelBtn.addEventListener('click', () => {
    interestsDisplay.style.display = 'block';
    interestsEdit.style.display = 'none';
    editBtn.style.display = 'flex';
  });

  saveBtn.addEventListener('click', async () => {
    const newInterestsStr = interestsInput.value;
    const newInterests = newInterestsStr.split(',').map(s => s.trim()).filter(s => s !== '');
    
    try {
      saveBtn.textContent = 'Saving...';
      const response = await apiRequest(`/students/${user.id}/interests`, {
        method: 'PUT',
        body: JSON.stringify({ interests: newInterests })
      });
      
      user.interests = response.interests;
      localStorage.setItem('user', JSON.stringify(user));
      
      document.getElementById('interests').textContent =
        user.interests.length > 0 ? user.interests.join(', ') : 'No interests added';
        
      interestsDisplay.style.display = 'block';
      interestsEdit.style.display = 'none';
      editBtn.style.display = 'flex';
      
      loadRecommendations();
    } catch (error) {
      alert(error.message);
    } finally {
      saveBtn.textContent = 'Save';
    }
  });

  const recommendationsEl = document.getElementById('recommendations');

  const loadRecommendations = async () => {
    try {
      const data = await apiRequest(`/recommendations/${user.id}`);
      recommendationsEl.innerHTML = '';

      data.recommendations.forEach((item) => {
        const card = document.createElement('article');
        card.className = 'card recommendation-card';

        const chipHtml = item.prerequisites.length > 0
          ? item.prerequisites.map(p => `<span class="chip">${p}</span>`).join('')
          : '<span class="chip muted">No prerequisites</span>';

        card.innerHTML = `
          <h4>${item.name}</h4>
          <div>
            <span class="chip">${item.category}</span>
            <span class="chip">${item.difficultyLevel}</span>
          </div>
          <div>
            <span class="profile-label">Prerequisites</span>
            <p class="muted" style="margin: 0.3rem 0 0;">${chipHtml}</p>
          </div>
          <p class="${item.eligible ? 'eligible' : 'not-eligible'}" style="margin: 0.5rem 0 0;">
            ${item.eligible ? '✓ Eligible' : '✗ Not Eligible'}
          </p>
          <p class="muted" style="margin: 0.3rem 0 0; font-size: 0.9rem;">${item.reason}</p>
        `;

        const btn = document.createElement('button');
        btn.style.marginTop = '0.8rem';
        btn.addEventListener('click', async () => {
          try {
            const response = await apiRequest(`/students/${user.id}/select-course`, {
              method: 'POST',
              body: JSON.stringify({ courseName: item.name })
            });
            alert(response.message);
            loadRecommendations();
          } catch (error) {
            alert(error.message);
          }
        });

        if (item.eligible) {
          btn.className = 'btn';
          btn.textContent = 'Select Course';
        } else {
          btn.className = 'btn btn-outline';
          btn.textContent = 'Join Anyway';
          btn.style.background = 'transparent';
          btn.style.borderColor = 'var(--danger)';
          btn.style.color = 'var(--danger)';
        }
        
        card.appendChild(btn);

        recommendationsEl.appendChild(card);
      });

      if (data.recommendations.length === 0) {
        recommendationsEl.innerHTML = '<p class="centered-empty">No courses found yet. Ask admin to add courses.</p>';
      }
    } catch (error) {
      recommendationsEl.innerHTML = `<p class="not-eligible">${error.message}</p>`;
    }
  };

  loadRecommendations();
}
