"use client";

import { useState } from "react";
import Link from "next/link";
import DailyOverview from "@/app/components/component-3/DailyOverview";

export default function Page() {
    const [food, setFood] = useState("");

    const totals = {
        calories: 1800,
        protein: 120,
        carbs: 200,
        fat: 60,
        sugar: 30,
    };

    return (
        <div style={{ padding: "2rem" }}>
            <input
                type="text"
                value={food}
                placeholder="Search for a food..."
                onChange={(e) => setFood(e.target.value)}
            />
            <Link href={`/${food}`}>Search</Link>
            <DailyOverview totals={totals} />
        </div>
    );
}