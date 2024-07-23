// json-server --watch db.json --port 5000

document.addEventListener("DOMContentLoaded", () => {
  const customerFilterInput = document.getElementById("customerFilter");
  const transactionFilterInput = document.getElementById("transactionFilter");
  const customerTableBody = document.getElementById("customerTableBody");
  const transactionChartElement = document.getElementById("transactionChart");
  const transactionChartCtx = document.getElementById("transactionChart").getContext("2d");
  const chartType = document.getElementById("chartType");

  let customers = [];
  let transactions = [];
  let mergedData = [];
  let transactionChart;
  let customerFiltered;

  let itemCustomer_id;

  // Get Data From API
  async function fetchData() {
    try {
      const customersResponse = await fetch("http://localhost:5000/customers");
      const transactionsResponse = await fetch(
        "http://localhost:5000/transactions"
      );
      customers = await customersResponse.json();
      transactions = await transactionsResponse.json();
      mergeData();
      displayCustomers(mergedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Merge Data
  function mergeData() {
    mergedData = transactions.map((transaction) => {
      const customer = customers.find(
        (cust) => cust.id == transaction.customer_id
      );
      return {
        ...transaction,
        customerName: customer ? customer.name : "Unknown",
      };
    });
  }

  // Display Customers
  function displayCustomers(data) {
    console.log(data);
    customerTableBody.innerHTML = "";
    data.forEach((item) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${item.customerName}</td>
        <td>${item.amount}</td>
        <td>${item.date}</td>
      `;

      row.addEventListener("click", () => {
        itemCustomer_id = item.customer_id;
        displayChart(item.customer_id);
        transactionChartElement.parentElement.classList.remove("d-none");
        transactionChartElement.parentElement.previousElementSibling.classList.add("d-none");
        // let secOff = $("#transactionChart").offset().top;
        // $("html").animate({ scrollTop: secOff }, 1000);
      });

      customerTableBody.appendChild(row);
    });
  }

  customerFilterInput.addEventListener("input", () => {
    const filterValue = customerFilterInput.value.toLowerCase();
    customerFiltered = mergedData.filter((item) =>
      item.customerName.toLowerCase().includes(filterValue)
    );
    displayCustomers(customerFiltered);
  });

  transactionFilterInput.addEventListener("input", () => {
    const filterValue = transactionFilterInput.value;
    const filteredData = customerFiltered.filter(
      (item) => item.amount == filterValue
    );
    displayCustomers(filteredData);
  });

  // Chart JS
  function displayChart(customerId) {
    const customerTransactions = transactions.filter(
      (transaction) => transaction.customer_id === customerId
    );
    const transactionData = customerTransactions.reduce((acc, transaction) => {
      acc[transaction.date] = (acc[transaction.date] || 0) + transaction.amount;
      return acc;
    }, {});

    const labels = Object.keys(transactionData);
    const data = Object.values(transactionData);

    if (transactionChart) {
      transactionChart.destroy();
    }

    transactionChart = new Chart(transactionChartCtx, {
      type: `${chartType.value}`,
      data: {
        labels: labels,
        datasets: [
          {
            label: "Total Transaction Amount per Day",
            data: data,
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(255, 205, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(201, 203, 207, 1)'
            ],
            borderWidth: 2,
            fill: false,
          },
        ],
      },
    });
  }

  fetchData();

  chartType.addEventListener("input", function() {
    displayChart(itemCustomer_id)
  })
});


// =============================================================================
// =============================================================================
// =============================================================================
// =============================================================================
// =============================================================================
particlesJS.load("particles-js", "../particles.json", function () {
  console.log("callback - particles.js config loaded");
});


let color = document.querySelector(".color");
let icon = document.querySelector(".box-color i");


color.children[0].classList.add("bg-primary");
color.children[1].classList.add("bg-success");
color.children[2].classList.add("bg-danger");
color.children[3].classList.add("bg-warning");
color.children[4].classList.add("bg-info");
color.children[5].classList.add("bg-black");



icon.addEventListener("click", function() {
  $(icon).prev().animate({width: "toggle", paddingInline: "toggle"}, 1000)
})


$(".color span").on("click", function(e) {
  let colorValue = e.target.classList[0];
  let x = document.querySelector(".main").classList.length;
  let colorClass = document.querySelector(".main").classList[x-1];
  $(".main").removeClass(colorClass)
  $(".main").addClass(colorValue)
  $(icon).prev().animate({width: "toggle", paddingInline: "toggle"}, 1000)
})
