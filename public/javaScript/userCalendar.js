/*
Functionality on the user calendar page.
*/

const dayList = [
    { dayName: "Monday", dayStatus: false },
    { dayName: "Tuesday", dayStatus: false },
    { dayName: "Wednesday", dayStatus: false },
    { dayName: "Thursday", dayStatus: false },
    { dayName: "Friday", dayStatus: false },
    { dayName: "Saturday", dayStatus: false },
    { dayName: "Sunday", dayStatus: false },
];

const date = new Date();
let today = date.getDay();

async function loadDays() {
	document.getElementById("calendarContainer").innerHTML = "";
    while(today > 0) {
        dayList.push(dayList.shift());
        today--;
    }
    await fetch('http://localhost:4000/calendar/getData', {})
        .then(response => response.json()).then(data => {
            for(i=0; i<7; i++) {
                dayList[i].dayStatus = data[i];
            }
        });
	dayList.forEach(function (dayElement) {
		let colourChooser = "dayBoxRed";
        if(dayElement.dayStatus) {
            colourChooser = "dayBoxGreen";
        }
        let newDay = document.createElement('div');
		newDay.innerHTML = `
			<div class="${colourChooser} containerBox">
				<h1>${dayElement.dayName}</h1>
			</div>
		`;

		while (newDay.firstChild) {
			document.getElementById("calendarContainer").appendChild(newDay.firstChild);
		}
	})
}

window.onload = loadDays();