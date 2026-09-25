const express = require('express');
const Razorpay = require('razorpay');
const app = express();

app.use(express.json());

const razorpay = new Razorpay({
    key_id: 'rzp_test_Tg6Hmgg1bYKgGQ',
    key_secret: 'PkIVv6VqzJ0BEqLwpwDysOMR'
});

let bookingsHistory = [];

// Default Hotels Data + Dynamic Added Hotels
let dynamicHotels = [
    { name: "Grand Hyatt Jamnagar", city: "Jamnagar", rating: "5 Star", displayPrice: 8500 },
    { name: "Taj Residency Jamnagar", city: "Jamnagar", rating: "5 Star", displayPrice: 10000 }
];

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Tech Travel - Flight Booking, Cheap Flights, Hotels & Holiday Packages</title>
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; font-family: 'Poppins', sans-serif; margin: 0; padding: 0; }
        body { background: #eef2f5; color: #333; }

        .header { background: #ffffff; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.06); position: sticky; top: 0; z-index: 100; }
        .logo { font-size: 22px; font-weight: 900; color: #000; text-transform: lowercase; letter-spacing: -1px; }
        .logo span { background: #e53935; color: #fff; padding: 2px 6px; border-radius: 6px; font-weight: 800; margin: 0 2px; }
        .top-nav-right { display: flex; align-items: center; gap: 10px; font-size: 11px; font-weight: 600; }
        .btn-login { background: linear-gradient(90deg, #008cff, #0052cc); color: white; border: none; padding: 6px 14px; border-radius: 20px; font-weight: 700; cursor: pointer; }
        .btn-add-hotel { background: #28a745; color: white; border: none; padding: 6px 12px; border-radius: 20px; font-weight: 700; cursor: pointer; }

        .services-bar { background: #ffffff; padding: 12px 0; border-bottom: 1px solid #e2e8f0; margin-bottom: 20px; }
        .services-list { display: flex; justify-content: center; gap: 20px; list-style: none; }
        .service-item { display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; color: #4a5568; font-weight: 600; font-size: 11px; padding: 4px 8px; border-bottom: 3px solid transparent; }
        .service-item.active { color: #008cff; border-bottom-color: #008cff; font-weight: 700; }

        .container { max-width: 1100px; margin: 0 auto; padding: 0 15px; }

        .search-card { background: white; padding: 20px; border-radius: 16px; box-shadow: 0 4px 25px rgba(0,0,0,0.06); margin-bottom: 25px; border: 1px solid #e2e8f0; }
        .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin-bottom: 20px; }
        .form-group { background: #f8fafc; padding: 10px 14px; border-radius: 12px; border: 1px solid #e2e8f0; }
        .form-group label { display: block; font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 2px; }
        .form-group input, .form-group select { width: 100%; border: none; background: transparent; font-size: 15px; font-weight: 700; color: #0f172a; outline: none; }
        
        .search-btn { background: linear-gradient(90deg, #008cff, #0052cc); color: white; font-weight: 800; font-size: 16px; border: none; padding: 12px; border-radius: 35px; cursor: pointer; width: 100%; max-width: 220px; margin: 0 auto; display: block; text-transform: uppercase; }

        .hotel-card { background: white; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
        .book-btn { background: #28a745; color: white; border: none; padding: 8px 18px; border-radius: 20px; font-weight: 700; cursor: pointer; font-size: 13px; }

        .add-hotel-card { background: #ffffff; border: 2px dashed #008cff; padding: 20px; border-radius: 16px; margin-bottom: 20px; }
        .add-hotel-card h3 { margin-bottom: 15px; color: #008cff; font-size: 18px; }
    </style>
</head>
<body>

    <div class="header">
        <div class="logo">tech <span>my</span> trip</div>
        <div class="top-nav-right">
            <button class="btn-add-hotel" onclick="switchTab('addHotel')">+ Add Hotel</button>
            <button class="btn-login" onclick="switchTab('history')">My Bookings</button>
        </div>
    </div>

    <div class="services-bar">
        <ul class="services-list">
            <li class="service-item active" id="flightTab" onclick="switchTab('flight')">✈️ Flights</li>
            <li class="service-item" id="hotelTab" onclick="switchTab('hotel')">🏨 Hotels</li>
            <li class="service-item" id="addHotelTab" onclick="switchTab('addHotel')">➕ List Hotel</li>
            <li class="service-item" id="historyTab" onclick="switchTab('history')">📋 My Bookings</li>
        </ul>
    </div>

    <div class="container">
        <div class="search-card">
            
            <!-- Flight Search -->
            <div id="flightSection">
                <div class="form-grid">
                    <div class="form-group"><label>From</label><input type="text" id="fFrom" value="Delhi (DEL)"></div>
                    <div class="form-group"><label>To</label><input type="text" id="fTo" value="Mumbai (BOM)"></div>
                </div>
                <button class="search-btn" onclick="searchFlights()">SEARCH FLIGHTS</button>
            </div>

            <!-- Hotel Search -->
            <div id="hotelSection" style="display:none;">
                <div class="form-grid">
                    <div class="form-group"><label>City / Location</label><input type="text" id="hCity" value="Jamnagar"></div>
                </div>
                <button class="search-btn" style="background: linear-gradient(90deg, #ff7e00, #ff5100);" onclick="searchHotels()">SEARCH HOTELS</button>
            </div>

            <!-- Add Hotel Form (For Hotel Owners) -->
            <div id="addHotelSection" style="display:none;">
                <div class="add-hotel-card">
                    <h3>🏨 Partner Hotel Registration</h3>
                    <p style="font-size:12px; color:#64748b; margin-bottom:15px;">Apni hotel ki details yahan dalein taaki log aapki hotel book kar sakein:</p>
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Hotel Name</label>
                            <input type="text" id="newHotelName" placeholder="e.g. Royal Palace Hotel">
                        </div>
                        <div class="form-group">
                            <label>City Name</label>
                            <input type="text" id="newHotelCity" placeholder="e.g. Jamnagar">
                        </div>
                        <div class="form-group">
                            <label>Price Per Night (₹)</label>
                            <input type="number" id="newHotelPrice" placeholder="e.g. 2500">
                        </div>
                        <div class="form-group">
                            <label>Rating</label>
                            <select id="newHotelRating">
                                <option value="3 Star">3 Star</option>
                                <option value="4 Star">4 Star</option>
                                <option value="5 Star" selected>5 Star</option>
                            </select>
                        </div>
                    </div>
                    <button class="search-btn" style="background: #28a745;" onclick="submitNewHotel()">SUBMIT HOTEL</button>
                </div>
            </div>

            <!-- Booking History -->
            <div id="historySection" style="display:none;">
                <h3 style="margin-bottom:12px; color:#0f172a;">Your Bookings</h3>
                <div id="historyList">Loading...</div>
            </div>

            <div id="results" style="margin-top:20px;"></div>
        </div>
    </div>

    <script>
        function switchTab(type) {
            ['flight', 'hotel', 'addHotel', 'history'].forEach(t => {
                document.getElementById(t + 'Section').style.display = 'none';
                document.getElementById(t + 'Tab').classList.remove('active');
            });
            document.getElementById(type + 'Section').style.display = 'block';
            document.getElementById(type + 'Tab').classList.add('active');
            document.getElementById('results').innerHTML = '';
            if(type === 'history') loadHistory();
            if(type === 'hotel') searchHotels();
        }

        async function submitNewHotel() {
            let name = document.getElementById('newHotelName').value;
            let city = document.getElementById('newHotelCity').value;
            let displayPrice = document.getElementById('newHotelPrice').value;
            let rating = document.getElementById('newHotelRating').value;

            if(!name || !city || !displayPrice) {
                return alert("Kripya saari details sahi se bharein!");
            }

            let res = await fetch('/add-hotel', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ name, city, displayPrice, rating })
            });

            let data = await res.json();
            if(data.status === "SUCCESS") {
                alert("Mubarak ho! Aapki Hotel successfully add ho gayi hai.");
                document.getElementById('hCity').value = city;
                switchTab('hotel');
            }
        }

        async function searchFlights() {
            let res = await fetch('/search-flights', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({}) });
            let data = await res.json();
            let html = '';
            data.flights.forEach(f => {
                html += `<div class="hotel-card">
                    <div><b>${f.airline}</b> (${f.flightNo})</div>
                    <div>₹${f.displayPrice} <button class="book-btn" onclick="payDirect(${f.displayPrice}, 'Flight', '${f.airline}')">BOOK NOW</button></div>
                </div>`;
            });
            document.getElementById('results').innerHTML = html;
        }

        async function searchHotels() {
            let city = document.getElementById('hCity').value;
            let res = await fetch('/search-hotels', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ city }) });
            let data = await res.json();
            let html = '';
            if(data.hotels.length === 0) {
                html = "<p style='color:#64748b; text-align:center;'>Is city mein abhi koi hotel add nahi hai. Niche '+ List Hotel' par click karke add karein.</p>";
            } else {
                data.hotels.forEach(h => {
                    html += `<div class="hotel-card">
                        <div>
                            <b style="font-size:15px;">${h.name}</b>
                            <div style="color:#22c55e; font-size:11px; font-weight:700;">★ ${h.rating} \vert{}${h.city}</div>
                        </div>
                        <div>
                            <span style="font-size:18px; font-weight:800; color:#0f172a; margin-right:10px;">₹${h.displayPrice}</span>
                            <button class="book-btn" onclick="payDirect(${h.displayPrice}, 'Hotel', '${h.name}')">BOOK NOW</button>
                        </div>
                    </div>`;
                });
            }
            document.getElementById('results').innerHTML = html;
        }

        async function payDirect(amount, type, title) {
            let res = await fetch('/create-order', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ amount: Number(amount) })
            });
            let orderData = await res.json();

            var options = {
                "key": "rzp_test_Tg6Hmgg1bYKgGQ", 
                "amount": orderData.amount,
                "currency": "INR",
                "name": "Tech Travel",
                "description": type + " Booking - " + title,
                "order_id": orderData.id,
                "handler": async function (response){
                    let verifyRes = await fetch('/verify-booking', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ amount, type, title })
                    });
                    let verifyData = await verifyRes.json();
                    if(verifyData.status === "SUCCESS") {
                        alert("Booking Successful! PNR: " + verifyData.pnr);
                    }
                },
                "theme": { "color": "#008cff" }
            };
            var rzp1 = new Razorpay(options);
            rzp1.open();
        }

        async function loadHistory() {
            let res = await fetch('/history');
            let data = await res.json();
            if(data.bookings.length === 0) {
                document.getElementById('historyList').innerHTML = "<p style='color:#64748b;'>No bookings made yet.</p>";
                return;
            }
            let html = '';
            data.bookings.forEach(b => {
                html += `<div style="padding:12px; border:1px solid #e2e8f0; margin-bottom:8px; border-radius:10px; background:#f8fafc;">
                    <b>${b.pnr}</b> \vert{}${b.type} - ${b.title} \vert{} <b>₹${b.fare}</b>
                </div>`;
            });
            document.getElementById('historyList').innerHTML = html;
        }
    </script>
</body>
</html>
  `);
});

app.post('/search-flights', (req, res) => {
    res.json({ flights: [{ flightNo: "6E-204", airline: "IndiGo", displayPrice: 4500 }] });
});

app.post('/search-hotels', (req, res) => {
    const city = (req.body.city || "").toLowerCase().trim();
    if (!city) {
        return res.json({ hotels: dynamicHotels });
    }
    const filtered = dynamicHotels.filter(h => h.city.toLowerCase().includes(city));
    res.json({ hotels: filtered.length > 0 ? filtered : dynamicHotels });
});

app.post('/add-hotel', (req, res) => {
    const { name, city, displayPrice, rating } = req.body;
    dynamicHotels.unshift({
        name,
        city,
        displayPrice: Number(displayPrice),
        rating: rating || "4 Star"
    });
    res.json({ status: "SUCCESS" });
});

app.post('/create-order', async (req, res) => {
    const options = { amount: req.body.amount * 100, currency: "INR", receipt: "rcpt_" + Date.now() };
    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/verify-booking', (req, res) => {
    const { amount, type, title } = req.body;
    const pnr = "TT" + Math.floor(100000 + Math.random() * 900000);
    bookingsHistory.unshift({ pnr, type, title, fare: amount, date: new Date().toLocaleString() });
    res.json({ status: "SUCCESS", pnr });
});

app.get('/history', (req, res) => res.json({ bookings: bookingsHistory }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
