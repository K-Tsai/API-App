const apiKey= "335136-ShowFind-BZJT4Z3C";
const youTubeApiKey= "AIzaSyDY6tZooYg2-diCPVzj-QC97jxBZczDfSQ";
const searchURL = "https://tastedive.com/api/similar";
const corsURL= "https://cors-anywhere.herokuapp.com/";
const youTubeURL = "https://www.googleapis.com/youtube/v3/videos";  

function formatParams(params){
   const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
      return queryItems.join("&");
}

function empty() {
   $("form").empty();
   $("#resultsInfo").empty();
   $("#results-list").empty();
}

function hideTitle() {
   $(".homeTitle").addClass("hidden");
   $(".homeDesc").addClass("hidden");
   $(".homeDesc2").addClass("hidden");
   $("body").toggleClass("backgroundColor")
}

function clickRec() {
   $("#results-list").on("click", "li", function(event) {
      empty();
      let targetEvent = event.target;
      let targetValue = $(targetEvent).text();
      let targetSiblingEvent = $(event.target).siblings("#pressCursor");
      let targetSiblingValue = $(targetSiblingEvent).text();
      if(!targetValue) {
         targetValue = targetSiblingValue;
      } 
      getShow(targetValue);
   });
}

function displayResults(responseJson) {
   empty();
   if (responseJson.Similar.Info[0].Type !== "unknown") {
      $("form").append(`
         <input type = "text" class= "homeInput" placeholder = "Search Another Show" required>
         <button type = "submit" class= "homeButton">Search</button>
      `);
      for (let i = 0 ; i < responseJson.Similar.Info.length ; i++) {
         $("#resultsInfo").append(`
            <h1 class= "formTitle">${responseJson.Similar.Info[i].Name}</h1>
            <iframe class = "video" width="520" height="415"
            src="${responseJson.Similar.Info[i].yUrl}">
            </iframe>
            <p class = "showDesc">${responseJson.Similar.Info[i].wTeaser}</p>
         `);
      }
      for (let i = 0; i < responseJson.Similar.Results.length; i++) {
         getThumbnail(responseJson.Similar.Results[i].yID, responseJson.Similar.Results[i].Name);
      }
   } else {
      $("form").append(`
         <input type = 'text' class='homeInput' role ="inputValue" aria-live = "assertive" placeholder = "Search Another Show" required>
         <button type = 'submit' role = "buttonClick" aria-controls= "homeInput" class= 'homeButton'>Search</button>
      `); 
      $("#resultsInfo").append(`
      <p class = "errorMessage">No results were found from your search, please try another show.</p>
      `);
      $('form').append(`
         <input type = 'text' class='homeInput' placeholder = "Search Another Show" role ="inputValue" aria-live = "assertive" required>
         <button type = 'submit' class= 'homeButton' aria-controls="homeInput">Search</button>
         <p>Please Enter in a Valid Input</p>`
      ); 
   }
} 

function displayThumbnail(responseJson, showName) {
   for (let i = 0; i < responseJson.items.length; i++) {
      $("#results-list").append(`
         <li>
            <p id = "pressCursor">${showName}</p>
            <img src=${responseJson.items[i].snippet.thumbnails.high.url} id= "thumbnail" alt="Results image" height= "200" width="200">
         </li>
      `); 
   }
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
      hideTitle();
      empty(); 
      if (searchTerm) {
         getShow(searchTerm);
      }
      getThumbnail();
   });
}

function results() {
   watchForm()
   clickRec();
}


$(results);
