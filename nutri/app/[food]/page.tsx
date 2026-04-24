// Khai Duc Pham's code (work in progress)
export default function FoodPage() { return null; }

// //Khai Duc Pham's code
// import FoodSearch from "../components/component-1/FoodSearch";
// import styled from "styled-components";
// import { Food } from "@/app/interfaces/food";

// const StyledWrapper = styled.main`
//     width: 100%;
//     padding: 2rem 5rem;
//     min-height: 100vh;
//     box-sizing: border-box;
// `;

// const StyledTitle = styled.h1`
//     font-size: 2rem;
//     margin-bottom: 1.5rem;
//     font-weight: bold;
//     text-transform: capitalize;
//     text-align: center;
// `;

// const StyledDiv = styled.div`
//     display: flex;
//     flex-flow: row wrap;
//     gap: 1rem;
//     justify-content: center;
// `;

// async function getFoodData(query: string) {
//     const res = await fetch(
//         `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${process.env.NUTRI_API_KEY}&query=${query}&dataType=Branded&pageSize=25&pageNumber=2&inclsortBy=dataType.keyword&sortOrder=asc`
//     )
//     console.log("Status:", res.status);
//     console.log("API Key:", process.env.NUTRI_API_KEY);
//     if (!res.ok) {
//         return null
//     }
//     return res.json();
// }

// export default async function FoodPage({ params }: { params: Promise<{ food: string }> }) {
//     const { food } = await params;
//     const foodData = await getFoodData(food);

//     if (!foodData) {
//         return <div>Error fetching food data.</div>;
//     }

//     const foods: Food[] = foodData.foods;

//     return (
//         <StyledWrapper>
//             <StyledTitle>Search Results for "{food}"</StyledTitle>
//             <StyledDiv>
//                 <FoodSearch
//                     key={foods[0].fdcId}
//                     fdcId={foods[0].fdcId}
//                     description={foods[0].description}
//                     foodNutrients={foods[0].foodNutrients}
//                 />
//             </StyledDiv>
//         </StyledWrapper>
//     );
// }