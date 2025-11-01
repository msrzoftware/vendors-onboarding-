import { useEffect, useState } from "react";
import Onboarding from "../Onboarding/index.jsx";

const Home = () => {
  const [step, setStep] = useState(0);
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
      ? "20%" // Welcome
      : step === 1
      ? "50%" // Domain
      : step === 2
      ? summaryActive
        ? "60%" // Loading completes (Summary appears)
        : "50%" // While loading
      : step === 3
      ? "80%" // Summary
      : step === 4
      ? "100%" // Completion
      : "100%";

  return (
    <div className="flex flex-col h-screen bg-(--bgColor)">
      {/* Top Step Indicator */}
      <div className="relative w-full h-fit flex items-center justify-center opacity-0 animate-[fadeIn_0.8s_ease-out_0.3s_forwards]">
        {/* Gradient fill behind steps */}
        <div
          className="max-w-full absolute top-0 left-0 z-0 h-24 transition-all duration-700 ease-out"
          style={{
            width: gradientWidth,
            backgroundImage:
              "linear-gradient(85deg, #2c4e9b, #2289cc, #27b7e4, #2289cc, #2c4e9b)",
            backgroundSize: "200%",
            backgroundPosition: "right",
            transition: "background-position 0.5s ease-out",
          }}
        />

        {/* Step labels with optional pulsing overlay */}
        <div className={`relative z-10 w-full h-full flex`}>
          {["Welcome", "Domain", "Summary", "Completion"].map((label, idx) => {
            // Calculate if this step should be filled based on gradientWidth percentage
            const stepPercentage = (idx + 1) * 25; // Each step represents 25%
            const gradientPercentage = parseInt(gradientWidth);
            const isFilled = gradientPercentage >= stepPercentage;

            return (
              <div
                key={idx}
                className={`flex-1 h-16 flex items-center justify-center text-lg font-light transition-colors duration-500
                  ${isFilled ? "text-white" : "text-black"}`}
              >
                {label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Onboarding Section */}
      <div className="flex-1 w-full z-50 bg-white rounded-t-[5%] overflow-hidden">
        <Onboarding step={step} setStep={setStep} />
      </div>
    </div>
  );
};

export default Home;
