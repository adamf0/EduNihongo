import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../middleware/auth";
import { sanitizeObject } from "../utils/sanitize";

const prisma = new PrismaClient();

// ================= TASKS (ASSIGNMENTS) CRUD =================

export const getAssignments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { moduleId, kanjiId } = req.query;
    
    const whereClause: any = {};
    if (moduleId) whereClause.moduleId = parseInt(moduleId as string, 10);
    if (kanjiId) whereClause.kanjiId = parseInt(kanjiId as string, 10);

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        Module: { select: { title: true } },
        Kanji: { select: { character: true } },
        TaskSubmission: {
          where: req.user ? { userId: req.user.id } : undefined,
          select: { id: true, submittedAt: true, grade: true, feedback: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // Map `TaskSubmission` to `submissions` to match the frontend expectations
    const assignments = tasks.map(t => ({
      ...t,
      submissions: t.TaskSubmission
    }));

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

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        moduleId: moduleId ? parseInt(moduleId, 10) : null,
        kanjiId: kanjiId ? parseInt(kanjiId, 10) : null,
      }
    });

    res.status(201).json(task);
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

    const task = await prisma.task.update({
      where: { id: parseInt(id, 10) },
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        moduleId: moduleId ? parseInt(moduleId, 10) : null,
        kanjiId: kanjiId ? parseInt(kanjiId, 10) : null,
      }
    });

    res.json(task);
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
    await prisma.task.delete({
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
    if (assignmentId) whereClause.taskId = parseInt(assignmentId as string, 10);

    // If student, filter by their userId. If Admin/Lecturer, they can view all submissions.
    if (user.role !== "ADMIN") {
      whereClause.userId = user.id;
    }

    const taskSubmissions = await prisma.taskSubmission.findMany({
      where: whereClause,
      include: {
        User: { select: { id: true, name: true, email: true, avatar: true } },
        Task: { select: { id: true, title: true, moduleId: true, kanjiId: true } }
      },
      orderBy: { submittedAt: "desc" }
    });

    // Map keys to match frontend (user and assignment fields instead of capitalized User and Task)
    const submissions = taskSubmissions.map(s => ({
      ...s,
      user: s.User,
      assignment: s.Task
    }));

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

    // Check if task exists
    const task = await prisma.task.findUnique({
      where: { id: parseInt(assignmentId, 10) }
    });
    if (!task) {
      return res.status(404).json({ error: "Tugas tidak ditemukan." });
    }

    // Upsert submission
    const existing = await prisma.taskSubmission.findFirst({
      where: {
        taskId: parseInt(assignmentId, 10),
        userId: req.user.id
      }
    });

    let submission;
    if (existing) {
      submission = await prisma.taskSubmission.update({
        where: { id: existing.id },
        data: {
          content,
          submittedAt: new Date(),
          grade: null,
          feedback: null
        }
      });
    } else {
      submission = await prisma.taskSubmission.create({
        data: {
          taskId: parseInt(assignmentId, 10),
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

    const submission = await prisma.taskSubmission.update({
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
    const { moduleId, kanjiId, assignmentId } = req.query;

    let comments: any[] = [];

    if (assignmentId) {
      const taskComments = await prisma.taskComment.findMany({
        where: { taskId: parseInt(assignmentId as string, 10) },
        include: {
          User: { select: { id: true, name: true, role: true, avatar: true } }
        },
        orderBy: { createdAt: "asc" }
      });
      comments = taskComments.map(c => ({
        ...c,
        user: c.User
      }));
    } else {
      // If fetching general module or kanji discussions, find or create a default "Discussion Board" Task
      // specifically for that module or kanji!
      const targetWhere: any = {};
      if (moduleId) targetWhere.moduleId = parseInt(moduleId as string, 10);
      if (kanjiId) targetWhere.kanjiId = parseInt(kanjiId as string, 10);

      // Find tasks matching target
      const tasks = await prisma.task.findMany({ where: targetWhere });
      let discussTask = tasks.find(t => t.title.includes("Forum Diskusi"));

      if (!discussTask) {
        // Create a default discussion board task
        discussTask = await prisma.task.create({
          data: {
            title: "Forum Diskusi & Tanya Jawab",
            description: "Gunakan thread ini untuk berdiskusi, bertanya, dan berbagi informasi terkait materi.",
            moduleId: moduleId ? parseInt(moduleId as string, 10) : null,
            kanjiId: kanjiId ? parseInt(kanjiId as string, 10) : null,
          }
        });
      }

      const taskComments = await prisma.taskComment.findMany({
        where: { taskId: discussTask.id },
        include: {
          User: { select: { id: true, name: true, role: true, avatar: true } }
        },
        orderBy: { createdAt: "asc" }
      });
      comments = taskComments.map(c => ({
        ...c,
        user: c.User
      }));
    }

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
    const { content, moduleId, kanjiId, assignmentId } = body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Konten komentar wajib diisi." });
    }

    let targetTaskId: number;

    if (assignmentId) {
      targetTaskId = parseInt(assignmentId, 10);
    } else {
      // Find or create discussion board Task
      const targetWhere: any = {};
      if (moduleId) targetWhere.moduleId = parseInt(moduleId, 10);
      if (kanjiId) targetWhere.kanjiId = parseInt(kanjiId, 10);

      const tasks = await prisma.task.findMany({ where: targetWhere });
      let discussTask = tasks.find(t => t.title.includes("Forum Diskusi"));

      if (!discussTask) {
        discussTask = await prisma.task.create({
          data: {
            title: "Forum Diskusi & Tanya Jawab",
            description: "Gunakan thread ini untuk berdiskusi, bertanya, dan berbagi informasi terkait materi.",
            moduleId: moduleId ? parseInt(moduleId, 10) : null,
            kanjiId: kanjiId ? parseInt(kanjiId, 10) : null,
          }
        });
      }
      targetTaskId = discussTask.id;
    }

    const comment = await prisma.taskComment.create({
      data: {
        userId: req.user.id,
        taskId: targetTaskId,
        content
      },
      include: {
        User: { select: { id: true, name: true, role: true, avatar: true } }
      }
    });

    res.status(201).json({
      ...comment,
      user: comment.User
    });
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

    const comment = await prisma.taskComment.findUnique({
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

    await prisma.taskComment.delete({
      where: { id: commentId }
    });

    res.json({ message: "Komentar berhasil dihapus." });
  } catch (error: any) {
    console.error("LMS deleteComment error:", error);
    res.status(500).json({ error: "Gagal menghapus komentar." });
  }
};
