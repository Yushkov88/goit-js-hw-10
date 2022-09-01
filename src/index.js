import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;
const searchInput = document.getElementById('search-box');

searchInput.addEventListener(
  'input',
  debounce(event => {
    fetchCountries(event.target.value.trim()).then(data => {
      console.log(data);
    });
  }, DEBOUNCE_DELAY)
);
