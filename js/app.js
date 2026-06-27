const workerUrl = 'https://rough-bonus-c86b.barnabaskoltai.workers.dev';

function formatRuntime(speltid) {
    const parts = speltid.split('.');
    const hours = parts[0];
    const minutes = parts[1];
    return `${hours}h ${minutes}min`;
}

fetch(workerUrl)
    .then(r => r.json())
    .then(data => {

        // Movie cards
        const container = document.getElementById('current-movies-container');
        data.film.forEach(film => {
            container.innerHTML += `
        <div class="current-movie">
          <img src="${workerUrl}/image?url=${encodeURIComponent(film.BildSokvag)}" alt="${film.FilmNamn}">
          <p class="movie-name">${film.FilmNamn}</p>
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


        const slides = document.getElementById('hero-slides');
        const dotsContainer = document.getElementById('hero-dots');
        let current = 0;
        let autoplay;

        data.film.forEach((film, i) => {
            slides.innerHTML += `
        <div class="hero-slide">
          <img src="${workerUrl}/image?url=${encodeURIComponent(film.BildSokvag)}" alt="${film.FilmNamn}">
          <div class="hero-info">
            <h2>${film.FilmNamn}</h2>
            <p class="genre">${film.Genre}</p>
            <p class="runtime">${formatRuntime(film.Speltid)}</p>
            <p class="next">Nästa visning: ${film.forestall[0].Datum} kl ${film.forestall[0].Tid}</p>
          </div>
        </div>
      `;

            dotsContainer.innerHTML += `<div class="hero-dot ${i === 0 ? 'active' : ''}" onclick="goTo(${i})"></div>`;
        });

        function goTo(n) {
            current = (n + data.film.length) % data.film.length;
            slides.style.transform = `translateX(-${current * 100}%)`;
            document.querySelectorAll('.hero-dot').forEach((d, i) => {
                d.classList.toggle('active', i === current);
            });
        }

        document.getElementById('hero-prev').onclick = () => { clearInterval(autoplay); goTo(current - 1); };
        document.getElementById('hero-next').onclick = () => { clearInterval(autoplay); goTo(current + 1); };

        autoplay = setInterval(() => goTo(current + 1), 5000);

    });

function formatRuntime(speltid) {
    const parts = speltid.split('.');
    const hours = parts[0];
    const minutes = parts[1];
    return `${hours}h ${minutes}min`;
}

function zoomIn() {

}