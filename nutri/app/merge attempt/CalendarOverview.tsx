"use client";

import { useMemo, useState } from "react";
import styled from "styled-components";

export type HealthScores = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
};

type CalendarOverviewProps = {
  dailyData: Record<string, HealthScores>;
  month?: number;
  year?: number;
};

const Panel = styled.section`
  background: var(--c-bg-panel);
  border: 1px solid var(--c-border-strong);
  border-radius: 4px;
  padding: 24px;
  position: relative;
`;

const OwnerTag = styled.div`
  position: absolute;
  top: -10px;
  left: 20px;
  background: var(--c-inv-bg);
  color: var(--c-inv-text);
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.1em;
  padding: 4px 10px;
  border-radius: 2px;
  text-transform: uppercase;
`;

const Title = styled.h2`
  font-family: "Fraunces", serif;
  font-size: 22px;
  margin: 0;
  color: var(--c-text-primary);
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const MonthButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const MonthButton = styled.button`
  border: 1px solid var(--c-border-light);
  background: var(--c-bg-panel);
  color: var(--c-text-primary);
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  padding: 6px 10px;
  cursor: pointer;
  border-radius: 2px;

  &:hover {
    border-color: var(--c-border-strong);
  }
`;

const WeekHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-bottom: 8px;
`;

const WeekLabel = styled.div`
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  text-transform: uppercase;
  color: var(--c-text-muted);
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
`;

const EmptyCell = styled.div`
  height: 40px;
`;

const DayButton = styled.button<{ $selected: boolean; $hasData: boolean }>`
  height: 40px;
  border: 1px solid var(--c-border-light);
  background: ${({ $selected, $hasData }) => {
    if ($selected) return "var(--c-inv-bg)";
    if ($hasData) return "var(--c-cal-has-data)";
    return "var(--c-bg-panel)";
  }};
  color: ${({ $selected }) => ($selected ? "var(--c-inv-text)" : "var(--c-text-primary)")};
  font-family: "JetBrains Mono", monospace;
  font-size: 12px;
  cursor: pointer;
  border-radius: 2px;

  &:hover {
    border-color: var(--c-border-strong);
  }
`;

const Details = styled.div`
  margin-top: 20px;
  border-top: 1px solid var(--c-border-light);
  padding-top: 16px;
`;

const DetailDate = styled.p`
  margin: 0 0 8px;
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  color: var(--c-text-muted);
`;

const DetailRow = styled.p`
  margin: 4px 0;
  font-family: "Fraunces", serif;
  color: var(--c-text-primary);
`;

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const weekNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function pad(value: number) {
  return String(value).padStart(2, "0")
}

export default function CalendarOverview({
  dailyData,
  month,
  year,
}: CalendarOverviewProps) {
  const now = new Date();
  const initialYear = year ?? now.getFullYear();
  const initialMonth = month ?? now.getMonth() + 1;

  const [displayYear, setDisplayYear] = useState(initialYear);
  const [displayMonth, setDisplayMonth] = useState(initialMonth);

  const daysInMonth = new Date(displayYear, displayMonth, 0).getDate();
  const firstWeekday = new Date(displayYear, displayMonth - 1, 1).getDay();

  const firstDayWithData = useMemo(() => {
    for (let day = 1; day <= daysInMonth; day += 1) {
      const key = `${displayYear}-${pad(displayMonth)}-${pad(day)}`
      if (dailyData[key]) return day;
    }
    return 1;
  }, [displayYear, displayMonth, dailyData, daysInMonth]);

  const [selectedDay, setSelectedDay] = useState(firstDayWithData)

  const selectedKey = `${displayYear}-${pad(displayMonth)}-${pad(selectedDay)}`;
  const selectedScores: any = dailyData[selectedKey];

  const goToPreviousMonth = () => {
    const isJanuary = displayMonth === 1
    setDisplayMonth(isJanuary ? 12 : displayMonth - 1);
    setDisplayYear(isJanuary ? displayYear - 1 : displayYear);
    setSelectedDay(1);
  };

  const goToNextMonth = () => {
    const isDecember = displayMonth === 12;
    setDisplayMonth(isDecember ? 1 : displayMonth + 1);
    setDisplayYear(isDecember ? displayYear + 1 : displayYear);
    setSelectedDay(1);
  };

  return (
    <Panel>
      <OwnerTag>04 · Calendar</OwnerTag>
      <HeaderRow>
        <Title>
          {monthNames[displayMonth - 1]} {displayYear}
        </Title>

        <MonthButtons>
          <MonthButton type="button" onClick={goToPreviousMonth}>
            Prev
          </MonthButton>
          <MonthButton type="button" onClick={goToNextMonth}>
            Next
          </MonthButton>
        </MonthButtons>
      </HeaderRow>

      <WeekHeader>
        {weekNames.map((label) => (
          <WeekLabel key={label}>{label}</WeekLabel>
        ))}
      </WeekHeader>

      <Grid>
        {Array.from({ length: firstWeekday }).map((_, index) => (
          <EmptyCell key={`empty-${index}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const key = `${displayYear}-${pad(displayMonth)}-${pad(day)}`;
          const hasData = Boolean(dailyData[key]);

          return (
            <DayButton
              key={key}
              $selected={selectedDay === day}
              $hasData={hasData}
              onClick={() => setSelectedDay(day)}
            >
              {day}
            </DayButton>
          );
        })}
      </Grid>

      <Details>
        <DetailDate>{selectedKey}</DetailDate>

        {selectedScores ? (
          <>
            <DetailRow>Calories: {selectedScores.calories}</DetailRow>
            <DetailRow>Protein: {selectedScores.protein} g</DetailRow>
            <DetailRow>Carbs: {selectedScores.carbs} g</DetailRow>
            <DetailRow>Fat: {selectedScores.fat} g</DetailRow>
            <DetailRow>Sugar: {selectedScores.sugar} g</DetailRow>
          </>
        ) : (
          <DetailRow>No health scores saved for this date.</DetailRow>
        )}
      </Details>
    </Panel>
  );
}
