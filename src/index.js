const $ = require('jQuery');
const {getMovies} = require('./api.js');
const loading = document.getElementsByClassName('loading-setpoint').item(0);
const add = document.getElementById('add');
const edit = document.getElementById('edit');
let selectedMovie = undefined;

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

function editMovie(movieToEdit) {
    console.log(movieToEdit);
    const id = movieToEdit.attr('id');
    const currentTitle = movieToEdit.attr('title');
    console.log(currentTitle);
    const currentRating = movieToEdit.attr('rating');
    console.log(currentRating);
    console.log(id);
    const editForm = `<div class="editForm form">` +
        `<form action="../db.json" method="POST">` +
        `<label for="title">Title <input type="text" id="edit-title-${id}" name="editMovie" value="${currentTitle}"></label>` +
        `<label for="rating">Rating <input type="text" id="edit-rating-${id}" name="editMovie" value="${currentRating}"></label>` +
        `<button id="buttonEdit">Submit Changes</button></form></div>`;
    movieToEdit.append(editForm);
    document.getElementById('buttonEdit').addEventListener('click', (e) => {
        e.preventDefault();
        $('.editForm').fadeOut();
        const url = `/api/movies/${id}`;
        console.log(url);
        const title = document.getElementById('edit-title-' + id);
        const rating = document.getElementById('edit-rating-' + id);
        const movieToSubmit = { title: title.value, rating: rating.value};
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movieToSubmit),
        };
        fetch(url, options)
            .then(() => refresh())
            .catch(() => alert(`Something went wrong, and everyone dies. The end.`));

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

function removeMovie(movieToRemove) {
    console.log(movieToRemove);
    const id = movieToRemove.attr('id');
    // fetch the list of movies again
    const url = `/api/movies/${id}`;
    console.log(url);
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieToRemove),
    };
    fetch(url, options)
        .then(() => refresh())
        .catch(() => alert(`Something went wrong, and everyone dies. The end.`));
    // use the id as a key value pair to find the movie that matches (maybe use .filter() ? )
};

function refresh() { // function that processes movies from the api request response from the server
    getMovies().then((movies) => {
        let temp = '';
        loading.innerHTML = ('');
        console.log('Here are all the movies:');
        temp += (`<ul id="moviesList">`);
        movies.forEach(({title, rating, id}) => {
            temp += (`<li id="${id}"><span id=" ">${title}</span><br>rating: ${rating}<span class="hidden ident">${id}</span></li>` +
                `<div class="hidden menu"><button class="edit">Edit</button>` +
                `<button class="remove">Remove</button></div>`);
        });
        temp += (`</ul>`);
        console.log(temp);
        loading.innerHTML = temp;
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
    selectedMovie = ($(this));
    // $(this).children('li').toggleClass('hidden');
}).on("click", ".edit", function() {
    editMovie(selectedMovie);
}).on("click", ".remove", function() {
    removeMovie(selectedMovie);
});



