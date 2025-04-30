import { FormData } from '../types';

// Parameter keys mapping to shorten URL
const paramMap: Record<string, string> = {
  'home_price': 'hp',
  'down_payment_percent': 'dp',
  'mortgage_rate': 'mr',
  'mortgage_term_years': 'mt',
  'property_tax_rate': 'ptr',
  'home_insurance': 'hi',
  'maintenance_percent': 'mp',
  'home_appreciation_rate': 'har',
  'rent_amount': 'ra',
  'rent_increase_rate': 'rir',
  'investment_return_rate': 'irr',
  'analysis_period_years': 'apy',
  'agent_fee_percent': 'afp',
  'preset': 'p'
};

// The reverse mapping
const reverseParamMap: Record<string, string> = 
  Object.entries(paramMap).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {} as Record<string, string>);

/**
 * Encode form data into a shortened URL query string
 */
export function encodeFormData(data: FormData, presetId?: string): string {
  const params = new URLSearchParams();
  
  // Add preset ID if available with shortened key
  if (presetId) {
    params.set(paramMap['preset'], presetId);
  }
  
  // Add each form field with shortened keys
  Object.entries(data).forEach(([key, value]) => {
    if (value !== '') {
      // Use shortened parameter names
      const shortKey = paramMap[key] || key;
      params.set(shortKey, value.toString());
    }
  });
  
  return params.toString();
}

/**
 * Decode shortened URL parameters into form data
 */
export function decodeUrlParams(searchParams: { get: (key: string) => string | null, entries: () => IterableIterator<[string, string]> }): {
  formData: Partial<FormData>;
  presetId: string | null;
} {
  const formData: Partial<FormData> = {};
  let presetId: string | null = null;
  
  // Process all parameters
  for (const [shortKey, value] of searchParams.entries()) {
    // Get the original key name
    const fullKey = reverseParamMap[shortKey];
    
    if (!fullKey) continue;
    
    if (fullKey === 'preset') {
      presetId = value;
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        formData[fullKey as keyof FormData] = numValue;
      }
    }
  }
  
  return { formData, presetId };
} 