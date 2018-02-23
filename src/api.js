module.exports = {
  getMovies: () => {
  const loading = document.getElementById('loading-setpoint');
  loading.innerHTML = ('<div class="loading-gif"><img src="img/loading.gif" alt="loading movie items"/></div>');
      return fetch('/api/movies')
      .then(response => response.json());
  }
};
