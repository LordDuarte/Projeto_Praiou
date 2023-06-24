let map;
var service;
var infowindow; 
const apiKey = 'AIzaSyAUJlF2-GTRbGouie_mzFv8_eMKdYKrCm0'
let grau = document.querySelector(".grau")
let cidade = document.querySelector(".cidade")
let simbolo = document.querySelector(".simbolo_temperatura")



// Initialize and add the map
function initMap() {
  const brasil = { lat: -23.5329 , lng: -23.532 };

  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: brasil,
  });

  //Inicializar localização
navigator.geolocation.getCurrentPosition(function localizacao(position){
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;

  const minhaPosicao = { "lat": lat, "lng": lng };

  const marker = new google.maps.Marker({
    position: minhaPosicao,
    map: map,
  });

  map.setCenter(minhaPosicao)

  console.log(lat,lng)
  previsaoTempo(lat,lng)
})

let busca = document.querySelector(".busca")
    busca.addEventListener("search",function apareceTemperatura(evento){
    var valorBusca = busca.value
    previsaoTempoBusca(valorBusca)
    })

    //GET na API de previsão do tempo
async function previsaoTempo(lat,lng){
  var getApi = await fetch(`http://api.weatherapi.com/v1/current.json?key=1410f2c2a8174a54a86191744233005&q=${lat},${lng}&lang=pt`)
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

  var lat = converteJson.location.lat
  var lng = converteJson.location.lon

const localizacaoBusca = { lat: lat , lng: lng }

var marker = new google.maps.Marker({
  position: localizacaoBusca,
  map:map
});

map.setCenter(localizacaoBusca);
  }

  var request = {
    query: 'Museum of Contemporary Art Australia',
    fields: ['name', 'geometry'],
  };

  var service = new google.maps.places.PlacesService(map);

  service.findPlaceFromQuery(request, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
      map.setCenter(results[0].geometry.location);
    }
  });

}

