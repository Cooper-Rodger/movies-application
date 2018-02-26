module.exports = {
    getMovies: () => {
        $('.loading-setpoint').html(`<img src="img/loading.gif">`);
        return fetch('/api/movies')
            .then(response => response.json());
    }
};