import { useState, useEffect } from "react";
import { Globe, ArrowRight, Sparkles, LucideLoader } from "lucide-react";
import VendorSummary from "../VendorSummary/index.jsx";
import VendorEditor from "../VendorEditor/index.jsx";
import { useScraper } from "../../hooks/useScraper";
const Onboarding = ({ step, setStep }) => {
  const [domain, setDomain] = useState("");
  const [companyData, setCompanyData] = useState(null);
  const [errors, setErrors] = useState({});

  const {
    isLoading,
    progress,
    result,
    error: apiError,
    startScraping,
    resumeJob,
  } = useScraper();

  console.log("progress", progress);

  useEffect(() => {
    const storedData = localStorage.getItem("__onboarding-Vendors-SDN");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        if (parsed.success && parsed.data) {
          setCompanyData(parsed.data);
          // Only move to the editor if the current step is before the editor
          if (typeof step === "number" && step < 3) setStep(3);
        }
      } catch (err) {
        console.error("Failed to parse stored data:", err);
      }
    } else {
      resumeJob();
    }
  }, [resumeJob, setStep, step]);

  useEffect(() => {
    if (result) {
      setCompanyData(result);
      if (typeof step === "number" && step < 3) setStep(3);
    }
  }, [result, setStep, step]);

  useEffect(() => {
    if (apiError) {
      setErrors({ general: apiError });
    }
  }, [apiError]);
  
  const handleDomainSubmit = (e) => {
    e.preventDefault();

    // Auto-convert to lowercase
    const normalizedDomain = domain.trim().toLowerCase();

    // More accurate and simple domain regex
    const urlPattern = /^[a-z0-9.-]+\.[a-z]{2,}$/;

    if (!normalizedDomain) {
      setErrors({ domain: "Please enter a domain name" });
      return;
    }

    if (!urlPattern.test(normalizedDomain)) {
      setErrors({
        domain: "Please enter a valid domain (e.g., example.com)",
      });
      return;
    }

    const fullUrl = normalizedDomain.startsWith("http")
      ? normalizedDomain
      : `https://${normalizedDomain}`;

    setErrors({});
    setStep(2);
    startScraping(fullUrl);
  };

  // 🟣 Welcome Step
  if (step === 0) {
    return (
      <div className="h-[calc(100dvh-64px)] flex items-center justify-center px-6">
        <div className="text-center flex flex-col items-center justify-center gap-y-2 max-w-3xl px-8 py-16 text-slate-800 overflow-hidden rounded-xl bg-white">
          {/* Top Label */}
          <div className="opacity-0 animate-[fadeIn_0.8s_ease-out_0.5s_forwards]">
            <span className="px-4 py-2 rounded-full text-sm font-medium border text-(--dark-blue) border-[#e6e6e6] tracking-wide inline-block bg-white/80 backdrop-blur-sm">
              Welcome to the Vendor Network
            </span>
          </div>

          <div>
            {/* Heading */}
            <h1 className="text-3xl lg:text-5xl font-semibold leading-tight text-(--dark-blue)/85 opacity-0 animate-[fadeIn_0.8s_ease-out_0.7s_forwards]">
              Empower Your Growth as Our{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, var(--deep-blue), var(--sky-blue), var(--lavender-purple))",
                }}
              >
                Partner
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-lg lg:text-lg text-[#696871] font-normal leading-relaxed opacity-0 animate-[fadeIn_0.8s_ease-out_0.9s_forwards]">
              Join a community of trusted vendors delivering innovative
              solutions.
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => setStep(1)}
            className="btn-blue mt-3 opacity-0 animate-[fadeIn_0.8s_ease-out_1.1s_forwards] hover:shadow-md transition-all duration-300"
          >
            <span>Start Onboarding</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    );
  }

  // 🟣 Domain Step
  if (step === 1) {
    return (
      <div className="h-[calc(100dvh-100px)] flex items-center justify-center px-6  rounded-t-full">
        <div className="w-2xl max-w-fit rounded backdrop-blur-xl py-12 px-8 sm:px-12 text-center">
          <h2 className="text-3xl flex items-center gap-2 text-left font-semibold text-[#3F3F3F] mb-2.5 opacity-0 animate-[fadeIn_0.8s_ease-out_0.2s_forwards]">
            Enter Your Domain
          </h2>
          <p className="text-[#3F3F3F] text-lg mb-2 text-left opacity-0 animate-[fadeIn_0.8s_ease-out_0.4s_forwards]">
            We'll automatically retrieve your company information
          </p>

          <form onSubmit={handleDomainSubmit} className="space-y-8">
            <div className="relative opacity-0 animate-[fadeIn_0.8s_ease-out_0.6s_forwards]">
              <input
                type="text"
                value={domain}
                onChange={(e) => {
                  setDomain(e.target.value);
                  setErrors({});
                }}
                placeholder="example.com"
                className={`w-full py-4 border-b-2 bg-transparent text-lg transition-colors
                  focus:outline-none focus:ring-0 focus:border-indigo-500 placeholder-[#3F3F3F]/35
                  ${
                    errors.domain
                      ? "border-red-500 text-red-700 placeholder-red-400"
                      : "border-gray-300 text-gray-900"
                  }`}
              />
              {errors.domain && (
                <p className="mt-2 text-sm text-red-600 font-medium text-left">
                  {errors.domain}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="cta btn-blue w-full opacity-0 animate-[fadeIn_0.8s_ease-out_0.8s_forwards]
              transition-all duration-200"
            >
              Continue
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 🟣 Loading Step
  if (isLoading || step === 2) {
    return (
      <div className="h-full flex items-center justify-center px-6">
        <div className="w-full max-w-xl mx-auto p-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-4">
            <Sparkles className="w-10 h-10 text-indigo-600 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Analyzing Your Company
          </h2>
          <p className="text-gray-600 mb-6">
            Fetching data from <span className="font-semibold">{domain}</span>
          </p>

          <div className="space-y-2 max-h-64 w-full overflow-hidden">
            {progress.length > 0
              ? progress.map((msg, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-center gap-2"
                  >
                    <LucideLoader className="w-5 h-5 text-(--dark-blue)/55 animate-spin" />
                    <span className="text-sm text-(--dark-gray)/70 text-nowrap">
                      {msg}
                    </span>
                  </div>
                ))
              : ["Connecting to server...", "Starting analysis..."].map(
                  (text, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-center gap-3"
                    >
                      <LucideLoader className="w-5 h-5 text-(--dark-blue)/55 animate-spin" />
                      <span className="text-sm text-(--dark-gray)/30">
                        {text}
                      </span>
                    </div>
                  )
                )}
          </div>

          {errors.general && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 🟣 Review Step
  if (step === 3 && companyData) {
    return <VendorEditor setStep={setStep} />;
  }

  if (step === 4) {
    return <VendorSummary setStep={setStep} />;
  }

  return null;
};

export default Onboarding;
