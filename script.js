// Referencias a los interruptores y botones
const stateSensor = document.getElementById("state-sensor");
const stateRFID = document.getElementById("state-rfid");
const backendUrl = 'https://sisecurity.onrender.com/'; // Reemplaza con tu URL del backend

function updateSensorState() {
  axios.get(`${backendUrl}componente-estado/pir`)
    .then(response => {
      const data = response.data;
      if (data.state === true) {
        stateSensor.textContent = 'Persona sospechosa detectada';
      } else if (data.state === false) {
        stateSensor.textContent = 'Apagado';
      } else {
        stateSensor.textContent = 'Estado desconocido';
      }
    })
    .catch(error => {
      console.error('Error al obtener el estado:', error);
    });
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

  axios.get('/api/sensor/dht11')
      .then(response => {
          const { temperature, humidity } = response.data; // Espera que el backend devuelva un objeto con estos datos
          temperatureElement.textContent = temperature;
          humidityElement.textContent = humidity;
      })
      .catch(error => {
          console.error('Error al obtener los datos del sensor DHT11:', error);
      });
}

// Configurar actualizaciones en tiempo real (cada 5 segundos)
setInterval(fetchSensorData, 5000);

// Llamar automáticamente la función al cargar la página
document.addEventListener('DOMContentLoaded', fetchSensorData);
