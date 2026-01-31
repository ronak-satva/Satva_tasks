/* ================= LOCAL STORAGE HELPERS ================= */
function getExcludedTransactions() {
  return JSON.parse(localStorage.getItem("excluded")) || [];
}

function saveExcludedTransactions(list) {
  localStorage.setItem("excluded", JSON.stringify(list));
}

const token = localStorage.getItem("token");
if (!token) location.href = "login.html";

/* ================= GLOBALS ================= */
let allData = [];
let selectedC1 = null;
let debitAmount = 0; // Company 1 (DEBIT)
let creditAmount = 0;  
let c1ToC2Map = {}; // map of C1 id → dropped C2 DOM elements

/* ================= INIT ================= */
$(document).ready(function () {
  fetchTransactions();
});

$(document).on("click", ".exclude-checkbox", function (e) {
  e.stopPropagation(); // prevent card click
});

/* ================= API ================= */
function fetchTransactions() {
  $.ajax({
    url: "http://trainingsampleapi.satva.solutions/api/Reconciliation/GetTransaction",
    type: "GET",
    headers: { Authorization: "Bearer " + token },
    success: function (res) {
      allData = [
        ...res.fromCompanyTransaction.map((tx) => mapTransaction(tx, "Company1")),
        ...res.toCompanyTransaction.map((tx) => mapTransaction(tx, "Company2")),
      ];
      renderTransactions();
      initDragDrop();
      bindC1Click();
    },
    error: function () {
      alert("Failed to load transactions");
    },
  });
}

/* ================= NORMALIZE ================= */
function mapTransaction(tx, company) {
  let debit = 0, credit = 0;
  tx.lines.forEach(line => line.isCredit ? (credit += line.amount) : (debit += line.amount));
  return {
    transactionId: tx.transactionId,
    transactionType: tx.transactionType,
    transactionDate: tx.date,
    company,
    amount: debit || credit
  };
}

/* ================= RENDER ================= */
function renderTransactions() {
  $("#reconciliation-container").empty();
  $("#company2").empty();

  const reconciled = JSON.parse(localStorage.getItem("reconciledList")) || [];
  const excluded = getExcludedTransactions();

  const reconciledC1Ids = reconciled.map(r => r.c1.transactionId);
  const reconciledC2Ids = reconciled.flatMap(r => r.c2List.map(c2 => c2.transactionId));

  allData.forEach(tx => {
    // Skip excluded
    if (excluded.some(x => x.id === tx.transactionId)) return;

    // COMPANY 1
    if (tx.company === "Company1") {
      if (reconciledC1Ids.includes(tx.transactionId)) return;

      const row = $(`
        <div class="row mb-2 align-items-start" data-c1id="${tx.transactionId}">
          <div class="col-md-4">
            <div class="tx-card border p-2 bg-light"
                 data-id="${tx.transactionId}"
                 data-company="Company1"
                 data-amount="${tx.amount}">
              <div class="form-check mb-1">
                <input class="form-check-input exclude-checkbox" type="checkbox" data-id="${tx.transactionId}">
                <label class="form-check-label small">Exclude</label>
              </div>
              <div>${tx.transactionType}</div>
              <small>${tx.transactionDate}</small>
              <div class="fw-bold">$${tx.amount}</div>
            </div>
          </div>
          <div class="col-md-8">
            <div class="drop-area border rounded p-2 bg-white" data-c1id="${tx.transactionId}">
              <small class="text-muted">Drop C2 here</small>
            </div>
          </div>
        </div>
      `);

      $("#reconciliation-container").append(row);
    }

    // COMPANY 2
    else {
      if (reconciledC2Ids.includes(tx.transactionId)) return;

      const c2Card = $(`
        <div class="tx-card border p-2 mb-2 bg-success text-white"
             data-id="${tx.transactionId}"
             data-company="Company2"
             data-amount="${tx.amount}">
          <div class="form-check mb-1">
            <input class="form-check-input exclude-checkbox" type="checkbox" data-id="${tx.transactionId}">
            <label class="form-check-label small text-white">Exclude</label>
          </div>
          <div>${tx.transactionType}</div>
          <small>${tx.transactionDate}</small>
          <div class="fw-bold">$${tx.amount}</div>
        </div>
      `);

      $("#company2").append(c2Card);
    }
  });

  // Re-bind drag/drop and click
  initDragDrop();
  bindC1Click();
}

/* ================= DRAG & DROP ================= */
function initDragDrop() {
  // C2 draggable
  new Sortable(document.getElementById("company2"), {
    group: { name: "shared", put: true },
    sort: true,
    animation: 150
  });

  // Drop areas
  $(".drop-area").each(function () {
    new Sortable(this, {
      group: "shared",
      animation: 150,
      onAdd: function(evt) {
        const c1Id = $(evt.to).data("c1id");
        if (!c1ToC2Map[c1Id]) c1ToC2Map[c1Id] = [];
        c1ToC2Map[c1Id].push(evt.item);
        $(evt.to).addClass("expanded");

        const c1Card = $(`.tx-card[data-id="${c1Id}"][data-company="Company1"]`);
        if (c1Card.length) selectC1(c1Card);

        updateTotals();
      },
      onRemove: function(evt) {
        const c1Id = $(evt.from).data("c1id");
        c1ToC2Map[c1Id] = c1ToC2Map[c1Id].filter(i => i !== evt.item);
        if (!c1ToC2Map[c1Id].length) $(evt.from).removeClass("expanded");
        updateTotals();
      }
    });
  });
}

