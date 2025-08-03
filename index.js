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
  if (uservalue === "easy") return (difficulty = 3), setInterval(spawnenemy, 1500);
  if (uservalue === "medium") return (difficulty = 5), setInterval(spawnenemy, 1300);
  if (uservalue === "hard") return (difficulty = 6), setInterval(spawnenemy, 1200);
  if (uservalue === "insane") return (difficulty = 6), setInterval(spawnenemy, 1000);
});

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


const playerposition = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};

class Player {
  constructor(x, y, radius, color) {
    Object.assign(this, { x, y, radius, color });
  }

  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();
  }
}

class Weapon {
  constructor(x, y, radius, color, velocity, damage) {
    Object.assign(this, { x, y, radius, color, velocity, damage });
  }

  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
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
    Object.assign(this, { x, y, color: "rgba(255,0,133,1)" });
  }

  draw() {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, 200, canvas.height);
  }

  update() {
    this.draw();
    this.x += 20;
  }
}

class Enemy {
  constructor(x, y, radius, color, velocity) {
    Object.assign(this, { x, y, radius, color, velocity });
  }

  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

class Particle {
  constructor(x, y, radius, color, velocity) {
    Object.assign(this, { x, y, radius, color, velocity, alpha: 1 });
  }

  draw() {
    context.save();
    context.globalAlpha = this.alpha;
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();
    context.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= 0.99;
    this.velocity.y *= 0.99;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.01;
  }
}

const safal = new Player(playerposition.x, playerposition.y, 15, "white");
const weapons = [];
const enemies = [];
const particles = [];
const hugeweapon = [];

const spawnenemy = () => {
  const enemysize = Math.random() * 30 + 10;
  const enemycolor = hsl(${Math.random() * 360},100%,50%);
  let x, y;

  if (Math.random() < 0.5) {
    x = Math.random() < 0.5 ? -enemysize : canvas.width + enemysize;
    y = Math.random() * canvas.height;
  } else {
    x = Math.random() * canvas.width;
    y = Math.random() < 0.5 ? -enemysize : canvas.height + enemysize;
  }

  const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
  const velocity = { x: Math.cos(angle) * difficulty, y: Math.sin(angle) * difficulty };

  enemies.push(new Enemy(x, y, enemysize, enemycolor, velocity));
};

let animationid;
function animation() {
  animationid = requestAnimationFrame(animation);
  context.fillStyle = "rgba(49,49,49,0.2)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  safal.draw();
  particles.forEach((p, i) => (p.alpha <= 0 ? particles.splice(i, 1) : p.update()));
  hugeweapon.forEach((h, i) => (h.x > canvas.width ? hugeweapon.splice(i, 1) : h.update()));
  weapons.forEach((w, i) => {
    w.update();
    if (w.x < 0 || w.y < 0 || w.x > canvas.width || w.y > canvas.height) weapons.splice(i, 1);
  });

  enemies.forEach((e, ei) => {
    e.update();
    if (Math.hypot(safal.x - e.x, safal.y - e.y) - safal.radius - e.radius < 1) {
      cancelAnimationFrame(animationid);
      gameOverSound.play();
      scoreboard.innerHTML = Score: ${playerscore};
      window.parent.postMessage({ type: "submit-score", score: playerscore }, "*");
      gameoverloader();
    }

    hugeweapon.forEach((h) => {
      if (h.x - e.x <= 200 && h.x - e.x >= -200) {
        playerscore += 10;
        scoreboard.innerHTML = Score: ${playerscore};
        enemies.splice(ei, 1);
      }
    });

    weapons.forEach((w, wi) => {
      if (Math.hypot(w.x - e.x, w.y - e.y) - w.radius - e.radius < 1) {
        if (e.radius > w.damage + 5) {
          gsap.to(e, { radius: e.radius - w.damage });
          weapons.splice(wi, 1);
        } else {
          for (let i = 0; i < e.radius * 2; i++) {
            particles.push(new Particle(w.x, w.y, Math.random() * 3, e.color, {
              x: (Math.random() - 0.5) * 5,
              y: (Math.random() - 0.5) * 5,
            }));
          }
          playerscore += 20;
          scoreboard.innerHTML = Score: ${playerscore};
          killEnemySound.play();
          enemies.splice(ei, 1);
          weapons.splice(wi, 1);
        }
      }
    });
  });
}

canvas.addEventListener("click", (e) => {
  shootingSound.play();
  const angle = Math.atan2(e.clientY - canvas.height / 2, e.clientX - canvas.width / 2);
  weapons.push(new Weapon(canvas.width / 2, canvas.height / 2, 5, "white", {
    x: Math.cos(angle) * 8,
    y: Math.sin(angle) * 8,
  }, lightweapondamage));
});

canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  if (playerscore < 5) return;
  heavyWeaponSound.play();
  playerscore -= 5;
  scoreboard.innerHTML = Score: ${playerscore};
  const angle = Math.atan2(e.clientY - canvas.height / 2, e.clientX - canvas.width / 2);
  weapons.push(new Weapon(canvas.width / 2, canvas.height / 2, 15, "cyan", {
    x: Math.cos(angle) * 4,
    y: Math.sin(angle) * 4,
  }, lightweapondamage * 3));
});

window.addEventListener("keypress", (e) => {
  if (e.key === " ") {
    if (playerscore < 30) return;
    hugeWeaponSound.play();
    playerscore -= 30;
    scoreboard.innerHTML = Score: ${playerscore};
    hugeweapon.push(new HugeWeapon(0, 0));
  }
});

window.addEventListener("resize", () => window.location.reload());
window.addEventListener("contextmenu", (e) => e.preventDefault());

animation();

