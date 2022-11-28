const button = document.querySelector("#bookButton");
const overlay = document.querySelector("#overlay");
const modal = document.querySelector("#bookModal");

function openModal() {
    overlay.classList.toggle("active");
    modal.classList.toggle("active");
};

function closeModal() {
    overlay.classList.remove("active");
    modal.classList.remove("active");
};

overlay.addEventListener("click", function() {
    closeModal();
});

button.addEventListener("click", function(){
    openModal();
});