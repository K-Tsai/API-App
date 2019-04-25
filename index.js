
const apiKey= '335136-ShowFind-BZJT4Z3C'
const searchURL = 'https://tastedive.com/api/similar'

function formatParams(params){
   const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
      return queryItems.join('&');
}

function displayResults(responseJson) {
	for (let i = 0 ; i < responseJson.results.length; i++){
		$('#results-list').append(`
			<li><p>${responseJson.results[i].name}</p></li>`
      )};
      $('#results').removeClass('hidden');
} 

function getShow(searchTerm) {
    const params = {
      k: apiKey,
      q: searchTerm,
      info: 1,
	 }
	 
	 const queryString = formatParams(params);
	 const url = searchURL + '?' + queryString;

   fetch(url, {
      mode: 'no-cors'
   })
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
      const searchTerm = $('#homeInput').val();
      $('form').empty()
		getShow(searchTerm);
   });
}

$(watchForm);