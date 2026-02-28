const BaseUrl = "http://127.0.0.1:8000";

const handleGetUserBookings = async () => {
    const token = localStorage.getItem('access_token');

    try {
        const res = await fetch(`${BaseUrl}/booking/get-user-bookings`, {
            method: 'GET',
            headers: {
                "Content-type": 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        const result = await res.json();

        if (res.ok) {
            console.log(result);
            showToast("success", result.message);
        } else {
            showToast("error", result.detail);
        }

        const bookingsTable = document.getElementById('user-bookings');
        bookingsTable.innerHTML = ``;

        // Assuming result.data contains the bookings array
        const booking = result.booking;

        if (!booking || booking.length === 0) {
            bookingsTable.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-6 text-gray-500">
                        No bookings found
                    </td>
                </tr>
            `;
            return;
        }

        booking.forEach((b, index) => {

            const statusColor =
                b.status === "CONFIRMED"
                    ? "bg-green-100 text-green-700"
                    : b.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700";

            bookingsTable.innerHTML += `
                <tr class="hover:bg-gray-50 transition">
                    <td class="px-6 py-4 text-sm text-gray-700">${index + 1}</td>
                    <td class="px-6 py-4 text-sm text-gray-700 font-medium">${b.seats}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${b.ticket_no}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${b.ticket_url}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${b.total_price}</td>
                    <td class="px-6 py-4">
                        <span class="px-3 py-1 rounded-full text-xs font-semibold ${statusColor}">
                            ${b.status}
                        </span>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        showToast("error", error.message);
    }
};

handleGetUserBookings();