import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const FOOD_API_KEY = process.env.NUTRI_API_KEY;

export async function GET(request: Request): Promise<NextResponse> {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
        return NextResponse.json({ error: "No query provided" }, { status: 400 });
    }

    const res = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${FOOD_API_KEY}&query=${query}&dataType=Branded&pageSize=25&pageNumber=2&sortOrder=asc`
    );

    if (res.status !== 200) {
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);
}