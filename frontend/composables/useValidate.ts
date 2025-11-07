function validateMobile(value: string): string | null {
  if (!value || value.length === 0) {
    return 'validation.mobile.required'
  }

  if (value.length !== 11) {
    return 'validation.mobile.invalidLength'
  }

  const mobileRegex = /^09[0-3|9]\d{8}$/
  if (!mobileRegex.test(value)) {
    return 'validation.mobile.invalidFormat'
  }
  return null  
}

function validateEmail(value: string): string | null {
  if (!value || value.length === 0) {
    return 'validation.email.required'
  }
  const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegExp.test(value)) {
    return 'validation.email.invalidFormat'
  }
  return null
}

function validatePassword(value: string): string | null {
  if (!value || value.length === 0) {
    return 'validation.password.required'
  }
  const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&_])[A-Za-z\d@$!%#*?&_]{8,}$/
  if (!passwordRegExp.test(value)) {
    // This single key covers length and complexity requirements as per the new i18n key
    return 'validation.password.invalidFormat'
  }
  return null
}

function validateCode(value: string): string | null {
  if (!value || value.toString().length === 0) {
    return 'validation.code.required'
  }
  // Assuming 'value' for code is expected to be a string of digits
  if (value.toString().length !== 6) {
    // Using a single message for both min and max length error as they are the same (must be 6 digits)
    return 'validation.code.minLengthError' // Or 'validation.code.exactLengthError' if we add a new key
  }
  return null
}

function validateAmount(value: string): string | null {
  if (!value || value.toString().length === 0) {
    return 'validation.amount.required'
  }
  // Add any other specific amount validation if needed
  return null
}

function validatePrice(value: string): string | null {
  if (!value || value.toString().length === 0) {
    return 'validation.price.required'
  }
  // Add any other specific price validation if needed
  return null
}

function validateWithdrawAmount(value: string, data: any): string | null {
  if (!value || value.toString().length === 0) {
    return 'validation.withdraw.required'
  }
  // Convert value to number for comparison, assuming data.availableAmount and data.min are numbers
  const numericValue = parseFloat(value)
  if (isNaN(numericValue)) {
    // Or a more specific error key like 'validation.withdraw.invalidNumber'
    return 'validation.withdraw.required' // Or handle as an invalid format
  }

  if (data && data.availableAmount !== undefined && numericValue > data.availableAmount) {
    return 'validation.withdraw.notEnoughBalance'
  }
  if (data && data.min !== undefined && numericValue < data.min) {
    return 'validation.withdraw.minAmount' // Dynamic parts (min, symbol) handled by i18n in component
  }
  return null
}

function validateUser(value: string): string | null {
  const trimmedValue = value.trim()
  
  // بررسی خالی بودن
  if (trimmedValue.length === 0) {
    return 'validation.required'
  }
  
  // بررسی شماره موبایل ایرانی
  if (/^\d+$/.test(trimmedValue)) {
    return validateMobile(trimmedValue)
  }
  
  // بررسی ایمیل
  return validateEmail(trimmedValue)
}

export function useValidate(value: any, type: string, data: any = null) {
  switch (type) {
    case 'mobile':
      return validateMobile(value)
    case 'email':
      return validateEmail(value)
    case 'user':
      return validateUser(value)
    case 'password':
      return validatePassword(value)
    case 'code':
      // Ensure value is treated as a string for validateCode
      return validateCode(String(value))
    case 'amount':
      return validateAmount(String(value))
    case 'price':
      return validatePrice(String(value))
    case 'withdrawAmount':
      return validateWithdrawAmount(String(value), data)
    default:
      return null
  }
}
