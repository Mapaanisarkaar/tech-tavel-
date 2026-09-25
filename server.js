const express = require('express');
const Razorpay = require('razorpay');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const razorpay = new Razorpay({
    key_id: 'rzp_test_Tg89YUKgx809cF', 
    key_secret: 'v1AY4aAmVcVzUAIPT67YXJzq'
});

let bookingsHistory = [];

let dynamicHotels = [
    { 
        id: "H101",
        name: "Grand Hyatt Jamnagar", 
        city: "Jamnagar", 
        rating: "4.8 ★ (Superb)", 
        displayPrice: 8500,
        gstin: "24AAAAA0000A1Z5",
        tdsPercent: 2,
        email: "hotel@hyattjamnagar.com",
        whatsapp: "919876543210",
        address: "Town Hall Circle, Jamnagar, Gujarat",
        features: ["Free WiFi", "Swimming Pool", "AC Rooms", "Free Breakfast"]
    },
    { 
        id: "H102",
        name: "Hotel Express Residency", 
        city: "Jamnagar", 
        rating: "4.3 ★ (Very Good)", 
        displayPrice: 3500,
        gstin: "24BBBBB1111B2Z6",
        tdsPercent: 2,
        email: "express@jamnagar.com",
        whatsapp: "919876543210",
        address: "Motikhavdi, Near Reliance Highway, Jamnagar",
        features: ["Free WiFi", "24/7 Room Service", "Parking", "Gym"]
    }
];

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Tech Travel - Premium Hotel Booking & B2B Portal</title>
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; padding: 0; }
        body { background: #f4f7f9; color: #1e293b; }
        .navbar { background: #ffffff; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; z-index: 1000; }
        .logo { font-size: 24px; font-weight: 800; color: #0f172a; text-decoration: none; }
        .logo span { color: #0066ff; }
        .nav-btns { display: flex; gap: 12px; }
        .btn { padding: 10px 18px; border-radius: 10px; font-weight: 600; font-size: 14px; cursor: pointer; border: none; transition: 0.2s; }
        .btn-primary { background: #0066ff; color: white; }
        .btn-outline { background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; }
        
        .hero-banner { position: relative; max-width: 1200px; margin: 20px auto 0; padding: 0 16px; }
        .hero-img { width: 100%; height: 320px; object-fit: cover; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .hero-overlay { position: absolute; bottom: 20px; left: 40px; color: white; text-shadow: 0 2px 10px rgba(0,0,0,0.6); }
        .hero-overlay h1 { font-size: 32px; font-weight: 800; }
        
        .container { max-width: 1200px; margin: 24px auto; padding: 0 16px; }
        .search-box { background: white; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.03); margin-bottom: 24px; }
        .form-row { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 12px; }
        .form-group { flex: 1; min-width: 220px; }
        .form-group label { display: block; font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 6px; text-transform: uppercase; }
        .form-group input { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-weight: 600; font-size: 15px; outline: none; }
        
        .hotel-card { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
        .badge { background: #dbeafe; color: #1e40af; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; display: inline-block; margin-right: 6px; margin-top: 8px; }
        .price-tag { font-size: 24px; font-weight: 800; color: #0f172a; }
        .book-btn { background: #16a34a; color: white; padding: 12px 24px; border-radius: 10px; border: none; font-weight: 700; cursor: pointer; font-size: 14px; }
        
        footer { background: #0f172a; color: white; padding: 40px 20px; text-align: center; margin-top: 50px; font-size: 14px; }
    </style>
</head>
<body>

    <div class="navbar">
        <a href="#" class="logo">Tech<span>Travel</span></a>
        <div class="nav-btns">
            <button class="btn btn-outline" id="btnPartner">Partner Portal</button>
            <button class="btn btn-primary" id="btnBookings">My Bookings</button>
        </div>
    </div>

    <div class="hero-banner">
        <img src="/1000251878.jpg" class="hero-img" alt="Banner" onerror="this.src='https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200'">
        <div class="hero-overlay">
            <h1>Book Premium Stays & Hotels</h1>
            <p>Verified Hotel Partners | Instant Invoice & Booking Receipts</p>
        </div>
    </div>

    <div class="container">
        <div class="search-box">
            <div class="form-row">
                <div class="form-group">
                    <label>Destination / City</label>
                    <input type="text" id="hCity" value="Jamnagar" placeholder="Enter City">
                </div>
                <div class="form-group" style="flex:0; min-width: 180px; align-self: flex-end;">
                    <button class="btn btn-primary" id="btnSearch" style="width: 100%; padding: 14px;">SEARCH</button>
                </div>
            </div>
        </div>

        <div id="hotelList"></div>
    </div>

    <footer>
        <p>© 2026 TechTravel Portal. All Rights Reserved. | Support: support@techtravel.com</p>
    </footer>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const cityInput = document.getElementById('hCity');
            
            async function searchHotels() {
                let city = cityInput.value;
                let res = await fetch('/search-hotels', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ city }) });
                let data = await res.json();
                let html = '';
                
                if(!data.hotels || data.hotels.length === 0) {
                    html = "<p style='text-align:center; color:#64748b;'>No hotels found for this city.</p>";
                } else {
                    data.hotels.forEach(function(h) {
                        let featuresHtml = (h.features || []).map(f => '<span class="badge">' + f + '</span>').join('');
                        html += `
                        <div class="hotel-card">
                            <div>
                                <h3 style="font-size:18px; color:#0f172a;">${h.name}</h3>
                                <div style="color:#16a34a; font-weight:700; font-size:13px; margin:4px 0;">${h.rating} \vert{}${h.address || h.city}</div>
                                <div>${featuresHtml}</div>
                            </div>
                            <div style="text-align:right;">
                                <div class="price-tag">₹${h.displayPrice} <span style="font-size:12px; color:#64748b; font-weight:500;">/night</span></div>
                                <button class="book-btn" onclick="payHotel('${h.id}', ${h.displayPrice}, '${h.name}')">Reserve Now</button>
                            </div>
                        </div>`;
                    });
                }
                document.getElementById('hotelList').innerHTML = html;
            }

            document.getElementById('btnSearch').addEventListener('click', searchHotels);
            searchHotels();
        });

        async function payHotel(hotelId, amount, title) {
            let res = await fetch('/create-order', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ amount: Number(amount) })
            });
            let orderData = await res.json();

            var options = {
                "key": "rzp_test_Tg89YUKgx809cF", 
                "amount": orderData.amount,
                "currency": "INR",
                "name": "Tech Travel",
                "description": "Booking - " + title,
                "order_id": orderData.id,
                "handler": async function (response){
                    alert("Payment Successful!");
                },
                "theme": { "color": "#0066ff" }
            };
            var rzp1 = new Razorpay(options);
            rzp1.open();
        }
    </script>
</body>
</html>
  `);
});

app.post('/search-hotels', (req, res) => {
    const city = (req.body.city || "").toLowerCase().trim();
    if (!city) return res.json({ hotels: dynamicHotels });
    const filtered = dynamicHotels.filter(h => h.city.toLowerCase().includes(city));
    res.json({ hotels: filtered });
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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
