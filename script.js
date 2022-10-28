const menu = document.querySelector('.menu'),
      gameContainer = document.querySelector('.game-container'),
      lvlBtns = document.querySelectorAll('.lvl'),
      resultContainer = document.querySelector('.result-container'),
      result = document.getElementById('result'),
      playAgain = document.getElementById('play-again'),
      timeContainer = document.querySelector('.time-container'),
      timeLeft = document.getElementById('timer'),
      timeOptionYes = document.getElementById('time-option-yes'),
      timeOptionNo = document.getElementById('time-option-no'),
      yesBtn = document.getElementById('yes-btn'),
      noBtn = document.getElementById('no-btn'),
      backBtn = document.querySelector('.back-to-menu');

let arr1 = [],
    arr2 = [],
    pairs = 0,
    time = 0;

let imgAmount = 0; //decides how many different pictures can be generated

backBtn.addEventListener('click', () => {
  toggle(backBtn);
  toggle(gameContainer);
  reset();
})


//Choose if timer should be on
yesBtn.addEventListener('click', () => {
  timeOptionYes.checked = true;
})
noBtn.addEventListener('click', () => {
  timeOptionNo.checked = true;
})

// Play again
playAgain.addEventListener('click', () => {
  reset();
})

function reset() {
  toggle(menu);
  pairs = 0;
  arr1.length = [];
  arr2.length = [];
  imgAmount = 0;
  gameContainer.innerHTML = '';
  gameContainer.style.gridTemplateColumns = '';
  gameContainer.style.gridTemplateRows = '';
  gameContainer.classList.add('hide');
  resultContainer.classList.add('hide');
  resultContainer.classList.remove('win', 'game-over');
}

// Select difficulty
lvlBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.classList.contains('easy')){
      createBoard(2);
      pairs = 2;
      if (timeOptionYes.checked == true){
        activateTimer(10);
      }
    } else if (btn.classList.contains('medium')) {
      createBoard(4);
      pairs = 8;
      if (timeOptionYes.checked == true){
        activateTimer(45);
      }
    } else {
      createBoard(6);
      pairs = 18;
      if (timeOptionYes.checked == true){
        activateTimer(120);
      }
    }
    toggle(menu);
    toggle(gameContainer);
    toggle(backBtn);
    createCards(pairs);
    flip();
  })
})

//generates a game board depending on difficulty chosen
function createBoard(nr) {
  gameContainer.style.gridTemplateColumns = `repeat(${nr}, 1fr)`;
  gameContainer.style.gridTemplateRows = `repeat(${nr}, 1fr)`;
  imgAmount = nr;
}

//Creates the amount of cards needed for the difficulty and sets their background
function createCards(pairs){
  let amountOfCards = imgAmount * imgAmount;
  //Creates the cards as long as there are empty spots to fill
  while(!amountOfCards == 0) {
    const card = document.createElement('div');
    card.classList.add('card-container');
    card.innerHTML = `<div class="card front"></div>
    <div class="card back"></div>`;
    gameContainer.insertAdjacentElement('afterbegin', card);
    amountOfCards--;
  }

  //Setting the background and pair class
  const cardFronts = document.querySelectorAll('.front');
  cardFronts.forEach((card) => {
    let done = false;
    do {
      const randomNr = Math.floor(Math.random() * pairs) +1;
      if (!arr1.includes(randomNr)){
        arr1.push(randomNr);
        card.style.background = `url('img/${randomNr}.jpg') no-repeat center center/cover`;
        card.classList.add(randomNr);
        done = true
      } else if (!arr2.includes(randomNr)){
          arr2.push(randomNr);
          card.style.background = `url('img/${randomNr}.jpg') no-repeat center center/cover`;
          card.classList.add(randomNr);
          done = true
      }
    } while (done === false);
  })
}

//Adds the flip-animation and checks pairs and wincondition
function flip() {
const cardBacks = document.querySelectorAll('.back');
let flipped = 0,
    totalCards = 0,
    prevCardValue,
    prevCard,
    thisCardValue,
    winCondition = pairs * 2;

    cardBacks.forEach((card) => {
        card.addEventListener('click', () => {
          // Stores value of first card flipped
          if (flipped < 1) {
            animation(card);
            flipped++;
            prevCardValue = card.previousElementSibling.classList.value;
            prevCard = card;
          } else if (flipped < 2){ //Stores value of second card
            animation(card);
            flipped++;
            thisCardValue = card.previousElementSibling.classList.value;
            console.log(thisCardValue);
            // After a delay for the animation, checks pair
            setTimeout(() => {
              if (prevCardValue == thisCardValue){
                flipped = 0;
                totalCards += 2;
                // Finally checks to see if all cards have been matched
                if (totalCards == winCondition) {
                  result.innerText = 'You Won!';
                  toggle(gameContainer);
                  resultContainer.classList.add('win');
                  toggle(resultContainer);
                  toggle(backBtn);
                }
              } else { //reverses the animation if not a pair
                card.style.animation = '';
                card.previousElementSibling.style.animation = '';
                prevCard.style.animation = '';
                prevCard.previousElementSibling.style.animation = '';
                flipped = 0;
              }
            }, 1000);
          }
        })
    })
}

function animation(card) {
  card.style.animation = 'backAnimation 0.8s ease forwards';
  card.previousElementSibling.style.animation = 'frontAnimation 0.8s ease forwards';
}

function timer(time) {
  intervalID = setInterval(() => {
    if (time != 0 && resultContainer.classList.contains('win') || backBtn.classList.contains('hide')) {
      clearInterval(intervalID);
      timeLeft.innerText = '';
      toggle(timeContainer);
    } else if (time <= -1) {
      resultContainer.classList.add('game-over');
      gameContainer.classList.add('hide');
      resultContainer.classList.remove('hide');
      toggle(timeContainer);
      result.innerText = 'Try Again!';
      timeLeft.innerText = '';
      clearInterval(intervalID);
      toggle(backBtn);
    } else {
      timeLeft.innerText = `${time}s left`;
    }
    time -= 1;
  }, 1000);
}

function activateTimer(time) {
  timer(time);
  setTimeout(() => {
    timeContainer.classList.toggle('hide');
  }, 500);
}

function toggle(div) {
  div.classList.toggle('hide');
};