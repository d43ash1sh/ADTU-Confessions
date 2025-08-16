import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertConfessionSchema, adminLoginSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "adtu-confessions-secret-key";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// Initialize admin user if not exists
async function initializeAdmin() {
  try {
    const existingAdmin = await storage.getAdminByUsername(ADMIN_USERNAME);
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await storage.createAdmin({
        username: ADMIN_USERNAME,
        password: hashedPassword
      });
      console.log("Admin user initialized");
    }
  } catch (error) {
    console.error("Error initializing admin:", error);
  }
}

// Middleware to verify admin JWT
function verifyAdmin(req: any, res: any, next: any) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  await initializeAdmin();

  // Get all approved confessions with optional filtering
  app.get("/api/confessions", async (req, res) => {
    try {
      const { search, category } = req.query;
      const confessions = await storage.getConfessions(
        'approved', 
        search as string, 
        category as string
      );
      res.json(confessions);
    } catch (error) {
      console.error("Error fetching confessions:", error);
      res.status(500).json({ message: "Failed to fetch confessions" });
    }
  });

  // Get confession stats
  app.get("/api/confessions/stats", async (req, res) => {
    try {
      const stats = await storage.getConfessionStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Submit new confession
  app.post("/api/confessions", async (req, res) => {
    try {
      const validatedData = insertConfessionSchema.parse(req.body);
      const confession = await storage.createConfession(validatedData);
      res.status(201).json({ 
        message: "Confession submitted successfully and is pending review",
        id: confession.id 
      });
    } catch (error: any) {
      console.error("Error submitting confession:", error);
      if (error.errors) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to submit confession" });
      }
    }
  });

  // Update confession reactions
  app.patch("/api/confessions/:id/reactions", async (req, res) => {
    try {
      const { id } = req.params;
      const { reactions } = req.body;
      
      if (!reactions || typeof reactions !== 'object') {
        return res.status(400).json({ message: "Invalid reactions data" });
      }

      const confession = await storage.updateConfessionReactions(id, JSON.stringify(reactions));
      
      if (!confession) {
        return res.status(404).json({ message: "Confession not found" });
      }

      res.json(confession);
    } catch (error) {
      console.error("Error updating reactions:", error);
      res.status(500).json({ message: "Failed to update reactions" });
    }
  });

  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = adminLoginSchema.parse(req.body);
      
      const admin = await storage.getAdminByUsername(username);
      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: admin.id, username: admin.username },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({ token, message: "Login successful" });
    } catch (error: any) {
      console.error("Error during admin login:", error);
      if (error.errors) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Login failed" });
      }
    }
  });

  // Get pending confessions (admin only)
  app.get("/api/admin/confessions", verifyAdmin, async (req, res) => {
    try {
      const confessions = await storage.getConfessions('pending');
      res.json(confessions);
    } catch (error) {
      console.error("Error fetching pending confessions:", error);
      res.status(500).json({ message: "Failed to fetch pending confessions" });
    }
  });

  // Approve confession (admin only)
  app.patch("/api/admin/confessions/:id/approve", verifyAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const confession = await storage.updateConfessionStatus(id, 'approved');
      
      if (!confession) {
        return res.status(404).json({ message: "Confession not found" });
      }

      res.json({ message: "Confession approved successfully", confession });
    } catch (error) {
      console.error("Error approving confession:", error);
      res.status(500).json({ message: "Failed to approve confession" });
    }
  });

  // Delete confession (admin only)
  app.delete("/api/admin/confessions/:id", verifyAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteConfession(id);
      
      if (!success) {
        return res.status(404).json({ message: "Confession not found" });
      }

      res.json({ message: "Confession deleted successfully" });
    } catch (error) {
      console.error("Error deleting confession:", error);
      res.status(500).json({ message: "Failed to delete confession" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
