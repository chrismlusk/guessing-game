class Game {
  constructor() {
    this.winningNum = this.generateWinningNum();
    this.userGuess = null;
    this.pastGuesses = [];
    this.headerTitleOne = '';
    this.headerTitleTwo = '';
    this.headerEmoji = '';
    this.headerMessage = '';
    this.headerHint = '';
    this.resultClass = '';
    this.resultEmoji = '';
    this.hintRange = null;

    console.log(`New game created with ${this.winningNum} as the answer.`);
  }

  generateWinningNum() {
    return Math.floor(Math.random() * 100 + 1);
  }

  submitUserGuess(num) {
    let valid = this.isGuessValid(num);
    let prior = this.isPriorGuess(num);

    if (!valid) {
      this.headerTitleOne = `Error!`;
      this.headerTitleTwo = `Pick again`;
      this.headerEmoji = `🚫`;
      this.headerMessage = `Whoa hold on now. That number is invalid.`;
      this.headerHint = ``;
      return;
    }

    if (prior) {
      this.headerTitleOne = `You already`;
      this.headerTitleTwo = `guessed ${num}`;
      this.headerEmoji = `🙀`;
      this.headerMessage = `Pick a different number to continue playing.`;
      this.headerHint = ``;
      return;
    }

    if (valid && !prior) {
      this.userGuess = num;
      this.pastGuesses.push(this.userGuess);
      this.setGuessOutput();
    }
  }

  isGuessValid(num) {
    return !(num < 1 || num > 100 || isNaN(num));
  }

  isPriorGuess(num) {
    return this.pastGuesses.includes(num);
  }

  setGuessOutput() {
    let result = this.getDifference();
    let guessNum = `Guess #${this.pastGuesses.length}:`;

    switch (result) {
      case 'winner':
        this.headerTitleOne = `You did it!`;
        this.headerTitleTwo = `Congrats!`;
        this.headerEmoji = `👏🏽👏🏽👏🏽`;
        this.headerMessage = `We have a winner!`;
        this.headerHint = `What a great guesser!`;
        this.resultClass = `is-active is-correct`;
        this.resultEmoji = `🎉🎉🎉`;
        return true;
      case 'hot':
        this.headerTitleOne = guessNum;
        this.headerTitleTwo = `You're hot!`;
        this.headerEmoji = `👉🏽`;
        this.headerMessage = `Watch out! You're playing with fire!!!`;
        this.headerHint = this.isLower();
        this.resultClass = `is-active is-incorrect is-hot`;
        this.resultEmoji = `🔥🔥️🔥`;
        this.hintRange = 8;
        break;
      case 'warm':
        this.headerTitleOne = guessNum;
        this.headerTitleTwo = `OK not bad`;
        this.headerEmoji = `👉🏽`;
        this.headerMessage = `You're warm — but not warm enough.`;
        this.headerHint = this.isLower();
        this.resultClass = `is-active is-incorrect is-warm`;
        this.resultEmoji = `🌼🌼🌼`;
        this.hintRange = 16;
        break;
      case 'cold':
        this.headerTitleOne = guessNum;
        this.headerTitleTwo = `You're cold`;
        this.headerEmoji = `👉🏽`;
        this.headerMessage = `You must feel pretty chilly, huh?`;
        this.headerHint = this.isLower();
        this.resultClass = `is-active is-incorrect is-cold`;
        this.resultEmoji = `🌨️🌨️🌨️`;
        this.hintRange = 32;
        break;
      default:
        this.headerTitleOne = guessNum;
        this.headerTitleTwo = `Brrrrrrr!`;
        this.headerEmoji = `👉🏽`;
        this.headerMessage = `You are absolutely frozen to the bone.`;
        this.headerHint = this.isLower();
        this.resultClass = `is-active is-incorrect is-frozen`;
        this.resultEmoji = `❄️❄️❄️`;
        this.hintRange = 64;
        break;
    }

    if (this.pastGuesses.length === 5) {
      this.headerTitleOne = `Bummer...`;
      this.headerTitleTwo = `Game over!`;
      this.headerEmoji = `😞`;
      this.headerMessage = `The correct number was ${this.winningNum}.`;
      this.headerHint = `Want to play again?`;
    }
  }

  getDifference() {
    let diff = Math.abs(this.userGuess - this.winningNum);

    if (diff === 0) return 'winner';
    if (diff < 10)  return 'hot';
    if (diff < 25)  return 'warm';
    if (diff < 50)  return 'cold';

    return 'frozen';
  }

  isLower() {
    return this.userGuess < this.winningNum ? 'Guess higher!' : 'Guess lower!';
  }

  getHint() {
    let max, min;

    if (this.winningNum < 0 + this.hintRange) {
      max = this.winningNum + this.hintRange;
      min = this.winningNum;
    } else if (this.winningNum > 100 - this.hintRange) {
      max = this.winningNum;
      min = this.winningNum - this.hintRange;
    } else {
      max = this.winningNum + (this.hintRange / 2);
      min = this.winningNum - (this.hintRange / 2);
    }

    let arr = [this.winningNum];

    while (arr.length < 3) {
      arr.push(Math.floor(Math.random() * (max - min + 1) + min));
      arr = arr.reduce((x, y) => x.includes(y) ? x : [...x, y], []);

      if (!arr.includes(this.winningNum)) {
        arr[0] = this.winningNum;
      }
    }

    return this.shuffle(arr);
  }

  shuffle(arr) {
    for (let i = arr.length - 1; i >= 0; i--) {
      let randomIndex = Math.floor(Math.random() * (i + 1));
      let itemAtIndex = arr[randomIndex];

      arr[randomIndex] = arr[i];
      arr[i] = itemAtIndex;
    }

    return arr;
  }
}

