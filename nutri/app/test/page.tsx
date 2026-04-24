import DailyOverview from "@/app/components/component-3/DailyOverview";
import MyPlate from "@/app/components/component-2/MyPlate";

const totals = { calories: 1800, protein: 120, carbs: 200, fat: 60, sugar: 30 };

const samplePlate = [
    { name: "Steak, sirloin", qty: 1, kcal: 271, protein: 26, carbs: 0 },
    { name: "Brown rice, cooked", qty: 2, kcal: 218, protein: 4.5, carbs: 46 },
    { name: "Broccoli, steamed", qty: 1, kcal: 54, protein: 3.7, carbs: 11 },
    { name: "Pineapple juice", qty: 1, kcal: 132, protein: 0.9, carbs: 32 },
];

export default function Page() {
    return (
        <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
            <DailyOverview totals={totals} />
            <MyPlate initialItems={samplePlate} />
        </div>
    );
}