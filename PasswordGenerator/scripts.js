const inputSlider = document.querySelector('.data-lengthSlider');
const lengthDisplay = document.querySelector('.data-lengthNumber');
const passwordDisplay = document.querySelector('.data-passwordDisplay');
const copyBtn = document.querySelector('.data-copy');
const copyMsg = document.querySelector('.data-copyMsg');
const uppercaseCheck = document.querySelector('#uppercase');
const lowercaseCheck = document.querySelector('#lowercase');
const numberCheck = document.querySelector('#numbers');
const symbolsCheck = document.querySelector('#symbols');
const indicator = document.querySelector('.data-indicator');
const generateBtn = document.querySelector('.generateButton');
const allCheckBox = document.querySelectorAll('input[type="checkbox"]');
const symbols = '!@#$%^&*()-_=+[]{}|;:,.<>?/\~';

let password = '';
let passwordLength = 10;
let checkCount = 0; 

handleSlider();

setIndicator("#ccc");

// set passwordLength
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText= passwordLength;
};

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max-min)) + min;
};

function generateRandomNumber() {
    return getRandomInteger(0,9);
};

function generateLowerCase() {
    return String.fromCharCode(getRandomInteger(97,123));
};

function generateUpperCase() {
    return String.fromCharCode(getRandomInteger(65,91));
};

function generateSymbol() {
    const randomNum = getRandomInteger(0, symbols.length);
    return symbols.charAt(randomNum);
};

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercaseCheck.checked) 
        hasUpper =true;
    
    if (lowercaseCheck.checked) 
        hasLower =true;
    
    if (numberCheck.checked) 
        hasNum =true;
    
    if (symbolsCheck.checked) 
        hasSym =true;
    


    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator('#066B33');
    }
    else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator('#AD822B');
    }
    else{
        setIndicator('#880E29');
    }
};


function setIndicator(color) {
    indicator.style.backgroundColor = color;
    // shadow
    // indicator.style.boxShadow = "0px 0px 20px 5px rgba(0,0,0,0.5)";
};

async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = 'copied';
    }
    catch(e){
        copyMsg.innerText = 'failed';
    }

    // to make copied! wala text visible
    copyMsg.classList.add('active');

    setTimeout(() => {
        copyMsg.classList.remove('active')
    }, 2000);
}


allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange)
})

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
            checkCount++;
    })

    // special condition
    if(passwordLength < checkCount)
        passwordLength = checkCount;
        handleSlider();
}

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if (passwordLength > 1)
        copyContent();
})

generateBtn.addEventListener('click', () => {
    // none of the checkbox are selected
    if (checkCount == 0)
        return;

    if (passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }


    // finding new password
    console.log('starting the journey');
    // remove old passwird
    password = '';

    // including things mentioned be the checkbox 
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }

    // if(numberCheck.checked){
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numberCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    // cumpolsory addition
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }

    console.log('compulsory addition done');

    // remianing addition
    for(let i=0; i<passwordLength-funcArr.length; i++){
        let randIndex = getRandomInteger(0, funcArr.length);
        console.log('crandIndex '+randIndex);

        password += funcArr[randIndex](); 
    }

    console.log('remaining addition done');

    // shuffling the password 
    password = shufflePassword(Array.from(password));

    console.log('shuffling done');


    // show in the UI
    passwordDisplay.value = password;

    console.log('UI addition done');


    // calculate the strength
    calcStrength();
});

function shufflePassword(array) {
    // fisher yates algorithm
    for (let i=array.length-1; i>0; i--){
        // find random j
        const j =Math.floor(Math.random()*(i+1));
        // swap j with i
        const temp = array[i];
        array[i]=array[j];
        array[j] = temp;
    }

    let str = '';

    array.forEach((el) => (str += el));
    return str;
}
