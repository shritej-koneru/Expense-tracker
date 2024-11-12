document
  .getElementById("add-income-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const note = document.getElementById("note").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const date = document.getElementById("date").value;

    const response = await fetch("/add-income", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note, amount, date }),
    });

    if (response.ok) {
      alert("Income added successfully!");
      // Redirect to the main page (index.html)
      window.location.href = "/main/index.html";
    } else {
      alert("Failed to add income");
    }
  });
