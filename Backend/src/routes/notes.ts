import { Router } from "express";
import Note from "../models/Note";

const router = Router();

// Create Note
router.post("/", async (req, res) => {
  try {
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// Get Notes
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find().sort({
      isPinned: -1,
      order: 1,
      createdAt: -1,
    }); // order is used
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// Update note order (bulk update)
// routes/notes.ts

router.put("/reorder", async (req, res) => {
  try {
    const { orderedIds } = req.body;

    if (!orderedIds || !Array.isArray(orderedIds)) {
      return res.status(400).json({ error: "orderedIds must be an array" });
    }

    // Update order for each note in DB
    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { order: index },
      },
    }));

    await Note.bulkWrite(bulkOps); // Efficient bulk update

    res.json({ success: true });
  } catch (err: any) {
    console.error("🔥 Reorder error:", err);
    res.status(500).json({ error: "Update failed", details: err.message });
  }
});


// Get One Note
router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    res.json(note);
  } catch (err) {
    res.status(404).json({ error: "Note not found" });
  }
});



// Update Note
router.put("/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(note);
  } catch (err) {
    res.status(400).json({ error: "Update failed" });
  }
});

// Delete Note
router.delete("/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Delete failed" });
  }
});

export default router;
