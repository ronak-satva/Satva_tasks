let masterData = []; // Save from master file
let destinationData = []; // Save from destination file
let mappings = {}; // final mapping per source account
let currentFilter = 'All'; 
let destinationFilter = 'All'; 

const TYPE_MAPPINGS = {
    'Assets': ['ASSETS'],
    'Liabilities': ['LIABILITIES'],
    'Equity': ['EQUITY/CAPITAL'],
    'Revenue': ['Professional Services Revenue', 'Product Revenue'],
    'COGS': ['Outside (or "1099") Professional Services Costs', 'Product Costs'],
    'Expense': ['Labor Expense'],
    'Other Rev & Exp': ['Other']
};

document.addEventListener('DOMContentLoaded', function() {
    loadExcelFiles(); 
    document.getElementById('submitBtn').addEventListener('click', function () {
        const confirmSubmit = confirm("Do you want to submit?");
    
        if (confirmSubmit) {
            saveToLocalStorage(); // Saves the data to local storage
        } 
    }); 
    document.getElementById('searchDestination').addEventListener('input', filterDestinationColumn); //Search functionality in destination
});

async function loadExcelFiles() {
    await loadMasterFile();
    await loadDestinationFile();
    loadFromLocalStorage();
    updateLastUpdated();
    initializeSortable();
}

async function loadMasterFile() {
    try {
        const response = await fetch('master.xlsx');
        const arrayBuffer = await response.arrayBuffer();    //Convert excel files(binary) to raw
        const data = new Uint8Array(arrayBuffer);  //standard binary container
        const workbook = XLSX.read(data, {type: 'array'});
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];// take first sheet
        const jsonData = XLSX.utils.sheet_to_json(firstSheet); //convert to json
        
        masterData = jsonData
            .map((row, index) => ({
                id: 'master_' + index,   //generate unique id
                number: row['Number'] || '',
                name: row['Name'] || '',
                type: row['Type'] || 'Other',
                count: row['Count'] || ''
            }))
            .filter(item => item.number && item.name); // empty or partially filled rows
        
        createFilterButtons();
        renderMappingTable();
    } catch (error) {
        console.error('Error loading master file:', error);
    }
}

async function loadDestinationFile() {
    try {
        const response = await fetch('destination.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, {type: 'array'});
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        
        destinationData = jsonData
            .map((row, index) => ({
                id: 'dest_' + index,
                number: row['AccountCode'] || '',
                name: row['AccountName'] || '',
                type: row['AccountTypeName'] || '',
                subAccountName: row['SubAccountName'] || '',
                count: ''
            }))
            .filter(item => item.number && item.name);
        
        createDestinationFilters();
        renderDestinationColumn();
    } catch (error) {
        console.error('Error loading destination file:', error);
    }
}

function createFilterButtons() {
    const types = ['All', ...new Set(masterData.map(item => item.type))];//select unique item type .
    const container = document.getElementById('filterButtons');
    container.innerHTML = '';
    
    types.forEach(type => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn' + (type === 'All' ? ' active' : '');
        btn.textContent = type;
        btn.onclick = () => filterByType(type);
        container.appendChild(btn);
    });
}

function createDestinationFilters() {
    const types = ['All', ...new Set(destinationData.map(item => item.type))];
    const container = document.getElementById('destinationFilters');
    container.innerHTML = '';

    types.forEach(type => {
        const btn = document.createElement('button');
        btn.className = 'filter-tab' + (type === 'All' ? ' active' : '');
        btn.textContent = type;
        btn.onclick = () => filterDestinationType(type);
        container.appendChild(btn);
    });

    initDestinationPagination();
}

function initDestinationPagination() {
    const container = document.getElementById('destinationFilters');
    const prevBtn = document.getElementById('destPrev');
    const nextBtn = document.getElementById('destNext');

    const scrollAmount = 150;

    prevBtn.onclick = () => {
        container.scrollLeft -= scrollAmount;
    };

    nextBtn.onclick = () => {
        container.scrollLeft += scrollAmount;
    };
}

function filterByType(type) {
    currentFilter = type;
    destinationFilter = 'All';
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === type); //Adds active class only to the clicked one
    });
    
    document.querySelectorAll('.filter-tab').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === 'All'); //Forces “All” tab to be active
    });
    
    renderMappingTable();
    renderDestinationColumn();
}

