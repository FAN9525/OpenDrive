// Vehicle data types for OpenDrive system
export interface Vehicle {
  mmMakeShortCode: string;
  mvModel: string;
  mmYear: number;
  mmCode: string;
}

export interface VehicleMake {
  mmMakeShortCode: string;
  mmMakeLongName?: string;
}

export interface VehicleModel {
  mvCode: string;
  mvModel: string;
  mmMakeShortCode: string;
}

export interface VehicleYear {
  mmYear: number;
}

export interface Accessory {
  OptionCode: string;
  Description: string;
  Retail: string;
  Trade: string;
}

export interface ValuationData {
  mmMakeShortCode: string;
  mvModel: string;
  mmYear: number;
  mmCode: string;
  mmNew: string;
  mmRetail: string;
  mmTrade: string;
  mmGuide: string;
  mmEstimator?: string;
}

export interface ValuationRequest {
  mmCode: string;
  mmYear: number;
  condition: string;
  mileage: string;
  accessories?: string[];
}

export interface ApiConfiguration {
  appName: string;
  username: string;
  password: string;
  clientRef: string;
  computerName: string;
  environment: 'live' | 'sandbox';
  configured: boolean;
}
