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

function actionOnInput(event) {
  console.log('hello');
  let inputValue = event.target.value.trim();

  if (inputValue.length > 0) {
    fetchCountries(inputValue)
      .then(data => createMarkup(data))
      .catch(console.log);
  } else {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
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

        return `<li class='country-list__card'><img src="${flags.svg}" alt="Hello" width='30' class='country-list__img'> 
                <p class='country-list__desc'>${name.official}</p></li>`;
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
                <img src="${flags.svg}" alt="Hello" width='200' class='country-info__img'> 
                <h2 class='country-info__name'>${name.official}</h2>
                <p class='country-info__cap'>Capital: ${capital}</p>
                <p class='country-info__pop'>Population: ${population}</p>
                <p class='country-info__lan'>Languages: ${language}</p>
                `;
      })
      .join('');
  }
}

countryList.addEventListener('click', onCountryClick);

function onCountryClick(event) {
  fetchCountries(event.target.textContent.trim())
    .then(data => createMarkup(data))
    .catch(console.log);
}
