import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../middleware/auth";
import { sanitizeObject } from "../utils/sanitize";

const prisma = new PrismaClient();

// ================= ASSIGNMENTS (TASKS) CRUD =================

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
          select: { id: true, submittedAt: true, grade: true, feedback: true, fileUrl: true, submissionLink: true, submissionType: true, content: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // Map fields back to frontend expected keys (e.g. assignments & submissions)
    const formatted = tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      createdAt: task.createdAt,
      moduleId: task.moduleId,
      kanjiId: task.kanjiId,
      fileUrl: task.fileUrl,
      materialsData: task.materialsData,
      module: task.Module,
      kanji: task.Kanji,
      submissions: task.TaskSubmission
    }));

    res.json(formatted);
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
    const { title, description, dueDate, moduleId, kanjiId, youtubeLink, gdriveLink } = body;

    if (!title || !description) {
      return res.status(400).json({ error: "Judul dan deskripsi tugas wajib diisi." });
    }

    // Process uploaded files
    const files = req.files as Express.Multer.File[] || [];
    const uploadedMaterials = files.map(f => ({
      type: "file",
      url: `/uploads/${f.filename}`,
      name: f.originalname
    }));

    // Add links as alternatives
    const materials = [...uploadedMaterials];
    if (youtubeLink && youtubeLink.trim()) {
      materials.push({ type: "youtube", url: youtubeLink.trim(), name: "Video YouTube Pendukung" });
    }
    if (gdriveLink && gdriveLink.trim()) {
      materials.push({ type: "gdrive", url: gdriveLink.trim(), name: "Folder Google Drive Pendukung" });
    }

    const materialsData = JSON.stringify(materials);

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        moduleId: moduleId ? parseInt(moduleId, 10) : null,
        kanjiId: kanjiId ? parseInt(kanjiId, 10) : null,
        materialsData: materialsData,
        fileUrl: files[0] ? `/uploads/${files[0].filename}` : null // fallback compatibility
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
    const { title, description, dueDate, moduleId, kanjiId, youtubeLink, gdriveLink, keepMaterials } = body;

    if (!title || !description) {
      return res.status(400).json({ error: "Judul dan deskripsi wajib diisi." });
    }

    // Process keep materials
    let materials: any[] = [];
    if (keepMaterials) {
      try {
        materials = JSON.parse(keepMaterials);
      } catch (e) {
        materials = [];
      }
    }

    // Process newly uploaded files
    const files = req.files as Express.Multer.File[] || [];
    const newFiles = files.map(f => ({
      type: "file",
      url: `/uploads/${f.filename}`,
      name: f.originalname
    }));

    materials = [...materials, ...newFiles];

    // Append links
    if (youtubeLink && youtubeLink.trim()) {
      // remove old youtube if any or just push
      materials = materials.filter(m => m.type !== "youtube");
      materials.push({ type: "youtube", url: youtubeLink.trim(), name: "Video YouTube Pendukung" });
    } else if (youtubeLink === "") {
      materials = materials.filter(m => m.type !== "youtube");
    }

    if (gdriveLink && gdriveLink.trim()) {
      // remove old gdrive if any or just push
      materials = materials.filter(m => m.type !== "gdrive");
      materials.push({ type: "gdrive", url: gdriveLink.trim(), name: "Folder Google Drive Pendukung" });
    } else if (gdriveLink === "") {
      materials = materials.filter(m => m.type !== "gdrive");
    }

    const materialsData = JSON.stringify(materials);

    // fallback fileUrl compatibility (first file in materials list)
    const firstFile = materials.find(m => m.type === "file");
    const fileUrl = firstFile ? firstFile.url : null;

    const task = await prisma.task.update({
      where: { id: parseInt(id, 10) },
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        moduleId: moduleId ? parseInt(moduleId, 10) : null,
        kanjiId: kanjiId ? parseInt(kanjiId, 10) : null,
        materialsData: materialsData,
        fileUrl: fileUrl
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

    const submissions = await prisma.taskSubmission.findMany({
      where: whereClause,
      include: {
        User: { select: { id: true, name: true, email: true, avatar: true } },
        Task: { select: { id: true, title: true, moduleId: true, kanjiId: true } }
      },
      orderBy: { submittedAt: "desc" }
    });

    // Map keys for frontend
    const formatted = submissions.map(sub => ({
      id: sub.id,
      assignmentId: sub.taskId,
      userId: sub.userId,
      content: sub.content,
      submittedAt: sub.submittedAt,
      grade: sub.grade,
      feedback: sub.feedback,
      fileUrl: sub.fileUrl,
      submissionLink: sub.submissionLink,
      submissionType: sub.submissionType,
      user: sub.User,
      assignment: sub.Task
    }));

    res.json(formatted);
  } catch (error: any) {
    console.error("LMS getSubmissions error:", error);
    res.status(500).json({ error: "Gagal mengambil data pengumpulan tugas." });
  }
};

