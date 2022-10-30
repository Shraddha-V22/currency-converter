const fromInput = document.getElementById("from");
const toInput = document.getElementById("to");
const currencyForm = document.getElementById("currency-converter");

let headers = new Headers();
headers.append("apikey", "AKryb5mGVRnjx045AqUtfOeR4oH7w331");

let requestOptions = {
  method: "GET",
  headers,
};

const getCurrencyNames = async () => {
  try {
    const response = await fetch(
      "https://api.apilayer.com/currency_data/list",
      requestOptions
    );
    return response.json();
  } catch (error) {
    console.log(`Could not fetch details, ${error}`);
  }
};

const loadOptions = async () => {
  const data = await getCurrencyNames();
  console.log(data);
  let currencySymbols = Object.keys(data.currencies);
  let html = "";
  currencySymbols.map((curr) => {
    html += `<option value="${curr}" title="${data.currencies[curr]}">${data.currencies[curr]}</option>`;
  });
  fromInput.innerHTML += html;
  toInput.innerHTML += html;
};

const getExchangeRates = async (toCurr, fromCurr, amt) => {
  try {
    const response = await fetch(
      `https://api.apilayer.com/currency_data/convert?to=${toCurr}&from=${fromCurr}&amount=${amt}`,
      requestOptions
    );
    return response.json();
  } catch (error) {
    console.log(`Could not fetch details, ${error}`);
  }
};

const getCurrentDateTime = () => {
  const dateTime = new Date();
  const options = {
    day: "numeric",
    month: "long",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
  };
  return new Intl.DateTimeFormat("en", options).format(dateTime);
};

// loadOptions();
const resultMsg = document.getElementById("output");
// if (!resultMsg.innerHTML) {
//   resultMsg.style.display = "none";
// } else {
//   resultMsg.style.display = "revert";
// }

currencyForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const { currencies } = await getCurrencyNames();

  const {
    target: { from: fromCurr, to: toCurr, amt },
  } = event;

  if ((fromCurr.value, toCurr.value, amt.value)) {
    const data = await getExchangeRates(
      toCurr.value,
      fromCurr.value,
      amt.valueAsNumber
    );
    const {
      query: { from, to },
      info: { quote },
      result,
    } = data;

    resultMsg.innerHTML = `<p>As per the current exchange rate of <strong>${quote.toFixed(
      2
    )}</strong>, the converted value from <strong>${from}</strong> to <strong>${to}</strong> is <strong>${result.toFixed(
      2
    )}${to}</strong></p>`;

    const details = document.getElementById("amount-details");
    details.innerHTML = `<ul id="amount-details">
            <li>${from} (${currencies[from]}):</li>
            <li>${to} (${currencies[to]}):</li>
            <li>Date and Time: ${getCurrentDateTime()}</li>
            <li>Exchange rate: ${quote.toFixed(2)}</li>
          </ul>`;
  }
});
