const workerUrl = 'https://rough-bonus-c86b.barnabaskoltai.workers.dev';

function formatRuntime(speltid) {
    const parts = speltid.split('.');
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    if (hours !== 0 || minutes !== 0) {
        return `${hours}h ${minutes}min`;
    }
    return 'Speltid är inte tillgänglig just nu';
}

function openModal(film) {
    document.getElementById('modal-poster').src = `${workerUrl}/image?url=${encodeURIComponent(film.BildSokvag)}`;
    document.getElementById('modal-title').textContent = film.FilmNamn;
    document.getElementById('modal-runtime').textContent = formatRuntime(film.Speltid);
    document.getElementById('modal-next-date').textContent = `${film.forestall[0].Datum} kl ${film.forestall[0].Tid}`;
    document.getElementById('modal-overlay').classList.add('active');

    document.getElementById('modal-genre').textContent = '';
    document.getElementById('modal-handling').textContent = '';
    document.getElementById('modal-regissor').textContent = '';
    document.getElementById('modal-skadespelare').textContent = '';

    fetch(`${workerUrl}/filminfo?id=${film.FilmNr}`)
        .then(r => r.json())
        .then(info => {
            const f = info.Filminfo;
            document.getElementById('modal-genre').textContent = f.genre;
            document.getElementById('modal-handling').textContent = f.handling;
            document.getElementById('modal-regissor').textContent = f.regissor ? `Regissör: ${f.regissor}` : '';
            document.getElementById('modal-skadespelare').textContent = f.skadespelare ? `Skådespelare: ${f.skadespelare}` : '';
        });
}

fetch(workerUrl)
    .then(r => r.json())
    .then(data => {
        const container = document.getElementById('current-movies-container');

        if (!data.film || data.film.length === 0) {
            document.getElementById('hero').innerHTML = `
                <div id="hero-message">
                    Inga aktuella filmer just nu. Kom tillbaka snart!
                </div>
            `;
            container.innerHTML = `
                <p id="no-movies-message">
                    Inga aktuella filmer just nu. Kom tillbaka snart!
                </p>
            `;
            return;
        }

        data.film.sort((a, b) => {
            const parseDate = (dateStr) => {
                const parts = dateStr.trim().split(/[\s\/]/);
                return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
            };
            return parseDate(a.forestall[0].Datum) - parseDate(b.forestall[0].Datum);
        });

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
                <a href="http://sagabiolandsbro.internetbokningen.com/chap/bookforestall/" target="_blank" class="movie-booking-link">
                    <div class="movie-booking"><i class="fa-solid fa-ticket"></i> Boka Biljett</div>
                </a>
                <p class="movie-info">Läs mer <i class="fa-solid fa-arrow-right"></i></p>
            `;

            card.addEventListener('click', (e) => {
                if (!e.target.closest('.movie-booking-link')) {
                    openModal(film);
                }
            });

            container.appendChild(card);
        });

        const slides = document.getElementById('hero-slides');
        const dotsContainer = document.getElementById('hero-dots');
        let current = 0;
        let autoplay;

        data.film.forEach((film, i) => {
            const slide = document.createElement('div');
            slide.className = 'hero-slide';
            slide.innerHTML = `
                <img src="${workerUrl}/image?url=${encodeURIComponent(film.BildSokvag)}" alt="${film.FilmNamn}">
                <div class="hero-info">
                    <h2>${film.FilmNamn}</h2>
                    <p class="genre">${film.Genre}</p>
                    <p class="runtime">${formatRuntime(film.Speltid)}</p>
                    <p class="next">Nästa visning: ${film.forestall[0].Datum} kl ${film.forestall[0].Tid}</p>
                </div>
            `;

            slide.querySelector('img').addEventListener('click', () => openModal(film));
            slides.appendChild(slide);

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

function closeNav() {
    document.getElementById("nav-button").classList.add("active");
    document.getElementById("nav-sidebar").classList.remove("active");
    document.getElementById("sidebar-overlay").classList.remove("active");
}

document.getElementById("nav-button").addEventListener("click", () => {
    document.getElementById("nav-button").classList.remove("active");
    document.getElementById("nav-sidebar").classList.add("active");
    document.getElementById("sidebar-overlay").classList.add("active");
});

document.getElementById("nav-close").addEventListener("click", () => {
    closeNav();
});

if (!document.getElementById("nav-sidebar").classList.contains("active")) {
    document.getElementById("nav-button").classList.add("active");
}

document.getElementById("sidebar-overlay").addEventListener("click", () => {
    closeNav();
});