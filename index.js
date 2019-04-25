const apiKey= '335136-ShowFind-BZJT4Z3C'
const searchURL = 'https://tastedive.com/api/similar'

function formatParams(params){
   const queryItems = Object.keys(params)
      .map(key => `${encodeURIcomponent(params)}=${encodeURIComponent(params[key])}`);
      return queryItems.join('&');
}

function displayResults(responseJson) {
	for (let i = 0 ; i < responseJson.Similar.length; i++){
		$('#results-list').append(`
			${reponseJson.similar[i].results}`
		)};
} 

function getShow(searchTerm){
    const params = {
      q: searchTerm,
      k: apiKey,
      info: 1,
	 }
	 
	 const queryString = formatParams(params);
	 const url = searchURL + '?' + queryString;

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
		const searchTerm = $('#homeInput').val()
		$('.container').empty()
		getShow(searchTerm);
   });
}

$(watchForm);