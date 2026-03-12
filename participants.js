async function loadParticipants() {
  const tbody = document.getElementById("participantTable");
  
  const { data, error } = await supabaseClient
    .from("registrations")
    .select(`
      event_id,
      users (
        name,
        email
      )
    `)
    .order("id", { ascending: true });

  console.log("participants data:", data);
  console.log("participants error:", error);

  if (error) {
    showToast("Error loading participants: " + error.message, "error");
    tbody.innerHTML = `<tr><td colspan="3" class="text-center text-danger py-4">Failed to load participants.</td></tr>`;
    return;
  }

  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" class="text-center py-4 text-secondary">No participants registered yet.</td></tr>`;
    return;
  }

  let rows = "";

  data.forEach((item) => {
    let userName = item.users?.name ?? "No name";
    let userEmail = item.users?.email ?? "No email";
    
    // Nice avatar based on initial
    rows += `
      <tr>
        <td class="fw-bold text-white d-flex align-items-center gap-3 border-0 py-3">
          <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; box-shadow: 0 2px 10px rgba(79, 70, 229, 0.3);">
            ${userName.charAt(0).toUpperCase()}
          </div>
          ${userName}
        </td>
        <td class="border-0 py-3"><a href="mailto:${userEmail}" style="color: #60a5fa; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='#93c5fd'" onmouseout="this.style.color='#60a5fa'">${userEmail}</a></td>
        <td class="border-0 py-3"><span class="badge px-3 py-2" style="background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 20px; font-weight: 500; letter-spacing: 0.5px;">Event #${item.event_id}</span></td>
      </tr>
    `;
  });

  tbody.innerHTML = rows;
}

loadParticipants();
