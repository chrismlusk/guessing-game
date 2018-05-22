class Game {
  constructor() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
  }

  difference() {
    return Math.abs(this.playersGuess - this.winningNumber);
  }

  isLower() {
    return this.playersGuess < this.winningNumber;
  }

  playersGuessSubmission(num) {
    if (num < 1 || num > 100 || isNaN(num)) throw 'That is an invalid guess.';
    this.playersGuess = num;
    return this.checkGuess();
  }

  checkGuess() {
    if (this.playersGuess === this.winningNumber) return 'You Win!';

    if (this.pastGuesses.includes(this.playersGuess)) {
      return 'You have already guessed that number.';
    }

    this.pastGuesses.push(this.playersGuess);

    if (this.pastGuesses.length === 5) return 'You Lose.'

    let diff = this.difference();

    if (diff < 10) return `You're burning up!`;
    if (diff < 25) return `You're lukewarm.`;
    if (diff < 50) return `You're a bit chilly.`;

    return `You're ice cold!`;
  }

  provideHint() {
    return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()]);
  }
}

const generateWinningNumber = () => Math.floor(Math.random() * 100 + 1);

const shuffle = arr => {
  for (let i = arr.length - 1; i >= 0; i--) {
    let randomIndex = Math.floor(Math.random() * (i + 1));
    let itemAtIndex = arr[randomIndex];

    arr[randomIndex] = arr[i];
    arr[i] = itemAtIndex;
  }

  return arr;
}

const newGame = () => {
  new Game();

  console.log('New game generated!');
}

const submitGuess = game => {
  let guess = $('#userGuess').val();
  $('#userGuess').val('');
  var output = game.playersGuessSubmission(parseInt(guess, 10));
  $('.header-message').text(output);

  console.log(`User has guessed ${guess}.`);
};

$(document).ready(function() {
  let game = new Game();

  $('.js-submit-user-guess').on('click', function() {
    submitGuess(game);
  });

  $('#userGuess').on('keypress', function(event) {
    if (event.which === 13) {
      submitGuess(game);
    }
  });

  $('.js-get-hint').on('click', function() {
    let hints = game.provideHint();
    $('.header-message').text(`The winning number is ${hints[0]}, ${hints[1]}, or ${hints[2]}`);
  });

  $('.js-reset-game').on('click', function() {
    game = newGame();
    // $('.header-message').text('Play the Guessing Game!');
    // $('#subtitle').text('Guess a number between 1-100!');
    // $('.guess').text('-');
    // $('#hint, #submit').prop('disabled', false);
  });
});
