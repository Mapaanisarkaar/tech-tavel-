const express = require('express');
const app = express();

app.use(express.json());

let agentWallet = 45500;
let adminMarkup = 500;
let bookingsHistory = [];

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
        body { font-family: Arial, sans-serif; padding: 15px; background: #eef2f5; margin: 0; }
        .card { background: white; padding: 20px; border-radius: 10px; max-width: 550px; margin: auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        .wallet { background: #0056b3; color: white; border-radius: 8px; padding: 10px; margin-bottom: 15px; text-align: center; }
        .nav-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; margin-bottom: 15px; }
        .tab-btn { padding: 8px 2px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 11px; font-weight: bold; }
        .tab-btn.active { background: #007bff; }
        .form-group { margin-bottom: 10px; text-align: left; position: relative; }
        label { display: block; font-size: 12px; font-weight: bold; margin-bottom: 3px; }
        input, select { width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 5px; }
        button.action-btn { background: #28a745; color: white; font-weight: bold; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; width: 100%; margin-top: 10px; }
        .admin-box { background: #fff3cd; border: 1px solid #ffeeba; padding: 15px; border-radius: 8px; text-align: left; }
        .ticket-card { border: 1px dashed #007bff; padding: 10px; border-radius: 5px; background: #f8f9fa; margin-bottom: 10px; text-align: left; font-size: 13px; }
        @media print {
            body * { visibility: hidden; }
            #printableTicket, #printableTicket * { visibility: visible; }
            #printableTicket { position: absolute; left: 0; top: 0; width: 100%; }
        }
    </style>
</head>
<body>
    <div class="card">
        <h2>B2B Travel Portal</h2>
        <div class="wallet">
            Wallet Balance: <b>₹<span id="bal">${agentWallet}</span></b>
        </div>

        <div class="nav-grid">
            <button class="tab-btn active" id="flightTab" onclick="switchTab('flight')">Flights</button>
            <button class="tab-btn" id="hotelTab" onclick="switchTab('hotel')">Hotels</button>
            <button class="tab-btn" id="historyTab" style="background:#17a2b8;" onclick="switchTab('history')">PNR History</button>
            <button class="tab-btn" id="adminTab" style="background:#dc3545;" onclick="switchTab('admin')">Admin</button>
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

        <!-- HISTORY / PNR SECTION -->
        <div id="historySection" style="display:none;">
            <h3>Booking History & PNR Tickets</h3>
            <div id="historyList">Loading history...</div>
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

    <!-- Hidden Printable Area for Ticket PDF -->
    <div id="printableTicket" style="display:none;"></div>

    <script>
        function switchTab(type) {
            document.getElementById('flightSection').style.display = 'none';
            document.getElementById('hotelSection').style.display = 'none';
            document.getElementById('historySection').style.display = 'none';
            document.getElementById('adminSection').style.display = 'none';

            document.getElementById('flightTab').classList.remove('active');
            document.getElementById('hotelTab').classList.remove('active');
            document.getElementById('historyTab').classList.remove('active');
            document.getElementById('adminTab').classList.remove('active');

            if(type === 'flight') {
                document.getElementById('flightSection').style.display = 'block';
                document.getElementById('flightTab').classList.add('active');
            } else if(type === 'hotel') {
                document.getElementById('hotelSection').style.display = 'block';
                document.getElementById('hotelTab').classList.add('active');
            } else if(type === 'history') {
                document.getElementById('historySection').style.display = 'block';
                document.getElementById('historyTab').classList.add('active');
                loadHistory();
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
                <button style="width:auto; padding:5px 10px; margin-top:5px;" onclick="bookItem(\${f.displayPrice * pax}, 'Flight', '\${f.airline} \${f.flightNo} (\${from} to \${to})')">Book Flight</button>
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
                <button style="width:auto; padding:5px 10px; margin-top:5px; background:#17a2b8; color:white; border:none; border-radius:3px;" onclick="bookItem(\${h.displayPrice}, 'Hotel', '\${h.name} (\${city})')">Book Hotel</button>
                </div>\`;
            });
            document.getElementById('results').innerHTML = html;
        }

        async function bookItem(fare, type, title) {
            let res = await fetch('/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fare, type, title })
            });
            let data = await res.json();
            if(data.status === "SUCCESS") {
                alert(type + " Booked! PNR Generated: " + data.pnr);
                document.getElementById('bal').innerText = data.newWallet;
                document.getElementById('results').innerHTML = "<p style='color:green;'><b>" + type + " Booking Confirmed!<br>PNR: " + data.pnr + "<br>Wallet Balance: ₹" + data.newWallet + "</b></p>";
            } else {
                alert(data.msg);
            }
        }

        async function loadHistory() {
            let res = await fetch('/history');
            let data = await res.json();
            if(data.bookings.length === 0) {
                document.getElementById('historyList').innerHTML = "<p>No bookings found.</p>";
                return;
            }
            let html = '';
            data.bookings.forEach(b => {
                html += \`<div class="ticket-card">
                <b>Type:</b> \${b.type} | <b>PNR:</b> <span style="color:#007bff; font-weight:bold;">\${b.pnr}</span><br>
                <b>Item:</b> \${b.title}<br>
                <b>Amount Paid:</b> ₹\${b.fare} | <b>Date:</b> \${b.date}<br>
                <button style="margin-top:5px; padding:3px 8px; background:#28a745; color:white; border:none; border-radius:3px; cursor:pointer;" onclick="printTicket('\${b.pnr}', '\${b.type}', '\${b.title}', \${b.fare}, '\${b.date}')">Print / Save Ticket PDF</button>
                </div>\`;
            });
            document.getElementById('historyList').innerHTML = html;
        }

        function printTicket(pnr, type, title, fare, date) {
            let ticketHtml = \`
                <div style="padding: 20px; border: 2px solid #333; font-family: Arial; max-width:600px; margin:auto;">
                    <h2 style="text-align:center; color:#0056b3;">B2B TRAVEL E-TICKET RECEIPT</h2>
                    <hr>
                    <p><b>PNR / Booking Ref:</b> \${pnr}</p>
                    <p><b>Booking Type:</b> \${type}</p>
                    <p><b>Details:</b> \${title}</p>
                    <p><b>Total Amount Paid:</b> ₹\${fare}</p>
                    <p><b>Booking Date & Time:</b> \${date}</p>
                    <p><b>Status:</b> CONFIRMED</p>
                    <hr>
                    <p style="text-align:center; font-size:12px; color:#666;">Thank you for booking with B2B Travel Portal!</p>
                </div>
            \`;
            let printArea = document.getElementById('printableTicket');
            printArea.innerHTML = ticketHtml;
            printArea.style.display = 'block';
            window.print();
            printArea.style.display = 'none';
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
    const { fare, type, title } = req.body;
    if (agentWallet < fare) {
        return res.json({ status: "FAIL", msg: "Insufficient Balance in Wallet!" });
    }
    
    agentWallet -= fare;
    const pnr = "PNR" + Math.floor(100000 + Math.random() * 900000);
    const bookingDate = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    
    bookingsHistory.unshift({ pnr, type, title, fare, date: bookingDate });
    res.json({ status: "SUCCESS", newWallet: agentWallet, pnr });
});

app.get('/history', (req, res) => {
    res.json({ bookings: bookingsHistory });
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
