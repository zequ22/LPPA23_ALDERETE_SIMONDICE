'use strict'

// Espera hasta que la página haya cargado completamente
window.addEventListener('load', function () {

  // Declaración de variables
  var sequence = [];
  var lvl = 0;
  var colors = ['Red', 'Green', 'Blue', 'Yellow'];
  var btnColors = document.querySelectorAll('.deviceSimon > div');
  var btnStart = document.getElementById('btnPlay');
  var userSequence = [];
  var waitingAnswer = false;
  var playerScore = 0;
  var gameInProgress = false;

  // Oculta el modal de contacto al cargar la página
  var modalContact = document.getElementById('modalContact');
  modalContact.style.display = 'none';

  // Al hacer click en "Continuar" en el modal del Nombre, se oculta el modal y guardar el nombre del jugador
  var btnGetName = document.getElementById('btnCompleteName');
  btnGetName.addEventListener('click', hideModalName);

  // Ocultar el modal de Nombre y guardar el nombre del jugador
  function hideModalName() {
    var modalName = document.getElementById('modalName');
    var playerNameText = document.getElementById('namePlayer');
    var playerName = playerNameText.value;
  
    if (playerName.length < 3) {
      alert('El nombre debe contener como mínimo 3 letras.');
      return;
    } else {
      var btnShowName = document.getElementById('btnName');
      modalName.style.display = 'none';
      btnShowName.textContent = 'Jugador: ' + playerName;
    }
  }
    
  // Muestra el modal de contacto 
  var btnContact = document.getElementById('btnContact');
  btnContact.addEventListener('click', showModalContact);
  
  function showModalContact() {
    modalContact.style.display = 'block';
    btnStart.disabled=true;
  }

  // Al hacer click en "Cancelar" en el modal de contacto se oculta
  var btnCancel = document.getElementById('btnCancel');
  btnCancel.addEventListener('click', hideModalContact);

  function hideModalContact() {
    modalContact.style.display = 'none';
    btnStart.disabled=false;
  }

  // Al hacer click en "Enviar" del formulario de contacto valida y envia el correo
  var btnSendEmail = document.getElementById('btnSend');
  btnSendEmail.addEventListener('click', sendEmail);

  function sendEmail() {
    var txtTransmitter = document.getElementById('emailContact');
    var transmitter = txtTransmitter.value;
    var txtName = document.getElementById('nameContact');
    var name = txtName.value;
    var txtMessage = document.getElementById('txtMessage');
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
  
  // Función para mostrar el color en pantalla
  function showColor(color) {
    btnColors.forEach(function (square) {
      var colorSquare = square.dataset.color;
      if (colorSquare === color) {
        square.classList.add('active');
        setTimeout(function () {
          square.classList.remove('active');
        }, 500);
      }
    });
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

  // Funcion para comenzar el juego
  function startGame() {
    var deviceSimon = document.querySelector('.deviceSimon');
    deviceSimon.style.pointerEvents = 'auto';

    lvl++;
    btnStart.textContent = 'Nivel ' + lvl;
    var randomColor = colors[Math.floor(Math.random() * colors.length)];
    sequence.push(randomColor);
    btnStart.disabled = true;

    gameInProgress = true;
    showSequence();
  }

  // Al hacer click al botón "Comenzar" inicia el juego
  btnStart.addEventListener('click', function () {
    startGame();
  });

  // Función para mostrar el modal de "Perdiste" con el puntaje obtenido
  function showModalLose(lvlObtained, points) {
    var modalLose = document.getElementById('modalLose');
    var lvlLoseText = document.getElementById('levelLose');
    var scoreLoseText = document.getElementById('scoreLose');
    lvlLoseText.textContent = lvlObtained;
    scoreLoseText.textContent = points;
    modalLose.style.display = 'block';
    gameInProgress = false;

    // Cerrar el modal de "Perdiste"
    var btnCloseModal = document.getElementById('btnCloseModal');
    btnCloseModal.addEventListener('click', function () {
      modalLose.style.display = 'none';
      btnStart.disabled = false;
    });
    // Se reinicia la partida desde el modal de "Perdiste" al hacer click en el boton
    var btnRestart = document.getElementById('btnRestart');
    btnRestart.addEventListener('click', function () {
      modalLose.style.display = 'none';
      playerScore = 0;
      lvl = 0;
      sequence = [];
      startGame();
    });
  };

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
  };

  // Agrega un evento click a cada botón de colores para validar la selección del jugador
  btnColors.forEach(function (square) {
    square.addEventListener('click', validateUserSelection);
  });
});