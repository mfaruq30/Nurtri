// components/MyPlate.tsx
// Mirza Faruq — Component 2 (My Plate Page) 
// This component displays the person's current plate for the day, 
// Its like a shopping cart where once the user adds the food from search to here, 
// they can add , delete any amount of quantity they want in their plate
// It shows a visual circle with an item count, a list of food rows
// with quantity controls, running nutrition totals, and a "Confirm day"
// button that saves the plate to MongoDB via POST /api/plate/confirm.
// State is lifted to page.tsx so FoodSearch can add
// items here without the two components talking directly to each other.
"use client";

import React from "react";
import styled from "styled-components";

// PlateItem is the structure of one food on the plate.
export type PlateItem = {   // fat and sugar were added so DailyOverview can show all 5 nutrients
    name: string;
    qty: number;
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
    sugar: number;
};

/* ---------------------- STYLED COMPONENTS ---------------------- */
// the white card that wraps the whole component
const Panel = styled.section`
  background: #ffffff;
  border: 1px solid #333333;
  border-radius: 4px;
  padding: 24px;
  margin-bottom: 24px;
`;

// OwnerTag — the small black chip "02 · My Plate" shown at the top of the panel
const OwnerTag = styled.div`
  background: #111111;
  color: #ffffff;
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.1em;
  padding: 4px 10px;
  border-radius: 2px;
  text-transform: uppercase;
  display: inline-block;
  margin-bottom: 16px;
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #dddddd;
`;

const PanelTitle = styled.div`
  font-family: "Fraunces", serif;
  font-weight: 600;
  font-size: 22px;
  letter-spacing: -0.01em;
  color: #111111;
`;

const PanelSubtitle = styled.div`
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  color: #888888;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

// decorative round plate graphic showing how many items are on the plate
const Circle = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 2px solid #333333;
  margin: 0 auto 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f9f9f9;
`;

const CircleCount = styled.div`
  font-family: "Fraunces", serif;
  font-size: 40px;
  font-weight: 800;
  line-height: 1;
  color: #111111;
`;

const CircleLabel = styled.div`
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  color: #555555;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-top: 4px;
`;

// Row — one food item line: name | − | qty | + | kcal | ✕
const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid #dddddd;
  border-radius: 3px;
  margin-bottom: 6px;
  background: #f9f9f9;
`;

const RowName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #111111;
  flex: 1;
`;

const Qty = styled.span`
  font-family: "JetBrains Mono", monospace;
  font-size: 12px;
  color: #555555;
  background: #ffffff;
  padding: 2px 8px;
  border-radius: 2px;
  border: 1px solid #dddddd;
`;

const Kcal = styled.span`
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  color: #555555;
`;

const QtyBtn = styled.button`
  font-family: "JetBrains Mono", monospace;
  font-size: 14px;
  width: 24px;
  height: 24px;
  border: 1px solid #333333;
  background: #ffffff;
  color: #111111;
  border-radius: 2px;
  cursor: pointer;
  padding: 0;
`;

const RemoveBtn = styled.button`
  font-family: "JetBrains Mono", monospace;
  font-size: 14px;
  color: #aaaaaa;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 4px;
`;

const Empty = styled.p`
  font-family: "JetBrains Mono", monospace;
  font-size: 12px;
  color: #aaaaaa;
  text-align: center;
  padding: 16px;
`;

const Footer = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #dddddd;
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  color: #555555;
  display: flex;
  justify-content: space-between;
`;

const FooterStrong = styled.strong`
  color: #111111;
  font-weight: 500;
`;

// ConfirmBtn — base styles only; background/cursor/opacity are set via inline style in JSX
const ConfirmBtn = styled.button`
  width: 100%;
  padding: 14px;
  color: #ffffff;
  border: none;
  border-radius: 3px;
  font-family: "JetBrains Mono", monospace;
  font-size: 13px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-weight: 500;
  margin-top: 8px;
`;

// StatusMsg — brief inline feedback shown for 3 seconds after confirming
const StatusMsgOk = styled.p`
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  color: #2e7d32;
  text-align: center;
  margin: 6px 0 0;
`;

const StatusMsgError = styled.p`
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  color: #c62828;
  text-align: center;
  margin: 6px 0 0;
