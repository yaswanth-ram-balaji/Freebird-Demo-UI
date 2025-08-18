
import { SVGProps } from 'react';

export function DroneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 18.5A2.5 2.5 0 0 1 9.5 21a2.5 2.5 0 0 1-2.5-2.5A2.5 2.5 0 0 1 7 16a2.5 2.5 0 0 1 2.5-2.5" />
      <path d="M12 18.5A2.5 2.5 0 0 0 14.5 21a2.5 2.5 0 0 0 2.5-2.5A2.5 2.5 0 0 0 17 16a2.5 2.5 0 0 0-2.5-2.5" />
      <path d="M12 13.5V6l2-1 2 1" />
      <path d="M12 6l-2-1-2 1" />
      <path d="m7 16-4-1 1-3" />
      <path d="m17 16 4-1-1-3" />
      <path d="M12 13.5a2.5 2.5 0 0 1-2.5-2.5A2.5 2.5 0 0 1 12 8.5a2.5 2.5 0 0 1 2.5 2.5" />
      <path d="M7 13.5H2.5" />
      <path d="M17 13.5H21.5" />
    </svg>
  );
}
