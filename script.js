// script.js
const stats = {
    fome: 100,
    higiene: 100,
    energia: 100,
    alegria: 100
};

const STAT_DECAY = 4; // Decay amount
let decayInterval;
let isSleeping = false;
let isAnimating = false;

function updateBars() {
    Object.keys(stats).forEach(key => {
        const bar = document.getElementById(`${key}-bar`);
        let value = stats[key];
        bar.style.width = `${value}%`;
        
        // Dynamic colors based on value
        bar.className = 'bar-fill';
        if(value <= 20) bar.classList.add('critical');
        else if(value <= 50) bar.classList.add('low');
        else if(value <= 75) bar.classList.add('medium');
    });
}

function decreaseStats() {
    if(!isSleeping) {
        stats.fome = Math.max(0, stats.fome - (STAT_DECAY * 1.5));
        stats.alegria = Math.max(0, stats.alegria - STAT_DECAY);
        stats.higiene = Math.max(0, stats.higiene - (STAT_DECAY * 0.5));
        stats.energia = Math.max(0, stats.energia - (STAT_DECAY * 1.2));
    } else {
        // While sleeping, energy increases, others decrease very slowly
        stats.energia = Math.min(100, stats.energia + (STAT_DECAY * 4));
        stats.fome = Math.max(0, stats.fome - (STAT_DECAY * 0.2));
        if(stats.energia >= 100) {
            wakeUp();
        }
    }
    updateBars();
}

function startDecay() {
    decayInterval = setInterval(decreaseStats, 4000);
}

function showEffect(emoji) {
    const fx = document.getElementById('status-fx');
    const newFx = fx.cloneNode(true);
    newFx.innerText = emoji;
    fx.parentNode.replaceChild(newFx, fx);
}

function changeScene(scene, btnElement) {
    if(isAnimating) return; // Prevent spam

    if(isSleeping && scene !== 'bedroom') {
        wakeUp();
    }

    const container = document.getElementById('game-container');
    container.className = `scene-${scene}`;
    
    const titles = {
        'living-room': 'Sala de Estar',
        'kitchen': 'Cozinha',
        'bathroom': 'Banheiro',
        'bedroom': 'Quarto'
    };
    document.getElementById('scene-title').innerText = titles[scene];

    if(btnElement) {
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        btnElement.classList.add('active');
    }

    // Hide all panels
    document.querySelectorAll('.actions-panel').forEach(panel => {
        panel.style.display = 'none';
        panel.classList.add('hidden');
    });

    // Show correct panel with animation
    setTimeout(() => {
        let activePanel;
        if(scene === 'kitchen') activePanel = document.getElementById('kitchen-foods');
        else if(scene === 'living-room') activePanel = document.getElementById('play-panel');
        else if(scene === 'bathroom') activePanel = document.getElementById('bath-panel');
        else if(scene === 'bedroom') activePanel = document.getElementById('sleep-panel');
        
        if(activePanel) {
            activePanel.style.display = 'flex';
            setTimeout(() => activePanel.classList.remove('hidden'), 50);
        }
    }, 100);
}

// Action functions
function feedPet(foodType) {
    if(isAnimating || isSleeping) return;
    isAnimating = true;

    const petImg = document.getElementById('pet-img');
    petImg.className = 'animate-eat';
    
    setTimeout(() => {
        petImg.className = '';
        isAnimating = false;
    }, 1500);

    let amount = 0;
    if(foodType === 'melancia') { amount = 25; showEffect('🍉'); }
    if(foodType === 'chocolate') { amount = 15; showEffect('🍫'); }
    if(foodType === 'maca') { amount = 30; showEffect('🍎'); }
    if(foodType === 'sorvete') { amount = 20; showEffect('🍦'); }

    stats.fome = Math.min(100, stats.fome + amount);
    stats.alegria = Math.min(100, stats.alegria + 5); 
    stats.higiene = Math.max(0, stats.higiene - 10);
    updateBars();
}

function playWithPet() {
    if(isAnimating || isSleeping) return;
    if(stats.energia < 20) {
        showEffect('🥱'); // too tired
        return;
    }
    
    isAnimating = true;
    const petImg = document.getElementById('pet-img');
    petImg.className = 'animate-jump';
    
    setTimeout(() => {
        petImg.className = '';
        isAnimating = false;
    }, 3000);

    showEffect('🎾');
    stats.alegria = Math.min(100, stats.alegria + 35);
    stats.energia = Math.max(0, stats.energia - 20);
    stats.higiene = Math.max(0, stats.higiene - 15);
    stats.fome = Math.max(0, stats.fome - 10);
    updateBars();
}

function bathePet() {
    if(isAnimating || isSleeping) return;
    isAnimating = true;
    
    const petImg = document.getElementById('pet-img');
    petImg.className = 'animate-bath';
    
    // Bubble effect loops continuously while washing
    showEffect('🫧');

    setTimeout(() => {
        petImg.className = '';
        isAnimating = false;
    }, 2400);

    stats.higiene = 100;
    stats.alegria = Math.min(100, stats.alegria + 5);
    updateBars();
}

function sleepPet() {
    if(isAnimating) return;
    
    if(isSleeping) {
        wakeUp();
        return;
    }
    
    isSleeping = true;
    const petImg = document.getElementById('pet-img');
    petImg.className = 'animate-sleep';
    document.querySelector('.sleep-btn').innerText = '☀️ Acordar';
    showEffect('💤');
}

function wakeUp() {
    if(!isSleeping) return;
    
    isSleeping = false;
    const petImg = document.getElementById('pet-img');
    petImg.className = '';
    document.querySelector('.sleep-btn').innerText = '🛏 Apagar as Luzes';
    showEffect('☀️');
}

// initialization
updateBars();
startDecay();

// Setup first view
document.getElementById('play-panel').style.display = 'flex';
setTimeout(() => document.getElementById('play-panel').classList.remove('hidden'), 50);
