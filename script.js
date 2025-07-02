function renderizarTarefas() {
  for (const [semana, tarefas] of Object.entries(tarefasPorSemana)) {
    const container = document.getElementById(`${semana}-tarefas`);
    if (container) {
      tarefas.forEach(tarefa => {
        const item = document.createElement('div');
        item.className = 'checkbox-item p-3 rounded-lg border border-gray-300 bg-white';

        item.innerHTML = `
          <label class="flex items-center cursor-pointer">
            <input type="checkbox" data-id="${tarefa.id}" class="mr-4 w-5 h-5 text-blue-600 rounded focus:ring-blue-500">
            <span class="text-gray-800">${tarefa.texto}</span>
          </label>
        `;

        container.appendChild(item);
      });
    }
  }
}



// LocalStorage functionality for checkboxes
class ChecklistManager {
  constructor() {
    this.init();
  }

  init() {
    this.loadCheckboxStates();
    this.attachEventListeners();
    this.updateProgress();
  }

  loadCheckboxStates() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      const id = checkbox.getAttribute('data-id');
      const isChecked = localStorage.getItem(`checkbox_${id}`) === 'true';
      checkbox.checked = isChecked;
      this.updateCheckboxStyle(checkbox);
    });
  }

  attachEventListeners() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        localStorage.setItem(`checkbox_${id}`, e.target.checked);
        this.updateCheckboxStyle(e.target);
        this.updateProgress();
      });
    });
  }

  updateCheckboxStyle(checkbox) {
    const listItem = checkbox.closest('.checkbox-item');
    if (listItem) {
      if (checkbox.checked) {
        listItem.classList.add('completed');
      } else {
        listItem.classList.remove('completed');
      }
    }
  }

  updateProgress() {
    this.updateGeneralProgress();
    this.updatePlanProgress();
    this.updateWeeklyProgress();
  }

  updateGeneralProgress() {
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const percentage = Math.round((checkedBoxes.length / allCheckboxes.length) * 100);

    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    if (progressBar && progressText) {
      progressBar.style.width = `${percentage}%`;
      progressText.textContent = `${percentage}%`;
    }
  }

  updatePlanProgress() {
    const planCheckboxes = document.querySelectorAll('#checklist input[type="checkbox"]');
    const planCheckedBoxes = document.querySelectorAll('#checklist input[type="checkbox"]:checked');
    const percentage = Math.round((planCheckedBoxes.length / planCheckboxes.length) * 100);

    const planProgressBar = document.getElementById('plan-progress-bar');
    const planProgressText = document.getElementById('plan-progress-text');

    if (planProgressBar && planProgressText) {
      planProgressBar.style.width = `${percentage}%`;
      planProgressText.textContent = `${planCheckedBoxes.length}/${planCheckboxes.length}`;
    }
  }

  updateWeeklyProgress() {
    // Semana 1
    const semana1Checkboxes = document.querySelectorAll('input[data-id^="semana1-"]');
    const semana1Checked = document.querySelectorAll('input[data-id^="semana1-"]:checked');
    const semana1Progress = document.getElementById('week1-progress');
    if (semana1Progress) {
      semana1Progress.textContent = `${semana1Checked.length}/${semana1Checkboxes.length}`;
    }

    // Semana 2
    const semana2Checkboxes = document.querySelectorAll('input[data-id^="semana2-"]');
    const semana2Checked = document.querySelectorAll('input[data-id^="semana2-"]:checked');
    const semana2Progress = document.getElementById('week2-progress');
    if (semana2Progress) {
      semana2Progress.textContent = `${semana2Checked.length}/${semana2Checkboxes.length}`;
    }

    // Semana 3
    const semana3Checkboxes = document.querySelectorAll('input[data-id^="semana3-"]');
    const semana3Checked = document.querySelectorAll('input[data-id^="semana3-"]:checked');
    const semana3Progress = document.getElementById('week3-progress');
    if (semana3Progress) {
      semana3Progress.textContent = `${semana3Checked.length}/${semana3Checkboxes.length}`;
    }

    // Semana 4
    const semana4Checkboxes = document.querySelectorAll('input[data-id^="semana4-"]');
    const semana4Checked = document.querySelectorAll('input[data-id^="semana4-"]:checked');
    const semana4Progress = document.getElementById('week4-progress');
    if (semana4Progress) {
      semana4Progress.textContent = `${semana4Checked.length}/${semana4Checkboxes.length}`;
    }
  }
}

// Initialize the checklist manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
  renderizarTarefas();
  new ChecklistManager();
});