const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// const dummyTransactions = [
//   { id: 1, text: 'Flower', amount: -20 },
//   { id: 2, text: 'Salary', amount: 300 },
//   { id: 3, text: 'Book', amount: -10 },
//   { id: 4, text: 'Camera', amount: 150 }
// ];

const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

let transactions =
  localStorage.getItem('transactions') !== null ?
    localStorageTransactions : [];

// Generating random id
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Add transaction
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please enter a text and amount');
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      //amount: amount.value
      amount: +amount.value
    }
    transactions.push(transaction);

    console.log(transaction);
    console.log(transactions);

    // Add transaction to DOM
    addTransactionDOM(transaction);

    // Update values
    updateValues();

    // Update local storage
    updateLocalStorage();

    // Reset the inputboxes
    text.value = '';
    amount.value = '';
  }
}

// Update the balance, income and expense
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);
  console.log('amounts: ' + amounts);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  console.log('total: ' + total);

  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  console.log('income: ' + income);

  const expense = amounts
    .filter(item => item < 0)
    .reduce((acc, item) => (acc += item), 0) * -1
  console.log('expense: ' + expense);

  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;
}

// Add transaction to DOM list
function addTransactionDOM(transaction) {

  const sign = transaction.amount < 0 ? '-' : '+';

  const item = document.createElement('li');

  // Add class based on value
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
  ${transaction.text} <span>${sign}${Math.abs(
    transaction.amount
  )}</span> <button class="delete-btn" onclick="removeTransaction(${transaction.id
    })">x</button>`;

  list.appendChild(item);

}

function removeTransaction(id) {
  console.log('Removing: ' + id);
  transactions = transactions.filter(transaction => transaction.id != id);
  updateLocalStorage();
  Init();
}
// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}
// Init app
function Init() {
  list.innerHTML = '';
  console.log('Init..');
  transactions.forEach(addTransactionDOM);
  updateValues();
}

Init();

form.addEventListener('submit', addTransaction);
