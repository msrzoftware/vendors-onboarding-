import { useEffect, useState } from "react";
import Onboarding from "./Onboarding.jsx";

const Home = () => {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [summaryActive, setSummaryActive] = useState(false);

  // Delay Summary gradient fill
  useEffect(() => {
    if (step === 2) {
      const timer = setTimeout(() => setSummaryActive(true), 2500);
      return () => clearTimeout(timer);
    } else {
      setSummaryActive(false);
    }
  }, [step]);

  const gradientWidth =
    step === 0
      ? "33.33%"
      : step === 1
      ? "66.66%"
      : step === 2
      ? summaryActive
        ? "100%"
        : "66.66%"
      : "100%";
  return (
    <div className="flex flex-col h-screen bg-slate-200">
      {/* Top Step Indicator */}
      <div className="relative w-full h-fit flex items-center justify-center opacity-0 animate-[fadeIn_0.8s_ease-out_0.3s_forwards]">
        {/* Gradient fill behind steps */}
        <div
          className="max-w-full absolute top-0 left-0 z-0 h-32 bg-linear-to-r from-indigo-500 to-purple-500 transition-all duration-700 ease-out"
          style={{ width: gradientWidth }}
        />

        {/* Step labels with optional pulsing overlay */}
        <div
          className={`relative z-10 w-full h-full flex ${
            step === 1 && isLoading
              ? "bg-indigo-500 bg-opacity-20 animate-pulse rounded-xl"
              : ""
          }`}
        >
          {["Welcome", "Domain", "Summary"].map((label, idx) => (
            <div
              key={idx}
              className={`flex-1 h-16 flex items-center justify-center text-lg font-light transition-colors duration-500
                ${step >= idx ? "text-white" : "text-gray-700 bg-inherit"}`}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Onboarding Section */}
      <div className="flex-1 w-full z-50 bg-white rounded-t-[7%] overflow-hidden">
        <Onboarding
          step={step}
          setStep={setStep}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </div>
    </div>
  );
};

export default Home;
