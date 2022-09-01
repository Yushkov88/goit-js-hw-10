import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  countryInfo: document.querySelector('.country-info'),
  countryList: document.querySelector('.country-list'),
  searchInput: document.getElementById('search-box'),
};

const DEBOUNCE_DELAY = 300;

refs.searchInput.addEventListener(
  'input',
  debounce(event => {
    const value = event.target.value.trim();

    if (!value) {
      clearHtml();

      return;
    }

    fetchCountries(value).then(data => {
      if (data.status === 404 || data.length > 10) {
        data.status === 404
          ? Notify.failure('Oops, there is no country with that name')
          : Notify.info(
              'Too many matches found. Please enter a more specific name.'
            );

        return;
      }

      clearHtml();
      data.length >= 2 ? renderCountryList(data) : renderCountry(data[0]);
    });
  }, DEBOUNCE_DELAY)
);

function clearHtml() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}

function renderCountry({ flags, name, capital, population, languages }) {
  refs.countryInfo.innerHTML = `<div class="country-card">
      <div class="country-header">
        <img class="country-flag" src="${flags.svg}" alt="${name.official}">
        <h2 class="name">${name.official}</h2>
      </div>
      <p class="country-info"><b>Capital:</b> ${capital}</p>
      <p class="country-info"><b>Population:</b> ${population}</p>
      <p class="country-info"><b>Languages:</b> ${Object.values(languages).join(
        ', '
      )}</p>
    </div>`;
}

function renderCountryList(countryList) {
  refs.countryList.innerHTML = countryList
    .map(({ flags, name }) => {
      return `<li class="country-item">
        <img class="country-flag" src="${flags.svg}" alt="${name.official}">
        <h2 class="name">${name.official}</h2>
      </li>`;
    })
    .join('');
}
