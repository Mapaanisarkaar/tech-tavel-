const express = require('express');
const Razorpay = require('razorpay');
const app = express();

app.use(express.json());

const razorpay = new Razorpay({
    key_id: 'rzp_test_Tg6Hmgg1bYKgGQ',
    key_secret: 'PkIVv6VqzJ0BEqLwpwDysOMR'
});

let bookingsHistory = [];

// Advanced Hotel Database with Tax & Contact details
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
        .btn-login { background: linear-gradient(90deg, #008cff, #0052cc); color: white; border: none; padding: 6px 14px; border-radius: 20px; font-weight: 700; cursor: pointer; }
        .btn-add-hotel { background: #28a745; color: white; border: none; padding: 6px 12px; border-radius: 20px; font-weight: 700; cursor: pointer; }

        .services-bar { background: #ffffff; padding: 12px 0; border-bottom: 1px solid #e2e8f0; margin-bottom: 20px; }
        .services-list { display: flex; justify-content: center; gap: 15px; list-style: none; overflow-x: auto; padding: 0 10px; }
        .service-item { display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; color: #4a5568; font-weight: 600; font-size: 11px; padding: 4px 8px; border-bottom: 3px solid transparent; white-space: nowrap; }
        .service-item.active { color: #008cff; border-bottom-color: #008cff; font-weight: 700; }

        .container { max-width: 1100px; margin: 0 auto; padding: 0 15px; }

        .search-card { background: white; padding: 20px; border-radius: 16px; box-shadow: 0 4px 25px rgba(0,0,0,0.06); margin-bottom: 25px; border: 1px solid #e2e8f0; }
        .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 20px; }
        .form-group { background: #f8fafc; padding: 10px 14px; border-radius: 12px; border: 1px solid #e2e8f0; }
        .form-group label { display: block; font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 2px; }
        .form-group input, .form-group select { width: 100%; border: none; background: transparent; font-size: 14px; font-weight: 700; color: #0f172a; outline: none; }
        
        .search-btn { background: linear-gradient(90deg, #008cff, #0052cc); color: white; font-weight: 800; font-size: 15px; border: none; padding: 12px; border-radius: 35px; cursor: pointer; width: 100%; max-width: 240px; margin: 0 auto; display: block; text-transform: uppercase; }

        .hotel-card { background: white; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
        .book-btn { background: #28a745; color: white; border: none; padding: 8px 18px; border-radius: 20px; font-weight: 700; cursor: pointer; font-size: 13px; }

        .partner-box { background: #f0f9ff; border: 2px solid #008cff; padding: 20px; border-radius: 16px; margin-bottom: 20px; }
        .partner-box h3 { color: #008cff; font-size: 18px; margin-bottom: 5px; }
        .partner-box p { font-size: 12px; color: #475569; margin-bottom: 15px; }
        
        .tax-tag { font-size: 10px; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-weight: 600; margin-top: 4px; display: inline-block; }
    </style>
</head>
<body>

    <div class="header">
        <div class="logo">tech <span>my</span> trip</div>
        <div class="top-nav-right">
            <button class="btn-add-hotel" onclick="switchTab('partner')">🏨 Hotel Partner Portal</button>
            <button class="btn-login" onclick="switchTab('history')">My Bookings</button>
        </div>
    </div>

    <div class="services-bar">
        <ul class="services-list">
            <li class="service-item active" id="hotelTab" onclick="switchTab('hotel')">🏨 Book Hotels</li>
            <li class="service-item" id="partnerTab" onclick="switchTab('partner')">📄 Hotel Partner Page (GST/TDS)</li>
            <li class="service-item" id="historyTab" onclick="switchTab('history')">📋 Booking Receipts</li>
        </ul>
    </div>

    <div class="container">
        <div class="search-card">
            
            <!-- Hotel Search View -->
            <div id="hotelSection">
                <div class="form-grid">
                    <div class="form-group"><label>City / Location</label><input type="text" id="hCity" value="Jamnagar"></div>
                </div>
                <button class="search-btn" style="background: linear-gradient(90deg, #ff7e00, #ff5100);" onclick="searchHotels()">SEARCH HOTELS</button>
            </div>

            <!-- Dedicated Hotel Partner Portal -->
            <div id="partnerSection" style="display:none;">
                <div class="partner-box">
                    <h3>🏨 Hotel Partner Registration & Tax Details</h3>
                    <p>Apni hotel list karein. Booking message directly aapke Email aur WhatsApp par instant bhej diya jayega.</p>
                    
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Hotel Name</label>
                            <input type="text" id="pName" placeholder="e.g. Royal Palace Hotel">
                        </div>
                        <div class="form-group">
                            <label>City</label>
                            <input type="text" id="pCity" placeholder="e.g. Jamnagar">
                        </div>
                        <div class="form-group">
                            <label>Price Per Night (₹)</label>
                            <input type="number" id="pPrice" placeholder="e.g. 3500">
                        </div>
                        <div class="form-group">
                            <label>GSTIN Number</label>
                            <input type="text" id="pGstin" placeholder="e.g. 24ABCDE1234F1Z5">
                        </div>
                        <div class="form-group">
                            <label>TDS Rate (%)</label>
                            <input type="number" id="pTds" value="2">
                        </div>
                        <div class="form-group">
                            <label>Notification WhatsApp Number</label>
                            <input type="text" id="pWhatsapp" placeholder="e.g. 919876543210">
                        </div>
                        <div class="form-group">
                            <label>Notification Email ID</label>
                            <input type="email" id="pEmail" placeholder="hotelbooking@gmail.com">
                        </div>
                        <div class="form-group">
                            <label>Rating Category</label>
                            <select id="pRating">
                                <option value="3 Star">3 Star</option>
                                <option value="4 Star">4 Star</option>
                                <option value="5 Star" selected>5 Star</option>
                            </select>
                        </div>
                    </div>
                    <button class="search-btn" style="background: #28a745;" onclick="registerHotelPartner()">SAVE & PUBLISH HOTEL</button>
                </div>
            </div>

            <!-- Booking History -->
            <div id="historySection" style="display:none;">
                <h3 style="margin-bottom:12px; color:#0f172a;">Your Bookings & Tax Receipts</h3>
                <div id="historyList">Loading...</div>
            </div>

            <div id="results" style="margin-top:20px;"></div>
        </div>
    </div>

    <script>
        function switchTab(type) {
            ['hotel', 'partner', 'history'].forEach(t => {
                document.getElementById(t + 'Section').style.display = 'none';
                document.getElementById(t + 'Tab').classList.remove('active');
            });
            document.getElementById(type + 'Section').style.display = 'block';
            document.getElementById(type + 'Tab').classList.add('active');
            document.getElementById('results').innerHTML = '';
            if(type === 'history') loadHistory();
            if(type === 'hotel') searchHotels();
        }

        async function registerHotelPartner() {
            let name = document.getElementById('pName').value;
            let city = document.getElementById('pCity').value;
            let displayPrice = document.getElementById('pPrice').value;
            let gstin = document.getElementById('pGstin').value;
            let tdsPercent = document.getElementById('pTds').value;
            let whatsapp = document.getElementById('pWhatsapp').value;
            let email = document.getElementById('pEmail').value;
            let rating = document.getElementById('pRating').value;

            if(!name || !city || !displayPrice || !whatsapp || !email) {
                return alert("Kripya saari jaroori details (Name, City, Price, WhatsApp, Email) bharein!");
            }

            let res = await fetch('/add-hotel-partner', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ name, city, displayPrice, gstin, tdsPercent, whatsapp, email, rating })
            });

            let data = await res.json();
            if(data.status === "SUCCESS") {
                alert("Mubarak ho! Aapki Hotel Tax details ke sath registered ho chuki hai.");
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
                html = "<p style='color:#64748b; text-align:center;'>Is city mein abhi koi hotel nahi hai. 'Hotel Partner Page' par ja kar add karein.</p>";
            } else {
                data.hotels.forEach(h => {
                    let gstAmount = Math.round(h.displayPrice * 0.18);
                    html += `<div class="hotel-card">
                        <div>
                            <b style="font-size:15px;">${h.name}</b>
                            <div style="color:#22c55e; font-size:11px; font-weight:700;">★ ${h.rating} \vert{}${h.city}</div>
                            <div class="tax-tag">GSTIN: ${h.gstin \vert{}\vert{} 'N/A'} \vert{} GST (18\%): ₹${gstAmount}</div>
                        </div>
                        <div>
                            <span style="font-size:18px; font-weight:800; color:#0f172a; margin-right:10px;">₹${h.displayPrice}</span>
                            <button class="book-btn" onclick="payHotel('${h.id}', ${h.displayPrice}, '${h.name}')">BOOK NOW</button>
                        </div>
                    </div>`;
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
                        alert("Booking Successful! PNR: " + verifyData.pnr + "\\nWhatsApp aur Email Notification bhej diya gaya hai!");
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
            data.bookings.forEach(b => {
                html += `<div style="padding:12px; border:1px solid #e2e8f0; margin-bottom:8px; border-radius:10px; background:#f8fafc;">
                    <b>${b.pnr}</b> \vert{}${b.title} | <b>Total: ₹${b.fare}</b> (Incl. GST: ₹${b.gst})
                    <div style="font-size:11px; color:#64748b; margin-top:3px;">GSTIN: ${b.gstin} | TDS Deducted (${b.tdsRate}\%): ₹${b.tdsAmount}</div>
                </div>`;
            });
            document.getElementById('historyList').innerHTML = html;
        }
    </script>
</body>
</html>
  `);
});

app.post('/search-hotels', (req, res) => {
    const city = (req.body.city || "").toLowerCase().trim();
    if (!city) {
        return res.json({ hotels: dynamicHotels });
    }
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
    
    // Find hotel partner details
    const hotel = dynamicHotels.find(h => h.id === hotelId) || dynamicHotels[0];
    
    const gst = Math.round(amount * 0.18);
    const tdsAmount = Math.round(amount * ((hotel.tdsPercent || 2) / 100));

    // Instant WhatsApp Notification Direct Link
    const waMessage = encodeURIComponent(`*NEW BOOKING CONFIRMED!* 🎉\nPNR: ${pnr}\nHotel: ${title}\nAmount: ₹${amount}\nGST (18%): ₹${gst}\nGSTIN: ${hotel.gstin}\n\nInvoice sent to: ${hotel.email}`);
    const waUrl = `https://api.whatsapp.com/send?phone=${hotel.whatsapp}&text=${waMessage}`;

    bookingsHistory.unshift({ 
        pnr, 
        type, 
        title, 
        fare: amount, 
        gst,
        gstin: hotel.gstin,
        tdsRate: hotel.tdsPercent || 2,
        tdsAmount,
        date: new Date().toLocaleString() 
    });

    res.json({ status: "SUCCESS", pnr, waUrl });
});

app.get('/history', (req, res) => res.json({ bookings: bookingsHistory }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
