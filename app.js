const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const config = require("./config")

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

const port = 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// how to handle the user input for request on the weather
app.post("/", (req, res) => {
  // //Parameters for our api search key
  let query = req.body.cityInput;
  const {weatherAPI: {apiKey}} = config;
  console.log(apiKey);
  const units = "imperial";
  // how can make a call to collect the data form the api
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=${units}&appid=${apiKey}`;
  https.get(url, (response) => {

    // This is the data that we capture for the API
    response.on("data", data => {
      // how we can convert the data into a json format
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const iconLoc = weatherData.weather[0].icon;
      // html code to send back to the user
      let heading = `<h1>The temperature in ${query} is  ${temp} degree F</h1>`;
      let currWeather = `<p>The Weather is currently ${weatherDescription} `;
      let link = "http://openweathermap.org/img/wn/" + iconLoc + "@2x.png";
      let image = `<img src =${link} style ="background-color=blue;position:block;"> </img>`;
      res.send(heading + currWeather + image);
    });
  });
});




app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
