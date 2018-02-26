/**
 * require style imports
 */

const $ = require('jQuery');
const {getMovies} = require('./api.js');
const loading = document.getElementsByClassName('loading-setpoint').item(0);
const add = document.getElementById('add');
const edit = document.getElementById('edit');
const remove = document.getElementById('remove');
const movieItem = document.getElementById('movieList');
let test = undefined;

// const buttons = document.getElementById('buttons-group');

refresh(); // refreshes the movie list upon initially loading the page

function addMovieSetup () { // actual function that allows us to add a movie via input fields
    const addForm = `<div id='addForm' class="form">` +
        `<form action="../db.json" method="POST">` +
        `<label for="title">Title <input type="text" id="title" name="newMovie"></label>` +
        `<label for="rating">Rating <input type="text" id="rating" name="newMovie"></label>` +
        `<button id="buttonAdd">Add</button></form></div>`;
    loading.innerHTML += addForm;
    document.getElementById('buttonAdd').addEventListener('click', (e) => {
        e.preventDefault();
        $('#addForm').fadeOut();
        processAddedMovie();
    });
}

function editMovie(input) {
    console.log(input);
    const editForm = `<div class="editForm form">` +
        `<form action="../db.json" method="POST">` +
        `<label for="title">Title <input type="text" id="title" name="editMovie" value=""></label>` +
        `<label for="rating">Rating <input type="text" id="rating" name="editMovie"></label>` +
        `<button id="buttonEdit">Submit Changes</button></form></div>`;
    input.append(editForm);
    document.getElementById('buttonEdit').addEventListener('click', (e) => {
        e.preventDefault();
        $('.editForm').fadeOut();
        console.log(`normally would go through => processEditedMovie() but not now`);
    });
}

function processAddedMovie() { // sends this movie request to the server and updates page
    const title = document.getElementById('title');
    const rating = document.getElementById('rating');
    const movieToAdd = { title: title.value, rating: rating.value};
    const url = '/api/movies';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieToAdd),
    };
    fetch(url, options)
        .then(() => refresh())
        .catch(() => alert(`Something went wrong, and everyone dies. The end.`));
}

function refresh() { // function that processes movies from the api request response from the server
    getMovies().then((movies) => {
        loading.innerHTML = ('');
        console.log('Here are all the movies:');
        loading.innerHTML = (`<ul id="moviesList">`);
        movies.forEach(({title, rating}) => {
            loading.innerHTML += (`<li>${title}<br>rating: ${rating}</li>` +
                `<div class="hidden menu"><button class="edit">Edit</button>` +
                `<button class="remove">Remove</button></div></li>`);
        });
        loading.innerHTML += (`</ul>`);
        $('#add-movie').fadeIn();
    }).catch((error) => {

        alert('Oh no! Something went wrong.\nCheck the console for details.');
        console.log(error);
    });
}

add.addEventListener('click', (e) => {
    e.preventDefault();
    $('#add-movie').fadeToggle();
    addMovieSetup();
});

$(".loading-setpoint").on("click", "li", function() {
    $(this).next().toggleClass('hidden');
    test = ($(this));
    // $(this).children('li').toggleClass('hidden');
}).on("click", ".edit", function() {
    editMovie(test);
}).on("click", ".remove", function() {
    console.log('would have removed this');
});

//
// $("#loading-setpoint").on("click", ".edit", function() {
//     console.log('hit edit');
//     console.log($(this).parent().parent().children());
//     // should go to function that will allow us to edit the inner html
// });
//
// $("#loading-setpoint").on("click", ".remove", function() {
//     console.log('hit remove');
//     // should go to function that will allow us to remove the parent it is in.
// });



