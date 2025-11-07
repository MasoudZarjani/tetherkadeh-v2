import { UserRequestAuth } from '../enums/UserRequestAuth.enum';
import { UserTypeAuth } from '../enums/UserTypeAuth.enum';

export interface UserType {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  token: number;
  isMobileVerified: boolean;
  isEmailVerified: boolean;
  lastActiveAt: Date;
  imagePath: string;
  isActive: boolean;
  invitationCode: string;
  invitedBy: string;
  nationalCode: string;
  reason: string;
  birthday: Date;
  address: string;
  postalCode: string;
  phone: string;
  twoStepVerification: boolean;
  twoFactorVerification: boolean;
  token2FV: string;
  uid: string;
  docs: [];
  notes: string[];
  status: string;
  stepRequest: UserRequestAuth;
  stepAuth: UserTypeAuth;
  sendMailAt: Date;
  withdrawalTimeLimit: string;
}
