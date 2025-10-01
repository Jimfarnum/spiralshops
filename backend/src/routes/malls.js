// Mock mall applications storage
const mallApplications = new Map();

export async function applyMall(req, res) {
  try {
    const { mall_name, city, state, contact, wants_spiral_center } = req.body;

    const applicationId = `MLL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const application = {
      id: applicationId,
      mall_name,
      city,
      state,
      contact,
      wants_spiral_center,
      status: 'submitted',
      submittedAt: new Date().toISOString()
    };

    mallApplications.set(applicationId, application);

    res.status(201).json({
      success: true,
      data: { applicationId, status: 'submitted' }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to submit mall application'
    });
  }
}

export async function listMallApplications(req, res) {
  try {
    const applications = Array.from(mallApplications.values());

    res.json({
      success: true,
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mall applications'
    });
  }
}

export async function approveMall(req, res) {
  try {
    const { id } = req.params;
    const application = mallApplications.get(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    application.status = 'approved';
    application.approvedAt = new Date().toISOString();
    mallApplications.set(id, application);

    res.json({
      success: true,
      data: { applicationId: id, status: 'approved' }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to approve mall application'
    });
  }
}