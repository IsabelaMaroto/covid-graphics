import axios from "https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm";

const summary = await axios.get("https://api.covid19api.com/summary");
const countries = summary.data.Countries;
const confirmados = document.getElementById("confirmados");
const mortos = document.getElementById("mortos");
const recuperados = document.getElementById("recuperados");
const atualizacao = document.getElementById("atualizacao");
const graphicPie = document.getElementById("graphicPie");
const graphicBar = document.getElementById("graphicBar");

async function covidControll() {
  const paisesOrdenadosMortes = _.orderBy(
    countries,
    (o) => o.TotalDeaths,
    "desc"
  );
  const dezPaisesMaisMortes = _.dropRight(paisesOrdenadosMortes, 187);

  confirmados.innerText = "Total de casos confirmados:" + summary.data.Global.TotalConfirmed;
  mortos.innerText = "Total de mortes:" + summary.data.Global.TotalDeaths;
  recuperados.innerText = "Total de recuperados:" + summary.data.Global.TotalRecovered;
  atualizacao.innerText = "Data de atualização:" + summary.data.Global.Date.slice(0, 10);

  new Chart(graphicPie, {
    type: "pie",
    data: {
      labels: ["Confirmados", "Recuperados", "Mortes"],
      datasets: [
        {
          label: ["Confirmados", "Recuperados", "Mortes"],
          data: [
            summary.data.Global.NewConfirmed,
            summary.data.Global.NewRecovered,
            summary.data.Global.NewDeaths,
          ],
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
          ],
          hoverOffset: 4,
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: "Distribuição de novos casos",
        },
      },
    },
  });

  const TotalDeaths = dezPaisesMaisMortes.map((x) => x.TotalDeaths);
  const nameCountries = dezPaisesMaisMortes.map((x) => x.Country);

  new Chart(graphicBar, {
    type: "bar",
    data: {
      labels: nameCountries,
      datasets: [
        {
          data: TotalDeaths,
          labels: [],
          backgroundColor: ["rgb(238, 0, 255)"],
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: "Total de mortes por país - Top 10",
        },
        legend: {
          display: false,
        },
      },
    },
  });
}
covidControll();

function click(){
  const pais = document.getElementById('pais');
  const home = document.getElementById('home');

  pais.onclick = () =>{
    window.location.href = "/pais/pais.html"
  }

  home.onclick = () =>{
    window.location.href = "/index.html"
  }

}
click()