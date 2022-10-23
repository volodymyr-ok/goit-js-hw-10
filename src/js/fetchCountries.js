import { Notify } from 'notiflix';

export const fetchCountries = entrie => {
  return fetch(
    `https://restcountries.com/v3.1/name/${entrie}?fields=name,capital,population,flags,languages`
  )
    .then(response => {
      if (!response.ok) {
        throw new Error();
      }
      return response.json();
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      return console.log(error);
    });
};
