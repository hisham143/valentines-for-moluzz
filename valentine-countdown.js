/* ============================================
   VALENTINE COUNTDOWN - INTERACTIVE LOGIC
   Date-based unlocking, animations, interactions
   ============================================ */

// Configuration
const VALENTINE_DAYS = [
    { day: 1, name: 'Teddy Day', date: '2026-02-10' },
    { day: 2, name: 'Promise Day', date: '2026-02-11' },
    { day: 3, name: 'Hug Day', date: '2026-02-12' },
    { day: 4, name: 'Kiss Day', date: '2026-02-13' },
    { day: 5, name: "Valentine's Day", date: '2026-02-14' }
];

// Global State
let appState = {
    currentDate: new Date(),
    unlockedDays: [],
    musicPlaying: false,
    kissCount: 0
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    updateCurrentDate();
    checkUnlockedDays();
    initializeMusic();
    setupInteractions();
    positionFloatingElements();
}

// ============================================
// DATE MANAGEMENT
// ============================================

function updateCurrentDate() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = today.toLocaleDateString('en-US', options);
    document.getElementById('currentDate').textContent = `Today: ${dateString}`;
    appState.currentDate = today;
}

function checkUnlockedDays() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    VALENTINE_DAYS.forEach(dayInfo => {
        const dayDate = new Date(dayInfo.date);
        dayDate.setHours(0, 0, 0, 0);

        // Testing mode - unlock all days (DISABLED):
        // appState.unlockedDays.push(dayInfo.day);
        // unlockDay(dayInfo.day);

        // Date-based unlock (ENABLED):
        if (dayDate <= today) {
            appState.unlockedDays.push(dayInfo.day);
            unlockDay(dayInfo.day);
        }
    });
}

function unlockDay(dayNum) {
    const card = document.getElementById(`day${dayNum}`);
    if (card) {
        card.classList.add('unlocked');
        card.classList.remove('locked');
    }
}

function lockDay(dayNum) {
    const card = document.getElementById(`day${dayNum}`);
    if (card) {
        card.classList.add('locked');
        card.classList.remove('unlocked');
    }
}

// ============================================
// MUSIC PLAYER
// ============================================

function initializeMusic() {
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');

    if (musicToggle) {
        musicToggle.addEventListener('click', () => {
            if (appState.musicPlaying) {
                bgMusic.pause();
                appState.musicPlaying = false;
                musicToggle.textContent = '🎵';
                musicToggle.classList.remove('playing');
            } else {
                bgMusic.play().catch(err => {
                    console.log('Autoplay prevented:', err);
                });
                appState.musicPlaying = true;
                musicToggle.textContent = '♪♪';
                musicToggle.classList.add('playing');
            }
        });
    }
}

// ============================================
// CARD INTERACTIONS
// ============================================

function setupInteractions() {
    // Day 1: Teddy interaction
    const teddyBear = document.getElementById('teddyBear');
    if (teddyBear) {
        teddyBear.addEventListener('click', (e) => {
            e.stopPropagation();
            triggerTeddyHug();
        });
    }

    // Day 2: Promise seal
    // Handled by onclick in HTML

    // Day 3: Hug interaction
    const day3Card = document.getElementById('day3');
    if (day3Card) {
        const cardContent = day3Card.querySelector('.card-content');
        let hugTimer = null;
        
        const handleMouseDown = () => {
            hugTimer = setTimeout(() => {
                triggerHug();
                hugTimer = null;
            }, 2000);
        };
        
        const handleMouseUp = () => {
            if (hugTimer) {
                clearTimeout(hugTimer);
                hugTimer = null;
            }
        };
        
        if (cardContent) {
            cardContent.addEventListener('mousedown', handleMouseDown);
            cardContent.addEventListener('mouseup', handleMouseUp);
            cardContent.addEventListener('mouseleave', handleMouseUp);
            cardContent.addEventListener('touchstart', handleMouseDown);
            cardContent.addEventListener('touchend', handleMouseUp);
        }
    }

    // Day 4: Kiss taps
    const kissCanvas = document.getElementById('kissCanvas');
    if (kissCanvas) {
        kissCanvas.addEventListener('click', (e) => {
            addKiss(e);
        });
    }
}

// ============================================
// DAY 1: TEDDY DAY INTERACTIONS
// ============================================

