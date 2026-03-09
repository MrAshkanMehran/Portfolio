// Rules toggle
const rulesBtn = document.getElementById('rules-btn');
const rulesContainer = document.querySelector('.rules-container');
rulesBtn.addEventListener('click',()=>{ 
  rulesContainer.style.display=(rulesContainer.style.display==='block')?'none':'block'; 
  rulesBtn.textContent=(rulesContainer.style.display==='block')?'Hide Rules':'Show Rules';
});

// Dice logic
const diceEls = document.querySelectorAll('.die');
const rollBtn = document.getElementById('roll-dice-btn');
const keepBtn = document.getElementById('keep-score-btn');
const rollsDisplay = document.getElementById('current-round-rolls');
const roundDisplay = document.getElementById('current-round');
const totalScoreDisplay = document.getElementById('total-score');

let rolls = 0, round = 1, totalScore = 0;
let diceValues = [0,0,0,0,0];
let heldDice = [false,false,false,false,false];

// Sounds
const rollSound = new Audio('https://freesound.org/data/previews/415/415209_5121236-lq.mp3'); // dice roll
const winSound = new Audio('https://freesound.org/data/previews/341/341695_3248244-lq.mp3'); // winning

// Roll dice
rollBtn.addEventListener('click',()=>{
    rolls++;
    rollsDisplay.textContent = rolls;
    diceEls.forEach((die,i)=>{
        if(!heldDice[i]){
            die.classList.add('rolling');
            setTimeout(()=>{
                let val = Math.floor(Math.random()*6)+1;
                diceValues[i] = val;
                die.textContent = val;
                die.classList.remove('rolling');
            },300);
        }
    });
    rollSound.play();
});

// Hold dice
diceEls.forEach((die,i)=>{
    die.addEventListener('click',()=>{
        heldDice[i] = !heldDice[i];
        die.classList.toggle('held');
    });
});

// Keep score (simple demo: sum of dice)
keepBtn.addEventListener('click',()=>{
    const sum = diceValues.reduce((a,b)=>a+b,0);
    totalScore += sum;
    totalScoreDisplay.textContent = totalScore;
    document.getElementById('score-history').innerHTML += `<li>Round ${round}: +${sum}</li>`;
    winSound.play();
    rolls=0; round++; rollsDisplay.textContent=rolls; roundDisplay.textContent=round;
    heldDice = [false,false,false,false,false];
    diceEls.forEach(d=>d.classList.remove('held'));    
});

const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    const target = tab.dataset.target;
    const panel = document.getElementById(target);
    if(panel) panel.classList.add('active');
  });
});

// Contact Form Handling
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

if (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Stops the page from reloading when the form is submitted
    const data = new FormData(form);

    fetch(form.action, {
      method: form.method,
      body: data,
      headers: { Accept: "application/json" }
    })
    .then(response => {
      if (response.ok) {
        status.textContent = "Thanks! Your message has been sent.";
        form.reset();
      } else {
        status.textContent = "Oops! There was a problem sending your message.";
      }
    })
    .catch(() => {
      status.textContent = "Oops! There was a problem sending your message.";
    });
  });
}
