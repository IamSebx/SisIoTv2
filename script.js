// Referencias a los interruptores y botones
const stateSensor = document.getElementById("state-sensor");
const stateRFID = document.getElementById("state-rfid");
const stateDht = document.getElementById("state-dht");
const stateDoor = document.getElementById("state-door")
const backendUrl = 'https://sisecurity.onrender.com/'; // Reemplaza con tu URL del backend
let statePir1; let statePir2;

function updateSensorState() {
  axios.get(`${backendUrl}componente-estado/pir`)
    .then(response => {
      statePir1 = response.data.state;
    })
    .catch(error => {
      console.error('Error al obtener el estado:', error);
    });
    axios.get(`${backendUrl}componente-estado/pir2`)
    .then(response => {
      statePir2 = response.data.state;
    })
    .catch(error => {
      console.error('Error al obtener el estado:', error);
    });
    console.log(statePir1, statePir2)

    if (statePir1 === true || statePir2 === true) {
      stateSensor.textContent = 'Persona sospechosa detectada';
    } else if (statePir1 === false && statePir2 === false) {
      stateSensor.textContent = 'Apagado';
    } else {
      stateSensor.textContent = 'Estado desconocido';
    }
}

// Llama a la función cada 1 segundo
setInterval(executeUpdateSensorState, 1000);

function executeUpdateSensorState(){
  if(stateRFID.textContent == 'Desactivado'){
    stateSensor.textContent = 'Apagado'
  } else{
    updateSensorState()
  }
}

function updateRFIDState() {
  axios.get(`${backendUrl}componente-estado/rfid`)
    .then(response => {
      const data = response.data;
      if (data.state === true) {
        stateRFID.textContent = 'Desactivado';
      } else if (data.state === false) {
        stateRFID.textContent = 'Activado';
      } else {
        stateRFID.textContent = 'Estado desconocido';
      }
    })
    .catch(error => {
      console.error('Error al obtener el estado:', error);
    });
}

// Llama a la función cada 1 segundo
setInterval(updateRFIDState, 1000);


function toggleLED(action) {
  let leds = [1,2,3,4]
  leds.forEach(led => {
    url = action === 'on' ? `${backendUrl}componente-estado/led${led.toString()}?state=true` : `${backendUrl}componente-estado/led${led.toString()}?state=false`;
    // Usar Axios para enviar la solicitud al backend
    axios.post(url)
      .then(response => {
        console.log(`LED ${action === 'on' ? 'Encendido' : 'Apagado'}:`, response.data);
      })
      .catch(error => {
        console.error(`Error al ${action === 'on' ? 'encender' : 'apagar'} el LED:`, error);
      });
  })
}

// Función para obtener datos del sensor DHT11 desde el backend
function fetchSensorData() {
  const temperatureElement = document.getElementById('temperature-value');
  const humidityElement = document.getElementById('humidity-value');
  axios.get(`${backendUrl}componente-valor/dht-temp`)
    .then(response => {
          const data = response.data; // Espera que el backend devuelva un objeto con estos datos
          temperatureElement.textContent = data.value;
  })
    .catch(error => {
          console.error('Error al obtener los datos del sensor DHT11:', error);
  });

  axios.get(`${backendUrl}componente-valor/dht-hum`)
    .then(response => {
      const data = response.data;
      humidityElement.textContent = data.value;
    })
    .catch(error => {
      console.error("Error al obtener los datos del sensor DHT11:", error)
    })

    if(temperatureElement != "" && humidityElement != ""){
      stateDht.textContent = "Activo";
    } else{
      stateDht.textContent = "Inactivo";
    }
}

// Configurar actualizaciones en tiempo real (cada segundo)
setInterval(fetchSensorData, 1000);

function updateDoorState(){
  axios.get(`${backendUrl}componente-estado/puerta`)
  .then(response => {
    const data = response.data;
    if(data.state == true){
      stateDoor.textContent = "Abierta"
    } else{
      stateDoor.textContent = "Cerrada"
    }
  })
  .catch(error => {
    console.error("Error al obtener los datos de la puerta:", error);
  })
}

setInterval(updateDoorState, 1000)

// Llamar automáticamente la función al cargar la página
document.addEventListener('DOMContentLoaded', fetchSensorData);










function toggleBuzzer(action) {
  const url = action === 'on' 
      ? `${backendUrl}componente-estado/buzzer?state=true` 
      : `${backendUrl}componente-estado/buzzer?state=false`;

  axios.post(url)
      .then(response => {
          console.log(`Buzzer ${action === 'on' ? 'encendido' : 'apagado'}:`, response.data);
      })
      .catch(error => {
          console.error(`Error al ${action === 'on' ? 'encender' : 'apagar'} el buzzer:`, error);
      });
}



// Función para controlar LEDs y registrar eventos
function toggleIndividualLED(ledNumber, action) {
  const ledState = action === "on" ? "Encendido" : "Apagado";
  
  // Aquí iría el código para encender/apagar el LED físicamente
  console.log(`LED ${ledNumber} ${ledState}`);
  
  // Registrar el evento en el historial
  logEvent(`LED ${ledNumber} fue ${ledState}`);
}

// Función para registrar eventos en el historial
function logEvent(message) {
  const eventLog = document.getElementById("event-log");
  const timestamp = new Date().toLocaleTimeString(); // Hora actual
  const eventItem = document.createElement("li");
  eventItem.textContent = `[${timestamp}] ${message}`;
  eventLog.prepend(eventItem); // Agrega el evento al inicio de la lista
}