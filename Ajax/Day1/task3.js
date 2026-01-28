const methodSelect = document.getElementById('method');
const bodySection = document.getElementById('body-section');
const headersSection = document.getElementById('headers-section');
const sendBtn = document.getElementById('sendRequest');
const urlInput = document.getElementById('url');
const bodyInput = document.getElementById('body');
const headersInput = document.getElementById('headers');
const responsePre = document.getElementById('response');
const statusSpan = document.getElementById('status');

// Show/Hide Body and Headers based on method
methodSelect.addEventListener('change', () => {
  const method = methodSelect.value;
  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    bodySection.style.display = 'block';
    headersSection.style.display = 'block';
  } else {
    bodySection.style.display = 'none';
    headersSection.style.display = 'none';
  }
});

// Send API request
$('#sendRequest').on('click', function () {

const method = $('#method').val();
const url = $('#url').val().trim();
const body = $('#body').val().trim();
const headersText = $('#headers').val().trim();

// ---------- BASIC URL VALIDATION ----------
if (!url) {
alert('URL is required');
return;
}

// ---------- METHODS THAT REQUIRE BODY ----------
const methodsWithBody = ['POST', 'PUT', 'PATCH'];

if (methodsWithBody.includes(method)) {
if (!body) {
alert(`${method} request requires a request body`);
return;
}

// Validate JSON body
try {
JSON.parse(body);
} catch (e) {
alert('Request body must be valid JSON');
return;
}
}

// ---------- HEADERS VALIDATION ----------
let headers = {};

if (headersText) {
try {
headers = JSON.parse(headersText);
} catch (e) {
alert('Headers must be valid JSON');
return;
}
}

// ---------- CONTENT-TYPE REQUIRED IF BODY EXISTS ----------
if (methodsWithBody.includes(method)) {
if (
!headers['Content-Type'] ||
headers['Content-Type'] !== 'application/json'
) {
alert('Content-Type: application/json is required when sending JSON body');
return;
}
}

// ---------- AUTHORIZATION REQUIRED (IF API IS PROTECTED) ----------
// Simple rule: if Authorization key exists but empty OR expected
if (headers['Authorization'] !== undefined && !headers['Authorization']) {     
alert('Authorization header cannot be empty');
return;
}

// ---------- BUILD FETCH OPTIONS ----------
let options = {
method: method,
headers: headers
};

if (methodsWithBody.includes(method)) {
options.body = JSON.stringify(JSON.parse(body));
}

// ---------- SEND REQUEST ----------
fetch(url, options)
.then(async res => {
const contentType = res.headers.get('content-type');
let data = contentType && contentType.includes('application/json')    // Check response isjson
  ? await res.json()
  : await res.text();

$('#status').text(`${res.status} ${res.statusText}`);
$('#response').text(JSON.stringify(data, null, 2));
})
.catch(err => {
$('#status').text('Error');
$('#response').text(err.toString());
});

});