const introMusic = new Audio("./music/introSong.mp3");
const shootingSound = new Audio("./music/shoooting.mp3");
const killEnemySound = new Audio("./music/killEnemy.mp3");
const gameOverSound = new Audio("./music/gameOver.mp3");
const heavyWeaponSound = new Audio("./music/heavyWeapon.mp3");
const hugeWeaponSound = new Audio("./music/hugeWeapon.mp3");

const canvas = document.createElement("canvas");
document.querySelector(".mygame").appendChild(canvas);
canvas.width = innerWidth;
canvas.height = innerHeight;
const context = canvas.getContext("2d");
const lightweapondamage = 10;
let difficulty = 2;
const form = document.querySelector("form");
const scoreboard = document.querySelector(".scoreboard");
let playerscore = 0;
document.querySelector("input").addEventListener("click", (e) => {
    e.preventDefault();
    form.style.display = "none";
    scoreboard.style.display = "block";
    const uservalue = document.getElementById("difficulty").value;
    if (uservalue === "easy") {
        setInterval(spawnenemy, 1500);
        return (difficulty = 3);
    }
    if (uservalue === "medium") {
        setInterval(spawnenemy, 1300);
        return (difficulty = 5);
    }
    if (uservalue === "hard") {
        setInterval(spawnenemy, 1200);
        return (difficulty = 6);
    }
    if (uservalue === "insane") {
        setInterval(spawnenemy, 1000);
        return (difficulty = 6);
    }
})

const gameoverloader = () => {
    const gameroverbanner = document.createElement("div");
    const gameoverbutton = document.createElement("button");
    const highscore = document.createElement("div");

    const storedHighScore = Number(localStorage.getItem("highScore")) || 0;

    if (playerscore > storedHighScore) {
        localStorage.setItem("highScore", playerscore);
        highscore.innerHTML = `High Score: ${playerscore}`;
    } else {
        highscore.innerHTML = `High Score: ${storedHighScore}`;
    }

    gameoverbutton.innerHTML = "Play Again";
    gameroverbanner.appendChild(highscore);
    gameroverbanner.appendChild(gameoverbutton);
    gameoverbutton.onclick = () => {
        window.location.reload();
    };
    gameroverbanner.classList.add("gameover");
    document.querySelector("body").appendChild(gameroverbanner);
};





playerposition = {
    x: canvas.width / 2,
    y: canvas.height / 2,
};
class player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        context.beginPath();
        context.arc(this.x,
            this.y,
            this.radius,
            (Math.PI / 180) * 0,
            (Math.PI / 180) * 360, false);
        context.fillStyle = this.color;
        context.fill();
    }
    // update(){
    //     this.x+= Math.random() * 10;
    //     this.y+= Math.random() * 10;
    // }
}
//--------------------------- bullet shoot
class Weapon {
    constructor(x, y, radius, color, velocity, damage) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.damage = damage;
    }

    draw() {
        context.beginPath();
        context.arc(this.x,
            this.y,
            this.radius,
            (Math.PI / 180) * 0,
            (Math.PI / 180) * 360, false);
        context.fillStyle = this.color;
        context.fill();
    }
    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}


class HugeWeapon {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = "rgba(255,0,133,1)";
    }

    draw() {
        context.beginPath();
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, 200, canvas.height);
    }

    update() {
        this.draw();
        this.x += 20;
    }
}


// enimies
class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;

    }

    draw() {
        context.beginPath();
        context.arc(this.x,
            this.y,
            this.radius,
            (Math.PI / 180) * 0,
            (Math.PI / 180) * 360, false);
        context.fillStyle = this.color;
        context.fill();
    }
    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

const friction = 0.99;
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }

    draw() {
        context.save();
        context.globalAlpha = this.alpha;
        context.beginPath();
        context.arc(this.x,
            this.y,
            this.radius,
            (Math.PI / 180) * 0,
            (Math.PI / 180) * 360, false);
        context.fillStyle = this.color;
        context.fill();
        context.restore();
    }
    update() {
        this.draw();
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
    }
}

// const safal = new player(playerposition.x, playerposition.y, 15, "blue");
// safal.draw();
const safal = new player(
    playerposition.x,
    playerposition.y,
    15,
    "white"
);

