// ----Enemy stuff----
class Enemy {
  constructor(name, minAttack, maxAttack, health, img) {
    this.name = name;
    this.minAttack = minAttack;
    this.maxAttack = maxAttack;
    this.health = health;
    this.img = img;
  }
  damage() {
    let dmgRoll =
      Math.trunc(Math.random() * (this.maxAttack - this.minAttack)) +
      this.minAttack;
    return dmgRoll;
  }
}

let enemies = [
  ["zombie", 1, 6, 8, "./assets/images/zombie.png"],
  ["orc", 2, 8, 10, "./assets/images/orc.png"],
];


// ----Player stuff---

class Player {
  constructor(minAttack, maxAttack, health, img) {
    this.name = "Warrior";
    this.minAttack = minAttack;
    this.maxAttack = maxAttack;
    this.health = health;
    this.img = img;
  }
  damage() {
    let dmgRoll =
      Math.trunc(Math.random() * (this.maxAttack - this.minAttack)) +
      this.minAttack;
    return dmgRoll;
  }
}

//-------Game------

const attackBtn = document.querySelector(".attack-roll-btn");
const nextEnemy = document.querySelector(".next-round");
const enemyHealth = document.querySelector(".enemy-health");
const enemyAttack = document.querySelector(".enemy-attack");
const enemyImg = document.querySelector(".enemy-image");
const playerHealth = document.querySelector(".player-health");
const playerAttack = document.querySelector(".player-attack");
const playerImg = document.querySelector(".player-image");
const battleLog = document.querySelector(".combat-log");
const actionLog = document.querySelector(".action-log");
const firstRoll = document.querySelector('.first-roll');
const secondRoll = document.querySelector('.second-roll');
const thirdRoll = document.querySelector('.third-roll');
let enemyStatus = true;
let playerStatus = true;
let currentLevel = 1;
let difficulty = 2;
let currentEnemyHealth;
let currentPlayerHealth;

let chooseEnemy = function (difficulty) {
  let i = Math.trunc(Math.random() * difficulty);
  let chosenEnemy = new Enemy(...enemies[i]);
  return chosenEnemy;
};

let loadPlayer = function () {
  let currentPlayer = new Player(1, 12, 100, "./assets/images/player.png");
  playerHealth.innerHTML = `Health: ${currentPlayer.health}`;
  playerAttack.innerHTML = `Attack: ${currentPlayer.maxAttack}`;
  currentPlayerHealth = currentPlayer.health;
  return currentPlayer;
};

let loadEnemy = function () {
  let currentEnemy = chooseEnemy(difficulty);
  enemyHealth.innerHTML = `Health : ${currentEnemy.health}`;
  enemyAttack.innerHTML = `Attack : ${currentEnemy.maxAttack}`;
  enemyImg.src = currentEnemy.img;
  battleLog.innerHTML = `Click on Roll Attack`;
  currentEnemyHealth = currentEnemy.health;
  enemyStatus = true;
  return currentEnemy;
};
let currentEnemy = loadEnemy();
let currentPlayer = loadPlayer();
// let currentPlayerHealth = currentPlayer.health;
// let currentEnemyHealth = currentEnemy.health;

let attackRoll = function () {
  let currentRoll = [];
  let enemyDamage = currentEnemy.damage();
  let playerDamage = currentPlayer.damage();
  console.log(enemyDamage, playerDamage);
  for (let i = 0; i < 3; i++) currentRoll[i] = Math.trunc(Math.random() * 2);
  console.log(currentRoll);
  firstRoll.innerHTML = `${currentRoll[0]}`;
  secondRoll.innerHTML = `${currentRoll[1]}`;
  thirdRoll.innerHTML = `${currentRoll[2]}`;
  let count = currentRoll.length - currentRoll.sort().indexOf(1);
  if (count === 1) {
    currentPlayerHealth -= enemyDamage;
    playerHealth.innerHTML = `Health: ${currentPlayerHealth}`;
    battleLog.innerHTML = `Your Hero has recieved ${enemyDamage} damage.`;
  }
  if (count === 4) {
    currentPlayerHealth = currentPlayerHealth - (enemyDamage * 2);
    playerHealth.innerHTML = `Health: ${currentPlayerHealth}`;
    battleLog.innerHTML = `Your Hero has suffered a critical strike of ${
      enemyDamage * 2
    } damage.`;
  }
  if (count === 2) {
    currentEnemyHealth -= playerDamage;
    enemyHealth.innerHTML = `Health: ${currentEnemyHealth}`;
    battleLog.innerHTML = `Your Hero has dealt ${playerDamage} damage.`;
  }
  if (count === 3) {
    currentEnemyHealth = currentEnemyHealth - (playerDamage * 2);
    enemyHealth.innerHTML = `Health: ${currentEnemyHealth}`;
    battleLog.innerHTML = `Your Hero has dealt a critical strike of ${
      playerDamage * 2
    } damage.`;
  }
  if (currentEnemyHealth < 1) {
    battleLog.innerHTML = `Enemy Slain - Click on Next to continue.`;
    enemyStatus = false;
  }
  if (currentPlayerHealth < 1) {
    battleLog.innerHTML = `Your Hero has fallen - Click on Reset to try again.`;
    playerStatus = false;
  }
  console.log(playerStatus,enemyStatus);
};

// console.log(attackRoll());

nextEnemy.addEventListener("click", function () {
  if (playerStatus === false) return;
  else if(enemyStatus === true) return;
  else loadEnemy();
});

attackBtn.addEventListener("click", function () {
  if (playerStatus && enemyStatus) {
    attackRoll();
  } else return;
});
