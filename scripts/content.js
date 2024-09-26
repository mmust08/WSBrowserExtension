function getFloorIdFromUrl() {
  const urlPattern = /\/floors\/(\d+)/;
  const match = window.location.href.match(urlPattern);
  return match ? match[1] : null;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getFloorId") {
    sendResponse({floorId: getFloorIdFromUrl()});
  }
});