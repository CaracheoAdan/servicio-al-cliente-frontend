const axios = require('axios');

async function testApi() {
  try {
    console.log("Fetching /orders...");
    const res = await axios.get('http://localhost:5041/api/v1/orders');
    console.log(JSON.stringify(res.data, null, 2));

    const orders = res.data.items || res.data.data || res.data;
    if (orders && orders.length > 0) {
      console.log(`\nFetching /orders/${orders[0].id}...`);
      const detailRes = await axios.get(`http://localhost:5041/api/v1/orders/${orders[0].id}`);
      console.log(JSON.stringify(detailRes.data, null, 2));
    } else {
      console.log("No orders found.");
    }
  } catch (err) {
    console.error(err.message);
  }
}
testApi();
