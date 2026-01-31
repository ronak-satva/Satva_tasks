const token = localStorage.getItem("token");
if (!token) location.href = "login.html";

/* ================= LOCAL STORAGE ================= */
function getReconciledTransactions() {
  return JSON.parse(localStorage.getItem("reconciledList")) || [];
}

/* ================= RENDER ================= */
function renderReconciled() {

  const reconciled = getReconciledTransactions();
  const container = $("#reconciledList");
  container.empty();

  if (!reconciled.length) {
    container.html(`
      <div class="alert alert-info">
        No reconciled transactions found
      </div>
    `);
    return;
  }

  reconciled.forEach((rec, index) => {

    const html = `
      <div class="card mb-4">

        <!-- HEADER -->
        <div class="card-header d-flex align-items-center gap-2">
          <input 
            type="checkbox"
            class="reconcile-check"
            data-index="${index}"
          />
          <strong>Reconciliation #${index + 1}</strong>
        </div>

        <!-- BODY -->
        <div class="card-body">
          <div class="row">

            <!-- COMPANY 1 -->
            <div class="col-md-4">
              <h6 class="text-muted">Company 1</h6>
              <div class="border p-2 bg-light rounded">
                <div>${rec.c1.transactionType}</div>
                <small>${rec.c1.transactionDate}</small>
                <div class="fw-bold">$${rec.c1.amount}</div>
              </div>
            </div>

            <!-- COMPANY 2 (MULTIPLE) -->
            <div class="col-md-8">
              <h6 class="text-muted">Company 2</h6>

              ${rec.c2List.map(c2 => `
                <div class="border p-2 mb-2 bg-success text-white rounded">
                  <div>${c2.transactionType}</div>
                  <small>${c2.transactionDate}</small>
                  <div class="fw-bold">$${c2.amount}</div>
                </div>
              `).join("")}

            </div>

          </div>
        </div>

      </div>
    `;

    container.append(html);
  });
}

/* ================= UNRECONCILE ================= */
$("#unreconcileBtn").on("click", function () {

  const reconciled = getReconciledTransactions();

  const checkedIndexes = $(".reconcile-check:checked")
    .map(function () {
      return Number($(this).data("index"));
    })
    .get();

  if (!checkedIndexes.length) {
    alert("Please select at least one reconciliation");
    return;
  }

  const updated = reconciled.filter(
    (_, index) => !checkedIndexes.includes(index)
  );

  localStorage.setItem("reconciledList", JSON.stringify(updated));

  alert("Selected transactions moved back to Unreconciled");
  location.reload();
});

/* ================= INIT ================= */
$(document).ready(renderReconciled);