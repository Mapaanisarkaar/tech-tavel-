const express = require('express');
const app = express();

app.use(express.json());

let agentWallet = 45500;
let adminMarkup = 500;
let bookingsHistory = [];

const CITIES = [
    { name: "Delhi", code: "DEL", airport: "Indira Gandhi Int'l Airport" },
    { name: "Mumbai", code: "BOM", airport: "Chhatrapati Shivaji Maharaj Int'l Airport" },
    { name: "Bengaluru", code: "BLR", airport: "Kempegowda Int'l Airport" },
    { name: "Ahmedabad", code: "AMD", airport: "Sardar Vallabhbhai Patel Int'l Airport" },
    { name: "Goa (Dabolim)", code: "GOI", airport: "Dabolim Airport" },
    { name: "Jamnagar", code: "JGA", airport: "Jamnagar Airport" }
];

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
        { name: "Grand Hyatt " + city.split(' ')[0], rating: "5 Star", displayPrice: 8000 + adminMarkup },
        { name: "Taj Residency " + city.split(' ')[0], rating: "5 Star", displayPrice: 9500 + adminMarkup }
    ];
    res.json({ hotels });
});

app.post('/book', (req, res) => {
    const { fare, type, title } = req.body;
    if (agentWallet < fare) return res.json({ status: "FAIL", msg: "Insufficient Wallet Balance!" });
    agentWallet -= fare;
    const pnr = "MMT" + Math.floor(100000 + Math.random() * 900000);
    const bookingDate = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    bookingsHistory.unshift({ pnr, type, title, fare, date: bookingDate });
    res.json({ status: "SUCCESS", newWallet: agentWallet, pnr });
});

app.get('/history', (req, res) => res.json({ bookings: bookingsHistory }));
app.post('/admin/update-wallet', (req, res) => { agentWallet = req.body.amount; res.json({ status: "SUCCESS", newWallet: agentWallet }); });
app.post('/admin/update-markup', (req, res) => { adminMarkup = req.body.markup; res.json({ status: "SUCCESS", newMarkup: adminMarkup }); });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
