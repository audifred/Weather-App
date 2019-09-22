const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});

app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

// Load database
const database = new Datastore('database.db');
database.loadDatabase();

app.get('/api', (request, response) => {
  database.find({}, (err, data) => {
    return response.json(data[0]);
  });
});

// get req for weather from darkSky
app.get('/weather/:latlon', async (request, response) => {
  const latlon = request.params.latlon.split(',');
  const lat = latlon[0];
  const lon = latlon[1];

  sApiKey = process.env.SkyAPIKEY;
  const api_url = `https://api.darksky.net/forecast/${sApiKey}/${lat},${lon}`;
  const fetchResponse = await fetch(api_url);
  const json = await fetchResponse.json();
  response.json(json);
});

app.post('/api', async (request, response) => {
  const data = request.body;
  const timestamp = new Date();
  data.timestamp = timestamp.toString();

  const fTime = timestamp.toLocaleString;
  database.insert(data);

  response.json({
    status: 'success',
    time: fTime,
    lat: data.lat,
    lon: data.lon,
    temp: data.temperature,
    summ: data.summary
  });
});

app.get('/coordinates/:citystate', async (request, response) => {
  console.log('getting coordinates...');
  const citystate = request.params.citystate.split(',');
  const city = citystate[0];
  const state = citystate[1];

  const googleApiKey = process.env.GMapsAPIKEY;
  const coords_url = `https://maps.googleapis.com/maps/api/geocode/json?address=${city},+${state}&key=${googleApiKey}`;
  const respo = await fetch(coords_url);
  const json = await respo.json();
  response.json(json);
});

app.get('/api', async (request, response) => {});
