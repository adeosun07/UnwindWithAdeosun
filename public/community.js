document.addEventListener("DOMContentLoaded", () => {
    let currentIndex = 0;
    let currentCategory = "motivation";
    let shoutouts = [];

    const loadShoutouts = async (category) => {
        const res = await fetch(`/api/community/${category}`);
        shoutouts = await res.json();
        currentIndex = 0;
        renderCard();
    };

    const renderCard = () => {
        const msgEl = document.getElementById("shoutout-message");
        msgEl.textContent = shoutouts.length > 0
            ? shoutouts[currentIndex].message
            : "No messages yet. Be the first!";
    };

    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelector(".tab-btn.active").classList.remove("active");
            btn.classList.add("active");
            currentCategory = btn.dataset.category;
            document.getElementById("category").value = currentCategory;
            
            const placeholders = {
                motivation: "Write something inspiring...",
                humble: "Write something to humble another person...",
                vent: "Don't let it kill you. Let it all out..."
            };
            const buttonTexts = {
                motivation: "Post Motivation",
                humble: "Humble them!!",
                vent: "Vent out"
            };
            document.getElementById("message").placeholder = placeholders[currentCategory];
            document.getElementById("submit-btn").textContent = buttonTexts[currentCategory];

            loadShoutouts(currentCategory);
        });
    });

    document.querySelector(".prev").addEventListener("click", () => {
        if (shoutouts.length > 0) {
            currentIndex = (currentIndex - 1 + shoutouts.length) % shoutouts.length;
            renderCard();
        }
    });

    document.querySelector(".next").addEventListener("click", () => {
        if (shoutouts.length > 0) {
            currentIndex = (currentIndex + 1) % shoutouts.length;
            renderCard();
        }
    });

    document.getElementById("shoutout-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const message = document.getElementById("message").value.trim();
        const category = document.getElementById("category").value;

        if (!message) return alert("Please write something before posting.");

        const res = await fetch("/api/community", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ category, message })
        });

        const data = await res.json();
        if (data.success) {
            document.getElementById("message").value = "";
            loadShoutouts(currentCategory);
        } else {
            alert(data.error || "Failed to post message.");
        }
    });

    // Load default category
    loadShoutouts(currentCategory);
});