`;

/* ---------------------- COMPONENT ---------------------- */

type MyPlateProps = {
    items: PlateItem[];
    onItemsChange: (items: PlateItem[]) => void;
};

// items and onItemsChange are lifted to page.tsx so FoodSearch can add to the plate
const MyPlate = ({ items, onItemsChange }: MyPlateProps) => {
    // Running totals: a simple reduce over the list
    const totalKcal = items.reduce((s, i) => s + i.kcal * i.qty, 0);
    const totalProtein = items.reduce((s, i) => s + i.protein * i.qty, 0);
    const totalCarbs = items.reduce((s, i) => s + i.carbs * i.qty, 0);
    // fat and sugar totals are also sent to MongoDB so history is complete
    const totalFat = items.reduce((s, i) => s + i.fat * i.qty, 0);
    const totalSugar = items.reduce((s, i) => s + i.sugar * i.qty, 0);
    const [confirmStatus, setConfirmStatus] = React.useState<"" | "saving" | "ok" | "error">("");

    // Increase a row's quantity by 1
    const inc = (name: string) => {
        onItemsChange(items.map(i => i.name === name ? { ...i, qty: i.qty + 1 } : i));
    };

    // Decrease a row's quantity. Clamped at 1 so "-" never auto-removes
    // (user has to click ✕ to remove).
    const dec = (name: string) => {
        onItemsChange(items.map(i => i.name === name ? { ...i, qty: Math.max(1, i.qty - 1) } : i));
    };

    // Remove a row from the plate
    const remove = (name: string) => {
        onItemsChange(items.filter(i => i.name !== name));
    };

    // Confirm day: POST today's totals + items to the API route,
    // which saves the day to MongoDB.
    const confirmDay = async () => {
        setConfirmStatus("saving");
        try {
            const res = await fetch("/api/plate/confirm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    date: new Date().toISOString().slice(0, 10),
                    items,
                    totals: { kcal: totalKcal, protein: totalProtein, carbs: totalCarbs, fat: totalFat, sugar: totalSugar },
                }),
            });
            setConfirmStatus(res.ok ? "ok" : "error");
        } catch {
            setConfirmStatus("error");
        } finally {
            setTimeout(() => setConfirmStatus(""), 3000);
        }
    };

    const isBusy = confirmStatus === "saving";
    const isEmpty = items.length === 0;

    return (
        <Panel>
            <OwnerTag>02 · My Plate</OwnerTag>

            <PanelHeader>
                <PanelTitle>Today&apos;s plate</PanelTitle>
                <PanelSubtitle>Draft</PanelSubtitle>
            </PanelHeader>

            <Circle>
                <CircleCount>{items.length}</CircleCount>
                <CircleLabel>items</CircleLabel>
            </Circle>

            {items.length === 0 && <Empty>Plate is empty.</Empty>}

            {items.map(item => (
                <Row key={item.name}>
                    <RowName>{item.name}</RowName>
                    <QtyBtn onClick={() => dec(item.name)}>-</QtyBtn>
                    <Qty>×{item.qty}</Qty>
                    <QtyBtn onClick={() => inc(item.name)}>+</QtyBtn>
                    <Kcal>{item.kcal * item.qty} kcal</Kcal>
                    <RemoveBtn onClick={() => remove(item.name)}>✕</RemoveBtn>
                </Row>
            ))}

            <Footer>
                <span>Running total</span>
                <span>
                    <FooterStrong>{totalKcal} kcal</FooterStrong>
                    {" · "}{totalProtein}g protein
                    {" · "}{totalCarbs}g carbs
                </span>
            </Footer>

            <ConfirmBtn
                disabled={isBusy || isEmpty}
                onClick={confirmDay}
                style={{
                    background: isBusy || isEmpty ? "#aaaaaa" : "#111111",
                    cursor: isBusy || isEmpty ? "not-allowed" : "pointer",
                    opacity: isBusy ? 0.7 : 1,
                }}
            >
                {isBusy ? "Saving…" : "Confirm day →"}
            </ConfirmBtn>
            {confirmStatus === "ok" && <StatusMsgOk>✓ Day saved!</StatusMsgOk>}
            {confirmStatus === "error" && <StatusMsgError>Failed to save — please try again.</StatusMsgError>}
        </Panel>
    );
};

export default MyPlate;