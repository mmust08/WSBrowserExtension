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