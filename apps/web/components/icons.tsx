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

export function IconSpeak(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </SvgIcon>
  );
}

export function IconKonusDinle(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M8 18a4 4 0 0 0 8 0v-8l-4-3-4 3z" />
      <path d="M12 2a3 3 0 0 0-3 3v4a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v1a7 7 0 0 1-2.5 5.3" />
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

export function IconFlame(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M12 22c-4-2-6-5-6-9 0-3 2-5 4-7 1 2 2 3 2 5 0-1 1-3 2-4 1 2 2 4 2 6 0 4-2 7-4 9z" />
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

export function IconMail(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 7 10-7" />
    </SvgIcon>
  );
}

export function IconLinkedIn(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size ?? 18}
      height={props.size ?? 18}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={props.className}
      aria-hidden
      {...props}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function IconWhatsApp(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size ?? 18}
      height={props.size ?? 18}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={props.className}
      aria-hidden
      {...props}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

export const NAV_ICONS = {
  panel: IconPanel,
  cards: IconCards,
  review: IconReview,
  listen: IconListen,
  konusDinle: IconKonusDinle,
  speak: IconSpeak,
  exam: IconExam,
  mesleki: IconMesleki,
  list: IconList,
} as const;

export type NavIconKey = keyof typeof NAV_ICONS;

export function NavIcon({ name, size = 16, className }: { name: NavIconKey; size?: number; className?: string }) {
  const Icon = NAV_ICONS[name];
  return <Icon size={size} className={className} />;
}
