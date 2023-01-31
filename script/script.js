"use strict";

// Data
const account1 = {
    owner: "Aashish Dhiman",
    movements: [2000, 45000, -4000, 3000, -650, -1300, 70000, 1300],
    interestRate: 1.2,
    pin: 1111,
};

const account2 = {
    owner: "Piyush Dhiman",
    movements: [5000, 34000, -1500, -790, -32100, -10000, 85000, -300],
    interestRate: 1.5,
    pin: 2222,
};

const account3 = {
    owner: "Raju Rastogi",
    movements: [20000, -2000, 340, -3000, -200, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: "Ujjawal Saini",
    movements: [4300, 10000, 700, -500, 9000],
    interestRate: 1,
    pin: 4444,
};

//array of accounts objects-->
const accounts = [account1, account2, account3, account4];

// Elements-->

const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

//variables-->
let currentAccount;
let interest;

//event listeners-->

btnLogin.addEventListener("click", function (e) {
    e.preventDefault();

    currentAccount = accounts.find(
        (account) => account.username === inputLoginUsername.value
    );
    if (!currentAccount) {
        alert("Wrong Username");
        inputLoginUsername.value = "";
        inputLoginPin.value = "";
    }
    // console.log(currentAccount);
    if (currentAccount?.pin === Number(inputLoginPin.value)) {
        containerApp.style.visibility = "visible";
        labelWelcome.textContent = `Welcome back, ${
            currentAccount.owner.split(" ")[0]
        }`;
        inputLoginUsername.value = "";
        inputLoginPin.value = "";

        //display transactions
        displayMovements(currentAccount.movements);
        //display summary
        displaySummary(currentAccount);
        //display balance
        displayBalance(currentAccount);
    }
    //if pin is wrong
    else {
        alert("Wrong PIN");
        inputLoginPin.value = "";
    }
});

//functions-->

// function to add transaction history
const displayMovements = function (movements) {
    containerMovements.innerHTML = " ";

    movements.forEach(function (mov, i) {
        const type = mov > 0 ? "deposit" : "withdrawal";

        //html template to be added
        const html = `
        <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
            i + 1
        } ${type}</div>
        <div class="movements__date">0 days ago</div>
        <div class="movements__value">${mov} &#8377;</div>
        </div>`;
        containerMovements.insertAdjacentHTML("afterbegin", html);
    });
};

//function to create username for accounts as initials of the name-->
//for each user we create a new property username
//we split the owner name around ' ' then map function returns new array of first word of name
//last we join the new array returned by map using join function
const username = function (account) {
    account.forEach(function (user) {
        user.username = user.owner
            .toLowerCase()
            .split(" ")
            .map((name) => name[0])
            .join("");
    });
};
username(accounts);
// console.log(accounts);

//aliter to compute username
// const username = function (account) {
//     account.forEach(function (user) {
//         user.username = user.owner
//             .toLowerCase()
//             .split(" ")
//             .map(function (name) {
//                 return name[0];
//             })
//             .join("");
//     });
// };

//function to display total balance using reduce() method-->
const displayBalance = function (account) {
    let balance = account.movements.reduce(function (acc, mov) {
        return acc + mov;
    }, 0);
    //aliter using arrow function
    // const balance = movements.reduce((acc, mov) => acc + mov, 0);

    // console.log(interest);
    //to add interest in total balance
    balance += interest;
    // console.log(balance);
    labelBalance.textContent = `${balance} ₹`;
};

//function to display balance summary-->
const displaySummary = function (account) {
    const credit = account.movements
        .filter((mov) => mov > 0)
        .reduce((acc, mov) => acc + mov, 0);
    // console.log(credit);
    labelSumIn.textContent = `${credit} ₹`;

    const debit = account.movements
        .filter((mov) => mov < 0)
        .reduce((acc, mov) => acc + mov, 0);
    // console.log(debit);
    labelSumOut.textContent = `${Math.abs(debit)} ₹`;

    interest = account.movements
        .filter((mov) => mov > 0)
        .map((deposit) => (deposit * account.interestRate) / 100)
        .reduce((acc, int) => acc + int, 0);
    labelSumInterest.textContent = `${interest} ₹`;
};
