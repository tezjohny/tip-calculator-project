// get input elements
const billInput = document.getElementById("billInput");
const peopleInput = document.getElementById("peopleInput");
const tipInputButtons = document.querySelectorAll(".select-tip-button");
const customTipInput = document.getElementById("custom-input");
const resetBtn = document.querySelector(".reset-btn");
const errorMsg = document.querySelector(".error");

// get results elements
const totalAmount = document.querySelector(".total-amount");
const totalAmountPerPerson = document.querySelector(".total-amount-person");

// function to update results
function updateResults(tipAmount, totalAmountValue) {
  totalAmount.textContent = `$${tipAmount.toFixed(2)}`;
  totalAmountPerPerson.textContent = `$${totalAmountValue.toFixed(2)}`;
}

// function to show or hide error message
function handleError() {
  const people = parseFloat(peopleInput.value);
  if (!people || people <= 0) {
    errorMsg.classList.add("active");
    peopleInput.style.border = "2px solid rgb(185, 122, 39)";
    return true; // means there is an error
  } else {
    errorMsg.classList.remove("active");
    peopleInput.style.border = "none";
    return false;
  }
}

// function to calculate based on active tip button
function calculateActiveButtonTip() {
  if (handleError()) return; // stop if error exists

  const activeButton = document.querySelector(".select-tip-button.active");
  if (!activeButton) return;

  const tipPercentage = parseFloat(activeButton.innerText.replace("%", "")) / 100;
  const amount = parseFloat(billInput.value);
  const people = parseFloat(peopleInput.value);

  if (!amount || !people) {
    updateResults(0, 0);
    return;
  }

  const tipAmount = (amount * tipPercentage) / people;
  const totalAmountValue = amount / people + tipAmount;
  updateResults(tipAmount, totalAmountValue);
}

// handle preset tip buttons
tipInputButtons.forEach((inputButton) => {
  inputButton.addEventListener("click", (e) => {
    e.preventDefault();

    // toggle active state — if already active, unselect and reset
    if (inputButton.classList.contains("active")) {
      inputButton.classList.remove("active");
      updateResults(0, 0);
      return;
    }

    // activate this button and clear custom input
    tipInputButtons.forEach((btn) => btn.classList.remove("active"));
    customTipInput.value = "";
    inputButton.classList.add("active");

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

  const customTip = (amount * customTipPercentage) / people;
  const totalAmountValue = amount / people + customTip;
  updateResults(customTip, totalAmountValue);
}

// reset all fields and results
resetBtn.addEventListener("click", () => {
  totalAmount.textContent = "$0.00";
  totalAmountPerPerson.textContent = "$0.00";
  billInput.value = "";
  peopleInput.value = "";
  customTipInput.value = "";
  tipInputButtons.forEach((btn) => btn.classList.remove("active"));
  errorMsg.classList.remove("active");
  peopleInput.style.border = "none";
});
