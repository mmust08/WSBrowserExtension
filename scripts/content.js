console.log('Content script loaded');

function getFloorIdFromUrl() {
  const urlPattern = /\/floors\/(\d+)/;
  const match = window.location.href.match(urlPattern);
  return match ? match[1] : null;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in content script:', request);
  if (request.action === "getFloorId") {
    const floorId = getFloorIdFromUrl();
    console.log('Sending floor ID:', floorId);
    sendResponse({ floorId: floorId });
  }
  return true; // Indicates that the response is sent asynchronously
});

console.log('Content script setup complete');

//Detect seatId

let firstSeatIdFound = false;

// Function to extract seat number and send it to the popup
function captureSeatNumber(element) {
  const id = element.id || '';  // Get the id of the element
  const seatPattern = /test-floorplan-seat(?:-capacity-text)?-(\d+)/;
  const match = seatPattern.exec(id);

  if (match) {
    const seatNumber = match[1];  // Extracted number from the id
    firstSeatIdFound = true;

    // Send the seat number to the popup
    chrome.runtime.sendMessage({ seatNumber: seatNumber });
  }
  else {
    if(!firstSeatIdFound) {
      // Send a message to the popup to clear the seat number
      chrome.runtime.sendMessage({ errorMsgSeatId: "Hover over the profile image to see the seat ID" });
    }
  }
}

// Mouseover event handler
function handleMouseOver(event) {
  const element = event.target;
  captureSeatNumber(element);
}

// Add event listener for mouseover
document.addEventListener('mouseover', handleMouseOver);