//Khai Duc Pham's code
export type Food = {
    fdcId: number;              //the unique ID assigned by USDA to each food item
    description: string;        //the readable food name like Whole Milk
    foodNutrients: {            //the array of nutrients entries attached to this food
        nutrientName: string;   //For example, Energy, Total lipid (fat), Total Sugars, etc
        value: number;          //the numeric value of each nutrients in that nutrient's unit (g, kcal, etc)
    }[];
} 
    