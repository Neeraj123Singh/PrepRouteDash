import styles from './PreprouteLogo.module.css';

interface PreprouteLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/** PrepRoute wordmark region on 710×988 Figma artboard */
const WORDMARK_VIEWBOX = '100 248 136 38';

export function PreprouteLogo({ size = 'md', className = '' }: PreprouteLogoProps) {
  return (
    <svg
      className={`${styles.svg} ${styles[size]} ${className}`}
      viewBox={WORDMARK_VIEWBOX}
      role="img"
      aria-label="Preproute"
    >
      <image
        href="/preproute-logo-full.svg"
        width={710}
        height={988}
        preserveAspectRatio="xMinYMin meet"
      />
    </svg>
  );
}
