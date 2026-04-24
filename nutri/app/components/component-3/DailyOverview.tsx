// Dave Feng's Code
"use client";

import React from "react";
import styled from "styled-components";

export type DailyTotals = {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    sugar: number;
};

const DEFAULT_GOALS = {
    calories: 2000,
    protein: 60,
    carbs: 250,
    fat: 67,
    sugar: 50,
};

/* ---------------------- STYLED COMPONENTS ---------------------- */

const Panel = styled.section`
  background: #ffffff;
  border: 1px solid #1a1a1a;
  border-radius: 4px;
  padding: 24px;
  position: relative;
  margin-bottom: 24px;
`;

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

const FoodRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e6e1d5;

  &:last-of-type {
    border-bottom: none;
  }

  span {
    font-family: "JetBrains Mono", monospace;
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #4a4a4a;
  }

  strong {
    font-family: "Fraunces", serif;
    font-size: 18px;
    font-weight: 600;
    text-align: right;
  }
`;

/* ---------------------- COMPONENT ---------------------- */

type DailyOverviewProps = {
    totals: DailyTotals;
};

const DailyOverview = ({ totals }: DailyOverviewProps) => {
    const goals = DEFAULT_GOALS;

    return (
        <Panel>
            <OwnerTag>03 · Daily Overview</OwnerTag>

            <PanelHeader>
                <PanelTitle>Today's Food Totals</PanelTitle>
                <PanelSubtitle>No goals — raw intake only</PanelSubtitle>
            </PanelHeader>

            <FoodRow>
                <span>Calories</span>
                <strong>{totals.calories}/{goals.calories}</strong>
            </FoodRow>

            <FoodRow>
                <span>Protein</span>
                <strong>{totals.protein}/{goals.protein} g</strong>
            </FoodRow>

            <FoodRow>
                <span>Carbs</span>
                <strong>{totals.carbs}/{goals.carbs} g</strong>
            </FoodRow>

            <FoodRow>
                <span>Fat</span>
                <strong>{totals.fat}/{goals.fat} g</strong>
            </FoodRow>

            <FoodRow>
                <span>Sugar</span>
                <strong>{totals.sugar}/{goals.sugar} g</strong>
            </FoodRow>
        </Panel>
    );
};

export default DailyOverview;
