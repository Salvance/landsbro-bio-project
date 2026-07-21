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
        const container = document.getElementById('current-movies-container');
        data.film.forEach(film => {
            const card = document.createElement('div');
            card.className = 'current-movie';
            card.innerHTML = `
                <img class="movie-poster" src="${workerUrl}/image?url=${encodeURIComponent(film.BildSokvag)}" alt="${film.FilmNamn}">
                <p class="movie-name">${film.FilmNamn}</p>
                <p class="movie-genre">${film.Genre}</p>
                <p class="movie-runtime">${formatRuntime(film.Speltid)}</p>
                <p class="movie-next-time-text">Nästa visning</p>
                <p class="movie-next-time-date">${film.forestall[0].Datum} kl ${film.forestall[0].Tid}</p>
                <div class="movie-booking">
                    <a href="http://sagabiolandsbro.internetbokningen.com/chap/bookforestall/" target="_blank" class="movie-booking-link">
                        <i class="fa-solid fa-ticket"></i>Boka Biljett
                    </a>
                </div>
                <p class="movie-info">Läs mer <i class="fa-solid fa-arrow-right"></i></p>
            `;

            card.querySelector('.movie-info').addEventListener('click', () => {
                document.getElementById('modal-poster').src = `${workerUrl}/image?url=${encodeURIComponent(film.BildSokvag)}`;
                document.getElementById('modal-title').textContent = film.FilmNamn;
                document.getElementById('modal-genre').textContent = film.Genre;
                document.getElementById('modal-runtime').textContent = formatRuntime(film.Speltid);
                document.getElementById('modal-next-date').textContent = `${film.forestall[0].Datum} kl ${film.forestall[0].Tid}`;
                document.getElementById('modal-overlay').classList.add('active');
            });

            container.appendChild(card);
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

        document.getElementById('modal-close').addEventListener('click', () => {
            document.getElementById('modal-overlay').classList.remove('active');
        });

        document.getElementById('modal-overlay').addEventListener('click', (e) => {
            if (e.target === document.getElementById('modal-overlay')) {
                document.getElementById('modal-overlay').classList.remove('active');
            }
        });

    });

document.getElementById("nav-button").addEventListener("click", () => {
    document.getElementById("nav-button").style.display = "none";
    document.getElementById("nav-sidebar").style.display = "flex";
    document.getElementById("nav-close").addEventListener("click", () => {
        document.getElementById("nav-button").style.display = "block";
        document.getElementById("nav-sidebar").style.display = "none";
    })
})