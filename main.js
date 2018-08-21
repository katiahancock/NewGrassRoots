let searchResults;

function getAllBills() {
  return fetch(
    "https://openstates.org/api/v1/bills/?state=vt&apikey=2a939a8d-1448-4810-b036-79139a6a7f33&format=json&search_window=session"
  ).then(response => {
    return response.json();
  });
}



function displayResults(results) {

  for (let i = 0; i < results.length; i++) {

    let x = results[i];
    
    const content = `
    <div class="billcard" data-bill-id=${x.id}>
      <h1 class="billIdCard">${x.bill_id}</h1>
      <i class="billTitle">"${x.title}"</i>
      <button id="detailsButton" type="button">Bill Details</button>
    </div>
    `;
    const element = document.createElement("div");
    element.className = "cardContainer"
    const allCards = document.getElementById("displayarea");
    element.innerHTML = content;
    allCards.appendChild(element);
    element.addEventListener('click', getBillDetails);
  }
}

function secondFetch(billId) {
  fetch(`https://openstates.org/api/v1/bills/${billId}/?apikey=2a939a8d-1448-4810-b036-79139a6a7f33&format=json`)
    .then(res => res.json())
    .then(result => {
      console.log(result);
      document.getElementById("displayarea").textContent = "";
      
      const billContent = `
    <div className="bill-parent">
      <h1 className="bill-id-details">${result.bill_id}</h1>
      <h3 className="bill-title-details">${result.title}</h3>
      <h4 className="bill-sponsors-details">Sponsors: ${result.sponsors.map(x => legislatorFetch(x.leg_id)).join(', ')}</h4>
      <table border=1 width=100%>
        <tr>
        <th width=15%>Date</th>
        <th width=85%>Action</th>
        </tr>
        <tr>
         <td className="bill-actions-date">${result.actions.map(x => `<tr><td>${moment(x.date).format("MMMM Do, YYYY")}</td> <td>${x.action}</td></tr>`).reverse().join('')}</td>
         </tr>
      </table>  
    </div>
    `;
      const thisBill = document.getElementById("displayarea");
      thisBill.innerHTML = billContent;
    }
    );
}



function legislatorFetch(legislatorId) {
  return fetch(`https://openstates.org/api/v1/legislators/${legislatorId}/?apikey=2a939a8d-1448-4810-b036-79139a6a7f33&format=json`)
  .then(response => {
      return response.json();
  }).then(result => {
    return result.full_name;
  });
}


function getBillDetails(event) {
  let element = event.target;
  let parent = element.parentElement;
  console.log(parent.dataset.billId);
  secondFetch(parent.dataset.billId);
}

//User search for bills
function search(event) {
  console.log({event});
  event.preventDefault();
  getAllBills().then(currentSessionBills => {
    document.getElementById("displayarea").textContent = "";
    console.log("in search!");

    // fuse.js specs
    const options = {
      shouldSort: true,
      tokenize: true,
      // distance: 50,
      threshold: 0.5,
      // location: 0,
      // minMatchCharLength: 1,
      // maxPatternLength: 32,
      keys: ["bill_id", "title"]
    };

    let searchTerms;
    searchTerms = document.getElementById("billSearch").value.trim();

    let fuse = new Fuse(currentSessionBills, options);

    console.log('calling displayResults at ' + new Date(Date.now().toString()));
    return displayResults(fuse.search(searchTerms));
  });
};

let input = document.getElementById("billSearch");

//User press Enter key
input.addEventListener("keyup", function (event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    search(event);
  }
})



