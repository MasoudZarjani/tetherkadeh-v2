export interface NavigationLink {
  name: string
  link: string
  target?: string // Optional: for external links like 'blog'
  title?: string // Optional: for accessibility and SEO
}

export const headerNavigationLinks: NavigationLink[] = [
  {
    name: 'بلاگ', // Blog
    link: '/blog',
    title: 'blog',
  },
  {
    name: 'کارمزد', // Wages
    link: '/wages',
    title: 'wages',
  },
  {
    name: 'معرفی به دوستان', // Referral
    link: '/referral',
    title: 'referral',
  },
  {
    name: 'ارتباط با ما', // Contact us
    link: '/contact-us',
    title: 'contactUs',
  },
]
