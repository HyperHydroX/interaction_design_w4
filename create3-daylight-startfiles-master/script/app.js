
// _ = helper functions
function _parseMillisecondsIntoReadableTime(timestamp) {
	//Get hours from milliseconds
	const date = new Date(timestamp * 1000);
	// Hours part from the timestamp
	const hours = '0' + date.getHours();
	// Minutes part from the timestamp
	const minutes = '0' + date.getMinutes();
	// Seconds part from the timestamp (gebruiken we nu niet)
	// const seconds = '0' + date.getSeconds();

	// Will display time in 10:30(:23) format
	return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}

const it_be_night = () => {
	console.log("It is night");
	document.querySelector("html").document()
}

// 5 TODO: maak updateSun functie
const update_sun = (sun, left, bottom ,today) => {
	sun.style.setProperty("--local-sun-position-left", `${left}%`);
	sun.style.setProperty("--local-sun-position-bottom", `${bottom}%`);

	sun.setAttribute("data-time", `${today.getHours()}:${today.getMinutes()}`);
}

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (totalMinutes, sunrise) => {
	// In de functie moeten we eerst wat zaken ophalen en berekenen.
	console.log(`Total minutes: ${totalMinutes}`);
	console.log(`Sunrise: ${sunrise * 1000}`);
	// Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
	const sun = document.querySelector(".js-sun");
	const minutes_left = document.querySelector(".js-time-left")

	
	var today = new Date();
	console.log(`today time: ${today.getHours()}:${today.getMinutes()}`);
	const sunrise_date = new Date(sunrise * 1000);
	console.log(`Sunrise date: ${sunrise_date}`);

	// Bepaal het aantal minuten dat de zon al op is.
	console.log(`today.gettime(): ${today.getTime()}`)
	let sun_uptime = new Date(today.getTime() - sunrise);
	console.log(`Sun uptime ${sun_uptime}`);
	let minutes_sun_uptime = sun_uptime.getHours() * 60 + sun_uptime.getMinutes();
	console.log(`Sun uptime in minutes ${minutes_sun_uptime}`);

	// Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
	console.log(sun.dataset.time);
	const percentage = (100 / totalMinutes) * sun_uptime;
	const sun_left = percentage;
	const sun_bottom = percentage < 50 ? percentage * 2 : (100 - percentage) * 2; //Na middag zakt de zon weer

	update_sun(sun, sun_left, sun_bottom, today);

	// We voegen ook de 'is-loaded' class toe aan de body-tag.
	document.querySelector("body").classList.add("is_loaded");

	// Vergeet niet om het resterende aantal minuten in te vullen.
	minutes_left.textContent = totalMinutes - minutes_sun_uptime;

	// Nu maken we een functie die de zon elke minuut zal updaten
	const t = setInterval(() => {
		today = new Date();

		if(minutes_left < 0 || minutes_left > totalMinutes) {
			clearInterval(t);
		} else {

		}
	}, 60000); //1000ms = 1s


	// Bekijk of de zon niet nog onder of reeds onder is
	// Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
	// PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
};

// 3 Met de data van de API kunnen we de app opvullen
const showResult = (queryResponse) => {
	// We gaan eerst een paar onderdelen opvullen
	const sunrise = document.querySelector(".js-sunrise");
	const sunsset = document.querySelector(".js-sunset");
	const location = document.querySelector(".js-location");

	// Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
	location.textContent = `${queryResponse.city.name}, ${queryResponse.city.country}`;
	// Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang
	sunrise.textContent = _parseMillisecondsIntoReadableTime(queryResponse.city.sunrise);
	sunsset.textContent = _parseMillisecondsIntoReadableTime(queryResponse.city.sunset);
	
	// Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
	// Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.

	
	const time_difference = new Date(queryResponse.city.sunset * 1000 - queryResponse.city.sunrise * 1000);
	placeSunAndStartMoving(time_difference.getHours() * 60 + time_difference.getMinutes(), queryResponse.city.sunrise);

	//ANDERE OPTIE
	// const time = _parseMillisecondsIntoReadableTime(queryResponse.city.sunrise - queryResponse.city.sunset, queryResponse.city.sunrise)
	// console.log(time);
	// placeSunAndStartMoving(queryResponse.city.sunrise - queryResponse.city.sunset, queryResponse.city.sunrise);
};

const get_api_data = (url) => fetch(url).then((r) => r.json());

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
const getAPI = async (lat, lon) => {
	// Eerst bouwen we onze url op
	const end_point = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=9fde57d11b4e9c2c1bed941db295bcc3&units=metric&lang=nl&cnt=1`;
	// Met de fetch API proberen we de data op te halen.
	const weather_respone = await get_api_data(end_point);
	console.log(weather_respone);
	// Als dat gelukt is, gaan we naar onze showResult functie. 
	showResult(weather_respone);
};

document.addEventListener('DOMContentLoaded', function() {
	// 1 We will query the API with longitude and latitude.
	getAPI(50.8027841, 3.2097454);
	
});
