export interface Driver {
  userId: string;
  hash: string;
  lat: number;
  lng: number;
  firstName: string;
  lastName: string;
  gender: string;
  accountType: string;
  isActivated: boolean;
  phoneNumber: string;
  isVerified: boolean;
  salt: string;
  loginAttempts: number;
  attemptsDuration: any;
  tillUnlocked: any;
  localPhoneNumber: string;
  isAvailable: boolean;
  isPicker: boolean;
  photo: string;
  driverLicense: string;
  taxiLicesne: string;
  driverLicensePhoto: string;
  id: string;
}
