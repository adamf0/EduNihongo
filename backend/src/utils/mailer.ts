import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create reusable transporter object using the SMTP transport config provided by the user
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // 587 uses TLS (upgrade via STARTTLS)
  auth: {
    user: "adamilkom00@gmail.com",
    pass: "ybgpxjsnevdiqgmp",
  },
});

export const addEmailToQueue = async (to: string, subject: string, html: string) => {
  try {
    await prisma.jobQueue.create({
      data: {
        jobType: "SEND_EMAIL",
        payload: JSON.stringify({ to, subject, html }),
        status: "PENDING",
      },
    });
  } catch (error) {
    console.error("Gagal menambahkan email ke antrean:", error);
  }
};

// Process jobs in queue
export const startQueueWorker = () => {
  console.log("Memulai background worker antrean email...");
  
  setInterval(async () => {
    try {
      // Find one PENDING job at a time to process
      const job = await prisma.jobQueue.findFirst({
        where: { status: "PENDING" },
        orderBy: { createdAt: "asc" },
      });

      if (!job) return;

      // Mark as PROCESSING
      const updatedJob = await prisma.jobQueue.update({
        where: { id: job.id },
        data: {
          status: "PROCESSING",
          attempts: { increment: 1 },
        },
      });

      // Execute job
      if (job.jobType === "SEND_EMAIL") {
        const { to, subject, html } = JSON.parse(job.payload);

        try {
          await transporter.sendMail({
            from: '"EduNihongo" <adamilkom00@gmail.com>',
            to,
            subject,
            html,
          });

          // Mark as COMPLETED
          await prisma.jobQueue.update({
            where: { id: job.id },
            data: { status: "COMPLETED" },
          });
          console.log(`Email berhasil dikirim ke ${to} (Job ID: ${job.id})`);
        } catch (mailError: any) {
          console.error(`Gagal mengirim email ke ${to}:`, mailError);

          // Mark as FAILED or retry later
          const nextStatus = updatedJob.attempts >= 3 ? "FAILED" : "PENDING";
          await prisma.jobQueue.update({
            where: { id: job.id },
            data: {
              status: nextStatus,
              errorMessage: mailError.message || "Unknown SMTP error",
            },
          });
        }
      }
    } catch (workerError) {
      console.error("Worker Queue Error:", workerError);
    }
  }, 5000); // Poll every 5 seconds
};
