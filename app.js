// global variables
let points = 0;
const cardImageId = [];
const cardNumber = [];
let clickerCount = 0;
let scoreShowed = false;
const parCards = [];

// save show scores variables
const NO_OF_HIGH_SCORES = 10;
const HIGH_SCORES = 'highScores';
const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) ?? [];

// ==================================
// FUNCTIONS

//shuffle array
const shuffle = (arr) => {
  //   let list = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let list = [...arr];
  list = list.sort(() => Math.random() - 0.5);
  return list;
};

//random unque number
const myRandomInts = (count, max) => {
  const arr = [];
  while (arr.length < count) {
    var r = Math.floor(Math.random() * max) + 1;
    if (arr.indexOf(r) === -1) {
      arr.push(r);
      if (arr.length < count) {
        arr.push(r);
      }
    }
  }
  return arr;
};

// disable card
const disabled = (cardId) => {
  $(`[data-cardNumber=${cardId}]`).attr('disabled', 'disabled');
};

// undisable card
const undisabled = (cardId) => {
  $(`[data-cardNumber=${cardId}]`).removeAttr('disabled').on('click');
};

// rotate card anim
const rotateCard = (cardId) => {
  $(`[data-cardNumber=${cardId}]`).toggleClass('card--active');
  setTimeout(() => {
    $(`[data-cardNumber=${cardId}] > img`).toggleClass('card__image--active');
  }, 100);
};

// create game stats
const createGameStats = () => {
  $('.page').append($('<div></div>', { class: 'gameStat' }));
  $('.gameStat').append(
    $('<h1></h1>', { class: 'nowScore__title', text: 'Your score:' }).append(
      $('<p></p>', { class: 'nowScore__count', text: '0' })
    )
  );
};

// save score to local storage
const saveHighScore = (score, highScores) => {
  let name = prompt('You got a highscore! Enter name:');
  if (name === null || name === '') name = 'anonymous';
  const newScore = { score, name };
  highScores.push(newScore);
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(NO_OF_HIGH_SCORES);
  localStorage.setItem(HIGH_SCORES, JSON.stringify(highScores));
};

// show score
const showHighScores = () => {
  for (let i = 0; i < highScores.length; i++) {
    $('.score').append(
      $('<p></p>').text(`${highScores[i].name} - ${highScores[i].score}`)
    );
  }
};

// save score to file
const saveTextToFile = () => {
  let text = '';
  for (let i = 0; i < highScores.length; i++) {
    text += `${highScores[i].name} - ${highScores[i].score} | `;
  }
  var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, 'wyniki.txt');
};

// set board size from input
const setBoardSize = () => {
  $inputValue = $('.button--input').val();
  let boardSize;
  if ($inputValue > 4) boardSize = 4;
  else if ($inputValue < 2) boardSize = 2;
  else boardSize = $inputValue;
  return boardSize;
};

// set and style board of cards
const setGridBoard = (boardSize) => {
  $('.board').css({
    display: 'grid',
    'grid-template-columns': `repeat(${boardSize},auto)`,
    'grid-template-rows': `repeat(${boardSize},auto)`,
    gap: '10px',
    'justify-items': 'center',
    'align-items': 'center',
  });
};

// set width of board
const setWidthBoard = (boardSize) => {
  $('.board').css({
    width: `calc(${$('.card').css('width')} * ${boardSize})`,
  });
};

// push card image id to arr
const pushCardImageId = (cardImageId, randomedImages, e) => {
  cardImageId.push(randomedImages[e.currentTarget.dataset.cardnumber - 1]);
};

// push card number of board to arr
const pushCardNumber = (cardNumber, e) => {
  cardNumber.push(e.currentTarget.dataset.cardnumber);
};

// win game
const winGame = (points, highScores) => {
  $('.button--reset').text('back');
  setTimeout(() => {
    saveHighScore(points, highScores);
  }, 500);
};

//================================================
// GAME INIT

//init game
const initGame = () => {
  const boardSize = setBoardSize();
  const maxPoints = 2 ** boardSize / 2;
  createGameStats();

  $('.button--reset').toggleClass('button--active');
  $('.button--input').toggleClass('button--active');
  $('.gameStat').toggleClass('gameStat--active');

  const randomedImages = shuffle(
    myRandomInts(Math.floor(boardSize * boardSize), 20)
  );

  setGridBoard(boardSize);

  // create random cards
  for (let i = 1; i <= boardSize * boardSize; i++) {
    createCard(randomedImages[i - 1], i);
  }

  setWidthBoard(boardSize);

  //card click event

  $('.card').on('click', (e) => {
    const cardId = e.currentTarget.dataset.cardnumber;

    if ($(`[data-cardNumber=${cardId}]`).attr('disabled')) {
      return;
    }

    //click count
    if (clickerCount === 2) {
      clickerCount = 1;
    } else {
      clickerCount++;
    }

    if (clickerCount === 1) {
      //== first pick card ==
      //========================

      // add number of image to arr
      pushCardImageId(cardImageId, randomedImages, e);

      // add number of card to arr
      pushCardNumber(cardNumber, e);

      rotateCard(cardId);
      disabled(cardId);
    } else if (clickerCount === 2) {
      //== second pick card ==
      //========================

      // add number of image to arr
      pushCardImageId(cardImageId, randomedImages, e);

      // add number of card to arr
      pushCardNumber(cardNumber, e);

      // card annim
      rotateCard(cardId);

      if (cardImageId[0] === cardImageId[1]) {
        //== good picked 2 cards ==
        //========================

        points += 1;
        // disable picked cards
        disabled(cardNumber[0]);
        disabled(cardNumber[1]);
        // change score number
        $('.nowScore__count').text(points);
      } else {
        //== bad picked 2 cards ==
        //========================

        // undisable picked cards
        undisabled(cardNumber[0]);
        undisabled(cardNumber[1]);

        // temp card fo timeout
        let card1 = cardNumber[0];
        let card2 = cardNumber[1];

        // rotate cards anim
        setTimeout(() => {
          rotateCard(card1);
          rotateCard(card2);
        }, 750);
      }
      // reset
      cardImageId.splice(0, cardImageId.length);
      cardNumber.splice(0, cardNumber.length);
    }

    // win game
    if (points === maxPoints) {
      winGame(points, highScores);
    }
  });
};

// ============================================
// EVENTS

//init click event
$('.button--init').on('click', (e) => {
  initGame();
  $('.button--init').toggleClass('button--active');
  $('.button--score').toggleClass('button--active');
  $('.button--save').toggleClass('button--active');
});

//score click event
$('.button--score').on('click', () => {
  if (!scoreShowed) {
    $('.page').append($('<div></div>', { class: 'score' }));
    $('.score').append(
      $('<h1></h1>', { class: 'score__title', text: 'Best scores:' })
    );
    scoreShowed = true;
    showHighScores();
  }
  $('.score').toggleClass('score--active');
});

//reset click event
$('.button--reset').on('click', () => {
  location.reload();
});

//save click event
$('.button--save').on('click', () => {
  saveTextToFile();
});
