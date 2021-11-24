//application url API

export const appUrl: string = 'https://campus-shoping.herokuapp.com';
//export const appUrl: string = 'http://192.168.43.13:8070';
export enum firebasePaths {
  PARCEL_HISTORIES = 'Parcel-histories',
  ACTIVE_DELIVERIES = 'Active-Deliveries',
  DRIVERS = 'drivers',
  USERS = 'Users',
}

/* eslint-disable */
export enum ParcelStatus {
  NOT_PICKED = 0,
  IN_PROGRESS = 1,
  PICKUP_DELIVERED = 2,
  DELIVERY_CONFIRMED = 3,
  PARCEL_REJECTED = 4,
  MAX_PARCEL_MODE_STATUS = 4,
}
