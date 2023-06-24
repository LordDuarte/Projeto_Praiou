var infos = [
        {"id":1,
        "praia":"Praia do Centro",
        "cidade":"Caraguatatuba",
        "quantidade": 3,
        "latitude":-23.622928,
        "longitude":-45.4066865},
        {"id":2,
        "praia":"Praia Martin de Sá",
        "cidade":"Caraguatatuba",
        "quantidade":4,
        "latitude":-23.627806,
        "longitude":-45.382775},
        {"id":3,
        "praia":"Praia da Cocanha",
        "cidade":"Caraguatatuba",
        "quantidade":5,
        "latitude":-23.576809,
        "longitude":-45.313991},
        {"id":4,
        "praia":"Praia do Capricórnio",
        "cidade":"Caraguatatuba",
        "quantidade":2,
        "latitude":-23.610703,
        "longitude":-45.350300},
        {"id":5,
        "praia":"Praia Vermelha",
        "cidade":"Caraguatatuba",
        "quantidade":1,
        "latitude":-23.511555,
        "longitude":-45.173027}
]

console.log(infos)

var map = L.map('map').setView([0,0], 12);

//Inicializando localização do usuário
navigator.geolocation.getCurrentPosition(function(position){
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    map.setView([latitude,longitude],12);


if(navigator.geolocation){
    var userIcon = L.icon({
        iconUrl: 'assets/js/cursor.png',
        iconSize: [70,100],
        iconAnchor: [20, 35],
        popupAnchor: [-3, -50],})

    //Adicionar marcador usuário
    var markerUser = L.marker([latitude,longitude],{icon:userIcon}).addTo(map);
    markerUser.bindPopup('Você esta aqui');
    console.log("Marcador usuário Inicializado")
    console.log(latitude)
    console.log(longitude)

    //Atualizar localização do usuário
    localizacao(markerUser)
}

else{
    alert("Localização não encontrada")
    map.setView([-23.622928,-45.4066865],12);

}
});

 // Adiciona camada de mapeamento
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18,
    minZoom:5,
    noWrap: true
    }).addTo(map);
    
    map.doubleClickZoom.disable();

    var marcador = L.marker([0,0]).addTo(map)

    map.on('dblclick', function(ev) {
        var coordenadas = ev.latlng
        var latitude = coordenadas.lat
        var longitude= coordenadas.lng

        if(latitude ===0 & longitude===0){
            map.removeLayer(marcador)
        }
        else{
            marcador.setLatLng([latitude,longitude])
            previsaoTempo(latitude,longitude)
        }
})

//Atualização de localização
function localizacao (markerUser){
    navigator.geolocation.watchPosition(function (position){
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        
    if(navigator.geolocation){

        
        var userIcon = L.icon({
            iconUrl: 'assets/js/cursor.png',
            iconSize: [50,120],
            iconAnchor: [85, 55],
            popupAnchor: [-3, -50],
        });


         //Atualizar marcador usuário
        markerUser.setLatLng([latitude,longitude])
        markerUser.bindPopup('Você esta aqui');
        console.log("Atualizado")

    }

    else{
        alert("Não encontramos a sua localização")
    }
})
proxMarcador(markerUser);
}

let informacaoEstado = document.querySelector(".informação-estado")
let informacaoTipo = document.querySelector(".informação-tipo")
let informacaoCidade = document.querySelector(".informação-cidade")
let informacaoVentos = document.querySelector(".informação-ventos")
let informacaoDirecao = document.querySelector(".informação-direção")
let informacaoRaios = document.querySelector(".informação-raios")
let informacaoHumidade = document.querySelector(".informação-humidade")


