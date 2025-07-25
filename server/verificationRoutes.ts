import { Router } from "express";
import { db } from "./db";
import multer from "multer";
import path from "path";
import fs from "fs";
import { 
  stores,
  users,
  retailers,
  insertStoreSchema
} from "@shared/schema";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { 
  sendRetailerConfirmation,
  sendAdminNotification,
  sendApprovalEmail,
  sendRejectionEmail
} from "./utils/email";

const router = Router();

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "public/uploads/verification");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `verification-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and documents are allowed.'));
    }
  }
});

// Store verification submission
router.post("/api/verify-store", upload.single('document'), async (req, res) => {
  try {
    const { storeName, address, phoneNumber, email, description, category, website } = req.body;
    const documentPath = req.file ? `/uploads/verification/${req.file.filename}` : null;

    // Validate required fields
    if (!storeName || !address || !phoneNumber || !email) {
      return res.status(400).json({ 
        error: "Missing required fields: storeName, address, phoneNumber, and email are required" 
      });
    }

    // Check if store already exists
    const existingStore = await db
      .select()
      .from(stores)
      .where(and(
        eq(stores.name, storeName),
        eq(stores.address, address)
      ))
      .limit(1);

    if (existingStore.length > 0) {
      return res.status(409).json({ error: "Store with this name and address already exists" });
    }

    // Create verification record with pending status
    const newStore = {
      name: storeName,
      description: description || `Local business at ${address}`,
      category: category || 'General',
      address,
      phone: phoneNumber,
      email,
      zipCode: address.split(' ').pop() || '00000', // Extract ZIP from address
      website: website || null,
      imageUrl: null, // Will be updated after verification
      isVerified: false, // Pending verification
      verificationStatus: 'pending',
      verificationDocumentPath: documentPath,
    };

    const [store] = await db.insert(stores).values(newStore).returning();

    // Send verification submitted email
    try {
      await sendRetailerConfirmation(email, storeName);
      console.log(`Verification email sent to: ${email}`);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Continue with response even if email fails
    }

    // Send admin notification
    try {
      await sendAdminNotification('admin@spiral.app', storeName);
      console.log(`Admin notification sent for store: ${storeName}`);
    } catch (emailError) {
      console.error("Failed to send admin notification:", emailError);
    }

    // Log verification submission
    console.log(`Verification submitted for store: ${storeName} at ${address}`);
    console.log(`Document uploaded: ${documentPath}`);
    console.log(`Store ID: ${store.id}`);

    res.status(200).json({ 
      message: "Store verification submitted successfully",
      storeId: store.id,
      status: "pending",
      estimatedReviewTime: "2-5 business days"
    });

  } catch (error) {
    console.error("Store verification error:", error);
    res.status(500).json({ error: "Failed to submit store verification" });
  }
});

// Get verification status
router.get("/api/verify-store/:storeId/status", async (req, res) => {
  try {
    const { storeId } = req.params;

    const store = await db
      .select({
        id: stores.id,
        name: stores.name,
        verificationStatus: stores.verificationStatus,
        isVerified: stores.isVerified,
        submittedAt: stores.submittedAt,
        reviewedAt: stores.reviewedAt,
        rejectionReason: stores.rejectionReason,
      })
      .from(stores)
      .where(eq(stores.id, parseInt(storeId)))
      .limit(1);

    if (store.length === 0) {
      return res.status(404).json({ error: "Store not found" });
    }

    res.json(store[0]);
  } catch (error) {
    console.error("Error checking verification status:", error);
    res.status(500).json({ error: "Failed to check verification status" });
  }
});

// Admin: Get pending verifications
router.get("/api/admin/pending-verifications", async (req, res) => {
  try {
    const pendingStores = await db
      .select({
        id: stores.id,
        name: stores.name,
        description: stores.description,
        category: stores.category,
        address: stores.address,
        phoneNumber: stores.phoneNumber,
        email: stores.email,
        website: stores.website,
        verificationDocumentPath: stores.verificationDocumentPath,
        submittedAt: stores.submittedAt,
      })
      .from(stores)
      .where(eq(stores.verificationStatus, 'pending'))
      .orderBy(stores.submittedAt);

    res.json(pendingStores);
  } catch (error) {
    console.error("Error fetching pending verifications:", error);
    res.status(500).json({ error: "Failed to fetch pending verifications" });
  }
});

// Admin: Approve verification
router.post("/api/admin/approve-verification/:storeId", async (req, res) => {
  try {
    const { storeId } = req.params;
    const { imageUrl, rating, verificationTier } = req.body;

    const [updatedStore] = await db
      .update(stores)
      .set({
        isVerified: true,
        verificationStatus: 'approved',
        verificationTier: verificationTier || 'Local',
        reviewedAt: new Date(),
        imageUrl: imageUrl || null,
        rating: rating || 4.5,
      })
      .where(eq(stores.id, parseInt(storeId)))
      .returning();

    if (!updatedStore) {
      return res.status(404).json({ error: "Store not found" });
    }

    // Send approval email
    try {
      await sendApprovalEmail(updatedStore.email!, updatedStore.name);
      console.log(`Approval email sent to: ${updatedStore.email}`);
    } catch (emailError) {
      console.error("Failed to send approval email:", emailError);
    }

    console.log(`Store verified: ${updatedStore.name} (ID: ${updatedStore.id})`);

    res.json({ 
      message: "Store verification approved",
      store: updatedStore
    });
  } catch (error) {
    console.error("Error approving verification:", error);
    res.status(500).json({ error: "Failed to approve verification" });
  }
});

// Admin: Reject verification
router.post("/api/admin/reject-verification/:storeId", async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({ error: "Rejection reason is required" });
    }

    const [updatedStore] = await db
      .update(stores)
      .set({
        verificationStatus: 'rejected',
        reviewedAt: new Date(),
        rejectionReason,
      })
      .where(eq(stores.id, parseInt(storeId)))
      .returning();

    if (!updatedStore) {
      return res.status(404).json({ error: "Store not found" });
    }

    // Send rejection email  
    try {
      await sendRejectionEmail(updatedStore.email!, updatedStore.name, rejectionReason);
      console.log(`Rejection email sent to: ${updatedStore.email}`);
    } catch (emailError) {
      console.error("Failed to send rejection email:", emailError);
    }

    console.log(`Store verification rejected: ${updatedStore.name} (ID: ${updatedStore.id})`);
    console.log(`Reason: ${rejectionReason}`);

    res.json({ 
      message: "Store verification rejected",
      store: updatedStore
    });
  } catch (error) {
    console.error("Error rejecting verification:", error);
    res.status(500).json({ error: "Failed to reject verification" });
  }
});

export default router;