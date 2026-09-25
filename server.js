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
    
    <title>Tech Travel - Flight & Hotel Booking Portal</title>
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; font-family: 'Poppins', sans-serif; margin: 0; padding: 0; }
        body { background: #eef2f5; color: #333; }

        /* Top Header */
        .header { background: #ffffff; padding: 12px 50px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.08); position: sticky; top: 0; z-index: 100; }
        .logo { font-size: 24px; font-weight: 800; color: #000; text-transform: uppercase; }
        .logo span { color: #d63031; }
        .wallet-badge { background: #f8f9fa; border: 1px solid #e2e8f0; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; color: #4a5568; }
        .wallet-amount { color: #27ae60; font-weight: 800; font-size: 15px; }

        /* MMT Navigation Icons Bar */
        .services-bar { background: #ffffff; padding: 15px 0; border-bottom: 1px solid #e0e0e0; margin-bottom: 25px; }
        .services-list { display: flex; justify-content: center; gap: 30px; list-style: none; }
        .service-item { display: flex; flex-direction: column; align-items: center; gap: 5px; cursor: pointer; color: #4a5568; font-weight: 600; font-size: 13px; padding: 5px 15px; border-bottom: 3px solid transparent; }
        .service-item.active { color: #008cff; border-bottom-color: #008cff; }
        .service-item span.icon { font-size: 22px; }

        .container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }

        /* Search Card */
        .card { background: white; padding: 25px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); margin-bottom: 30px; }
        .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px; }
        .form-group { background: #f4f6f8; padding: 10px 14px; border-radius: 10px; border: 1px solid #e2e8f0; }
        .form-group label { display: block; font-size: 11px; text-transform: uppercase; color: #7a8b9e; font-weight: 700; }
        .form-group input { width: 100%; border: none; background: transparent; font-size: 14px; font-weight: 600; color: #2d3748; outline: none; }
        .search-btn { background: linear-gradient(90deg, #008cff, #0052cc); color: white; font-weight: 700; font-size: 16px; border: none; padding: 12px; border-radius: 30px; cursor: pointer; width: 100%; }

        /* Banner Box */
        .promo-banner { background: linear-gradient(90deg, #102a43, #243b53); color: white; padding: 18px 25px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 35px; }
        .promo-banner button { background: #008cff; color: white; border: none; padding: 8px 20px; border-radius: 20px; font-weight: 700; cursor: pointer; }

        /* OFFERS SECTION (Horizontal Scrollable Carousel) */
        .offers-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .offers-title { font-size: 22px; font-weight: 800; color: #1e293b; }
        .offer-tabs { display: flex; gap: 15px; list-style: none; font-size: 13px; font-weight: 600; color: #64748b; }
        .offer-tab { cursor: pointer; padding-bottom: 4px; }
        .offer-tab.active { color: #008cff; border-bottom: 2px solid #008cff; }

        .offers-scroll-container { display: flex; gap: 20px; overflow-x: auto; padding-bottom: 15px; scroll-behavior: smooth; }
        .offers-scroll-container::-webkit-scrollbar { height: 6px; }
        .offers-scroll-container::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

        .offer-card { flex: 0 0 320px; background: white; border-radius: 14px; padding: 15px; border: 1px solid #e2e8f0; box-shadow: 0 2px 10px rgba(0,0,0,0.04); display: flex; gap: 12px; align-items: center; }
        .offer-img { width: 85px; height: 85px; border-radius: 10px; object-fit: cover; }
        .offer-content { flex: 1; }
        .offer-tag { font-size: 10px; color: #64748b; font-weight: 700; text-transform: uppercase; }
        .offer-heading { font-size: 13px; font-weight: 700; color: #0f172a; margin: 4px 0; line-height: 1.3; }
        .offer-desc { font-size: 11px; color: #64748b; margin-bottom: 8px; }
        .offer-btn { font-size: 11px; font-weight: 800; color: #008cff; text-decoration: none; cursor: pointer; }

        /* Booking Cards */
        .flight-card, .hotel-card { background: white; border: 1px solid #e0e6ed; border-radius: 12px; padding: 18px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; }
        .book-btn { background: #ff6d00; color: white; border: none; padding: 8px 20px; border-radius: 20px; font-weight: 700; cursor: pointer; }

        /* Footer Photo */
        .footer-banner { text-align: center; margin: 40px 0; }
        .footer-banner img { max-width: 100%; max-height: 400px; border-radius: 16px; box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
    </style>
</head>
<body>

    <!-- Header -->
    <div class="header">
        <div class="logo">Tech <span>Travel</span></div>
        <div class="wallet-badge">Wallet Balance: <span class="wallet-amount">₹<span id="bal">${agentWallet}</span></span></div>
    </div>

    <!-- MMT Navigation Bar -->
    <div class="services-bar">
        <ul class="services-list">
            <li class="service-item active" id="flightTab" onclick="switchTab('flight')"><span class="icon">✈️</span> Flights</li>
            <li class="service-item" id="hotelTab" onclick="switchTab('hotel')"><span class="icon">🏨</span> Hotels</li>
            <li class="service-item" id="payTab" onclick="switchTab('pay')"><span class="icon">💳</span> Add Money</li>
            <li class="service-item" id="historyTab" onclick="switchTab('history')"><span class="icon">📋</span> History</li>
        </ul>
    </div>

    <div class="container">
        
        <!-- Search Form Section -->
        <div class="card">
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

            <div id="hotelSection" style="display:none;">
                <div class="form-grid">
                    <div class="form-group">
                        <label>City / Location</label>
                        <input type="text" id="hCity" value="Jamnagar">
                    </div>
                </div>
                <button class="search-btn" style="background: #ff7e00;" onclick="searchHotels()">SEARCH HOTELS</button>
            </div>

            <div id="paySection" style="display:none;">
                <h3 style="margin-bottom:15px;">Add Money via Razorpay</h3>
                <div class="form-group" style="margin-bottom: 15px;">
                    <label>Amount (₹)</label>
                    <input type="number" id="addAmount" placeholder="Enter amount (e.g. 500)">
                </div>
                <button class="search-btn" style="background: #28a745;" onclick="payWithRazorpay()">PAY NOW</button>
            </div>

            <div id="historySection" style="display:none;">
                <h3>Booking History</h3>
                <div id="historyList">Loading...</div>
            </div>

            <div id="results" style="margin-top:20px;"></div>
        </div>

        <!-- MMT Style Business Stay Promo Banner -->
        <div class="promo-banner">
            <div>
                <h3 style="font-size:16px;">Work Better with Seamless Business Stays</h3>
                <p style="font-size:12px; color:#cbd5e1;">Get exclusive Agent Markups & Corporate Discounts at Hyatt Hotels.</p>
            </div>
            <button onclick="switchTab('hotel')">BOOK NOW</button>
        </div>

        <!-- OFFERS HORIZONTAL CAROUSEL (MakeMyTrip Style) -->
        <div class="offers-header">
            <div class="offers-title">Offers</div>
            <ul class="offer-tabs">
                <li class="offer-tab active">All Offers</li>
                <li class="offer-tab">Flights</li>
                <li class="offer-tab">Hotels</li>
                <li class="offer-tab">Bank Offers</li>
            </ul>
        </div>

        <div class="offers-scroll-container">
            <!-- Offer 1 -->
            <div class="offer-card">
                <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&auto=format&fit=crop" class="offer-img" alt="Hotel Offer">
                <div class="offer-content">
                    <div class="offer-tag">T&C's Apply</div>
                    <div class="offer-heading">Grab FLAT 40% OFF* on Hotels</div>
                    <div class="offer-desc">Code: TECHESCAPE</div>
                    <span class="offer-btn" onclick="switchTab('hotel')">BOOK NOW &rarr;</span>
                </div>
            </div>

            <!-- Offer 2 -->
            <div class="offer-card">
                <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=300&auto=format&fit=crop" class="offer-img" alt="Flight Offer">
                <div class="offer-content">
                    <div class="offer-tag">Domestic Flights</div>
                    <div class="offer-heading">Amazing Deal: Up to 15% OFF*</div>
                    <div class="offer-desc">Valid on SBI & HDFC Cards</div>
                    <span class="offer-btn" onclick="switchTab('flight')">VIEW DETAILS &rarr;</span>
                </div>
            </div>

            <!-- Offer 3 -->
            <div class="offer-card">
                <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=300&auto=format&fit=crop" class="offer-img" alt="Luxury Hotel">
                <div class="offer-content">
                    <div class="offer-tag">Luxury Stays</div>
                    <div class="offer-heading">LIVE NOW: Sale on 5-Star Hotels</div>
                    <div class="offer-desc">Free Breakfast & Room Upgrade</div>
                    <span class="offer-btn" onclick="switchTab('hotel')">BOOK NOW &rarr;</span>
                </div>
            </div>

            <!-- Offer 4 -->
            <div class="offer-card">
                <img src="https://images.unsplash.com/photo-1512353087810-25dfcd100962?w=300&auto=format&fit=crop" class="offer-img" alt="International Flight">
                <div class="offer-content">
                    <div class="offer-tag">Air India Sale</div>
                    <div class="offer-heading">Up to 10% OFF Premium Economy</div>
                    <div class="offer-desc">On International Flights</div>
                    <span class="offer-btn" onclick="switchTab('flight')">VIEW DETAILS &rarr;</span>
                </div>
            </div>
        </div>

        <!-- Footer Photo -->
        <div class="footer-banner">
            <img src="https://lh3.googleusercontent.com/d/1xkGxH3nmw6USTqiRm13b9zGXVaCTADBZ" alt="Owner Photo">
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
                "theme": { "color": "#008cff" }
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