$(() => {
  let game = new Game();

  const $headerTitleOne = $('.header-title .one');
  const $headerTitleTwo = $('.header-title .two');
  const $headerEmoji = $('.header-text .emoji');
  const $headerMessage = $('.header-text .message');
  const $headerHint = $('.header-text .hint');
  const $userForm = $('.js-user-form');
  const $guessInput = $('.js-input-guess');
  const $guessBtn = $('.js-submit-guess');
  const $hintBtn = $('.js-get-hint');
  const $resetBtn = $('.js-reset-game');

  $userForm
    .on('keypress', '.js-input-guess', function(e) {
      let keycode = e.keyCode ? e.keyCode : e.which;
      if (keycode === 13) submitGuess();
    })
    .on('click', '.js-submit-guess', submitGuess)
    .on('click', '.js-get-hint', showHint)
    .on('click', '.js-reset-game', resetGame);

  function submitGuess() {
    $hintBtn.prop('disabled', false);
    checkGuess();
    displayUserGuess();
  }

  function checkGuess() {
    let guess = parseInt($guessInput.val(), 10);
    $guessInput.val('');

    let isValid = game.isGuessValid(guess);
    let isPrior = game.isPriorGuess(guess);

    if (!isValid || isPrior) {
      makeInvalid();
    } else {
      $('.is-invalid').removeClass('is-invalid');
    }

    game.submitUserGuess(guess);
  }

  function displayUserGuess() {
    let $thisResult = $('.user-guess-row div:nth-child(' + game.pastGuesses.length + ') .user-guess-result');

    if (game.pastGuesses.length < 5 && game.userGuess !== game.winningNum) {
      $headerEmoji.addClass('is-animated');
      setTimeout(() => { $headerEmoji.removeClass('is-animated')}, 500);
    }

    $headerTitleOne.text(game.headerTitleOne);
    $headerTitleTwo.text(game.headerTitleTwo);
    $headerEmoji.text(game.headerEmoji);
    $headerMessage.text(game.headerMessage);
    $headerHint.text(game.headerHint);

    $thisResult
      .addClass(game.resultClass)
      .children('.user-guess-number')
      .text(game.userGuess);
    $thisResult
      .children('.user-guess-emoji')
      .text(game.resultEmoji);

    if ($thisResult.hasClass('is-correct') || game.pastGuesses.length === 5) {
      endGame();
    }
  }

  function makeInvalid() {
    $userForm.addClass('is-invalid is-incorrect');
    $guessInput.addClass('is-invalid');

    // remove so back-to-back incorrect guesses trigger animation
    setTimeout( () => { $userForm.removeClass('is-incorrect')}, 500);
  }

  function showHint() {
    $hintBtn.prop('disabled', true);
    $headerEmoji.text('');
    $headerMessage.text('');

    if (game.pastGuesses.length > 0) {
      let hints = game.getHint();
      $headerHint.text(
        `🔮 I see the number ${hints[0]}, ${hints[1]}, or ${hints[2]} in your future.`
      );
    } else {
      $headerHint.text(
        `🙄 C'mon now. At least give it a try before you get a hint!`
      );
    }

    $guessInput.focus();
  }

  function endGame() {
    $guessInput.prop('disabled', true);
    $hintBtn.prop('disabled', true);
    $guessBtn.prop('disabled', true);
    $resetBtn.focus();
    $('.is-invalid').removeClass('is-invalid');
    $('.user-guess-result').not('.is-correct').removeClass('is-active');
  }

  function resetGame() {
    $guessInput.prop('disabled', false);
    $hintBtn.prop('disabled', false);
    $guessBtn.prop('disabled', false);

    $('.is-invalid').removeClass('is-invalid');
    $('.user-guess-result').attr('class', 'user-guess-result');
    $('.user-guess-number').text('?');

    $headerTitleOne.text(`Guess me`);
    $headerTitleTwo.text(`if you can!`);
    $headerEmoji.text('👀');
    $headerMessage.text(`Oh, so you want to try again?`);
    $headerHint.text(`All right let's go!`);

    $guessInput.focus();

    game = new Game();
  }
});