/* ================= C1 CLICK ================= */
function bindC1Click() {
  $(".tx-card").off("click").on("click", function (e) {
    if ($(e.target).hasClass("exclude-checkbox")) return;
    if ($(e.target).closest(".exclude-checkbox").length) return;

    selectC1($(this));
  });
}

function selectC1(card) {
  $(".tx-card").removeClass("selected");
  card.addClass("selected");
  selectedC1 = card;

  const c1Id = card.data("id");
  debitAmount = Number(card.data("amount"));
  creditAmount = c1ToC2Map[c1Id]
    ? c1ToC2Map[c1Id].reduce((sum, el) => sum + Number($(el).data("amount")), 0)
    : 0;

  updateTotals();
}

/* ================= TOTALS ================= */
function updateTotals() {
  let totalDebit = 0;
  let totalCredit = 0;

  for (const c1Id in c1ToC2Map) {
    const droppedC2 = c1ToC2Map[c1Id];
    const c1Card = $(`.tx-card[data-id="${c1Id}"]`);
    if (!c1Card.length) continue;

    const debit = Number(c1Card.data("amount"));
    const credit = droppedC2.reduce((sum, el) => sum + Number($(el).data("amount")), 0);

    totalDebit += debit;
    totalCredit += credit;
  }

  $("#debit").text(totalDebit);
  $("#credit").text(totalCredit);
  $("#reconcileBtn").prop("disabled", totalDebit !== totalCredit || totalDebit === 0);
}

/* ================= RECONCILE BUTTON ================= */
$("#reconcileBtn").on("click", function () {

  const reconciledList =
    JSON.parse(localStorage.getItem("reconciledList")) || [];

  let reconciledCount = 0;

  for (const c1Id in c1ToC2Map) {

    const c1Card = $(`.tx-card[data-id="${c1Id}"][data-company="Company1"]`);
    const c2Els = c1ToC2Map[c1Id];

    if (!c1Card.length || !c2Els.length) continue;

    const debit = Number(c1Card.data("amount"));
    const credit = c2Els.reduce(
      (sum, el) => sum + Number($(el).data("amount")),
      0
    );

    // Only reconcile matched ones
    if (debit !== credit) continue;

    const c1Tx = {
      transactionId: Number(c1Id),
      transactionType: c1Card.find("div").eq(1).text(),
      transactionDate: c1Card.find("small").text(),
      amount: debit
    };

    const c2List = c2Els.map(el => ({
      transactionId: Number($(el).data("id")),
      transactionType: $(el).find("div").eq(1).text(),
      transactionDate: $(el).find("small").text(),
      amount: Number($(el).data("amount"))
    }));

    reconciledList.push({
      c1: c1Tx,
      c2List,
      reconciledAt: new Date().toISOString()
    });

    // Remove reconciled txns from allData
    allData = allData.filter(
      tx =>
        tx.transactionId !== Number(c1Id) &&
        !c2List.some(c2 => c2.transactionId === tx.transactionId)
    );

    reconciledCount++;
  }

  if (!reconciledCount) {
    alert("No matching debit-credit reconciliations found");
    return;
  }

  localStorage.setItem("reconciledList", JSON.stringify(reconciledList));

  // Reset state
  c1ToC2Map = {};
  selectedC1 = null;
  $("#debit").text("0");
  $("#credit").text("0");
  $("#reconcileBtn").prop("disabled", true);

  renderTransactions();
  alert(`${reconciledCount} reconciliation(s) completed successfully`);
});
/* ================= EXCLUDE BUTTON ================= */
$("#excludeBtn").on("click", function () {
  let excluded = getExcludedTransactions();
  const checked = $(".exclude-checkbox:checked");
  if (!checked.length) { alert("Please check at least one transaction to exclude"); return; }

  checked.each(function () {
    const card = $(this).closest(".tx-card");
    if (!excluded.some(x => x.id === Number(card.data("id")))) {
      excluded.push({
        id: Number(card.data("id")),
        company: card.data("company"),
        transactionType: card.find("div").eq(1).text(),
        transactionDate: card.find("small").text(),
        amount: Number(card.data("amount"))
      });
    }
  });

  saveExcludedTransactions(excluded);
  alert("Selected transactions excluded");
  location.href = "exclude.html";
});

/* ================= LOGOUT ================= */
$("#logoutBtn").on("click", () => {
  if (!confirm("Are you sure you want to logout?")) return;

  localStorage.removeItem("token");
  localStorage.removeItem("reconciledList");
  localStorage.removeItem("excluded");
  window.location.href = "login.html";
});