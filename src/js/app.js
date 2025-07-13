
// Configurações do jogo
const TOTAL_CERTIFICATES = 27;
const XP_PER_CERTIFICATE = 100;
const TARGET_DATE = new Date('2025-08-31');

// Níveis do sistema RPG
const LEVELS = [
    { min: 0, max: 499, title: 'INICIANTE', color: '#8b4513', level: 1 },
    { min: 500, max: 999, title: 'APRENDIZ', color: '#a0522d', level: 2 },
    { min: 1000, max: 1499, title: 'AVENTUREIRO', color: '#cd853f', level: 3 },
    { min: 1500, max: 1999, title: 'GUERREIRO', color: '#daa520', level: 4 },
    { min: 2000, max: 2499, title: 'PALADINO', color: '#ffd700', level: 5 },
    { min: 2500, max: 2699, title: 'MAGO', color: '#9370db', level: 6 },
    { min: 2700, max: Infinity, title: 'ARQUIMAGO', color: '#4b0082', level: 7 }
];

// Conquistas
const ACHIEVEMENTS = [
    { id: 'bronze', certificates: 5, title: 'BRONZE', icon: '🥉', description: 'Primeiros passos na jornada!', xp: 50 },
    { id: 'silver', certificates: 10, title: 'PRATA', icon: '🥈', description: 'Meio caminho andado!', xp: 100 },
    { id: 'gold', certificates: 20, title: 'OURO', icon: '🥇', description: 'Quase lá, aventureiro!', xp: 200 },
    { id: 'diamond', certificates: 27, title: 'DIAMANTE', icon: '💎', description: 'Lenda conquistada!', xp: 500 }
];

// Estado do jogo
let gameState = {
    completedCertificates: 0,
    unlockedAchievements: [],
    totalXp: 0,
    bonusXp: 0,
    startDate: new Date().toISOString(),
    streak: 0,
    lastActivity: null
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
    
    // Verificar streak
    checkStreak();
});

// Funções de áudio
function initializeAudio() {
    elements.backgroundMusic.volume = elements.volumeSlider.value / 100;
    
    elements.backgroundMusic.addEventListener('play', function() {
        elements.audioToggle.textContent = '⏸️ PAUSAR';
        elements.audioToggle.classList.add('playing');
    });
    
    elements.backgroundMusic.addEventListener('pause', function() {
        elements.audioToggle.textContent = '▶️ TOCAR';
        elements.audioToggle.classList.remove('playing');
    });
    
    elements.backgroundMusic.addEventListener('error', function() {
        console.log('Erro ao carregar áudio de fundo');
        elements.audioToggle.style.display = 'none';
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
        try {
            const loadedState = JSON.parse(saved);
            gameState = { ...gameState, ...loadedState };
            
            // Migração de dados antigos
            if (typeof gameState.totalXp === 'undefined') {
                gameState.totalXp = gameState.completedCertificates * XP_PER_CERTIFICATE;
            }
            if (typeof gameState.bonusXp === 'undefined') {
                gameState.bonusXp = 0;
            }
        } catch (error) {
            console.error('Erro ao carregar estado do jogo:', error);
            gameState = {
                completedCertificates: 0,
                unlockedAchievements: [],
                totalXp: 0,
                bonusXp: 0,
                startDate: new Date().toISOString(),
                streak: 0,
                lastActivity: null
            };
        }
    }
}

// Salvar estado do jogo
function saveGameState() {
    try {
        localStorage.setItem('rpg-certificate-tracker', JSON.stringify(gameState));
    } catch (error) {
        console.error('Erro ao salvar estado do jogo:', error);
    }
}

// Verificar streak
function checkStreak() {
    const today = new Date().toDateString();
    const lastActivity = gameState.lastActivity ? new Date(gameState.lastActivity).toDateString() : null;
    
    if (lastActivity !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastActivity === yesterday.toDateString()) {
            // Continua o streak
        } else if (lastActivity !== null) {
            // Quebrou o streak
            gameState.streak = 0;
        }
    }
}

