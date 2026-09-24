const express = require('express');
const app = express();

app.use(express.json());

let agentWallet = 45500;
let adminMarkup = 500;

// Indian Cities & Airports Database
const CITIES = [
    { name: "Agartala", code: "IXA" },
    { name: "Agra", code: "AGR" },
    { name: "Ahmedabad", code: "AMD" },
    { name: "Aizawl", code: "AJL" },
    { name: "Amritsar", code: "ATQ" },
    { name: "Aurangabad", code: "IXU" },
    { name: "Bagdogra", code: "IXB" },
    { name: "Bareilly", code: "BEK" },
    { name: "Belgaum", code: "IXG" },
    { name: "Bengaluru (Bangalore)", code: "BLR" },
    { name: "Bhopal", code: "BHO" },
    { name: "Bhubaneswar", code: "BBI" },
    { name: "Bhuj", code: "BHJ" },
    { name: "Bikaner", code: "BKB" },
    { name: "Chandigarh", code: "IXC" },
    { name: "Chennai", code: "MAA" },
    { name: "Coimbatore", code: "CJB" },
    { name: "Dehradun", code: "DED" },
    { name: "Delhi (NCR)", code: "DEL" },
    { name: "Dharamsala", code: "DHM" },
    { name: "Dibrugarh", code: "DBR" },
    { name: "Dimapur", code: "DMU" },
    { name: "Durgapur", code: "RGD" },
    { name: "Gaya", code: "GAY" },
    { name: "Goa (Dabolim)", code: "GOI" },
    { name: "Goa (Mopa)", code: "GOX" },
    { name: "Gorakhpur", code: "GOP" },
    { name: "Guwahati", code: "GAU" },
    { name: "Gwalior", code: "GWL" },
    { name: "Hubli", code: "HBX" },
    { name: "Hyderabad", code: "HYD" },
    { name: "Imphal", code: "IMF" },
    { name: "Indore", code: "IDR" },
    { name: "Itanagar (Hollongi)", code: "HGI" },
    { name: "Jabalpur", code: "JLR" },
    { name: "Jaipur", code: "JAI" },
    { name: "Jaisalmer", code: "JSA" },
    { name: "Jammu", code: "IXJ" },
    { name: "Jamnagar", code: "JGA" },
    { name: "Jamshedpur", code: "IXW" },
    { name: "Jharsuguda", code: "JRG" },
    { name: "Jodhpur", code: "JDH" },
    { name: "Jorhat", code: "JRH" },
    { name: "Kandla", code: "IXY" },
    { name: "Kannur", code: "CNN" },
    { name: "Kanpur", code: "KNU" },
    { name: "Khajuraho", code: "HJR" },
    { name: "Kochi (Cochin)", code: "COK" },
    { name: "Kolhapur", code: "KLH" },
    { name: "Kolkata", code: "CCU" },
    { name: "Kozhikode (Calicut)", code: "CCJ" },
    { name: "Kullu (Bhuntar)", code: "KUU" },
    { name: "Leh", code: "IXL" },
    { name: "Lucknow", code: "LKO" },
    { name: "Ludhiana", code: "LUH" },
    { name: "Madurai", code: "IXM" },
    { name: "Mangalore", code: "IXE" },
    { name: "Mumbai", code: "BOM" },
    { name: "Mysore", code: "MYQ" },
    { name: "Nagpur", code: "NAG" },
    { name: "Nanded", code: "NDC" },
    { name: "Nashik", code: "ISK" },
    { name: "North Lakhimpur", code: "IXI" },
    { name: "Pantnagar", code: "PGH" },
    { name: "Pasighat", code: "IXT" },
    { name: "Patna", code: "PAT" },
    { name: "Pondicherry", code: "PNY" },
    { name: "Port Blair", code: "IXZ" },
    { name: "Prayagraj (Allahabad)", code: "IXD" },
    { name: "Pune", code: "PNQ" },
    { name: "Raipur", code: "RPR" },
    { name: "Rajahmundry", code: "RJA" },
    { name: "Rajkot", code: "HSR" },
    { name: "Ranchi", code: "IXR" },
    { name: "Shillong", code: "SHL" },
    { name: "Shimla", code: "SLV" },
    { name: "Shirdi", code: "SAG" },
    { name: "Silchar", code: "IXS" },
    { name: "Siliguri", code: "IXB" },
    { name: "Srinagar", code: "SXR" },
    { name: "Surat", code: "STV" },
    { name: "Tezpur", code: "TEZ" },
    { name: "Thiruvananthapuram (Trivandrum)", code: "TRV" },
    { name: "Tiruchirappalli (Trichy)", code: "TRZ" },
    { name: "Tirupati", code: "TIR" },
    { name: "Udaipur", code: "UDR" },
    { name: "Vadodara", code: "BDQ" },
    { name: "Varanasi", code: "VNS" },
    { name: "Vijayawada", code: "VGA" },
    { name: "Visakhapatnam", code: "VTZ" }
];

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
        .tab-btn { width: 31%; padding: 10px 5px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 13px; }
        .tab-btn.active { background: #007bff; font-weight: bold; }
        .form-group { margin-bottom: 10px; text-align: left; position: relative; }
        label { display: block; font-size: 12px; font-weight: bold; margin-bottom: 3px; }
        input, select { width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 5px; }
        button.action-btn { background: #28a745; color: white; font-weight: bold; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; width: 100%; margin-top: 10px; }
        .admin-box { background: #fff3cd; border: 1px solid #ffeeba; padding: 15px; border-radius: 8px; text-align: left; }
    </style>
</head>
<body>
    <div class="card">
        <h2>B2B Travel Portal</h2>
        <div class="wallet">
            Wallet Balance: <b>₹<span id="bal">${agentWallet}</span></b>
        </div>

        <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
            <button class="tab-btn active" id="flightTab" onclick="switchTab('flight')">Flights</button>
            <button class="tab-btn" id="hotelTab" onclick="switchTab('hotel')">Hotels</button>
            <button class="tab-btn" id="adminTab" style="background:#dc3545;" onclick="switchTab('admin')">Admin Panel</button>
        </div>

        <!-- Datalist for City Suggestions -->
        <datalist id="cityList">
            ${CITIES.map(c => `<option value="${c.name} (${c.code})">`).join('')}
        </datalist>

        <!-- FLIGHT FORM -->
        <div id="flightSection">
            <div class="form-group">
                <label>From City</label>
                <input type="text" id="fFrom" list="cityList" placeholder="Type city name..." value="Delhi (NCR) (DEL)">
            </div>
            <div class="form-group">
                <label>To City</label>
                <input type="text" id="fTo" list="cityList" placeholder="Type city name..." value="Mumbai (BOM)">
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
                <input type="text" id="hCity" list="cityList" placeholder="Type city name..." value="Jamnagar (JGA)">
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

        <!-- ADMIN PANEL FORM -->
        <div id="adminSection" style="display:none;">
            <div class="admin-box">
                <h3 style="margin-top:0;">Admin Control Panel</h3>
                <div class="form-group">
                    <label>Set Agent Wallet Balance (₹)</label>
                    <input type="number" id="newWalletVal" value="${agentWallet}">
                </div>
                <button class="action-btn" style="background:#007bff;" onclick="updateWallet()">Update Wallet Balance</button>
                
                <hr style="margin: 15px 0;">
                
                <div class="form-group">
                    <label>Set Admin Markup Per Booking (₹)</label>
                    <input type="number" id="newMarkupVal" value="${adminMarkup}">
                </div>
                <button class="action-btn" style="background:#ffc107; color:black;" onclick="updateMarkup()">Update Markup</button>
            </div>
        </div>

        <div id="results" style="margin-top:20px;"></div>
    </div>

    <script>
        function switchTab(type) {
            document.getElementById('flightSection').style.display = 'none';
            document.getElementById('hotelSection').style.display = 'none';
            document.getElementById('adminSection').style.display = 'none';

            document.getElementById('flightTab').classList.remove('active');
            document.getElementById('hotelTab').classList.remove('active');
            document.getElementById('adminTab').classList.remove('active');

            if(type === 'flight') {
                document.getElementById('flightSection').style.display = 'block';
                document.getElementById('flightTab').classList.add('active');
            } else if(type === 'hotel') {
                document.getElementById('hotelSection').style.display = 'block';
                document.getElementById('hotelTab').classList.add('active');
            } else {
                document.getElementById('adminSection').style.display = 'block';
                document.getElementById('adminTab').classList.add('active');
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

        async function updateWallet() {
            let amount = document.getElementById('newWalletVal').value;
            let res = await fetch('/admin/update-wallet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: Number(amount) })
            });
            let data = await res.json();
            if(data.status === "SUCCESS") {
                document.getElementById('bal').innerText = data.newWallet;
                alert("Wallet Balance Updated to ₹" + data.newWallet);
            }
        }

        async function updateMarkup() {
            let markup = document.getElementById('newMarkupVal').value;
            let res = await fetch('/admin/update-markup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ markup: Number(markup) })
            });
            let data = await res.json();
            if(data.status === "SUCCESS") {
                alert("Markup updated to ₹" + data.newMarkup);
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
    const city = req.body.city || "Jamnagar";
    const hotels = [
        { name: "Grand Hotel " + city.split(' ')[0], rating: "5 Star", displayPrice: 8000 + adminMarkup },
        { name: "Comfort Stay " + city.split(' ')[0], rating: "4 Star", displayPrice: 4500 + adminMarkup }
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

app.post('/admin/update-wallet', (req, res) => {
    agentWallet = req.body.amount;
    res.json({ status: "SUCCESS", newWallet: agentWallet });
});

app.post('/admin/update-markup', (req, res) => {
    adminMarkup = req.body.markup;
    res.json({ status: "SUCCESS", newMarkup: adminMarkup });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`SERVER RUNNING ON PORT ${PORT}`));
