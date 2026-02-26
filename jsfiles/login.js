const registerToggle = document.getElementById("registerToggleBtn");
const loginToggle = document.getElementById("loginToggleBtn");
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById('loginBtn')

let isToggleOn = false; // false = Register, true = Login

let isLoading = false; // Note: fixed the typo 'isLoding'

loginButton.addEventListener("click", () => {
    isLoading = !isLoading; // Toggle the state
    
    if (isLoading) {
        loginButton.textContent = "Logging...";
    } else {
        loginButton.textContent = "Login";
    }
});



const handleToggle = () => {
  isToggleOn = !isToggleOn;

  if (isToggleOn) {
    // Show Login UI
    loginToggle.classList.add("bg-red-500");
    registerToggle.classList.remove("bg-red-500");

    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
  } else {
    // Show Register UI
    registerToggle.classList.add("bg-red-500");
    loginToggle.classList.remove("bg-red-500");

    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
  }
};

const BaseUrl = "http://127.0.0.1:8000";

const registerFormData = document.getElementById("registerForm");

loginForm.addEventListener("submit", async(e) => {
    e.preventDefault()

    const formData = new FormData(loginForm)
    const data = Object.fromEntries(formData.entries())

    try {
        isLoading = true
        const res = await fetch(`${BaseUrl}/auth/login`, {
            method: "POST",
           headers : {
            "Content-Type": "application/json",
           },
           body: JSON.stringify(data)
        })

        const result = await res.json()
        console.log(result);
        if(result.success && result.user.role === "user"){
          localStorage.setItem("access_token", result.access_token)
          localStorage.setItem("role", result.user.role)
          sessionStorage.setItem("user", JSON.stringify(result.user))
          window.location.replace('userProfile.html')

        }else if(result.success && result.user.role === "admin"){
          localStorage.setItem("access_token", result.access_token)
          localStorage.setItem("role", result.user.role)
          sessionStorage.setItem('user', JSON.stringify(result.user))
            window.location.replace('adminDashboard.html')
        }

        showToast("success", result.message)
        
    } catch (error) {
        console.error("Server Error", error)
        showToast("error", result.detail || "Login failed")
    } finally {
        isLoading = false
    }
})

registerFormData.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(registerFormData);
  const data = Object.fromEntries(formData.entries());

  try {
    const res = await fetch(`${BaseUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    console.log(result);
    loginToggle.classList.add("bg-red-500");
    registerToggle.classList.remove("bg-red-500");

    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");

    showToast("success", result.message)
  } catch (error) {
    console.error("Server error", error);
    showToast("error", result.detail || "Register failed")
  }
});
