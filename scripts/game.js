var sequence = []; //variable de tipo array para almacenar la secuencia de colores
var playerSequence = []; //variable array para almacenar la secuencia del jugador
var lvl = 0; //nivle inicial del juego
var colors = ['Red','Green','Blue','Yellow']; //colores disponibles
var btnPlay = document.getElementById('btnPlay'); //boton para iniciar el juego
var btnRestart = document.getElementById('btnRestart'); //boton para reiniciar la partida
var txtPlayerName = document.getElementById('btnName'); //boton que muestra el nombre del jugador
var PlayerScore = 0; //puntaje inicial

window.addEventListener('load',function(){
  var modalContact = this.document.getElementById('modalContact');
  modalContact.style.display = 'none';

  var modalName = this.document.getElementById('modalName');
  modalName.style.display = 'none';

  var btnGetName = document.getElementById('btnCompleteName');
  btnGetName.addEventListener('click', hideModalName);

  function hideModalName(){ //oculta el modal inicial del nombre
    var modalName = getElementById('modalName');
    var playerNameText = document.getElementById('namePlayer');
    var playerName = playerNameText.value;

    if(playerName.length < 3){
      alert('El nombre debe contener como minimo 3 letras.');
      return;
    }
    else{
      var btnShowName = document.getElementById('btnName');
      modalName.style.display = 'none';
      btnShowName.textContent = 'Jugador: ' + playerName; //obtiene en el boton el nombre ingresado
    }

    var btnContact = document.getElementById('btnContact');
    btnContact.addEventListener('click', showModalContact);

    function showModalContact(){ //muestra el modal de contacto
      modalContact.style.display = 'block';
    }

    var btnCancel = document.getElementById('btnCancel');
    btnCancel.addEventListener('click', hideModalContact);

    function hideModalContact(){ //oculta el model de contacto
      modalContact.style.display = 'none';
    }

    var btnSendEmail = document.getElementById('btnSend');
    btnSendEmail.addEventListener('click', SendEmail);

    function SendEmail(){
      var txtName = document.getElementById('nameContact');
      var name = txtName.value;
      var txtTransmitter = document.getElementById('mailContact');
      var transmitter = txtTransmitter.value;
      var txtMessage = document.getElementById('txtMessage');
      var message = txtMessage.value;

      var validateName = /^[a-zA-Z0-9\s]+$/;
      if(!validateName.test(name)) {
        alert('El nombre debe ser alfanumerico');
        return;
      }

      var validateEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!validateEmail.test(transmitter)){
        alert('El email ingresado es invalido');
        return;
      }

      if(message.length <= 5){
        alert('El mensaje debe tener al menos 5 caracteres en su cuerpo');
        return;
      }

      var Mail = 'mailto:' + transmitter + '?subjet' + encodeURIComponent(name) + '&body=' + encodeURIComponent(message);

      window.location.href = Mail;

      modalContact.style.display = 'none';
    }
  }

})