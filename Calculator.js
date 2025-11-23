// creating variables 
let display = document.querySelector(".display");
let currentInput = "";
let operator = "";
let previousInput = "";
//clear out prev answer- only true when equal is clicked
let justCalculated= false;
//error message
const ERROR_MESSAGE = "SEA KING ATTACK";
//max out digits
const MAX_DIGITS = 12;
//adding animation to calc-wrapper start by creating variable
let calcWrapper = document.querySelector(".calc-wrapper");


//display function - calc will show 0 if nothing is in currentInput
function updateDisplay() {
    if (currentInput === ERROR_MESSAGE) {
        display.textContent = ERROR_MESSAGE;
        return;
    }
    if (previousInput && operator && !justCalculated) {
        display.textContent = `${previousInput} ${operator} ${currentInput}`;
    } else {
    display.textContent = currentInput || "0";
    }
};
//error animation - creating the function
function showError(message) {
    currentInput = message;
    updateDisplay();
    //adding class in js
    calcWrapper.classList.remove("shake"); //remove class once down
    void calcWrapper.offsetWidth; //reflow layout
    calcWrapper.classList.add("shake"); // add shake again

    //telling when to stop the animation after 1.5s
    setTimeout(() => {
        display.classList.remove("shake");
        currentInput = "";
        updateDisplay();
    }, 1500);
}
// adding values to the number button
document.querySelectorAll(".number").forEach(btn => 
    {btn.addEventListener("click", () => {
        //start again if error occurs
        let value = btn.textContent;
        if (justCalculated || currentInput === ERROR_MESSAGE) {
            currentInput = "";
            justCalculated =false;
        }
        
        //prevents repeating decimal
        if (value === "." && currentInput.includes(".")) return;
        //no digit overflow
        if (currentInput.length >= MAX_DIGITS) return;

        //adding values to the strings
        currentInput += value;
        //updating display 
        updateDisplay();
    });
});
//adding values to the operations 
document.querySelectorAll(".operation").forEach(btn => {
    btn.addEventListener("click", () => {
        let value= btn.textContent;

        if (currentInput === ERROR_MESSAGE) return;
        //when user wants to clear; we are telling the calc to erase, forget prev number, erase operator, stop the code w return
        if (value === "C") {
            currentInput = "";
            previousInput = "";
            operator = "";
            justCalculated = false;
            updateDisplay();
            return;
        } else if (value === "⇐") {
        if (currentInput === ERROR_MESSAGE) {
            currentInput = "";
        } else {
            //.slice - removing a part of a string. (index start, -1 = last character)
            currentInput = currentInput.slice(0, -1);
        }
            updateDisplay();
            return;
        } else if (value === "%") {
            if (!currentInput) return;
            currentInput = (parseFloat(currentInput)/100).toString();
            //parseFloat - builtin function converts string into number
            //.toString - converting back to string 
            updateDisplay();
            return;
        } else if (value === "±") {
            if (!currentInput) return;
            currentInput = (parseFloat(currentInput) * -1).toString();
            updateDisplay();
            return;
        } else if (["+", "-", "*", "/"].includes(value)) {
            if (!currentInput) return;
            operator = value;
            previousInput = currentInput;
            currentInput = "";
            justCalculated = false;
            updateDisplay();
        }
        
    });
});
// equal button
document.querySelector(".equal").addEventListener("click", () => {
    //missing input willresult in a message lasting 1.5 seconds
    if (!currentInput || !previousInput) {
        showError("Luffy forgot a number!");
        return;
    }
    //if user doesnt input anything - do nothing
    //converting strings into numbers 
    let num1 = parseFloat(previousInput);
    let num2 = parseFloat(currentInput);
    let result;
    //telling calculator what to do depending on the operation chosen
    switch (operator) {
        case "+": result = num1 + num2; break;
        case "-": result = num1 - num2; break;
        case "*": result = num1 * num2; break;
        //if user inputs 0 as num2 - mark no berries found / error
        case "/": if (num2 === 0) {
            showError(ERROR_MESSAGE);
            previousInput="";
            operator = "";
            justCalculated = true;
            updateDisplay();
            return;
        } else { result = num1 / num2; 
        } break;

    }
    // preventing number overflow
    if (typeof result === "number") {
        currentInput = Number(result.toFixed(12)).toString();
    } else {
        currentInput = result
    }
    previousInput = "";
    operator = "";
    updateDisplay();
    //buttons clear out
    justCalculated = true;
});

//start with displaying 0 
updateDisplay();