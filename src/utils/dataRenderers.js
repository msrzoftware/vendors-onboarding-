// Helper functions for data handling
export const isValidData = (value) => value !== null && value !== undefined && value !== '';

export const isValidArray = (arr) => Array.isArray(arr) && arr.length > 0;

export const isValidObject = (obj) => 
  obj && typeof obj === 'object' && !Array.isArray(obj) && Object.keys(obj).length > 0;

export const formatTitle = (key) => {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Define the priority order for sections
export const SECTION_PRIORITY = [
  'product_name',
  'description',
  'market_size',
  'hq_location',
  'contact',
  'overview',
  'elevator_pitch',
  'features',
  'pricing',
  'ai_capabilities',
  'industry',
  'competitive_advantage',
  'usp',
  'integrations',
  'faq',
  'company_info'
];

// Configuration for section layouts
export const SECTION_LAYOUTS = {
  // Full width sections with special formatting
  overview: 'full',
  elevator_pitch: 'highlight',
  ai_capabilities: 'highlight',
  description: 'full',
  product_description_short: 'full',
  
  // Grid sections
  features: 'grid',
  pricing: 'pricing-grid',
  integrations: 'link-grid',
  industry: 'tags',
  
  // Two column sections
  competitive_edge: 'two-column',
  company_info: 'two-column',
  
  // Default to full width
  default: 'full'
};

// Filter function to determine which fields to show in each section
export const filterSectionData = (data, section) => {
  const commonExclusions = ['id', '_id', 'created_at', 'updated_at', 'success', 'error',"meta_keys"];
  
  if (commonExclusions.includes(section)) return null;
  
  // Handle nested objects differently
  if (isValidObject(data)) {
    const filteredData = {};
    Object.entries(data).forEach(([key, value]) => {
      if (!commonExclusions.includes(key) && isValidData(value)) {
        filteredData[key] = value;
      }
    });
    return Object.keys(filteredData).length > 0 ? filteredData : null;
  }
  
  return isValidData(data) ? data : null;
};

// Determine if a section should be rendered
export const shouldRenderSection = (key, value) => {
  // Skip technical/meta fields
  if (key.startsWith('_') || key === 'success' || key === 'error') return false;
  
  // Handle different data types
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
  return value !== null && value !== undefined && value !== '';
};

// Sort sections based on priority
export const sortSections = (sections) => {
  return sections.sort((a, b) => {
    const indexA = SECTION_PRIORITY.indexOf(a);
    const indexB = SECTION_PRIORITY.indexOf(b);
    
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    
    return indexA - indexB;
  });
};