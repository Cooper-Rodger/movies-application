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

function addMovie () {
    let blogPost = {title: title.value, rating: rating.value};

    const url = '/api/movies';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogPost),
    };
    fetch(url, options)
        .then(console.log(response => response.json()))
        .catch(/* handle errors */);
}

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
    e.preventDefault();
    console.log(title.value);
    addMovie();
});