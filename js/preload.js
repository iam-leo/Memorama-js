let figuras = [];
let selecciones = [];
const tablero = document.querySelector('#tablero');
const btnNuevoJuego = document.querySelector('#nuevo-juego');

btnNuevoJuego.addEventListener('click', () => {
    while(tablero.firstChild){
        tablero.removeChild(tablero.firstChild);
    }
    generarTablero();
})

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
    
    if(tarjeta.style.transform != "rotateY(180deg)"){
        tarjeta.style.transform = "rotateY(180deg)"
        selecciones.push(id)
    }

    if(selecciones.length === 2){
        deseleccionar(selecciones);
        selecciones = [];
    }
}

function deseleccionar(selecciones){
    setTimeout(() => {
        const front1 = document.querySelector('#front-' + selecciones[0]);
        const front2 = document.querySelector('#front-' + selecciones[1]);
        
        if(front1.innerHTML !== front2.innerHTML){
            const tarj1 = document.querySelector('#tarjeta-' + selecciones[0]);
            const tarj2 = document.querySelector('#tarjeta-' + selecciones[1]);
            tarj1.style.transform = "rotateY(0deg)";
            tarj2.style.transform = "rotateY(0deg)";
        }else{
            front1.classList.remove('bg-violet-600');
            front1.classList.add('bg-green-400');
            front2.classList.remove('bg-violet-600');
            front2.classList.add('bg-green-400');
        }

    }, 1000);
}
generarTablero();

