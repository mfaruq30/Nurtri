"use client";
import { useEffect, useState } from "react";
import FoodSearch from "@/app/merge attempt/FoodSearch";
import MyPlate, { PlateItem } from "@/app/merge attempt/MyPlate";
import DailyOverview from "@/app/merge attempt/DailyOverview";
import CalendarOverview, { HealthScores } from "@/app/merge attempt/CalendarOverview";

export default function Home() {
    // Plate state lives here so FoodSearch can add to it (lift state up pattern)
    const [plateItems, setPlateItems] = useState<PlateItem[]>([]);

    // Derived live totals — rounded to avoid floating point noise from USDA API values
    const totals = {
        calories: Math.round(plateItems.reduce((s, i) => s + i.kcal * i.qty, 0)),
        protein: Math.round(plateItems.reduce((s, i) => s + i.protein * i.qty, 0)),
        carbs: Math.round(plateItems.reduce((s, i) => s + i.carbs * i.qty, 0)),
        fat: Math.round(plateItems.reduce((s, i) => s + i.fat * i.qty, 0)),
        sugar: Math.round(plateItems.reduce((s, i) => s + i.sugar * i.qty, 0)),
    };

    // Calendar data fetched from MongoDB for the current month
    const [dailyData, setDailyData] = useState<Record<string, HealthScores>>({});
    const now = new Date();

    useEffect(() => {
        fetch(`/api/plate/get?year=${now.getFullYear()}&month=${now.getMonth() + 1}`)
            .then(r => r.json())
            .then(setDailyData)
            .catch(console.error);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Khai Pham: 
    // Called by FoodSearch when "+ Add to plate" is clicked
    // If the food already exists in the plate, increments its qty instead of adding a duplicate.
    const addToPlate = (item: PlateItem) => {
        const existing = plateItems.find(i => i.name === item.name);
        const updated = existing
            ? plateItems.map(i => i.name === item.name ? Object.assign({}, i, { qty: i.qty + 1 }) : i)
            : plateItems.concat(Object.assign({}, item, { qty: 1 }));
        setPlateItems(updated);
    };

    return (
        <div style={{ padding: "2rem", minWidth: "60vw", margin: "0 auto" }}>
            <FoodSearch onAdd={addToPlate}  //Khai Pham: onAdd={addToPlate} wires FoodSearch's internal "+ Add to plate" button to the shared plate state above
            />
            <MyPlate items={plateItems} onItemsChange={setPlateItems} />
            <DailyOverview totals={totals} />
            <CalendarOverview dailyData={dailyData} month={now.getMonth() + 1} year={now.getFullYear()} />
        </div>
    );
}
