const altImage = (imgId = 0) => {
  const alts = [
    'logo',
    'renifer',
    'papuga',
    'kot',
    'pies',
    'lew',
    'kucyk',
    'panda',
    'koala',
    'miś',
    'lis',
    'krowa',
    'tygrys',
    'niedźwiedź polarny',
    'delfin',
    'kura',
    'kaczka',
    'meduza',
    'jeleń',
    'rekin',
    'bóbr',
  ];
  return alts[imgId];
};

const createPath = (imgId) => {
  let path = '';
  if (imgId === 0) {
    path = 'assets/img/logo.png';
  } else {
    path = `assets/img/animal_${imgId}.png`;
  }
  return path;
};

const createCard = (imgId = 0, cardId) => {
  const $imgLogo = $('<img>', {
    src: createPath(0),
    class: 'card__image card__image--logo card__image--active',
    alt: altImage(0),
    draggable: false,
  });

  const $imgAnimal = $('<img>', {
    src: createPath(imgId),
    class: 'card__image card__image--animal',
    alt: altImage(imgId),
    draggable: false,
  });

  const $card = $('<div></div>')
    .attr({ 'data-cardNumber': `${cardId}`, class: 'card' })
    .append($imgLogo)
    .append($imgAnimal);

  $('.board').append($card);
  // return `card${cardId}`;
};
