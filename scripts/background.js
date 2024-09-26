chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'bookSeats') {
    bookSeatsForDateRange(request.floorId, request.seatId, request.emailId, request.startDate, request.endDate)
      .then(result => sendResponse({ message: result }))
      .catch(error => sendResponse({ message: `Error: ${error}` }));
    return true; // Indicates that the response is sent asynchronously
  }
});

async function bookSeatsForDateRange(floorId, seatId, emailId, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const bookings = [];

  if (!floorId || !seatId || !emailId || !startDate || !endDate) {
    return 'Please fill in all fields.';
  }

  return `Selected value: 
    floorId: ${floorId}
    seatId: ${seatId}
    emailId: ${emailId}
    startDate: ${startDate}
    endDate: ${endDate}
    `;

  // for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
  //   try {
  //     await bookSeat(floorId, seatId, emailId, date);
  //     bookings.push(date.toISOString().split('T')[0]);
  //   } catch (error) {
  //     console.error(`Failed to book seat for ${date.toISOString().split('T')[0]}:`, error);
  //   }
  // }

  // return `Booked seats for dates: ${bookings.join(', ')}`;
}

async function bookSeat(floorId, seatId, emailId, date) {
  const startTime = `${date.toISOString().split('T')[0]}T09:30:00+05:30`;
  const endTime = `${date.toISOString().split('T')[0]}T18:30:00+05:30`;

  const response = await fetch(`https://worksense.optimaze.net/api/v1/floors/${floorId}/capacityobjects/${seatId}/bookings`, {
    method: 'POST',
    headers: {
      'accept': 'application/json, text/plain, */*',
      'accept-language': 'en-US,en;q=0.9,en-IN;q=0.8',
      'content-type': 'application/json',
      'x-worksense-client': 'Web'
    },
    body: JSON.stringify({
      bookingMethod: "Internal",
      isPrivate: false,
      floorId: parseInt(floorId),
      capacityObjectId: parseInt(seatId),
      startTime: startTime,
      endTime: endTime,
      bookedFor: {
        email: emailId,
        bookingType: 2
      }
    }),
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}