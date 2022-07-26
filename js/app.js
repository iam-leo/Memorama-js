let figuras = [];
let selecciones = [];
let contadorPares = 0,
    cantMovimientos = 0,
    segundos = 0,
    minutos = 0;
let timeInterval;
const barWindow = document.querySelector('#bar-window');
const titulo = document.querySelector('#titulo');
const score = document.querySelector('#score');
const movimientos = document.querySelector('#movimientos');
const pares = document.querySelector('#pares');
const spanSegundos = document.querySelector('#segundos');
const spanMinutos = document.querySelector('#minutos')
const tablero = document.querySelector('#tablero');
const contenedorBtn = document.querySelector('.content-btn');
const btnNuevoJuego = document.querySelector('#nuevo-juego');
const modal = document.querySelector('#modal');
const modalMov = document.querySelector('#modal-movimientos');
const modalTime = document.querySelector('#modal-tiempo');
const modalPuntaje = document.querySelector('#modal-puntaje');
const btnsSonido = document.querySelector('#contenedor-btn-sonido');
const btnMusicOnOff = document.querySelector('#musicOnOff');
const btnSoundsOnOff = document.querySelector('#soundsOnOff');

//Sonidos y musica del juego
const audioStart = new Audio('./sounds/start.wav');
const audioOk = new Audio('./sounds/ok.wav');
const audioFail = new Audio('./sounds/fail.wav');
const audioClick = new Audio('./sounds/click.wav');
const audioWin = new Audio('./sounds/win.wav');
const audioMusic = new Audio('./sounds/music.mp3');
audioMusic.volume = 0.3;
audioMusic.loop = true;

//Creamos 2 registros del modo de audio, cuando se ingrese por primera vez
if(localStorage.length === 0){
    localStorage.setItem('music', 'on');
    localStorage.setItem('sounds', 'on');
}

btnNuevoJuego.addEventListener('click', () => {
    titulo.classList.add('hidden');
    contenedorBtn.classList.add('hidden');
    btnNuevoJuego.classList.remove('absolute', 'z-50', 'bottom-[10%]');
    score.classList.remove('hidden');
    btnsSonido.classList.remove('hidden');
    barWindow.classList.remove('absolute', 'z-50');
    reactivarAudio('sounds', audioStart)
    setTimeout(() => {
        //Reseteamos el html para generar un nuevo tablero
        while(tablero.firstChild){
            tablero.removeChild(tablero.firstChild);
        }

        //Reseteamos el contador y html
        resetearValores()

        //Ocultamos el modal (Pantalla ganadora)
        modal.classList.add('hidden');

        //Generamos el tablero con las tarjetas
        tablero.classList.remove('hidden');
        generarTablero();
        setTimeout(() => {
            tiempo();
        }, 3000);
    }, 1300);
});

function tiempo(){
    timeInterval = setInterval(() => {
        if(segundos !== 59){
            segundos++;
        }else{
            minutos++;
            segundos = 0;
        }

        if(segundos<10){
            spanSegundos.textContent = `0${segundos}`;
        }else{
            spanSegundos.textContent = segundos;
        }

        if(minutos<10){
            spanMinutos.textContent = `0${minutos}`;
        }else{
            spanMinutos.textContent = minutos;
        }
    }, 1000);
}

//Figuras de las tarjetas
function cargarFiguras(){
    figuras = [
        'img/001.png',
        'img/002.png',
        'img/003.png',
        'img/004.png',
        'img/005.png',
        'img/006.png',
        'img/007.png',
        'img/008.png',
        'img/009.png',
        'img/010.png'
    ]
}

function generarTablero(){
    reactivarAudio('music', audioMusic)
    cargarFiguras();
    let tarjetas = [];

    //Generamos las tarjetas con las figuras
    for(let i=0; i<20; i++){
        tarjetas.push(generarTarjeta(i));
        //Logica para generar dos tarjetas seguidas con la misma figura
        if(i%2 == 1){
            figuras.splice(0,1);
        }
    }

    //Mezclamos las tarjetas para que no aparezcan las figuras juntas
    tarjetas.sort(()=> Math.random() - 0.5);

    //Agregamos las tarjetas al tablero
    tarjetas.forEach(tarjeta => {
        tablero.appendChild(tarjeta)
    });
}

