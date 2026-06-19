import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { reportService } from "@/services/reportService";

export async function GET(request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: "Silakan login terlebih dahulu" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "SEMUA";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;

    const result = await reportService.getNasabahHistory(
      currentUser.id_user,
      type,
      page,
      limit
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}