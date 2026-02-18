import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body as {
      items: Array<{
        prompt: string;
        goals?: string;
        imageData?: string;
      }>;
    };

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "At least one item is required." },
        { status: 400 }
      );
    }

    if (items.length > 20) {
      return NextResponse.json(
        { error: "Maximum 20 items per batch." },
        { status: 400 }
      );
    }

    const results: Array<{ index: number; result?: string; error?: string }> =
      [];

    const baseUrl =
      request.headers.get("x-forwarded-proto") && request.headers.get("host")
        ? `${request.headers.get("x-forwarded-proto")}://${request.headers.get("host")}`
        : request.nextUrl.origin;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      try {
        const response = await fetch(`${baseUrl}/api/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: item.prompt,
            goals: item.goals,
            imageData: item.imageData,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          results.push({ index: i, result: data.result });
        } else {
          results.push({ index: i, error: data.error || "Generation failed" });
        }
      } catch (err: unknown) {
        results.push({
          index: i,
          error: err instanceof Error ? err.message : "Request failed",
        });
      }
    }

    return NextResponse.json({ results });
  } catch (error: unknown) {
    console.error("Batch generation error:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
