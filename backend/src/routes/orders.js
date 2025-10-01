// Mock orders storage
const orders = new Map();

export async function createOrder(req, res) {
  try {
    const { retailerId, items, subtotal, shippingFee, shippingAddress, mode } = req.body;

    const orderId = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const order = {
      id: orderId,
      retailerId,
      items,
      subtotal,
      shippingFee,
      total: subtotal + shippingFee,
      shippingAddress,
      mode,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.set(orderId, order);

    res.status(201).json({
      success: true,
      data: { id: orderId, status: 'created' }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create order'
    });
  }
}

export async function getOrderById(req, res) {
  try {
    const { id } = req.params;
    const order = orders.get(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order'
    });
  }
}

export async function listOrdersByRetailer(req, res) {
  try {
    const { retailerId } = req.params;
    const retailerOrders = Array.from(orders.values())
      .filter(order => order.retailerId === retailerId);

    res.json({
      success: true,
      data: retailerOrders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch retailer orders'
    });
  }
}