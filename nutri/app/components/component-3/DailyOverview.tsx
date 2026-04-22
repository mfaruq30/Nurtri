// components/DailyOverview.tsx
import React from 'react';
import styles from './DailyOverview.module.css';

export type DailyTotals = {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    sugar: number;
};

export type DailyGoals = {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    sugar: number;
};

export type UserMeta = {
    height: string; // e.g. "5'10\""
    weight: string; // e.g. "170lb"
    sex: string;    // keep it simple: "M", "F", "Other"
    age: number;
    bmi: number;
};

type DailyOverviewProps = {
    totals: DailyTotals;
    goals: DailyGoals;
    userMeta: UserMeta;
};

// Helper to compute percentage and a simple color state
function getPercent(total: number, goal: number): number {
    if (goal <= 0) return 0;
    const pct = (total / goal) * 100;
    return Math.min(100, Math.max(0, Math.round(pct)));
}

function getStatusColor(percent: number): 'green' | 'yellow' | 'red' {
    if (percent <= 40) return 'yellow';
    if (percent <= 110) return 'green';
    return 'red';
}

type GoalRowProps = {
    label: string;
    total: number;
    goal: number;
    unit?: string;
};

const GoalRow: React.FC<GoalRowProps> = ({ label, total, goal, unit }) => {
    const percent = getPercent(total, goal);
    const statusColor = getStatusColor(percent);

    return (
        <div className={styles.goalRow}>
            <div className={styles.goalLabel}>{label}</div>

            <div className={styles.goalBarWrap}>
                <div className={styles.goalBar}>
                    <div
                        className={`${styles.goalFill} ${styles[statusColor]}`}
                        style={{ width: `${percent}%` }}
                    />
                </div>
            </div>

            <div className={styles.goalStatus}>
                <div className={styles.statusText}>
                    {total} / {goal}
                    {unit}
                </div>
                <div
                    className={`${styles.statusDot} ${styles[statusColor]}`}
                />
            </div>
        </div>
    );
};

const DailyOverview: React.FC<DailyOverviewProps> = ({ totals, goals, userMeta }) => {
    return (
        <section className={styles.panel}>
            {/* simple tag to show ownership */}
            <div className={styles.ownerTag}>03 · Daily Overview</div>

            <div className={styles.panelHeader}>
                <div className={styles.panelTitle}>Today vs. your goals</div>
                <div className={styles.panelSubtitle}>Post-confirm</div>
            </div>

            {/* Each row corresponds to one nutrient */}
            <GoalRow label="Calories" total={totals.calories} goal={goals.calories} />
            <GoalRow label="Protein" total={totals.protein} goal={goals.protein} unit="g" />
            <GoalRow label="Carbs" total={totals.carbs} goal={goals.carbs} unit="g" />
            <GoalRow label="Fat" total={totals.fat} goal={goals.fat} unit="g" />
            <GoalRow label="Sugar" total={totals.sugar} goal={goals.sugar} unit="g" />

            <div className={styles.settingsLink}>
                <div className={styles.userStats}>
                    Goals from{' '}
                    <strong>
                        {userMeta.height} · {userMeta.weight} · {userMeta.sex} · {userMeta.age}yr
                    </strong>{' '}
                    · BMI {userMeta.bmi}
                </div>
                <button className={styles.adjustBtn}>Adjust</button>
            </div>
        </section>
    );
};

export default DailyOverview;
