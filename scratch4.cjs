const axios = require('axios');

async function testApi() {
  try {
    console.log("Trying POST /orderDetails with null orderId...");
    await axios.post('http://localhost:5041/api/v1/orderDetails', { 
      orderId: null, 
      scheduledDeliveryDate: new Date().toISOString() 
    });
    console.log("Success");
  } catch (err) {
    console.error("Failed:", err.response?.data || err.message);
  }
}
testApi();
