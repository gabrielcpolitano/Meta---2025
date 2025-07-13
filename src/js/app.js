// Configurações do jogo
const TOTAL_CERTIFICATES = 27;
const XP_PER_CERTIFICATE = 100;
const TARGET_DATE = new Date('2025-08-31');

// Níveis do sistema RPG
const LEVELS = [
    { min: 0, max: 499, title: 'INICIANTE', color: '#8b4513' },
    { min: 500, max: 999, title: 'APRENDIZ', color: '#a0522d' },
    { min: 1000, max: 1499, title: 'AVENTUREIRO', color: '#cd853f' },
    { min: 1500, max: 1999, title: 'GUERREIRO', color: '#daa520' },
    { min: 2000, max: 2499, title: 'PALADINO', color: '#ffd700' },
    { min: 2500, max: 2699, title: 'MAGO', color: '#9370db' },
    { min: 2700, max: Infinity, title: 'ARQUIMAGO', color: '#4b0082' }
];

// Conquistas
const ACHIEVEMENTS = [
    { id: 'bronze', certificates: 5, title: 'BRONZE', icon: '🥉', description: 'Primeiros passos na jornada!' },
    { id: 'silver', certificates: 10, title: 'PRATA', icon: '🥈', description: 'Meio caminho andado!' },
    { id: 'gold', certificates: 20, title: 'OURO', icon: '🥇', description: 'Quase lá, aventureiro!' },
    { id: 'diamond', certificates: 27, title: 'DIAMANTE', icon: '💎', description: 'Lenda conquistada!' }
];

// Estado do jogo
let gameState = {
    completedCertificates: 0,
    unlockedAchievements: []
};

// Elementos do DOM
const elements = {
    completedCertificates: document.getElementById('completed-certificates'),
    progressBar: document.getElementById('progress-bar'),
    totalXp: document.getElementById('total-xp'),
    xpBar: document.getElementById('xp-bar'),
    userLevel: document.getElementById('user-level'),
    levelTitle: document.getElementById('level-title'),
    paceIcon: document.getElementById('pace-icon'),
    paceStatus: document.getElementById('pace-status'),
    paceDescription: document.getElementById('pace-description'),
    progressTrail: document.getElementById('progress-trail'),
    countdown: document.getElementById('countdown'),
    addButton: document.getElementById('add-certificate'),
    removeButton: document.getElementById('remove-certificate'),
    achievementModal: document.getElementById('achievement-modal'),
    achievementIcon: document.getElementById('achievement-icon'),
    achievementTitle: document.getElementById('achievement-title'),
    achievementDescription: document.getElementById('achievement-description'),
    closeModal: document.getElementById('close-modal'),
    backgroundMusic: document.getElementById('background-music'),
    audioToggle: document.getElementById('audio-toggle'),
    volumeSlider: document.getElementById('volume-slider')
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadGameState();
    initializeProgressTrail();
    updateDisplay();
    updateCountdown();
    initializeAudio();
    
    // Event listeners
    elements.addButton.addEventListener('click', addCertificate);
    elements.removeButton.addEventListener('click', removeCertificate);
    elements.closeModal.addEventListener('click', closeAchievementModal);
    elements.audioToggle.addEventListener('click', toggleAudio);
    elements.volumeSlider.addEventListener('input', updateVolume);
    
    // Atalhos de teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === '+' || e.key === '=') {
            e.preventDefault();
            addCertificate();
        } else if (e.key === '-') {
            e.preventDefault();
            removeCertificate();
        } else if (e.key === 'Escape') {
            closeAchievementModal();
        } else if (e.key === ' ') {
            e.preventDefault();
            toggleAudio();
        }
    });
    
    // Atualizar countdown a cada minuto
    setInterval(updateCountdown, 60000);
});

// Funções de áudio
function initializeAudio() {
    // Configurar volume inicial
    elements.backgroundMusic.volume = elements.volumeSlider.value / 100;
    
    // Tentar reproduzir automaticamente (pode ser bloqueado pelo navegador)
    elements.backgroundMusic.play().catch(function(error) {
        console.log('Autoplay foi bloqueado pelo navegador:', error);
    });
    
    // Atualizar botão baseado no estado da música
    elements.backgroundMusic.addEventListener('play', function() {
        elements.audioToggle.textContent = '⏸️ PAUSAR';
        elements.audioToggle.classList.add('playing');
    });
    
    elements.backgroundMusic.addEventListener('pause', function() {
        elements.audioToggle.textContent = '▶️ TOCAR';
        elements.audioToggle.classList.remove('playing');
    });
}

function toggleAudio() {
    if (elements.backgroundMusic.paused) {
        elements.backgroundMusic.play().catch(function(error) {
            console.log('Erro ao reproduzir áudio:', error);
        });
    } else {
        elements.backgroundMusic.pause();
    }
}

