chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'bookSeats') {
    bookSeatsForDateRange(request)
      .then(sendResponse)
      .catch(error => sendResponse({ status: false, message: `${error.message}` }));
    return true; // Indicates that the response is sent asynchronously
  }
});

async function bookSeatsForDateRange({ floorId, seatId, emailId, startDate, endDate }) {
  if (!floorId || !seatId || !emailId || !startDate || !endDate) {
    throw new Error("Please fill in all fields.");
  }

  const bookings = [];

  try{
    const bookingList = getDaysInRange(startDate, endDate);

    for (let date of bookingList) {
      try {
        // await bookSeat(floorId, seatId, emailId, date);
        bookings.push(date.toISOString().split('T')[0]);
      } catch (error) {
        throw new Error(`Failed to book seat for ${date.toISOString().split('T')[0]}. Please try again.`);
      }
    }
  }
  catch(err){
    throw new Error(err);
  }

  return { status: true, message: `Booked seats for dates: ${bookings.join(', ')}` };
}

// async function bookSeat(floorId, seatId, emailId, date) {
//   const formattedDate = date.toISOString().split('T')[0];
//   const startTime = `${formattedDate}T09:30:00+05:30`;
//   const endTime = `${formattedDate}T18:30:00+05:30`;

//   const response = await fetch(`https://worksense.optimaze.net/api/v1/floors/${floorId}/capacityobjects/${seatId}/bookings`, {
//     method: 'POST',
//     headers: {
//       'accept': 'application/json, text/plain, */*',
//       'accept-language': 'en-US,en;q=0.9,en-IN;q=0.8',
//       'content-type': 'application/json',
//       'x-worksense-client': 'Web'
//     },
//     body: JSON.stringify({
//       bookingMethod: "Internal",
//       isPrivate: false,
//       floorId: parseInt(floorId),
//       capacityObjectId: parseInt(seatId),
//       startTime,
//       endTime,
//       bookedFor: {
//         email: emailId,
//         bookingType: 2
//       }
//     }),
//     credentials: 'include'
//   });

//   if (!response.ok) {
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }

//   return response.json();
// }

function getDaysInRange(startDate, endDate) {
  // Parse the input dates
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Check if start date is after end date
  if (start > end) {
      throw new Error("Start date must be before end date.");
  }

  // Calculate the total days between the two dates
  const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  // Check if the total days exceed 14 days
  if (totalDays > 14) {
      throw new Error("The date range exceeds two weeks (14 days)!");
  }

  // Initialize an array to hold the final list of Date objects
  const finalDays = [];

  // Iterate through the date range and add weekdays to the final list
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const day = d.getDay();
      // Exclude Saturdays (6) and Sundays (0)
      if (day !== 0 && day !== 6) {
          finalDays.push(new Date(d)); // Push the actual Date object
      }
  }

  return finalDays;
}