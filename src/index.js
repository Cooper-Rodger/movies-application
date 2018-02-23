/**
 * es6 modules and imports
 */
import sayHello from './hello';
sayHello('World');

/**
 * require style imports
 */
const {getMovies} = require('./api.js');
const loading = document.getElementById('loading-setpoint');
const title = document.getElementById('title');
const rating = document.getElementById('rating');
const buttonAdd = document.getElementById('buttonAdd');

getMovies().then((movies) => {
  loading.innerHTML = ('');
  console.log('Here are all the movies:');
  movies.forEach(({title, rating, id}) => {
    loading.innerHTML += (`<p>id#${id} - ${title} - rating: ${rating}</p>`);
  });
}).catch((error) => {
  alert('Oh no! Something went wrong.\nCheck the console for details.');
  console.log(error);
});

buttonAdd.addEventListener('click', (e) => {
  console.log("test");
  e.preventDefault();
});