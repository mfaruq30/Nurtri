import FoodSearch from "@/app/components/component-1/FoodSearch";
import DailyOverview from "@/app/components/component-3/DailyOverview";

const totals = { calories: 1800, protein: 120, carbs: 200, fat: 60, sugar: 30 };

export default function Page() {
    return (
        <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
            <FoodSearch />
            <DailyOverview totals={totals} />
        </div>
    );
}