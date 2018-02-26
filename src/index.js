const $ = require('jQuery');
const {getMovies} = require('./api.js');
const loading = document.getElementsByClassName('loading-setpoint').item(0);
const edit = document.getElementById('edit');
let selectedMovie = undefined;
let formIsOpen = false;

refresh(); // refreshes the movie list upon initially loading the page

function addMovieSetup () { // actual function that allows us to add a movie via input fields
    if (formIsOpen) {
        return;
    }
    formIsOpen = true;
    const addForm = `<div id='addForm' class="form">` +
        `<form action="../db.json" method="POST">` +
        `<label for="title">Title <input type="text" id="title" name="newMovie"></label>` +
        `<label for="rating">Rating <input type="text" id="rating" name="newMovie"></label>` +
        `<button id="buttonAdd">Add</button></form></div>`;
    loading.innerHTML += addForm;
    document.getElementById('buttonAdd').addEventListener('click', (e) => {
        e.preventDefault();
        $('#addForm').fadeOut();
        formIsOpen = false;
        processAddedMovie();
    });
}

function editMovie(movieToEdit) {
    console.log(formIsOpen);
    if (formIsOpen) {
        return;
    }
    formIsOpen = true;
    const id = movieToEdit.attr('id');
    const currentTitle = movieToEdit.children().first().text();
    const currentRating = movieToEdit.children().first().next().next().text();
    const editForm = `<div class="editForm form">` +
        `<form action="../db.json" method="POST">` +
        `<label for="title">Title:  <input type="text" id="edit-title-${id}" name="editMovie" value="${currentTitle}"></label>` +
        `<label for="rating">Rating:  <input type="text" id="edit-rating-${id}" name="editMovie" value="${currentRating}"></label>` +
        `<button id="buttonEdit">Submit Changes</button></form></div>`;
    movieToEdit.append(editForm);
    document.getElementById('buttonEdit').addEventListener('click', (e) => {
        e.preventDefault();
        $('.editForm').fadeOut();
        const url = `/api/movies/${id}`;
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
            .then(() => refresh()).then( () => (formIsOpen = false))
            .catch(() => alert(`Something went wrong, and everyone dies. The end.`));
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
    const id = movieToRemove.attr('id');
    const url = `/api/movies/${id}`;
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieToRemove),
    };
    fetch(url, options)
        .then( () => refresh() )
        .catch(() => alert(`Something went wrong, and everyone dies. The end.`));
};

function refresh() {
    getMovies().then((movies) => {
        let temp = '';
        loading.innerHTML = ('');
        temp += (`<ul id="moviesList">`);
        movies.forEach(({title, rating, id}) => {

            temp += (`<li id="${id}" class="text-center"><span id="title-${id}">${title}</span><br><span id="rating-${id}">${rating}</span></li>` +
                `<div class="hidden menu text-center"><button class="edit">Edit</button>` +
                `<button class="remove">Remove</button></div>`);
        });
        temp += (`</ul> <div id="add-movie">` +
            `<button id="add" class="center-block">Add</button>` +
        `</div>`);
        loading.innerHTML = temp;
        $('#add-movie').fadeIn();
    }).catch((error) => {

        alert('Oh no! Something went wrong.\nCheck the console for details.');
        console.log(error);
    });
}

$(".loading-setpoint").on("click", "li", function() {
    $(this).next().toggleClass('hidden');
    selectedMovie = ($(this));
}).on("click", ".edit", function() {
    editMovie(selectedMovie);
}).on("click", ".remove", function() {
    removeMovie(selectedMovie).off();
});

$('.container').on('click', '#add', function(e){
    e.preventDefault();
    $('#add-movie').fadeToggle();
    addMovieSetup();
});



