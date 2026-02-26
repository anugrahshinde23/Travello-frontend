const user = JSON.parse(sessionStorage.getItem("user"));

const userName = document.getElementById("name");
const email = document.getElementById("email");

console.log("User Object:", user);

if (user) {
  
  userName.innerText = user.name || "No Name Found";
  email.innerText = user.email || "No Email Found";
}

const switchTab = (event, sectionId) => {
  const sections = document.querySelectorAll(".tab-pane");
  sections.forEach((s) => s.classList.add("hidden"));

  document.getElementById(sectionId).classList.remove("hidden");

  const links = document.querySelectorAll(".tab-link");
  links.forEach((l) => {
    l.classList.remove(
      "text-red-500",
      "bg-red-50",
      "border-r-3",
      "border-red-500"
    );
    l.classList.add("text-zinc-500");
  });

  event.currentTarget.classList.add(
    "text-red-500",
    "bg-red-50",
    "border-r-3",
    "border-red-500"
  );
  event.currentTarget.classList.remove("text-zinc-500");

  document.getElementById("headerText").innerText =
    event.currentTarget.innerText;
};

const addCityModal = document.getElementById("addCity");
const addCityBtn = document.getElementById("addCityBtn");
const closeCityBtn = document.getElementById("close-city-modal-btn");
const updateCityModal = document.getElementById("updateCity");
const updateCityForm = document.getElementById("updateCityForm");
const deleteCityModal = document.getElementById("deleteCityModal");

addCityBtn.addEventListener("click", () => {
  addCityModal.showModal();
});

closeCityBtn.addEventListener("click", () => {
  addCityModal.close();
});

addCityModal.addEventListener("click", (e) => {
  if (e.target === addCityModal) {
    addCityModal.close();
  }
});

const myModal = document.getElementById("my-modal");
const openModalBtn = document.getElementById("open-modal");
const closeModalBtn = document.getElementById("close-modal-btn");

openModalBtn.addEventListener("click", () => {
  myModal.showModal();
});

closeModalBtn.addEventListener("click", () => {
  myModal.close();
});

myModal.addEventListener("click", (event) => {
  if (event.target === myModal) {
    myModal.close();
  }
});

let selectedBusId = null;
let selectedCityId = null;

const BaseUrl = "http://127.0.0.1:8000";

const registerBusForm = document.getElementById("registerBusForm");

registerBusForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(registerBusForm);
  const data = Object.fromEntries(formData.entries());

  if (data.total_seats) {
    data.total_seats = parseInt(data.total_seats);
  }

  const token = localStorage.getItem("access_token");

  try {
    const res = await fetch(`${BaseUrl}/bus/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json(); // Move this up

    if (!res.ok) {
      // Handle server-side validation errors (400, 401, 500 etc)
      throw new Error(result.detail || result.message || "Failed to add bus");
    }

    console.log("Success:", result);
    handleGetAllBuses();
    myModal.close();
    showToast("success", result.message || "Bus registered successfully!");

    // Optional: Refresh the list or reset form
    registerBusForm.reset();
  } catch (error) {
    console.error("Request Error:", error);
    // Use 'error.message' which now contains your server detail
    showToast("error", error.message);
  }
});

const bus_content = document.getElementById("bus-content");
const updateBusModal = document.getElementById("updateModal");
const closeUpdateModal = document.getElementById("close-update-modal-btn");
const updateBusForm = document.getElementById("updateBusForm");

const deleteModal = document.getElementById("deleteModal");
const closeDeleteModal = document.getElementById("close-delete-modal-btn");

closeUpdateModal.addEventListener("click", () => {
  updateBusModal.close();
});

closeDeleteModal.addEventListener("click", () => {
  deleteModal.close();
});

const closeCityUpdateBtn = document.getElementById(
  "close-city-update-modal-btn"
);
const closeCityDeleteBtn = document.getElementById(
  "close-delete-city-modal-btn"
);

closeCityUpdateBtn.addEventListener("click", () => {
  updateCityModal.close();
});

closeCityDeleteBtn.addEventListener("click", () => {
  deleteCityModal.close();
});

updateCityModal.addEventListener("click", (e) => {
  if (e.target === updateCityModal) {
    updateCityModal.close();
  }
});

const openCityUpdateModal = (city) => {
  selectedCityId = city?._id;
  updateCityForm.name.value = city.name || "";
  updateCityForm.state.value = city.state || "";
  updateCityForm.country.value = city.country || "";
  updateCityForm.code.value = city.code || "";
  updateCityForm.slug.value = city.slug || "";

  updateCityModal.showModal();
};

const openDeleteCityConfirmModal = (city) => {
  selectedCityId = city?._id;
  deleteCityModal.showModal();
};

const openUpdateModal = (bus) => {
  selectedBusId = bus?._id;

  updateBusForm.name.value = bus.name || "";
  updateBusForm.number.value = bus.number || "";
  updateBusForm.bus_type.value = bus.bus_type || "";
  updateBusForm.total_seats.value = bus.total_seats || "";
  updateBusForm.owner.value = bus.owner || "";

  updateBusModal.showModal();
};

const openDeleteConfirmModal = (bus) => {
  selectedBusId = bus?._id;
  deleteModal.showModal();
};

const handleGetAllBuses = async () => {
  const token = localStorage.getItem("access_token");
  try {
    const res = await fetch(`${BaseUrl}/bus/get-all-bus`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (!res.ok) {
      // Handle server-side validation errors (400, 401, 500 etc)
      throw new Error(
        result.detail || result.message || "Failed to fetch buses"
      );
    }

    console.log(result);
    bus_content.innerHTML = "";

    const tableShell = `
<div class="overflow-x-auto  rounded-lg border border-gray-200 shadow-sm">
  <table class="w-full border-collapse bg-[#f5f5dc] text-left text-sm text-gray-500">
    <thead class="bg-red-100">
      <tr>
        <th class="px-6 py-4 font-bold text-lg text-gray-900">Bus Name</th>
        <th class="px-6 py-4 font-bold text-lg text-gray-900">Type</th>
        <th class="px-6 py-4 font-bold text-lg text-gray-900 ">Bus No.</th>
        <th class="px-6 py-4 font-bold  text-lg text-gray-900 text-center">Seats</th>
        <th class="px-6 py-4 font-bold text-lg text-gray-900">Owner</th>
        <th class="px-6 py-4 font-bold text-lg text-gray-900 text-right">Actions</th>
        <th class="px-6 py-4 font-bold text-lg text-gray-900 text-right">Assign</th>
      </tr>
    </thead>
    <tbody id="bus-table-body" class="divide-y divide-gray-100 border-t border-gray-100">
      <!-- Rows will be injected here -->
    </tbody>
  </table>
</div>
`;

    const capitalFL = (str) => {
      if (typeof str !== "string" || str.length === 0) {
        return ""; // Handle invalid or empty input
      }
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    bus_content.innerHTML = tableShell;
    const tableBody = document.getElementById("bus-table-body");

    result.bus_data.forEach((bus) => {
      const row = `
    <tr class="hover:bg-gray-50 transition-colors">
      <td class="px-6 py-4 font-medium text-gray-900">${capitalFL(
        bus?.name || "N/A"
      )}</td>
      <td class="px-6 py-4"><span class="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">${bus?.bus_type.toUpperCase()}</span></td>
      <td class="px-6 py-4">${bus?.number}</td>
      <td class="px-6 py-4 text-center">${bus?.total_seats}</td>
      <td class="px-6 py-4">${capitalFL(bus?.owner)}</td>
      <td class="px-6 py-4">
        <div class="flex justify-end gap-2">
          <button onclick='openUpdateModal(${JSON.stringify(
            bus
          )})' class="rounded bg-red-500 px-3 py-1.5 text-xs font-medium text-white cursor-pointer hover:bg-red-600">Edit</button>
          <button onclick='openDeleteConfirmModal(${JSON.stringify(
            bus
          )})' class="rounded bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 border cursor-pointer border-red-500 hover:bg-red-100">Delete</button>
        </div>
      </td>
     <td class="px-6 py-4 text-end">
  ${bus.route_id === null || bus.route_id === undefined || bus.route_id === "" 
    ? `<button class="bg-blue-500 hover:bg-blue-400 cursor-pointer px-3 py-1.5 rounded text-white text-xs font-medium" 
               onclick='openAssignRouteModal(${JSON.stringify(bus)})'>
          Assign
       </button>` 
    : `<p class="text-green-600 font-bold text-xs italic">assigned</p>`
  }
