const axios = require('axios');

async function testApi() {
  try {
    console.log("Trying POST /orders with lowercase status...");
    await axios.post('http://localhost:5041/api/v1/orders', { key: 'test-1', status: 'open' });
    console.log("Success with lowercase");
  } catch (err) {
    console.error("Failed:", err.response?.data || err.message);
  }

  try {
    console.log("\nTrying POST /orders with uppercase status...");
    const res = await axios.post('http://localhost:5041/api/v1/orders', { key: 'test-2', status: 'OPEN' });
    console.log("Success with uppercase");
    console.log(res.data);
  } catch (err) {
    console.error("Failed:", err.response?.data || err.message);
  }

  try {
    console.log("\nTrying POST /orders without status...");
    const res = await axios.post('http://localhost:5041/api/v1/orders', { key: 'test-3' });
    console.log("Success without status");
  } catch (err) {
    console.error("Failed:", err.response?.data || err.message);
  }
}
testApi();
