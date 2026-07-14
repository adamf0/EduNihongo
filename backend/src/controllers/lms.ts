import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../middleware/auth";
import { sanitizeObject } from "../utils/sanitize";

const prisma = new PrismaClient();

// ================= ASSIGNMENTS CRUD =================

export const getAssignments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { moduleId, kanjiId } = req.query;
    
    const whereClause: any = {};
    if (moduleId) whereClause.moduleId = parseInt(moduleId as string, 10);
    if (kanjiId) whereClause.kanjiId = parseInt(kanjiId as string, 10);

    const assignments = await prisma.assignment.findMany({
      where: whereClause,
      include: {
        module: { select: { title: true } },
        kanji: { select: { character: true } },
        submissions: {
          where: req.user ? { userId: req.user.id } : undefined,
          select: { id: true, submittedAt: true, grade: true, feedback: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(assignments);
  } catch (error: any) {
    console.error("LMS getAssignments error:", error);
    res.status(500).json({ error: "Gagal mengambil data tugas." });
  }
};

export const createAssignment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    // Validate admin role
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({ error: "Akses ditolak: Hanya dosen yang dapat membuat tugas." });
    }

    const body = sanitizeObject(req.body);
    const { title, description, dueDate, moduleId, kanjiId } = body;

    if (!title || !description) {
      return res.status(400).json({ error: "Judul dan deskripsi tugas wajib diisi." });
    }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        moduleId: moduleId ? parseInt(moduleId, 10) : null,
        kanjiId: kanjiId ? parseInt(kanjiId, 10) : null,
      }
    });

    res.status(201).json(assignment);
  } catch (error: any) {
    console.error("LMS createAssignment error:", error);
    res.status(500).json({ error: "Gagal membuat tugas baru." });
  }
};

export const updateAssignment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    // Validate admin role
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({ error: "Akses ditolak." });
    }

    const { id } = req.params;
    const body = sanitizeObject(req.body);
    const { title, description, dueDate, moduleId, kanjiId } = body;

    if (!title || !description) {
      return res.status(400).json({ error: "Judul dan deskripsi wajib diisi." });
    }

    const assignment = await prisma.assignment.update({
      where: { id: parseInt(id, 10) },
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        moduleId: moduleId ? parseInt(moduleId, 10) : null,
        kanjiId: kanjiId ? parseInt(kanjiId, 10) : null,
      }
    });

    res.json(assignment);
  } catch (error: any) {
    console.error("LMS updateAssignment error:", error);
    res.status(500).json({ error: "Gagal memperbarui tugas." });
  }
};

export const deleteAssignment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    // Validate admin role
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({ error: "Akses ditolak." });
    }

    const { id } = req.params;
    await prisma.assignment.delete({
      where: { id: parseInt(id, 10) }
    });

    res.json({ message: "Tugas berhasil dihapus." });
  } catch (error: any) {
    console.error("LMS deleteAssignment error:", error);
    res.status(500).json({ error: "Gagal menghapus tugas." });
  }
};

// ================= SUBMISSIONS =================

export const getSubmissions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

    const { assignmentId } = req.query;

    const whereClause: any = {};
    if (assignmentId) whereClause.assignmentId = parseInt(assignmentId as string, 10);

    // If student, filter by their userId. If Admin/Lecturer, they can view all submissions.
    if (user.role !== "ADMIN") {
      whereClause.userId = user.id;
    }

    const submissions = await prisma.submission.findMany({
      where: whereClause,
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
        assignment: { select: { id: true, title: true, moduleId: true, kanjiId: true } }
      },
      orderBy: { submittedAt: "desc" }
    });

    res.json(submissions);
  } catch (error: any) {
    console.error("LMS getSubmissions error:", error);
    res.status(500).json({ error: "Gagal mengambil data pengumpulan tugas." });
  }
};

