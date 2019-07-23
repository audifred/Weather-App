const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = 5000;

app.listen(port, () => {
  console.log('Listening on Port 5000');
});

app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('database.db');
database.loadDatabase();

app.get('/api', (request, response) => {
  database.find({}, (err, data) => {
    response.json();
  });
});

app.post('/api', (request, response) => {
  console.log('I got a request');
  const data = request.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  database.insert(data);

  response.json({
    status: 'success',
    time: timestamp,
    lat: data.lat,
    lon: data.lon,
    temp: data.temperature,
    summ: data.summary
  });
});

app.get('/weather/:latlon', async (request, response) => {
  console.log(request.params);
  const latlon = request.params.latlon.split(',');
  console.log(latlon);
  const lat = latlon[0];
  const lon = latlon[1];
  console.log(lat, lon);
  sApiKey = process.env.SkyAPIKEY;
  const api_url = `https://api.darksky.net/forecast/${sApiKey}/${lat},${lon}`;
  const fetch_response = await fetch(api_url);
  const json = await fetch_response.json();
  response.json(json);
});