export const submitAssignment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const body = sanitizeObject(req.body);
    const { assignmentId, content, submissionType, submissionLink } = body;

    if (!assignmentId) {
      return res.status(400).json({ error: "Assignment ID wajib diisi." });
    }

    const taskId = parseInt(assignmentId, 10);

    // Check if task exists
    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });
    if (!task) {
      return res.status(404).json({ error: "Tugas tidak ditemukan." });
    }

    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // determine type and links
    const type = submissionType || "text";
    const link = (type === "youtube" || type === "gdrive") ? submissionLink : null;
    const finalFileUrl = (type === "file") ? fileUrl : null;

    // Upsert submission
    const existing = await prisma.taskSubmission.findFirst({
      where: {
        taskId,
        userId: req.user.id
      }
    });

    let submission;
    if (existing) {
      submission = await prisma.taskSubmission.update({
        where: { id: existing.id },
        data: {
          content: content || "",
          submittedAt: new Date(),
          grade: null,
          feedback: null,
          submissionType: type,
          submissionLink: link,
          fileUrl: finalFileUrl // if student re-submitted link, fileUrl becomes null
        }
      });
    } else {
      submission = await prisma.taskSubmission.create({
        data: {
          taskId,
          userId: req.user.id,
          content: content || "",
          submissionType: type,
          submissionLink: link,
          fileUrl: finalFileUrl
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

// ================= COMMENTS / DISCUSSIONS (TASK COMMENTS) =================

export const getComments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { assignmentId } = req.query;

    if (!assignmentId) {
      return res.status(400).json({ error: "Parameter assignmentId wajib disertakan." });
    }

    const comments = await prisma.taskComment.findMany({
      where: { taskId: parseInt(assignmentId as string, 10) },
      include: {
        User: { select: { id: true, name: true, role: true, avatar: true } }
      },
      orderBy: { createdAt: "asc" }
    });

    // Map keys for frontend
    const formatted = comments.map(comm => ({
      id: comm.id,
      assignmentId: comm.taskId,
      userId: comm.userId,
      content: comm.content,
      createdAt: comm.createdAt,
      user: comm.User
    }));

    res.json(formatted);
  } catch (error: any) {
    console.error("LMS getComments error:", error);
    res.status(500).json({ error: "Gagal mengambil komentar." });
  }
};

export const createComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const body = sanitizeObject(req.body);
    const { content, assignmentId } = body;

    if (!content || !content.trim() || !assignmentId) {
      return res.status(400).json({ error: "Konten komentar dan assignmentId wajib diisi." });
    }

    const comment = await prisma.taskComment.create({
      data: {
        userId: req.user.id,
        taskId: parseInt(assignmentId, 10),
        content
      },
      include: {
        User: { select: { id: true, name: true, role: true, avatar: true } }
      }
    });

    const formatted = {
      id: comment.id,
      assignmentId: comment.taskId,
      userId: comment.userId,
      content: comment.content,
      createdAt: comment.createdAt,
      user: comment.User
    };

    res.status(201).json(formatted);
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
