const axios = require('axios');

async function testApi() {
  try {
    const payload = {
      key: 'test-100',
      status: 'open',
      scheduledDeliveryDate: '2026-08-10',
      items: [{ productId: 1, orderedQuantity: 100, deliveredQuantity: 0 }]
    };

    console.log("1. Crear Orden base");
    const orderRes = await axios.post('http://localhost:5041/api/v1/orders', { key: payload.key, status: payload.status });
    const order = orderRes.data;
    
    // Simulate what the frontend does:
    const orderId = order.id || order; // If order is 5, order.id is undefined, so orderId becomes 5!
    console.log("orderId is:", orderId);

    console.log("2. Crear Detalle");
    await axios.post('http://localhost:5041/api/v1/orderDetails', {
      orderId: orderId,
      scheduledDeliveryDate: new Date(payload.scheduledDeliveryDate).toISOString(),
      shippingDate: new Date().toISOString()
    });

    console.log("3. Crear Items");
    await Promise.all(
      payload.items.map((item) => 
        axios.post('http://localhost:5041/api/v1/order_items', {
          orderId: orderId,
          productId: item.productId,
          orderedQuantity: item.orderedQuantity,
          deliveredQuantity: item.deliveredQuantity
        })
      )
    );
    console.log("All success");
  } catch (err) {
    console.error("Failed:", err.response?.data || err.message);
  }
}
testApi();
