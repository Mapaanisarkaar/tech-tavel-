const express = require('express');
const app = express();

app.use(express.json());

let agentWallet = 50000;
let adminMarkup = 500;

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>B2B Travel Portal</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #eef2f5; }
        .card { background: white; padding: 20px; border-radius: 10px; max-width: 500px; margin: auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        .wallet { background: #0056b3; color: white; border-radius: 8px; padding: 10px; margin-bottom: 15px; }
        button { background: #28a745; color: white; font-weight: bold; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; width: 100%; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="card">
        <h2>Agent Travel Dashboard</h2>
        <div class="wallet">
            Wallet Balance: <b>₹<span id="bal">${agentWallet}</span></b>
        </div>
        <button onclick="searchFlights()">Search Flights</button>
        <div id="results" style="margin-top:20px;"></div>
    </div>

    <script>
        async function searchFlights() {
            let res = await fetch('/search', { method: 'POST' });
            let data = await res.json();
            let html = '<h3>Available Flights</h3>';
            data.flights.forEach(f => {
                html += \`<div style="border-bottom:1px solid #ccc; padding:10px 0;">
                <b>\${f.airline} (\${f.flightNo})</b> - \${f.time}<br>
                Price: <b>₹\${f.displayPrice}</b>
                <button style="width:auto; padding:5px 10px; margin-left:10px;" onclick="bookFlight(\${f.displayPrice})">Book</button>
                </div>\`;
            });
            document.getElementById('results').innerHTML = html;
        }

        async function bookFlight(fare) {
            let res = await fetch('/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fare })
            });
            let data = await res.json();
            if(data.status === "SUCCESS") {
                alert("Ticket Booked Successfully!");
                document.getElementById('bal').innerText = data.newWallet;
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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`SERVER RUNNING ON PORT ${PORT}`));
