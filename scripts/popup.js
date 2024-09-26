
document.addEventListener('DOMContentLoaded', function() {

  console.log('DOMContentLoaded');

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "getFloorId"}, function(response) {
      if (response && response.floorId) {
        document.getElementById('floorId').value = response.floorId;
      }
    });
  });
});

document.getElementById('bookButton').addEventListener('click', () => {

  console.log('bookButton clicked');

    const seatId = document.getElementById('seatId').value;
    const floorId = document.getElementById('floorId').value;
    const emailId = document.getElementById('emailId').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    const statusDiv = document.getElementById('status');

    // if (!floorId || !seatId || !emailId || !startDate || !endDate) {
    //   statusDiv.innerText = "Please fill in all fields.";
    //   return;
    // }
  
    chrome.runtime.sendMessage({
      action: 'bookSeats',
      seatId: seatId,
      floorId: floorId,
      emailId: emailId,
      startDate: startDate,
      endDate: endDate
    }, response => {
      statusDiv.textContent = response.message;
    });
  });

