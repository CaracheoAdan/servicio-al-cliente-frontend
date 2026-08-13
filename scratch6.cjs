const axios = require('axios');

async function testApi() {
  try {
    console.log("Trying without deliveredQuantity...");
    await axios.post('http://localhost:5041/api/v1/order_items', {
      orderId: 6,
      productId: 1,
      orderedQuantity: 100
    });
    console.log("Success omitting it");
  } catch (err) {
    console.error("Failed:", err.response?.data || err.message);
  }
}
testApi();
