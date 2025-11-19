import { useState } from "react";
import Onboarding from "../Onboarding/index.jsx";

const Home = () => {
  // persist onboarding step in localStorage so it survives reloads
  const STORAGE_KEY = "onboarding_step";
  const [step, setStep] = useState(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      return v !== null ? Number(v) : 0;
    } catch {
      return 0;
    }
  });

  const setStepPersist = (next) => {
    const ns = Number(next);
    if (Number.isNaN(ns)) return;
    // clamp between 0 and 4
    const clamped = Math.max(0, Math.min(4, ns));
    try {
      localStorage.setItem(STORAGE_KEY, String(clamped));
    } catch {
      /* ignore storage errors */
    }
    setStep(clamped);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header: rounded tab navigation (DailyUI-style) */}
      {/* <div className="w-full flex justify-center items-center py-4 px-2">
        <div className="w-full flex rounded-full shadow-md bg-white gap-0.5 overflow-hidden">
          {[
            {
              label: "Home",
              icon: (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M3 12l9-8 9 8" />
                  <path d="M9 21V13h6v8" />
                </svg>
              ),
            },
            {
              label: "Domain",
              icon: (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="8" r="3" />
                  <path d="M5.5 20a6.5 6.5 0 0113 0" />
                </svg>
              ),
            },
            {
              label: "Editor",
              icon: (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="7" width="18" height="13" rx="2" />
                  <path d="M7 7V4a2 2 0 012-2h6a2 2 0 012 2v3" />
                </svg>
              ),
            },
            { label: "Summary", icon: null },
          ].map((tab, idx, arr) => {
            // Determine active tab from `step`.
            // Map steps 0..2 to first 3 tabs, else last.
            // Special case: when `step === 2` (loading), do NOT highlight the "Editor" tab (idx 2).
            let activeIdx = null;
            // Map onboarding steps to tabs:
            // step 0 -> Home (0)
            // step 1 -> Domain (1)
            // step 2 -> Loading (no highlight)
            // step 3 -> VendorEditor -> highlight Editor (2)
            // step 4+ -> Summary (3)
            if (step === 0) activeIdx = 0;
            else if (step === 1) activeIdx = 1;
            else if (step === 2) activeIdx = null; // loading, no highlight
            else if (step === 3) activeIdx = 2; // Editor
            else activeIdx = arr.length - 1; // Summary
            const isActive = activeIdx !== null && idx === activeIdx;
            // const handleClick = () => {
            //   // Map visual tab index to onboarding steps: Home(0), Domain(1), Editor(3), Summary(4)
            //   let targetStep = 0;
            //   if (idx === 0) targetStep = 0;
            //   else if (idx === 1) targetStep = 1;
            //   else if (idx === 2) targetStep = 3;
            //   else targetStep = 4;
            //   setStepPersist(targetStep);
            // };

            return (
              <button
                key={tab.label}
                // onClick={handleClick}
                className={
                  `flex-1 flex items-center h-full justify-center rounded-full gap-3 px-4 py-6 text-sm font-medium transition-all duration-200 focus:outline-none ${
                    isActive
                      ? "bg-linear-to-r from-[#1e90ff] to-[#0066f0] text-white shadow-lg rounded-full"
                      : "bg-white text-gray-400"
                  }` +
                  (idx === 0
                    ? " rounded-l-full"
                    : idx === arr.length - 1
                    ? " rounded-r-full"
                    : "")
                }
              >
                {tab.icon && <span className="opacity-90">{tab.icon}</span>}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div> */}

      {/* Bottom Onboarding Section */}
      <div className="flex-1 w-full z-50 bg-white overflow-hidden">
        <Onboarding step={step} setStep={setStepPersist} />
      </div>
    </div>
  );
};

export default Home;