function updateVolume() {
    elements.backgroundMusic.volume = elements.volumeSlider.value / 100;
}

// Carregar estado do jogo
function loadGameState() {
    const saved = localStorage.getItem('rpg-certificate-tracker');
    if (saved) {
        gameState = JSON.parse(saved);
    }
}

// Salvar estado do jogo
function saveGameState() {
    localStorage.setItem('rpg-certificate-tracker', JSON.stringify(gameState));
}

// Inicializar trilha de progresso
function initializeProgressTrail() {
    elements.progressTrail.innerHTML = '';
    
    for (let i = 1; i <= TOTAL_CERTIFICATES; i++) {
        const certificate = document.createElement('div');
        certificate.className = 'certificate-pending w-16 h-16 rounded-lg flex items-center justify-center text-lg font-bold transition-all duration-500 hover:scale-105 cursor-pointer';
        certificate.textContent = i;
        certificate.id = `certificate-${i}`;
        
        // Adicionar evento de clique para alternar estado
        certificate.addEventListener('click', () => toggleCertificate(i));
        
        elements.progressTrail.appendChild(certificate);
    }
}

// Alternar estado do certificado
function toggleCertificate(number) {
    const certificate = document.getElementById(`certificate-${number}`);
    const isCompleted = certificate.classList.contains('certificate-completed');
    
    if (isCompleted) {
        // Remover certificado
        certificate.classList.remove('certificate-completed');
        certificate.classList.add('certificate-pending');
        certificate.innerHTML = number;
        gameState.completedCertificates--;
    } else {
        // Adicionar certificado
        certificate.classList.remove('certificate-pending');
        certificate.classList.add('certificate-completed');
        certificate.innerHTML = '✓';
        gameState.completedCertificates++;
        
        // Verificar conquistas
        checkAchievements();
    }
    
    saveGameState();
    updateDisplay();
}

// Adicionar certificado
function addCertificate() {
    if (gameState.completedCertificates < TOTAL_CERTIFICATES) {
        gameState.completedCertificates++;
        
        // Atualizar visual do certificado
        const certificate = document.getElementById(`certificate-${gameState.completedCertificates}`);
        certificate.classList.remove('certificate-pending');
        certificate.classList.add('certificate-completed');
        certificate.innerHTML = '✓';
        
        // Adicionar animação de conquista
        certificate.style.animation = 'achievement-shine 0.8s ease-out';
        setTimeout(() => {
            certificate.style.animation = '';
        }, 800);
        
        checkAchievements();
        saveGameState();
        updateDisplay();
    }
}

// Remover certificado
function removeCertificate() {
    if (gameState.completedCertificates > 0) {
        // Atualizar visual do certificado
        const certificate = document.getElementById(`certificate-${gameState.completedCertificates}`);
        certificate.classList.remove('certificate-completed');
        certificate.classList.add('certificate-pending');
        certificate.innerHTML = gameState.completedCertificates;
        
        gameState.completedCertificates--;
        saveGameState();
        updateDisplay();
    }
}

// Verificar conquistas
function checkAchievements() {
    ACHIEVEMENTS.forEach(achievement => {
        if (gameState.completedCertificates >= achievement.certificates && 
            !gameState.unlockedAchievements.includes(achievement.id)) {
            
            gameState.unlockedAchievements.push(achievement.id);
            showAchievementModal(achievement);
            updateAchievementDisplay(achievement.id);
        }
    });
}

// Mostrar modal de conquista
function showAchievementModal(achievement) {
    elements.achievementIcon.textContent = achievement.icon;
    elements.achievementTitle.textContent = `CONQUISTA ${achievement.title}!`;
    elements.achievementDescription.textContent = achievement.description;
    
    elements.achievementModal.classList.remove('hidden');
    elements.achievementModal.classList.add('flex');
    
    // Adicionar efeito de confete
    createConfetti();
}

// Fechar modal de conquista
function closeAchievementModal() {
    elements.achievementModal.classList.add('hidden');
    elements.achievementModal.classList.remove('flex');
}

// Atualizar display da conquista
function updateAchievementDisplay(achievementId) {
    const achievementElement = document.getElementById(`achievement-${achievementId}`);
    if (achievementElement) {
        achievementElement.classList.remove('achievement-locked');
        achievementElement.classList.add('achievement-unlocked');
        
        const statusElement = achievementElement.querySelector('.achievement-status');
        if (statusElement) {
            statusElement.textContent = 'DESBLOQUEADO';
        }
    }
}

