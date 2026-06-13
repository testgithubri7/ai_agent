const axios = require("axios");

async function weatherTool(city) {

    const apiKey = process.env.WEATHER_API_KEY;

    const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);

    return {
        city,
        temperature: response.data.main.temp,
        condition: response.data.weather[0].main
    };
}

module.exports = weatherTool;