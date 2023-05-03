import axios from "https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm";

const inicioInput = document.getElementById("incio");
const fimInput = document.getElementById("fim");
const paisesInput = document.getElementById("paises");
const dadosInput = document.getElementById("dados");

let listType = ["Deaths", "Confirmed", "Recovered"];

let pais;
let type;;
let inicio = "28/04/2020";
let fim = "08/05/2020";

async function filtro() {
  const getCountries = await axios.get("https://api.covid19api.com/countries");
  /* const getCountriesAllStatus = await axios.get(`https://api.covid19api.com/country/${pais}/status/${type}?from=${inicio}&to=${fim}`); */

  function setPaises() {
    getCountries.data.map((country) => {
      pais = country.Country;
      var options = document.createElement("option");
      options.innerHTML = pais;
      paisesInput.value = pais = "Brazil";
      paisesInput.appendChild(options);
      paisesInput.onchange = () => {
        pais = paisesInput.value;
      };
    });
  }

  function setType(){
    listType.map((status)=> {
        var statusType = document.createElement("option");
        statusType.innerHTML = status;
        dadosInput.appendChild(statusType);
        dadosInput.value = status = "Deaths"

        dadosInput.onchange = () => {
            type = dadosInput.value;
            console.log(type)
          };
    })
   
  }

  setType();
  setPaises();
}

filtro();
