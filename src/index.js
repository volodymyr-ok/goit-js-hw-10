import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(actionOnInput, DEBOUNCE_DELAY));

function actionOnInput() {
  if (input.value.trim().length > 0) {
    fetchCountries(input.value.trim())
      .then(data => createMarkup(data))
      .catch(console.log);
  } else {
    countryList.innerHTML = '';
  }
}

function createMarkup(allCountries) {
  if (allCountries.length > 10) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (allCountries.length > 1 && allCountries.length < 11) {
    countryInfo.innerHTML = '';
    countryList.innerHTML = allCountries
      .map(country => {
        const { flags, name } = country;

        return `<img src="${flags.svg}" alt="Hello" width='50' class='short-info__img'> 
                <p class='short-info__desc'>${name.official}</p>`;
      })
      .join('');
  } else {
    countryList.innerHTML = '';
    countryInfo.innerHTML = allCountries
      .map(country => {
        const { flags, name, capital, population, languages } = country;
        const language = Object.values(languages).join(', ');

        if (name.official === 'Russian Federation') {
          Confirm.show(
            'A TERRORIST COUNTRY.',
            'Слава Україні! Glory to Ukraine!',
            'Героям слава!',
            'Glory to heroes!',
            () =>
              Notify.warning(
                'Інформація про населення може бути неактуальною.'
              ),
            () =>
              Notify.warning(
                'Information about the population may not be relevant.'
              )
          );
        }

        return `
                <img src="${flags.svg}" alt="Hello" width='200' class='full-info__img'> 
                <h2 class='full-info__name'>${name.official}</h2>
                <p class='full-info__cap'>Capital: ${capital}</p>
                <p class='full-info__pop'>Population: ${population}</p>
                <p class='full-info__lan'>Languages: ${language}</p>
                `;
      })
      .join('');
  }
}
