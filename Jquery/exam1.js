const workbook = new ExcelJS.Workbook();
const sheet = workbook.addWorksheet('TimeLog');

sheet.columns = [
    { header: '#', key: 'id' },
    { header: 'Project', key: 'project' },
    { header: 'Date', key: 'date' },
    { header: 'Phase', key: 'phase' },
    { header: 'Status', key: 'status' },
    { header: 'Logged', key: 'logged' },
    { header: 'Billable', key: 'billable' },
    { header: 'Notes', key: 'notes' },
    { header: 'Out', key: 'out' },
    { header: 'Link', key: 'link' },
    { header: 'Desc', key: 'desc' }
];


function createRow() {

    // Create EMPTY row in ExcelJS
    const excelRow = sheet.addRow({
        id: '',
        project: '',
        date: '',
        phase: '',
        status: '',
        logged: '',
        billable: '',
        notes: '',
        out: false,
        link: '',
        desc: ''
    });

    const tr = document.createElement('tr');
    tr.dataset.saved = "false"; //whether it is stored in Excel
    tr.dataset.excelRow = excelRow.number;   //which Excel row it belongs to

    tr.innerHTML = `
      <td></td>
  
      <td>
        <select class="form-select req">
          <option value="">Select</option>
          <option>Javascript training</option>
          <option>Satva training</option>
        </select>
      </td>
  
      <td><input type="date" class="form-control req"></td>
  
      <td>
        <select class="form-select req">
          <option value="">Select</option>
          <option>Communication</option>
          <option>Analysis</option>
          <option>Bug Fixing</option>
        </select>
      </td>
  
      <td>
        <select class="form-select req">
          <option value="">Select</option>
          <option>Completed</option>
          <option>Pending</option>
        </select>
      </td>
  
      <td>
        <input type="number" class="form-control req logged" min="0" max="24" step="0.25">
      </td>
  
      <td>
        <input type="number" class="form-control req billable" min="0" max="24" step="0.25">
      </td>
  
      <td><input type="text" class="form-control req notes"></td>
      <td><input type="checkbox"></td>
      <td><input type="url" class="form-control req"></td>
      <td><input type="text" class="form-control req"></td>
    `;

    document.querySelector('#mainTable tbody').appendChild(tr);  //Adds row to UI
    reindexRows();  //Updates numbering
}

// Reindexing
function reindexRows() {

    const rows = document.querySelectorAll('#mainTable tbody tr');

    rows.forEach((row, i) => {
        const index = i + 1;

        // UI index
        row.children[0].innerText = index;

        // ExcelJS index
        const excelRow = sheet.getRow(row.dataset.excelRow);
        excelRow.getCell(1).value = index;
        excelRow.commit();
    });

    sessionStorage.setItem('timelog', JSON.stringify(sheet.getSheetValues()));
}

//   Save Once

function saveOnce() {

    document.querySelectorAll('#mainTable tbody tr').forEach(row => {

        if (row.dataset.saved === "true") return;

        let valid = true;
        row.querySelectorAll('.req').forEach(el => {
            if (!el.value) valid = false;
        });

        const logged = parseFloat(row.querySelector('.logged').value);
        const billable = parseFloat(row.querySelector('.billable').value);

        if (logged > 24 || billable > 24) valid = false;
        if (billable > logged) valid = false;

        if (!valid) return;

        const data = {
            id: row.children[0].innerText,
            project: row.children[1].querySelector('select').value,
            date: row.children[2].querySelector('input').value,
            phase: row.children[3].querySelector('select').value,
            status: row.children[4].querySelector('select').value,
            logged,
            billable,
            notes: row.children[7].querySelector('input').value,
            out: row.children[8].querySelector('input').checked,
            link: row.children[9].querySelector('input').value,
            desc: row.children[10].querySelector('input').value
        };

        // Update ExcelJS row
        const excelRow = sheet.getRow(row.dataset.excelRow);
        excelRow.values = Object.values(data);
        excelRow.commit();

        // Bottom preview
        addPreview(data);

        row.dataset.saved = "true";  //Saved rows cannot be edited or saved again.

        sessionStorage.setItem('timelog', JSON.stringify(sheet.getSheetValues()));
    });
}

// PREVIEW TABLE 
function addPreview(d) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${d.id}</td>
      <td>${d.project}</td>
      <td>${d.date}</td>
      <td>${d.phase}</td>
      <td>${d.status}</td>
      <td>${d.logged}</td>
      <td>${d.billable}</td>
      <td>${d.notes}</td>
      <td>${d.out}</td>
      <td>${d.link}</td>
      <td>${d.desc}</td>
    `;
    document.querySelector('#previewTable tbody').appendChild(tr);
}

document.getElementById('deleteRow').onclick = () => {

    const tbody = document.querySelector('#mainTable tbody');
    const lastRow = tbody.lastElementChild;  //Gets last row in UI.
    if (!lastRow) return;

    const excelRowNum = lastRow.dataset.excelRow;
    const isSaved = lastRow.dataset.saved === "true";

    // Remove ExcelJS row
    sheet.spliceRows(excelRowNum, 1);  //Deletes the linked Excel row.

    // Remove UI row
    lastRow.remove();

    // Remove preview row ONLY if saved
    if (isSaved) {
        document.querySelector('#previewTable tbody')
            .lastElementChild?.remove();
    }

    reindexRows();
};

//   Add Rows
document.getElementById('addRows').onclick = () => {
    const n = Number(document.getElementById('rowCount').value || 1);
    for (let i = 0; i < n; i++) createRow();
};

//   Auto save on click
document.addEventListener('click', saveOnce);

//  initial row
createRow();