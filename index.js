let display = document.getElementById('display')

function numPressed(num) {
    let space = '';
    if (/[\-+*\/]$/.test(display.innerText)) space = ' ';
    display.innerText += `${space}${num}`;
}

function clearDisplay() {
    display.innerText = ' ';
}

function backspace() {
    let str = display.innerText.trim();
    if (str.includes('=')) {
        clearDisplay();
        return;
    }
    display.innerText = str.substr(0, str.length - 1);
}

function operation(symbol) {
    let expression = display.innerText;
    if (expression.trim() === '') return;
    if (expression.includes('=')) {
        display.innerText = expression.split(' ').reverse()[0];
    }
    if (/.*?\d$/.test(expression.trim())) {
        display.innerText += ` ${symbol} `
    } else if (/[\/*\-+]$/.test(expression)) {
        display.innerText = expression.substr(0, expression.length - 1) + ` ${symbol} `;
    }
}

function dot() {
    if (/.*?\d$/.test(display.innerText)) {
        display.innerText += ',';
    }
}

function getIndexesOf(array, values) {
    let indexes = [];
    for (const valueKey in array) {
        if (values.includes(array[valueKey])) {
            indexes.push(valueKey);
        }
    }
    return indexes.map(n => parseInt(n));
}

function calcWeek(values) {
    if (values.length === 1) return values;
    let weekIndexes = getIndexesOf(values, ['+', '-']);
    let valuesCopy = Array.from(values);
    for (const valueIndex of weekIndexes) {
        let left = valuesCopy[valueIndex - 1];
        let right = valuesCopy[valueIndex + 1];
        let res;
        if (values[valueIndex] === '+') res = left + right;
        else res = left - right;
        valuesCopy[valueIndex + 1] = res;
    }
    return clearResult(valuesCopy, weekIndexes);
}

function clearResult(result, indexes) {

    for (const index of indexes.reverse()) {
        result = [...result.slice(0, index - 1), ...result.slice(index + 1)]
    }
    return result;
}

function calcStrong(values) {
    if (values.length === 1) return values;
    let strongIndexes = getIndexesOf(values, ['/', '*']);
    let valuesCopy = Array.from(values);
    for (const valueIndex of strongIndexes) {
        let left = valuesCopy[valueIndex - 1];
        let right = valuesCopy[valueIndex + 1];
        let res;
        if (values[valueIndex] === '/') res = left / right;
        else res = left * right;
        valuesCopy[valueIndex + 1] = res;
    }
    return clearResult(valuesCopy, strongIndexes);
}

function equal() {
    if (display.innerText.includes('=')) return;
    let values = display.innerText
        .split(' ')
        .map(value => value.replace(',', '.'))
        .map(value => {
            if (/[\/*\-+]/.test(value)) return value;
            return parseFloat(value);
        });
    if (values.length <= 2) return;
    let valuesStrongCalculated = calcStrong(values);
    let valuesWeekCalculated = calcWeek(valuesStrongCalculated);
    display.innerText = [...values, '=', valuesWeekCalculated[0]].join(' ');
}

document.addEventListener('keyup', keyEvent => {
    console.log(keyEvent);
    if (/^\d$/.test(keyEvent.key)) {
        numPressed(keyEvent.key);
        return;
    }
    if (/[\/*\-+]/.test(keyEvent.key)) {
        operation(keyEvent.key)
        return;
    }
    if (/[.,]/.test(keyEvent.key)) {
        dot();
        return;
    }
    if (keyEvent.key.toLowerCase() === 'enter') {
        equal();
        return;
    }
    if (keyEvent.key.toLowerCase() === 'backspace') {
        backspace();
    }
    if (keyEvent.key.toLowerCase() === 'escape') {
        clearDisplay();
    }
})
