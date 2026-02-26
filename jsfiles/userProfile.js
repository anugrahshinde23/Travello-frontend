const user = JSON.parse(sessionStorage.getItem("user"));

const username = document.getElementById('username')
const useremail = document.getElementById('useremail')

username.innerText = user.name
useremail.innerText = user.email

