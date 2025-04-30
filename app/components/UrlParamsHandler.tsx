'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { FormData } from '../types';
import { decodeUrlParams } from '../utils/urlEncoder';
import { presets } from '../data/presets';
import { calculateResults } from '../utils/calculations';

interface UrlParamsHandlerProps {
  formData: FormData;
  onFormDataUpdate: (data: FormData) => void;
  onResultsUpdate: (results: any) => void;
  onPresetSelect: (presetId: string) => void;
}

export default function UrlParamsHandler({ 
  formData, 
  onFormDataUpdate, 
  onResultsUpdate,
  onPresetSelect
}: UrlParamsHandlerProps) {
  const searchParams = useSearchParams();
  const initialLoadDone = useRef(false);
  
  useEffect(() => {
    // Skip if we've already loaded from URL
    if (initialLoadDone.current) return;
    
    const handleInitialUrlParams = () => {
      const paramsExist = Array.from(searchParams.keys()).length > 0;
      if (paramsExist) {
        const initialFormData = { ...formData };
        let paramUpdated = false;
        
        // Use the URL decoder to get form data and preset ID
        const { formData: decodedFormData, presetId } = decodeUrlParams(searchParams);
        
        // Apply preset first if specified
        if (presetId) {
          const selectedPreset = presets.find(preset => preset.id === presetId);
          if (selectedPreset) {
            Object.assign(initialFormData, selectedPreset.data);
            onPresetSelect(presetId);
            paramUpdated = true;
          }
        }
        
        // Apply decoded form data
        if (Object.keys(decodedFormData).length > 0) {
          Object.assign(initialFormData, decodedFormData);
          paramUpdated = true;
        }
        
        // If params were found, update form data and calculate results
        if (paramUpdated) {
          // Mark that we've loaded from URL
          initialLoadDone.current = true;
          
          // Update form data
          onFormDataUpdate(initialFormData);
          
          // Calculate results directly
          const calculatedResults = calculateResults(initialFormData);
          onResultsUpdate(calculatedResults);
        }
      }
    };
    
    // Set a small timeout to ensure the component is fully mounted
    const timeoutId = setTimeout(() => {
      handleInitialUrlParams();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [searchParams, formData, onFormDataUpdate, onResultsUpdate, onPresetSelect]);
  
  // This component doesn't render anything
  return null;
} 