export interface User {
  _id: string
  email: string
  mobile: string
  birthday: string
  imagePath: string
  isActive: boolean
  isEmailVerified: boolean
  isMobileVerified: boolean
  nationalCode: string
  status: UserStatus
  stepAuth: UserTypeAuth
  stepRequest: UserRequestAuth
  uid: string
  firstName: string
  lastName: string
  docs: any
}

export enum UserStatus {
  Register = 'Register',
  Pending = 'Pending',
  Approved = 'Approved',
  Trusted = 'Trusted',
  Rejected = 'Rejected',
  Blocked = 'Blocked',
  Deleted = 'Deleted',
}

export enum UserTypeAuth {
  None = 'None',
  Step1 = 'Step1',
  Step2 = 'Step2',
}

export enum UserRequestAuth {
  None = 'None',
  Step1 = 'Step1',
  Step2 = 'Step2',
  PendingStep1 = 'PendingStep1',
  PendingStep2 = 'PendingStep2',
  RejectStep1 = 'RejectStep1',
  RejectStep2 = 'RejectStep2',
}
