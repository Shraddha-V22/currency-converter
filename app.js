const fromInput = document.getElementById('from');
const toInput = document.getElementById('to');
const currencyForm = document.getElementById('currency-converter');

let headers = new Headers();
headers.append("apikey", "AKryb5mGVRnjx045AqUtfOeR4oH7w331");

let requestOptions = {
    method: "GET",
    headers,
}

fetch("https://api.apilayer.com/currency_data/list", requestOptions)
.then(response => response.json())
.then(data => {
    let currencySymbols = Object.keys(data.currencies);
    let html = "";
    currencySymbols.map(curr => {
        html += `<option value="${curr}" title="${data.currencies[curr]}">${curr}</option>`
    })
    fromInput.innerHTML += html;
    toInput.innerHTML += html;
})

currencyForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const { target: { from:fromCurr, to:toCurr, amt}} = event;
    
    fetch(`https://api.apilayer.com/currency_data/convert?to=${toCurr.value}&from=${fromCurr.value}&amount=${amt.valueAsNumber}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        const { query: {from, to}, info: {quote}, result} = data
        document.getElementById("output").textContent = `As per the current exchange rate of ${quote.toFixed(2)}, the converted value from ${from} to ${to} is ${result.toFixed(2)}${to}`;
    })
})

// {
//     "success": true,
//     "query": {
//         "from": "AOA",
//         "to": "AZN",
//         "amount": 10
//     },
//     "info": {
//         "timestamp": 1664804764,
//         "quote": 0.003917
//     },
//     "result": 0.03917
// }
