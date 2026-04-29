// components/MyPlate.tsx
// Mirza Faruq — Component 2 (My Plate) — CS 391 Final Project
"use client";

import React from "react";
import styled from "styled-components";

// PlateItem is the shape of one food on the plate.
// Kept inline because MyPlate is the only file that uses it.
export type PlateItem = {
    name: string;
    qty: number;
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
    sugar: number;
};

/* ---------------------- STYLED COMPONENTS ---------------------- */

const Panel = styled.section`
  background: var(--c-bg-panel);
  border: 1px solid var(--c-border-strong);
  border-radius: 4px;
  padding: 24px;
  position: relative;
  margin-bottom: 24px;
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

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--c-border-light);
`;

const PanelTitle = styled.div`
  font-family: "Fraunces", serif;
  font-weight: 600;
  font-size: 22px;
  letter-spacing: -0.01em;
  color: var(--c-text-primary);
`;

const PanelSubtitle = styled.div`
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  color: var(--c-text-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const Circle = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 2px solid var(--c-border-strong);
  margin: 0 auto 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--c-bg-item);
`;

const CircleCount = styled.div`
  font-family: "Fraunces", serif;
  font-size: 40px;
  font-weight: 800;
  line-height: 1;
  color: var(--c-text-primary);
`;

const CircleLabel = styled.div`
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  color: var(--c-text-secondary);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-top: 4px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto auto auto auto;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--c-border-light);
  border-radius: 3px;
  margin-bottom: 6px;
  background: var(--c-bg-item);
`;

const RowName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--c-text-primary);
`;

const Qty = styled.span`
  font-family: "JetBrains Mono", monospace;
  font-size: 12px;
  color: var(--c-text-secondary);
  background: var(--c-bg-panel);
  padding: 2px 8px;
  border-radius: 2px;
  border: 1px solid var(--c-border-light);
`;

const Kcal = styled.span`
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  color: var(--c-text-secondary);
`;

const QtyBtn = styled.button`
  font-family: "JetBrains Mono", monospace;
  font-size: 14px;
  width: 24px;
  height: 24px;
  border: 1px solid var(--c-border-strong);
  background: var(--c-bg-panel);
  color: var(--c-text-primary);
  border-radius: 2px;
  cursor: pointer;
  padding: 0;
`;

const RemoveBtn = styled.button`
  font-family: "JetBrains Mono", monospace;
  font-size: 14px;
  color: var(--c-text-muted);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 4px;
`;

const Empty = styled.p`
  font-family: "JetBrains Mono", monospace;
  font-size: 12px;
  color: var(--c-text-muted);
  text-align: center;
  padding: 16px;
`;

const Footer = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed var(--c-border-light);
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  color: var(--c-text-secondary);
  display: flex;
  justify-content: space-between;
`;

const FooterStrong = styled.strong`
  color: var(--c-text-primary);
  font-weight: 500;
`;

const ConfirmBtn = styled.button<{ $busy?: boolean; $empty?: boolean }>`
  width: 100%;
  padding: 14px;
  background: ${({ $busy, $empty }) => ($busy || $empty ? "var(--c-disabled)" : "var(--c-accent)")};
  color: #ffffff;
  border: none;
  border-radius: 3px;
  font-family: "JetBrains Mono", monospace;
  font-size: 13px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-weight: 500;
  cursor: ${({ $busy, $empty }) => ($busy || $empty ? "not-allowed" : "pointer")};
  margin-top: 8px;
  opacity: ${({ $busy }) => ($busy ? 0.7 : 1)};
`;

const StatusMsg = styled.p<{ $ok?: boolean }>`
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  color: ${({ $ok }) => ($ok ? "var(--c-success)" : "var(--c-error)")};
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
    // Running totals: a simple reduce over the list (no memoization needed)
    const totalKcal = items.reduce((s, i) => s + i.kcal * i.qty, 0);
    const totalProtein = items.reduce((s, i) => s + i.protein * i.qty, 0);
    const totalCarbs = items.reduce((s, i) => s + i.carbs * i.qty, 0);
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
                $busy={confirmStatus === "saving"}
                $empty={items.length === 0}
                disabled={confirmStatus === "saving" || items.length === 0}
                onClick={confirmDay}
            >
                {confirmStatus === "saving" ? "Saving…" : "Confirm day →"}
            </ConfirmBtn>
            {confirmStatus === "ok" && <StatusMsg $ok>✓ Day saved!</StatusMsg>}
            {confirmStatus === "error" && <StatusMsg>Failed to save — please try again.</StatusMsg>}
        </Panel>
    );
};

export default MyPlate;
