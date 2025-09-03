import { useState, useCallback } from 'react';

interface FormData {
  [key: string]: string;
}

interface ValidationRules {
  [key: string]: {
    required?: boolean;
    email?: boolean;
    minLength?: number;
    maxLength?: number;
  };
}

interface ValidationErrors {
  [key: string]: string;
}

export const useFormValidation = (
  initialData: FormData,
  rules: ValidationRules
) => {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isValid, setIsValid] = useState(false);

  const validateField = useCallback(
    (name: string, value: string): string => {
      const fieldRules = rules[name];
      if (!fieldRules) return '';

      if (fieldRules.required && !value.trim()) {
        return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
      }

      if (fieldRules.email && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address';
        }
      }

      if (fieldRules.minLength && value.length < fieldRules.minLength) {
        return `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least ${fieldRules.minLength} characters`;
      }

      if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
        return `${name.charAt(0).toUpperCase() + name.slice(1)} must be less than ${fieldRules.maxLength} characters`;
      }

      return '';
    },
    [rules]
  );

  const validateForm = useCallback(() => {
    const newErrors: ValidationErrors = {};
    let formIsValid = true;

    Object.keys(rules).forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName] || '');
      if (error) {
        newErrors[fieldName] = error;
        formIsValid = false;
      }
    });

    setErrors(newErrors);
    setIsValid(formIsValid);
    return formIsValid;
  }, [formData, validateField, rules]);

  const updateField = useCallback(
    (name: string, value: string) => {
      setFormData(prev => ({ ...prev, [name]: value }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    },
    [errors]
  );

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setIsValid(false);
  }, [initialData]);

  return {
    formData,
    errors,
    isValid,
    updateField,
    validateForm,
    resetForm,
  };
};