function filterDestinationType(type) {
    destinationFilter = type;
    document.querySelectorAll('.filter-tab').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === type);
    });
    renderDestinationColumn();
}

function filterDestinationColumn() {
    renderDestinationColumn();
}

//It collects all destination account IDs that are already mapped (Most Likely / Likely / Possible) and returns them as a fast-lookup set.
function getMappedItemIds() {
    const mappedIds = new Set();
    Object.values(mappings).forEach(mapping => {    // it gives [{mostlikely,likely,possible},{mostlikely,likely,possible}]    used destinaton accounts
        if (mapping.mostLikely) mappedIds.add(mapping.mostLikely.id);
        if (mapping.likely) mappedIds.add(mapping.likely.id);
        if (mapping.possible) mappedIds.add(mapping.possible.id);
    });
    return mappedIds;      //return set
}

function getDestinationTypesForMasterType(masterType) {
    if (masterType === 'All') {
        return null;
    }
    return TYPE_MAPPINGS[masterType] || [];    
}

function renderMappingTable() {
    const container = document.getElementById('mappingTableBody');
    const filtered = currentFilter === 'All'        // if all then show all data otherwise only matchingtype
        ? masterData 
        : masterData.filter(item => item.type === currentFilter); 
    
    container.innerHTML = ''; //clear old ones
    
    filtered.forEach(sourceAccount => {
        const mapping = mappings[sourceAccount.number] || {   //stored relationship keyyed by number
            mostLikely: null,
            likely: null,
            possible: null
        };
        
        const row = document.createElement('div');
        row.className = 'mapping-row';
        row.setAttribute('data-source-number', sourceAccount.number);   //used by drag and drop logic
        
        row.innerHTML = `
            <div class="row-cell source-cell">
                <span class="account-number">${sourceAccount.number}</span>
                <span class="account-name">${sourceAccount.name}</span>
                ${sourceAccount.count ? `<span class="account-count">${sourceAccount.count}</span>` : ''}
            </div>
            <div class="row-cell mapping-cell" data-source-number="${sourceAccount.number}" data-zone="mostLikely">
                ${mapping.mostLikely ? createMappedAccountHTML(mapping.mostLikely) : '<div class="empty-slot">Drop here</div>'}
            </div>
            <div class="row-cell mapping-cell" data-source-number="${sourceAccount.number}" data-zone="likely">
                ${mapping.likely ? createMappedAccountHTML(mapping.likely) : '<div class="empty-slot">Drop here</div>'}
            </div>
            <div class="row-cell mapping-cell" data-source-number="${sourceAccount.number}" data-zone="possible">
                ${mapping.possible ? createMappedAccountHTML(mapping.possible) : '<div class="empty-slot">Drop here</div>'}
            </div>
        `;
        
        container.appendChild(row);
    });
}

function createMappedAccountHTML(item) {
    return `
        <div class="account-item" draggable="true" data-id="${item.id}" data-type="${item.type}">
            <span class="account-number">${item.number}</span>
            <span class="account-name">${item.name}</span>
        </div>
    `;
}

// Start with all destination accounts

// Apply type filters (tabs + master filter)

// Remove already-mapped accounts

// Apply search (AccountCode / AccountName)

// Render the final list

function renderDestinationColumn() {
    const container = document.getElementById('destinationColumn');
    const searchTerm = document.getElementById('searchDestination').value.toLowerCase();   
    const mappedIds = getMappedItemIds();    //Returns a Set of destination IDs already used
    
    let filtered = destinationData;   // starts with intentional data
    
    if (destinationFilter !== 'All') {     //User clicked a destination tab . Show only that account type   
        filtered = filtered.filter(item => item.type === destinationFilter);
    } else if (currentFilter !== 'All') {        //Destination filter is All .Source filter is specific
        const mappedTypes = getDestinationTypesForMasterType(currentFilter);
        if (mappedTypes) {
            if (currentFilter === 'Other Rev & Exp') {
                filtered = filtered.filter(item => {
                    const subName = item.subAccountName.toLowerCase();
                    return subName.includes('other') && 
                           (subName.includes('revenue') || subName.includes('expense'));
                });
            } else {
                filtered = filtered.filter(item => mappedTypes.includes(item.type));   //get already mapped accounts  
            }
        }
    }
    
    //filtered = filtered.filter(item => !mappedIds.has(item.id));  //Same destination mapped twice. Data corruption  .remove already mapped item 
    
    if (searchTerm) {
        filtered = filtered.filter(item => {
            const numberMatch = item.number.toString().toLowerCase().includes(searchTerm);
            const nameMatch = item.name.toLowerCase().includes(searchTerm);
            return numberMatch || nameMatch;
        });
    }
    
    container.innerHTML = filtered.map(item => createDestinationAccountHTML(item)).join('');  //Convert data->html  join->Prevent commas
}