export const submitAssignment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const body = sanitizeObject(req.body);
    const { assignmentId, content } = body;

    if (!assignmentId || !content) {
      return res.status(400).json({ error: "Assignment ID dan konten jawaban wajib diisi." });
    }

    // Check if assignment exists
    const assignment = await prisma.assignment.findUnique({
      where: { id: parseInt(assignmentId, 10) }
    });
    if (!assignment) {
      return res.status(404).json({ error: "Tugas tidak ditemukan." });
    }

    // Upsert submission (allow student to update their submission if they re-submit)
    const existing = await prisma.submission.findFirst({
      where: {
        assignmentId: parseInt(assignmentId, 10),
        userId: req.user.id
      }
    });

    let submission;
    if (existing) {
      submission = await prisma.submission.update({
        where: { id: existing.id },
        data: {
          content,
          submittedAt: new Date(),
          grade: null, // Reset grade upon resubmission
          feedback: null // Reset feedback upon resubmission
        }
      });
    } else {
      submission = await prisma.submission.create({
        data: {
          assignmentId: parseInt(assignmentId, 10),
          userId: req.user.id,
          content
        }
      });
    }

    res.status(201).json(submission);
  } catch (error: any) {
    console.error("LMS submitAssignment error:", error);
    res.status(500).json({ error: "Gagal mengumpulkan tugas." });
  }
};

export const gradeSubmission = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    // Validate admin role
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({ error: "Akses ditolak." });
    }

    const { id } = req.params;
    const body = sanitizeObject(req.body);
    const { grade, feedback } = body;

    const submission = await prisma.submission.update({
      where: { id: parseInt(id, 10) },
      data: {
        grade: grade || null,
        feedback: feedback || null
      }
    });

    res.json(submission);
  } catch (error: any) {
    console.error("LMS gradeSubmission error:", error);
    res.status(500).json({ error: "Gagal memberikan nilai." });
  }
};

// ================= COMMENTS / DISCUSSIONS =================

export const getComments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { moduleId, kanjiId, assignmentId, submissionId } = req.query;

    const whereClause: any = {};
    if (moduleId) whereClause.moduleId = parseInt(moduleId as string, 10);
    if (kanjiId) whereClause.kanjiId = parseInt(kanjiId as string, 10);
    if (assignmentId) whereClause.assignmentId = parseInt(assignmentId as string, 10);
    if (submissionId) whereClause.submissionId = parseInt(submissionId as string, 10);

    // If no query parameters, return an error to prevent querying all comments
    if (Object.keys(whereClause).length === 0) {
      return res.status(400).json({ error: "Parameter penyaring wajib disertakan." });
    }

    const comments = await prisma.comment.findMany({
      where: whereClause,
      include: {
        user: { select: { id: true, name: true, role: true, avatar: true } }
      },
      orderBy: { createdAt: "asc" }
    });

    res.json(comments);
  } catch (error: any) {
    console.error("LMS getComments error:", error);
    res.status(500).json({ error: "Gagal mengambil komentar." });
  }
};

export const createComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const body = sanitizeObject(req.body);
    const { content, moduleId, kanjiId, assignmentId, submissionId } = body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Konten komentar wajib diisi." });
    }

    const comment = await prisma.comment.create({
      data: {
        userId: req.user.id,
        content,
        moduleId: moduleId ? parseInt(moduleId, 10) : null,
        kanjiId: kanjiId ? parseInt(kanjiId, 10) : null,
        assignmentId: assignmentId ? parseInt(assignmentId, 10) : null,
        submissionId: submissionId ? parseInt(submissionId, 10) : null,
      },
      include: {
        user: { select: { id: true, name: true, role: true, avatar: true } }
      }
    });

    res.status(201).json(comment);
  } catch (error: any) {
    console.error("LMS createComment error:", error);
    res.status(500).json({ error: "Gagal mengirim komentar baru." });
  }
};

export const deleteComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
    const commentId = parseInt(id, 10);

    const comment = await prisma.comment.findUnique({
      where: { id: commentId }
    });
    if (!comment) {
      return res.status(404).json({ error: "Komentar tidak ditemukan." });
    }

    // Check if owner or admin
    const currentUser = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (comment.userId !== req.user.id && (!currentUser || currentUser.role !== "ADMIN")) {
      return res.status(403).json({ error: "Akses ditolak: Hanya pemilik komentar atau admin yang dapat menghapusnya." });
    }

    await prisma.comment.delete({
      where: { id: commentId }
    });

    res.json({ message: "Komentar berhasil dihapus." });
  } catch (error: any) {
    console.error("LMS deleteComment error:", error);
    res.status(500).json({ error: "Gagal menghapus komentar." });
  }
};
