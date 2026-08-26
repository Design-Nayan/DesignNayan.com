export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
}

export const mainNav: NavItem[] = [
  {
    title: "HOME",
    href: "/",
  },
  {
    title: "STUDIO",
    href: "/studio",
  },
  {
    title: "BUILD",
    href: "/build",
  },
  {
    title: "STAY",
    href: "/stay",
  },
  {
    title: "PORTFOLIO",
    href: "/portfolio",
  },
  {
    title: "ABOUT",
    href: "/about",
  },
  {
    title: "CONTACT",
    href: "/contact",
  },
];

export const footerNav = [
  { title: "STUDIO", href: "/studio" },
  { title: "BUILD", href: "/build" },
  { title: "STAY", href: "/stay" },
  { title: "PORTFOLIO", href: "/portfolio" },
  { title: "ABOUT", href: "/about" },
  { title: "CONTACT", href: "/contact" },
];
