// analytics.js – Display spending chart

document.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById("spendingChart").getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Spending (₹)",
          data: [1200, 1500, 1000, 1800, 1400, 2000],
          backgroundColor: "#FF7F50",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
    },
  });
});
