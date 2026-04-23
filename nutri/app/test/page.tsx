import DailyOverview from "@/app/components/component-3/DailyOverview";

export default function Page() {
    const totals = {
        calories: 1800,
        protein: 120,
        carbs: 200,
        fat: 60,
        sugar: 30,
    };

    return (
        <div style={{ padding: "2rem" }}>
            <DailyOverview totals={totals} />
        </div>
    );
}
