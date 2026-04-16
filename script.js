let character = document.getElementById('character');
let dacheril = false;
let posX = window.innerWidth / 2;
let game_active = true;
let field = false;
let lives = 3;
let coinsDisplay = document.getElementById('coins');
let cuins = 0;

const over_music = new Audio('lose.mp3');
const coin_sound = new Audio('pickup.mp3');

let itemsData = [
    { type: 'coin', img: 'coin.png' },
    { type: 'bomb', img: 'bomb.png' },
    { type: 'booster', img: 'booster.png' }
];

function isColliding(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    return !(aRect.top > bRect.bottom || aRect.bottom < bRect.top || aRect.right < bRect.left || aRect.left > bRect.right);
}

function updateHeartsUI() {
    for (let i = 1; i <= 3; i++) {
        let h = document.getElementById('heart' + i);
        if (h) {
            h.style.display = i <= lives ? 'block' : 'none';
        }
    }
}

function buy() {
    if (cuins >= 5 && lives < 3) {
        cuins -= 5;
        lives = Math.min(lives + 2, 3);
        coinsDisplay.textContent = `coins: ${cuins}`;
        updateHeartsUI();
        coin_sound.play();
    } else if (lives < 3) {
        over_music.play();
    }
}

function spawnItem() {
    if (!game_active) return;

    let lucky = Math.floor(Math.random() * 100);
    let randomData = lucky >= 90 ? itemsData[Math.floor(Math.random() * itemsData.length)] : itemsData[Math.floor(Math.random() * (itemsData.length - 1))];

    const item = document.createElement('div');
    item.className = 'item';
    item.style.backgroundImage = `url('${randomData.img}')`;
    item.style.left = Math.floor(Math.random() * 85) + '%';
    document.body.appendChild(item);

    let checkInterval = setInterval(() => {
        if (!game_active) {
            clearInterval(checkInterval);
            item.remove();
            return;
        }

        if (isColliding(character, item)) {
            item.remove();
            clearInterval(checkInterval);

            if (randomData.type === 'coin') {
                cuins += 1;
                coinsDisplay.textContent = `coins: ${cuins}`;
                coin_sound.play();
            } else if (randomData.type === 'bomb' && field === false) {
                lives--;
                updateHeartsUI();
                over_music.play();
                
                if (lives <= 0) {
                    game_active = false;
                    document.getElementById('result').innerText = "Final Score: " + cuins;
                    document.getElementById('death-screen').style.display = 'flex';
                }
            } else if (randomData.type === 'booster') {
                field = true;
                character.style.backgroundImage = "url('buble.png')";
                setTimeout(() => {
                    field = false;
                    character.style.backgroundImage = "url('character.png')";
                }, 30000);
            }
        }
    }, 20);

    setTimeout(() => {
        if (item.parentNode) item.remove();
        clearInterval(checkInterval);
    }, 3000);
}

window.addEventListener('touchstart', () => { dacheril = true; });
window.addEventListener('touchend', () => { dacheril = false; });
window.addEventListener('mousedown', () => { dacheril = true; });
window.addEventListener('mouseup', () => { dacheril = false; });

setInterval(() => {
    if (!game_active) return;
    let charWidth = character.offsetWidth; 
    let maxPosX = window.innerWidth - charWidth;

    if (dacheril) {
        if (posX < maxPosX) posX += 5;
    } else {
        if (posX > 0) posX -= 4;
    }
    character.style.left = posX + 'px';
}, 20);

setInterval(spawnItem, 1500);
