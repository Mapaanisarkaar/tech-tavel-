const express = require('express');
const app = express();
app.use(express.json());

let agentWallet = 15000;
const adminMarkup = 150;

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>B2B Travel Portal</title>
        <style>
            body { font-family: sans-serif; background: #eef2f5; padding: 15px; margin: 0; }
            .card { background: white; padding: 15px; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); margin-bottom: 15px; }
            .wallet { background: #0056b3; color: white; border-radius: 8px; padding: 12px; font-size: 16px; }
            input, button { width: 100%; padding: 10px; margin-top: 8px; box-sizing: border-box; border-radius: 5px; border: 1px solid #ccc; }
            button { background: #28a745; color: white; font-weight: bold; border: none; cursor: pointer; }
            .flight-item { border-bottom: 1px solid #eee; padding: 10px 0; }
            .price { color: #d9534f; font-weight: bold; font-size: 18px; }
        </style>
    </head>
    <body>
        <h2>✈️ Agent Travel Dashboard</h2>
        <div class="card wallet">
            Agency: <b>Sharma Travels</b><br>
            Wallet Balance: <b id="bal">₹${agentWallet}</b>
        </div>

        <div class="card">
            <h3>Flight Search (B2B Rates)</h3>
            <input type="text" id="from" value="DEL" placeholder="From">
            <input type="text" id="to" value="BOM" placeholder="To">
            <button onclick="searchFlights()">SEARCH FLIGHTS</button>
            <div id="results"></div>
        </div>

        <script>
            async function searchFlights() {
                const resDiv = document.getElementById('results');
                resDiv.innerHTML = "<p>Searching Live Rates...</p>";
                
                const res = await fetch('/search', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ origin: document.getElementById('from').value })
                });
                const data = await res.json();
                
                let html = "";
                data.flights.forEach(f => {
                    html += \`
                        <div class="flight-item">
                            <b>\${f.airline}</b> (\${f.flightNo})<br>
                            Time: \${f.time} | Fare: <span class="price">₹\${f.displayPrice}</span><br>
                            <small style="color:green;">Includes ₹${adminMarkup} Profit Margin</small><br>
                            <button style="background:#007bff; margin-top:5px;" onclick="bookTicket(\${f.displayPrice})">BOOK TICKET</button>
                        </div>
                    \`;
                });
                resDiv.innerHTML = html;
            }

            async function bookTicket(fare) {
                const res = await fetch('/book', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ fare: fare })
                });
                const data = await res.json();
                if(data.status === "SUCCESS") {
                    alert("Ticket Booked Successfully!");
                    document.getElementById('bal').innerText = "₹" + data.newWallet;
                    document.getElementById('results').innerHTML = "<p style='color:green;'><b>Booking Done! Remaining Wallet: ₹" + data.newWallet + "</b></p>";
                } else {
                    alert(data.msg);
                }
            }
        </script>
    </body>
    </html>
  `);
});

app.post('/search', (req, res) => {
  const flights = [
    { flightNo: "6E-204", airline: "IndiGo", time: "10:00 AM", displayPrice: 4000 + adminMarkup },
    { flightNo: "UK-811", airline: "Vistara", time: "02:30 PM", displayPrice: 5200 + adminMarkup }
  ];
  res.json({ flights });
});

app.post('/book', (req, res) => {
  const fare = req.body.fare;
  if (agentWallet < fare) {
    return res.json({ status: "FAIL", msg: "Insufficient Balance in Wallet!" });
  }
  agentWallet -= fare;
  res.json({ status: "SUCCESS", newWallet: agentWallet });
});

app.listen(8080, () => console.log("NEW PORT SERVER RUNNING AT 8080"));
