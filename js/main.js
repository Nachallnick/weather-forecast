import conditions from "./conditions.js";

console.log(conditions);

const apiKey = "49ef7f06cffe4c84b1a82533231603";
// const query = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=London`;

// Elements per page - Элементы на странице //
const header = document.querySelector(".header");
const form = document.querySelector("#form");
const input = document.querySelector("#inputCity");
let city;

function removeCard() {
  // Delete the previous card - Удаляем предыдущую карточку
  const prevCard = document.querySelector(".card");
  if (prevCard) prevCard.remove();
}

function showError(errorMessage) {
  // Show error card -  Отобразить карточку с ошибкой
  const html = `<div class="card">${errorMessage}<div>`;

  // Displaing the card on the site - Отображаем карточку на сайте
  header.insertAdjacentHTML("afterend", html);
}

function showCard({ name, country, temp, condition, imgPath }) {
  // Markup for the card - Разметка для карточки
  const html = `<div class="card">
<h2 class="card-city">${name} <span>${country}</span></h2>
<div class="card-weather">
  <div class="card-value">${temp}<sup>°c</sup></div>
  <img class="card-img" src="${imgPath}" alt="Weather" />
</div>
<div class="card-desc">${condition}</div>
</div>`;

  // Displaing the card on the site - Отображаем карточку на сайте
  header.insertAdjacentHTML("afterend", html);
}

async function getWeather(city) {
  // Request address - Адрес запроса
  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  return data;
}

// listening for a form submission - Слушаем отправку формы

form.onsubmit = async function (event) {
  // cancel form submission - Отменяем отправку формы
  event.preventDefault();
  // Take values from input trim spases - Берем значение из инпута и удаляем пробелы
  let city = input.value.trim();

  //  Get data from server - Получаем данные с сервера
  const data = await getWeather(city);

  // Error checking - Проверка на ошибку
  if (data.error) {
    // if there is an error - print it - Если ошибка есть - выводим ее
    removeCard();
    showError(data.error.message);
  } else {
    // if there is no error - we display the card - Если ошибки нет - выводим карточку
    // We display the received data in the card - Отображаем полученные данные в карточке
    removeCard();

    console.log(data.current.condition.code);

    const info = conditions.find(
      (obj) => obj.code === data.current.condition.code
    );
    console.log(info);
    console.log(info.languages[23]["day_text"]);

    const filePath = "./img/" + (data.current.is_day ? "day" : "night") + "/";
    const fileName = (data.current.is_day ? info.day : info.night) + ".png";
    const imgPath = filePath + fileName;
    console.log("filePath", filePath + fileName);

    const weatherData = {
      name: data.location.name,
      country: data.location.country,
      temp: data.current.temp_c,
      condition: data.current.is_day
        ? info.languages[23]["day_text"]
        : info.languages[23]["night_text"],
      imgPath: imgPath,
    };

    showCard(weatherData);
  }
};
