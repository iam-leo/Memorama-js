const { ipcRenderer } = require('electron');
const ipc = ipcRenderer;

//Evento minimizar ventana
minBtn.addEventListener('click', () => {
    ipc.send('minApp');
});

//Evento maximizar ventana
maxBtn.addEventListener('click', () => {
    ipc.send('maxApp');
});

//Evento cerrar ventana
closeBtn.addEventListener('click', () => {
    ipc.send('closeApp');
});