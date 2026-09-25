const express = require('express');
const Razorpay = require('razorpay');
const app = express();

app.use(express.json());

const razorpay = new Razorpay({
    key_id: 'rzp_test_Tg6Hmgg1bYKgGQ',
    key_secret: 'PkIVv6VqzJ0BEqLwpwDysOMR'
});

let bookingsHistory = [];

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

        /* Top Header */
        .header { background: #ffffff; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.06); position: sticky; top: 0; z-index: 100; }
        .logo { font-size: 22px; font-weight: 900; color: #000; text-transform: lowercase; letter-spacing: -1px; }
        .logo span { background: #e53935; color: #fff; padding: 2px 6px; border-radius: 6px; font-weight: 800; margin: 0 2px; }
        .top-nav-right { display: flex; align-items: center; gap: 12px; font-size: 11px; font-weight: 600; color: #4a5568; }
        .btn-login { background: linear-gradient(90deg, #008cff, #0052cc); color: white; border: none; padding: 6px 14px; border-radius: 20px; font-weight: 700; cursor: pointer; }

        /* Services Navigation */
        .services-bar { background: #ffffff; padding: 12px 0; border-bottom: 1px solid #e2e8f0; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.02); }
        .services-list { display: flex; justify-content: center; gap: 25px; list-style: none; }
        .service-item { display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; color: #4a5568; font-weight: 600; font-size: 11px; padding: 4px 8px; border-bottom: 3px solid transparent; transition: 0.2s; }
        .service-item.active { color: #008cff; border-bottom-color: #008cff; font-weight: 700; }
        .service-item span.icon { font-size: 20px; }

        .container { max-width: 1100px; margin: 0 auto; padding: 0 15px; }

        /* Search Form Card */
        .search-card { background: white; padding: 20px; border-radius: 16px; box-shadow: 0 4px 25px rgba(0,0,0,0.06); margin-bottom: 25px; border: 1px solid #e2e8f0; }
        .trip-type { display: flex; gap: 15px; font-size: 12px; font-weight: 600; margin-bottom: 15px; color: #4a5568; }
        .trip-type label { display: flex; align-items: center; gap: 4px; cursor: pointer; }
        
        .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin-bottom: 20px; }
        .form-group { background: #f8fafc; padding: 10px 14px; border-radius: 12px; border: 1px solid #e2e8f0; }
        .form-group label { display: block; font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 2px; }
        .form-group input { width: 100%; border: none; background: transparent; font-size: 15px; font-weight: 700; color: #0f172a; outline: none; }
        
        .search-btn { background: linear-gradient(90deg, #008cff, #0052cc); color: white; font-weight: 800; font-size: 16px; border: none; padding: 12px; border-radius: 35px; cursor: pointer; width: 100%; max-width: 220px; margin: 0 auto; display: block; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(0,140,255,0.3); }

        /* Promo Banner */
        .promo-banner { background: linear-gradient(90deg, #0f172a, #1e293b); color: white; padding: 18px 20px; border-radius: 14px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .promo-banner h3 { font-size: 15px; font-weight: 700; margin-bottom: 2px; }
        .promo-banner p { font-size: 11px; color: #94a3b8; }
        .promo-btn { background: #008cff; color: white; border: none; padding: 8px 18px; border-radius: 25px; font-weight: 700; cursor: pointer; font-size: 12px; white-space: nowrap; }

        /* Carousel */
        .offers-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
        .offers-title { font-size: 20px; font-weight: 800; color: #0f172a; }
        .offer-tabs { display: flex; gap: 12px; list-style: none; font-size: 12px; font-weight: 600; color: #64748b; }
        .offer-tab { cursor: pointer; padding-bottom: 2px; }
        .offer-tab.active { color: #008cff; border-bottom: 2px solid #008cff; font-weight: 700; }

        .offers-scroll-container { display: flex; gap: 15px; overflow-x: auto; padding-bottom: 12px; scroll-behavior: smooth; }
        .offer-card { flex: 0 0 290px; background: white; border-radius: 14px; padding: 14px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.03); display: flex; gap: 12px; align-items: center; }
        .offer-img { width: 80px; height: 80px; border-radius: 10px; object-fit: cover; }
        .offer-content { flex: 1; }
        .offer-tag { font-size: 9px; color: #64748b; font-weight: 700; text-transform: uppercase; }
        .offer-heading { font-size: 13px; font-weight: 700; color: #0f172a; margin: 2px 0; line-height: 1.2; }
        .offer-desc { font-size: 10px; color: #64748b; margin-bottom: 8px; }
        .offer-btn { font-size: 11px; font-weight: 800; color: #008cff; cursor: pointer; }

        /* Booking Cards */
        .flight-card, .hotel-card { background: white; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
        .book-btn { background: #ff6d00; color: white; border: none; padding: 8px 18px; border-radius: 20px; font-weight: 700; cursor: pointer; font-size: 13px; }

        /* Footer Banner Container */
        .footer-banner { text-align: center; margin: 30px 0 20px; padding: 15px; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
        .footer-banner img { width: 100%; max-width: 600px; height: auto; border-radius: 12px; display: block; margin: 0 auto; }
        .footer-banner .fallback-card { padding: 25px 15px; background: linear-gradient(135deg, #0f172a, #1e293b); color: #ffffff; border-radius: 12px; }
    </style>
</head>
<body>

    <div class="header">
        <div class="logo">tech <span>my</span> trip</div>
        <div class="top-nav-right">
            <div><span>🌐</span> IN | ENG</div>
            <button class="btn-login" onclick="switchTab('history')">My Bookings</button>
        </div>
    </div>

    <div class="services-bar">
        <ul class="services-list">
            <li class="service-item active" id="flightTab" onclick="switchTab('flight')"><span class="icon">✈️</span> Flights</li>
            <li class="service-item" id="hotelTab" onclick="switchTab('hotel')"><span class="icon">🏨</span> Hotels</li>
            <li class="service-item" id="historyTab" onclick="switchTab('history')"><span class="icon">📋</span> My Bookings</li>
        </ul>
    </div>

    <div class="container">
        <div class="search-card">
            <div class="trip-type">
                <label><input type="radio" name="trip" checked> One Way</label>
                <label><input type="radio" name="trip"> Round Trip</label>
            </div>

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
                    <div class="form-group">
                        <label>Departure</label>
                        <input type="text" value="Today">
                    </div>
                </div>
                <button class="search-btn" onclick="searchFlights()">SEARCH</button>
            </div>

            <div id="hotelSection" style="display:none;">
                <div class="form-grid">
                    <div class="form-group">
                        <label>City / Location</label>
                        <input type="text" id="hCity" value="Jamnagar">
                    </div>
                    <div class="form-group">
                        <label>Check-In</label>
                        <input type="text" value="Today">
                    </div>
                </div>
                <button class="search-btn" style="background: linear-gradient(90deg, #ff7e00, #ff5100);" onclick="searchHotels()">SEARCH</button>
            </div>

            <div id="historySection" style="display:none;">
                <h3 style="margin-bottom:12px; color:#0f172a;">Your Recent Bookings</h3>
                <div id="historyList">Loading...</div>
            </div>

            <div id="results" style="margin-top:20px;"></div>
        </div>

        <div class="promo-banner">
            <div>
                <h3>Seamless Business Stays</h3>
                <p>Exclusive corporate discounts on Tech Travel.</p>
            </div>
            <button class="promo-btn" onclick="switchTab('hotel')">BOOK NOW</button>
        </div>

        <div class="offers-header">
            <div class="offers-title">Offers</div>
            <ul class="offer-tabs">
                <li class="offer-tab active">All Offers</li>
                <li class="offer-tab">Flights</li>
                <li class="offer-tab">Hotels</li>
            </ul>
        </div>

        <div class="offers-scroll-container">
            <div class="offer-card">
                <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&auto=format&fit=crop" class="offer-img" alt="Hotel Offer">
                <div class="offer-content">
                    <div class="offer-tag">T&C's Apply</div>
                    <div class="offer-heading">Long Weekend Deals</div>
                    <div class="offer-desc">Up to 40% OFF*. Code: MMTESCAPE</div>
                    <span class="offer-btn" onclick="switchTab('hotel')">BOOK NOW &rarr;</span>
                </div>
            </div>

            <div class="offer-card">
                <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200&auto=format&fit=crop" class="offer-img" alt="Flight Offer">
                <div class="offer-content">
                    <div class="offer-tag">Bank Offer</div>
                    <div class="offer-heading">FLAT 10% OFF*</div>
                    <div class="offer-desc">On Flights & Hotels.</div>
                    <span class="offer-btn" onclick="switchTab('flight')">VIEW DETAILS &rarr;</span>
                </div>
            </div>
        </div>

        <!-- Working Footer Image Banner with Clean Fallback -->
        <div class="footer-banner">
            <div id="bannerContainer">
                <img src="https://i.ibb.co/6P8fC7n/travel-banner.jpg" 
                     onerror="showFallbackBanner()" 
                     alt="Tech Travel Banner">
            </div>
        </div>

    </div>

    <script>
        function showFallbackBanner() {
            document.getElementById('bannerContainer').innerHTML = `
                <div class="fallback-card">
                    <h2 style="font-size: 18px; margin-bottom: 5px; color: #008cff;">Tech Travel Official</h2>
                    <p style="font-size: 12px; color: #cbd5e1;">Your Trusted Partner for Flights, Hotels & Holiday Packages</p>
                </div>
            `;
        }

        function switchTab(type) {
            ['flight', 'hotel', 'history'].forEach(t => {
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
                    <div>
                        <b style="font-size:15px;">\${f.airline}</b> (\${f.flightNo})
                        <div style="color:#64748b; font-size:11px;">Departure: \${f.time}</div>
                    </div>
                    <div>
                        <span style="font-size:18px; font-weight:800; color:#0f172a; margin-right:10px;">₹\${f.displayPrice}</span>
                        <button class="book-btn" onclick="payDirect(\${f.displayPrice}, 'Flight', '\${f.airline}')">BOOK NOW</button>
                    </div>
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
                    <div>
                        <b style="font-size:15px;">\${h.name}</b>
                        <div style="color:#22c55e; font-size:11px; font-weight:700;">★ \${h.rating} Rating</div>
                    </div>
                    <div>
                        <span style="font-size:18px; font-weight:800; color:#0f172a; margin-right:10px;">₹\${h.displayPrice}</span>
                        <button class="book-btn" style="background:#28a745;" onclick="payDirect(\${h.displayPrice}, 'Hotel', '\${h.name}')">BOOK NOW</button>
                    </div>
                </div>\`;
            });
            document.getElementById('results').innerHTML = html;
        }

        async function payDirect(amount, type, title) {
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
                html += \`<div style="padding:12px; border:1px solid #e2e8f0; margin-bottom:8px; border-radius:10px; background:#f8fafc;">
                    <b>\${b.pnr}</b> | \${b.type} - \${b.title} | <b>₹\${b.fare}</b> <small style="color:#64748b; margin-left:8px;">\${b.date}</small>
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
        { flightNo: "6E-204", airline: "IndiGo", time: "10:00 AM", displayPrice: 4500 },
        { flightNo: "UK-811", airline: "Vistara", time: "02:30 PM", displayPrice: 5700 }
    ];
    res.json({ flights });
});

app.post('/search-hotels', (req, res) => {
    const city = req.body.city || "Jamnagar";
    const hotels = [
        { name: "Grand Hyatt " + city, rating: "5 Star", displayPrice: 8500 },
        { name: "Taj Residency " + city, rating: "5 Star", displayPrice: 10000 }
    ];
    res.json({ hotels });
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

app.post('/verify-booking', (req, res) => {
    const { amount, type, title } = req.body;
    const pnr = "TT" + Math.floor(100000 + Math.random() * 900000);
    const bookingDate = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    bookingsHistory.unshift({ pnr, type, title, fare: amount, date: bookingDate });
    res.json({ status: "SUCCESS", pnr });
});

app.get('/history', (req, res) => res.json({ bookings: bookingsHistory }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
