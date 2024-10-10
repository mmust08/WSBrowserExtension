console.log('Content script loaded');

let enableSeatSelection = false;

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
  else if (request.action === "captureSeatID") {
    enableSeatSelection = true;
  }

  return true; // Indicates that the response is sent asynchronously
});

console.log('Content script setup complete');

//Detect seatId

let firstSeatIdFound = false;
let selectedSeatElement = null;

// Function to extract seat number and send it to the popup
function captureSeatNumber(element) {
  const id = element.id || '';  // Get the id of the element
  const seatPattern = /test-floorplan-seat(?:-capacity-text)?-(\d+)/;
  const match = seatPattern.exec(id);

  if (match) {
    const seatNumber = match[1];  // Extracted number from the id
    firstSeatIdFound = true;
    enableSeatSelection = false;

      // Remove the tick mark from the previously selected element
    if (selectedSeatElement && selectedSeatElement !== element) {
      // Remove the tick mark and the class from the previous element
      const tick = selectedSeatElement.querySelector('span.tick-mark');
      if (tick) {
        selectedSeatElement.removeChild(tick);
      }
      selectedSeatElement.classList.remove('seat-selected');
    }

    // Add the tick mark to the currently selected element
    if (!element.classList.contains('seat-selected')) {
      // Create a tick mark element
      const tickMark = document.createElement('span');
      tickMark.textContent = '✔'; // Tick mark content
      tickMark.classList.add('tick-mark'); // Add a class to identify the tick mark
      tickMark.style.color = 'green'; // Optional: Style the tick mark
      tickMark.style.marginLeft = '5px'; // Optional: Add some space before the tick

      // Append the tick mark to the element without removing its existing content
      element.appendChild(tickMark);
      element.classList.add('seat-selected'); // Add a class to indicate it's selected

      // Update the reference to the currently selected element
      selectedSeatElement = element;
    }

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
  if (!enableSeatSelection) {
    return;
  }

  const element = event.target;
  captureSeatNumber(element);
}

// Add event listener for mouseover
document.addEventListener('mouseover', handleMouseOver);