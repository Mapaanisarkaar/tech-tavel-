const express = require('express');
const Razorpay = require('razorpay');
const app = express();

app.use(express.json());

// SCREENSHOT WALI NEW TEST KEYS
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
        rating: "5 Star", 
        displayPrice: 8500,
        gstin: "24AAAAA0000A1Z5",
        tdsPercent: 2,
        email: "hotel@hyattjamnagar.com",
        whatsapp: "919876543210"
    },
    { 
        id: "H102",
        name: "Hotel Express Residency", 
        city: "Jamnagar", 
        rating: "4 Star", 
        displayPrice: 3500,
        gstin: "24BBBBB1111B2Z6",
        tdsPercent: 2,
        email: "express@jamnagar.com",
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
    <title>Tech Travel - Hotel Partner & Booking Portal</title>
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; font-family: 'Poppins', sans-serif; margin: 0; padding: 0; }
        body { background: #eef2f5; color: #333; }
        .header { background: #ffffff; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.06); position: sticky; top: 0; z-index: 100; }
        .logo { font-size: 22px; font-weight: 900; color: #000; text-transform: lowercase; letter-spacing: -1px; }
        .logo span { background: #e53935; color: #fff; padding: 2px 6px; border-radius: 6px; font-weight: 800; margin: 0 2px; }
        .top-nav-right { display: flex; align-items: center; gap: 10px; font-size: 11px; font-weight: 600; }
        .btn-login { background: linear-gradient(90deg, #008cff, #0052cc); color: white; border: none; padding: 8px 16px; border-radius: 20px; font-weight: 700; cursor: pointer; }
        .btn-add-hotel { background: #28a745; color: white; border: none; padding: 8px 14px; border-radius: 20px; font-weight: 700; cursor: pointer; }
        .services-bar { background: #ffffff; padding: 12px 0; border-bottom: 1px solid #e2e8f0; margin-bottom: 20px; }
        .services-list { display: flex; justify-content: center; gap: 15px; list-style: none; overflow-x: auto; padding: 0 10px; }
        .service-item { display: flex; align-items: center; gap: 6px; cursor: pointer; color: #4a5568; font-weight: 600; font-size: 13px; padding: 6px 12px; border-bottom: 3px solid transparent; white-space: nowrap; }
        .service-item.active { color: #008cff; border-bottom-color: #008cff; font-weight: 700; }
        .container { max-width: 1100px; margin: 0 auto; padding: 0 15px; }
        .search-card { background: white; padding: 25px; border-radius: 20px; box-shadow: 0 4px 25px rgba(0,0,0,0.06); margin-bottom: 25px; border: 1px solid #e2e8f0; }
        .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 20px; }
        .form-group { background: #f8fafc; padding: 12px 16px; border-radius: 14px; border: 1px solid #e2e8f0; }
        .form-group label { display: block; font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 4px; }
        .form-group input, .form-group select { width: 100%; border: none; background: transparent; font-size: 15px; font-weight: 700; color: #0f172a; outline: none; }
        .search-btn { background: linear-gradient(90deg, #ff7e00, #ff5100); color: white; font-weight: 800; font-size: 16px; border: none; padding: 14px; border-radius: 35px; cursor: pointer; width: 100%; max-width: 260px; margin: 0 auto; display: block; text-transform: uppercase; box-shadow: 0 4px 15px rgba(255,81,0,0.3); }
        .hotel-card { background: white; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
        .book-btn { background: #28a745; color: white; border: none; padding: 8px 18px; border-radius: 20px; font-weight: 700; cursor: pointer; font-size: 13px; }
        .partner-box { background: #f0f9ff; border: 2px solid #008cff; padding: 20px; border-radius: 16px; margin-bottom: 20px; }
        .partner-box h3 { color: #008cff; font-size: 18px; margin-bottom: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">tech <span>my</span> trip</div>
        <div class="top-nav-right">
            <button class="btn-add-hotel" id="btnPartnerTop">🏨 Hotel Partner Portal</button>
            <button class="btn-login" id="btnHistoryTop">My Bookings</button>
        </div>
    </div>

    <div class="services-bar">
        <div class="services-list">
            <div class="service-item active" id="hotelTab">🏨 Book Hotels</div>
            <div class="service-item" id="partnerTab">📄 Hotel Partner Page (GST/TDS)</div>
            <div class="service-item" id="historyTab">📋 Booking Receipts</div>
        </div>
    </div>

    <div class="container">
        <div class="search-card">
            <div id="hotelSection">
                <div class="form-grid">
                    <div class="form-group">
                        <label>City / Location</label>
                        <input type="text" id="hCity" placeholder="Type City (e.g. Jamnagar)" value="Jamnagar">
                    </div>
                </div>
                <button class="search-btn" id="btnSearchHotels">SEARCH HOTELS</button>
            </div>

            <div id="partnerSection" style="display:none;">
                <div class="partner-box">
                    <h3>🏨 Hotel Partner Registration & Tax Details</h3>
                    <p style="font-size:12px; color:#475569; margin-bottom:15px;">Apni hotel list karein. Booking notification WhatsApp aur Email par mil jayegi.</p>
                    <div class="form-grid">
                        <div class="form-group"><label>Hotel Name</label><input type="text" id="pName" placeholder="Royal Palace Hotel"></div>
                        <div class="form-group"><label>City</label><input type="text" id="pCity" placeholder="Jamnagar"></div>
                        <div class="form-group"><label>Price Per Night (₹)</label><input type="number" id="pPrice" placeholder="3500"></div>
                        <div class="form-group"><label>GSTIN Number</label><input type="text" id="pGstin" placeholder="24ABCDE1234F1Z5"></div>
                        <div class="form-group"><label>TDS Rate (%)</label><input type="number" id="pTds" value="2"></div>
                        <div class="form-group"><label>WhatsApp Number</label><input type="text" id="pWhatsapp" placeholder="919876543210"></div>
                        <div class="form-group"><label>Email ID</label><input type="email" id="pEmail" placeholder="hotel@gmail.com"></div>
                    </div>
                    <button class="search-btn" id="btnSavePartner" style="background:#28a745; box-shadow:none;">SAVE & PUBLISH HOTEL</button>
                </div>
            </div>

            <div id="historySection" style="display:none;">
                <h3 style="margin-bottom:12px;">Your Bookings</h3>
                <div id="historyList">Loading...</div>
            </div>

            <div id="results" style="margin-top:20px;"></div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const hotelSection = document.getElementById('hotelSection');
            const partnerSection = document.getElementById('partnerSection');
            const historySection = document.getElementById('historySection');

            const hotelTab = document.getElementById('hotelTab');
            const partnerTab = document.getElementById('partnerTab');
            const historyTab = document.getElementById('historyTab');
            const cityInput = document.getElementById('hCity');

            function switchTab(type) {
                hotelSection.style.display = 'none';
                partnerSection.style.display = 'none';
                historySection.style.display = 'none';

                hotelTab.classList.remove('active');
                partnerTab.classList.remove('active');
                historyTab.classList.remove('active');

                if (type === 'hotel') {
                    hotelSection.style.display = 'block';
                    hotelTab.classList.add('active');
                    searchHotels();
                } else if (type === 'partner') {
                    partnerSection.style.display = 'block';
                    partnerTab.classList.add('active');
                    document.getElementById('results').innerHTML = '';
                } else if (type === 'history') {
                    historySection.style.display = 'block';
                    historyTab.classList.add('active');
                    document.getElementById('results').innerHTML = '';
                    loadHistory();
                }
            }

            hotelTab.addEventListener('click', () => switchTab('hotel'));
            partnerTab.addEventListener('click', () => switchTab('partner'));
            historyTab.addEventListener('click', () => switchTab('history'));
            document.getElementById('btnPartnerTop').addEventListener('click', () => switchTab('partner'));
            document.getElementById('btnHistoryTop').addEventListener('click', () => switchTab('history'));
            document.getElementById('btnSearchHotels').addEventListener('click', searchHotels);
            document.getElementById('btnSavePartner').addEventListener('click', registerHotelPartner);

            cityInput.addEventListener('keyup', function(e) {
                searchHotels();
            });

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
                    alert("Hotel successfully add ho gaya!");
                    cityInput.value = city;
                    switchTab('hotel');
                }
            }

            async function searchHotels() {
                let city = cityInput.value;
                let res = await fetch('/search-hotels', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ city }) });
                let data = await res.json();
                let html = '';
                if(!data.hotels || data.hotels.length === 0) {
                    html = "<p style='color:#64748b; text-align:center;'>Is city mein koi hotel nahi mila.</p>";
                } else {
                    data.hotels.forEach(function(h) {
                        let gstAmount = Math.round(h.displayPrice * 0.18);
                        html += '<div class="hotel-card">' +
                            '<div>' +
                                '<b style="font-size:15px;">' + h.name + '</b>' +
                                '<div style="color:#22c55e; font-size:11px; font-weight:700;">★ ' + h.rating + ' | ' + h.city + '</div>' +
                                '<div style="font-size:10px; color:#0369a1; margin-top:3px;">GSTIN: ' + (h.gstin || 'N/A') + ' | GST (18%): ₹' + gstAmount + '</div>' +
                            '</div>' +
                            '<div>' +
                                '<span style="font-size:18px; font-weight:800; color:#0f172a; margin-right:10px;">₹' + h.displayPrice + '</span>' +
                                '<button class="book-btn" data-id="' + h.id + '" data-price="' + h.displayPrice + '" data-name="' + h.name + '">BOOK NOW</button>' +
                            '</div>' +
                        '</div>';
                    });
                }
                document.getElementById('results').innerHTML = html;

                document.querySelectorAll('.book-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        payHotel(this.dataset.id, this.dataset.price, this.dataset.name);
                    });
                });
            }

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
                    document.getElementById('historyList').innerHTML = "<p style='color:#64748b;'>No bookings made yet.</p>";
                    return;
                }
                let html = '';
                data.bookings.forEach(function(b) {
                    html += '<div style="padding:12px; border:1px solid #e2e8f0; margin-bottom:8px; border-radius:10px; background:#f8fafc;">' +
                        '<b>' + b.pnr + '</b> | ' + b.title + ' | <b>Total: ₹' + b.fare + '</b>' +
                    '</div>';
                });
                document.getElementById('historyList').innerHTML = html;
            }

            searchHotels();
        });
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
        rating: rating || "5 Star"
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

    const waMessage = encodeURIComponent(`*NEW BOOKING CONFIRMED!*\nPNR: ${pnr}\nHotel: ${title}\nAmount: ₹${amount}\nGSTIN: ${hotel.gstin}`);
    const waUrl = `https://api.whatsapp.com/send?phone=${hotel.whatsapp}&text=${waMessage}`;

    bookingsHistory.unshift({ pnr, type, title, fare: amount, date: new Date().toLocaleString() });

    res.json({ status: "SUCCESS", pnr, waUrl });
});

app.get('/history', (req, res) => res.json({ bookings: bookingsHistory }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
