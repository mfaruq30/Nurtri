"use client";
//Khai Duc Pham's code
import { useState } from "react";
import styled from "styled-components";

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
`;

const PanelSubtitle = styled.div`
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  color: #8a8a8a;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 14px 18px;
  border: 1px solid #1a1a1a;
  border-radius: 4px;
  font-family: "Inter Tight", sans-serif;
  font-size: 15px;
  background: #f4f1ea;
  margin-bottom: 12px;
  box-sizing: border-box;
  color: #4a4a4a;

  &::placeholder {
    color: #8a8a8a;
  } 
`;

const SearchButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #1a1a1a;
  color: #f4f1ea;
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
  border: 1px solid #e6e1d5;
  border-radius: 4px;
  padding: 18px;
  background: #f4f1ea;
`;

const NutritionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 16px;
`;

const NutritionCell = styled.div`
  padding: 10px;
  background: white;
  border: 1px solid #e6e1d5;
  border-radius: 3px;
`;

const NutritionLabel = styled.div`
  font-family: "JetBrains Mono", monospace;
  font-size: 9px;
  color: #8a8a8a;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 4px;
`;

const NutritionValue = styled.div`
  font-family: "Fraunces", serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 1;
`;

const AddButton = styled.button<{ $searched: boolean }>`
  width: 100%;
  padding: 12px;
  background: ${({ $searched }) => ($searched ? "#1a1a1a" : "#e6e1d5")};
  color: ${({ $searched }) => ($searched ? "#f4f1ea" : "#8a8a8a")};
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
  border-top: 1px dashed #e6e1d5;
`;

const RecentLabel = styled.div`
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  color: #8a8a8a;
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
  background: #f4f1ea;
  border: 1px solid #e6e1d5;
  border-radius: 999px;
  font-size: 12px;
  color: #4a4a4a;
  cursor: pointer;
`;

const ErrorText = styled.p`
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  color: #c13d2b;
  margin-bottom: 12px;
`;

const recentSearches = ["pineapple juice", "brown rice", "chicken breast", "broccoli"];

export default function FoodSearch() {
    const [query, setQuery] = useState("");
    const [nutrients, setNutrients] = useState<{ name: string; value: number; unit: string }[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searched, setSearched] = useState(false);

    async function handleSearch(searchQuery: string) {
        if (!searchQuery.trim()) return;
        setLoading(true);
        setError("");
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
        const fat = foodNutrients.find((n: { nutrientName: string }) => n.nutrientName === "Total lipid (fat)");

        setNutrients([
            { name: "Calories", value: calories?.value ?? 0, unit: "kcal" },
            { name: "Protein", value: protein?.value ?? 0, unit: "g" },
            { name: "Carbs", value: carbs?.value ?? 0, unit: "g" },
            { name: "Fat", value: fat?.value ?? 0, unit: "g" },
        ]);

        setLoading(false);
        setSearched(true);
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
                    <AddButton $searched={searched}>+ Add to plate</AddButton>
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