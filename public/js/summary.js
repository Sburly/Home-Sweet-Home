const p1 = document.querySelector("#p1");
const p2 = document.querySelector("#p2");
const p3 = document.querySelector("#p3");
const people = document.querySelector("#people");
const checkIn = document.querySelector("#checkIn");
const checkOut = document.querySelector("#checkOut");
const price = document.querySelector("#price");

function isInRange(value) {
    if(value < 1 && String(value).length !== 0) people.value = 1;
};

function checkToday(date) {
    const today = new Date();
    if(Date.parse(today) > Date.parse(date)) return false;
    return true;
};

const getTimeDifference = function(arrival, departure){
    const firstDate = new Date(arrival);
    const secondDate = new Date(departure);
    if(Date.parse(firstDate) > Date.parse(secondDate)) return false;
    const difference = secondDate - firstDate;
    return Math.ceil(difference / (1000 * 3600 * 24));
};

function formatDate(value) {
    let array = value.split("-");
    array = array.reverse();
    return array.join("/");
};

function updateDates(arrival, departure) {
    p2.textContent = `You're arriving on the ${formatDate(arrival)}`;
    p3.textContent = `and leaving on the ${formatDate(departure)}`;
};

function updateNumber(difference) {
    console.log(Number(price.dataset.price));
    p1.textContent = `${Number(price.dataset.price) * people.value * difference}€ for ${difference} days (${people.value} people)`;
};

function updateSummary() {
    if(checkOut.value && checkIn.value) {
        const difference = getTimeDifference(checkIn.value, checkOut.value);
        if(difference) {
            updateDates(checkIn.value, checkOut.value);
            updateNumber(difference);
        } else {
            p1.textContent = `Check-in date cannot be greater than check-out date`;
            p2.textContent = "";
            p3.textContent = "";
        };
    };
};

function todayError(date) {
    p1.textContent = `${date} cannot be older than today`;
    p2.textContent = "";
    p3.textContent = "";
}

people.addEventListener("keyup", function() {
    isInRange(this.value);
});

people.addEventListener("change", function() {
    isInRange(this.value);
    if(checkToday(checkIn.value) && checkToday(checkOut.value)) updateSummary();
});

checkIn.addEventListener("change", function() {
    if(checkToday(this.value)) updateSummary();
    else todayError("Check-in");
});

checkOut.addEventListener("change", function() {
    if(checkToday(this.value)) updateSummary();
    else todayError("Check-out");
});