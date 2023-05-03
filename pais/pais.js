import axios from "https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm";

const inicioInput = document.getElementById("inicio");
const fimInput = document.getElementById("fim");
const paisesInput = document.getElementById("paises");
const dadosInput = document.getElementById("dados");
const buttom = document.getElementById("aplicar");
const graphicPais = document.getElementById("graphicPais");
const totalConf = document.getElementById("TotalConfirmados");
const totalMortes = document.getElementById("TotalMortos");
const totalRecup = document.getElementById("TotalRecuperados");

let listType = ["deaths", "confirmed", "recovered"];

let pais;
let type;
let inicio;
let fim;

async function filtro() {
  const getCountries = await axios.get("https://api.covid19api.com/countries");

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

  function setType() {
    listType.map((status) => {
      var statusType = document.createElement("option");
      statusType.innerHTML = status;
      dadosInput.appendChild(statusType);
      dadosInput.value = status = "deaths";
      type = dadosInput.value;

      dadosInput.onchange = () => {
        type = dadosInput.value;
      };
    });
  }

  function setData() {
    inicio = "2021-01-05T00:00:00Z";
    fim = "2021-02-05T00:00:00Z";

    inicioInput.onchange = () => {
      inicio = `${inicioInput.value}T00:00:00Z`;
    };

    fimInput.onchange = () => {
      fim = `${fimInput.value}T00:00:00Z`;
    };
  }

  setType();
  setPaises();
  setData();

  async function graficoPorPais() {
    const getCountriesAllStatus = await axios.get(
      `https://api.covid19api.com/country/${pais}/status/${type}?from=${inicio}&to=${fim}`
    );
    console.log(getCountriesAllStatus);
    const datas = getCountriesAllStatus.data.map((x) => x.Date);
    const cases = getCountriesAllStatus.data.map((x) => x.Cases);

    let casosPorDia = [];

    let media;

    for (let i = cases.length - 1; i > 0; i--) {
      casosPorDia.push(_.subtract(cases[i], cases[i - 1]));
    }

    media = Array(cases.length-1).fill(_.round(_.mean(casosPorDia)));
    

    new Chart(graphicPais, {
      type: "line",
      data: {
        labels: datas,
        datasets: [
          {
            label: "Nmero de Mortes",
            data: casosPorDia,
            backgroundColor: ["rgb(238, 0, 255)"],
          },
          {
            label: "Média de Mortes",
            data: media,
            backgroundColor: ["rgb(38, 0, 255)"],
            
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Curva diária de COVID-19",
          },
        },
      },
    });
  }

  buttom.onclick = (event) => {
    event.preventDefault();
    graficoPorPais();
  };
}

filtro();
