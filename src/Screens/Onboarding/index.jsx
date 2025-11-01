import { useState } from "react";
import { Globe, ArrowRight, Sparkles, LucideLoader } from "lucide-react";
import VendorSummary from "../VendorSummary/index.jsx";
import VendorEditor from "../VendorEditor/index.jsx";
const Onboarding = ({ step, setStep }) => {
  const [domain, setDomain] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const [errors, setErrors] = useState({});

  const scrapeCompanyData = async () => {
    try {
      setIsLoading(true);
      setErrors({});
      await new Promise((resolve) => setTimeout(resolve, 2500));
      const mockData = {
        success: true,
        data: {
          product_name: "Linear",
          company_name: "Linear",
          website: "https://linear.app/",
          company_website: "https://linear.app/",
          weburl: "https://linear.app/",
          description:
            "Linear is a purpose-built tool for planning and building products, streamlining issue tracking, project planning, and product roadmaps for modern software teams.",
          product_description_short:
            "Linear is a fast, modern product development platform that combines issue tracking, project planning, and analytics with first-class integrations and AI-powered assistants. Designed for teams of all sizes, Linear helps product and engineering teams plan initiatives, manage issues and sprints (Cycles), centralize customer requests, and measure progress with dashboards and insights. The platform emphasizes speed, developer-first workflows (GitHub, GitLab, VS Code), extensibility (API & webhooks), and enterprise-grade security (SOC 2, HIPAA, GDPR). Linear offers a free tier for small teams, predictable per-user pricing for growing teams, and enterprise plans with advanced security, SAML/SCIM, and onboarding support.",
          overview:
            "Linear streamlines work across the entire software development lifecycle — from strategic planning to issue tracking and release. The product includes tools for planning (projects, initiatives, milestones), building (issues, cycles, triage, SLAs), and measuring (dashboards, realtime analytics). It integrates with common engineering and design tools (GitHub, Figma, Slack, Sentry) and exposes APIs and webhooks for custom automations.\n\nLinear also provides AI-assisted workflows and agents (Triage Intelligence, Linear for Agents, integrations with ChatGPT, GitHub Copilot, Cursor, and others) to automate routine tasks like triage, suggestion generation, and code/PR assistance. The platform is offered as a cloud SaaS product with desktop and mobile clients and includes enterprise-grade security controls such as SSO, SAML, SCIM, audit logs, IP restrictions, and compliance with SOC 2, HIPAA, and GDPR.",
          elevator_pitch:
            "Linear is a high-performance product development platform that helps teams plan, track, and execute product work with speed and clarity. Combining issue tracking, project roadmaps, cycles for sprint planning, customer request intake, first-class integrations, and AI-powered automation, Linear reduces overhead and helps teams focus on building high-quality software. Built for speed and scale, it supports startups and enterprises with advanced administrative controls, security certifications, and migration tools.",
          competitive_advantage:
            "Linear emphasizes performance, a crafted user experience, and developer-first workflows. Its competitive strengths include rapid issue creation and navigation, deep integrations with engineering tools (automated PR and commit workflows), built-in analytics and dashboards, AI-powered agents and triage intelligence to reduce manual work, and a security posture appropriate for enterprise customers (SOC 2, HIPAA, GDPR, SAML, SCIM). Linear's combination of speed, developer ergonomics, and built-in product planning features (initiatives, milestones, progress insights) distinguishes it from traditional issue trackers and general-purpose project tools.",
          usp: "A fast, developer-focused product development system combining issue tracking, roadmap planning, analytics, extensible integrations, and AI agents to streamline product and engineering workflows.",
          founding_year: null,
          year_founded: null,
          hq_location: "Remote (distributed across North America and Europe)",
          industry: [
            "Product Management",
            "Project Management",
            "Issue Tracking",
            "Software Development",
          ],
          market_size: "SMB, Mid-Market, Enterprise",
          industry_size: ["All Segments", "SMB", "Enterprise"],
          parent_category: "Product & Project Management",
          sub_category: "Issue tracking, Roadmapping, Agile project management",
          contact: {
            phone_number: null,
            country_code: null,
            support_email: "hello@linear.app",
            address: null,
          },
          social_links: [
            {
              platform: "X (Twitter)",
              url: "https://x.com/linear",
            },
            {
              platform: "GitHub",
              url: "https://github.com/linear",
            },
            {
              platform: "YouTube",
              url: "https://www.youtube.com/@linear",
            },
            {
              platform: "Slack (community)",
              url: "https://linear.app/join-slack",
            },
          ],
          social_profiles: {
            linkedin: null,
            twitter: "https://x.com/linear",
            facebook: null,
          },
          feature_overview:
            "Linear provides planning (projects, initiatives, milestones), fast issue tracking and cycle-based sprint planning, customer request intake, realtime analytics and dashboards, extensible integrations and APIs, and AI-powered agents to automate triage and routine tasks.",
          features: [
            {
              name: "Issue tracking",
              description:
                "Fast, keyboard-friendly issue creation and workflows optimized for engineering teams.",
            },
            {
              name: "Project planning",
              description:
                "Projects, milestones, and initiatives to set direction and coordinate long-term work.",
            },
            {
              name: "Cycles (sprint planning)",
              description:
                "Cycle-based planning to focus teams on the work that should happen next and track velocity.",
            },
            {
              name: "Triage",
              description:
                "Incoming work review and triage tools to assign, accept, decline, or mark duplicates.",
            },
            {
              name: "AI agents & Triage Intelligence",
              description:
                "AI-powered suggestions and agents for triage, summarization, code/PR assistance, and other automations.",
            },
            {
              name: "Linear Asks",
              description:
                "Turn requests from Slack or email into actionable issues and enable helpdesk-style workflows.",
            },
            {
              name: "Customer Requests",
              description:
                "Centralize and manage customer feedback and requests to build what customers actually want.",
            },
            {
              name: "Integrations",
              description:
                "100+ integrations including GitHub, Slack, Figma, Sentry, Zendesk, Intercom, and data connectors.",
            },
            {
              name: "Git workflows",
              description:
                "Automate pull request and commit workflows with two-way syncing between Git providers and Linear.",
            },
            {
              name: "Insights & Dashboards",
              description:
                "Realtime analytics, progress reports, and dashboards for tracking scope, velocity, and project health.",
            },
            {
              name: "API & webhooks",
              description:
                "GraphQL API and webhooks for building custom automations and integrations.",
            },
            {
              name: "Mobile and desktop apps",
              description:
                "Native mobile and desktop clients to move product work forward from anywhere.",
            },
            {
              name: "Security & admin controls",
              description:
                "Admin roles, audit logs, domain claiming, app approvals, and third-party app management.",
            },
            {
              name: "Enterprise compliance & privacy",
              description:
                "Compliance support for SOC 2, HIPAA, and GDPR with multi-region hosting options for EU or US.",
            },
            {
              name: "Import & export",
              description:
                "Tools to import from other systems (including Jira) and export workspace data.",
            },
            {
              name: "SLAs & issue routing",
              description:
                "Apply deadlines and SLAs to time-sensitive work and configure triage routing rules.",
            },
            {
              name: "Sub-initiatives & cross-team collaboration",
              description:
                "Break initiatives into sub-initiatives and collaborate across teams with private teams and guests.",
            },
            {
              name: "Linear Sync Engine",
              description:
                "High-performance architecture optimized for speed and scale.",
            },
            {
              name: "Progress insights & reporting",
              description:
                "Built-in project updates and progress reporting to communicate status and health.",
            },
            {
              name: "Automations & custom workflows",
              description:
                "Zapier, email intake, form-based intake, and other automation options to create and update issues programmatically.",
            },
          ],
          other_features: [
            "Import/Export",
            "Audit logs",
            "Passkeys",
            "SAML SSO",
            "SCIM provisioning",
            "IP restrictions",
            "Guest accounts",
            "Sub-teams",
            "File uploads",
          ],
          deployment_options: [
            {
              type: "Cloud (SaaS)",
            },
            {
              type: "Web-Based",
            },
            {
              type: "Desktop and Mobile apps",
            },
          ],
          support_options: [
            {
              type: "Email (hello@linear.app)",
            },
            {
              type: "Documentation (Linear Docs)",
            },
            {
              type: "Help & support (contact support via site)",
            },
            {
              type: "Sales (contact sales / request demo)",
            },
            {
              type: "Community Slack",
            },
          ],
          pricing: {
            overview:
              "Linear offers a free tier for teams getting started and per-user subscription tiers for growing teams. Pricing is presented per user with yearly-billed rates for the Basic and Business plans; an Enterprise offering provides advanced security and onboarding support available via sales. Feature access scales across tiers from core issue and project tracking in the Free plan to advanced security, analytics, integrations, and AI capabilities in Business and Enterprise.",
            pricing_url: "https://linear.app/pricing",
            pricing_plans: [
              {
                plan: "Free",
                entity: "per workspace",
                amount: "0",
                currency: "USD",
                period: "Free",
                description: [
                  "Unlimited members",
                  "2 teams",
                  "250 issues",
                  "Basic Slack and GitHub integrations",
                  "Access to Linear for Agents (AI)",
                  "API & webhook access",
                  "Import and export",
                ],
                is_free: true,
              },
              {
                plan: "Basic",
                entity: "per user",
                amount: "10",
                currency: "USD",
                period: "Per user/month (billed yearly)",
                description: [
                  "All Free features",
                  "5 teams",
                  "Unlimited issues",
                  "Unlimited file uploads",
                  "Admin roles",
                ],
                is_free: false,
              },
              {
                plan: "Business",
                entity: "per user",
                amount: "16",
                currency: "USD",
                period: "Per user/month (billed yearly)",
                description: [
                  "All Basic features",
                  "Unlimited teams",
                  "Private teams and guests",
                  "Triage Intelligence",
                  "Linear Insights",
                  "Linear Asks",
                  "Issue SLAs",
                  "Zendesk and Intercom integrations",
                  "Dashboards",
                  "Linear Asks advanced intake (Slack & Email)",
                ],
                is_free: false,
              },
              {
                plan: "Enterprise",
                entity: "per user (contact sales)",
                amount: null,
                currency: "USD",
                period: "Annual billing only",
                description: [
                  "All Business features",
                  "Sub-initiatives",
                  "Advanced Linear Asks",
                  "Dashboards and Data warehouse sync",
                  "SAML and SCIM",
                  "Advanced security controls",
                  "Migration and onboarding support",
                  "Priority support, account manager, custom terms, uptime SLA",
                ],
                is_free: false,
              },
            ],
          },
          pricing_overview:
            "Linear is positioned with a generous free tier to onboard whole teams and simple per-user pricing for paid tiers. The Basic and Business plans are billed yearly at per-user monthly rates, while Enterprise arrangements are negotiated annually and include enhanced security, compliance, and onboarding services.",
          pricing_details_web_url: "https://linear.app/pricing",
          faq: {
            implementation_process: null,
            implementation_time: null,
            customization:
              "Linear provides APIs, webhooks, and integrations to build custom automations and extend the product; integrations and crafted apps are available in the integrations directory.",
            training:
              "Documentation, developer docs (GraphQL API & TypeScript SDK), and support channels are available. Enterprise customers can request migration and onboarding support.",
            security_measures:
              "HTTPS enforced, TLS 1.2 for in-transit encryption, AES-256 at-rest encryption, admin controls, app approvals, SSO (Google SSO), passkeys, SAML, SCIM, IP restrictions, audit logs, domain claiming, third-party app management, multi-region hosting (EU or US).",
            update_frequency: null,
            data_ownership: null,
            scaling:
              "Built for teams of all sizes from startups to global enterprises; features and admin/security controls scale with Business and Enterprise plans (unlimited teams, sub-initiatives, SCIM provisioning).",
            terms_and_conditions_url: "https://linear.app/terms",
            compliance_standards: ["SOC 2 Type II", "HIPAA", "GDPR"],
            additional_costs: null,
            contract_renewal_terms: null,
          },
          company_info: {
            overview:
              "Linear is a fully remote company building a product development platform focused on speed, craftsmanship and a delightful user experience. The product evolved from an issue tracker into a system for planning, building and measuring product work and is used by thousands of teams globally.",
            founding_story:
              "Frustrated with slower, subpar tools, the founders built Linear to bring 'magic' back to software — beginning as a simple issue tracker and evolving into a full product and project planning system.",
            founder_names: ["Karri Saarinen", "Jori Lallo", "Tuomas Artman"],
            funding_info:
              "Backed by venture firms and a number of notable founders and product builders. The About page highlights individual backers and prominent product leaders among its supporters.",
            acquisitions: null,
            global_presence: [
              "Distributed (Remote) — North America",
              "Distributed (Remote) — Europe",
            ],
            company_culture:
              "Fully remote, small engineering-driven team with an emphasis on craftsmanship, fast execution, and product quality.",
            community:
              "Active Slack community (join via site), GitHub presence, and public changelog and resources.",
          },
          reviews: {
            strengths: [],
            weaknesses: [],
            overall_rating: null,
            review_sources: [],
          },
          reviews_strengths: [],
          reviews_weakness: [],
          ratings: null,
          languages_supported: ["English"],
          ai_capabilities:
            "Linear includes AI-powered agents and workflows (Linear for Agents, Triage Intelligence) and supports integrations with external AI clients such as ChatGPT, Claude, GitHub Copilot, Cursor, and others. AI features include triage suggestions, issue discussion summaries, agent-driven PR/code generation assistants, and automation of routine product operations.",
          ai_questions: null,
          gcc_availability: null,
          gcp_availability: null,
          web3_components: null,
          web3_questions: null,
          logo_url: null,
          videos: ["https://www.youtube.com/@linear"],
          integrations: [
            {
              name: "GitHub",
              website: "https://github.com",
              logo: null,
            },
            {
              name: "Slack",
              website: "https://slack.com",
              logo: null,
            },
            {
              name: "Figma",
              website: "https://www.figma.com",
              logo: null,
            },
            {
              name: "Sentry",
              website: "https://sentry.io",
              logo: null,
            },
            {
              name: "Zendesk",
              website: "https://www.zendesk.com",
              logo: null,
            },
            {
              name: "Intercom",
              website: "https://www.intercom.com",
              logo: null,
            },
            {
              name: "Datadog",
              website: "https://www.datadoghq.com",
              logo: null,
            },
            {
              name: "Cursor",
              website: "https://cursor.com",
              logo: null,
            },
            {
              name: "GitHub Copilot",
              website: "https://github.com/features/copilot",
              logo: null,
            },
            {
              name: "ChatGPT / OpenAI",
              website: "https://openai.com",
              logo: null,
            },
          ],
          meta_keys: {
            description:
              "Linear is a purpose-built tool for planning and building products — streamlining issues, projects, and product roadmaps for modern software teams.",
            title: "Linear – Plan and build products",
            h1: "Linear is a purpose-built tool for planning and building products",
            header: "Plan and build your product",
          },
        },
        error: null,
      };
      // ✅ Save to localStorage as a string
      localStorage.setItem(
        "__onboarding-Vendors-SDN",
        JSON.stringify(mockData)
      );
      setCompanyData(mockData.data);
      setStep(3);
    } catch (error) {
      console.error("Error while scraping:", error);
      setErrors({ general: "Failed to fetch company data" });
    } finally {
      setIsLoading(false);
    }
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

  // 🟣 Welcome Step
  if (step === 0) {
    return (
      <div className="h-screen flex items-center justify-center px-6 py-16">
        <div className="text-center flex flex-col items-center justify-center max-w-3xl mx-auto text-slate-800 space-y-6 opacity-0 translate-y-6 animate-[fadeIn_0.8s_ease-out_0.5s_forwards]">
          <div className="opacity-0 translate-y-6 animate-[fadeIn_0.8s_ease-out_0.5s_forwards]">
            <span className="px-4 py-2 rounded-full text-sm font-medium border text-(--dark-blue) border-[#e6e6e6] tracking-wide">
              Welcome to the Vendor Network
            </span>
          </div>

          <h1 className="mb-2 text-5xl lg:text-6xl font-semibold leading-tight text-(--dark-blue) opacity-0 translate-y-6 animate-[fadeIn_0.8s_ease-out_0.7s_forwards]">
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

          <p className="text-lg lg:text-xl text-[#696871] font-light leading-relaxed opacity-0 translate-y-6 animate-[fadeIn_0.8s_ease-out_0.9s_forwards]">
            Join a community of trusted vendors delivering innovative solutions.
          </p>

          <button
            className="cta btn-blue opacity-0 translate-y-6 animate-[fadeIn_0.8s_ease-out_1.1s_forwards]"
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
        <div className="w-2xl max-w-fit border rounded border-gray-200/5 backdrop-blur-xl bg-white/55 py-12 px-8 sm:px-12 text-center">
          <h2 className="text-3xl flex items-center gap-2 text-left font-bold text-gray-900 mb-2.5 opacity-0 animate-[fadeIn_0.8s_ease-out_0.2s_forwards]">
            <Globe className="w-8 h-8 text-(--dark-sapphire)" />
            Enter Your Domain
          </h2>
          <p className="text-gray-600 text-lg mb-3 text-left opacity-0 animate-[fadeIn_0.8s_ease-out_0.4s_forwards]">
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
  if (isLoading) {
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
                <div
                  key={idx}
                  className="flex items-center justify-center gap-3"
                >
                  <LucideLoader className="w-5 h-5 text-(--dark-blue)/55 animate-spin" />
                  <span className="text-sm text-(--dark-gray)/30">{text}</span>
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
    return <VendorEditor setStep={setStep} />;
  }

  if (step === 4) {
    return <VendorSummary setStep={setStep} />;
  }

  return null;
};

export default Onboarding;
