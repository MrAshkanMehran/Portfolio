// ==============================
// 🎲 ELEMENT SELECTORS
// ==============================
const dice = document.querySelectorAll(".die");
const rollBtn = document.getElementById("roll-btn");
const keepBtn = document.getElementById("keep-btn");
const currentRollsSpan = document.getElementById("current-rolls");
const currentRoundSpan = document.getElementById("current-round");
const totalScoreSpan = document.getElementById("total-score");
const scoreHistory = document.getElementById("score-history");
const rulesBtn = document.getElementById("rules-btn");
const rulesContainer = document.getElementById("rules-container");

const scoreInputs = Array.from(document.querySelectorAll('#score-options input'));
const scoreSpans = scoreInputs.map(input => input.nextElementSibling.querySelector('span'));

// ==============================
// 🔊 SOUND EFFECTS
// ==============================
const diceSound = new Audio('dice-roll.mp3');       // dice rolling
const celebrateSound = new Audio('celebrate.mp3');  // scoring sound

// ==============================
// 🧩 GAME STATE
// ==============================
let diceValues = [0, 0, 0, 0, 0];
let rolls = 0;
let round = 1;
let totalScore = 0;
let isModalShowing = false;

// ==============================
// 🎯 UTILITY FUNCTIONS
// ==============================

const updateRadioOption = (index, score) => {
  if (!scoreInputs[index]) return;
  scoreInputs[index].disabled = false;
  scoreInputs[index].value = score;
  scoreSpans[index].textContent = `, score = ${score}`;
};

const resetRadioOptions = () => {
  scoreInputs.forEach((input, i) => {
    input.disabled = true;
    input.checked = false;
    scoreSpans[i].textContent = "";
  });
};

const updateScore = (selectedValue, achieved) => {
  totalScore += parseInt(selectedValue);
  totalScoreSpan.textContent = totalScore;
  scoreHistory.innerHTML += `<li>${achieved} : ${selectedValue}</li>`;
};

const updateStats = () => {
  currentRollsSpan.textContent = rolls;
  currentRoundSpan.textContent = round;
};

// ==============================
// 🎲 ROLL LOGIC
// ==============================

const rollAndRender = () => {
  // Play dice sound (needs user click)
  diceSound.currentTime = 0;
  diceSound.play().catch(() => {});

  dice.forEach((die, i) => {
    if (!die.classList.contains("held")) {
      die.classList.add("rolling");
      die.textContent = "";

      setTimeout(() => {
        const value = Math.floor(Math.random() * 6) + 1;
        diceValues[i] = value;
        die.textContent = "⚀⚁⚂⚃⚄⚅".charAt(value - 1);
        die.classList.remove("rolling");
      }, 600); // matches shake animation
    }
  });

  // After dice settle, check scoring
  setTimeout(() => {
    let scored = false;

    // Duplicates for 3/4-of-a-kind
    const counts = {};
    diceValues.forEach(n => counts[n] = (counts[n] || 0) + 1);
    const values = Object.values(counts);
    const sum = diceValues.reduce((a,b)=>a+b,0);

    if (values.includes(3)) { scored = true; updateRadioOption(0, sum); }
    if (values.includes(4)) { scored = true; updateRadioOption(1, sum); }
    if (values.includes(3) && values.includes(2)) { scored = true; updateRadioOption(2, 25); }

    // Straights
    const sorted = [...new Set(diceValues)].sort((a,b)=>a-b);
    const smallStraights = [[1,2,3,4],[2,3,4,5],[3,4,5,6]];
    const largeStraights = [[1,2,3,4,5],[2,3,4,5,6]];

    if (largeStraights.some(straight => straight.every(n => sorted.includes(n)))) {
      scored = true;
      updateRadioOption(4, 40);
      updateRadioOption(3, 30);
    } else if (smallStraights.some(straight => straight.every(n => sorted.includes(n)))) {
      scored = true;
      updateRadioOption(3, 30);
    }

    updateRadioOption(5, 0); // None option always enabled

    // Play celebration sound if scoring
    if (scored) {
      celebrateSound.currentTime = 0;
      celebrateSound.play().catch(() => {});
    }

    updateStats();
  }, 650);
};

// ==============================
// 🎮 GAME CONTROL
// ==============================

const resetGame = () => {
  diceValues = [0,0,0,0,0];
  totalScore = 0;
  rolls = 0;
  round = 1;

  dice.forEach(die => {
    die.classList.remove("held");
    die.textContent = ""; // blank dice at start
  });

  totalScoreSpan.textContent = totalScore;
  scoreHistory.innerHTML = "";
  updateStats();
  resetRadioOptions();
};

// ==============================
// 🎛 EVENT LISTENERS
// ==============================

// Toggle rules modal
rulesBtn.addEventListener("click", () => {
  isModalShowing = !isModalShowing;
  rulesContainer.style.display = isModalShowing ? "block" : "none";
  rulesBtn.textContent = isModalShowing ? "Hide Rules" : "Show Rules";
});

// Toggle hold on dice
dice.forEach(die => {
  die.addEventListener("click", () => die.classList.toggle("held"));
});

// Roll dice
rollBtn.addEventListener("click", () => {
  if (rolls >= 3) return alert("You have rolled 3 times already!");
  rolls++;
  resetRadioOptions();
  rollAndRender();
});

// Keep score
keepBtn.addEventListener("click", () => {
  let selectedValue, achieved;
  for (const input of scoreInputs) {
    if (input.checked) {
      selectedValue = input.value;
      achieved = input.id;
      break;
    }
  }

  if (!selectedValue) return alert("Please select a scoring option!");

  updateScore(selectedValue, achieved);
  rolls = 0;
  round++;
  dice.forEach(d => d.classList.remove("held"));
  resetRadioOptions();
  updateStats();

  if (round > 6) setTimeout(() => {
    alert(`Game Over! Your total score is ${totalScore}`);
    resetGame();
  }, 300);
});

// Initialize game
resetGame();
