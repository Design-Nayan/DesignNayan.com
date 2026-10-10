import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET: Fetch all active finance records and immutable audit trail (Admin only)
export async function GET(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    const authHeader = request.headers.get("x-admin-auth");
    if (!admin && authHeader !== "true") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [records, logs] = await Promise.all([
      db.financeRecord.findMany({
        orderBy: { createdAt: "desc" },
      }),
      db.financeAuditLog.findMany({
        orderBy: { createdAt: "desc" },
      }),
    ]);

    // Format for frontend IncomeRecord and IncomeAuditLog
    const formattedRecords = records.map((r) => ({
      id: r.id,
      amount: r.amount,
      totalAmount: r.totalAmount || r.amount,
      pendingAmount: r.pendingAmount || 0,
      paymentStatus: (r.status as "PAID" | "PARTIAL" | "PENDING") || "PAID",
      dueDate: r.dueDate || undefined,
      category: r.category,
      clientName: r.clientName,
      clientPhone: r.clientPhone || undefined,
      projectDetails: r.projectDetails || "",
      date: r.date,
      paymentMethod: r.paymentMethod || "Bank Transfer",
      createdAt: r.createdAt.toISOString(),
    }));

    const formattedLogs = logs.map((l) => ({
      id: l.id,
      action: (l.action as "ADDED" | "EDITED" | "DELETED") || "ADDED",
      description: l.description,
      timestamp: l.timestamp,
      isoDate: l.isoDate || l.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      records: formattedRecords,
      logs: formattedLogs,
    });
  } catch (error) {
    console.error("Error fetching finances:", error);
    return NextResponse.json(
      { error: "Failed to fetch finances." },
      { status: 500 }
    );
  }
}

// POST: Add or update a transaction and append immutable audit log (Admin only)
export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    const authHeader = request.headers.get("x-admin-auth");
    if (!admin && authHeader !== "true") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { record, log } = body;

    if (!record || !record.clientName || !record.category) {
      return NextResponse.json(
        { error: "Missing required transaction details." },
        { status: 400 }
      );
    }

    const receivedAmount = Number(record.amount) || 0;
    const totalAmount = Number(record.totalAmount) || receivedAmount;
    const pendingAmount = Math.max(0, totalAmount - receivedAmount);
    const paymentStatus =
      pendingAmount === 0 ? "PAID" : receivedAmount > 0 ? "PARTIAL" : "PENDING";

    const recordId = record.id || `inc_${Date.now()}`;

    // Execute atomic write: upsert transaction + append audit log
    await db.$transaction(async (tx) => {
      await tx.financeRecord.upsert({
        where: { id: recordId },
        update: {
          clientName: String(record.clientName).trim(),
          category: record.category,
          amount: receivedAmount,
          totalAmount,
          pendingAmount,
          status: paymentStatus,
          paymentMethod: record.paymentMethod || "Bank Transfer",
          date: record.date || new Date().toISOString().split("T")[0],
          dueDate: record.dueDate || null,
          clientPhone: record.clientPhone ? String(record.clientPhone).trim() : null,
          projectDetails: record.projectDetails ? String(record.projectDetails).trim() : null,
        },
        create: {
          id: recordId,
          clientName: String(record.clientName).trim(),
          category: record.category,
          amount: receivedAmount,
          totalAmount,
          pendingAmount,
          status: paymentStatus,
          paymentMethod: record.paymentMethod || "Bank Transfer",
          date: record.date || new Date().toISOString().split("T")[0],
          dueDate: record.dueDate || null,
          clientPhone: record.clientPhone ? String(record.clientPhone).trim() : null,
          projectDetails: record.projectDetails ? String(record.projectDetails).trim() : null,
        },
      });

      if (log && log.description) {
        await tx.financeAuditLog.create({
          data: {
            id: log.id || `log_${Date.now()}`,
            action: log.action || "ADDED",
            description: log.description,
            timestamp: log.timestamp || new Date().toLocaleString(),
            isoDate: log.isoDate || new Date().toISOString(),
          },
        });
      }
    });

    return NextResponse.json({ success: true, recordId }, { status: 200 });
  } catch (error) {
    console.error("Error saving finance record:", error);
    return NextResponse.json(
      { error: "Failed to save finance record." },
      { status: 500 }
    );
  }
}

// DELETE: Remove transaction and append immutable audit log (Admin only)
export async function DELETE(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    const authHeader = request.headers.get("x-admin-auth");
    if (!admin && authHeader !== "true") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, log } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing record id" }, { status: 400 });
    }

    await db.$transaction(async (tx) => {
      await tx.financeRecord.deleteMany({
        where: { id },
      });

      if (log && log.description) {
        await tx.financeAuditLog.create({
          data: {
            id: log.id || `log_${Date.now()}`,
            action: "DELETED",
            description: log.description,
            timestamp: log.timestamp || new Date().toLocaleString(),
            isoDate: log.isoDate || new Date().toISOString(),
          },
        });
      }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting finance record:", error);
    return NextResponse.json(
      { error: "Failed to delete finance record." },
      { status: 500 }
    );
  }
}
