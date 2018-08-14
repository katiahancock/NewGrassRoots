// Updates the content of the page.body with the new bill details
function buildPage() {
  const apiUrl = createOpenStatesUrl(window.location.pathname);
  billContent(apiUrl)
  .then(resultObject => {
    const content = pageTemplate(resultObject);
    const element = document.createElement(content);
    const body = document.querySelector("body");
    body.innerHTML = "";
    body.appendChild(element);
  });
}

// Fetches the bill details from OpenStates
function billContent(openStatesBillUrl) {
  return fetchDataFromOpenStates(`http://www.openstates.org/api/${openStatesBillUrl}`)
    .then(res => res.json())
    .catch(error => {
      console.error('Oops something went wrong');
      return error;
    });
}

// Construct the URL to request from OpenStates using the window.location.pathname
function createOpenStatesUrl(somePath) {}

// This would be used for a single page application approach
function pageTemplate(object) {
  return `
  <body>
    <main className="displayarea">
      <div className="billcard">
        <h1 className="card-bill-id">${object.billID}</h1>
        <h3 className="bill-type">${object.billType}</h3>
        <p className="bill-title">${object.billTitle}</p>
        <button className="bill-details">${object.billDetails}</button>
      </div>
    </main>
  </body>`;
}
