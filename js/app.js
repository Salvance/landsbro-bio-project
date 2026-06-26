const workerUrl = 'https://rough-bonus-c86b.barnabaskoltai.workers.dev';

fetch(workerUrl)
    .then(r => r.json())
    .then(data => {
        const container = document.getElementById('current-movies-container');
        data.film.forEach(film => {
            container.innerHTML += `
          <div class="current-movie">
            <img src="${workerUrl}/image?url=${encodeURIComponent(film.BildSokvag)}" alt="${film.FilmNamn}">            <p class="movie-name">${film.FilmNamn}</p>
            <p class="movie-genre">${film.Genre}</p>
            <p class="movie-runtime">${formatRuntime(film.Speltid)}</p>
            <p class="movie-next-time-text">Nästa visning</p>
            <p class="movie-next-time-date">${film.forestall[0].Datum} kl ${film.forestall[0].Tid}</p>
            <div class="movie-booking">
                <a href="http://sagabiolandsbro.internetbokningen.com/chap/bookforestall/" target="_blank" class="movie-booking-link"><i class="fa-solid fa-ticket"></i>Boka Biljett</a>
            </div>
            <p class="movie-info" onclick="zoomIn()">Läs mer <i class="fa-solid fa-arrow-right"></i></p>
          </div>
        `;
        });
    });

function formatRuntime(speltid) {
    const parts = speltid.split('.');
    const hours = parts[0];
    const minutes = parts[1];
    return `${hours}h ${minutes}min`;
}

function zoomIn() {

}