import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 20"
      aria-label="MyGene Logo"
      role="img"
      {...props}
    >
      <text
        x="0"
        y="15"
        fontFamily="'PT Sans', sans-serif"
        fontSize="18"
        fontWeight="bold"
        fill="currentColor"
      >
        MyGene
      </text>
    </svg>
  );
}
