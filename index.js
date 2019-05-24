const apiKey= '335136-ShowFind-BZJT4Z3C';
const youTubeApiKey= "AIzaSyDY6tZooYg2-diCPVzj-QC97jxBZczDfSQ";
const searchURL = 'https://tastedive.com/api/similar';
const corsURL= "https://cors-anywhere.herokuapp.com/";
const youTubeURL = "https://www.googleapis.com/youtube/v3/videos";  

function formatParams(params){
   const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
      return queryItems.join('&');
}

function empty() {
   $('form').empty()
   $('#resultsInfo').empty();
   $('#results-list').empty();
}

function clickRec() {
   $('#results-list').on('click', 'p', function(event) {
      empty();
      let targetEvent = event.target;
      console.log(targetEvent);
      let targetValue = $(targetEvent).text();
      getShow(targetValue);
   });
}

function displayResults(responseJson) {
   empty();
   console.log(responseJson);
   if (responseJson.Similar.Info[0].Type !== "unknown" && responseJson.Similar.Info[0].wUrl !== null){
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
         getThumbnail(responseJson.Similar.Results[i].yID, responseJson.Similar.Results[i].Name);
      };
   } else {
      $('form').append(`
         <input type = 'text' class='homeInput' placeholder = "Search Another Show" required>
         <button type = 'submit' class= 'homeButton'>Search</button>
         <p>Please Enter in a Valid Input</p>`
      ); 
   }
} 

function displayThumbnail(responseJson, showName) {
   for (let i = 0; i < responseJson.items.length; i++) {
      $("#results-list").append(`
         <li>
            <p id = 'pressCursor'>${showName}</p>
            <img src=${responseJson.items[i].snippet.thumbnails.high.url} alt="Results image" height= "200" width="200">
         </li>`) 
   };
}

function getThumbnail (youTubeID, showName) {
   const params = {
      key: youTubeApiKey,
      id: youTubeID,
      part: "snippet"
   }

   const queryString = formatParams(params);
   const url = youTubeURL + '?' + queryString;

   fetch(url)
      .then(response => {
         if (response.ok) {
            return response.json();
         }
         throw new Error(response.statusText);
      })
      .then(responseJson => displayThumbnail(responseJson, showName))
      .catch(err => {
         $('#js-error-message').text(`Something went wrong: ${err.message}`);
      });
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
    console.log(url);
    
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

function watchForm(youTubeID) {
   $('form').submit(event => {
      event.preventDefault();
      const searchTerm = $('.homeInput').val();
      empty(); 
      if (searchTerm) {
         getShow(searchTerm);
      }
      getThumbnail();
   });
}

function results(){
   watchForm()
   clickRec();
}
$(results);
