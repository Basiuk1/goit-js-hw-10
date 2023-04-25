import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const onInput = debounce(event => {
  const name = event.target.value.trim();
  if (!name) {
    countryInfo.innerHTML = '';
    list.innerHTML = '';
    return;
  }
  fetchCountries(name)
    .then(choiceCountry)
    .catch(error => console.log(error));
}, DEBOUNCE_DELAY);

function choiceCountry(countries) {
  const arrLength = countries.length;
  if (arrLength > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    countryInfo.innerHTML = '';
    list.innerHTML = '';
    return;
  }
  if (arrLength === 1) {
    list.innerHTML = '';
    return renderCountryInfo(countries);
  }
  if (arrLength > 1) {
    countryInfo.innerHTML = '';
    return renderCountriesAll(countries);
  }
}

function renderCountryInfo(countries) {
  const markup = countries
    .map(country => {
      return `<div class="country">
      <img src="${country.flags.svg}" width="50" height="30" alt="flag of ${
        country.name.official
      }">
      <h2 class="country-title">${country.name.official}</h2></div>
            <p><b>Capital</b>: ${country.capital}</p>
            <p><b>Population</b>: ${country.population}</p>
            <p><b>Languages</b>: ${Object.values(country.languages)}</p>`;
    })
    .join('');
  countryInfo.innerHTML = markup;
}

function renderCountriesAll(countries) {
  const markup = countries
    .map(country => {
      return `<li class="country">
      <img src="${country.flags.svg}" width="50" height="30" alt="flag of ${country.name.official}">
      <p>${country.name.official}</p></li>`;
    })
    .join('');
  list.innerHTML = markup;
}

input.addEventListener('input', onInput);
