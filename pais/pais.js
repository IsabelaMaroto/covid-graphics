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

let listType = ["Mortes", "Casos Confirmados", "Recuperados"];
const apiCovid = await axios.get("https://api.covid19api.com/summary");

let pais;
let type;
let tipoDeDados;
let inicio;
let fim;
let graphic;

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
      dadosInput.value = status = "Mortes";
      type = "deaths";
      tipoDeDados = dadosInput.value;

      dadosInput.onchange = () => {
        if(dadosInput.value == "Mortes"){ type = "deaths"};
        if(dadosInput.value == "Casos Confirmados"){ type = "confirmed"};
        if(dadosInput.value == "Recuperados"){ type = "recovered"};
        tipoDeDados = dadosInput.value;
      };
    });
  }

  function setData() {
    inicio = "2021-01-05";
    fim = "2021-02-05";
    inicioInput.value = inicio;
    fimInput.value = fim;

    inicioInput.onchange = () => {
      inicio = inicioInput.value;
    };

    fimInput.onchange = () => {
      fim = fimInput.value;
    };
  }

  setType();
  setPaises();
  setData();

  async function graficoPorPais() {
    const getCountriesAllStatus = await axios.get(
      `https://api.covid19api.com/country/${pais}/status/${type}?from=${inicio}T00:00:00Z&to=${fim}T23:59:59Z`
    );
    console.log(getCountriesAllStatus);
    const datas = getCountriesAllStatus.data.map((x) =>
      x.Date.slice(0, x.Date.length - 10)
    );
    const cases = getCountriesAllStatus.data.map((x) => x.Cases);

    let casosPorDia = [];

    let media;

    for (let i = cases.length - 1; i > 0; i--) {
      casosPorDia.push(
        cases[i] > 0 ? _.subtract(cases[i], cases[i - 1]) : cases[i]
      );
    }

    media = Array(cases.length - 1).fill(_.round(_.mean(casosPorDia)));

    graphic = new Chart(graphicPais, {
      type: "line",
      data: {
        labels: datas,
        datasets: [
          {
            label: `Número de ${tipoDeDados}`,
            data: casosPorDia,
            backgroundColor: ["rgb(238, 0, 255)"],
          },
          {
            label: `Média de ${tipoDeDados}`,
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

    if (!paisesInput.value || !dadosInput.value) {
      alert("Informe um todos os dados!");
    }
    if (graphic) {
      graphic.destroy();
    }
    apiCovid.data.Countries.map((pais) => {
      if (paisesInput.value === pais.Country) {
        totalConf.innerHTML = pais.TotalConfirmed;
        totalMortes.innerHTML = pais.TotalDeaths;
        totalRecup.innerHTML = pais.TotalRecovered;
      }
    });
  };
  console.log();
}

filtro();
