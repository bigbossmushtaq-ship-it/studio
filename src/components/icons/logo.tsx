import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={cn("text-primary", className)}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M25 40C25 31.7157 31.7157 25 40 25H60C68.2843 25 75 31.7157 75 40V60C75 68.2843 68.2843 75 60 75H40C31.7157 75 25 68.2843 25 60V40Z"
      stroke="currentColor"
      strokeWidth="10"
    />
    <circle cx="50" cy="50" r="10" fill="currentColor" />
  </svg>
);
