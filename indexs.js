// get input elements
const billInput = document.getElementById("billInput");
const peopleInput = document.getElementById("peopleInput");
const tipInputButtons = document.querySelectorAll(".select-tip-button");
const customTipInput = document.getElementById("custom-input");
const resetBtn = document.querySelector(".reset-btn");
const errorMsg = document.querySelector(".error");

// get results elements (fixed class names to match HTML)
const tipAmount = document.querySelector(".tip-amount");
const totalPerPersonAmount = document.querySelector(".total-amount-person");

// function to update results
function updateResults(tipValue, totalValue) {
  tipAmount.textContent = `$${tipValue.toFixed(2)}`;
  totalPerPersonAmount.textContent = `$${totalValue.toFixed(2)}`;
}

// function to show or hide error message
function handleError() {
  const people = parseFloat(peopleInput.value);
  if (!people || people <= 0) {
    errorMsg.classList.add("active");
    peopleInput.style.border = "2px solid rgb(185, 122, 39)";
    return true;
  } else {
    errorMsg.classList.remove("active");
    peopleInput.style.border = "none";
    return false;
  }
}

// function to calculate based on active tip button
function calculateActiveButtonTip() {
  if (handleError()) return;

  const activeButton = document.querySelector(".select-tip-button.active");
  if (!activeButton) return;

  const tipPercentage = parseFloat(activeButton.innerText.replace("%", "")) / 100;
  const amount = parseFloat(billInput.value);
  const people = parseFloat(peopleInput.value);

  if (!amount || !people) {
    updateResults(0, 0);
    return;
  }

  const tipValue = (amount * tipPercentage) / people;
  const totalValue = amount / people + tipValue;
  updateResults(tipValue, totalValue);
}

// handle preset tip buttons
tipInputButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();

    // toggle active state
    if (button.classList.contains("active")) {
      button.classList.remove("active");
      updateResults(0, 0);
      return;
    }

    tipInputButtons.forEach((btn) => btn.classList.remove("active"));
    customTipInput.value = "";
    button.classList.add("active");

    calculateActiveButtonTip();
  });
});

// handle custom tip input
customTipInput.addEventListener("input", () => {
  tipInputButtons.forEach((btn) => btn.classList.remove("active"));
  calculateCustomTip();
});

customTipInput.addEventListener("focus", () => {
  tipInputButtons.forEach((btn) => btn.classList.remove("active"));
});

// recalculate when bill or people values change
[billInput, peopleInput].forEach((input) => {
  input.addEventListener("input", () => {
    if (handleError()) {
      updateResults(0, 0);
      return;
    }

    const activeButton = document.querySelector(".select-tip-button.active");
    if (activeButton) {
      calculateActiveButtonTip();
    } else {
      calculateCustomTip();
    }
  });
});

// function to calculate custom tip
function calculateCustomTip() {
  if (handleError()) return;

  const amount = parseFloat(billInput.value);
  const people = parseFloat(peopleInput.value);
  const customTipPercentage = parseFloat(customTipInput.value) / 100;

  if (!amount || !people || !customTipPercentage) {
    updateResults(0, 0);
    return;
  }

  const tipValue = (amount * customTipPercentage) / people;
  const totalValue = amount / people + tipValue;
  updateResults(tipValue, totalValue);
}

// reset all fields and results
resetBtn.addEventListener("click", () => {
  billInput.value = "";
  peopleInput.value = "";
  customTipInput.value = "";
  tipInputButtons.forEach((btn) => btn.classList.remove("active"));
  errorMsg.classList.remove("active");
  peopleInput.style.border = "none";
  updateResults(0, 0); 
});