//Scripting para crear una tarjeta
function generarTarjeta(id){
    const divAreaTarjeta = document.createElement('div');
    divAreaTarjeta.classList.add('area-tarjeta', 'w-20', 'h-28', 'm-w-[80px]', 'grid-cols-5', 'rounded-lg', 'overflow-hidden');

    divAreaTarjeta.onclick = () => seleccionarTarjeta(id);

    const divTarjeta = document.createElement('div');
    divTarjeta.setAttribute('id', `tarjeta-${id}`);
    divTarjeta.classList.add('tarjeta', 'w-20', 'h-28', 'm-w-[80px]', 'relative');

    const divCover = document.createElement('div');
    divCover.classList.add('cara', 'flex', 'justify-center', 'items-center', 'w-20', 'h-28', 'm-w-[80px]', 'absolute', 'bg-blue-300');

    const imgCover = document.createElement('img');
    imgCover.classList.add('w-full', 'object-fill');
    imgCover.src = 'img/bg-cover-card.png';

    const divFront = document.createElement('div');
    divFront.classList.add('front', 'cara', 'flex', 'justify-center', 'items-center', 'w-20', 'h-28', 'm-w-[80px]', 'absolute', 'bg-violet-600');
    divFront.setAttribute('id', `front-${id}`);

    const imgFront = document.createElement('img');
    imgFront.classList.add('w-10/12', 'object-fill');
    imgFront.src = figuras[0];

    divCover.appendChild(imgCover);
    divFront.appendChild(imgFront);
    divTarjeta.appendChild(divCover);
    divTarjeta.appendChild(divFront);
    divAreaTarjeta.appendChild(divTarjeta);

    return divAreaTarjeta
}

function seleccionarTarjeta(id){
    const tarjeta = document.querySelector('#tarjeta-' + id);

    reactivarAudio('sounds', audioClick);

    //Descubrimos la tarjeta
    if(tarjeta.style.transform != "rotateY(180deg)"){
        tarjeta.style.transform = "rotateY(180deg)"
        //La agregamos al array para hacer la comparacion luego con otra tarjeta
        selecciones.push(id)
    }

    if(selecciones.length === 2){
        //Hacemos la validacion de las dos tarjetas en cuestion
        deseleccionar(selecciones);
        //Reseteamos el array
        selecciones = [];
    }
}

function deseleccionar(selecciones){
    setTimeout(() => {
        cantMovimientos++;
        movimientos.textContent = `Movimientos: ${cantMovimientos}`;

        const front1 = document.querySelector('#front-' + selecciones[0]);
        const front2 = document.querySelector('#front-' + selecciones[1]);

        //Validar si las tarjetas son iguales
        if(front1.innerHTML !== front2.innerHTML){
            //Si son distintas lanzamos audio de intento fallido, y tapamos de nuevo las tarjetas
            reactivarAudio('sounds', audioFail);
            const tarj1 = document.querySelector('#tarjeta-' + selecciones[0]);
            const tarj2 = document.querySelector('#tarjeta-' + selecciones[1]);
            tarj1.style.transform = "rotateY(0deg)";
            tarj2.style.transform = "rotateY(0deg)";
        }else{
            /* Si son iguales, lanzamos audio de acierto, cambiamos el background de las tarjetas a verde, aumentamos el
             * contador de pares, actualizamos el html de aciertos y verificamos si el juego a concluído.
             */
            reactivarAudio('sounds', audioOk);
            front1.classList.remove('bg-violet-600');
            front1.classList.add('bg-green-400');
            front2.classList.remove('bg-violet-600');
            front2.classList.add('bg-green-400');
            contadorPares++;
            pares.textContent = `Aciertos: ${contadorPares}`
            juegoFinalizado();
        }

    }, 1000);
}

