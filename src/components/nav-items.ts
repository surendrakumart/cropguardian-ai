import {
  CalendarCheck,
  CloudSun,
  History,
  Home,
  Info,
  Leaf,
  ScanLine,
  SprayCan,
} from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: typeof Home;
}

export const primaryNav: NavItem[] = [
  { to: "/", label: "Home", icon: Home },
  { to: "/diagnose", label: "Diagnose", icon: ScanLine },
  { to: "/climate", label: "Climate", icon: CloudSun },
  { to: "/history", label: "History", icon: History },
];

export const secondaryNav: NavItem[] = [
  { to: "/spray", label: "Spray Radar", icon: SprayCan },
  { to: "/treatments", label: "Treatments", icon: CalendarCheck },
  { to: "/library", label: "Disease Library", icon: Leaf },
  { to: "/about", label: "About", icon: Info },
];
