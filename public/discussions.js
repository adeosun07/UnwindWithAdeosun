document.getElementById("start-discussion-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = e.target.title.value.trim();
  const message = e.target.message.value.trim();

  if (!title || !message) return;

  try {
    const res = await fetch("/discussions/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, message })
    });

    const data = await res.json();

    if (data.success) {
      location.reload();
    } else {
      alert(data.error || "Error starting discussion");
    }
  } catch (err) {
    console.error(err);
  }
});

document.querySelectorAll(".reply-form").forEach(form => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const discussion_id = form.getAttribute("data-id");
    const message = form.querySelector("textarea").value.trim();

    if (!message) return;

    try {
      const res = await fetch("/discussions/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discussion_id, message })
      });

      const data = await res.json();

      if (data.success) {
        const messagesDiv = form.parentElement.querySelector(".messages");
        const p = document.createElement("p");
        p.textContent = message;
        messagesDiv.appendChild(p);
        form.querySelector("textarea").value = "";
      } else {
        alert(data.error || "Error adding reply");
      }
    } catch (err) {
      console.error(err);
    }
  });
});