//Funcion verificadora si están los 10 pares acertados
function juegoFinalizado(){
    if(contadorPares >= 10){
        clearInterval(timeInterval);
        //audioWin.play();
        reactivarAudio('sounds', audioWin);
        modalMov.textContent = `Movimientos: ${cantMovimientos}`;
        modalTime.textContent = `Tiempo: ${spanMinutos.textContent}:${spanSegundos.textContent}`;
        modalPuntaje.textContent = `Puntaje: ${calcularPuntaje()}`;
        modal.classList.remove('hidden');
        contenedorBtn.classList.remove('hidden');
        btnNuevoJuego.classList.add('absolute', 'z-50', 'bottom-[10%]');
        barWindow.classList.add('absolute', 'z-50');
        lanzarConfetti();
    }
}

//Confetti
const jsConfetti = new JSConfetti();

function lanzarConfetti(){
    jsConfetti.addConfetti({
        confettiColors: [
            '#ffe100', '#ffbf00', '#00bfff', '#6100ff', '#ff00ff', '#ff0000',
          ],
        confettiNumber: 1200,
    });
}

function resetearValores(){
    contadorPares = 0;
    cantMovimientos = 0;
    segundos = 0;
    minutos = 0;
    movimientos.textContent = `Movimientos: 0`;
    pares.textContent = `Aciertos: 0`;
    spanSegundos.textContent = '00';
    spanMinutos.textContent = '00';
}

function calcularPuntaje(){
    if( minutos < 1 && cantMovimientos < 15 ){
        return contadorPares * 100;
    } else if( minutos < 1 && cantMovimientos < 20 ){
        return contadorPares * 80;
    } else if( minutos > 1 && cantMovimientos > 20 ){
        return contadorPares * 50;
    }else{
        return contadorPares * 30;
    }
}

btnMusicOnOff.addEventListener('click', () => {
    const iconOn = btnMusicOnOff.childNodes[1];
    const iconOff = btnMusicOnOff.childNodes[3];

    iconOn.classList.toggle('hidden');
    iconOff.classList.toggle('hidden');

    if(iconOn.classList.contains('hidden')){
        localStorage.setItem('music', 'off');
        audioMusic.pause();
    } else{
        localStorage.setItem('music', 'on');
        audioMusic.play();
    }
});

btnSoundsOnOff.addEventListener('click', () => {
    const iconOn = btnSoundsOnOff.childNodes[1];
    const iconOff = btnSoundsOnOff.childNodes[3];

    iconOn.classList.toggle('hidden');
    iconOff.classList.toggle('hidden');

    if(iconOn.classList.contains('hidden')){
        audioStart.pause();
        audioClick.pause();
        audioOk.pause();
        audioFail.pause();
        audioWin.pause();

        audioStart.volume = 0;
        audioClick.volume = 0;
        audioOk.volume = 0;
        audioFail.volume = 0;
        audioWin.volume = 0;
    } else{
        reactivarAudio('sounds', audioStart);
        reactivarAudio('sounds', audioClick);
        reactivarAudio('sounds', audioOk);
        reactivarAudio('sounds', audioFail);
        reactivarAudio('sounds', audioWin);

        setTimeout(() => {
            audioStart.volume = 1;
            audioClick.volume = 1;
            audioOk.volume = 1;
            audioFail.volume = 1;
            audioWin.volume = 1;
        }, 1025);
    }

    if(iconOn.classList.contains('hidden')){
         localStorage.setItem('sounds', 'off');
    }else{
         localStorage.setItem('sounds', 'on');
    }
});

function reactivarAudio(tipo, audio){
    if(localStorage.getItem(tipo) === 'on'){
        audio.play();
    }
}

//Si hay una recarga aseguramos la carga de los iconos que corresponda de los botones de sonido
const currentMusic = localStorage.getItem('music');
const currentSounds = localStorage.getItem('sounds');

if(currentMusic === 'off'){
    btnMusicOnOff.childNodes[1].classList.add('hidden');
    btnMusicOnOff.childNodes[3].classList.remove('hidden');
}

if(currentSounds === 'off'){
    btnSoundsOnOff.childNodes[1].classList.add('hidden');
    btnSoundsOnOff.childNodes[3].classList.remove('hidden');
}
