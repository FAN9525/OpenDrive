// Constants for the OpenDrive application

export const CONDITION_OPTIONS = [
  { value: 'GO', label: 'Good' },
  { value: 'VG', label: 'Very Good' },
  { value: 'EX', label: 'Excellent' },
  { value: 'PO', label: 'Poor' },
  { value: 'VP', label: 'Very Poor' }
] as const

export const MILEAGE_OPTIONS = [
  { value: 'AV', label: 'Average' },
  { value: 'LO', label: 'Low' },
  { value: 'VL', label: 'Very Low' },
  { value: 'HI', label: 'High' },
  { value: 'VH', label: 'Very High' }
] as const

export const EVALUE8_ENDPOINTS = {
  MAKES: 'getmakes.php',
  MODELS: 'getmodels.php',
  YEARS: 'getyears.php',
  ACCESSORIES: 'getextras.php',
  VALUATION: 'getvalues.php'
} as const

export const CACHE_DURATION = {
  MAKES: 24 * 60 * 60 * 1000, // 24 hours
  MODELS: 24 * 60 * 60 * 1000, // 24 hours
  YEARS: 6 * 60 * 60 * 1000, // 6 hours
  ACCESSORIES: 6 * 60 * 60 * 1000 // 6 hours
} as const

export const BRAND_COLORS = {
  primary: '#2c3e50',
  secondary: '#34495e',
  accent: '#95a5a6',
  light: '#bdc3c7',
  white: '#ffffff'
} as const



