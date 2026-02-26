const registerOrProfile = document.getElementById('registerOrProfile')

const token = localStorage.getItem('access_token')
const role = localStorage.getItem('role')



if(token){
    if(role === "admin"){
        registerOrProfile.innerHTML = `
        <a href='adminDashboard.html'>
        <i class="fa-solid fa-circle-user fa-lg"></i>
        </a>
        `
    }else if(role === "user"){
        registerOrProfile.innerHTML = `
        <a href='userProfile.html'>
        <i class="fa-solid fa-circle-user fa-lg"></i>
        </a>
        `
    }
}else {
    registerOrProfile.innerHTML = `
    <button class="text-sm bg-white text-red-500 font-bold rounded-2xl px-3 py-1 hover:bg-white/70 cursor-pointer" onclick="window.location.href='login.html'">Register yourself</button>
    `
}


// --- CONSTANTS ---
const BaseUrl = "http://127.0.0.1:8000";
let allCities = [];

// --- 1. FETCH CITIES ---
const handleGetAllCities = async () => {
    try {
        const res = await fetch(`${BaseUrl}/city/get-all-cities`);
        const result = await res.json();
        if (res.ok) {
            allCities = result.city_data;
            return result;
        }
        return null;
    } catch (error) {
        console.error("Fetch Error:", error);
        return null;
    }
};

// --- 2. SETUP CUSTOM DROPDOWN LOGIC ---
const setupDropdown = (inputId, dropdownId, hiddenId) => {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);
    const hiddenInput = document.getElementById(hiddenId);

    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        dropdown.innerHTML = "";

        if (query.length > 0) {
            const filtered = allCities.filter(c => c.name.toLowerCase().includes(query));
            
            if (filtered.length > 0) {
                dropdown.classList.remove('hidden');
                filtered.forEach(city => {
                    const item = document.createElement('div');
                    item.className = "p-4 hover:bg-red-50 cursor-pointer flex items-center gap-3 border-b border-zinc-50 last:border-0 transition-colors";
                    item.innerHTML = `<i class="fa-solid fa-location-dot text-red-500"></i> 
                                     <div>
                                        <p class="font-bold text-zinc-800">${city.name}</p>
                                        <p class="text-xs text-zinc-400">${city.state || ''}, India</p>
                                     </div>`;
                    
                    item.onclick = () => {
                        input.value = city.name;
                        hiddenInput.value = city._id; // Backend ke liye ID set ki
                        dropdown.classList.add('hidden');
                    };
                    dropdown.appendChild(item);
                });
            } else {
                dropdown.classList.add('hidden');
            }
        } else {
            dropdown.classList.add('hidden');
            hiddenInput.value = ""; // Clear ID if input is empty
        }
    });
};

// --- 3. SUBMIT SEARCH ---
document.getElementById('searchTripForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fromId = document.getElementById('fromCityId').value;
    const toId = document.getElementById('toCityId').value;
    const date = e.target.date.value;

    if(!fromId || !toId) {
        return Swal.fire("Error", "Please select cities from the dropdown list", "error");
    }

    const payload = { from_city_id: fromId, to_city_id: toId, date: date };
    console.log("Searching for trips:", payload);
    
    try {
        const res = await fetch(`${BaseUrl}/trip/get-all-trips?from_city_id=${payload.from_city_id}&to_city_id=${payload.to_city_id}&date=${payload.date}`, {
            method : "GET",
            headers:{
                "Content-type" : "application/json",

            }

        })

        const result = await res.json()

        if(res.ok){
            console.log(result);
            
            showToast("success", result.message)
        }else {
            showToast("error", result.detail)
        }

        const showAvailableBuses = document.getElementById('showAvailableBuses')

        showAvailableBuses.innerHTML = `
        
        ${result.trip_data.length > 0 ? `
            
            ${result.trip_data.map(trip => `
    <div  class="shadow-2xl mt-5 border border-red-500 rounded-2xl bg-white p-10">
        <p>${trip.bus_details.name}</p>
        <p>${trip.bus_details.number}</p>
        <p>${trip.bus_details.bus_type}</p>
        <p>${trip._id}</p>
        <button onclick="handleIfUserIsLoginOrNot('${trip._id}')" class="bg-red-500 px-5 py-3 rounded-2xl font-bold cursor-pointer text-white ">Book Seats</button>
    </div>
`).join('')}
            
            ` : `<p class="text-zinc-400 text-center w-full font-bold text-2xl">No bus found</p>`}

        `

    } catch (error) {
        showToast("error", error.message)
    }
});

// --- INITIALIZE ---
const init = async () => {
    await handleGetAllCities();
    setupDropdown('fromInput', 'fromDropdown', 'fromCityId');
    setupDropdown('toInput', 'toDropdown', 'toCityId');
};

const handleIfUserIsLoginOrNot = (tripId) => { // tripId parameter add kiya
    if(token){
        if(role === 'user'){
            // URL mein tripId bhej rahe hain
            window.location.href = `seat.html?tripId=${tripId}`; 
        } else if(role === 'admin'){
            alert('Not allowed');
        }
    } else {
        window.location.href = 'login.html';
    }
}

init();

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
        document.getElementById('fromDropdown').classList.add('hidden');
        document.getElementById('toDropdown').classList.add('hidden');
    }
});


