// Mock shipments storage
const shipments = new Map();

export async function createShipment(req, res) {
  try {
    const { orderId, carrier, tracking } = req.body;

    const shipmentId = `SHP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const shipment = {
      id: shipmentId,
      orderId,
      carrier,
      tracking,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    shipments.set(shipmentId, shipment);

    res.status(201).json({
      success: true,
      data: { id: shipmentId, tracking, status: 'created' }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create shipment'
    });
  }
}

export async function listShipmentsByOrder(req, res) {
  try {
    const { orderId } = req.params;
    const orderShipments = Array.from(shipments.values())
      .filter(shipment => shipment.orderId === orderId);

    res.json({
      success: true,
      data: orderShipments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order shipments'
    });
  }
}

export async function trackShipment(req, res) {
  try {
    const { tracking } = req.body;

    // Mock tracking data
    const trackingInfo = {
      tracking,
      status: 'in_transit',
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      events: [
        {
          status: 'picked_up',
          location: 'Origin Facility',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
          status: 'in_transit',
          location: 'Distribution Center',
          timestamp: new Date().toISOString()
        }
      ]
    };

    res.json({
      success: true,
      data: trackingInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to track shipment'
    });
  }
}