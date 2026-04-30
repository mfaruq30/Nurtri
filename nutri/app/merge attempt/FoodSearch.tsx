"use client";
//Khai Duc Pham's code
import { useEffect, useState } from "react";
import styled from "styled-components";
import { PlateItem } from "./MyPlate";

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
`;

const PanelSubtitle = styled.div`
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  color: var(--c-text-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 14px 18px;
  border: 1px solid var(--c-border-strong);
  border-radius: 4px;
  font-family: "Inter Tight", sans-serif;
  font-size: 15px;
  background: var(--c-bg-input);
  color: var(--c-text-primary);
  margin-bottom: 12px;
  box-sizing: border-box;

  &::placeholder {
    color: var(--c-text-muted);
  }
`;

const SearchButton = styled.button`
  width: 100%;
  padding: 12px;
  background: var(--c-inv-bg);
  color: var(--c-inv-text);
  border: none;
  border-radius: 3px;
  font-family: "JetBrains Mono", monospace;
  font-size: 12px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  margin-bottom: 16px;
`;

const PreviewBox = styled.div`
  border: 1px solid var(--c-border-light);
  border-radius: 4px;
  padding: 18px;
  background: var(--c-bg-item);
`;

const NutritionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 16px;
`;

const NutritionCell = styled.div`
  padding: 10px;
  background: var(--c-bg-panel);
  border: 1px solid var(--c-border-light);
  border-radius: 3px;
`;

const NutritionLabel = styled.div`
  font-family: "JetBrains Mono", monospace;
  font-size: 9px;
  color: var(--c-text-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 4px;
`;

const NutritionValue = styled.div`
  font-family: "Fraunces", serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 1;
  color: var(--c-text-primary);
`;

const AddButton = styled.button<{ $searched: boolean }>`
  width: 100%;
  padding: 12px;
  background: ${({ $searched }) => ($searched ? "var(--c-inv-bg)" : "var(--c-border-light)")};
  color: ${({ $searched }) => ($searched ? "var(--c-inv-text)" : "var(--c-text-muted)")};
  border: none;
  border-radius: 3px;
  font-family: "JetBrains Mono", monospace;
  font-size: 12px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: ${({ $searched }) => ($searched ? "pointer" : "default")};
`;

const RecentSection = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed var(--c-border-light);
`;

const RecentLabel = styled.div`
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  color: var(--c-text-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 8px;
`;

const ChipsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Chip = styled.span`
  padding: 4px 10px;
  background: var(--c-bg-item);
  border: 1px solid var(--c-border-light);
  border-radius: 999px;
  font-size: 12px;
  color: var(--c-text-secondary);
  cursor: pointer;
`;

const ErrorText = styled.p`
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  color: var(--c-error);
  margin-bottom: 12px;
`;

const RECENT_KEY = "nutri-recent-searches";

export default function FoodSearch({ onAdd }: { onAdd?: (item: PlateItem) => void }) {
    const [query, setQuery] = useState("")
    const [nutrients, setNutrients] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searched, setSearched] = useState(false)
    // store the food name separately because query gets cleared before search finishes
    const [foodName, setFoodName] = useState("");
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(RECENT_KEY);
        if (stored) setRecentSearches(JSON.parse(stored))
    }, []);

    function saveRecent(q: string) {
        setRecentSearches(prev => {
            const updated = [q, ...prev.filter(x => x !== q)].slice(0, 5);
            localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
            return updated;
        });
    }

    async function handleSearch(searchQuery: string) {
        if (!searchQuery.trim()) return;
        setLoading(true);
        setError("");
        setFoodName(searchQuery.trim());
        setQuery("");

        const res = await fetch(`/api/getFoodData?query=${searchQuery}`);
        const data = await res.json();

        if (!res.ok || !data.foods || data.foods.length === 0) {
            setError("Something went wrong, please try again.");
            setLoading(false);
            return;
        }

        const food = data.foods[0];
        const foodNutrients = food.foodNutrients;

        const protein = foodNutrients.find((n: { nutrientName: string }) => n.nutrientName === "Protein");
        const carbs = foodNutrients.find((n: { nutrientName: string }) => n.nutrientName === "Carbohydrate, by difference");
        const calories = foodNutrients.find((n: { nutrientName: string }) => n.nutrientName === "Energy");
        const fat = foodNutrients.find((n: any) => n.nutrientName === "Total lipid (fat)");
        const sugar = foodNutrients.find((n: { nutrientName: string }) => n.nutrientName === "Total Sugars");
        setNutrients([
            { name: "Calories", value: calories?.value ?? 0, unit: "kcal" },
            { name: "Protein", value: protein?.value ?? 0, unit: "g" },
            { name: "Carbs", value: carbs?.value ?? 0, unit: "g" },
            { name: "Fat", value: fat?.value ?? 0, unit: "g" },
            { name: "Sugar", value: sugar?.value ?? 0, unit: "g" },
        ]);

        setLoading(false)
        setSearched(true);
        saveRecent(searchQuery.trim());
    }

    return (
        <Panel>
            <OwnerTag>01 · Food Search</OwnerTag>
            <PanelHeader>
                <PanelTitle>Search & inspect</PanelTitle>
                <PanelSubtitle>USDA API</PanelSubtitle>
            </PanelHeader>

            <SearchInput
                type="text"
                value={query}
                placeholder="Search a food..."
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
            />

            {error && <ErrorText>{error}</ErrorText>}

            <SearchButton onClick={() => handleSearch(query)}>Search</SearchButton>

            {loading && <p>Loading...</p>}

            {!loading && searched && nutrients && (
                <PreviewBox>
                    <NutritionGrid>
                        {nutrients.map((n, i) => (
                            <NutritionCell key={i}>
                                <NutritionLabel>{n.name}</NutritionLabel>
                                <NutritionValue>{n.value}{n.unit}</NutritionValue>
                            </NutritionCell>
                        ))}
                    </NutritionGrid>
                    <AddButton $searched={searched} onClick={() => {
                        if (!nutrients || !onAdd) return;
                        const kcal = nutrients.find(n => n.name === "Calories")?.value ?? 0;
                        const protein = nutrients.find(n => n.name === "Protein")?.value ?? 0;
                        const carbs = nutrients.find(n => n.name === "Carbs")?.value ?? 0;
                        const fat = nutrients.find(n => n.name === "Fat")?.value ?? 0;
                        const sugar = nutrients.find(n => n.name === "Sugar")?.value ?? 0;
                        onAdd({ name: foodName, qty: 1, kcal, protein, carbs, fat, sugar });
                    }}>+ Add to plate</AddButton>
                </PreviewBox>
            )}

            {!searched && (
                <AddButton $searched={false}>+ Add to plate</AddButton>
            )}

            <RecentSection>
                <RecentLabel>Recent</RecentLabel>
                <ChipsRow>
                    {recentSearches.map((item, i) => (
                        <Chip key={i} onClick={() => handleSearch(item)}>{item}</Chip>
                    ))}
                </ChipsRow>
            </RecentSection>
        </Panel>
    );
}
