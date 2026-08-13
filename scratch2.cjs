const axios = require('axios');

async function testApi() {
  try {
    console.log("Fetching /order_items...");
    const itemsRes = await axios.get('http://localhost:5041/api/v1/order_items').catch(() => ({data: 'failed'}));
    console.log(JSON.stringify(itemsRes.data, null, 2));

    console.log("\nFetching /orderDetails...");
    const detailsRes = await axios.get('http://localhost:5041/api/v1/orderDetails').catch(() => ({data: 'failed'}));
    console.log(JSON.stringify(detailsRes.data, null, 2));
  } catch (err) {
    console.error(err.message);
  }
}
testApi();
