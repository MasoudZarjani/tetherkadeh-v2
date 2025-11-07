export interface IdentifiedInfo {
  shebaNumber: string
  accountNumber: string
  accountName: string
}
export interface ThemeColors {
  light: {
    primary: string
    secondary: string
    bg: string
    text: string
  }
  dark: {
    primary: string
    secondary: string
    bg: string
    text: string
  }
}
export interface Setting {
  siteName: string
  mobile: string
  phone: string
  address: string
  email: string
  logoText: string
  logoMobile: string
  logoDark: string
  faviconDark: string
  favicon: string
  logoTextDark: string
  logoMobileDark: string
  version: string
  frontendUrl: string
  backendUrl: string
  activeKyc: string
  defaultLanguage: string
  horizontalMenu: boolean
  activeGateway: boolean
  trustWithPhoto: boolean
  trustWithVideo: boolean
  activeProduct: boolean
  crispApiKey: string
  goftinoKey: string
  recaptchaSiteKey: string
  languages: any
  lang: string
  activeFutures: boolean
  commissionValueFuture: string
  lifeTimeFuture: string
  periodCommissionTimeFuture: string
  liquidatyPercentageFuture: string
  warningPercentageFuture: string
  valueHoursAvailable: string
  depositApproved: string
  depositTrusted: string
  telegram: string
  instagram: string
  twitter: string
  facebook: string
  youtube: string
  linkedin: string
  whatsapp: string
  map: string
  kycIntro: boolean
  kycText: string
  kycWithPhoto: boolean
  kycWithVideo: boolean
  identifiedInfo: IdentifiedInfo[]
  theme?: {
    colors: ThemeColors
  }
  [key: string]: any
}
