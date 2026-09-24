const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('travel_b2b.json');
const db = low(adapter);

// Initial Data Set
db.defaults({ 
  agents: [
    { id: 1, agency_name: 'Sharma Travels', email: 'agent@sharmatravels.com', wallet_balance: 15000.0, markup_per_flight: 200.0 }
  ] 
}).write();

module.exports = db;

