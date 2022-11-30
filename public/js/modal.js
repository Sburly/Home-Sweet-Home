const buttonBook = document.querySelector("#bookButton");
const buttonReview = document.querySelector("#reviewButton");
const modalBook = document.querySelector("#bookModal");
const modalReview = document.querySelector("#reviewModal");
const overlay = document.querySelector("#overlay");

function openModal(modal) {
    overlay.classList.toggle("active");
    modal.classList.toggle("active");
};

function closeModals() {
    overlay.classList.remove("active");
    modalBook.classList.remove("active");
    modalReview.classList.remove("active");
};

overlay.addEventListener("click", function() {
    closeModals();
});

buttonBook.addEventListener("click", function(){
    openModal(modalBook);
});

buttonReview.addEventListener("click", function(){
    openModal(modalReview);
});