function createDestinationAccountHTML(item) {
    return `
        <div class="account-item" draggable="true" data-id="${item.id}" data-type="${item.type}">
            <span class="account-number">${item.number}</span>
            <span class="account-name">${item.name}</span>
        </div>
    `;
}

function initializeSortable() {
    const tableBody = document.getElementById('mappingTableBody');  // dropzone for mapping
    const destColumn = document.getElementById('destinationColumn'); //source column
    
    tableBody.addEventListener('dragover', handleDragOver); //Allow drop + highlight
    tableBody.addEventListener('dragleave', handleDragLeave);//when we leave one cell
    tableBody.addEventListener('drop', handleDrop);  //Finalize mapping
    
    destColumn.addEventListener('dragstart', handleDragStart);
    tableBody.addEventListener('dragstart', handleDragStartFromMapping);
    
    destColumn.addEventListener('dragover', handleDestinationDragOver);
    destColumn.addEventListener('drop', handleDestinationDrop);
    
    document.addEventListener('dragend', handleDragEnd);
}

function handleDragStart(e) {
    if (e.target.classList.contains('account-item')) {   //Only account items are draggable
        const itemId = e.target.getAttribute('data-id');
        e.dataTransfer.setData('text/plain', JSON.stringify({
            source: 'destination',
            itemId: itemId
        }));
        e.target.classList.add('dragging');//used for styling
    }
}

function handleDragStartFromMapping(e) {
    if (e.target.classList.contains('account-item') && e.target.parentElement.classList.contains('mapping-cell')) {
        const cell = e.target.parentElement;
        const sourceNumber = cell.getAttribute('data-source-number');
        const zone = cell.getAttribute('data-zone');
        const itemId = e.target.getAttribute('data-id');
        
        e.dataTransfer.setData('text/plain', JSON.stringify({
            source: 'mapping',
            sourceNumber: sourceNumber,
            zone: zone,
            itemId: itemId
        }));
        e.target.classList.add('dragging');
    }
}

function handleDragOver(e) {
    e.preventDefault();   
    const cell = e.target.closest('.mapping-cell'); // find which cell user is hovering
    if (cell) {
        cell.classList.add('drag-over');   //highlight drop area
    }
}

function handleDragLeave(e) {
    const cell = e.target.closest('.mapping-cell');
    if (cell && !cell.contains(e.relatedTarget)) {
        cell.classList.remove('drag-over');
    }
}

function handleDestinationDragOver(e) {
    e.preventDefault();
}

function handleDestinationDrop(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    if (!data) return;
    
    const parsedData = JSON.parse(data);
    
    if (parsedData.source === 'mapping') {
        const sourceMapping = mappings[parsedData.sourceNumber];
        if (sourceMapping) {
            sourceMapping[parsedData.zone] = null;
        }
        renderMappingTable();
        renderDestinationColumn();
    }
}

function handleDrop(e) {
    e.preventDefault();   
    const cell = e.target.closest('.mapping-cell');   //identify where the item is dropped
    if (!cell) return;
    
    cell.classList.remove('drag-over');
    
    const sourceNumber = cell.getAttribute('data-source-number');  //source number
    const targetZone = cell.getAttribute('data-zone');  //target zone
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));   //Reads the data we stored in dragstart
    
    if (data.source === 'destination') {
        handleDropFromDestination(data.itemId, sourceNumber, targetZone);
    } else if (data.source === 'mapping') {
        handleDropFromMapping(data, sourceNumber, targetZone);
    }
    
    renderMappingTable();
    renderDestinationColumn();
}

