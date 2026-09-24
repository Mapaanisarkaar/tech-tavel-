const express = require('express');
const app = express();

app.use(express.json());

let agentWallet = 45500;
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
        .tab-btn { width: 48%; padding: 10px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; }
        .tab-btn.active { background: #007bff; font-weight: bold; }
        .form-group { margin-bottom: 10px; text-align: left; }
        label { display: block; font-size: 12px; font-weight: bold; margin-bottom: 3px; }
        input, select { width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 5px; }
        button.action-btn { background: #28a745; color: white; font-weight: bold; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; width: 100%; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="card">
        <h2>Agent Travel Dashboard</h2>
        <div class="wallet">
            Wallet Balance: <b>₹<span id="bal">${agentWallet}</span></b>
        </div>

        <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
            <button class="tab-btn active" id="flightTab" onclick="switchTab('flight')">Flights</button>
            <button class="tab-btn" id="hotelTab" onclick="switchTab('hotel')">Hotels</button>
        </div>

        <!-- FLIGHT FORM -->
        <div id="flightSection">
            <div class="form-group">
                <label>From City</label>
                <input type="text" id="fFrom" value="DEL">
            </div>
            <div class="form-group">
                <label>To City</label>
                <input type="text" id="fTo" value="BOM">
            </div>
            <div class="form-group">
                <label>Travel Date</label>
                <input type="date" id="fDate" value="2026-10-01">
            </div>
            <div class="form-group">
                <label>Passengers</label>
                <select id="fPax">
                    <option value="1">1 Passenger</option>
                    <option value="2">2 Passengers</option>
                    <option value="3">3 Passengers</option>
                </select>
            </div>
            <button class="action-btn" onclick="searchFlights()">Search Flights</button>
        </div>

        <!-- HOTEL FORM -->
        <div id="hotelSection" style="display:none;">
            <div class="form-group">
                <label>City / Location</label>
                <input type="text" id="hCity" value="Mumbai">
            </div>
            <div class="form-group">
                <label>Check-In Date</label>
                <input type="date" id="hCheckIn" value="2026-10-01">
            </div>
            <div class="form-group">
                <label>Check-Out Date</label>
                <input type="date" id="hCheckOut" value="2026-10-03">
            </div>
            <div class="form-group">
                <label>Guests / Rooms</label>
                <select id="hGuests">
                    <option value="1 Room, 2 Guests">1 Room, 2 Guests</option>
                    <option value="2 Rooms, 4 Guests">2 Rooms, 4 Guests</option>
                </select>
            </div>
            <button class="action-btn" style="background:#17a2b8;" onclick="searchHotels()">Search Hotels</button>
        </div>

        <div id="results" style="margin-top:20px;"></div>
    </div>

    <script>
        function switchTab(type) {
            if(type === 'flight') {
                document.getElementById('flightSection').style.display = 'block';
                document.getElementById('hotelSection').style.display = 'none';
                document.getElementById('flightTab').classList.add('active');
                document.getElementById('hotelTab').classList.remove('active');
            } else {
                document.getElementById('flightSection').style.display = 'none';
                document.getElementById('hotelSection').style.display = 'block';
                document.getElementById('hotelTab').classList.add('active');
                document.getElementById('flightTab').classList.remove('active');
            }
            document.getElementById('results').innerHTML = '';
        }

        async function searchFlights() {
            let from = document.getElementById('fFrom').value;
            let to = document.getElementById('fTo').value;
            let date = document.getElementById('fDate').value;
            let pax = document.getElementById('fPax').value;

            let res = await fetch('/search-flights', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ from, to, date, pax })
            });
            let data = await res.json();
            let html = '<h3>Flights: ' + from + ' -> ' + to + ' (' + date + ')</h3>';
            data.flights.forEach(f => {
                html += \`<div style="border-bottom:1px solid #ccc; padding:10px 0; text-align:left;">
                <b>\${f.airline} (\${f.flightNo})</b> - \${f.time}<br>
                Price (\${pax} Pax): <b>₹\${f.displayPrice * pax}</b>
                <button style="width:auto; padding:5px 10px; margin-top:5px;" onclick="bookItem(\${f.displayPrice * pax}, 'Flight')">Book Flight</button>
                </div>\`;
            });
            document.getElementById('results').innerHTML = html;
        }

        async function searchHotels() {
            let city = document.getElementById('hCity').value;
            let checkIn = document.getElementById('hCheckIn').value;

            let res = await fetch('/search-hotels', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ city })
            });
            let data = await res.json();
            let html = '<h3>Hotels in ' + city + '</h3>';
            data.hotels.forEach(h => {
                html += \`<div style="border-bottom:1px solid #ccc; padding:10px 0; text-align:left;">
                <b>\${h.name}</b> - \${h.rating}<br>
                Price/Night: <b>₹\${h.displayPrice}</b>
                <button style="width:auto; padding:5px 10px; margin-top:5px; background:#17a2b8; color:white; border:none; border-radius:3px;" onclick="bookItem(\${h.displayPrice}, 'Hotel')">Book Hotel</button>
                </div>\`;
            });
            document.getElementById('results').innerHTML = html;
        }

        async function bookItem(fare, type) {
            let res = await fetch('/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fare, type })
            });
            let data = await res.json();
            if(data.status === "SUCCESS") {
                alert(type + " Booked Successfully!");
                document.getElementById('bal').innerText = data.newWallet;
                document.getElementById('results').innerHTML = "<p style='color:green;'><b>" + type + " Booking Done! Remaining Wallet: ₹" + data.newWallet + "</b></p>";
            } else {
                alert(data.msg);
            }
        }
    </script>
</body>
</html>
  `);
});

app.post('/search-flights', (req, res) => {
    const flights = [
        { flightNo: "6E-204", airline: "IndiGo", time: "10:00 AM", displayPrice: 4000 + adminMarkup },
        { flightNo: "UK-811", airline: "Vistara", time: "02:30 PM", displayPrice: 5200 + adminMarkup }
    ];
    res.json({ flights });
});

app.post('/search-hotels', (req, res) => {
    const city = req.body.city || "Mumbai";
    const hotels = [
        { name: "Grand Hotel " + city, rating: "5 Star", displayPrice: 8000 + adminMarkup },
        { name: "Comfort Stay " + city, rating: "4 Star", displayPrice: 4500 + adminMarkup }
    ];
    res.json({ hotels });
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
