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
  ["Zombie", 1, 6, 8, "./assets/zombie.png"],
  ["Gelatinous Cube", 2, 8, 12, "./assets/gelatinus_cube.png"],
  ["Undead Soldier", 3, 14, 20, "./assets/undead_soldier.png"],
  ["Mind Drinker Vampire", 4, 16, 25, "./assets/mind_drinker_vampire.png"],
  ["Beholder Zombie", 5, 18, 30, "./assets/beholder_zombie.png"],
  ["Sir Vladimir Gwilym", 6, 20, 35, "./assets/sir_godfrey_gwilym.png"],
  ["Air Elemental", 7, 22, 38, "./assets/air_elemental.png"],
  ["Water Elemental", 8, 24, 40, "./assets/water_elemental.png"],
  ["Fire Elemental", 9, 26, 38, "./assets/fire_elemental.png"],
  ["Earth Elemental", 10, 28, 40, "./assets/earth_elemental.png"],
  ["Undead Frost Giant", 11, 30, 45, "./assets/undead_frost_giant.png"],
  ["Wretched Hag", 12, 32, 43, "./assets/wretched_hag.png"],
  ["Atrpal", 13, 34, 48, "./assets/atropal.png"],
  ["Adult Black Dragon", 14, 36, 60, "./assets/adult_black_dragon.png"],
  ["Typhon", 15, 38, 65, "./assets/typhon.png"],
  ["Arkhan the Cruel", 16, 40, 70, "./assets/arkhan_the_cruel.png"],
  ["Adult Red Dragon", 17, 42, 80, "./assets/adult_red_dragon.png"],
  ["Balor", 18, 44, 100, "./assets/balor.png"],
  ["Bel", 20, 48, 150, "./assets/bel.png"],
  ["Zariel", 30, 50, 200, "./assets/zariel.png"],
];