const weapons = []
const enemies = [];
const particles = [];
const hugeweapon = [];
const spawnenemy = () => {

    const enemysize = Math.random() * (35) + 5;
    const enemycolor = `hsl(${Math.floor(Math.random() * 360)},100%,50%)`;
    let random;
    if (Math.random() < 0.5) {
        random = {
            x: Math.random() < 0.5 ? canvas.width + enemysize : 0 - enemysize,
            y: Math.random() * canvas.height
        };
    }
    else {
        random = {
            x: Math.random() * canvas.width,
            y: Math.random() < 0.5 ? canvas.height + enemysize : 0 - enemysize,
        }
    }
    const angles = Math.atan2(
        canvas.height / 2 - random.y,
        canvas.width / 2 - random.x,
    );
    const velocity = {
        x: Math.cos(angles) * difficulty,
        y: Math.sin(angles) * difficulty,
    }

    enemies.push(new Enemy(random.x, random.y, enemysize, enemycolor, velocity))

}
let animationid;
function animation() {
    animationid = requestAnimationFrame(animation);
    context.fillStyle = "rgba(49,49,49,0.2)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    safal.draw();
    particles.forEach((particle, particleindex) => {
        if (particle.alpha <= 0) {
            particles.splice(particleindex, 1);
        }
        else {
            particle.update();
        }

    });

    hugeweapon.forEach((huge, hugeweaponindex) => {
        if (huge.x > canvas.width) {
            hugeweapon.splice(hugeweaponindex, 1);
        }
        else {
            huge.update()
        }
    })


    weapons.forEach((weapon, weaponindex) => {
        weapon.update();
        if (weapon.x + weapon.radius < 1 || weapon.y + weapon.radius < 1 ||
            weapon.x - weapon.radius > canvas.width || weapon.y - weapon.radius > canvas.height) {
            weapons.splice(weaponindex, 1);
        }
    });
    enemies.forEach((enemy, enemyindex) => {
        enemy.update();
        const distancebetweenbandaandenemy = Math.hypot(safal.x - enemy.x, safal.y - enemy.y);
        if (distancebetweenbandaandenemy - safal.radius - enemy.radius < 1) {
            cancelAnimationFrame(animationid);
            gameOverSound.play();
            scoreboard.innerHTML = `Score:${playerscore}`;
            window.parent.postMessage({ type: "submit-score", score: playerscore }, "*");
            gameoverloader();
        }

        hugeweapon.forEach((hugew) => {
            const distancebetweenhugeweaponandenemy = hugew.x - enemy.x;
            if (distancebetweenhugeweaponandenemy <= 200 && distancebetweenhugeweaponandenemy >= -200) {
                playerscore += 10;
                scoreboard.innerHTML = `Score:${playerscore}`;
                setTimeout(() => {
                    enemies.splice(enemyindex, 1);
                }, 0);
            }

        })



        weapons.forEach((weapon, weaponindex) => {
            const distancebetweenweapanandenemy = Math.hypot(weapon.x - enemy.x, weapon.y - enemy.y);
            if (distancebetweenweapanandenemy - weapon.radius - enemy.radius < 1) {

                if (enemy.radius > weapon.damage + 5) {
                    gsap.to(enemy, {
                        radius: enemy.radius - weapon.damage,
                    });

                    setTimeout(() => {
                        weapons.splice(weaponindex, 1);
                    }, 0);
                }
                else {

                    for (let i = 0; i < enemy.radius * 2; i++) {
                        particles.push(new Particle(weapon.x, weapon.y, Math.random() * 3, enemy.color, { x: (Math.random() - 0.5) * Math.random() * 5, y: (Math.random() - 0.5) * Math.random() * 5 }))
                    }
                    playerscore += 20;
                    scoreboard.innerHTML = `Score:${playerscore}`;
                    killEnemySound.play();
                    setTimeout(() => {
                        enemies.splice(enemyindex, 1);
                        weapons.splice(weaponindex, 1);
                    }, 0);
                }
            }
        })
    });
    // safal.update();
}

canvas.addEventListener("click", (e) => {
    shootingSound.play();
    const angles = Math.atan2(e.clientY - canvas.height / 2, e.clientX - canvas.width / 2);
    const velocity = {
        x: Math.cos(angles) * 8,
        y: Math.sin(angles) * 8,
    }
    weapons.push(new Weapon(
        canvas.width / 2,
        canvas.height / 2,
        5,
        "white", velocity, lightweapondamage))
});

canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    if (playerscore < 5) {
        return;
    }
    heavyWeaponSound.play();
    playerscore -= 5;
    scoreboard.innerHTML = `Score:${playerscore}`;
    const angles = Math.atan2(e.clientY - canvas.height / 2, e.clientX - canvas.width / 2);
    const velocity = {
        x: Math.cos(angles) * 4,
        y: Math.sin(angles) * 4,
    }
    weapons.push(new Weapon(
        canvas.width / 2,
        canvas.height / 2,
        15,
        "cyan", velocity, lightweapondamage * 3))
});

addEventListener("keypress", (e) => {
    if (e.key === " ") {
        if (playerscore < 30) {
            return;
        }
        hugeWeaponSound.play();
        playerscore -= 30;
        scoreboard.innerHTML = `Score:${playerscore}`;
        hugeweapon.push(new HugeWeapon(
            0,
            0))

    }
});
addEventListener("resize",()=>{
    window.location.reload();
})
addEventListener("contextmenu",(e)=>{
    e.preventDefault();
})


animation();
