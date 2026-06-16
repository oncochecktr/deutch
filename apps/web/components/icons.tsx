import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function SvgIcon({
  size = 18,
  className,
  children,
  ...props
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconPanel(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </SvgIcon>
  );
}

export function IconCards(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <rect x="5" y="4" width="14" height="16" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </SvgIcon>
  );
}

export function IconReview(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <path d="M21 3v6h-6" />
    </SvgIcon>
  );
}

export function IconListen(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M4 14v-4a2 2 0 0 1 2-2h2" />
      <path d="M20 14v-4a2 2 0 0 0-2-2h-2" />
      <path d="M8 18a4 4 0 0 0 8 0v-8l-4-3-4 3z" />
    </SvgIcon>
  );
}

export function IconExam(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M8 14h8l1 6H7l1-6z" />
    </SvgIcon>
  );
}

export function IconMesleki(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 12h18" />
    </SvgIcon>
  );
}

export function IconList(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M8 6h13M8 12h13M8 18h13" />
      <circle cx="4" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" />
    </SvgIcon>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </SvgIcon>
  );
}

export function IconArrowLeft(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </SvgIcon>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M20 6 9 17l-5-5" />
    </SvgIcon>
  );
}

export function IconX(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </SvgIcon>
  );
}

export function IconPlay(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M8 5v14l11-7-11-7z" fill="currentColor" stroke="none" />
    </SvgIcon>
  );
}

export function IconVolume(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M11 5 6 9H3v6h3l5 4V5z" />
      <path d="M16 9a4 4 0 0 1 0 6M18 7a7 7 0 0 1 0 10" />
    </SvgIcon>
  );
}

export function IconPause(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none" />
      <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none" />
    </SvgIcon>
  );
}

export function IconBreak(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M8 2v4M16 2v4" />
      <path d="M6 8h12v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8z" />
      <path d="M6 14h12" />
    </SvgIcon>
  );
}

export function IconStar(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path
        d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z"
        fill="currentColor"
        stroke="none"
      />
    </SvgIcon>
  );
}

export const NAV_ICONS = {
  panel: IconPanel,
  cards: IconCards,
  review: IconReview,
  listen: IconListen,
  exam: IconExam,
  mesleki: IconMesleki,
  list: IconList,
} as const;

export type NavIconKey = keyof typeof NAV_ICONS;

export function NavIcon({ name, size = 16, className }: { name: NavIconKey; size?: number; className?: string }) {
  const Icon = NAV_ICONS[name];
  return <Icon size={size} className={className} />;
}
