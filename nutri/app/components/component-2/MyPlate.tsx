// components/MyPlate.tsx
// Mirza Faruq — Component 2 (My Plate) — CS 391 Final Project
"use client";

import React, { useState } from "react"
import styled from "styled-components"

// PlateItem is the shape of one food on the plate.
// Kept inline because MyPlate is the only file that uses it.
export type PlateItem = {
    name: string;
    qty: number;
    kcal: number;
    protein: number;
    carbs: number;
}

/* ---------------------- STYLED COMPONENTS ---------------------- */

// Panel — the white card that wraps everything (matches Component 3's Panel)
const Panel = styled.section`
  background: #ffffff;
  border: 1px solid #1a1a1a;
  border-radius: 4px;
  padding: 24px;
  position: relative;
  margin-bottom: 24px;
`;

// OwnerTag — the little black "02 · My Plate" chip top-left of the panel
const OwnerTag = styled.div`
  position: absolute;
  top: -10px;
  left: 20px;
  background: #1a1a1a;
  color: #f4f1ea;
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.1em;
  padding: 4px 10px;
  border-radius: 2px;
  text-transform: uppercase;
`;

// PanelHeader — holds the title and subtitle across the top
const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e6e1d5;
`;

const PanelTitle = styled.div`
  font-family: "Fraunces", serif;
  font-weight: 600;
  font-size: 22px;
  letter-spacing: -0.01em;
`;

const PanelSubtitle = styled.div`
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  color: #8a8a8a;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

// Circle — the round "plate" illustration with the item count in the middle
const Circle = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 2px solid #1a1a1a;
  margin: 0 auto 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f4f1ea;
`;

const CircleCount = styled.div`
  font-family: "Fraunces", serif;
  font-size: 40px;
  font-weight: 800;
  line-height: 1;
`;

const CircleLabel = styled.div`
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  color: #4a4a4a;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-top: 4px;
`;

// Row — one food item row (name | - | qty | + | kcal | ✕)
const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto auto auto auto;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid #e6e1d5;
  border-radius: 3px;
  margin-bottom: 6px;
  background: #f4f1ea;
`;

const RowName = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

const Qty = styled.span`
  font-family: "JetBrains Mono", monospace;
  font-size: 12px;
  color: #4a4a4a;
  background: #ffffff;
  padding: 2px 8px;
  border-radius: 2px;
  border: 1px solid #e6e1d5;
`;

const Kcal = styled.span`
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
`;

// QtyBtn — the small "+" and "-" buttons on each row
const QtyBtn = styled.button`
  font-family: "JetBrains Mono", monospace;
  font-size: 14px;
  width: 24px;
  height: 24px;
  border: 1px solid #1a1a1a;
  background: #ffffff;
  border-radius: 2px;
  cursor: pointer;
  padding: 0;
`;

// RemoveBtn — the "✕" that deletes the row
const RemoveBtn = styled.button`
  font-family: "JetBrains Mono", monospace;
  font-size: 14px;
  color: #8a8a8a;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 4px;
`;

// Empty — shown when the plate has no items
const Empty = styled.p`
  font-family: "JetBrains Mono", monospace;
  font-size: 12px;
  color: #8a8a8a;
  text-align: center;
  padding: 16px;
`;

// Footer — the running total line at the bottom
const Footer = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #e6e1d5;
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  color: #4a4a4a;
  display: flex;
  justify-content: space-between;
`;

const FooterStrong = styled.strong`
  color: #1a1a1a;
  font-weight: 500;
`;

// ConfirmBtn — the big orange "Confirm day" button at the bottom
const ConfirmBtn = styled.button`
  width: 100%;
  padding: 14px;
  background: #d94f2b;
  color: #ffffff;
  border: none;
  border-radius: 3px;
  font-family: "JetBrains Mono", monospace;
  font-size: 13px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-weight: 500;
  cursor: pointer;
  margin-top: 8px;
`;

/* ---------------------- COMPONENT ---------------------- */

type MyPlateProps = {
    initialItems: PlateItem[];
}

const MyPlate = ({ initialItems }: MyPlateProps) => {
    // items is the list of foods currently on the plate
    const [items, setItems] = useState<PlateItem[]>(initialItems);

    // Running totals: a simple reduce over the list (no memoization needed)
    const totalKcal = items.reduce((s, i) => s + i.kcal * i.qty, 0);
    const totalProtein = items.reduce((s, i) => s + i.protein * i.qty, 0);
    const totalCarbs = items.reduce((s, i) => s + i.carbs * i.qty, 0);

    // Increase a row's quantity by 1
    const inc = (name: string) => {
        setItems(items.map(i => i.name === name ? { ...i, qty: i.qty + 1 } : i));
    };

    // Decrease a row's quantity. Clamped at 1 so "-" never auto-removes
    // (user has to click ✕ to remove).
    const dec = (name: string) => {
        setItems(items.map(i => i.name === name ? { ...i, qty: Math.max(1, i.qty - 1) } : i));
    };

    // Remove a row from the plate
    const remove = (name: string) => {
        setItems(items.filter(i => i.name !== name));
    };

    // Confirm day: POST today's totals + items to the API route,
    // which saves the day to MongoDB.
    const confirmDay = async () => {
        const res = await fetch("/api/plate/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                date: new Date().toISOString().slice(0, 10),
                items,
                totals: { kcal: totalKcal, protein: totalProtein, carbs: totalCarbs },
            }),
        });
        if (res.ok) {
            alert("Day confirmed!");
        } else {
            alert("Failed to save.");
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

            <ConfirmBtn onClick={confirmDay}>Confirm day →</ConfirmBtn>
        </Panel>
    );
}

export default MyPlate;
