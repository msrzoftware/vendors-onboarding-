import { useState } from "react";
import { Globe, Loader2, Building2, ArrowRight, Sparkles } from "lucide-react";
const Onboarding = ({ step, setStep, setIsLoading }) => {
  const [domain, setDomain] = useState("");
  const [companyData, setCompanyData] = useState(null);
  const [errors, setErrors] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    info: false,
    products: false,
    contact: false,
    social: false,
  });

  const scrapeCompanyData = async () => {
    setIsLoading(true);
    setErrors({});
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const mockData = {
      companyName: "TechVendor Solutions",
      description:
        "Leading provider of enterprise software solutions specializing in cloud infrastructure and digital transformation services.",
      industry: "Technology & Software",
      founded: "2015",
      employees: "250-500",
      location: "San Francisco, CA",
      products: [
        {
          name: "CloudSync Pro",
          category: "Cloud Infrastructure",
          description:
            "Enterprise-grade cloud synchronization and management platform",
        },
        {
          name: "DataVault Security",
          category: "Cybersecurity",
          description: "Advanced encryption and data protection solution",
        },
        {
          name: "WorkFlow AI",
          category: "Automation",
          description: "AI-powered workflow automation and optimization tool",
        },
      ],
      contact: {
        email: "info@techvendor.com",
        phone: "+1 (555) 123-4567",
      },
      socialMedia: {
        linkedin: "linkedin.com/company/techvendor",
        twitter: "@techvendor",
      },
    };

    setCompanyData(mockData);
    setIsLoading(false);
    setStep(3);
  };

  const handleDomainSubmit = (e) => {
    e.preventDefault();
    const urlPattern =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!domain) {
      setErrors({ domain: "Please enter a domain name" });
      return;
    }
    if (!urlPattern.test(domain)) {
      setErrors({ domain: "Please enter a valid domain (e.g., example.com)" });
      return;
    }

    setStep(2);
    scrapeCompanyData(domain);
  };

  const handleApproval = () => {
    alert("Company details submitted successfully!");
    setStep(0);
    setDomain("");
    setCompanyData(null);
    setExpandedSections({
      info: true,
      products: false,
      contact: false,
      social: false,
    });
  };

  const handleEdit = () => {
    setStep(1);
    setCompanyData(null);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // 🟣 Welcome Step
  if (step === 0) {
    return (
      <div className="h-screen flex items-center justify-center px-6 py-16">
        <div
          className="text-center flex flex-col items-center justify-center max-w-3xl mx-auto text-slate-800 space-y-6
                  opacity-0 translate-y-6
                  animate-[fadeIn_0.8s_ease-out_0.5s_forwards]"
        >
          <div className="opacity-0 translate-y-6 animate-[fadeIn_0.8s_ease-out_0.5s_forwards]">
            <span className="px-4 py-2 bg-indigo-100 border border-indigo-300 rounded-full text-sm font-medium text-indigo-700 tracking-wide">
              Welcome to the Vendor Network
            </span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold leading-tight opacity-0 translate-y-6 animate-[fadeIn_0.8s_ease-out_0.7s_forwards]">
            Empower Your Growth as Our{" "}
            <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Partner
            </span>
          </h1>

          <p className="text-lg lg:text-xl text-slate-600 leading-relaxed opacity-0 translate-y-6 animate-[fadeIn_0.8s_ease-out_0.9s_forwards]">
            Join a community of trusted vendors delivering innovative solutions.
          </p>

          <button
            className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-10 rounded-4xl transition-all flex items-center justify-center space-x-2 opacity-0 translate-y-6 animate-[fadeIn_0.8s_ease-out_1.1s_forwards]"
            onClick={() => setStep(1)}
          >
            <span>Start Onboarding</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // 🟣 Domain Step
  if (step === 1) {
    return (
      <div className="h-screen flex items-center justify-center px-6  rounded-t-full">
        <div className="w-xl max-w-2xl border rounded border-gray-200/5 backdrop-blur-xl bg-white/55 py-12 px-8 sm:px-12 text-center">
          <h2 className="text-3xl flex items-center gap-2 text-left font-bold text-gray-900 mb-4 opacity-0 animate-[fadeIn_0.8s_ease-out_0.2s_forwards]">
            <Globe className="w-8 h-8 text-indigo-600" />
            Enter Your Domain
          </h2>
          <p className="text-gray-600 mb-3 text-left opacity-0 animate-[fadeIn_0.8s_ease-out_0.4s_forwards]">
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
                className={`w-full py-4 border-b-2 bg-transparent text-xl transition-colors
                  focus:outline-none focus:ring-0 focus:border-indigo-500 placeholder-gray-400
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
              className="w-full opacity-0 animate-[fadeIn_0.8s_ease-out_0.8s_forwards] bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-4xl flex items-center justify-center gap-2
              hover:from-indigo-700 hover:to-purple-700
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
              active:scale-[0.98] transition-all duration-200"
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
  if (step === 2) {
    return (
      <div className="h-full flex items-center justify-center px-6">
        <div className="w-full max-w-md mx-auto p-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-4">
            <Sparkles className="w-10 h-10 text-indigo-600 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Analyzing Your Company
          </h2>
          <p className="text-gray-600 mb-6">
            Fetching data from <span className="font-semibold">{domain}</span>
          </p>

          <div className="space-y-2">
            {["Fetching company details...", "Analyzing business info..."].map(
              (text, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                  <span className="text-sm text-gray-600">{text}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  // 🟣 Review Step
  if (step === 3 && companyData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-slate-900 to-slate-800 p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <Building2 className="w-8 h-8" />
              </div>
              <h2 className="text-4xl font-bold tracking-tight">
                {companyData.companyName}
              </h2>
            </div>
            <p className="text-slate-300 text-lg leading-relaxed max-w-3xl">
              {companyData.description}
            </p>
          </div>

          {/* Expandable Sections */}
          <div className="p-8 space-y-6">
            <Section
              title="Company Information"
              expanded={expandedSections.info}
              onToggle={() => toggleSection("info")}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { label: "Industry", value: companyData.industry },
                  { label: "Founded", value: companyData.founded },
                  { label: "Company Size", value: companyData.employees },
                  { label: "Location", value: companyData.location },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 p-6 rounded-2xl border border-slate-200"
                  >
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-2">
                      {item.label}
                    </p>
                    <p className="text-slate-900 font-semibold text-lg">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </Section>

            <Section
              title="Products & Services"
              expanded={expandedSections.products}
              onToggle={() => toggleSection("products")}
            >
              <div className="space-y-4">
                {companyData.products.map((prod, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 hover:shadow-sm transition-all"
                  >
                    <p className="font-semibold text-indigo-800">{prod.name}</p>
                    <p className="text-sm text-indigo-600">{prod.category}</p>
                    <p className="text-gray-700 text-sm mt-1">
                      {prod.description}
                    </p>
                  </div>
                ))}
              </div>
            </Section>

            <Section
              title="Contact Information"
              expanded={expandedSections.contact}
              onToggle={() => toggleSection("contact")}
            >
              <p className="text-gray-800 font-medium">
                Email: {companyData.contact.email}
              </p>
              <p className="text-gray-800 font-medium">
                Phone: {companyData.contact.phone}
              </p>
            </Section>

            <Section
              title="Social Media"
              expanded={expandedSections.social}
              onToggle={() => toggleSection("social")}
            >
              <p className="text-gray-800 font-medium">
                LinkedIn: {companyData.socialMedia.linkedin}
              </p>
              <p className="text-gray-800 font-medium">
                Twitter: {companyData.socialMedia.twitter}
              </p>
            </Section>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-200 mt-6">
              <button
                onClick={handleEdit}
                className="flex-1 bg-white border-2 border-slate-300 hover:border-slate-400 text-slate-700 font-semibold py-4 px-6 rounded-2xl transition-all duration-300 hover:bg-slate-50"
              >
                ← Edit Domain
              </button>
              <button
                onClick={handleApproval}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 px-6 rounded-2xl hover:shadow-lg transition-all duration-300"
              >
                Approve & Submit →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// Reusable Section Component
function Section({ title, expanded, onToggle, children }) {
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <span className="font-semibold text-slate-900">{title}</span>
        <span className="text-slate-500 text-xl">{expanded ? "−" : "+"}</span>
      </button>
      <div
        className={`transition-max-h duration-500 overflow-hidden ${
          expanded ? "max-h-[2000px] p-4" : "max-h-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default Onboarding;