// Criar efeito de confete
function createConfetti() {
    const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 90 + 5 + '%';
            confetti.style.top = '-10px';
            confetti.style.width = '8px';
            confetti.style.height = '8px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.borderRadius = '50%';
            
            document.body.appendChild(confetti);
            
            // Animação de queda
            let pos = -10;
            let rotation = 0;
            const fallSpeed = Math.random() * 3 + 2;
            const rotationSpeed = Math.random() * 10 + 5;
            
            const fall = setInterval(() => {
                pos += fallSpeed;
                rotation += rotationSpeed;
                confetti.style.top = pos + 'px';
                confetti.style.transform = `rotate(${rotation}deg)`;
                
                if (pos > window.innerHeight + 50) {
                    clearInterval(fall);
                    if (document.body.contains(confetti)) {
                        document.body.removeChild(confetti);
                    }
                }
            }, 16);
        }, i * 50);
    }
}

// Calcular nível atual
function getCurrentLevel() {
    const totalXp = gameState.completedCertificates * XP_PER_CERTIFICATE;
    
    for (let i = 0; i < LEVELS.length; i++) {
        if (totalXp >= LEVELS[i].min && totalXp <= LEVELS[i].max) {
            return { level: i + 1, ...LEVELS[i] };
        }
    }
    
    return { level: LEVELS.length, ...LEVELS[LEVELS.length - 1] };
}

// Calcular ritmo de progresso
function calculatePace() {
    const now = new Date();
    const daysRemaining = Math.ceil((TARGET_DATE - now) / (1000 * 60 * 60 * 24));
    const expectedCertificates = Math.max(0, TOTAL_CERTIFICATES - Math.floor(daysRemaining / 2));
    
    if (gameState.completedCertificates > expectedCertificates) {
        return {
            status: 'ADIANTADO',
            icon: '✅',
            description: `${gameState.completedCertificates - expectedCertificates} pergaminho(s) à frente!`,
            class: 'status-advanced'
        };
    } else if (gameState.completedCertificates === expectedCertificates) {
        return {
            status: 'EM DIA',
            icon: '🟡',
            description: 'Mantendo o ritmo ideal',
            class: 'status-ontime'
        };
    } else {
        return {
            status: 'ATRASADO',
            icon: '❌',
            description: `${expectedCertificates - gameState.completedCertificates} pergaminho(s) em atraso`,
            class: 'status-behind'
        };
    }
}

// Atualizar countdown
function updateCountdown() {
    const now = new Date();
    const timeRemaining = TARGET_DATE - now;
    const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
    
    if (daysRemaining > 0) {
        elements.countdown.textContent = `FALTAM ${daysRemaining} DIAS`;
    } else {
        elements.countdown.textContent = 'PRAZO EXPIRADO!';
        elements.countdown.style.color = '#dc143c';
    }
}

// Atualizar display principal
function updateDisplay() {
    // Certificados concluídos
    elements.completedCertificates.textContent = gameState.completedCertificates;
    
    // Barra de progresso dos pergaminhos
    const progressPercentage = (gameState.completedCertificates / TOTAL_CERTIFICATES) * 100;
    elements.progressBar.style.width = progressPercentage + '%';
    
    // XP e barra de XP
    const totalXp = gameState.completedCertificates * XP_PER_CERTIFICATE;
    elements.totalXp.textContent = totalXp;
    
    const currentLevel = getCurrentLevel();
    const xpInCurrentLevel = totalXp - currentLevel.min;
    const xpNeededForCurrentLevel = currentLevel.max - currentLevel.min;
    
    let xpPercentage = 0;
    if (currentLevel.max === Infinity) {
        // Se for o nível máximo (ARQUIMAGO), mostrar 100%
        xpPercentage = 100;
    } else {
        xpPercentage = (xpInCurrentLevel / xpNeededForCurrentLevel) * 100;
    }
    
    elements.xpBar.style.width = Math.min(Math.max(xpPercentage, 0), 100) + '%';
    
    // Nível
    elements.userLevel.textContent = currentLevel.level;
    elements.levelTitle.textContent = currentLevel.title;
    elements.levelTitle.parentElement.style.backgroundColor = currentLevel.color;
    
    // Ritmo
    const pace = calculatePace();
    elements.paceIcon.textContent = pace.icon;
    elements.paceStatus.textContent = pace.status;
    elements.paceDescription.textContent = pace.description;
    
    // Atualizar classes do card de progresso
    const paceCard = elements.paceStatus.closest('.parchment-card');
    paceCard.className = paceCard.className.replace(/status-\w+/g, '');
    paceCard.classList.add(pace.class);
    
    // Atualizar conquistas desbloqueadas
    gameState.unlockedAchievements.forEach(achievementId => {
        updateAchievementDisplay(achievementId);
    });
    
    // Atualizar certificados na trilha
    for (let i = 1; i <= gameState.completedCertificates; i++) {
        const certificate = document.getElementById(`certificate-${i}`);
        if (certificate && !certificate.classList.contains('certificate-completed')) {
            certificate.classList.remove('certificate-pending');
            certificate.classList.add('certificate-completed');
            certificate.innerHTML = '✓';
        }
    }
}

