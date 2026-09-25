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

        /* Top Header - MMT Style */
        .header { background: #ffffff; padding: 12px 60px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.06); position: sticky; top: 0; z-index: 100; }
        .logo { font-size: 26px; font-weight: 900; color: #000; text-transform: lowercase; letter-spacing: -1px; }
        .logo span { color: #e53935; background: #e53935; color: #fff; padding: 2px 8px; border-radius: 6px; font-weight: 800; margin: 0 2px; }
        .top-nav-right { display: flex; align-items: center; gap: 20px; font-size: 12px; font-weight: 600; color: #4a5568; }
        .btn-login { background: linear-gradient(90deg, #008cff, #0052cc); color: white; border: none; padding: 8px 18px; border-radius: 20px; font-weight: 700; cursor: pointer; }

        /* MMT Navigation Icons Bar */
        .services-bar { background: #ffffff; padding: 15px 0; border-bottom: 1px solid #e2e8f0; margin-bottom: 25px; box-shadow: 0 2px 5px rgba(0,0,0,0.02); }
        .services-list { display: flex; justify-content: center; gap: 35px; list-style: none; }
        .service-item { display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; color: #4a5568; font-weight: 600; font-size: 12px; padding: 5px 12px; border-bottom: 3px solid transparent; transition: 0.2s; }
        .service-item.active { color: #008cff; border-bottom-color: #008cff; font-weight: 700; }
        .service-item span.icon { font-size: 22px; }

        .container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }

        /* MMT Search Widget Container */
        .search-card { background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 25px rgba(0,0,0,0.06); margin-bottom: 30px; border: 1px solid #e2e8f0; }
        .trip-type { display: flex; gap: 20px; font-size: 13px; font-weight: 600; margin-bottom: 20px; color: #4a5568; }
        .trip-type label { display: flex; align-items: center; gap: 6px; cursor: pointer; }
        
        .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 25px; }
        .form-group { background: #f8fafc; padding: 12px 16px; border-radius: 12px; border: 1px solid #e2e8f0; transition: 0.2s; }
        .form-group:hover { background: #f1f5f9; border-color: #cbd5e1; }
        .form-group label { display: block; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 4px; }
        .form-group input { width: 100%; border: none; background: transparent; font-size: 16px; font-weight: 700; color: #0f172a; outline: none; }
        
        .search-btn { background: linear-gradient(90deg, #008cff, #0052cc); color: white; font-weight: 800; font-size: 18px; border: none; padding: 14px; border-radius: 35px; cursor: pointer; width: 240px; margin: 0 auto; display: block; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(0,140,255,0.3); }

        /* Hyatt Business Banner */
        .promo-banner { background: linear-gradient(90deg, #0f172a, #1e293b); color: white; padding: 20px 30px; border-radius: 14px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 35px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .promo-banner h3 { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
        .promo-banner p { font-size: 12px; color: #94a3b8; }
        .promo-btn { background: #008cff; color: white; border: none; padding: 10px 24px; border-radius: 25px; font-weight: 700; cursor: pointer; font-size: 13px; }

        /* OFFERS CAROUSEL SECTION (MakeMyTrip Style) */
        .offers-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
        .offers-title { font-size: 24px; font-weight: 800; color: #0f172a; }
        .offer-tabs { display: flex; gap: 20px; list-style: none; font-size: 14px; font-weight: 600; color: #64748b; }
        .offer-tab { cursor: pointer; padding-bottom: 4px; }
        .offer-tab.active { color: #008cff; border-bottom: 3px solid #008cff; font-weight: 700; }

        .offers-scroll-container { display: flex; gap: 20px; overflow-x: auto; padding-bottom: 15px; scroll-behavior: smooth; }
        .offers-scroll-container::-webkit-scrollbar { height: 6px; }
        .offers-scroll-container::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

        .offer-card { flex: 0 0 330px; background: white; border-radius: 16px; padding: 18px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03); display: flex; gap: 14px; align-items: center; }
        .offer-img { width: 90px; height: 90px; border-radius: 12px; object-fit: cover; }
        .offer-content { flex: 1; }
        .offer-tag { font-size: 10px; color: #64748b; font-weight: 700; text-transform: uppercase; }
        .offer-heading { font-size: 14px; font-weight: 700; color: #0f172a; margin: 4px 0; line-height: 1.3; }
        .offer-desc { font-size: 11px; color: #64748b; margin-bottom: 10px; }
        .offer-btn { font-size: 12px; font-weight: 800; color: #008cff; text-decoration: none; cursor: pointer; }

        /* Booking Results Card */
        .flight-card, .hotel-card { background: white; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
        .book-btn { background: #ff6d00; color: white; border: none; padding: 10px 24px; border-radius: 25px; font-weight: 700; cursor: pointer; font-size: 14px; }

        /* Footer Owner Photo */
        .footer-banner { text-align: center; margin: 50px 0 30px; }
        .footer-banner img { max-width: 100%; max-height: 420px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.12); }
    </style>
</head>
<body>

    <!-- MMT Header -->
    <div class="header">
        <div class="logo">tech <span>my</span> trip</div>
        <div class="top-nav-right">
            <div><span>🌐</span> IN | ENG</div>
            <button class="btn-login" onclick="switchTab('history')">My Bookings</button>
        </div>
    </div>

    <!-- MMT Navigation Bar -->
    <div class="services-bar">
        <ul class="services-list">
            <li class="service-item active" id="flightTab" onclick="switchTab('flight')"><span class="icon">✈️</span> Flights</li>
            <li class="service-item" id="hotelTab" onclick="switchTab('hotel')"><span class="icon">🏨</span> Hotels</li>
            <li class="service-item" id="historyTab" onclick="switchTab('history')"><span class="icon">📋</span> My Bookings</li>
        </ul>
    </div>

    <div class="container">
        
        <!-- Search Form Section -->
        <div class="search-card">
            <div class="trip-type">
                <label><input type="radio" name="trip" checked> One Way</label>
                <label><input type="radio" name="trip"> Round Trip</label>
                <label><input type="radio" name="trip"> Multi City</label>
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
                <h3 style="margin-bottom:15px; color:#0f172a;">Your Recent Bookings</h3>
                <div id="historyList">Loading...</div>
            </div>

            <div id="results" style="margin-top:25px;"></div>
        </div>

        <!-- MMT Style Business Stay Promo Banner -->
        <div class="promo-banner">
            <div>
                <h3>Work Better with Seamless Business Stays</h3>
                <p>At Hyatt Business Hotels. Exclusive corporate discounts on Tech Travel.</p>
            </div>
            <button class="promo-btn" onclick="switchTab('hotel')">BOOK NOW</button>
        </div>

        <!-- OFFERS HORIZONTAL CAROUSEL (Exact MakeMyTrip Style) -->
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
                    <div class="offer-heading">For the 2nd-4th Long Weekend:</div>
                    <div class="offer-desc">Grab Up to 40% OFF* on Trips. Code: MMTESCAPE</div>
                    <span class="offer-btn" onclick="switchTab('hotel')">BOOK NOW &rarr;</span>
                </div>
            </div>

            <!-- Offer 2 -->
            <div class="offer-card">
                <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=300&auto=format&fit=crop" class="offer-img" alt="Flight Offer">
                <div class="offer-content">
                    <div class="offer-tag">Bank Offer</div>
                    <div class="offer-heading">Amazing Deal for You: Grab FLAT 10% OFF*</div>
                    <div class="offer-desc">on Domestic & International Flights.</div>
                    <span class="offer-btn" onclick="switchTab('flight')">VIEW DETAILS &rarr;</span>
                </div>
            </div>

            <!-- Offer 3 -->
            <div class="offer-card">
                <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=300&auto=format&fit=crop" class="offer-img" alt="Luxury Hotel">
                <div class="offer-content">
                    <div class="offer-tag">VISA Cards</div>
                    <div class="offer-heading">Up to 15% OFF* on flights & hotels</div>
                    <div class="offer-desc">Valid on IndusInd VISA Debit Card</div>
                    <span class="offer-btn" onclick="switchTab('hotel')">VIEW DETAILS &rarr;</span>
                </div>
            </div>

            <!-- Offer 4 -->
            <div class="offer-card">
                <img src="https://images.unsplash.com/photo-1512353087810-25dfcd100962?w=300&auto=format&fit=crop" class="offer-img" alt="Air India Sale">
                <div class="offer-content">
                    <div class="offer-tag">Air India</div>
                    <div class="offer-heading">LIVE NOW: Sale by Air India</div>
                    <div class="offer-desc">with Up to 10% OFF* on Premium Economy.</div>
                    <span class="offer-btn" onclick="switchTab('flight')">BOOK NOW &rarr;</span>
                </div>
            </div>
        </div>

        <!-- Footer Photo Banner -->
        <div class="footer-banner">
            <img src="https://lh3.googleusercontent.com/d/1xkGxH3nmw6USTqiRm13b9zGXVaCTADBZ" alt="Owner Photo">
        </div>

    </div>

    <script>
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
                        <b style="font-size:16px;">\${f.airline}</b> (\${f.flightNo})
                        <div style="color:#64748b; font-size:12px;">Departure: \${f.time}</div>
                    </div>
                    <div>
                        <span style="font-size:20px; font-weight:800; color:#0f172a; margin-right:15px;">₹\${f.displayPrice}</span>
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
                        <b style="font-size:16px;">\${h.name}</b>
                        <div style="color:#22c55e; font-size:12px; font-weight:700;">★ \${h.rating} Rating</div>
                    </div>
                    <div>
                        <span style="font-size:20px; font-weight:800; color:#0f172a; margin-right:15px;">₹\${h.displayPrice}</span>
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
                html += \`<div style="padding:15px; border:1px solid #e2e8f0; margin-bottom:10px; border-radius:10px; background:#f8fafc;">
                    <b>\${b.pnr}</b> | \${b.type} - \${b.title} | <b>₹\${b.fare}</b> <small style="color:#64748b; margin-left:10px;">\${b.date}</small>
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
