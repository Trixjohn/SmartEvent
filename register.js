async function registerUser() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const eventId = document.getElementById("event_id").value;
  const btn = document.getElementById("registerBtn");

  if (!name || !email || !eventId) {
    showToast("Please fill in all fields.", "error");
    return;
  }

  const originalText = btn.innerText;
  btn.innerText = "Registering...";
  btn.disabled = true;

  const { data: userData, error: userError } = await supabaseClient
    .from("users")
    .insert([
      {
        name: name,
        email: email
      }
    ])
    .select();

  console.log("User insert:", userData);
  console.log("User error:", userError);

  if (userError) {
    showToast("User error: " + userError.message, "error");
    btn.innerText = originalText;
    btn.disabled = false;
    return;
  }

  const userId = userData[0].id;

  const { data: registrationData, error: registrationError } = await supabaseClient
    .from("registrations")
    .insert([
      {
        user_id: userId,
        event_id: Number(eventId)
      }
    ])
    .select();

  btn.innerText = originalText;
  btn.disabled = false;

  console.log("Registration insert:", registrationData);
  console.log("Registration error:", registrationError);

  if (registrationError) {
    showToast("Registration error: " + registrationError.message, "error");
    return;
  }

  showToast("Participant registered successfully!", "success");

  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("event_id").value = "";
}