</td>
    </tr>
  `;
      tableBody.insertAdjacentHTML("beforeend", row);
    });

    if (result.bus_data.length !== 0) {
      const addButtonRow = `
        <button class="w-full  border border-red-500 rounded-2xl font-bold text-red-500 p-5 cursor-pointer hover:bg-red-50 text-center" onclick="document.getElementById('my-modal').showModal()">
        Add
        </button>
        `;

      bus_content.insertAdjacentHTML("beforeend", addButtonRow);
    } else {
      const addButtonRow = `
        <p class="text-center">You have not added any bus yet. Tap on <span class="text-red-500 font-bold">Add Bus</span> button to get started </p>
        <button class="w-full flex justify-center items-center gap-1 border border-red-500 rounded-2xl font-bold text-red-500 p-5 cursor-pointer hover:bg-red-50 text-center" onclick="document.getElementById('my-modal').showModal()">
         <i class="fa-thin fa-plus fa-lg"></i> <p>Add Bus</p>
        </button>
        `;
      bus_content.insertAdjacentHTML("beforeend", addButtonRow);
    }

    showToast("success", result.message);
    return result
  } catch (error) {
    console.error("Request Error:", error);
    // Use 'error.message' which now contains your server detail
    showToast("error", error.message);
  }
};

const city_content = document.getElementById("city-content");

const handleGetAllCities = async () => {
  const token = localStorage.getItem("access_token");

  try {
    const res = await fetch(`${BaseUrl}/city/get-all-cities`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (res.ok) {
      console.log(result);
      showToast("success", result.message);
    }

    city_content.innerHTML = "";

    const tableShell = `
<div class="overflow-x-auto  rounded-lg border border-gray-200 shadow-sm">
  <table class="w-full border-collapse bg-[#f5f5dc] text-left text-sm text-gray-500">
    <thead class="bg-red-100">
      <tr>
        <th class="px-6 py-4 font-bold text-lg text-gray-900"> Name</th>
        <th class="px-6 py-4 font-bold text-lg text-gray-900">State</th>
        <th class="px-6 py-4 font-bold text-lg text-gray-900 ">Country</th>
        <th class="px-6 py-4 font-bold  text-lg text-gray-900 text-center">Code</th>
        <th class="px-6 py-4 font-bold text-lg text-gray-900">Slug</th>
        <th class="px-6 py-4 font-bold text-lg text-gray-900 text-right">Actions</th>
      </tr>
    </thead>
    <tbody id="city-table-body" class="divide-y divide-gray-100 border-t border-gray-100">
      <!-- Rows will be injected here -->
    </tbody>
  </table>
</div>
`;

    const capitalFL = (str) => {
      if (typeof str !== "string" || str.length === 0) {
        return ""; // Handle invalid or empty input
      }
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    city_content.innerHTML = tableShell;
    const tableBody = document.getElementById("city-table-body");

    result.city_data.forEach((city) => {
      const row = `
    <tr class="hover:bg-gray-50 transition-colors">
      <td class="px-6 py-4 font-medium text-gray-900">${capitalFL(
        city?.name || "N/A"
      )}</td>
      <td class="px-6 py-4">${capitalFL(city?.state)}</td>
      <td class="px-6 py-4">${capitalFL(city?.country)}</td>
      <td class="px-6 py-4 text-center">${city?.code.toUpperCase()}</td>
      <td class="px-6 py-4">${city?.slug}</td>
      <td class="px-6 py-4">
        <div class="flex justify-end gap-2">
          <button onclick='openCityUpdateModal(${JSON.stringify(
            city
          )})' class="rounded bg-red-500 px-3 py-1.5 text-xs font-medium text-white cursor-pointer hover:bg-red-600">Edit</button>
          <button onclick='openDeleteCityConfirmModal(${JSON.stringify(
            city
          )})' class="rounded bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 border cursor-pointer border-red-500 hover:bg-red-100">Delete</button>
        </div>
      </td>
    </tr>
  `;
      tableBody.insertAdjacentHTML("beforeend", row);
    });

    if (result.city_data.length !== 0) {
      const addButtonRow = `
        <button class="w-full mt-5 border border-red-500 rounded-2xl font-bold text-red-500 p-5 cursor-pointer hover:bg-red-50 text-center" onclick="document.getElementById('addCity').showModal()">
        Add City
        </button>
        `;

      city_content.insertAdjacentHTML("beforeend", addButtonRow);
    } else {
      const addButtonRow = `
        <p class="text-center">You have not added any city yet. Tap on <span class="text-red-500 font-bold">Add City</span> button to get started </p>
        <button class="w-full flex justify-center items-center gap-1 border border-red-500 rounded-2xl font-bold text-red-500 p-5 cursor-pointer hover:bg-red-50 text-center" onclick="document.getElementById('addCity').showModal()">
         <i class="fa-thin fa-plus fa-lg"></i> <p>Add City</p>
        </button>
        `;
      city_content.insertAdjacentHTML("beforeend", addButtonRow);
    }

    return result;
  } catch (error) {
    showToast("error", error.message);
  }
};

const addCityForm = document.getElementById("addCityForm");

addCityForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("access_token");
  const formData = new FormData(addCityForm);
  const data = Object.fromEntries(formData.entries());

  try {
    const res = await fetch(`${BaseUrl}/city/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      addCityModal.close();
      handleGetAllCities();
      showToast("success", result.message);
    } else {
      throw new Error(result.detail || "Failed to add City");
    }
  } catch (error) {
    showToast("error", error.message);
  }
});

updateCityForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("access_token");
  const formData = new FormData(updateCityForm);
  const data = Object.fromEntries(formData.entries());

  try {
    const res = await fetch(`${BaseUrl}/city/update/${selectedCityId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      showToast("success", result.message);
      updateCityModal.close();
      handleGetAllCities();
    }
  } catch (error) {
    showToast("error", error.message);
  }
});

const cancleCityDelete = document.getElementById("cancleCityDelete");
const deleteCityBtn = document.getElementById("deleteCityBtn");

cancleCityDelete.addEventListener("click", () => {
  deleteCityModal.close();
});

deleteCityBtn.addEventListener("click", () => {
  handleDeleteCity();
});

const handleDeleteCity = async () => {
  const token = localStorage.getItem("access_token");

  try {
    const res = await fetch(`${BaseUrl}/city/delete/${selectedCityId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (res.ok) {
      console.log(result);
      showToast("success", result.messsage);
      deleteCityModal.close();
      handleGetAllCities();
    }
  } catch (error) {}
};

updateBusForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("access_token");
  const formData = new FormData(updateBusForm);
  const data = Object.fromEntries(formData.entries());
  if (data.total_seats) data.total_seats = parseInt(data.total_seats);

  try {
    const res = await fetch(`${BaseUrl}/bus/update/${selectedBusId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      showToast("success", result.message);
      updateBusModal.close();
      handleGetAllBuses();
    } else {
      throw new Error(result.detail || "Update failed");
    }
  } catch (error) {
    showToast("error", error.message);
  }
});

const cancleDelete = document.getElementById("cancleDelete");

cancleDelete.addEventListener("click", () => {
  deleteModal.close();
});

const deleteBusBtn = document.getElementById("deleteBusBtn");

deleteBusBtn.addEventListener("click", () => {
  handleDeleteBus();
});

const handleDeleteBus = async () => {
  const token = localStorage.getItem("access_token");

  try {
    const res = await fetch(`${BaseUrl}/bus/delete/${selectedBusId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (res.ok) {
      console.log(result);
      deleteModal.close();
      showToast("success", result.message);
      handleGetAllBuses();
    } else {
      throw new Error(result.detail || "Failed to delete");
    }
  } catch (error) {
    showToast("error", error.message);
  }
};

const addRouteModal = document.getElementById("addRouteModal");
const closeRouteModal = document.getElementById("closeRouteModal");
const openUpdateRouteModal = document.getElementById('updateRouteModal')
const closeUpdateRouteModal = document.getElementById('closeUpdateRouteModal')
const deleteRouteModal = document.getElementById('deleteRouteModal')
const closeDeleteRouteModal = document.getElementById('closeDeleteRouteModal')
const cancleDeleteRouteBtn = document.getElementById('cancleDeleteRouteBtn')
const confirmDeleteRouteBtn = document.getElementById('confirmDeleteRouteBtn')

let selectedRouteId = null

const updateRouteForm = document.getElementById('updateRouteForm')

const handleDeleteRoute = async() => {
  const token = localStorage.getItem('access_token')

  try {
    const res = await fetch(`${BaseUrl}/city/route/delete/${selectedRouteId}`, {
      method: "DELETE",
      headers:{
        "Content-Type" : "application/json",
        "Authorization" : `Bearer ${token}`
      }
    })

    const result = await res.json()

    if(res.ok){
      deleteRouteModal.close()
      showToast("success", result.message)
      handleGetAllRoutes()

    }

  } catch (error) {
    showToast("error", error.message)
  }


}

confirmDeleteRouteBtn.addEventListener('click', async() => {
  await handleDeleteRoute()
})

updateRouteForm.addEventListener('submit',async (e) => {
  e.preventDefault()

  const token = localStorage.getItem('access_token')
  const formData = new FormData(updateRouteForm)
  const data = Object.fromEntries(formData.entries())

  if(data.distance && data.duration){
    data.distance = parseFloat(data.distance)
    data.duration = parseFloat(data.duration)
  }

  try {
    const res = await fetch(`${BaseUrl}/city/route/update/${selectedRouteId}`, {
      method: "PATCH",
      headers:{
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${token}`
      },

      body: JSON.stringify(data)
    })

    const result = await res.json()

    if(res.ok){
      showToast("success", result.message)
      openUpdateRouteModal.close()
      handleGetAllRoutes()
    }
  } catch (error) {
    showToast("error", error.message)
  }

})

cancleDeleteRouteBtn.addEventListener('click', () => {
  deleteRouteModal.close()
})

const openDeleteRouteModalFunction = async (route) => {
  selectedRouteId = route?._id
  deleteRouteModal.showModal()
}

closeDeleteRouteModal.addEventListener('click', () => {
  deleteRouteModal.close()
})

const openUpdateRouteModalFunction = async (route) => {
  selectedRouteId = route?._id;

  const cities = await handleGetAllCities();

  const sourceSelect = document.getElementById("updateSourceCityDropdown");
  const destinationSelect = document.getElementById("updateDestinationCityDropdown");

  sourceSelect.innerHTML = '<option value="">Select source city</option>';
  destinationSelect.innerHTML = '<option value="">Select destination city</option>';

  cities.city_data.forEach((city) => {
    sourceSelect.add(new Option(city.name, city._id));
    destinationSelect.add(new Option(city.name, city._id));
  });

  sourceSelect.value = route?.source_city?._id;
  destinationSelect.value = route?.destination_city?._id;

  updateRouteForm.distance.value = route?.distance || "";
  updateRouteForm.duration.value = route?.duration || "";

  openUpdateRouteModal.showModal();
};


closeUpdateRouteModal.addEventListener("click", () => {
  openUpdateRouteModal.close();
});

addRouteModal.addEventListener("click", (e) => {
  if (e.target === addRouteModal) {
    addRouteModal.close();
  }
});
async function getCityDataAndAddToDropDown() {
  const cities = await handleGetAllCities();

  const sourceCity = document.getElementById("sourceCityDropdown");
  const destinationCity = document.getElementById("destinationCityDropdown");

  cities.city_data.forEach((city) => {
    sourceCity.add(new Option(city.name, city._id));
    destinationCity.add(new Option(city.name, city._id));
  });
}

getCityDataAndAddToDropDown();
const route_content = document.getElementById("route-content");

const addRouteForm = document.getElementById("addRouteForm");

route_content.innerHTML = `

<button onclick="addRouteModal.showModal()">Add</button>

`;

addRouteForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("access_token");
  const formData = new FormData(addRouteForm);
  const data = Object.fromEntries(formData.entries());

  if (data.distance && data.duration) {
    data.distance = parseFloat(data.distance);
    data.duration = parseFloat(data.duration);
  }

  try {
    const res = await fetch(`${BaseUrl}/city/route/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      addRouteModal.close();
      showToast("success", result.message);
      handleGetAllRoutes()
    }else{
      addRouteModal.close()
      showToast("error", result.detail)
    }
  } catch (error) {
    showToast("error", error.message);
  }
});
const handleGetAllRoutes = async () => {
  try {
    const res = await fetch(`${BaseUrl}/city/route/get-all-routes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    result = await res.json();

    if (res.ok) {
      console.log(result);
      showToast("success", result.message);
    }

    route_content.innerHTML = "";

    const tableShell = `
  
 <div class="overflow-x-auto  rounded-lg border border-gray-200 shadow-sm">
  <table class="w-full border-collapse bg-[#f5f5dc] text-left text-sm text-gray-500">
    <thead class="bg-red-100">
      <tr>
        <th class="px-6 py-4 font-bold text-lg text-gray-900"> Source</th>
        <th class="px-6 py-4 font-bold text-lg text-gray-900">Destination</th>
        <th class="px-6 py-4 font-bold text-lg text-gray-900 ">Distance</th>
        <th class="px-6 py-4 font-bold  text-lg text-gray-900 text-center">Duration</th>
        <th class="px-6 py-4 font-bold text-lg text-gray-900 text-right">Actions</th>
      </tr>
    </thead>
    <tbody id="route-table-body" class="divide-y divide-gray-100 border-t border-gray-100">
      <!-- Rows will be injected here -->
    </tbody>
  </table>
</div>

  `;

  route_content.innerHTML = tableShell
  const tableBody = document.getElementById('route-table-body')

  result.route_data.forEach((route) => {
   const row = `
    <tr class="hover:bg-gray-50 transition-colors">
      <td class="px-6 py-4 font-medium text-gray-900">${
        route?.source_city?.name
      }</td>
      <td class="px-6 py-4">${route?.destination_city?.name}</td>
      <td class="px-6 py-4">${route?.distance}</td>
      <td class="px-6 py-4 text-center">${route?.duration}</td>
      <td class="px-6 py-4">
        <div class="flex justify-end gap-2">
          <button onclick='openUpdateRouteModalFunction(${JSON.stringify(
            route
          )})' class="rounded bg-red-500 px-3 py-1.5 text-xs font-medium text-white cursor-pointer hover:bg-red-600">Edit</button>
          <button onclick='openDeleteRouteModalFunction(${JSON.stringify(
            route
          )})' class="rounded bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 border cursor-pointer border-red-500 hover:bg-red-100">Delete</button>
        </div>
      </td>
    </tr>
  `;

  tableBody.insertAdjacentHTML("beforeend", row);
  
  })

  if(result.route_data.length !== 0 ){
  const addButtonRow = `
        <button class="w-full mt-5 border border-red-500 rounded-2xl font-bold text-red-500 p-5 cursor-pointer hover:bg-red-50 text-center" onclick="document.getElementById('addRouteModal').showModal()">
        Add Route
        </button>
        `;

      route_content.insertAdjacentHTML("beforeend", addButtonRow);
   }else{
   const addButtonRow = `
        <p class="text-center mt-5">You have not added any Route yet. Tap on <span class="text-red-500 font-bold">Add City</span> button to get started </p>
        <button class="w-full flex mt-5 justify-center items-center gap-1 border border-red-500 rounded-2xl font-bold text-red-500 p-5 cursor-pointer hover:bg-red-50 text-center" onclick="document.getElementById('addRouteModal').showModal()">
         <i class="fa-thin fa-plus fa-lg"></i> <p>Add Route</p>
        </button>
        `;
      route_content.insertAdjacentHTML("beforeend", addButtonRow);
   }

   return result

  } catch (error) {
    console.log(error);

    showToast("error", error.message);
  }
};

const assignRouteModal = document.getElementById('assignRouteModal')
const closeAssignRouteModalBtn = document.getElementById('close-assign-route-modal-btn')

closeAssignRouteModalBtn.addEventListener('click', () => {
  assignRouteModal.close()
})

const openAssignRouteModal = (bus) => {
  selectedBusId = bus?._id
  handleGetAllRoutesAndAddToDropdown()
  assignRouteModal.showModal()
}


const handleGetAllRoutesAndAddToDropdown = async () => {
  // 1. Fetch the routes using your existing helper
  const routes = await handleGetAllRoutes();
  
  // 2. Select the dropdown element
  const dropdown = document.getElementById("sourceAndDestinationCityDropdown");

  // 3. Clear existing options (except the first placeholder)
  dropdown.innerHTML = '<option value="">Select Route</option>';
  

  // 4. Check if routes exist and map through them
  if (routes && routes.route_data.length > 0) {
      routes.route_data.forEach((route) => {
          const option = document.createElement("option");
          
          // Set the ID as the value
          option.value = route._id; 
          
          // Set the Display Text: "Ahmednagar - Pune"
          const sourceName = route.source_city?.name || "Unknown Source";
          const destName = route.destination_city?.name || "Unknown Destination";
          option.textContent = `${sourceName} - ${destName}`;

          // Add to dropdown
          dropdown.appendChild(option);
      });
  }
};

const addRouteToBusForm = document.getElementById('addRouteToBusForm')

addRouteToBusForm.addEventListener('submit', async(e) => {

e.preventDefault()

  const token = localStorage.getItem('access_token')
  const formData = new FormData(addRouteToBusForm)
  const data = Object.fromEntries(formData.entries())

  console.log(data);

  try {
    const res = await fetch(`${BaseUrl}/bus/assign-route/${selectedBusId}`, {
      method: "PATCH",
      headers : {
        "Content-Type" : "application/json",
        "Authorization" : `Bearer ${token}`
      },

      body: JSON.stringify(data)
    })

    const result = await res.json()

    if(res.ok){
      assignRouteModal.close()
      showToast("success", result.message)
      handleGetAllBuses()
    }
  } catch (error) {
    showToast("error", error.message)
  }
  
})

handleGetAllRoutesAndAddToDropdown()


const createTripModal = document.getElementById('createTripModal')
const trip_content = document.getElementById('trip-content')
const closeCreateTripModalBtn = document.getElementById('closeCreateTripModalBtn')

closeCreateTripModalBtn.addEventListener('click', () => {
  createTripModal.close()
})

createTripModal.addEventListener('click', (e) => {
  if(e.target === createTripModal){
    createTripModal.close()
  }
})

const handleGetAllBusesAndAddToDropdownForCreateTrip = async () => {
  const buses = await handleGetAllBuses()

  const selectBusForCreateTrip = document.getElementById('selectBusForCreateTrip')

  selectBusForCreateTrip.innerHTML= `<option value="">Select Bus</option>`

  if(buses && buses.bus_data.length > 0) {
    buses.bus_data.forEach((bus) => {
      const option = document.createElement('option')

      option.value = bus._id

      option.textContent = `${bus.name}`

      selectBusForCreateTrip.appendChild(option)
    })
  }
  
}

createTripForm = document.getElementById('createTripForm')

createTripForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const token = localStorage.getItem('access_token')
  const formData = new FormData(createTripForm)
  const data = Object.fromEntries(formData.entries())

  if(data.bus_id){
    selectedBusId = data.bus_id
  }

  if(data.price){
    data.price = parseFloat(data.price)
  }
  
  
  try {
    const res = await fetch(`${BaseUrl}/trip/create`, {
      method : "POST", 
      headers : {
        "Content-Type" : "application/json",
        "Authorization" : `Bearer ${token}`
      },

      body : JSON.stringify(data)
    })

    const result = await res.json()

    if(res.ok){
      createTripModal.close()
      showToast("success", result.message)
      handleGetAllTrips()
    }else {
      showToast("error", result.detail)
    }
  } catch (error) {
    showToast("error", error.message)
  }
  
} )

const handleGetAllTrips = async () => {

const token = localStorage.getItem('access_token')

  try {
    const res = await fetch(`${BaseUrl}/trip/all-trips`, {
      method : "GET",
      headers : {
        "Content-Type" : "application/json",
        "Authorization" : `Bearer ${token}`
      }
    })

    const result = await res.json()

    if(res.ok){
      console.log(result);
      
      showToast("success", result.message)
    }else{
      showToast("error", result.detail)
    }

    trip_content.innerHTML = ""

    const tableShell = `
  
    <div class="overflow-x-auto  rounded-lg border border-gray-200 shadow-sm">
     <table class="w-full border-collapse bg-[#f5f5dc] text-left text-sm text-gray-500">
       <thead class="bg-red-100">
         <tr>
           <th class="px-6 py-4 font-bold text-lg text-gray-900"> Bus</th>
           <th class="px-6 py-4 font-bold text-lg text-gray-900"> Date</th>
           <th class="px-6 py-4 font-bold text-lg text-gray-900">Arrival</th>
           <th class="px-6 py-4 font-bold text-lg text-gray-900 ">Departure</th>
           <th class="px-6 py-4 font-bold  text-lg text-gray-900 text-center">Price</th>
           <th class="px-6 py-4 font-bold text-lg text-gray-900 text-right">Total Seats</th>
           <th class="px-6 py-4 font-bold text-lg text-gray-900 text-right">Available Seats</th>
           <th class="px-6 py-4 font-bold text-lg text-gray-900 text-right">Action</th>
         </tr>
       </thead>
       <tbody id="trip-table-body" class="divide-y divide-gray-100 border-t border-gray-100">
         <!-- Rows will be injected here -->
       </tbody>
     </table>
   </div>
   
     `;

     trip_content.innerHTML = tableShell

     const tableBody = document.getElementById('trip-table-body')

     result.trip_data.forEach((trip) => {
      const row = `
        <tr class="hover:bg-gray-50 transition-colors">
        <td class="px-6 py-4">${trip?.arrival_time}</td>
      <td class="px-6 py-4 font-medium text-gray-900">${
        new Date(trip?.date).toDateString()
      }</td>
      <td class="px-6 py-4">${trip?.arrival_time}</td>
      <td class="px-6 py-4">${trip?.departure_time}</td>
      <td class="px-6 py-4 text-center">${trip?.price}</td>
      <td class="px-6 py-4 text-center">${trip?.total_seats}</td>
      <td class="px-6 py-4 text-center">${trip?.available_seats}</td>
      <td class="px-6 py-4">
        <div class="flex justify-end gap-2">
          <button onclick='openUpdateTripModal(${JSON.stringify(
            trip
          )})' class="rounded bg-red-500 px-3 py-1.5 text-xs font-medium text-white cursor-pointer hover:bg-red-600">Edit</button>
          <button onclick='openDeleteTripModal(${JSON.stringify(
            trip
          )})' class="rounded bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 border cursor-pointer border-red-500 hover:bg-red-100">Delete</button>
        </div>
      </td>
    </tr>
      `

      tableBody.insertAdjacentHTML("beforeend", row)
     })
   

   
     if(result.trip_data.length !== 0 ){
      const addButtonRow = `
            <button class="w-full mt-5 border border-red-500 rounded-2xl font-bold text-red-500 p-5 cursor-pointer hover:bg-red-50 text-center" onclick="document.getElementById('createTripModal').showModal()">
            Create Trip
            </button>
            `;
    
          trip_content.insertAdjacentHTML("beforeend", addButtonRow);
       }else{
       const addButtonRow = `
            <p class="text-center mt-5">You have not added any Trip yet. Tap on <span class="text-red-500 font-bold">Create Trip</span> button to get started </p>
            <button class="w-full flex mt-5 justify-center items-center gap-1 border border-red-500 rounded-2xl font-bold text-red-500 p-5 cursor-pointer hover:bg-red-50 text-center" onclick="document.getElementById('createTripModal').showModal()">
             <i class="fa-thin fa-plus fa-lg"></i> <p>Create Trip</p>
            </button>
            `;
          trip_content.insertAdjacentHTML("beforeend", addButtonRow);
       }
    

    
  } catch (error) {
    showToast("error", error.message)
  }
}

let selectedTripId = null

const updateTripModal = document.getElementById('updateTripModal')
const closeUpdateTripModal = document.getElementById('closeUpdateTripModal')
const updateTripForm = document.getElementById('updateTripForm')

closeUpdateTripModal.addEventListener('click', () => {
  updateTripModal.close()
})

updateTripModal.addEventListener('click', (e) => {
  if(e.target === updateTripModal){
    updateTripModal.close()
  }
})

const openUpdateTripModal = (trip)  => {
  selectedTripId = trip._id
  updateTripForm.date.value = trip.date?.slice(0, 10) || ""
  updateTripForm.departure_time.value = trip.departure_time || ""
  updateTripForm.arrival_time.value = trip.arrival_time || ""
  updateTripForm.price.value = trip.price || ""

  updateTripModal.showModal()
}

updateTripForm.addEventListener('submit', async (e) => {
  e.preventDefault()

  const token = localStorage.getItem('access_token')
  const formData = new FormData(updateTripForm)
  const data = Object.fromEntries(formData.entries())

  if(!data.date) delete data.date
if(!data.departure_time) delete data.departure_time
if(!data.arrival_time) delete data.arrival_time
if(!data.price) delete data.price

  if(data.price){
    data.price = parseFloat(data.price)
  }

  if (data.departure_time) {
    data.departure_time = data.departure_time + ":00"
  }
  
  if (data.arrival_time) {
    data.arrival_time = data.arrival_time + ":00"
  }

  console.log("Heloo", data);
  
  

  try {
    const res = await fetch(`${BaseUrl}/trip/update/${selectedTripId}`, {
      method : "PATCH",
      headers : {
        "Content-type" : "application/json",
        "Authorization" : `Bearer ${token}`
      }, 
      body : JSON.stringify(data)
    })

    const result = await res.json()

    if(res.ok) {
      updateTripModal.close()
      showToast("success", result.message)
      handleGetAllTrips()
    }else {
      console.log(result);
      
      showToast("error", result.detail)
    }

  } catch (error) {
    console.log(error);
    
    showToast("error", error.response?.data?.message)
  }
})



handleGetAllBusesAndAddToDropdownForCreateTrip()

const deleteTripModal = document.getElementById('deleteTripModal')
const closeDeleteTripModal = document.getElementById('closeDeleteTripModal')
const cancelDeleteTripBtn = document.getElementById('cancelDeleteTripBtn')
const confirmDeleteTripBtn = document.getElementById('confirmDeleteTripBtn')

const openDeleteTripModal = (trip) => {
  selectedTripId = trip._id
  deleteTripModal.showModal()
}

closeDeleteTripModal.addEventListener('click', () => {
  deleteTripModal.close()
})

deleteTripModal.addEventListener('click', (e) => {
  if(e.target === deleteTripModal){
    deleteTripModal.close()
  }
})

cancelDeleteTripBtn.addEventListener('click', () => {
  deleteTripModal.close()
})

const handleDeleteTrip = async () => {
  const token = localStorage.getItem('access_token')
  
  try {
    const res = await fetch(`${BaseUrl}/trip/delete/${selectedTripId}`, {
      method : "DELETE", 
      headers : {
        "Content-Type" : "application/json",
        "Authorization" : `Bearer ${token}`
      }
    })

    const result = await res.json()

    if(res.ok){
      deleteTripModal.close()
      showToast("success", result.message)
      handleGetAllTrips()
    }else{
      showToast("error", result.detail)
    }
  } catch (error) {
    showToast("error", error.message)
  }
}

confirmDeleteTripBtn.addEventListener('click', () => {
  handleDeleteTrip()
})

handleGetAllBuses();
handleGetAllCities();
handleGetAllRoutes();
handleGetAllTrips()
