const token = localStorage.getItem("token");
if (!token) location.href = "login.html";

/* ========= HELPERS ========= */
function getExcludedTransactions() {
  return JSON.parse(localStorage.getItem("excluded")) || [];
}

function saveExcludedTransactions(list) {
  localStorage.setItem("excluded", JSON.stringify(list));
}

/* ========= LOAD ========= */
$(document).ready(function () {
  setActiveTab();
  renderExcluded();
});

/* ========= RENDER ========= */
function renderExcluded() {

  const excluded = getExcludedTransactions();

  const companyA = $("#excludeCompanyA");
  const companyB = $("#excludeCompanyB");

  companyA.empty();
  companyB.empty();

  if (!excluded.length) {
    companyA.html(`<div class="alert alert-info">No excluded transactions</div>`);
    companyB.html(`<div class="alert alert-info">No excluded transactions</div>`);
    return;
  }

  excluded.forEach((tx, index) => {

    const card = `
      <div class="border rounded p-2 mb-2">
        <input type="checkbox" class="include-check" data-index="${index}">
        <div class="mt-1">
          <div><strong>${tx.transactionType || "Transaction"}</strong></div>
          <small>${tx.transactionDate || ""}</small>
          <div class="fw-bold">$${tx.amount || 0}</div>
        </div>
      </div>
    `;

    if (tx.company === "Company1") {
      companyA.append(card);
    } else {
      companyB.append(card);
    }
  });
}

/* ========= INCLUDE BACK ========= */
$("#includeBtn").on("click", function () {

  const excluded = getExcludedTransactions();

  const selectedIndexes = $(".include-check:checked")
    .map(function () {
      return Number($(this).data("index"));
    }).get();

  if (!selectedIndexes.length) {
    alert("Please select at least one transaction");
    return;
  }

  const updated = excluded.filter(
    (_, i) => !selectedIndexes.includes(i)
  );

  saveExcludedTransactions(updated);

  alert("Selected transactions included back to Unreconciled");

  location.href = "dashboard.html";
});

/* ========= ACTIVE TAB ========= */
function setActiveTab() {
  const page = window.location.pathname.split("/").pop();

  if (page === "dashboard.html") {
    $("#tab-unreconciled").addClass("active");
  } 
  else if (page === "reconcile.html") {
    $("#tab-reconciled").addClass("active");
  } 
  else if (page === "exclude.html") {
    $("#tab-exclude").addClass("active");
  }
}