import DailyOverview from "@/app/components/component-3/DailyOverview";
import CalendarOverview from "@/app/components/component-4/CalendarOverview";

export default function Home() {
  const totals = {
    calories: 1800,
    protein: 120,
    carbs: 200,
    fat: 60,
    sugar: 30,
  };

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

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <DailyOverview totals={totals} />
      <CalendarOverview dailyData={dailyData} month={4} year={2026} />
    </div>
  );
}
