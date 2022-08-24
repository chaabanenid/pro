//Geocoding services and APIs from https://developer.here.com/

const axios = require('axios');
const geoCodingApiKey = process.env.GEOCDING_API_KEY;

const geoCode={
 reverseGeoGetCountry: (attitude,longitude) => {
		const URL = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${attitude},${longitude}&lang=en-US&apikey=${geoCodingApiKey}`;
		return axios
		  .get(URL)
		  .then(response => {
              if(response.data.items.length==0)
              return 'undefined'
            return({city:response.data.items[0].address.city,address:response.data.items[0].address});
		  })
		  .catch(error => {
			console.log(error);
		  });
	
  }
}
  module.exports = {geoCode};