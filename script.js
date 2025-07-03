document.getElementById("book-btn").addEventListener("click", function (e) {
  e.preventDefault();

  //collect the data with provide ids
  const meetingName = document.getElementById("meeting-title").value;
  const rooms = document.getElementById("rooms").value;
  const date = document.getElementById("date").value;
  const fromTime = document.getElementById("from-time").value;
  const toTime = document.getElementById("to-time").value;

  //vallidation for empty fields
  if (!meetingName || !rooms || !date || !fromTime || !toTime) {
    alert("Please Enter All the fields");
    return;
  }

  console.error(meetingName, rooms, date, fromTime, toTime);

  const allBookingRooms = JSON.parse(localStorage.getItem("bookings")) || [];

  // check any rooms are booked
  //   const checkRoom = allBookingRooms.find(
  //     (booked) =>
  //       booked.date == date &&
  //       booked.meetingName == meetingName &&
  //       booked.rooms === rooms &&
  //       booked.fromTime == fromTime &&
  //       booked.toTime == toTime
  //   );
  //   if (checkRoom) {
  //     alert("Room is already booked");
  //     return;
  //   }

  const checkRoom = allBookingRooms.find((booked) => {
    return (
      booked.date === date &&
      booked.rooms === rooms &&
      fromTime < booked.toTime &&
      toTime > booked.fromTime
    );
  });

  if (checkRoom) {
    alert("This room is already booked during that time.");
    return;
  }

  // if any room is not booked then the new booking data will be stored or pushed
  const newBooking = {
    id: Date.now(),
    meetingName,
    date,
    rooms,
    fromTime,
    toTime,
  };
  allBookingRooms.push(newBooking);
  localStorage.setItem("bookings", JSON.stringify(allBookingRooms));

  alert("Booking Succesfully");

  //after submiting the form to clear the input fields
  document.getElementById("meeting-title").value = "";
  document.getElementById("rooms").value = "";
  document.getElementById("date").value = "";
  document.getElementById("from-time").value = "";
  document.getElementById("to-time").value = "";
  console.log(allBookingRooms);
  //   displayBookings();

  //
  setTimeout(() => {
    location.reload();
  }, 1000);
});
///////////////////////////////////////////////////////////////

function displayBookings() {
  const bookingList = document.getElementById("booking-list");
  bookingList.innerHTML = ""; // Clear old content

  const allBookings = JSON.parse(localStorage.getItem("bookings")) || [];

  if (allBookings.length === 0) {
    bookingList.innerHTML = "<p class='text-center'>No bookings yet.</p>";
    return;
  }

  const table = document.createElement("table");
  table.className =
    "table table-bordered table-striped table-hover align-middle";

  table.innerHTML = `
    <thead class="table-light">
      <tr>
        <th>Meeting Title</th>
        <th>Room</th>
        <th>Date</th>
        <th>From</th>
        <th>To</th>
        <th class="text-center">Action</th>
      </tr>
    </thead>
    <tbody>
      ${allBookings
        .map(
          (booking) => `
          <tr>
            <td>${booking.meetingName}</td>
            <td>${booking.rooms}</td>
            <td>${booking.date}</td>
            <td>${booking.fromTime}</td>
            <td>${booking.toTime}</td>
            <td class="text-center">
              <button class="btn btn-sm btn-primary me-2" onclick="editBooking(${booking.id})">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="deleteBooking(${booking.id})">Delete</button>
            </td>
          </tr>
        `
        )
        .join("")}
    </tbody>
  `;

  bookingList.appendChild(table);
}

window.addEventListener("DOMContentLoaded", displayBookings);

function editBooking(id) {
  const confirmEdit = confirm("Do u want to edit");
  if (confirmEdit) {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const bookingToEdit = bookings.find((b) => b.id === id);

    if (!bookingToEdit) return;

    // Fill the form with existing data
    document.getElementById("meeting-title").value = bookingToEdit.meetingName;
    document.getElementById("rooms").value = bookingToEdit.rooms;
    document.getElementById("date").value = bookingToEdit.date;
    document.getElementById("from-time").value = bookingToEdit.fromTime;
    document.getElementById("to-time").value = bookingToEdit.toTime;

    // Remove it from storage temporarily
    const updatedBookings = bookings.filter((b) => b.id !== id);
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));

    displayBookings(); // Refresh display
  }
}

function deleteBooking(id) {
  const confirmDelete = confirm("Do u want to delte");
  if (confirmDelete) {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const updatedBookings = bookings.filter((b) => b.id !== id);

    localStorage.setItem("bookings", JSON.stringify(updatedBookings));
    displayBookings(); // Refresh display
  }
}
