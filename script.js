document.getElementById("book-btn").addEventListener("click", function (e) {
  e.preventDefault();

  const meetingName = document.getElementById("meeting-title").value.trim();
  const rooms = document.getElementById("rooms").value;
  const date = document.getElementById("date").value;
  const fromTime = document.getElementById("from-time").value;
  const toTime = document.getElementById("to-time").value;
  const editId = document.getElementById("edit-id").value;

  if (!meetingName || !rooms || !date || !fromTime || !toTime) {
    alert("Please fill in all fields.");
    return;
  }

  let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

  const checkBooking = bookings.some((b) => {
    return (
      b.id != editId &&
      b.date === date &&
      b.rooms === rooms &&
      fromTime < b.toTime &&
      toTime > b.fromTime
    );
  });

  if (checkBooking) {
    alert("This room is already booked during that time.");
    return;
  }

  if (editId) {
    bookings = bookings.map((b) =>
      b.id == editId ? { ...b, meetingName, rooms, date, fromTime, toTime } : b
    );
    alert("Booking updated successfully.");
  } else {
    const newBooking = {
      id: Date.now(),
      meetingName,
      rooms,
      date,
      fromTime,
      toTime,
    };
    bookings.push(newBooking);
    alert("Booking created successfully.");
  }

  localStorage.setItem("bookings", JSON.stringify(bookings));
  resetForm();
  displayBookings();
});

function displayBookings() {
  const bookingList = document.getElementById("booking-list");
  bookingList.innerHTML = "";

  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

  if (bookings.length === 0) {
    bookingList.innerHTML = "<p class='text-center'>No bookings yet.</p>";
    return;
  }

  const table = document.createElement("table");
  table.className =
    "table table-bordered table-striped table-hover align-middle mt-4";

  table.innerHTML = `
    <thead class="table-light">
      <tr>
        <th>Meeting Title</th>
        <th>Room</th>
        <th>Date</th>
        <th>From</th>
        <th>To</th>
        <th class="text-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      ${bookings.map(
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
      )}
    </tbody>
  `;

  bookingList.appendChild(table);
}

function editBooking(id) {
  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  const booking = bookings.find((b) => b.id === id);
  if (!booking) return;

  document.getElementById("meeting-title").value = booking.meetingName;
  document.getElementById("rooms").value = booking.rooms;
  document.getElementById("date").value = booking.date;
  document.getElementById("from-time").value = booking.fromTime;
  document.getElementById("to-time").value = booking.toTime;
  document.getElementById("edit-id").value = booking.id;
}

function deleteBooking(id) {
  if (confirm("Are you sure you want to delete this booking?")) {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const updatedBookings = bookings.filter((b) => b.id !== id);
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));
    displayBookings();
  }
}

function resetForm() {
  document.getElementById("meeting-title").value = "";
  document.getElementById("rooms").value = "";
  document.getElementById("date").value = "";
  document.getElementById("from-time").value = "";
  document.getElementById("to-time").value = "";
  document.getElementById("edit-id").value = "";
}

window.addEventListener("DOMContentLoaded", displayBookings);
