const express = require('express');
const app = express();

app.use(express.json());

const ADMIN_WHATSAPP = "916353890711"; 
const ADMIN_PIN = "1234"; // Admin panel access PIN

let dynamicHotels = [
    { 
        id: "H101",
        name: "Grand Hyatt Jamnagar", 
        city: "Jamnagar", 
        rating: "4.8 ★", 
        displayPrice: 8500,
        address: "Town Hall Circle, Jamnagar",
        features: ["Free WiFi", "Pool", "AC", "Breakfast Included"]
    },
    { 
        id: "H102",
        name: "Hotel Express Residency", 
        city: "Jamnagar", 
        rating: "4.3 ★", 
        displayPrice: 3500,
        address: "Near Reliance Highway, Jamnagar",
        features: ["Free WiFi", "24/7 Service", "Parking", "Gym"]
    }
];

// Main User Frontend Route
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>TechTravel - Premium B2B Stays</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        body { background: #f8fafc; color: #0f172a; padding-bottom: 30px; }
        
        .header { background: #ffffff; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; z-index: 100; }
        .logo { font-size: 22px; font-weight: 800; color: #0f172a; }
        .logo span { color: #2563eb; }
        
        .hero-banner { padding: 16px; max-width: 800px; margin: 0 auto; }
        .hero-img { width: 100%; height: 180px; object-fit: cover; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        
        .search-card { background: #ffffff; margin: 0 16px 20px; padding: 20px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .input-group { margin-bottom: 12px; }
        .input-group label { display: block; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
        .input-group input { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 10px; font-weight: 700; font-size: 15px; outline: none; }
        .btn-search { width: 100%; background: #2563eb; color: white; border: none; padding: 14px; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer; }
        
        .hotel-card { background: white; margin: 0 16px 16px; border-radius: 16px; border: 1px solid #e2e8f0; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
        .hotel-title { font-size: 17px; font-weight: 700; color: #0f172a; }
        .hotel-sub { font-size: 12px; color: #16a34a; font-weight: 700; margin: 4px 0 8px; }
        .badge { background: #eff6ff; color: #1d4ed8; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; display: inline-block; margin-right: 4px; margin-bottom: 4px; }
        
        .card-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; padding-top: 12px; border-top: 1px solid #f1f5f9; }
        .price { font-size: 20px; font-weight: 800; color: #0f172a; }
        .btn-book { background: #16a34a; color: white; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; }

        .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center; padding: 20px; }
        .modal-content { background: white; width: 100%; max-width: 400px; border-radius: 20px; padding: 24px; text-align: center; }
        .qr-box { margin: 12px 0; padding: 12px; background: #f8fafc; border-radius: 12px; border: 1px dashed #cbd5e1; }
        .btn-wa { width: 100%; background: #25d366; color: white; border: none; padding: 12px; border-radius: 10px; font-weight: 700; font-size: 14px; margin-top: 10px; cursor: pointer; }
        .btn-close { background: #f1f5f9; color: #64748b; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; margin-top: 8px; cursor: pointer; width: 100%; }
        
        .footer-admin { text-align: center; padding: 20px 0 10px; }
        .footer-admin a { color: #94a3b8; font-size: 11px; text-decoration: none; font-weight: 600; }
    </style>
</head>
<body>

    <div class="header">
        <div class="logo">Tech<span>Travel</span></div>
        <div style="font-size:12px; font-weight:700; color:#2563eb; background:#eff6ff; padding:4px 10px; border-radius:20px;">B2B Portal</div>
    </div>

    <div class="hero-banner">
        <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800" class="hero-img" alt="Banner">
    </div>

    <div class="search-card">
        <div class="input-group">
            <label>City / Location</label>
            <input type="text" id="hCity" value="Jamnagar" placeholder="Type City Name">
        </div>
        <button class="btn-search" id="btnSearch">Search Hotels</button>
    </div>

    <div id="hotelList"></div>

    <div class="modal" id="payModal">
        <div class="modal-content">
            <h3 id="mTitle" style="font-size:18px;">Complete Booking</h3>
            <p style="font-size:13px; color:#64748b; margin-top:4px;">Scan & Pay via any UPI App</p>
            <div class="qr-box">
                <img id="qrImg" src="" alt="UPI QR" style="width:160px; height:160px;">
                <div style="font-weight:800; font-size:18px; margin-top:6px;" id="mAmount"></div>
            </div>
            
            <div class="input-group" style="text-align: left; margin-top: 10px;">
                <label>Guest / Agent Name</label>
                <input type="text" id="guestName" placeholder="Enter Name">
            </div>

            <button class="btn-wa" onclick="sendWhatsAppAlert()">Send Booking Slip via WhatsApp</button>
            <button class="btn-close" onclick="closeModal()">Cancel</button>
        </div>
    </div>

    <!-- Hidden Admin Link at Page Bottom -->
    <div class="footer-admin">
        <a href="/admin">⚙️ Partner Admin Access</a>
    </div>

    <script>
        const cityInput = document.getElementById('hCity');
        let currentHotel = "";
        let currentPrice = 0;

        async function searchHotels() {
            let city = cityInput.value;
            let res = await fetch('/search-hotels', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ city }) });
            let data = await res.json();
            let html = '';

            if(!data.hotels || data.hotels.length === 0) {
                html = "<p style='text-align:center; color:#64748b; margin-top:20px;'>No hotels found in this city.</p>";
            } else {
                data.hotels.forEach(function(h) {
                    let featuresHtml = (h.features || []).map(f => '<span class="badge">' + f + '</span>').join('');
                    html += \`
                    <div class="hotel-card">
                        <div class="hotel-title">\${h.name}</div>
                        <div class="hotel-sub">\${h.rating} • \${h.address || h.city}</div>
                        <div>\${featuresHtml}</div>
                        <div class="card-bottom">
                            <div class="price">₹\${h.displayPrice} <span style="font-size:11px; color:#64748b; font-weight:500;">/night</span></div>
                            <button class="btn-book" onclick="openPayment('\${h.name}', \${h.displayPrice})">Book Now</button>
                        </div>
                    </div>\`;
                });
            }
            document.getElementById('hotelList').innerHTML = html;
        }

        function openPayment(title, amount) {
            currentHotel = title;
            currentPrice = amount;
            document.getElementById('mTitle').innerText = title;
            document.getElementById('mAmount').innerText = '₹' + amount;
            let upiUrl = 'upi://pay?pa=techtravel@upi&pn=TechTravel&am=' + amount + '&cu=INR';
            document.getElementById('qrImg').src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(upiUrl);
            document.getElementById('payModal').style.display = 'flex';
        }

        function sendWhatsAppAlert() {
            let guest = document.getElementById('guestName').value.trim() || 'Valued Guest';
            let message = "NEW BOOKING REQUEST%0A" +
                          "--------------------------%0A" +
                          "Hotel: " + encodeURIComponent(currentHotel) + "%0A" +
                          "Amount: ₹" + currentPrice + "%0A" +
                          "Guest/Agent: " + encodeURIComponent(guest) + "%0A" +
                          "Status: Payment Completed / Pending Verification%0A" +
                          "--------------------------";
            let waUrl = "https://wa.me/${ADMIN_WHATSAPP}?text=" + message;
            window.open(waUrl, '_blank');
        }

        function closeModal() {
            document.getElementById('payModal').style.display = 'none';
        }

        document.getElementById('btnSearch').addEventListener('click', searchHotels);
        searchHotels();
    </script>
</body>
</html>
  `);
});

// Dedicated Admin Panel Route
app.get('/admin', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - TechTravel</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; padding: 0; }
        body { background: #0f172a; color: white; padding: 20px; }
        .card { background: #1e293b; padding: 20px; border-radius: 16px; margin-bottom: 20px; border: 1px solid #334155; }
        h2 { font-size: 20px; margin-bottom: 16px; color: #38bdf8; }
        label { font-size: 12px; color: #94a3b8; display: block; margin-bottom: 4px; font-weight: 700; }
        input { width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #475569; background: #0f172a; color: white; margin-bottom: 12px; font-weight: 600; outline: none; }
        .btn { width: 100%; background: #2563eb; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 700; cursor: pointer; }
        .hotel-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #334155; }
        .btn-del { background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 700; cursor: pointer; }
        .login-box { max-width: 350px; margin: 50px auto; text-align: center; }
    </style>
</head>
<body>

    <div id="authBox" class="login-box card">
        <h2>🔒 Admin Login</h2>
        <label>Enter Secret PIN</label>
        <input type="password" id="pinInput" placeholder="Enter PIN (Default: 1234)">
        <button class="btn" onclick="checkPin()">Unlock Dashboard</button>
    </div>

    <div id="adminPanel" style="display:none; max-width: 600px; margin: 0 auto;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <h1 style="font-size:22px;">Hotel Management</h1>
            <a href="/" style="color:#38bdf8; text-decoration:none; font-size:13px; font-weight:700;">← Back to Site</a>
        </div>

        <div class="card">
            <h2>➕ Add New Hotel</h2>
            <label>Hotel Name</label>
            <input type="text" id="hName" placeholder="e.g. Radisson Blu">
            
            <label>City Name</label>
            <input type="text" id="hCity" placeholder="e.g. Jamnagar">

            <label>Price per Night (₹)</label>
            <input type="number" id="hPrice" placeholder="e.g. 4500">

            <label>Rating</label>
            <input type="text" id="hRating" value="4.5 ★">

            <button class="btn" onclick="addHotel()" style="background:#16a34a;">Add Hotel Live</button>
        </div>

        <div class="card">
            <h2>🏨 Existing Hotels</h2>
            <div id="manageList"></div>
        </div>
    </div>

    <script>
        function checkPin() {
            let pin = document.getElementById('pinInput').value;
            if(pin === "${ADMIN_PIN}") {
                document.getElementById('authBox').style.display = 'none';
                document.getElementById('adminPanel').style.display = 'block';
                loadAdminHotels();
            } else {
                alert('Wrong PIN!');
            }
        }

        async function loadAdminHotels() {
            let res = await fetch('/admin/hotels');
            let data = await res.json();
            let html = '';
            data.hotels.forEach(h => {
                html += \`
                <div class="hotel-item">
                    <div>
                        <strong style="font-size:15px;">\${h.name}</strong><br>
                        <span style="font-size:12px; color:#94a3b8;">\${h.city} • ₹\${h.displayPrice}</span>
                    </div>
                    <button class="btn-del" onclick="deleteHotel('\${h.id}')">Delete</button>
                </div>\`;
            });
            document.getElementById('manageList').innerHTML = html;
        }

        async function addHotel() {
            let name = document.getElementById('hName').value;
            let city = document.getElementById('hCity').value;
            let price = document.getElementById('hPrice').value;
            let rating = document.getElementById('hRating').value;

            if(!name || !city || !price) return alert('Please fill all details');

            await fetch('/admin/add-hotel', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ name, city, price, rating })
            });

            document.getElementById('hName').value = '';
            document.getElementById('hPrice').value = '';
            loadAdminHotels();
            alert('Hotel added successfully!');
        }

        async function deleteHotel(id) {
            if(!confirm('Are you sure?')) return;
            await fetch('/admin/delete-hotel', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ id })
            });
            loadAdminHotels();
        }
    </script>
</body>
</html>
  `);
});

// Admin API Endpoints
app.get('/admin/hotels', (req, res) => res.json({ hotels: dynamicHotels }));

app.post('/admin/add-hotel', (req, res) => {
    const { name, city, price, rating } = req.body;
    const newHotel = {
        id: "H" + Date.now(),
        name,
        city,
        rating: rating || "4.5 ★",
        displayPrice: Number(price),
        address: city,
        features: ["Free WiFi", "AC", "24/7 Service"]
    };
    dynamicHotels.push(newHotel);
    res.json({ success: true });
});

app.post('/admin/delete-hotel', (req, res) => {
    const { id } = req.body;
    dynamicHotels = dynamicHotels.filter(h => h.id !== id);
    res.json({ success: true });
});

app.post('/search-hotels', (req, res) => {
    const city = (req.body.city || "").toLowerCase().trim();
    if (!city) return res.json({ hotels: dynamicHotels });
    const filtered = dynamicHotels.filter(h => h.city.toLowerCase().includes(city));
    res.json({ hotels: filtered });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