function handleDragEnd(e) {
    document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
}

function handleDropFromDestination(itemId, sourceNumber, targetZone) {  // itemId= ID of dragged destination account  sourceNumber = Source account row where dropped
    const item = destinationData.find(d => d.id === itemId);  //get full object
    if (!item) return;
    
    if (!mappings[sourceNumber]) {
        mappings[sourceNumber] = { mostLikely: null, likely: null, possible: null };  // ensure row exist
    }
    
    const mapping = mappings[sourceNumber];

    //  PREVENT DUPLICATE IN SAME ROW
    const alreadyMapped =
        mapping.mostLikely?.id === itemId ||
        mapping.likely?.id === itemId ||
        mapping.possible?.id === itemId;

    if (alreadyMapped) {
        alert('This account is already mapped in this row.');
        return;
    }
    
    if (targetZone === 'mostLikely') {
        const displaced = mapping.mostLikely;
        mapping.mostLikely = {...item};   // if spread not used then refernce will be taken . we used here becuase we want properties of item
        
        if (displaced) {
            const displaced2 = mapping.likely; // if there is item already , then move to likely
            mapping.likely = displaced;
            
            if (displaced2) {
                mapping.possible = displaced2;
            }
        }
    } else if (targetZone === 'likely') {
        const displaced = mapping.likely;
        mapping.likely = {...item};
        
        if (displaced) {
            mapping.possible = displaced;
        }
    } else if (targetZone === 'possible') {
        mapping.possible = {...item};
    }
}

// This function runs when you drag an account that is already mapped and drop it:

// Within the same source row (Most Likely → Likely → Possible, etc.)

// OR to a different source row
function handleDropFromMapping(data, targetSourceNumber, targetZone) {
    if (data.sourceNumber === targetSourceNumber) {   // drag from same row
        const mapping = mappings[targetSourceNumber];  //get that row mapping object i.e likely,mostlikely and possible
        if (!mapping) return;
        
        const item = mapping[data.zone];  //get the dragged itme
        if (!item) return;
        
        mapping[data.zone] = null;  // remove from original posiiton
        
        if (targetZone === 'mostLikely') {
            const displaced = mapping.mostLikely;
            mapping.mostLikely = item;
            
            if (displaced) {
                const displaced2 = mapping.likely;
                mapping.likely = displaced;
                
                if (displaced2) {
                    mapping.possible = displaced2;
                }
            }
        } else if (targetZone === 'likely') {
            const displaced = mapping.likely;
            mapping.likely = item;
            
            if (displaced) {
                mapping.possible = displaced;
            }
        } else if (targetZone === 'possible') {
            mapping.possible = item;
        }
    } else {  // drag into different row
        const sourceMapping = mappings[data.sourceNumber];   // get original row mapping
        if (!sourceMapping) return;
        
        const item = sourceMapping[data.zone];  // get dragged item
        if (!item) return;
        
        sourceMapping[data.zone] = null;  // reomve from old one
        
        handleDropFromDestination(item.id, targetSourceNumber, targetZone);
    }
}

function saveToLocalStorage() {
    const dataToSave = {
        mappings,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('accountMappings', JSON.stringify(dataToSave));
    updateLastUpdated();
    alert('Data saved successfully!');
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('accountMappings');
    if (saved) {
        const data = JSON.parse(saved);
        mappings = data.mappings || {};
        renderMappingTable();
    }
}

function updateLastUpdated() {
    const saved = localStorage.getItem('accountMappings');
    if (saved) {
        const data = JSON.parse(saved);
        const date = new Date(data.timestamp);
        const formatted = date.toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        document.getElementById('lastUpdated').textContent = `Last Updated on ${formatted}`;
    }
}

// $("#logoutBtn").click(() => {
//     if (confirm("Are you sure you want to log out?")) {
//       localStorage.removeItem('jwtToken');
//       window.location.href = 'login.html';
//     }
// });

$("#storageBtn").click(() => {
    if (confirm("Are you sure you want to clear your data??")) {
      localStorage.removeItem('accountMappings');
      window.location.href = 'index2.html';
    }
});