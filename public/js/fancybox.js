document.addEventListener("DOMContentLoaded", () => {
    const images = JSON.parse(document.getElementById("product-images-data").textContent);
    const mainImg = document.getElementById("mainProductImage");
    const thumbs = document.querySelectorAll(".product-thumb");
    const nextBtn = document.querySelector(".gallery-nav.next");
    const prevBtn = document.querySelector(".gallery-nav.prev");

    let currentIndex = 0;

    function updateMainImage(index) {
        currentIndex = index;
        mainImg.src = images[index];
        mainImg.dataset.index = index;

        thumbs.forEach(t => t.classList.remove("active"));
        thumbs[index].classList.add("active");
    }

    // Thumbnail click
    thumbs.forEach((thumb, index) => {
        thumb.addEventListener("click", () => updateMainImage(index));
    });

    if(!prevBtn || !nextBtn) return;
    
    // Prev / Next
    prevBtn.addEventListener("click", () => {
        updateMainImage((currentIndex - 1 + images.length) % images.length);
    });

    nextBtn.addEventListener("click", () => {
        updateMainImage((currentIndex + 1) % images.length);
    });

    // Open Fancybox on main image click
    mainImg.addEventListener("click", () => {
        Fancybox.show(
            images.map(src => ({ src, type: "image" })),
            {
                startIndex: currentIndex,
                Thumbs: { autoStart: true }
            }
        );
    });

});