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

const urlParams = new URLSearchParams(window.location.search);
const bookingId = urlParams.get("bookingId");
const amount = urlParams.get("amount");

const l_amount = document.getElementById("l-amount");

l_amount.innerText = `Rs.${amount}`;

const BaseUrl = "http://127.0.0.1:8000";

const payBtn = document.getElementById("payBtn");
const booking_id = document.getElementById("booking_id");

booking_id.value = bookingId;

const Amount = document.getElementById("amount");
Amount.value = amount;

payBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  payBtn.disabled = true;
  payBtn.innerText = "Processing...";

  try {
    // STEP 1: Create Payment
    const res = await fetch(`${BaseUrl}/payment/create-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ booking_id: bookingId }),
    });

    const result = await res.json();

    // STOP HERE IF STEP 1 FAILS
    if (!res.ok) {
      showToast("error", result.detail || "Payment creation failed");
      
      // If payment was already done, we can redirect, but STOP other execution
      if (result.detail === "Payment already done") {
        window.location.href = `payment_success.html?bookingId=${bookingId}`;
      }
      
      payBtn.disabled = false; // Re-enable button so they can try again
      payBtn.innerText = "Pay Now";
      return; // <--- CRITICAL: Do not proceed to Step 2
    }

    // STEP 2: Verify & Create Ticket
    // result.payment_id is now guaranteed to exist because we checked res.ok
    const verifyResult = await handleVerifyPaymentAndCreateTicket(bookingId, result.payment_id);
    
    if (verifyResult && (verifyResult.success || verifyResult.message === "Ticket created successfully")) {
       window.location.href = `payment_success.html?bookingId=${bookingId}`;
    } else {
       payBtn.disabled = false;
       payBtn.innerText = "Pay Now";
    }

  } catch (error) {
    payBtn.disabled = false;
    payBtn.innerText = "Pay Now";
    showToast("error", error.message);
  }
});


const handleVerifyPaymentAndCreateTicket = async (bookingId, paymentId) => {
  // CRITICAL: Ensure values are actually strings and keys match Pydantic


  const payload = { 
      booking_id: String(bookingId), 
      payment_id: String(paymentId) 
  };

  try {
      const res = await fetch(`${BaseUrl}/payment/verify-payment-and-create-ticket`, {
          method: "POST",
          headers: { 
              "Content-Type": "application/json", // MANDATORY for FastAPI JSON parsing
                // Usually needed if protected
          },
          body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
          showToast("success", result.message);
          return result; 
      } else {
          // Log the error detail from FastAPI to see EXACTLY what failed
          console.error("FastAPI Validation Error:", result.detail);
          showToast("error", result.detail?.[0]?.msg || "Verification failed");
          return { success: false };
      }
  } catch (error) {
      showToast("error", error.message);
      return { success: false };
  }
};