function triggerTeddyHug() {
    const teddyBear = document.getElementById('teddyBear');
    const msg = document.getElementById('msg1');

    // Add hug animation
    teddyBear.style.animation = 'none';
    setTimeout(() => {
        teddyBear.style.animation = 'teddyHug 0.6s ease-out';
    }, 10);

    // Show message after animation
    setTimeout(() => {
        if (msg) {
            msg.style.display = 'block';
        }
    }, 300);

    // Create heart burst
    createHeartBurst(teddyBear);
}

function createHeartBurst(element) {
    const rect = element.getBoundingClientRect();
    const hearts = ['❤️', '💕', '🌻'];
    
    for (let i = 0; i < 8; i++) {
        const heart = document.createElement('div');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.position = 'fixed';
        heart.style.left = rect.left + rect.width / 2 + 'px';
        heart.style.top = rect.top + rect.height / 2 + 'px';
        heart.style.fontSize = '1.5rem';
        heart.style.zIndex = '999';
        heart.style.pointerEvents = 'none';
        heart.style.animation = `burstOut 1s ease-out forwards`;
        document.body.appendChild(heart);

        // Remove after animation
        setTimeout(() => heart.remove(), 1000);
    }
}

// Burst animation CSS-in-JS
const burstStyle = document.createElement('style');
burstStyle.textContent = `
    @keyframes burstOut {
        0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(
                ${Math.random() * 100 - 50}px,
                ${Math.random() * -100}px
            ) scale(0);
        }
    }
`;
document.head.appendChild(burstStyle);

// ============================================
// DAY 2: PROMISE DAY INTERACTIONS
// ============================================

function sealPromise() {
    const msg = document.getElementById('msg2');
    const ring = document.querySelector('#day2 .promise-ring');

    if (ring) {
        ring.style.animation = 'none';
        setTimeout(() => {
            ring.style.animation = 'ringGlow 2s ease-in-out infinite';
        }, 10);
    }

    setTimeout(() => {
        if (msg) {
            msg.style.display = 'block';
        }
    }, 500);

    createConfetti();
}

function createConfetti() {
    const confetti = ['💕', '🌻', '💫'];
    for (let i = 0; i < 20; i++) {
        const piece = document.createElement('div');
        piece.textContent = confetti[Math.floor(Math.random() * confetti.length)];
        piece.style.position = 'fixed';
        piece.style.left = Math.random() * window.innerWidth + 'px';
        piece.style.top = '-30px';
        piece.style.fontSize = '1.5rem';
        piece.style.zIndex = '999';
        piece.style.pointerEvents = 'none';
        piece.style.animation = `fall ${2 + Math.random() * 2}s linear forwards`;
        document.body.appendChild(piece);

        setTimeout(() => piece.remove(), 4000);
    }
}

// ============================================
// DAY 3: HUG DAY INTERACTIONS
// ============================================

function triggerHug() {
    const hugProgress = document.getElementById('hugProgress');
    const msg = document.getElementById('msg3');
    
    if (hugProgress) {
        hugProgress.style.width = '100%';
    }

    setTimeout(() => {
        if (msg) {
            msg.style.display = 'block';
        }
    }, 300);
}

// ============================================
// DAY 4: KISS DAY INTERACTIONS
// ============================================

function addKiss(event) {
    const canvas = document.getElementById('kissCanvas');
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const kiss = document.createElement('div');
    kiss.textContent = '💋';
    kiss.style.position = 'absolute';
    kiss.style.left = x + 'px';
    kiss.style.top = y + 'px';
    kiss.style.fontSize = '1.5rem';
    kiss.style.animation = 'kissFloat 1.5s ease-out forwards';
    kiss.style.pointerEvents = 'none';
    
    canvas.appendChild(kiss);
    
    appState.kissCount++;
    document.getElementById('kissCount').textContent = appState.kissCount;

    // Remove kiss after animation
    setTimeout(() => kiss.remove(), 1500);
}

// ============================================
// DAY 5: VALENTINE PROPOSAL
// ============================================

function triggerExplosion() {
    const overlay = document.getElementById('proposalOverlay');
    overlay.style.display = 'flex';
}

function handleNo() {
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    
    // Increase yes button size
    const currentWidth = yesBtn.style.maxWidth || '200px';
    const currentSize = parseFloat(currentWidth);
    const newSize = Math.min(currentSize + 30, 350);
    yesBtn.style.maxWidth = newSize + 'px';
    yesBtn.style.padding = '18px 50px';
    yesBtn.style.fontSize = '1.3rem';
    
    // Decrease no button
    noBtn.style.padding = '8px 15px';
    noBtn.style.fontSize = '0.7rem';
    noBtn.style.opacity = '0.6';
}

