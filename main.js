let searchResults;

function getAllBills() {
  return fetch(
    "https://openstates.org/api/v1/bills/?state=vt&apikey=2a939a8d-1448-4810-b036-79139a6a7f33&format=json&search_window=term:2017-2018"
  ).then(response => {
    return response.json();
  });
}

function displayResults(results) {
  for (let i = 0; i < results.length; i++) {
    let x = results[i];

    let billGUID = `bill-${x.id}`;

    const content = `
    <div class="billcard" data-bill-id=${x.id}>  
    <h1 class="billIdCard">${
      x.bill_id
    }<i class="far fa-star" id="${billGUID}"></i></h1>
      <i class="billTitle">"${
        x.title
      }"</i><a class="call-now" href="https://newgrassroots.com/account/login/">send voice message now</a><br>
      <button id="detailsButton" type="button">Bill Details</button>
      </div>
    `;
    const element = document.createElement("div");
    element.className = "cardContainer";
    const allCards = document.getElementById("displayarea");
    element.innerHTML = content;
    allCards.appendChild(element);
    element.addEventListener("click", getBillDetails);

    let toggleStar = document.getElementById(billGUID);
    toggleStar.addEventListener("click", toggleFavoriteStar);
  }
}

/*   */

function toggleFavoriteStar(event) {
  let element = event.target;

  if (element.classList.contains("fas")) {
    element.classList.remove("fas");
    element.classList.add("far");
  } else {
    element.classList.remove("far");
    element.classList.add("fas");
  }

  // alert(style);
  alert("Add this bill to my feed");
}

function secondFetch(billId) {
  fetch(
    `https://openstates.org/api/v1/bills/${billId}/?apikey=2a939a8d-1448-4810-b036-79139a6a7f33&format=json`
  )
    .then(res => res.json())
    .then(result => {
      console.log(result);
      document.getElementById("displayarea").textContent = "";

      const billContent = `
    <div className="bill-parent">
      <h1 className="bill-id-details">${result.bill_id}</h1>
      <h3 className="bill-title-details" class="font-italic">${
        result.title
      }</h3><br>
      <h4 className="bill-sponsors-details">Sponsor(s): 
        ${result.sponsors
          .map(x => {
            if (x.leg_id) {
              return `<a id="sponsor-link" href="https://openstates.org/vt/legislators/${
                x.leg_id
              }/">${x.name}</a>`;
            } else {
              return `<a id="sponsor-link" href="https://openstates.org/vt/committees/${
                x.committee_id
              }/">${x.name}</a>`;
            }
          })
          .join(", ")}
      </h4><br>
      <a class="call-now-details" href="https://newgrassroots.com/account/login/">send voice message now</a><br>
      <br>
      <table class="table table-striped table-hover" width=100%>
        <tr>
          <th scope="col" width=15%>Date</th>
          <th scope="col" width=85%>Action</th>
        </tr>
        <tr>
         <td className="bill-actions-date">${result.actions
           .map(
             x =>
               `<tr><td>${moment(x.date).format("MMMM Do, YYYY")}</td> <td>${
                 x.action
               }</td></tr>`
           )
           .reverse()
           .join("")}</td>
         </tr>
      </table>  
    </div>
    `;
      const thisBill = document.getElementById("displayarea");
      thisBill.innerHTML = billContent;
    });
}

function getBillDetails(event) {
  let element = event.target;
  let parent = element.parentElement;
  console.log("Bill ID: " + JSON.stringify(parent.dataset));
  if (parent.dataset.billId) {
    window.location.search = `?bill_id=${parent.dataset.billId}`;
  }
}

//User search for bills
function search(event) {
  console.log({ event });
  event.preventDefault();
  getAllBills().then(currentSessionBills => {
    document.getElementById("displayarea").textContent = "";
    console.log("in search!");

    // fuse.js specs
    const options = {
      shouldSort: true,
      tokenize: true,
      // distance: 50,
      threshold: 0.4,
      // location: 0,
      // minMatchCharLength: 1,
      // maxPatternLength: 32,
      keys: ["bill_id", "title"]
    };

    let searchTerms;
    searchTerms = document.getElementById("billSearch").value.trim();

    let fuse = new Fuse(currentSessionBills, options);

    return displayResults(fuse.search(searchTerms));
  });
}

const handleVisitingBill = () => {
  const urlParams = window.location.search;
  const path = window.location.pathname;
  const params = new URLSearchParams(urlParams);

  if (params.get("bill_id")) {
    console.log({ params });
    console.log("doing the bill fetch");
    secondFetch(params.get("bill_id"));
  }
};

let input = document.getElementById("billSearch");

//User press Enter key
input.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    search(event);
  }
});
const main = () => {
  handleVisitingBill();
};
main();
