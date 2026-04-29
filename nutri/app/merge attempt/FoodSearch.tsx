//Khai Duc Pham's code

"use client";
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

const RECENT_KEY = "nutri-recent-searches";  //This is to a localstorage to store recent searches 

export default function FoodSearch({ onAdd }: { onAdd?: (item: PlateItem) => void }) {   //this function is passed from the parent(page.tsx) to send a food item up
  const [query, setQuery] = useState("");       //this is the text in the search input
  const [nutrients, setNutrients] = useState<{ name: string; value: number; unit: string }[] | null>(null);   //parse the nutrient data
  const [loading, setLoading] = useState(false);  //this is true when we are waiting for API response
  const [error, setError] = useState("");         //error when we failed a search
  const [searched, setSearched] = useState(false);  //to indicate whether a succesfull search is made --> so it monitors the Add button we have
  const [foodName, setFoodName] = useState("");     //saved separately from the query becuz the query is cleared before fetch finishes
  const [recentSearches, setRecentSearches] = useState<string[]>([]); //a list of max 5 recent items that got searched 

  //load any previously saved recent searches from the RECENT_KEY
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_KEY);
    if (stored) setRecentSearches(JSON.parse(stored));
  }, []);

  //append a new search food to the recent list we have, remove duplicates if we have them and cap everything at 5
  function saveRecent(q: string) {
    const updated = [q].concat(recentSearches.filter(x => x !== q)).slice(0, 5);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    setRecentSearches(updated);
  }

  async function handleSearch(searchQuery: string) {//this function handles the collecting data from getFoodData
    if (!searchQuery.trim()) return;  //to have a whitespace-only input
    setLoading(true);
    setError("");
    setFoodName(searchQuery.trim());    //store the name of the food now before the query is cleared
    setQuery("");                       //clear the input

    //call our getFoodData\route.ts, keep the API key in server-side 
    const res = await fetch(`/api/getFoodData?query=${searchQuery}`);
    const data = await res.json();

    if (!res.ok || !data.foods || data.foods.length === 0) {
      setError("Something went wrong, please try again.");
      setLoading(false);
      return;
    }

    //Here, I use the first result from USDA. I fetched from the dataType Branded (you can see the link in getFoodData\route.ts) because this is
    //the only dataType that contains specific nutrients that we need, also it returns A LOT OF different brands 
    //for a specific food item. So for the simplicity of the project, I only take the first 
    //matching food item from the API even though it might not be a 100% match like (steak and TENDERLOIN steak or smt like that) 
    const food = data.foods[0];
    const foodNutrients = food.foodNutrients;

    //extract the nutreitns by name from the USDA attributes
    const protein = foodNutrients.find((n: { nutrientName: string }) => n.nutrientName === "Protein");
    const carbs = foodNutrients.find((n: { nutrientName: string }) => n.nutrientName === "Carbohydrate, by difference");
    const calories = foodNutrients.find((n: { nutrientName: string }) => n.nutrientName === "Energy");
    const fat = foodNutrients.find((n: { nutrientName: string }) => n.nutrientName === "Total lipid (fat)");
    const sugar = foodNutrients.find((n: { nutrientName: string }) => n.nutrientName === "Total Sugars");

    //turn them into an array, default to 0 if they are missing 
    setNutrients([
      { name: "Calories", value: calories?.value ?? 0, unit: "kcal" },
      { name: "Protein", value: protein?.value ?? 0, unit: "g" },
      { name: "Carbs", value: carbs?.value ?? 0, unit: "g" },
      { name: "Fat", value: fat?.value ?? 0, unit: "g" },
      { name: "Sugar", value: sugar?.value ?? 0, unit: "g" },
    ]);

    setLoading(false);
    setSearched(true);          //searched is true since we have successfully fetched valid data
    saveRecent(searchQuery.trim());
  }

  return (
    <Panel>

      <OwnerTag>01 · Food Search</OwnerTag>
      <PanelHeader>
        <PanelTitle>Search & inspect</PanelTitle>
        <PanelSubtitle>USDA API</PanelSubtitle>
      </PanelHeader>


      <SearchInput //a search bar for user to input their food item
        type="text"
        value={query}
        placeholder="Search a food..."
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}     //allow the enter key to trigger a search as well :)
      />

      {error && <ErrorText>{error}</ErrorText>}

      <SearchButton onClick={() => handleSearch(query)}>Search</SearchButton>   

      {loading && <p>Loading...</p>}


      {!loading && searched && nutrients && (         //only render the preview and Add button after a successfull search 
        <PreviewBox>
          <NutritionGrid>
            {nutrients.map((n, i) => (          //this is literally the same logic we have in the Nav question on exam
              <NutritionCell key={i}>
                <NutritionLabel>{n.name}</NutritionLabel>
                <NutritionValue>{n.value}{n.unit}</NutritionValue>
              </NutritionCell>
            ))}
          </NutritionGrid>


          <AddButton $searched={searched} onClick={() => { //pull each nutrient value out of the array, then pass a PlateItem up to the parent via onAdd
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

      {!searched && ( //Hide the Add button shown before any search has been made
        <AddButton $searched={false}>+ Add to plate</AddButton>
      )}

      <RecentSection>
        <RecentLabel>Recent</RecentLabel>
        <ChipsRow>
          {recentSearches.map((item, i) => ( //this is fro the recent items, clicking on them also trigger a search as well
            <Chip key={i} onClick={() => handleSearch(item)}>{item}</Chip>
          ))}
        </ChipsRow>
      </RecentSection>
    </Panel>
  );
}
