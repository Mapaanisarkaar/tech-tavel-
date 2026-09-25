const express = require('express');
const Razorpay = require('razorpay');
const app = express();

app.use(express.json());

const razorpay = new Razorpay({
    key_id: 'rzp_test_Tg6Hmgg1bYKgGQ',
    key_secret: 'PkIVv6VqzJ0BEqLwpwDysOMR'
});

let bookingsHistory = [];

let dynamicHotels = [
    { 
        id: "H101",
        name: "Grand Hyatt Jamnagar", 
        city: "Jamnagar", 
        rating: "5 Star", 
        displayPrice: 8500,
        gstin: "24AAAAA0000A1Z5",
        tdsPercent: 2,
        email: "hotel@hyattjamnagar.com",
        whatsapp: "919876543210"
    }
];

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Tech Travel Portal</title>
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; font-family: 'Poppins', sans-serif; margin: 0; padding: 0; }
        body { background: #eef2f5; color: #333; }
        .header { background: #ffffff; padding: 12px 15px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.06); position: sticky; top: 0; z-index: 100; }
        .logo { font-size: 20px; font-weight: 900; color: #000; text-transform: lowercase; }
        .logo span { background: #e53935; color: #fff; padding: 2px 6px; border-radius: 6px; font-weight: 800; }
        .top-nav-right { display: flex; gap: 6px; }
        .btn-login { background: #008cff; color: white; border: none; padding: 8px 12px; border-radius: 20px; font-weight: 700; cursor: pointer; font-size: 11px; }
        .btn-add-hotel { background: #28a745; color: white; border: none; padding: 8px 12px; border-radius: 20px; font-weight: 700; cursor: pointer; font-size: 11px; }

        .services-bar { background: #ffffff; padding: 10px; border-bottom: 1px solid #e2e8f0; margin-bottom: 15px; }
        .services-list { display: flex; justify-content: space-around; list-style: none; }
        .service-item { cursor: pointer; color: #4a5568; font-weight: 600; font-size: 12px; padding: 6px 10px; border-bottom: 3px solid transparent; }
        .service-item.active { color: #008cff; border-bottom-color: #008cff; font-weight: 700; }

        .container { max-width: 800px; margin: 0 auto; padding: 0 12px; }
        .card { background: white; padding: 20px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); margin-bottom: 20px; border: 1px solid #e2e8f0; }
        
        .form-group { background: #f8fafc; padding: 10px 14px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 12px; }
        .form-group label { display: block; font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 2px; }
        .form-group input, .form-group select { width: 100%; border: none; background: transparent; font-size: 15px; font-weight: 700; color: #0f172a; outline: none; }
        
        .search-btn { background: #ff5100; color: white; font-weight: 800; font-size: 15px; border: none; padding: 14px; border-radius: 30px; cursor: pointer; width: 100%; text-transform: uppercase; display: block; }

        .hotel-card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; }
        .book-btn { background: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 18px; font-weight: 700; cursor: pointer; font-size: 12px; }
    </style>
</head>
<body>

    <div class="header">
        <div class="logo">tech <span>my</span> trip</div>
        <div class="top-nav-right">
            <button class="btn-add-hotel" onclick="switchTab('partner')">🏨 Partner Portal</button>
            <button class="btn-login" onclick="switchTab('history')">Bookings</button>
        </div>
    </div>

    <div class="services-bar">
        <div class="services-list">
            <span class="service-item active" id="hotelTab" onclick="switchTab('hotel')">🏨 Book Hotels</span>
            <span class="service-item" id="partnerTab" onclick="switchTab('partner')">📄 Partner (GST/TDS)</span>
            <span class="service-item" id="historyTab" onclick="switchTab('history')">📋 Receipts</span>
        </div>
    </div>

    <div class="container">
        <div class="card">
            
            <!-- SEARCH HOTELS -->
            <div id="hotelSection">
                <div class="form-group">
                    <label>City / Location</label>
                    <input type="text" id="hCity" value="Jamnagar">
                </div>
                <button type="button" class="search-btn" onclick="searchHotels()">SEARCH HOTELS</button>
            </div>

            <!-- PARTNER REGISTRATION -->
            <div id="partnerSection" style="display:none;">
                <h3 style="color:#008cff; margin-bottom:10px;">🏨 Hotel Registration (GST/TDS)</h3>
                <div class="form-group"><label>Hotel Name</label><input type="text" id="pName" placeholder="Hotel Name"></div>
                <div class="form-group"><label>City</label><input type="text" id="pCity" placeholder="City"></div>
                <div class="form-group"><label>Price Per Night (₹)</label><input type="number" id="pPrice" placeholder="2500"></div>
                <div class="form-group"><label>GSTIN</label><input type="text" id="pGstin" placeholder="24AAAAA0000A1Z5"></div>
                <div class="form-group"><label>TDS (%)</label><input type="number" id="pTds" value="2"></div>
                <div class="form-group"><label>WhatsApp No.</label><input type="text" id="pWhatsapp" placeholder="919876543210"></div>
                <div class="form-group"><label>Email ID</label><input type="email" id="pEmail" placeholder="hotel@gmail.com"></div>
                <button type="button" class="search-btn" style="background:#28a745;" onclick="registerHotelPartner()">SUBMIT HOTEL</button>
            </div>

            <!-- BOOKING HISTORY -->
            <div id="historySection" style="display:none;">
                <h3 style="margin-bottom:10px;">Booking Receipts</h3>
                <div id="historyList">Loading...</div>
            </div>

            <div id="results" style="margin-top:15px;"></div>
        </div>
    </div>

    <script>
        function switchTab(type) {
            console.log("Switching tab to: " + type);
            document.getElementById('hotelSection').style.display = 'none';
            document.getElementById('partnerSection').style.display = 'none';
            document.getElementById('historySection').style.display = 'none';

            document.getElementById('hotelTab').classList.remove('active');
            document.getElementById('partnerTab').classList.remove('active');
            document.getElementById('historyTab').classList.remove('active');

            if(type === 'hotel') {
                document.getElementById('hotelSection').style.display = 'block';
                document.getElementById('hotelTab').classList.add('active');
                searchHotels();
            } else if(type === 'partner') {
                document.getElementById('partnerSection').style.display = 'block';
                document.getElementById('partnerTab').classList.add('active');
                document.getElementById('results').innerHTML = '';
            } else if(type === 'history') {
                document.getElementById('historySection').style.display = 'block';
                document.getElementById('historyTab').classList.add('active');
                document.getElementById('results').innerHTML = '';
                loadHistory();
            }
        }

        async function registerHotelPartner() {
            let name = document.getElementById('pName').value;
            let city = document.getElementById('pCity').value;
            let displayPrice = document.getElementById('pPrice').value;
            let gstin = document.getElementById('pGstin').value;
            let tdsPercent = document.getElementById('pTds').value;
            let whatsapp = document.getElementById('pWhatsapp').value;
            let email = document.getElementById('pEmail').value;

            if(!name || !city || !displayPrice || !whatsapp || !email) {
                alert("Kripya saari details bharein!");
                return;
            }

            let res = await fetch('/add-hotel-partner', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ name, city, displayPrice, gstin, tdsPercent, whatsapp, email, rating: "5 Star" })
            });

            let data = await res.json();
            if(data.status === "SUCCESS") {
                alert("Hotel add ho gaya hai!");
                document.getElementById('hCity').value = city;
                switchTab('hotel');
            }
        }

        async function searchHotels() {
            let city = document.getElementById('hCity').value;
            let res = await fetch('/search-hotels', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ city }) });
            let data = await res.json();
            let html = '';
            if(data.hotels.length === 0) {
                html = "<p style='color:#64748b; text-align:center;'>Koi hotel nahi mila.</p>";
            } else {
                data.hotels.forEach(function(h) {
                    let gstAmount = Math.round(h.displayPrice * 0.18);
                    html += '<div class="hotel-card">' +
                        '<div>' +
                            '<b>' + h.name + '</b>' +
                            '<div style="color:#22c55e; font-size:11px;">★ ' + h.rating + ' | ' + h.city + '</div>' +
                            '<div style="font-size:10px; color:#0369a1;">GSTIN: ' + (h.gstin || 'N/A') + '</div>' +
                        '</div>' +
                        '<div>' +
                            '<span style="font-size:16px; font-weight:800;">₹' + h.displayPrice + '</span> ' +
                            '<button class="book-btn" onclick="payHotel(\'' + h.id + '\', ' + h.displayPrice + ', \'' + h.name + '\')">BOOK</button>' +
                        '</div>' +
                    '</div>';
                });
            }
            document.getElementById('results').innerHTML = html;
        }

        async function payHotel(hotelId, amount, title) {
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
                "description": "Hotel Booking - " + title,
                "order_id": orderData.id,
                "handler": async function (response){
                    let verifyRes = await fetch('/verify-booking', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ hotelId, amount, type: 'Hotel', title })
                    });
                    let verifyData = await verifyRes.json();
                    if(verifyData.status === "SUCCESS") {
                        alert("Booking Successful! PNR: " + verifyData.pnr);
                        if(verifyData.waUrl) {
                            window.open(verifyData.waUrl, '_blank');
                        }
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
                document.getElementById('historyList').innerHTML = "<p style='color:#64748b;'>No bookings yet.</p>";
                return;
            }
            let html = '';
            data.bookings.forEach(function(b) {
                html += '<div style="padding:10px; border:1px solid #e2e8f0; margin-bottom:8px; border-radius:8px; background:#f8fafc;">' +
                    '<b>' + b.pnr + '</b> | ' + b.title + ' | <b>₹' + b.fare + '</b>' +
                '</div>';
            });
            document.getElementById('historyList').innerHTML = html;
        }

        // Auto load on start
        window.onload = function() {
            searchHotels();
        };
    </script>
</body>
</html>
  `);
});

app.post('/search-hotels', (req, res) => {
    const city = (req.body.city || "").toLowerCase().trim();
    if (!city) return res.json({ hotels: dynamicHotels });
    const filtered = dynamicHotels.filter(h => h.city.toLowerCase().includes(city));
    res.json({ hotels: filtered.length > 0 ? filtered : dynamicHotels });
});

app.post('/add-hotel-partner', (req, res) => {
    const { name, city, displayPrice, gstin, tdsPercent, whatsapp, email, rating } = req.body;
    const newHotel = {
        id: "H" + (100 + dynamicHotels.length + 1),
        name,
        city,
        displayPrice: Number(displayPrice),
        gstin: gstin || "24AAAAA0000A1Z5",
        tdsPercent: Number(tdsPercent) || 2,
        whatsapp: whatsapp || "919876543210",
        email: email || "partner@techtravel.com",
        rating: rating || "4 Star"
    };
    dynamicHotels.unshift(newHotel);
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
    const { hotelId, amount, type, title } = req.body;
    const pnr = "TT" + Math.floor(100000 + Math.random() * 900000);
    const hotel = dynamicHotels.find(h => h.id === hotelId) || dynamicHotels[0];
    const gst = Math.round(amount * 0.18);

    const waMessage = encodeURIComponent(`*NEW BOOKING CONFIRMED!*\nPNR: ${pnr}\nHotel: ${title}\nAmount: ₹${amount}\nGSTIN: ${hotel.gstin}`);
    const waUrl = `https://api.whatsapp.com/send?phone=${hotel.whatsapp}&text=${waMessage}`;

    bookingsHistory.unshift({ pnr, type, title, fare: amount, date: new Date().toLocaleString() });

    res.json({ status: "SUCCESS", pnr, waUrl });
});

app.get('/history', (req, res) => res.json({ bookings: bookingsHistory }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
