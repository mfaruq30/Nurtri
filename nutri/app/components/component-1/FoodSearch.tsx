//Khai Duc Pham's code
import { Food } from "../../interfaces/food";
import styled from "styled-components";

const Panel = styled.section`
  background: #ffffff;
  border: 1px solid #1a1a1a;
  border-radius: 4px;
  padding: 24px;
  position: relative;
  margin-bottom: 24px;
`;

const FoodTitle = styled.div`
  font-family: "Fraunces", serif;
  font-weight: 600;
  font-size: 18px;
  letter-spacing: -0.01em;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e6e1d5;
`;

const FoodRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  padding: 8px 0;
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
    font-size: 16px;
    font-weight: 600;
    text-align: right;
  }
`;

export default function FoodSearch(props: Food) {
    const protein = props.foodNutrients.find(n => n.nutrientName === "Protein");
    const carbs = props.foodNutrients.find(n => n.nutrientName === "Carbohydrate, by difference");
    const calories = props.foodNutrients.find(n => n.nutrientName === "Energy");
    const fats = props.foodNutrients.find(n => n.nutrientName === "Total lipid (fat)");
    const sugars = props.foodNutrients.find(n => n.nutrientName === "Total Sugars");

    return (
        <Panel>
            <FoodTitle>{props.description}</FoodTitle>
            <FoodRow>
                <span>Protein</span>
                <strong>{protein?.value ?? "N/A"}g</strong>
            </FoodRow>
            <FoodRow>
                <span>Carbs</span>
                <strong>{carbs?.value ?? "N/A"}g</strong>
            </FoodRow>
            <FoodRow>
                <span>Calories</span>
                <strong>{calories?.value ?? "N/A"}kcal</strong>
            </FoodRow>
            <FoodRow>
                <span>Fats</span>
                <strong>{fats?.value ?? "N/A"}g</strong>
            </FoodRow>
            <FoodRow>
                <span>Sugars</span>
                <strong>{sugars?.value ?? "N/A"}g</strong>
            </FoodRow>
        </Panel>
    );
}