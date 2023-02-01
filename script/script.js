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
    movements: [4300, 10000, 700, -500, 9000, 10000, -7000],
    interestRate: 1.1,
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
const labelSumInterestRate = document.querySelector(
    ".summary__value--interest--rate"
);
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");
const containerInfo = document.querySelector(".section-info");

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
let sorted = false;

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
    else {
        if (currentAccount.pin === Number(inputLoginPin.value)) {
            containerApp.style.display = "grid";
            containerInfo.style.display = "none";
            labelWelcome.textContent = `Welcome back, ${
                currentAccount.owner.split(" ")[0]
            }`;
            inputLoginUsername.value = "";
            inputLoginPin.value = "";

            updateUI(currentAccount);
        }
        //if pin is wrong
        else {
            alert("Wrong PIN");
            inputLoginPin.value = "";
        }
    }
});

btnTransfer.addEventListener("click", function (e) {
    e.preventDefault();

    const amount = Number(inputTransferAmount.value);
    const receiverAccount = accounts.find(
        (acc) => acc.username === inputTransferTo.value
    );

    if (!receiverAccount) alert("User does not exist");
    if (amount > currentAccount.balance) alert("Insufficient Funds!");

    if (
        amount > 0 &&
        amount <= currentAccount.balance &&
        receiverAccount?.username !== currentAccount.username
    ) {
        currentAccount.movements.push(-amount);
        receiverAccount.movements.push(amount);

        updateUI(currentAccount);
        setTimeout(() => alert("Transfer Successful!"), 500);
    }
    //clear the elements
    inputTransferAmount.value = inputTransferTo.value = "";
});

btnLoan.addEventListener("click", function (e) {
    e.preventDefault();
    let amount = Number(inputLoanAmount.value);
    console.log(amount);
    if (amount > 0) {
        currentAccount.movements.push(amount);

        updateUI(currentAccount);
    } else {
        alert("Not a valid amount!");
    }
    inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
    e.preventDefault();

    if (
        inputCloseUsername.value === currentAccount.username &&
        currentAccount.pin === Number(inputClosePin.value)
    ) {
        const index = accounts.findIndex(
            (acc) => (acc.username = inputCloseUsername.value)
        );
        // console.log(index);
        accounts.splice(index, 1);
        // console.log(accounts);
        containerApp.style.display = "none";
        containerInfo.style.display = "grid";

        inputCloseUsername.value = inputClosePin.value = "";

        labelWelcome.textContent = `Log in to access your account`;

        setTimeout(() => alert("Account deleted successfully!"), 500);
    } else {
        inputCloseUsername.value = inputClosePin.value = "";
        setTimeout(() => alert("Wrong input!"), 500);
    }
});

btnSort.addEventListener("click", function (e) {
    e.preventDefault();

    displayMovements(currentAccount.movements, !sorted);
    //setting sorted variable to false if true or vice versa
    sorted = !sorted;
});

//functions section-->

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

//function to display the details of account
const updateUI = function (account) {
    //display transactions
    displayMovements(account.movements);
    //display summary
    displaySummary(account);
    //display balance
    displayBalance(account);
};

// function to add transaction history
const displayMovements = function (movements, sort) {
    containerMovements.innerHTML = " ";

    //checking if sort is true--slice() will create a new copy of the array
    //as sort() mutates the original array
    const newMovements = sort
        ? movements.slice().sort((a, b) => a - b)
        : movements;

    newMovements.forEach(function (mov, i) {
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

//function to display total balance using reduce() method-->
const displayBalance = function (account) {
    //creating a balance key in account object to store total balance
    account.balance = account.movements.reduce(function (acc, mov) {
        return acc + mov;
    }, 0);

    // account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);

    //adding interest in total balance
    account.balance += account.interest;

    labelBalance.textContent = `${account.balance} ₹`;
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

    const interest = account.movements
        .filter((mov) => mov > 0)
        .map((deposit) => (deposit * account.interestRate) / 100)
        .reduce((acc, int) => acc + int, 0);
    //creating a interest key in account object
    account.interest = interest;

    labelSumInterest.textContent = `${interest} ₹`;
    labelSumInterestRate.textContent = `(${account.interestRate}%)`;
};