// Inicializar trilha de progresso
function initializeProgressTrail() {
    if (!elements.progressTrail) return;
    
    elements.progressTrail.innerHTML = '';
    
    for (let i = 1; i <= TOTAL_CERTIFICATES; i++) {
        const certificate = document.createElement('div');
        certificate.className = 'certificate-pending w-16 h-16 rounded-lg flex items-center justify-center text-lg font-bold transition-all duration-500 hover:scale-105 cursor-pointer';
        certificate.textContent = i;
        certificate.id = `certificate-${i}`;
        certificate.title = `Pergaminho ${i}`;
        
        // Adicionar evento de clique para alternar estado
        certificate.addEventListener('click', () => toggleCertificate(i));
        
        elements.progressTrail.appendChild(certificate);
    }
}

// Alternar estado do certificado
function toggleCertificate(number) {
    const certificate = document.getElementById(`certificate-${number}`);
    if (!certificate) return;
    
    const isCompleted = certificate.classList.contains('certificate-completed');
    
    if (isCompleted) {
        // Remover certificado
        certificate.classList.remove('certificate-completed');
        certificate.classList.add('certificate-pending');
        certificate.innerHTML = number;
        
        if (gameState.completedCertificates > 0) {
            gameState.completedCertificates--;
            gameState.totalXp = Math.max(0, gameState.totalXp - XP_PER_CERTIFICATE);
        }
    } else {
        // Adicionar certificado
        certificate.classList.remove('certificate-pending');
        certificate.classList.add('certificate-completed');
        certificate.innerHTML = '✓';
        
        gameState.completedCertificates++;
        gameState.totalXp += XP_PER_CERTIFICATE;
        gameState.lastActivity = new Date().toISOString();
        
        // Verificar conquistas
        checkAchievements();
        
        // Efeito visual
        certificate.style.animation = 'achievement-appear 0.8s ease-out';
        setTimeout(() => {
            certificate.style.animation = '';
        }, 800);
    }
    
    saveGameState();
    updateDisplay();
}

// Adicionar certificado
function addCertificate() {
    if (gameState.completedCertificates < TOTAL_CERTIFICATES) {
        const nextCertificate = gameState.completedCertificates + 1;
        const certificate = document.getElementById(`certificate-${nextCertificate}`);
        
        if (certificate) {
            certificate.classList.remove('certificate-pending');
            certificate.classList.add('certificate-completed');
            certificate.innerHTML = '✓';
            
            // Animação especial
            certificate.style.animation = 'achievement-appear 0.8s ease-out';
            setTimeout(() => {
                certificate.style.animation = '';
            }, 800);
        }
        
        gameState.completedCertificates++;
        gameState.totalXp += XP_PER_CERTIFICATE;
        gameState.lastActivity = new Date().toISOString();
        
        // Verificar streak
        const today = new Date().toDateString();
        const lastActivity = gameState.lastActivity ? new Date(gameState.lastActivity).toDateString() : null;
        
        if (lastActivity !== today) {
            gameState.streak++;
        }
        
        checkAchievements();
        saveGameState();
        updateDisplay();
    }
}

// Remover certificado
function removeCertificate() {
    if (gameState.completedCertificates > 0) {
        const certificate = document.getElementById(`certificate-${gameState.completedCertificates}`);
        
        if (certificate) {
            certificate.classList.remove('certificate-completed');
            certificate.classList.add('certificate-pending');
            certificate.innerHTML = gameState.completedCertificates;
        }
        
        gameState.completedCertificates--;
        gameState.totalXp = Math.max(0, gameState.totalXp - XP_PER_CERTIFICATE);
        
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
            gameState.bonusXp += achievement.xp;
            gameState.totalXp += achievement.xp;
            
            showAchievementModal(achievement);
            updateAchievementDisplay(achievement.id);
        }
    });
}

