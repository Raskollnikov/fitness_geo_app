"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import ProfileHeader from "../components/ProfileHeader";
import NoFitnessPlan from "../components/NoFitnessPlan";
import CornerElements from "../components/CornerElements";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { AppleIcon, CalendarIcon, DumbbellIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
type Routine = {
  name: string;
  sets: number;
  reps: number;
  description?: string;
};

type ExerciseDay = {
  day: string;
  routines: Routine[];
};

type Meal = {
  name: string;
  foods: string[];
};

type Plan = {
  _id: string;
  userId: string;
  username: string;
  email: string;
  imageUrl: string;
  formData: {
    age: string;
    weight: string;
    height: string;
    fitnessGoal: string;
    numberOfDays: string;
    fitnessLevel: string;
  };
  workoutPlan: {
    schedule: string[];
    exercises: ExerciseDay[];
  };
  dietPlan: {
    dailyCalories: number;
    meals: Meal[];
  };
  createdAt: string;
};

const ProfilePage = () => {
  const { user } = useUser();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  

  useEffect(() => {
    if (!user?.id) return;

    const fetchPlans = async () => {
      try {
        const res = await fetch(`/api/get-plan?userId=${user.id}`);
        const data = await res.json();
        if (data.success) {
          setPlans(data.plans);
        }
      } catch (err) {
        console.error("Failed to fetch plans:", err);
      }
    };

    fetchPlans();
  }, [user?.id]);

  if (!user) return <p className="text-white text-center mt-10">Loading user...</p>;
  if (!plans || plans.length === 0) return <NoFitnessPlan />;

  const activePlan = plans[0]; // fallback to first, since `isActive` doesn't exist
  const currentPlan = selectedPlanId
    ? plans.find((plan) => plan._id === selectedPlanId)
    : activePlan;

  return (
    <section className="relative z-10 pt-12 pb-32 flex-grow container mx-auto px-4">
      <ProfileHeader user={user} />

      <div className="space-y-8">
        {/* PLAN SELECTOR */}
        <div className="relative backdrop-blur-sm border border-border p-6">
          <CornerElements />
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight">
              <span className="text-primary">Your</span>{" "}
              <span className="text-foreground">Fitness Plans</span>
            </h2>
            <div className="font-mono text-xs text-muted-foreground">
              TOTAL: {plans.length}
            </div>
          </div>

          

          <div className="flex flex-wrap gap-2">
            {plans.map((plan) => (
              <Button
                key={plan?._id} // ✅ Use _id instead of id
                onClick={() => setSelectedPlanId(plan?._id)} // ✅ Use _id
                className={`text-foreground border hover:text-white ${
                  selectedPlanId === plan?._id
                    ? "bg-primary/20 text-primary border-primary"
                    : "bg-transparent border-border hover:border-primary/50"
                }`}
              >
                {/* ✅ Plan name fallback from formData */}
                {plan?.formData?.fitnessGoal?.replace("_", " ") || "Unnamed Plan"}
              </Button>
            ))}
          </div>
        </div>
        {/* INFO */}
        {/* USER INFO */}
        {currentPlan && (
        <div className="relative backdrop-blur-sm border border-border rounded-lg p-6">
          <CornerElements />

          <h3 className="text-lg font-bold mb-4 text-primary">Your Profile Info</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-sm">
              <span className="text-muted-foreground">Age:</span>{" "}
              {currentPlan.formData?.age || "N/A"}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Weight:</span>{" "}
              {currentPlan.formData?.weight} kg
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Height:</span>{" "}
              {currentPlan.formData?.height} cm
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Fitness Level:</span>{" "}
              {currentPlan.formData?.fitnessLevel || "N/A"}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Goal:</span>{" "}
              {currentPlan.formData?.fitnessGoal?.replace("_", " ") || "N/A"}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Days/Week:</span>{" "}
              {currentPlan.formData?.numberOfDays}
            </div>
          </div>
        </div>
        )}
        {/* PLAN DETAILS */}
        {currentPlan && (
          <div className="relative backdrop-blur-sm border border-border rounded-lg p-6">
            <CornerElements />

            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <h3 className="text-lg font-bold">
                PLAN:{" "}
                <span className="text-primary">
                  {currentPlan?.formData?.fitnessGoal?.replace("_", " ") || "Unnamed Plan"}
                </span>
              </h3>
            </div>

            <Tabs defaultValue="workout" className="w-full">
              <TabsList className="mb-6 w-full grid grid-cols-2 bg-cyber-terminal-bg border">
                <TabsTrigger
                  value="workout"
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  <DumbbellIcon className="mr-2 size-4" />
                  Workout Plan
                </TabsTrigger>

                <TabsTrigger
                  value="diet"
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  <AppleIcon className="mr-2 h-4 w-4" />
                  Diet Plan
                </TabsTrigger>
              </TabsList>

              {/* Workout Tab */}
              <TabsContent value="workout">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    <span className="font-mono text-sm text-muted-foreground">
                      SCHEDULE: {currentPlan.workoutPlan?.schedule?.join(", ")}
                    </span>
                  </div>

                  <Accordion type="multiple" className="space-y-4">
                    {currentPlan.workoutPlan?.exercises?.map((exerciseDay, index) => (
                      <AccordionItem
                        key={index}
                        value={exerciseDay.day}
                        className="border rounded-lg overflow-hidden"
                      >
                        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-primary/10 font-mono">
                          <div className="flex justify-between w-full items-center">
                            <span className="text-primary">{exerciseDay.day}</span>
                            <div className="text-xs text-muted-foreground">
                              {exerciseDay.routines.length} EXERCISES
                            </div>
                          </div>
                        </AccordionTrigger>

                        <AccordionContent className="pb-4 px-4">
                          <div className="space-y-3 mt-2">
                            {exerciseDay.routines.map((routine, routineIndex) => (
                              <div
                                key={routineIndex}
                                className="border border-border rounded p-3 bg-background/50"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-semibold text-foreground">
                                    {routine.name}
                                  </h4>
                                  <div className="flex items-center gap-2">
                                    <div className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-mono">
                                      {routine.sets} SETS
                                    </div>
                                    <div className="px-2 py-1 rounded bg-secondary/20 text-secondary text-xs font-mono">
                                      {routine.reps} REPS
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </TabsContent>

              {/* Diet Tab */}
              <TabsContent value="diet">
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-sm text-muted-foreground">
                      DAILY CALORIE TARGET
                    </span>
                    <div className="font-mono text-xl text-primary">
                      {currentPlan.dietPlan?.dailyCalories} KCAL
                    </div>
                  </div>

                  <div className="h-px w-full bg-border my-4"></div>

                  <div className="space-y-4">
                    {currentPlan.dietPlan?.meals?.map((meal, index) => (
                      <div
                        key={index}
                        className="border border-border rounded-lg overflow-hidden p-4"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                          <h4 className="font-mono text-primary">{meal.name}</h4>
                        </div>
                        <ul className="space-y-2">
                          {meal.foods.map((food, foodIndex) => (
                            <li
                              key={foodIndex}
                              className="flex items-center gap-2 text-sm text-muted-foreground"
                            >
                              <span className="text-xs text-primary font-mono">
                                {String(foodIndex + 1).padStart(2, "0")}
                              </span>
                              {food}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfilePage;
