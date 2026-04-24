"use client";
import { useState } from "react";
import FoodSearch from "@/app/merge attempt/FoodSearch";
import MyPlate, { PlateItem } from "@/app/merge attempt/MyPlate";
import DailyOverview from "@/app/merge attempt/DailyOverview";
import CalendarOverview from "@/app/merge attempt/CalendarOverview";

export default function Home() {
    // Temporary mock data for DailyOverview
    const totals = {
        calories: 1800,
        protein: 120,
        carbs: 200,
        fat: 60,
        sugar: 30,
    };

    // Temporary mock data for Calendar
    const dailyData = {
        "2026-04-03": {
            calories: 1700,
            protein: 98,
            carbs: 210,
            fat: 58,
            sugar: 27,
        },
        "2026-04-04": {
            calories: 1900,
            protein: 124,
            carbs: 222,
            fat: 64,
            sugar: 31,
        },
        "2026-04-09": {
            calories: 1820,
            protein: 113,
            carbs: 201,
            fat: 60,
            sugar: 29,
        },
    };

    // Plate state lives here so FoodSearch can add to it (lift state up pattern)
    const [plateItems, setPlateItems] = useState<PlateItem[]>([
        { name: "Steak, sirloin (grilled)", qty: 1, kcal: 271, protein: 26, carbs: 0 },
        { name: "Brown rice (cooked)", qty: 2, kcal: 218, protein: 5, carbs: 45 },
        { name: "Broccoli (steamed)", qty: 1, kcal: 54, protein: 4, carbs: 11 },
        { name: "Pineapple juice", qty: 1, kcal: 132, protein: 1, carbs: 33 },
    ]);

    // Called by FoodSearch when "+ Add to plate" is clicked
    const addToPlate = (item: PlateItem) => {
        setPlateItems(prev => {
            const existing = prev.find(i => i.name === item.name);
            if (existing) return prev.map(i => i.name === item.name ? { ...i, qty: i.qty + 1 } : i);
            return [...prev, { ...item, qty: 1 }];
        });
    };

    return (
        <div style={{ padding: "2rem", minWidth: "60vw", margin: "0 auto" }}>
            <FoodSearch onAdd={addToPlate} />
            <MyPlate items={plateItems} onItemsChange={setPlateItems} />
            <DailyOverview totals={totals} />
            <CalendarOverview dailyData={dailyData} month={4} year={2026} />
        </div>
    );
}
