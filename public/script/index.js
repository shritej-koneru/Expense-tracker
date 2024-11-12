// After the user submits the income form
document
  .querySelector("#add-income-form")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    const note = document.getElementById("note").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const date = document.getElementById("date").value;

    // Send the income data to the backend
    fetch("/add-income", {
      method: "POST",
      body: JSON.stringify({ note, amount, date }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // After income is added, fetch the updated balance
          fetch("/balance")
            .then((response) => response.json())
            .then((updatedData) => {
              document.getElementById("total-income").textContent =
                `Total Income: $${updatedData.totalIncome.toFixed(2)}`;
              document.getElementById("total-expenses").textContent =
                `Total Expenses: $${updatedData.totalExpense.toFixed(2)}`;
              document.getElementById("current-balance").textContent =
                `Current Balance: $${updatedData.balance.toFixed(2)}`;
            })
            .catch((error) =>
              console.error("Error fetching balance data:", error),
            );
        }
      })
      .catch((error) => console.error("Error adding income:", error));
  });
