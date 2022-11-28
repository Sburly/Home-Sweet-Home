const menuBtn = document.querySelector("#showInfoMenu");
const menu = document.querySelector("#menu");
const svg = document.querySelector("#menu--icon");
const path = document.querySelector("#menu--path");

document.addEventListener("click", e => {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if(el === menuBtn || el === svg || el === path){
        menu.style.left = e.pageX + 'px';
        menu.style.top = e.pageY + 'px';
        menu.classList.toggle("noDisplay")
    } else {
        menu.classList.add("noDisplay");
    }
});