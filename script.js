let character = document.getElementById('character');
let dacheril = false;
let posX = window.innerWidth / 2;
let game_active = true;
let field = false
const over_music = new Audio('lose.mp3')
const coin = new Audio('pickup.mp3')

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

function spawnItem() {
    if (!game_active)  return

    let lucky = Math.floor(Math.random() * 100);
    let randomData;

    if (lucky >= 90) {
        randomData = itemsData[Math.floor(Math.random() * itemsData.length)];
    } else {
        randomData = itemsData[Math.floor(Math.random() * (itemsData.length - 1))];
    }

    const item = document.createElement('div');
    item.className = 'item';
    item.style.backgroundImage = `url('${randomData.img}')`;
    item.style.left = Math.floor(Math.random() * 85) + '%';
    document.body.appendChild(item);

    let checkInterval = setInterval(() => {
        if (!game_active) {
            clearInterval(checkInterval);
            return;
        } 
        
        if (isColliding(character, item)) {
            item.remove();
            clearInterval(checkInterval);

            if (randomData.type === 'bomb' && field === false) {
                game_active = false;
                over_music.play(); 
                
                // მცირე დაგვიანება, რომ ხმა გაისმას alert-ამდე
                setTimeout(() => {
                    alert("Game Over!");
                    location.reload();
                }, 100);
                
            } else if (randomData.type === 'booster') {
                field = true;
                character.style.backgroundImage = "url('buble.png')";
                
                setTimeout(() => {
                    field = false;
                    character.style.backgroundImage = "url('character.png')";
                }, 30000);
            } else if (randomData.type === 'coin') {
                coin.play(); 
            }
        }
    }, 20);
        
  

    setTimeout(() => {
        item.remove();
        clearInterval(checkInterval);
    }, 3000);
}

window.addEventListener('touchstart', () => { dacheril = true; });
window.addEventListener('touchend', () => { dacheril = false; });
window.addEventListener('mousedown', () => { dacheril = true; });
window.addEventListener('mouseup', () => { dacheril = false; });

setInterval(() => {
    if (!game_active) return;
    if (dacheril) {
        posX += 5;
    } else {
        if (posX > 0) posX -= 4;
    }
    character.style.left = posX + 'px';
}, 20);

setInterval(spawnItem, 1500);