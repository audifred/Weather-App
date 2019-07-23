let lat, lon;

if ('geolocation' in navigator) {
  console.log('geolocation available');
  navigator.geolocation.getCurrentPosition(async position => {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    console.log(lat, lon);

    const api_url = `weather/${lat},${lon}`;
    const response = await fetch(api_url);
    const json = await response.json();

    console.log(json);

    let temperature = json.currently.temperature;
    let summary = json.currently.summary;
    document.getElementById('summary').textContent = summary;
    document.getElementById('temperature').textContent = temperature;

    const data = { lat, lon, temperature, summary };
    console.log(data);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    const responseData = await fetch('/api', options);
    const jsonData = await responseData.json();
    console.log(jsonData);
  });
} else {
  console.log('geolocation not available');
}
