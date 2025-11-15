import React from 'react';
import { Box, Check, ExternalLink, Shield, Sparkles, Zap } from 'lucide-react';

// Base card component
export const Card = ({ children, className = "", highlight = false }) => (
  <div 
    className={`
      bg-white rounded-2xl p-3 border border-[#E8EBEB]
      ${highlight ? 'bg-linear-to-br from-[#BE7AEF]/10 via-[#51B8E6]/10 to-transparent' : ''}
      ${className}
    `}
  >
    {children}
  </div>
);

// Section header with optional icon
export const SectionHeader = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-3 mb-4">
    {/* {Icon && (
      <div className="w-10 h-10 bg-[#51B8E6]/10 rounded-lg flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-[#51B8E6]" />
      </div>
    )} */}
    <h2 className="text-[20px] font-semibold text-(--dark-blue)">{title}</h2>
  </div>
);

// Tag component
export const Tag = ({ text, color = "default" }) => {
  const colors = {
    default: "from-[#BE7AEF]/10 to-[#51B8E6]/10 border-[#BE7AEF]/20 text-[#1920BA]",
    blue: "from-[#1920BA]/10 to-[#051d53]/10 border-[#1920BA]/20 text-[#1920BA]",
    green: "from-[#38c016]/10 to-[#38c016]/5 border-[#38c016] text-[#38c016]"
  };

  return (
    <span className={`
      px-4 py-2 bg-linear-to-r ${colors[color]}
      rounded-full text-sm font-semibold border
    `}>
      {text}
    </span>
  );
};

// Feature card component
export const FeatureCard = ({ title, description }) => (
  <div className="group p-5 border-l-4 border-[#51B8E6] hover:border-[#BE7AEF] bg-[#FFFAFB] hover:bg-linear-to-r hover:from-[#51B8E6]/5 hover:to-transparent rounded-lg transition-all">
    <h4 className="font-bold text-[#051d53] mb-2 group-hover:text-[#1920BA] transition-colors">
      {title}
    </h4>
    <p className="text-[#3f3f3f] text-sm leading-relaxed">
      {description}
    </p>
  </div>
);

// Price card component
export const PriceCard = ({ plan, amount, period, description, entity, isFree }) => (
  <div className={`
    relative rounded-2xl p-6 transition-all hover:scale-105
    ${isFree 
      ? "bg-linear-to-br from-[#38c016]/10 to-[#38c016]/5 border-2 border-[#38c016]"
      : "bg-white border-2 border-[#E8EBEB] hover:border-[#51B8E6]"
    }
  `}>
    {isFree && (
      <div className="absolute -top-3 right-4 bg-[#38c016] text-white px-3 py-1 rounded-full text-xs font-bold">
        FREE
      </div>
    )}
    <h3 className="text-xl font-bold text-[#051d53] mb-4">{plan}</h3>
    <div className="mb-4">
      {amount ? (
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-[#1920BA]">
            ${amount}
          </span>
          <span className="text-[#3f3f3f] text-sm">
            /{entity || 'user'}
          </span>
        </div>
      ) : (
        <span className="text-lg font-semibold text-[#3f3f3f]">
          Contact Sales
        </span>
      )}
    </div>
    {period && (
      <p className="text-xs text-[#3f3f3f] mb-5 pb-5 border-b border-[#E8EBEB]">
        {period}
      </p>
    )}
    {Array.isArray(description) && (
      <ul className="space-y-3">
        {description.map((item, i) => (
          <li key={i} className="text-sm text-[#3f3f3f] flex items-start gap-2">
            <Check className="w-4 h-4 text-[#38c016] shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

// Link card component
export const LinkCard = ({ text, url }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="group px-5 py-3 bg-[#FFFAFB] hover:bg-linear-to-r hover:from-[#BE7AEF]/10 hover:to-[#51B8E6]/10 text-[#051d53] rounded-xl transition-all font-medium border-2 border-[#E8EBEB] hover:border-[#51B8E6]"
  >
    <span className="group-hover:text-[#1920BA]">
      {text}
    </span>
    <ExternalLink className="inline-block w-4 h-4 ml-2 opacity-50 group-hover:opacity-100" />
  </a>
);

// Quick stat component
export const QuickStat = ({ icon: Icon, label, value, isEmail }) => (
  <div className="flex items-start gap-3">
    {/* <div className="w-10 h-10 bg-[#51B8E6]/10 rounded-lg flex items-center justify-center shrink-0">
      <Icon className="w-5 h-5 text-[#51B8E6]" />
    </div> */}
    <div>
      <p className="text-xs text-[#3f3f3f] uppercase tracking-wide font-semibold mb-1">
        {label}
      </p>
      {isEmail ? (
        <a
          href={`mailto:${value}`}
          className="text-[#51B8E6] hover:text-[#1920BA] font-semibold transition-colors"
        >
          {value}
        </a>
      ) : (
        <p className="text-[#051d53] font-semibold">{value}</p>
      )}
    </div>
  </div>
);

// Section renderer based on layout type
export const renderSectionContent = (content, layout) => {
  if (!content) return null;

  switch (layout) {
    case 'grid':
      return (
        <div className="grid md:grid-cols-2 gap-4">
          {content.map((item, i) => (
            <FeatureCard
              key={i}
              title={item.name || item.title}
              description={item.description}
            />
          ))}
        </div>
      );

    case 'pricing-grid':
      return (
        <>
          {content.overview && (
            <p className="text-[#3f3f3f] mb-8 leading-relaxed">
              {content.overview}
            </p>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {content.pricing_plans?.map((plan, i) => (
              <PriceCard key={i} {...plan} />
            ))}
          </div>
        </>
      );

    case 'link-grid':
      return (
        <div className="flex flex-wrap gap-3">
          {content.map((item, i) => (
            <LinkCard
              key={i}
              text={item.name || item.platform}
              url={item.url || item.website}
            />
          ))}
        </div>
      );

    case 'tags':
      return (
        <div className="flex flex-wrap gap-2">
          {(Array.isArray(content) ? content : [content]).map((item, i) => (
            <Tag key={i} text={item} />
          ))}
        </div>
      );

    case 'highlight':
      return (
        <div className="bg-linear-to-r from-[#51B8E6]/5 to-[#BE7AEF]/5 border-l-4 border-[#51B8E6] p-6 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-[#BE7AEF]" />
            <h3 className="font-bold text-[#1920BA] text-lg">
              {content.title || formatTitle(content.key)}
            </h3>
          </div>
          <p className="text-[#3f3f3f] leading-relaxed">
            {typeof content === 'string' ? content : content.description}
          </p>
        </div>
      );

    default:
      return (
        <p className="text-[#3f3f3f] leading-relaxed">
          {typeof content === 'string' ? content : JSON.stringify(content)}
        </p>
      );
  }
};