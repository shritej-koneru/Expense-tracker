document
  .getElementById("add-expense-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const note = document.getElementById("note").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    const response = await fetch("/add-expense", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note, amount, category, date }),
    });

    if (response.ok) {
      alert("Expense added successfully!");
      window.location.href = "/main/index.html";
    } else {
      alert("Failed to add expense");
    }
  });
