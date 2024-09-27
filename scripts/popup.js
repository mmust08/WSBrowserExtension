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
    showStatus(response.message);
  }
}

function showStatus(message) {
  document.getElementById('status').textContent = message;
}

function showError(error) {
  console.error('Error:', error);
  document.getElementById('error').textContent = `Error: ${error}`;
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
}

console.log('Popup script setup complete');