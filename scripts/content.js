console.log("Content script loaded");

let enableSeatSelection = false;

function getFloorIdFromUrl() {
  const urlPattern = /\/floors\/(\d+)/;
  const match = window.location.href.match(urlPattern);
  return match ? match[1] : null;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received in content script:", request);
  if (request.action === "getFloorId") {
    const floorId = getFloorIdFromUrl();
    console.log("Sending floor ID:", floorId);
    sendResponse({ floorId: floorId });
  } else if (request.action === "captureSeatID") {
    enableSeatSelection = true;
  }

  return true; // Indicates that the response is sent asynchronously
});

console.log("Content script setup complete");

//Detect seatId

let firstSeatIdFound = false;
let selectedSeatElement = null;

function captureSeatNumber(element) {
  const id = element.id || ""; // Get the id of the element
  const seatPattern = /test-floorplan-seat(?:-capacity-text)?-(\d+)/;
  const match = seatPattern.exec(id);

  if (match) {
    const seatNumber = match[1]; // Extracted seat number from the id
    firstSeatIdFound = true;
    enableSeatSelection = false;

    // Remove the tick mark from the previously selected element
    if (selectedSeatElement && selectedSeatElement !== element) {
      const tick = selectedSeatElement.querySelector("span.tick-mark");
      if (tick) {
        selectedSeatElement.removeChild(tick);
      }
      selectedSeatElement.classList.remove("seat-selected");
    }

    // Add the tick mark to the currently selected element
    if (!element.classList.contains("seat-selected")) {
      // Create a tick mark element
      const tickMark = document.createElement("span");
      tickMark.textContent = "✔"; // Tick mark content
      tickMark.classList.add("tick-mark"); // Add a class to identify the tick mark

      // Apply styles to center the tick mark with white background
      tickMark.style.position = "absolute";
      tickMark.style.top = "50%";
      tickMark.style.left = "50%";
      tickMark.style.transform = "translate(-50%, -50%)"; // Center the tick mark
      tickMark.style.backgroundColor = "white"; // White background
      tickMark.style.padding = "8px"; // Add some padding around the tick
      tickMark.style.borderRadius = "50%"; // Optional: make the background circular
      tickMark.style.fontSize = "25px"; // Adjust font size if needed
      tickMark.style.color = "green"; // Tick mark color

      // Ensure the element has relative positioning to center the tick
      element.style.position = "relative";

      // Append the tick mark to the element
      element.appendChild(tickMark);
      element.classList.add("seat-selected"); // Add a class to indicate it's selected

      // Update the reference to the currently selected element
      selectedSeatElement = element;
    }

    // Send the seat number to the popup
    chrome.runtime.sendMessage({ seatNumber: seatNumber });
  } else {
    if (!firstSeatIdFound) {
      // Send an error message if no seat is found
      chrome.runtime.sendMessage({
        errorMsgSeatId: "Hover over the profile image to see the seat ID",
      });
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
document.addEventListener("mouseover", handleMouseOver);
