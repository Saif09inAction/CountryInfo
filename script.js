function handleSearch() {
    const countryName = document.getElementById('userInput').value.trim();
    const resultDiv = document.getElementById("result");

    if (!countryName) {
        resultDiv.innerHTML = `<p>Please enter a country name.</p>`;
        return;
    }

    const API_URL = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

    fetch(API_URL)
        .then(response => {
            if (!response.ok) throw new Error("Country not found");
            return response.json();
        })
        .then(data => {
            const country = data[0];
            const currencies = Object.keys(country.currencies).map(c => `${c} (${country.currencies[c].name})`).join(', ');
            const languages = Object.values(country.languages).join(', ');

            resultDiv.innerHTML = `
                <div class="fade-in">
                    <img src="${country.flags.png}" alt="Flag of ${country.name.common}" width="150">
                    <h2>Name: ${country.name.common}</h2>
                    <h2>Capital: ${country.capital}</h2>
                    <h3>Continent: ${country.continents[0]}</h3>
                    <h3>Currencies: ${currencies}</h3>
                    <h3>Languages: ${languages}</h3>
                    <h3>Population: ${country.population.toLocaleString()}</h3>
                </div>
            `;
        })
        .catch(error => {
            resultDiv.innerHTML = `<p>Country not found or an error occurred.</p>`;
            console.error(error);
        });
}

// Voice search using Web Speech API
const micBtn = document.getElementById("micBtn");
const userInput = document.getElementById("userInput");

let recognition;
if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    micBtn.addEventListener("click", () => {
        micBtn.classList.add("listening");
        recognition.start();
    });

    recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        userInput.value = transcript;
        handleSearch();
    };

    recognition.onerror = function (event) {
        alert("Voice recognition error. Try again.");
    };

    recognition.onend = function () {
        micBtn.classList.remove("listening");
    };
} else {
    micBtn.disabled = true;
    micBtn.title = "Voice search not supported";
}

