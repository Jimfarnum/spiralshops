// Mock retailer applications storage
const retailerApplications = new Map();

export async function applyRetailer(req, res) {
  try {
    const { business_name, categories, shipping_free_us, contact } = req.body;

    const applicationId = `RTL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const application = {
      id: applicationId,
      business_name,
      categories,
      shipping_free_us,
      contact,
      status: 'submitted',
      submittedAt: new Date().toISOString()
    };

    retailerApplications.set(applicationId, application);

    res.status(201).json({
      success: true,
      data: { applicationId, status: 'submitted' }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to submit retailer application'
    });
  }
}

export async function listRetailerApplications(req, res) {
  try {
    const applications = Array.from(retailerApplications.values());

    res.json({
      success: true,
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch retailer applications'
    });
  }
}

export async function approveRetailer(req, res) {
  try {
    const { id } = req.params;
    const application = retailerApplications.get(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    application.status = 'approved';
    application.approvedAt = new Date().toISOString();
    retailerApplications.set(id, application);

    res.json({
      success: true,
      data: { applicationId: id, status: 'approved' }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to approve retailer application'
    });
  }
}