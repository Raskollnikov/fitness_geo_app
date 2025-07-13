import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Load Gemini API key from env
const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!key) {
  throw new Error("Missing Gemini API Key");
}

// ✅ Initialize Gemini SDK
const genAI = new GoogleGenerativeAI(key);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.4,
    topP: 0.9,
    responseMimeType: "application/json",
  },
});

// ✅ Validate the returned JSON
function validateWorkoutPlan(plan: any) {
  return {
    schedule: plan.schedule,
    exercises: plan.exercises.map((exercise: any) => ({
      day: exercise.day,
      routines: exercise.routines.map((routine: any) => ({
        name: routine.name,
        sets: typeof routine.sets === "number" ? routine.sets : parseInt(routine.sets) || 1,
        reps: typeof routine.reps === "number" ? routine.reps : parseInt(routine.reps) || 10,
      })),
    })),
  };
}

function validateDietPlan(plan: any) {
  return {
    dailyCalories: plan.dailyCalories,
    meals: plan.meals.map((meal: any) => ({
      name: meal.name,
      foods: meal.foods,
    })),
  };
}

// ✅ This uses Gemini to generate JSON from prompt
async function generatePlanFromPrompt(prompt: string) {
  const result = await model.generateContent(prompt);
  const text = await result.response.text();
  return JSON.parse(text); // Gemini returns plain JSON text
}

// ✅ Main function that returns full JSON response
export async function generateDietPlan(formData: any) {
  const { age, height, weight, numberOfDays, fitnessGoal, fitnessLevel } = formData;

  const workoutPrompt = `You are an experienced fitness coach creating a personalized workout plan based on:
  Age: ${age}
  Height: ${height}
  Weight: ${weight}
  Available days for workout: ${numberOfDays}
  Fitness goal: ${fitnessGoal}
  Fitness level: ${fitnessLevel}

  CRITICAL SCHEMA INSTRUCTIONS:
  - ONLY include fields shown in the structure below
  - "sets" and "reps" MUST be numbers (not strings)
  - For cardio, use numeric reps/sets (e.g., "sets": 1, "reps": 1)
  - Return ONLY this JSON format:
  -can you try Georgian language ? i mean give me all the data in  Geo language give me diet plan in georgian
  -if there is a word 'რბოლა' change with 'ძუნძული' or 'სირბილი'
  -Breakfast-საუზმე Lunch-სადილი Snack-სნექი Dinner-ვახშამი Post-workout snack-ვარჯიშის შემდგომ
  {
    "schedule": ["Monday", "Wednesday", "Friday"],
    "exercises": [
      {
        "day": "Monday",
        "routines": [
          {
            "name": "Exercise Name",
            "sets": 3,
            "reps": 10
          }
        ]
      }
    ]
  }`;

  const workoutPlanRaw = await generatePlanFromPrompt(workoutPrompt);
  const workoutPlan = validateWorkoutPlan(workoutPlanRaw);

  const dietPrompt = `You are an experienced nutrition coach creating a personalized diet plan based on:
  Age: ${age}
  Height: ${height}
  Weight: ${weight}
  Fitness goal: ${fitnessGoal}

  CRITICAL SCHEMA INSTRUCTIONS:
  - ONLY include the following fields:
  - "dailyCalories" (number)
  - "meals" (array of meals with "name" and "foods")
  - DO NOT add any other fields

  -can you try Georgian language ? i mean give me all the data in  Geo language give me diet plan in georgian
  -if there is a word 'რბოლა' change with 'ძუნძული' or 'სირბილი'
  -Breakfast-საუზმე Lunch-სადილი Snack-სნექი Dinner-ვახშამი Post-workout snack-ვარჯიშის შემდგომ
  
  Return ONLY this JSON format:

  {
    "dailyCalories": 2000,
    "meals": [
      {
        "name": "Breakfast",
        "foods": ["Oatmeal with berries", "Greek yogurt", "Black coffee"]
      },
      {
        "name": "Lunch",
        "foods": ["Grilled chicken salad", "Whole grain bread", "Water"]
      }
    ]
  }`;

  const dietPlanRaw = await generatePlanFromPrompt(dietPrompt);
  const dietPlan = validateDietPlan(dietPlanRaw);

  return new Response(
    JSON.stringify({
      success: true,
      data: {
        workoutPlan,
        dietPlan,
      },
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