function handleYes() {
    const proposalQuestion = document.getElementById('proposalQuestion');
    const proposalResult = document.getElementById('proposalResult');
    
    // Hide question, show result
    proposalQuestion.style.animation = 'slideOutDown 0.5s ease-out forwards';
    
    setTimeout(() => {
        proposalQuestion.style.display = 'none';
        proposalResult.style.display = 'block';
        createConfetti();
    }, 500);
}

function closeProposal() {
    const overlay = document.getElementById('proposalOverlay');
    overlay.style.animation = 'proposalFadeOut 0.3s ease-out forwards';
    setTimeout(() => {
        overlay.style.display = 'none';
        overlay.style.animation = '';
        
        // Reset proposal state
        const proposalQuestion = document.getElementById('proposalQuestion');
        const proposalResult = document.getElementById('proposalResult');
        proposalQuestion.style.display = 'block';
        proposalQuestion.style.animation = '';
        proposalResult.style.display = 'none';
        
        const yesBtn = document.getElementById('yesBtn');
        const noBtn = document.getElementById('noBtn');
        yesBtn.style.maxWidth = '200px';
        yesBtn.style.padding = '15px 40px';
        yesBtn.style.fontSize = '1.2rem';
        noBtn.style.padding = '10px 25px';
        noBtn.style.fontSize = '0.9rem';
        noBtn.style.opacity = '1';
    }, 300);
}

function createConfetti() {
    const emojis = ['❤️', '🌻', '💕', '💫', '✨'];
    const container = document.body;

    for (let i = 0; i < 40; i++) {
        const piece = document.createElement('div');
        piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        piece.style.position = 'fixed';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.top = '-50px';
        piece.style.fontSize = '1.5rem';
        piece.style.zIndex = '2001';
        piece.style.pointerEvents = 'none';
        
        container.appendChild(piece);
        
        const duration = 3 + Math.random() * 2;
        piece.style.animation = `fall ${duration}s ease-out forwards`;
        
        setTimeout(() => piece.remove(), duration * 1000);
    }
}

function createMassiveExplosion() {
    const emojis = ['❤️', '🌻', '💕', '💫'];
    const container = document.body;

    for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div');
        piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        piece.style.position = 'fixed';
        piece.style.left = window.innerWidth / 2 + 'px';
        piece.style.top = window.innerHeight / 2 + 'px';
        piece.style.fontSize = '2rem';
        piece.style.zIndex = '2002';
        piece.style.pointerEvents = 'none';
        
        const angle = (i / 50) * Math.PI * 2;
        const distance = 150 + Math.random() * 200;
        piece.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
        piece.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
        piece.style.animation = `explodeFly 1.5s ease-out forwards`;
        
        container.appendChild(piece);
        setTimeout(() => piece.remove(), 1500);
    }
}

// ============================================
// CARD OPEN/CLOSE
// ============================================

function closeDay(dayNum) {
    const card = document.getElementById(`day${dayNum}`);
    const content = card.querySelector('.card-content');
    
    if (content) {
        content.style.display = 'none';
    }
    
    // Reset progress for hug day
    if (dayNum === 3) {
        const hugProgress = document.getElementById('hugProgress');
        if (hugProgress) {
            hugProgress.style.width = '0%';
        }
        const msg = document.getElementById('msg3');
        if (msg) {
            msg.style.display = 'none';
        }
    }
}

// ============================================
// FLOATING ELEMENTS POSITIONING
// ============================================

function positionFloatingElements() {
    const hearts = document.querySelectorAll('.floating-hearts span');
    const petals = document.querySelectorAll('.floating-petals span');
    const sunflowers = document.querySelectorAll('.floating-sunflowers span');

    hearts.forEach(heart => {
        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 2 + 's';
    });

    petals.forEach(petal => {
        petal.style.left = Math.random() * 100 + '%';
        petal.style.top = Math.random() * 100 + '%';
        petal.style.animationDelay = Math.random() * 3 + 's';
    });

    sunflowers.forEach(sunflower => {
        sunflower.style.left = Math.random() * 100 + '%';
        sunflower.style.top = Math.random() * 100 + '%';
        sunflower.style.animationDelay = Math.random() * 4 + 's';
    });
}

// ============================================
// ANIMATION KEYFRAMES (Dynamic)
// ============================================

const animStyles = document.createElement('style');
animStyles.textContent = `
    @keyframes kissFloat {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-50px) scale(0.5);
        }
    }

    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }

    @keyframes explodeFly {
        0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty)) scale(0);
        }
    }
`;
document.head.appendChild(animStyles);
