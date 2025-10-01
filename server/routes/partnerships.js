import { getCloudant } from "../lib/cloudant.js";

export async function listPartnershipsByType(req, res) {
  const type = String(req.params.type || '');
  if (!type) return res.status(400).json({ error: 'type required' });
  
  try {
    const db = getCloudant();
    const result = await db.find('partnerships', { 
      selector: { type }, 
      limit: 200 
    });
    
    const partnerships = result.result?.docs || [];
    
    res.json({
      success: true,
      type,
      count: partnerships.length,
      partnerships
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to list partnerships",
      message: error.message
    });
  }
}