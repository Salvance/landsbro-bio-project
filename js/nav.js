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

document.querySelectorAll('#jubileum img').forEach(img => {
    img.addEventListener('click', () => {
        document.getElementById('photo-full').src = img.src;
        document.getElementById('photo-overlay').classList.add('active');
    });
});

document.getElementById('photo-close').addEventListener('click', () => {
    document.getElementById('photo-overlay').classList.remove('active');
});

document.getElementById('photo-overlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('photo-overlay')) {
        document.getElementById('photo-overlay').classList.remove('active');
    }
});