// Mostrar modal de conquista
function showAchievementModal(achievement) {
    if (!elements.achievementModal) return;
    
    elements.achievementIcon.textContent = achievement.icon;
    elements.achievementTitle.textContent = `CONQUISTA ${achievement.title}!`;
    elements.achievementDescription.textContent = `${achievement.description} +${achievement.xp} XP`;
    
    elements.achievementModal.classList.remove('hidden');
    elements.achievementModal.classList.add('flex');
    
    // Adicionar efeito de confete
    createConfetti();
    
    // Fechar automaticamente após 5 segundos
    setTimeout(() => {
        if (elements.achievementModal.classList.contains('flex')) {
            closeAchievementModal();
        }
    }, 5000);
}

// Fechar modal de conquista
function closeAchievementModal() {
    if (!elements.achievementModal) return;
    
    elements.achievementModal.classList.add('hidden');
    elements.achievementModal.classList.remove('flex');
}

// Atualizar display da conquista
function updateAchievementDisplay(achievementId) {
    const achievementElement = document.getElementById(`achievement-${achievementId}`);
    if (achievementElement) {
        achievementElement.classList.remove('achievement-locked');
        achievementElement.classList.add('achievement-unlocked');
        achievementElement.style.borderColor = '#ffd700';
        achievementElement.style.background = 'linear-gradient(135deg, #f4f1e8 0%, #fff9e6 100%)';
        achievementElement.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.3)';
        
        const statusElement = achievementElement.querySelector('.achievement-status');
        if (statusElement) {
            statusElement.textContent = 'DESBLOQUEADO';
            statusElement.style.color = '#ffd700';
            statusElement.style.fontWeight = 'bold';
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
            confetti.style.width = Math.random() * 6 + 4 + 'px';
            confetti.style.height = confetti.style.width;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.borderRadius = '50%';
            confetti.style.opacity = '0.9';
            
            document.body.appendChild(confetti);
            
            // Animação de queda
            let pos = -10;
            let rotation = 0;
            const fallSpeed = Math.random() * 3 + 2;
            const rotationSpeed = Math.random() * 10 + 5;
            const sway = Math.random() * 2 - 1;
            let leftPos = parseFloat(confetti.style.left);
            
            const fall = setInterval(() => {
                pos += fallSpeed;
                rotation += rotationSpeed;
                leftPos += sway * 0.5;
                
                confetti.style.top = pos + 'px';
                confetti.style.left = leftPos + '%';
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
    for (let i = 0; i < LEVELS.length; i++) {
        if (gameState.totalXp >= LEVELS[i].min && gameState.totalXp <= LEVELS[i].max) {
            return LEVELS[i];
        }
    }
    return LEVELS[LEVELS.length - 1];
}

// Calcular ritmo de progresso
function calculatePace() {
    const now = new Date();
    const totalDays = Math.ceil((TARGET_DATE - new Date(gameState.startDate)) / (1000 * 60 * 60 * 24));
    const daysElapsed = Math.ceil((now - new Date(gameState.startDate)) / (1000 * 60 * 60 * 24));
    const expectedProgress = Math.max(0, (daysElapsed / totalDays) * TOTAL_CERTIFICATES);
    
    if (gameState.completedCertificates > expectedProgress + 2) {
        return {
            status: 'ADIANTADO',
            icon: '🚀',
            description: `${Math.floor(gameState.completedCertificates - expectedProgress)} pergaminho(s) à frente!`,
            class: 'status-advanced'
        };
    } else if (gameState.completedCertificates >= expectedProgress - 1) {
        return {
            status: 'EM DIA',
            icon: '⚡',
            description: 'Mantendo o ritmo ideal',
            class: 'status-ontime'
        };
    } else {
        return {
            status: 'ATRASADO',
            icon: '⏰',
            description: `${Math.ceil(expectedProgress - gameState.completedCertificates)} pergaminho(s) em atraso`,
            class: 'status-behind'
        };
    }
}

// Atualizar countdown
function updateCountdown() {
    if (!elements.countdown) return;
    
    const now = new Date();
    const timeRemaining = TARGET_DATE - now;
    const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
    
    if (daysRemaining > 0) {
        if (daysRemaining > 30) {
            const months = Math.floor(daysRemaining / 30);
            const days = daysRemaining % 30;
            elements.countdown.textContent = `${months}M ${days}D RESTANTES`;
        } else {
            elements.countdown.textContent = `${daysRemaining} DIAS RESTANTES`;
        }
        elements.countdown.style.color = daysRemaining < 30 ? '#ff6b6b' : '#ffd700';
    } else {
        elements.countdown.textContent = 'PRAZO EXPIRADO!';
        elements.countdown.style.color = '#dc143c';
    }
}

// Atualizar display principal
function updateDisplay() {
    try {
        // Certificados concluídos
        if (elements.completedCertificates) {
            elements.completedCertificates.textContent = gameState.completedCertificates;
        }
        
        // Barra de progresso dos pergaminhos
        if (elements.progressBar) {
            const progressPercentage = Math.min((gameState.completedCertificates / TOTAL_CERTIFICATES) * 100, 100);
            elements.progressBar.style.width = progressPercentage + '%';
        }
        
        // XP total
        if (elements.totalXp) {
            elements.totalXp.textContent = gameState.totalXp;
        }
        
        // Nível e barra de XP
        const currentLevel = getCurrentLevel();
        if (elements.userLevel) {
            elements.userLevel.textContent = currentLevel.level;
        }
        if (elements.levelTitle) {
            elements.levelTitle.textContent = currentLevel.title;
            const levelContainer = elements.levelTitle.parentElement;
            if (levelContainer) {
                levelContainer.style.backgroundColor = currentLevel.color;
            }
        }
        
        // Barra de XP
        if (elements.xpBar) {
            const xpInCurrentLevel = gameState.totalXp - currentLevel.min;
            const xpNeededForCurrentLevel = currentLevel.max - currentLevel.min;
            
            let xpPercentage = 0;
            if (currentLevel.max === Infinity) {
                xpPercentage = 100;
            } else if (xpNeededForCurrentLevel > 0) {
                xpPercentage = Math.min((xpInCurrentLevel / xpNeededForCurrentLevel) * 100, 100);
            }
            
            elements.xpBar.style.width = Math.max(xpPercentage, 0) + '%';
        }
        
        // Ritmo
        const pace = calculatePace();
        if (elements.paceIcon) elements.paceIcon.textContent = pace.icon;
        if (elements.paceStatus) elements.paceStatus.textContent = pace.status;
        if (elements.paceDescription) elements.paceDescription.textContent = pace.description;
        
        // Atualizar classes do card de progresso
        if (elements.paceStatus) {
            const paceCard = elements.paceStatus.closest('.parchment-card');
            if (paceCard) {
                paceCard.className = paceCard.className.replace(/status-\w+/g, '');
                paceCard.classList.add(pace.class);
            }
        }
        
        // Atualizar conquistas desbloqueadas
        gameState.unlockedAchievements.forEach(achievementId => {
            updateAchievementDisplay(achievementId);
        });
        
        // Atualizar certificados na trilha
        for (let i = 1; i <= TOTAL_CERTIFICATES; i++) {
            const certificate = document.getElementById(`certificate-${i}`);
            if (certificate) {
                if (i <= gameState.completedCertificates) {
                    if (!certificate.classList.contains('certificate-completed')) {
                        certificate.classList.remove('certificate-pending');
                        certificate.classList.add('certificate-completed');
                        certificate.innerHTML = '✓';
                    }
                } else {
                    if (!certificate.classList.contains('certificate-pending')) {
                        certificate.classList.remove('certificate-completed');
                        certificate.classList.add('certificate-pending');
                        certificate.innerHTML = i;
                    }
                }
            }
        }
    } catch (error) {
        console.error('Erro ao atualizar display:', error);
    }
}
