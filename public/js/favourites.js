const buttonFav = document.querySelector("#favButton");
const iconFav = document.querySelector("#iconFav");

async function trueOrFalse(value) {
    let data = {
        "id" : buttonFav.dataset.post,
        "isFavourite": value
    };
    const requestOptions = {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
    await fetch("/favourites", requestOptions)
        .then(function(response) {
            if(response.ok) return response.text();
            throw new Error('Something went wrong.');
        })
        .then(function(text) {console.log('Request successful', text);})
        .catch(function(error) {console.log('Request failed', error);});
};

buttonFav.addEventListener("click", async function(){
    iconFav.classList.toggle("active");
    if(iconFav.classList.contains("active")) {
        await trueOrFalse(true);
    } else {
        await trueOrFalse(false);
    };
});