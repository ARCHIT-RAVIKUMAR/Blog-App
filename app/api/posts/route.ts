import { NextResponse } from "next/server";
import { getPosts } from "@/lib/posts";

export async function GET() {
  try {
    return NextResponse.json(await getPosts(), {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
    });
  } catch {
    return NextResponse.json({ error: "Could not load posts" }, { status: 502 });
  }
}
