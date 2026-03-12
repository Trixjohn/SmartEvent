async function addEvent() {
  const name = document.getElementById("name").value.trim();
  const date = document.getElementById("date").value;
  const location = document.getElementById("location").value.trim();
  const description = document.getElementById("description").value.trim();
  const btn = document.getElementById("addEventBtn");

  if (!name || !date || !location || !description) {
    showToast("Please fill in all fields.", "error");
    return;
  }

  // Loading state
  const originalText = btn.innerText;
  btn.innerText = "Adding Event...";
  btn.disabled = true;

  const { data, error } = await supabaseClient
    .from("events")
    .insert([
      {
        event_name: name,
        event_date: date,
        location: location,
        description: description
      }
    ])
    .select();

  btn.innerText = originalText;
  btn.disabled = false;

  console.log("insert data:", data);
  console.log("insert error:", error);

  if (error) {
    showToast(error.message, "error");
    return;
  }

  showToast("Event added successfully!", "success");

  document.getElementById("name").value = "";
  document.getElementById("date").value = "";
  document.getElementById("location").value = "";
  document.getElementById("description").value = "";

  loadEvents();
}

async function loadEvents() {
  const tbody = document.getElementById("eventTable");
  
  const { data, error } = await supabaseClient
    .from("events")
    .select("*")
    .order("id", { ascending: true });

  console.log("load data:", data);
  console.log("load error:", error);

  if (error) {
    showToast("Failed to load events: " + error.message, "error");
    tbody.innerHTML = `<tr><td colspan="4" class="text-center text-danger py-4">Failed to load events.</td></tr>`;
    return;
  }

  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-secondary">No events found. Create one above!</td></tr>`;
    return;
  }

  let rows = "";

  data.forEach((event) => {
    rows += `
      <tr>
        <td><span class="badge" style="background: rgba(255,255,255,0.1); color: #cbd5e1;">#${event.id}</span></td>
        <td class="fw-bold text-white">${event.event_name}</td>
        <td style="color: #e2e8f0;">${event.event_date}</td>
        <td><span style="color: #9ca3af;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="me-1"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>${event.location}</span></td>
      </tr>
    `;
  });

  tbody.innerHTML = rows;
}

loadEvents();