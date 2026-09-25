const express = require('express');
const Razorpay = require('razorpay');
const app = express();

app.use(express.json());

const razorpay = new Razorpay({
    key_id: 'rzp_test_Tg6Hmgg1bYKgGQ',
    key_secret: 'PkIVv6VqzJ0BEqLwpwDysOMR'
});

let agentWallet = 45500;
let adminMarkup = 500;
let bookingsHistory = [];

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <title>Tech Travel - Best B2B Travel Portal | Flights & Hotels Booking</title>
    <meta name="description" content="Tech Travel is the best B2B travel agency portal for instant flight and hotel bookings with exclusive agent markup.">
    <meta name="keywords" content="Tech Travel, Tech Travel B2B, Tech Travel Portal, Flight Booking, Hotel Booking, Travel Agency B2B">
    <meta name="author" content="Tech Travel">
    <meta name="robots" content="index, follow">
    
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; font-family: 'Poppins', sans-serif; }
        body { background: #e6eded; margin: 0; padding: 0; }
        .mmt-header { background: linear-gradient(to right, #051329, #102d5e); color: white; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 22px; font-weight: 800; color: #ff6d00; text-transform: uppercase; }
        .logo span { color: #ffffff; }
        .wallet-badge { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); padding: 8px 18px; border-radius: 20px; font-size: 14px; font-weight: 600; }
        .wallet-amount { color: #00ff87; font-size: 16px; font-weight: 700; }
        .nav-tabs { display: flex; justify-content: center; gap: 15px; background: #ffffff; padding: 10px 0; border-bottom: 2px solid #e0e0e0; }
        .nav-btn { background: transparent; border: none; padding: 10px 25px; border-radius: 25px; font-weight: 600; font-size: 14px; cursor: pointer; color: #555; }
        .nav-btn.active { background: linear-gradient(90deg, #ec5b24, #ff7e00); color: white; }
        .container { max-width: 900px; margin: 25px auto; padding: 0 15px; }
        .card { background: white; padding: 25px; border-radius: 16px; box-shadow: 0 8px 20px rgba(0,0,0,0.06); margin-bottom: 20px; }
        .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px; }
        .form-group { background: #f4f6f8; padding: 10px 14px; border-radius: 10px; border: 1px solid #e2e8f0; }
        .form-group label { display: block; font-size: 11px; text-transform: uppercase; color: #7a8b9e; font-weight: 700; }
        .form-group input, .form-group select { width: 100%; border: none; background: transparent; font-size: 14px; font-weight: 600; color: #2d3748; outline: none; }
        .search-btn { background: linear-gradient(90deg, #2276e3, #0052cc); color: white; font-weight: 700; font-size: 16px; border: none; padding: 14px; border-radius: 30px; cursor: pointer; width: 100%; }
        .flight-card, .hotel-card { background: white; border: 1px solid #e0e6ed; border-radius: 12px; padding: 18px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; }
        .book-btn { background: #ff6d00; color: white; border: none; padding: 8px 20px; border-radius: 20px; font-weight: 700; cursor: pointer; }
        
        /* Footer Custom Photo Styling */
        .footer-banner { text-align: center; margin-top: 25px; padding: 10px; }
        .footer-banner img { max-width: 100%; max-height: 450px; border-radius: 16px; box-shadow: 0 8px 25px rgba(0,0,0,0.15); object-fit: cover; }
    </style>
</head>
<body>

    <div class="mmt-header">
        <div class="logo">Tech <span>Travel</span> <small style="font-size:10px; color:#ff6d00;">B2B</small></div>
        <div class="wallet-badge">Wallet Balance: <span class="wallet-amount">₹<span id="bal">${agentWallet}</span></span></div>
    </div>

    <div class="nav-tabs">
        <button class="nav-btn active" id="flightTab" onclick="switchTab('flight')">✈️ Flights</button>
        <button class="nav-btn" id="hotelTab" onclick="switchTab('hotel')">🏨 Hotels</button>
        <button class="nav-btn" id="payTab" onclick="switchTab('pay')">💳 Add Money</button>
        <button class="nav-btn" id="historyTab" onclick="switchTab('history')">📋 History</button>
    </div>

    <div class="container">
        <div class="card">
            <!-- Flight Section -->
            <div id="flightSection">
                <div class="form-grid">
                    <div class="form-group">
                        <label>From</label>
                        <input type="text" id="fFrom" value="Delhi (DEL)">
                    </div>
                    <div class="form-group">
                        <label>To</label>
                        <input type="text" id="fTo" value="Mumbai (BOM)">
                    </div>
                </div>
                <button class="search-btn" onclick="searchFlights()">SEARCH FLIGHTS</button>
            </div>

            <!-- Hotel Section -->
            <div id="hotelSection" style="display:none;">
                <div class="form-grid">
                    <div class="form-group">
                        <label>City</label>
                        <input type="text" id="hCity" value="Jamnagar">
                    </div>
                </div>
                <button class="search-btn" style="background: #ff7e00;" onclick="searchHotels()">SEARCH HOTELS</button>
            </div>

            <!-- Razorpay Payment Section -->
            <div id="paySection" style="display:none;">
                <h3 style="margin-top:0;">Add Money to Wallet via Razorpay</h3>
                <div class="form-group" style="margin-bottom: 15px;">
                    <label>Amount (₹)</label>
                    <input type="number" id="addAmount" placeholder="Enter amount (e.g. 500)">
                </div>
                <button class="search-btn" style="background: #28a745;" onclick="payWithRazorpay()">PAY NOW</button>
            </div>

            <!-- History Section -->
            <div id="historySection" style="display:none;">
                <h3>Booking History</h3>
                <div id="historyList">Loading...</div>
            </div>

            <div id="results" style="margin-top:20px;"></div>
        </div>

        <!-- Google Drive Photo at the bottom -->
        <div class="footer-banner">
            <img src="https://lh3.googleusercontent.com/d/1xkGxH3nmw6USTqiRm13b9zGXVaCTADBZ" alt="Tech Travel Owner/Banner" id="bottomBanner">
        </div>
    </div>

    <script>
        function switchTab(type) {
            ['flight', 'hotel', 'pay', 'history'].forEach(t => {
                document.getElementById(t + 'Section').style.display = 'none';
                document.getElementById(t + 'Tab').classList.remove('active');
            });
            document.getElementById(type + 'Section').style.display = 'block';
            document.getElementById(type + 'Tab').classList.add('active');
            document.getElementById('results').innerHTML = '';
            if(type === 'history') loadHistory();
        }

        async function searchFlights() {
            let res = await fetch('/search-flights', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({}) });
            let data = await res.json();
            let html = '';
            data.flights.forEach(f => {
                html += \`<div class="flight-card">
                    <div><b>\${f.airline}</b> (\${f.flightNo}) - \${f.time}</div>
                    <div>₹\${f.displayPrice} <button class="book-btn" onclick="bookItem(\${f.displayPrice}, 'Flight', '\${f.airline}')">Book</button></div>
                </div>\`;
            });
            document.getElementById('results').innerHTML = html;
        }

        async function searchHotels() {
            let city = document.getElementById('hCity').value;
            let res = await fetch('/search-hotels', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ city }) });
            let data = await res.json();
            let html = '';
            data.hotels.forEach(h => {
                html += \`<div class="hotel-card">
                    <div><b>\${h.name}</b> (\${h.rating})</div>
                    <div>₹\${h.displayPrice} <button class="book-btn" style="background:#28a745;" onclick="bookItem(\${h.displayPrice}, 'Hotel', '\${h.name}')">Book</button></div>
                </div>\`;
            });
            document.getElementById('results').innerHTML = html;
        }

        async function bookItem(fare, type, title) {
            let res = await fetch('/book', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ fare, type, title }) });
            let data = await res.json();
            if(data.status === "SUCCESS") {
                alert("Booked! PNR: " + data.pnr);
                document.getElementById('bal').innerText = data.newWallet;
            } else {
                alert(data.msg);
            }
        }

        async function payWithRazorpay() {
            let amount = document.getElementById('addAmount').value;
            if(!amount || amount <= 0) return alert("Please enter a valid amount");

            let res = await fetch('/create-order', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ amount: Number(amount) })
            });
            let orderData = await res.json();

            if(orderData.error) {
                return alert("Payment Error: " + orderData.error);
            }

            var options = {
                "key": "rzp_test_Tg6Hmgg1bYKgGQ", 
                "amount": orderData.amount,
                "currency": "INR",
                "name": "Tech Travel",
                "description": "Add Wallet Balance",
                "order_id": orderData.id,
                "handler": async function (response){
                    let verifyRes = await fetch('/verify-payment', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ amount: Number(amount) })
                    });
                    let verifyData = await verifyRes.json();
                    if(verifyData.status === "SUCCESS") {
                        alert("Payment Successful! Wallet Updated.");
                        document.getElementById('bal').innerText = verifyData.newWallet;
                    }
                },
                "theme": { "color": "#0052cc" }
            };
            var rzp1 = new Razorpay(options);
            rzp1.open();
        }

        async function loadHistory() {
            let res = await fetch('/history');
            let data = await res.json();
            if(data.bookings.length === 0) {
                document.getElementById('historyList').innerHTML = "<p>No bookings yet.</p>";
                return;
            }
            let html = '';
            data.bookings.forEach(b => {
                html += \`<div style="padding:10px; border:1px solid #ccc; margin-bottom:10px; border-radius:8px;">
                    <b>\${b.pnr}</b> | \${b.type} - \${b.title} | ₹\${b.fare}
                </div>\`;
            });
            document.getElementById('historyList').innerHTML = html;
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
        { name: "Grand Hyatt " + city, rating: "5 Star", displayPrice: 8000 + adminMarkup },
        { name: "Taj Residency " + city, rating: "5 Star", displayPrice: 9500 + adminMarkup }
    ];
    res.json({ hotels });
});

app.post('/book', (req, res) => {
    const { fare, type, title } = req.body;
    if (agentWallet < fare) return res.json({ status: "FAIL", msg: "Insufficient Wallet Balance!" });
    agentWallet -= fare;
    const pnr = "TT" + Math.floor(100000 + Math.random() * 900000);
    const bookingDate = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    bookingsHistory.unshift({ pnr, type, title, fare, date: bookingDate });
    res.json({ status: "SUCCESS", newWallet: agentWallet, pnr });
});

app.post('/create-order', async (req, res) => {
    const options = {
        amount: req.body.amount * 100,
        currency: "INR",
        receipt: "rcpt_" + Date.now()
    };
    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/verify-payment', (req, res) => {
    const { amount } = req.body;
    agentWallet += amount;
    res.json({ status: "SUCCESS", newWallet: agentWallet });
});

app.get('/history', (req, res) => res.json({ bookings: bookingsHistory }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
