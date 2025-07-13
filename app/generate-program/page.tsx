'use client'; 
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { generateDietPlan } from '@/lib/generateDietPlan';
type FormData = {
  age: string;
  weight: string;
  height: string;
  fitnessGoal: string;
  numberOfDays: string;
  fitnessLevel: string;
};

function DietForm({}) {
  const [formData, setFormData] = useState<FormData>({
    age: '',
    weight: '',
    height: '',
    fitnessGoal: '',
    numberOfDays: '',
    fitnessLevel: '',
  });

  const { user } = useUser();
  const router = useRouter();

  const handleChange = ( e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const response = await generateDietPlan(formData);
  const result = await response.json();

  if (result.success) {
    const { workoutPlan, dietPlan } = result.data;

    // ✅ Send all user + plan info to backend
    await fetch("/api/save-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user?.id,
        username: user?.username,
        email: user?.primaryEmailAddress?.emailAddress,
        imageUrl: user?.imageUrl,
        formData,
        workoutPlan,
        dietPlan,
      }),
    });

    router.push("/profile");
  } else {
    console.error("Failed to generate plans");
  }
};


  return (
    <div className="diet-form-container bg-zinc-900 p-8 rounded-lg shadow-lg max-w-xl mx-auto text-gray-100 border border-cyan-700/30 mb-20 mt-10">
      <h2 className="text-xl md:text-4xl font-bold text-cyan-400 mb-6 text-center">
        შექმენი თქვენი პერსონალური კვების გეგმა
      </h2>

      <form onSubmit={handleSubmit}>
      
        <div className="form-group mb-4">
          <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-1">
            ასაკი:
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            // Input field styling: full width, padding, dark background,
            // subtle border, rounded corners, white text, and focus glow effect.
            className="w-full p-3 bg-zinc-800 border border-gray-700 rounded-md text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                       transition-colors duration-200"
          />
        </div>

        {/* Form Group for Weight */}
        <div className="form-group mb-4">
          <label htmlFor="weight" className="block text-sm font-medium text-gray-300 mb-1">
            წონა (kg):
          </label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            required
            className="w-full p-3 bg-zinc-800 border border-gray-700 rounded-md text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                       transition-colors duration-200"
          />
        </div>

        {/* Form Group for Height */}
        <div className="form-group mb-4">
          <label htmlFor="height" className="block text-sm font-medium text-gray-300 mb-1">
            სიმაღლე (cm):
          </label>
          <input
            type="number"
            id="height"
            name="height"
            value={formData.height}
            onChange={handleChange}
            required
            className="w-full p-3 bg-zinc-800 border border-gray-700 rounded-md text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                       transition-colors duration-200"
          />
        </div>

        {/* Form Group for Fitness Goal */}
        <div className="form-group mb-4">
          <label htmlFor="fitnessGoal" className="block text-sm font-medium text-gray-300 mb-1">
            მიზანი:
          </label>
          <select
            id="fitnessGoal"
            name="fitnessGoal"
            value={formData.fitnessGoal}
            onChange={handleChange}
            required
            className="w-full p-3 bg-zinc-800 border border-gray-700 rounded-md text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                       transition-colors duration-200 appearance-none"
          >
            <option value="">აირჩიე მიზანი</option>
            <option value="weight_loss">წონის კლება</option>
            <option value="muscle_gain">კუნთის მატება</option>
            <option value="maintenance">ფორმის შენარჩუნება</option>
            <option value="improved_endurance">გამძლეობის გაუმჯობესობა</option>
          </select>
        </div>

        {/* Form Group for Number of Days */}
        <div className="form-group mb-4">
          <label htmlFor="numberOfDays" className="block text-sm font-medium text-gray-300 mb-1">
            აირჩიე სასურველი დღეების რაოდენობა:
          </label>
          <input
            type="number"
            id="numberOfDays"
            name="numberOfDays"
            value={formData.numberOfDays}
            onChange={handleChange}
            min="1"
            max="30" // Example max, adjust as needed
            required
            className="w-full p-3 bg-zinc-800 border border-gray-700 rounded-md text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                       transition-colors duration-200"
          />
        </div>

        {/* Form Group for Fitness Level */}
        <div className="form-group mb-6"> {/* Increased bottom margin for button */}
          <label htmlFor="fitnessLevel" className="block text-sm font-medium text-gray-300 mb-1">
            დონე:
          </label>
          <select
            id="fitnessLevel"
            name="fitnessLevel"
            value={formData.fitnessLevel}
            onChange={handleChange}
            required
            className="w-full p-3 bg-zinc-800 border border-gray-700 rounded-md text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                       transition-colors duration-200 appearance-none"
          >
            <option value="">აირჩიე შენი დონე</option>
            <option value="beginner">დამწყები</option>
            <option value="intermediate">საშუალო</option>
            <option value="advanced">ათლეტი</option>
          </select>
        </div>

      
        <button
          type="submit"
          className="w-full mt-6 py-3 px-6 bg-cyan-600 text-white font-semibold rounded-md
                     hover:bg-cyan-700 transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
          შექმენი პროგრამა
        </button>
      </form>
    </div>
  );
}

export default DietForm;
