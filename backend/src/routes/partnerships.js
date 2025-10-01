// Mock partnerships storage
const partnerships = new Map();

export async function upsertPartnership(req, res) {
  try {
    const { partner, type, tiers } = req.body;

    const partnershipId = `${partner}_${type}`.toLowerCase().replace(/\s+/g, '_');
    const partnership = {
      id: partnershipId,
      partner,
      type,
      tiers,
      updatedAt: new Date().toISOString()
    };

    partnerships.set(partnershipId, partnership);

    res.json({
      success: true,
      data: { partnershipId, partner, type }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to upsert partnership'
    });
  }
}

export async function getPartnership(req, res) {
  try {
    const { type, partner } = req.query;
    const partnershipId = `${partner}_${type}`.toLowerCase().replace(/\s+/g, '_');
    
    const partnership = partnerships.get(partnershipId);

    if (!partnership) {
      return res.status(404).json({
        success: false,
        error: 'Partnership not found'
      });
    }

    res.json({
      success: true,
      data: partnership
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch partnership'
    });
  }
}

export async function listPartnerships(req, res) {
  try {
    const allPartnerships = Array.from(partnerships.values());

    res.json({
      success: true,
      data: allPartnerships
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to list partnerships'
    });
  }
}

export async function listPartnershipsByType(req, res) {
  try {
    const { type } = req.params;
    const filteredPartnerships = Array.from(partnerships.values())
      .filter(p => p.type === type);

    res.json({
      success: true,
      data: filteredPartnerships
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to list partnerships by type'
    });
  }
}