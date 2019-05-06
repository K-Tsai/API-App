const apiKey= '335136-ShowFind-BZJT4Z3C'
const searchURL = 'https://tastedive.com/api/similar'
const corsURL= "https://cors-anywhere.herokuapp.com/"

function formatParams(params){
   const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
      return queryItems.join('&');
}

function displayResults(responseJson) {
   $('#resultsInfo').empty();
   $('#results-list').empty();
   $('form').append(`
      <input type = 'text' class='homeInput' placeholder = "Search Another Show" required>
      <button type = 'submit' class= 'homeButton'>Search</button>`
   );
   for (let i = 0 ; i < responseJson.Similar.Info.length; i++){
   $('#resultsInfo').append(`
      <h1>${responseJson.Similar.Info[i].Name}</h1>
      <iframe class = 'video' width="420" height="315"
      src="${responseJson.Similar.Info[i].yUrl}">
      </iframe>
      <p class = 'showDesc'>${responseJson.Similar.Info[i].wTeaser}</p>`)
   };
   for (let i = 0; i < responseJson.Similar.Results.length; i++) {
      $('#results-list').append(`
      <li>
      <a href = '${responseJson.Similar.Results[i].yUrl}' target='blank'>${responseJson.Similar.Results[i].Name}</a></li>`)
   };
} 

function getShow(searchTerm, limit = 6) {
    const params = {
      k: apiKey,
      q: searchTerm,
      info: 1,
      limit
	 }
	 
	 const queryString = formatParams(params);
    const url = corsURL + searchURL + '?' + queryString;
    
   fetch(url)
      .then(response => {
         if (response.ok) {
            return response.json();
         }
         throw new Error(response.statusText);
      })
      .then(responseJson => displayResults(responseJson))
      .catch(err => {
         $('#js-error-message').text(`Something went wrong: ${err.message}`);
      });
}

function watchForm() {
   $('form').submit(event => {
      event.preventDefault();
      const searchTerm = $('.homeInput').val();
      $('form').empty()
      getShow(searchTerm);
   });
}

$(watchForm);