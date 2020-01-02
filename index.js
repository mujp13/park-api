'use strict';

const apiKey = 'Qhe7TbrpnogPIAzaQfBsZuXMxlSjGvHexLHvYjzN';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

function displayResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();

  for (let i = 0; i < responseJson.data.length; i++) {
    $('#results-list').append(
      `<li><h3>${responseJson.data[i].fullName}</h3> 
      <p><b>State:</b> ${responseJson.data[i].states}</p>
      <p><b>Description:</b> ${responseJson.data[i].description}</p>
      <p><b>Link:</b> <a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a></p>
      </li>`
    );
  }

  $('#results').removeClass('hidden');

  if(responseJson.total==='0') {
    $('#results').html('<h2>No result found</h2>');
  }
}

function getYouTubeVideos(query, maxResults = 10) {
  const params = {
    api_key: apiKey,
    stateCode: query,
    limit: maxResults
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + queryString;

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

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val().replace(/\s+/g,'');
    const maxResults = $('#js-max-results').val();
    getYouTubeVideos(searchTerm, maxResults);
  });
}

$(watchForm);
