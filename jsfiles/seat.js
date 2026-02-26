// ================= AUTH =================
const token = localStorage.getItem("access_token");
const role = localStorage.getItem("role");

if (!token) {
  window.location.href = "login.html";
}

if (role === "admin") {
  alert("Admins are not allowed");
  window.location.href = "home.html";
}

// ================= TRIP =================
const urlParams = new URLSearchParams(window.location.search);
const tripId = urlParams.get("tripId");


const BaseUrl = "http://127.0.0.1:8000";
const seat_layout = document.getElementById("seat-layout");

let selectedSeats = [];

// ================= SEAT CLICK =================
document.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("seat") &&
    !e.target.classList.contains("bg-gray-400")
  ) {
    const seat = Number(e.target.dataset.seat);

    if (selectedSeats.includes(seat)) {
      selectedSeats = selectedSeats.filter((s) => s !== seat);
      e.target.classList.remove("bg-green-500", "text-white");
    } else {
      selectedSeats.push(seat);
      e.target.classList.add("bg-green-500", "text-white");
    }

    console.log("Selected:", selectedSeats);
  }
});

// ================= GET SEAT LAYOUT =================
const handleGetSeatLayout = async () => {
  try {
    const res = await fetch(`${BaseUrl}/booking/seat-layout/${tripId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (!res.ok) {
      return showToast("error", result.detail);
    }

    const bookedSeats = result.booked_seats;
    const price = result.price

    // ===== UI =====
    seat_layout.innerHTML = `
      <div class="grid grid-cols-4 place-items-center mt-15 gap-10 p-5">
        ${Array.from({ length: result.total_seats })
          .map((_, index) => {
            const seatNumber = index + 1;
            const isBooked = bookedSeats.includes(String(seatNumber));

            return `
              <div 
                data-seat="${seatNumber}"
                class="seat text-sm font-bold w-30 h-10 border-2 flex items-center justify-center rounded-lg cursor-pointer transition-all
                ${
                  isBooked
                    ? "bg-gray-400 cursor-not-allowed"
                    : "border-red-500 hover:bg-red-500 hover:text-white"
                }">
                ₹${price}
              </div>
            `;
          })
          .join("")}
      </div>

      <div class="flex justify-center mt-5">
        <button id="bookBtn" 
          class="bg-red-500 mt-10 text-white px-6 py-2 rounded-lg hover:bg-red-600">
          Book Seats
        </button>
      </div>
    `;

    // ===== ADD BOOK EVENT =====
    document
      .getElementById("bookBtn")
      .addEventListener("click", handleBooking);
  } catch (error) {
    showToast("error", error.message);
  }
};

// ================= BOOKING =================
const handleBooking = async () => {
  if (selectedSeats.length === 0) {
    return showToast("error", "Select seats first");
  }

  try {
    const res = await fetch(`${BaseUrl}/booking/book`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        trip_id: tripId,
        seats: selectedSeats.map(String),
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      console.log(result);
      
      return showToast("error", result.detail);
    }

    showToast("success", "Seats booked successfully");

    // redirect to payment
    window.location.href = `payment.html?bookingId=${result.booking_id}&amount=${result.total_amount}`;
  } catch (err) {
    showToast("error", err.message);
  }
};

// ================= INIT =================
handleGetSeatLayout();