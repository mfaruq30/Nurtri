// GET /api/plate/get?year=2026&month=4
// Returns saved plates for a given month, keyed by date string.
import { MongoClient } from "mongodb";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const year_val  = searchParams.get("year");
    const month = searchParams.get("month")

    if (!year_val || !month) {
        return Response.json({ error: "year and month are required" }, { status: 400 });
    }

    const prefix = `${year_val}-${String(Number(month)).padStart(2, "0")}`;
    const client = new MongoClient(process.env.MONGO_URI!);

    try {
        await client.connect();
        const plates: any = await client
            .db("nurtri")
            .collection("plates")
            .find({ date: { $regex: `^${prefix}` } })
            .toArray();

        const result: Record<string, object> = {};
        for (const p of plates) {
            result[p.date] = {
                calories: p.totals?.kcal     ?? 0,
                protein:  p.totals?.protein  ?? 0,
                carbs:    p.totals?.carbs    ?? 0,
                fat:      p.totals?.fat      ?? 0,
                sugar:    p.totals?.sugar    ?? 0
            };
        }
        return Response.json(result);
    } catch (e) {
        console.error("Failed to fetch plates:", e)
        return Response.json({}, { status: 500 });
    } finally {
        await client.close();
    }
}