//Tratamento de JSON
infos.forEach(function(item){
    if(item.quantidade <= 3){
    var myIcon = L.icon({
        iconUrl: 'assets/js/flag2.png',
        iconSize: [35,60],
        iconAnchor: [20, 35],
        popupAnchor: [-3, -50],
    });   
    var marker = L.marker([item.latitude, item.longitude],{icon:myIcon}).addTo(map);
}

    else{
    var myIcon = L.icon({
        iconUrl: 'assets/js/flag.png',
        iconSize: [45,60],
        iconAnchor: [20, 35],
        popupAnchor: [-3, -50],
    });
    var marker = L.marker([item.latitude, item.longitude],{icon:myIcon}).addTo(map);
}

marker.addEventListener("click",function(evnt){
    var valorBusca = item.cidade

    clicarPrevisao(valorBusca)
    async function clicarPrevisao(valorBusca){
        var getApi = await fetch(`http://api.weatherapi.com/v1/current.json?key=1410f2c2a8174a54a86191744233005&q=${valorBusca}&lang=pt`)
        var converteJson = await getApi.json()

        console.log(converteJson.location.name)
        
        informacaoEstado.innerHTML=`Estado:${converteJson.location.region}`
        informacaoCidade.innerHTML=`Cidade:${converteJson.location.name}`
        informacaoVentos.innerHTML=`Velocidade dos ventos:${converteJson.current.wind_kph}`
        informacaoDirecao.innerHTML=`Direção dos ventos:${converteJson.current.wind_dir}`
        informacaoRaios.innerHTML=`Raios UV:${converteJson.current.uv}`
        informacaoHumidade.innerHTML=`Humidade:${converteJson.current.humidity}`

    }
});
})

//Proximidade marcadores
proxMarcador()
function proxMarcador(markerUser){
    infos.forEach(function(item){

    //Verificar proximidade entre o user e as praias
    var coordPraias = L.latLng(item.latitude,item.longitude)
    var proximidade = markerUser.getLatLng().distanceTo(coordPraias)
    console.log(proximidade)
    //Envio de mensagem para o usuário
    if(proximidade < 100)
    alert(`Você esta próximo da ${item.praia}`)
    })
}


//SCRIPT TEMPERATURA
//Localização fixa
localizacaoPrevisao()
function localizacaoPrevisao(){
navigator.geolocation.getCurrentPosition(function(position){
    var latitude = position.coords.latitude
    var longitude= position.coords.longitude

    previsaoTempo(latitude,longitude)
    })
}

let busca = document.querySelector(".busca")
    busca.addEventListener("search",function apareceTemperatura(evento){
    var valorBusca = busca.value
    previsaoTempoBusca(valorBusca)
    })

let grau = document.querySelector(".grau")
let cidade = document.querySelector(".cidade")
let simbolo = document.querySelector(".simbolo_temperatura")

//GET na API de previsão do tempo
async function previsaoTempo(latitude,longitude){
    var getApi = await fetch(`http://api.weatherapi.com/v1/current.json?key=1410f2c2a8174a54a86191744233005&q=${latitude},${longitude}&lang=pt`)
    var converteJson = await getApi.json()
    var tempJson = converteJson.results;

    var temperaturaLocal = converteJson.current.temp_c;
    var cidadeLocal = converteJson.location.name
    var simboloLocal = converteJson.current.condition.icon
    var descricao = converteJson.current.condition.text

    console.log(converteJson)

    grau.innerHTML=`${temperaturaLocal}°`
    cidade.innerHTML=`${cidadeLocal}`

    simbolo.innerHTML=`<img src='${simboloLocal}'></img>`

    var texto = document.createElement("p")
    texto.innerHTML=`${descricao}`
    texto.className="texto_temperatura"
    simbolo.appendChild(texto)

    var latitude = converteJson.location.lat
    var longitude = converteJson.location.lon
}

//GET na API de previsão do tempo
async function previsaoTempoBusca(valorBusca){
    var getApi = await fetch(`http://api.weatherapi.com/v1/current.json?key=1410f2c2a8174a54a86191744233005&q=${valorBusca}&lang=pt`)
    var converteJson = await getApi.json()
    var tempJson = converteJson.results;

    var temperaturaLocal = converteJson.current.temp_c;
    var cidadeLocal = converteJson.location.name
    var simboloLocal = converteJson.current.condition.icon
    var descricao = converteJson.current.condition.text

    console.log(converteJson)

    grau.innerHTML=`${temperaturaLocal}°`
    cidade.innerHTML=`${cidadeLocal}`

    simbolo.innerHTML=`<img src='${simboloLocal}'></img>`

    var texto = document.createElement("p")
    texto.innerHTML=`${descricao}`
    texto.className="texto_temperatura"
    simbolo.appendChild(texto)

    var latitude = converteJson.location.lat
    var longitude = converteJson.location.lon

    marcador.setLatLng([latitude,longitude])

    animarMapa(latitude,longitude)
}

function animarMapa(latitude,longitude){
        map.flyTo([latitude, longitude], 12, {
        duration: 3, // Duração da animação em segundos
        easeLinearity: 1 // Suavização da animação (0 a 1)
    });
    
}

