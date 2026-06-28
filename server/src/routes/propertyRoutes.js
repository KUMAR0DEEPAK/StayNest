import express from "express";
import {
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty
} from "../controllers/propertyController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// public routes (Stduent can view all properties)
router.get("/", getAllProperties);
router.get("/:id", getPropertyById);

// private routes (Owner can create, update, delete and view their properties)
router.post("/", protect, authorize('OWNER'),
createProperty  );
router.put("/:id", protect, authorize('OWNER'),
updateProperty);
router.delete("/:id", protect, authorize('OWNER','ADMIN'),
deleteProperty);

export default router;