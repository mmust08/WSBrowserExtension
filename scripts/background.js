chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'bookSeats') {
    bookSeatsForDateRange(request)
      .then(sendResponse)
      .catch(error => sendResponse({ success: false, message: `Error: ${error.message}` }));
    return true; // Indicates that the response is sent asynchronously
  }
});

async function bookSeatsForDateRange({ floorId, seatId, emailId, startDate, endDate }) {
  if (!floorId || !seatId || !emailId || !startDate || !endDate) {
    throw new Error('Please fill in all fields.');
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const bookings = [];

  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    try {
      await bookSeat(floorId, seatId, emailId, date);
      bookings.push(date.toISOString().split('T')[0]);
    } catch (error) {
      console.error(`Failed to book seat for ${date.toISOString().split('T')[0]}:`, error);
      throw new Error(`Failed to book seat for ${date.toISOString().split('T')[0]}. Please try again.`);
    }
  }

  return { success: true, message: `Booked seats for dates: ${bookings.join(', ')}` };
}

async function bookSeat(floorId, seatId, emailId, date) {
  const formattedDate = date.toISOString().split('T')[0];
  const startTime = `${formattedDate}T09:30:00+05:30`;
  const endTime = `${formattedDate}T18:30:00+05:30`;

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
      startTime,
      endTime,
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

  return response.json();
}