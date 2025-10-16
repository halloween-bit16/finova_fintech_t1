import money from "./assets/money.png";
import { useEffect, useState } from "react";

function App() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState("");
  const [rate, setRate] = useState(null);
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const codes = Object.keys(data?.rates || {});
        if (codes.length === 0) {
          console.warn("No currency codes found in API response. Falling back to common list.");
          setCurrencies(["USD", "INR", "EUR", "GBP", "JPY"]);
        } else {
          setCurrencies(codes);
          if (!codes.includes(fromCurrency)) setFromCurrency(codes[0]);
          if (!codes.includes(toCurrency)) setToCurrency(codes[0]);
        }
      } catch (error) {
        console.error("Error fetching currency list:", error);
        setCurrencies(["USD", "INR", "EUR", "GBP", "JPY"]);
      }
    };
    fetchCurrencies();
  }, []);

  const fetchRate = async () => {
    try {
      const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const newRate = data?.rates?.[toCurrency];
      if (typeof newRate !== "number") {
        console.error("Rate not found for", toCurrency, "in response:", data);
        setRate(null);
        setConvertedAmount("");
        return;
      }
      setRate(newRate);
      const numericAmount = Number(amount) || 0;
      setConvertedAmount((numericAmount * newRate).toFixed(2));
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      setRate(null);
      setConvertedAmount("");
    }
  };

  const handleConvert = () => {
    fetchRate();
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <div className="bg-gradient-to-l from-indigo-400 to-violet-400 flex-grow flex flex-col items-center justify-center">
          <div className="p-10 bg-stone-50 min-h-135 min-w-120 rounded-3xl shadow-lg/20 shadow-black border border-sky-50">
            <div className="flex justify-center">
              <div>
                <div className="flex flex-row gap-3">
                  <img src={money} className="h-10" alt="money icon" />
                  <p className="text-3xl font-900">Currency Converter</p>
                </div>
                <div className="flex justify-center p-4 text-gray-600">
                  <p>Convert between currencies instantly</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3">
              <p>Input</p>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    const v = e.currentTarget.value;
                    setAmount(v === "" ? "" : Number(v));
                  }}
                  className="shadow-xs shadow-slate-500 p-4 border my-4 h-13 w-60 rounded-xl bg-stone-100 border-stone-600 focus:border-indigo-400 focus:outline-none focus:border-2"
                />
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.currentTarget.value)}
                  className="p-3 border h-13 my-4 w-25 rounded-xl shadow-xs shadow-slate-500 bg-stone-100 border-stone-600 focus:border-indigo-400 focus:outline-none focus:border-2"
                >
                  {currencies.map((cur) => (
                    <option key={cur} value={cur}>
                      {cur}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="flex justify-center items-center p-2 bg-gradient-to-l from-indigo-500 to-violet-500 rounded-full h-10 w-10 opacity-90">
                <p className="text-2xl text-white font-extrabold">↓</p>
              </div>
            </div>

            <div className="p-3">
              <p>Output</p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={convertedAmount}
                  readOnly
                  className="shadow-xs shadow-slate-500 p-4 border my-4 h-13 w-60 rounded-xl bg-stone-100 border-stone-600 focus:border-indigo-400 focus:outline-none focus:border-2"
                />
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.currentTarget.value)}
                  className="p-3 border h-13 my-4 w-25 rounded-xl shadow-xs shadow-slate-500 bg-stone-100 border-stone-600 focus:border-indigo-400 focus:outline-none focus:border-2"
                >
                  {currencies.map((cur) => (
                    <option key={cur} value={cur}>
                      {cur}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={handleConvert}
                className="w-[200px] py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold text-lg shadow-md hover:shadow-xl hover:scale-103 transition-transform duration-200 focus:outline-none"
              >
                Convert Currency
              </button>
            </div>

            {rate && (
              <p className="text-center mt-4 text-gray-700">
                💱 1 {fromCurrency} = {rate} {toCurrency}
              </p>
            )}
          </div>
        </div>

        <div className="bg-stone-800 text-white text-center py-4 mt-auto">
          © 2025 Currency Converter | Ruchi Pawar | <a href="https://github.com/halloween-bit16/finova_fintech_t1"> Github Repository Link </a>
        </div>
      </div>
    </>
  );
}

export default App;
