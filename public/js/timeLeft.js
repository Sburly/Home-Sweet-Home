const displays = document.querySelectorAll("#timeLeftDisplay");
const today = new Date();

function setText(display, text, status) {
    display.innerText = text;
    display.classList.add("booking--" + status);
};

const getDaysDifference = function(dateOne, dateTwo){
    const difference = Math.ceil((dateTwo - dateOne) / (1000 * 3600 * 24));
    if(difference === 1) return String(difference) + " day";
    else return String(difference) + " days";
};

for(let display of displays) {
    const checkIn = new Date(display.dataset.checkIn);
    const checkOut = new Date(display.dataset.checkOut);
    if(checkIn <= today && today <= checkOut) {
        setText(display, "Now", "current");
    } else if(checkOut < today) {
        const days = getDaysDifference(checkOut, today);
        const text = days + " ago";
        setText(display, text, "expired");
    } else {
        const days = getDaysDifference(today, checkIn);
        const text = days + " left";
        setText(display, text, "current");
    };
};