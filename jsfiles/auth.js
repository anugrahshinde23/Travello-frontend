async function checkAuth(requiredRole = null) {
    const token = localStorage.getItem("access_token");
  
    if (!token) {
      redirectLogin();
      return null;
    }
  
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/profile", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
  
      if (!res.ok) {
        logout();
        return null;
      }
  
      const data = await res.json();
  
      if (requiredRole && data.user.role !== requiredRole) {
        redirectLogin();
        return null;
      }
  
      return data.user;
  
    } catch {
      redirectLogin();
      return null;
    }
  }
  
  function logout(){
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "login.html";
  }
  
  function redirectLogin(){
    window.location.href = "login.html";
  }
  
