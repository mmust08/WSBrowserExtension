console.log('Popup script loaded');

// Function to initialize the popup
function initializePopup() {
  console.log('Initializing popup');
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (!tab) {
      console.error('No active tab found');
      showError('No active tab found');
      return;
    }
    
    const url = tab.url;
    console.log('Current URL:', url);
    
    const floorId = getFloorIdFromUrl(url);
    if (floorId) {
      console.log('Floor ID found:', floorId);
      document.getElementById('floorId').value = floorId;
    } else {
      console.log('No floor ID found in URL');
      showError('No floor ID found in URL');
    }
  });
}

function getFloorIdFromUrl(url) {
  const urlPattern = /\/floors\/(\d+)/;
  const match = url.match(urlPattern);
  return match ? match[1] : null;
}

function handleBooking() {
  const fields = ['seatId', 'floorId', 'emailId', 'startDate', 'endDate'];
  const values = Object.fromEntries(fields.map(id => [id, document.getElementById(id).value]));

  if (Object.values(values).some(value => !value)) {
    showError("Please fill in all fields.");
    return;
  }

  chrome.runtime.sendMessage({ action: 'bookSeats', ...values }, handleBookingResponse);
}

function handleBookingResponse(response) {
  if (chrome.runtime.lastError) {
    showError(chrome.runtime.lastError);
  } else {
    response.status ? showStatus(response.message) : showError(response.message);
  }
}

// //function to enable seat selection
// function seatSelection(){
//   chrome.runtime.sendMessage({ action: 'seatSelection' });
// }

document.getElementById('btnSeatIdSelection').addEventListener('click', () => {
  // Get the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // Send a message to the content script
    chrome.tabs.sendMessage(tabs[0].id, { action: 'captureSeatID' });
  });
});

// Function to update the seat number input field
function updateSeatNumber(seatNumber) {
  document.getElementById('seatId').value = seatNumber;
  document.getElementById('seatIdAlertMessage').textContent = '';
}

function showErrorMessage(message) {
  document.getElementById('seatIdAlertMessage').textContent = message;
}

// Listen for seat number from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.seatNumber) {
    updateSeatNumber(request.seatNumber);  // Update the seat number in the input field
  }
  else if (request.errorMsgSeatId){
      showErrorMessage(request.errorMsgSeatId);
  }
});

function showStatus(message) {
  document.getElementById('status').textContent = message;
}

function showError(error) {
  document.getElementById('error').textContent = `${error}`;
}

// Initialize popup immediately
initializePopup();

// Set up event listeners when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupEventListeners);
} else {
  setupEventListeners();
}

function setupEventListeners() {
  document.getElementById('bookButton').addEventListener('click', handleBooking);
  // document.getElementById('btnSeatIdSelection').addEventListener('click', handleBooking);
}


console.log('Popup script setup complete');