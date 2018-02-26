module.exports = {
    getMovies: () => {
        $('.loading-setpoint').html(`<img src="img/loading.gif" class="center-block">`);
        return fetch('/api/movies')
            .then(response => response.json());
    }
};