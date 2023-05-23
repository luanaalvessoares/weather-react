# Weather app
React app that brings the weather forecast from the user's geolocation, in addition to allowing him to search for the forecast of a specific location, the location is also shown on a map.

This is a project that uses React, SASS for the style being responsive, leaflet for rendering the location map, axios for the requests and Jest for the tests.

## Install package
```
npm install
```

## Run the project
```
npm start
```

Access via.\
Endereço [http://localhost:3000](http://localhost:3000) no browser.

## To run tests
```
npm test
```

## Generate build
```
npm run build
```

The tests cover the following scenarios:

- Rendering of the search form.
- Search weather data for the user's current location.
- Search weather data for a searched location.
- Display of weather information after data search.
- Display of weather forecast after data fetching.
- Display of charging status during data search.
