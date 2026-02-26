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

const BaseUrl = "http://127.0.0.1:8000";

const urlParams = new URLSearchParams(window.location.search);
const bookingId = urlParams.get("bookingId");



const downloadBtn = document.getElementById('downloadBtn')

downloadBtn.addEventListener('click', async () => {
  // 1. UI updates
  downloadBtn.disabled = true;
  showToast("info", "Downloading your ticket...");

  const downloadUrl = `${BaseUrl}/payment/ticket/download/${bookingId}`;

  try {
      // 2. Fetch the file (Wait for completion)
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // 3. Temporary link create karke click karein
      const a = document.createElement('a');
      a.href = url;
      a.download = `Ticket_${bookingId}.pdf`; 
      document.body.appendChild(a);
      a.click();
      
      // 4. Cleanup and Redirect
      window.URL.revokeObjectURL(url);
      a.remove();

      showToast("success", "Redirecting to Home...");
      
      // 5. Home page par navigation
      setTimeout(() => {
          window.location.replace('/frontend/') // Apne home route ka URL yahan dalein
      }, 1500); // Thoda delay taaki toast message dikh sake

  } catch (error) {
      console.error(error);
      showToast("error", "Download failed, please try again.");
      downloadBtn.disabled = false;
  }
});