class Player {
  constructor(minAttack, maxAttack, health, img) {
    this.name = "The Hero";
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

const playerHealthBar = document.querySelector(".player_health_bar");
const enemyHealthBar = document.querySelector(".enemy_health_bar");
const resetBtn = document.querySelector(".reset_game");
const attackBtn = document.querySelector(".attack_roll_btn");
const nextEnemy = document.querySelector(".next_round");
const enemyHealth = document.querySelector(".enemy_health");
const enemyImg = document.querySelector(".enemy_image");
const playerHealth = document.querySelector(".player_health");
const playerImg = document.querySelector(".player_image");
const battleLog = document.querySelector(".combat_log");
const actionLog = document.querySelector(".action_log");
const firstRoll = document.querySelector(".first_roll");
const secondRoll = document.querySelector(".second_roll");
const thirdRoll = document.querySelector(".third_roll");
const levelNumberEl = document.querySelector(".current_level");
const highScoreEl = document.querySelector(".high_score");
const modalEl = document.querySelector(".modal");
const overlayEl = document.querySelector(".overlay");
const endScreenText = document.querySelector(".end_screen");

let currentEnemyHealth;
let currentPlayerHealth;
let enemyStatus = true;
let playerStatus = true;
let levelNumber = 0;
let difficulty = 2;
let highScore = 0;
let playerBaseHealth;
let enemyBaseHealth;
levelNumberEl.innerHTML = levelNumber;
highScoreEl.innerHTML = highScore;

const showModal = function () {
  modalEl.classList.remove("hidden");
  overlayEl.classList.remove("hidden");
};

const closeModal = function () {
  modalEl.classList.add("hidden");
  overlayEl.classList.add("hidden");
};

const setHealthBar = function (healthbarEl, value) {
  healthbarEl.querySelector(".health_bar_color").style.width = `${value.toFixed(
    1
  )}%`;
  healthbarEl.querySelector(".health_value").innerHTML = `${value.toFixed(1)}%`;
};

let chooseEnemy = function (difficulty) {
  let i = Math.trunc(Math.random() * difficulty);
  let chosenEnemy = new Enemy(...enemies[i]);
  return chosenEnemy;
};

let loadPlayer = function () {
  let currentPlayer = new Player(1, 12, 100, "./assets/player_card.png");
  setHealthBar(playerHealthBar, 100);
  playerImg.classList.remove("transparency_effect");
  playerImg.src = currentPlayer.img;
  currentPlayerHealth = currentPlayer.health;
  playerBaseHealth = currentPlayer.health;
  return currentPlayer;
};

let loadEnemy = function () {
  let currentEnemy = chooseEnemy(difficulty);
  enemyImg.src = currentEnemy.img;
  enemyBaseHealth = currentEnemy.health;
  currentEnemyHealth = currentEnemy.health;
  setHealthBar(enemyHealthBar, 100);
  enemyStatus = true;
  if (difficulty < 20) difficulty++;
  battleLog.innerHTML = `<span>${currentEnemy.name}</span> has appeared !`;
  enemyImg.classList.remove("transparency_effect");
  return currentEnemy;
};

let currentEnemy = loadEnemy();
let currentPlayer = loadPlayer();

let gameRender = function () {
  enemyStatus = true;
  playerStatus = true;
  levelNumber = 0;
  rollNumber = 0;
  difficulty = 2;
  currentEnemy = loadEnemy();
  currentPlayer = loadPlayer();
  levelNumberEl.innerHTML = levelNumber;
  firstRoll.src = "";
  secondRoll.src = "";
  thirdRoll.src = "";
};

const adjustHealthBar = function (healthbarEl, hpValue, damage, type) {
  let percent;
  if (type === "enemy")
    percent = ((currentEnemyHealth - damage) / hpValue) * 100;
  if (type === "hero")
    percent = ((currentPlayerHealth - damage) / hpValue) * 100;
  setHealthBar(healthbarEl, percent);
};

const healHealthBar = function (healthbarEl, hpValue, healAmount) {
  let percent = ((currentPlayerHealth + healAmount) / hpValue) * 100;
  if (percent > 100) percent = 100;
  setHealthBar(healthbarEl, percent);
};

let attackRoll = function () {
  let currentRoll = [];
  let bonusPlayerDamage = Math.trunc(Math.random() * difficulty) + 1;
  let bonusEnemyDamage = Math.trunc(Math.random() * difficulty) + 1;
  let enemyDamage = currentEnemy.damage() + bonusEnemyDamage +100;
  let playerDamage = currentPlayer.damage() + bonusPlayerDamage;
  let playerCrit = playerDamage * 2;
  let enemyCrit = enemyDamage * 2;
  let healAmount = Math.trunc(playerCrit * 0.15);
  for (let i = 0; i < 3; i++) currentRoll[i] = Math.trunc(Math.random() * 2);
  firstRoll.src = `./assets/torch${currentRoll[0]}.png`;
  secondRoll.src = `./assets/torch${currentRoll[1]}.png`;
  thirdRoll.src = `./assets/torch${currentRoll[2]}.png`;

  let count = currentRoll.length - currentRoll.sort().indexOf(1);

  if (count === 1) {
    adjustHealthBar(playerHealthBar, playerBaseHealth, enemyDamage, "hero");
    currentPlayerHealth -= enemyDamage;
    battleLog.innerHTML = `Your Hero has recieved <span>${enemyDamage}</span> damage.`;
  }
  if (count === 4) {
    adjustHealthBar(playerHealthBar, playerBaseHealth, enemyCrit, "hero");
    currentPlayerHealth = currentPlayerHealth - enemyCrit;
    battleLog.innerHTML = `Your Hero has suffered a critical strike of <span>${enemyCrit}</span> damage.`;
  }
  if (count === 2) {
    adjustHealthBar(enemyHealthBar, enemyBaseHealth, playerDamage, "enemy");
    currentEnemyHealth -= playerDamage;
    battleLog.innerHTML = `Your Hero has dealt <span>${playerDamage}</span> damage.`;
  }
  if (count === 3) {
    adjustHealthBar(enemyHealthBar, enemyBaseHealth, playerCrit, "enemy");
    currentEnemyHealth = currentEnemyHealth - playerCrit;
    currentPlayerHealth += healAmount;
    if (currentPlayerHealth > 100) currentPlayerHealth = 100;
    healHealthBar(playerHealthBar, playerBaseHealth, healAmount);
    battleLog.innerHTML = `Your Hero has dealt a critical strike of <span>${playerCrit}</span> and healed 15% of the damage.`;
  }
  if (currentEnemyHealth < 1) {
    enemyHealth.innerHTML = "0%";
    enemyImg.classList.add("transparency_effect");
    enemyHealthBar.querySelector(".health_bar_color").style.width = "0%";
    battleLog.innerHTML = `<span>${playerDamage}</span> Damage, Enemy Slain - Click on Next to continue.`;
    enemyStatus = false;
  }
  if (currentPlayerHealth < 1) {
    playerHealth.innerHTML = "0%";
    playerImg.classList.add("transparency_effect");
    playerHealthBar.querySelector(".health_bar_color").style.width = "0%";
    battleLog.innerHTML = `Your Hero has fallen - Click on Reset to try again.`;
    playerStatus = false;
    if (levelNumber > highScore) highScore = levelNumber;
    highScoreEl.innerHTML = highScore;
    endScreenText.innerHTML = `Your Score: ${levelNumber}`;
    showModal();
  }
};

nextEnemy.addEventListener("click", function () {
  if (playerStatus === false) return;
  else if (enemyStatus === true) return;
  else {
    levelNumber++;
    levelNumberEl.innerHTML = `${levelNumber}`;
    firstRoll.src = "";
    secondRoll.src = "";
    thirdRoll.src = "";
    loadEnemy();
  }
});

attackBtn.addEventListener("click", function () {
  if (playerStatus && enemyStatus) {
    attackRoll();
  } else return;
});

resetBtn.addEventListener("click", gameRender);

overlayEl.addEventListener("click", closeModal);
