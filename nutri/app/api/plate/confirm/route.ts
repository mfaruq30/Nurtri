// app/api/plate/confirm/route.ts
// Mirza Faruq — POST /api/plate/confirm — saves today's plate to MongoDB
// Called from Component 2 (My Plate) when the user clicks "Confirm day →".

import { MongoClient } from "mongodb";

export async function POST(req: Request) {
    const body = await req.json();

    const client = new MongoClient(process.env.MONGO_URI!);
    try {
        await client.connect();

        // Insert the day's plate into the "plates" collection inside the
        // "nurtri" database. MongoDB auto-creates the collection if it does
        // not exist yet (lec-16 p.5).
        const result = await client.db("nurtri").collection("plates").insertOne({
            ...body,
            createdAt: new Date(),
        });

        return Response.json({ ok: true, id: result.insertedId });
    } catch (e) {
        console.error("Failed to save plate:", e);
        return Response.json({ ok: false }, { status: 500 });
    } finally {
        await client.close();
    }
}
