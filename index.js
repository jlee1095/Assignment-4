const initializeGame = () => {
  let cardOne = undefined;
  let cardTwo = undefined;
  let timeRemaining = 60;
  let clickCount = 0;
  let matchedCardCount = 0;
  let numberOfCards = 3;
  let difficultyMultiplier = 1;
  let selectedDifficulty = "easy";
  let gameInProgress = false;

  const startBtn = $("#startButton");
  const resetBtn = $("#resetButton");
  const themeBtn = $("#themeButton");

  const countClicks = $("#clicks");
  const countPairs = $("#pairs");
  const countTime = $("#timer");

  const difficultySelect = $("#difficultySelect");

  let timerInterval;

  const generateRandomNumbersArray = (length) => {
    const numbers = Array.from({ length }, () =>
      Math.floor(Math.random() * 810) + 1
    );
    const doubledNumbers = numbers.flatMap((num) => [num, num]);
    const shuffledNumbers = shuffleArray(doubledNumbers);
    return shuffledNumbers;
  };

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const createCards = () => {
    const container = document.querySelector("#game-grid");
    const cardsCount = 6 * difficultyMultiplier;
    const randomNumbersArray = generateRandomNumbersArray(cardsCount / 2);

    for (let i = 0; i < cardsCount; i++) {
      const cardElement = document.createElement("div");
      cardElement.className = "card";
      if (cardsCount === 24) {
        cardElement.classList.add("hard");
      }
      if (cardsCount === 12) {
        container.className += " med";
        cardElement.className += " med";
      }

      const frontFace = document.createElement("img");
      frontFace.className = "front-face";
      frontFace.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${randomNumbersArray[i]}.png`;
      frontFace.id = `front_${i}`;
      const backFace = document.createElement("img");
      backFace.className = "back-face";
      backFace.src = "back.webp";
      backFace.id = `back_${i}`;
      cardElement.appendChild(frontFace);
      cardElement.appendChild(backFace);
      container.appendChild(cardElement);
      numberOfCards += 1 / 2;
    }
  };


  const startGame = () => {
    gameInProgress = true;
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
      card.addEventListener("click", flipCard);
    });
    alert("Game start!");
    startTimer();
  };

  const resetGame = () => {
    cardOne = undefined;
    cardTwo = undefined;
    matchedCardCount = 0;
    clickCount = 0;
    numberOfCards = 0;
    stopTimer();
    resetTimer();
    gameInProgress = false;

    createCards();
    $(".card").remove();
    $(".card").removeClass("flip").off("click");
    $("#game-grid").removeClass("green");
    createCards();
    updateStats();
  };


  const startTimer = () => {
    timerInterval = setInterval(() => {
      timeRemaining--;
      countTime.text(`Timer: ${timeRemaining}`);

      if (timeRemaining === 0) {
        clearInterval(timerInterval);
        setTimeout(() => {
          alert("Time's up! Game over. Try again!");
          resetGame();
        }, 500);
      }
    }, 1000);
  };

  const stopTimer = () => clearInterval(timerInterval);

  const getTimeForDifficulty = (difficulty) => {
    const timeOptions = {
      easy: 60,
      medium: 120,
      hard: 180
    };

    return timeOptions[difficulty] || timeOptions.easy;
  };

  const resetTimer = () => {
    timeRemaining = getTimeForDifficulty(selectedDifficulty);
    countTime.text(`Timer: ${timeRemaining}`);
  };


  const flipCard = function () {
    if (clickCount == 12) {
      clickCount++;
      hint();
    }
    if ($(this).hasClass("flip")) return;

    $(this).toggleClass("flip");
    clickCount++;

    if (!cardOne) {
      cardOne = $(this).find(".front-face")[0];
    } else {
      cardTwo = $(this).find(".front-face")[0];

      if (cardOne.src === cardTwo.src) {
        $(`#${cardOne.id}`)
          .parent()
          .off("click")
          .addClass("matched");
        $(`#${cardTwo.id}`)
          .parent()
          .off("click")
          .addClass("matched");
        cardOne = undefined;
        cardTwo = undefined;
        matchedCardCount += 2;

        if (matchedCardCount === numberOfCards) {
          stopTimer();
          setTimeout(() => {
            alert("Congratulations! You've won! Gotta Catch 'em all!");
            resetGame();
          }, 500);
        }
      } else {
        $(".card").addClass("locked");
        setTimeout(() => {
          $(this).toggleClass("flip");
          $(`#${cardOne.id}`).parent().toggleClass("flip");
          cardOne = undefined;
          cardTwo = undefined;
          $(".card").removeClass("locked");
        }, 1000);
      }
    }
    updateStats();
  };

  const hint = () => {
    alert("POWER UP!");
    $(".card").each(function () {
      if (!$(this).hasClass("matched")) {
        $(this).addClass("flip");
      }
    });

    setTimeout(() => {
      $(".card").not(".matched").removeClass("flip");
    }, 1000);
  };

  const updateStats = () => {
    const clicksText = `Clicks: ${clickCount}`;
    const pairsText = `Pairs Matched: ${matchedCardCount / 2} / ${numberOfCards / 2}`;
    countClicks.text(clicksText);
    countPairs.text(pairsText);
  };

  const updateDifficulty = () => {
    selectedDifficulty = difficultySelect.val();
    timeRemaining = getTimeForDifficulty(selectedDifficulty);

    let multiplier;
    if (selectedDifficulty === "medium") {
      multiplier = 2;
    } else if (selectedDifficulty === "hard") {
      multiplier = 4;
    } else {
      multiplier = 1;
    }

    difficultyMultiplier = multiplier;
    numberOfCards = $(".card").length * difficultyMultiplier;

    const pairsText = `Pairs Matched: ${matchedCardCount / 2} / ${numberOfCards / 2}`;
    countPairs.text(pairsText);

    resetGame();
  };

  const changeTheme = () => {
    const gameGrid = $("#game-grid");
    const cards = $(".card");

    gameGrid.toggleClass("green");
    cards.toggleClass("green");
  };


  startBtn.on("click", startGame);
  resetBtn.on("click", resetGame);
  themeBtn.on("click", changeTheme);
  difficultySelect.on("change", updateDifficulty);

  createCards();
  updateStats();
};

$(document).ready(initializeGame);
