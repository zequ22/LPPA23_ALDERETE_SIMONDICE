// Declaración de variables
var sequence = [];
var lvl = 0;
var colors = ['Red', 'Green', 'Blue', 'Yellow'];
var btnColors = document.querySelectorAll('.deviceSimon > div');
var btnStart = document.getElementById('btnPlay');
var userSequence = [];
var waitingAnswer = false;
var playerScore = 0;

// Espera hasta que la página haya cargado completamente
window.addEventListener('load', function () {

  // Oculta los modals de contacto al cargar la página
  var modalContact = document.getElementById('modal-contact');
  modalContact.style.display = 'none';

  // Al hacer click en "Continuar" en el modal de nombre se oculta el modal y guardar el nombre del jugador
  var btnGetName = document.getElementById('btn-complete-name');
  btnGetName.addEventListener('click', hideModalName);

  // Función para ocultar el modal de nombre y guardar el nombre del jugador
  function hideModalName() {
    var modalNames = document.getElementById('modal-names');
    var playerNameText = document.getElementById('name-player');
    var playerName = playerNameText.value;
  
    if (playerName.length < 3) {
      alert('El nombre debe contener como mínimo 3 letras.');
      return;
    } else {
      var btnShowName = document.getElementById('btnName');
      modalNames.style.display = 'none';
      btnShowName.textContent = 'Jugador: ' + playerName;
    }
  
    // Muestra el modal de contacto 
    var btnContact = document.getElementById('btnContact');
    btnContact.addEventListener('click', showModalContact);
  
    function showModalContact() {
      modalContact.style.display = 'block';
      btnStart.disabled=true;
    }

    // Al hacer click en "Cancelar" en el modal de contacto se oculta
    var btnCancel = document.getElementById('btn-cancel');
    btnCancel.addEventListener('click', hideModalContact);

    function hideModalContact() {
      modalContact.style.display = 'none';
      btnStart.disabled=false;
    }

    // Al hacer click en "Enviar" del formulario de contacto valida y envia el correo
    var btnSendEmail = document.getElementById('btn-send');
    btnSendEmail.addEventListener('click', sendEmail);

    function sendEmail() {
      var txtTransmitter = document.getElementById('mail-contact');
      var transmitter = txtTransmitter.value;
      var txtName = document.getElementById('name-contact');
      var name = txtName.value;
      var txtMessage = document.getElementById('txt-message');
      var message = txtMessage.value;

      var validateName = /^[a-zA-Z0-9\s]+$/;
      if (!validateName.test(name)) {
        alert('El nombre debe ser alfanumérico.');
        return;
      }

      var validateEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!validateEmail.test(transmitter)) {
        alert('El email ingresado es inválido.');
        return;
      }

      if (message.length <= 5) {
        alert('El mensaje debe tener al menos 5 caracteres en su cuerpo.');
        return;
      }

      var mailTo = 'mailto:' + transmitter + '?subject=' + encodeURIComponent(name) + '&body=' + encodeURIComponent(message);
      window.location.href = mailTo;
      modalContact.style.display = 'none';

      btnStart.disabled=false;
    }
  }

  // Al hacer click al botón "Comenzar" inicia el juego
  btnStart.addEventListener('click', function () {
    startGame();
  });

  function startGame() {
    lvl++;
    btnStart.textContent = 'Nivel ' + lvl;
    var randomColor = colors[Math.floor(Math.random() * colors.length)];
    sequence.push(randomColor);
    btnStart.disabled = true;

    showSequence();
  }

  // Función para mostrar la secuencia de colores al jugador
  function showSequence() {
    var i = 0;
    var intervalShowSequence = setInterval(function () {
      var actualColor = sequence[i];
      showColor(actualColor);
      i++;
      if (i >= sequence.length) {
        clearInterval(intervalShowSequence);
        waitingAnswer = true;
      }
    }, 1000);

    userSequence = sequence.slice();
  }

  // Función para mostrar el color en pantalla (efecto de iluminación)
  function showColor(color) {
    btnColors.forEach(function (square) {
      var colorSquare = square.dataset.color;
      if (colorSquare === color) {
        square.style.backgroundColor = color;
        setTimeout(function () {
          square.style.backgroundColor = '';
        }, 500);
      }
    });
  }

  // Función para validar la selección del jugador y actualizar el puntaje
  function validateUserSelection(event) {
    if (waitingAnswer) {
      var colorSelected = event.target.dataset.color;
      var colorExpected = userSequence.shift();

      if (colorSelected === colorExpected) {
        var btnScore = document.getElementById('btnScore');
        playerScore += 5;
        btnScore.textContent = 'Score: ' + playerScore;
        if (userSequence.length === 0) {
          waitingAnswer = false;
          setTimeout(function () {
            startGame();
          }, 1000);
        }
      } else {
        showModalLose(lvl, playerScore);
        lvl = 0;
        sequence = [];
        btnStart.textContent = 'Jugar!';
        btnStart.disabled = true;
        var btnPoints = document.getElementById('btnScore');
        btnPoints.textContent = 'Puntaje: 0';
        playerScore = 0;
      }
    }
  }

  // Agrega un evento click a cada botón de colores para validar la selección del jugador
  btnColors.forEach(function (square) {
    square.addEventListener('click', validateUserSelection);
  });

  // Función para mostrar el modal de "Perdiste" con el puntaje obtenido
  function showModalLose(lvlObtained, points) {
    var modalLose = document.getElementById('modal-lose');
    var lvlLoseText = document.getElementById('level-lose');
    var scoreLoseText = document.getElementById('score-lose');
    lvlLoseText.textContent = lvlObtained;
    scoreLoseText.textContent = points;
    modalLose.style.display = 'block';

    // Cierra el modal de "Perdiste"
    var btnCloseModal = document.getElementById('btn-close-modal');
    btnCloseModal.addEventListener('click', function () {
      modalLose.style.display = 'none';
      btnStart.disabled = false;
    });

    // Se reinicia la partida desde el modal de "Perdiste" al hacer click en el boton
    var btnRestart = document.getElementById('btn-restart');
    btnRestart.addEventListener('click', function () {
      modalLose.style.display = 'none';
      playerScore = 0;
      lvl = 0;
      sequence = [];
      startGame();
    });
  }
});
