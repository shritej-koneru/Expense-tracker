document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/analytics-data");
    if (!response.ok) throw new Error("Failed to fetch analytics data");

    const data = await response.json();

    const incomeData = data.filter((item) => item.type === "income");
    const expenseData = data.filter((item) => item.type === "expense");

    // Example: Generate a pie chart for expense categories
    const categories = {};
    expenseData.forEach((item) => {
      categories[item.category] =
        (categories[item.category] || 0) + item.amount;
    });

    const categoryLabels = Object.keys(categories);
    const categoryData = Object.values(categories);

    const ctx = document
      .getElementById("expenseCategoryChart")
      .getContext("2d");
    new Chart(ctx, {
      type: "pie",
      data: {
        labels: categoryLabels,
        datasets: [
          {
            data: categoryData,
            backgroundColor: ["#ff6384", "#36a2eb", "#ffce56"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
        },
      },
    });

    // Example: Generate a line chart for income and expense over time
    const lineCtx = document
      .getElementById("incomeExpenseLineChart")
      .getContext("2d");
    new Chart(lineCtx, {
      type: "line",
      data: {
        labels: data.map((d) => d.date),
        datasets: [
          {
            label: "Income",
            data: incomeData.map((d) => d.amount),
            borderColor: "green",
          },
          {
            label: "Expense",
            data: expenseData.map((d) => d.amount),
            borderColor: "red",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
        },
      },
    });
  } catch (error) {
    console.error(error);
    alert("Failed to load analytics");
  }
});
