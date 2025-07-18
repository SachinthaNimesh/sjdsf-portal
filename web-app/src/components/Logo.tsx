import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <img src="/SJSF-LOGO.webp" alt="SJSF Logo" className="h-12 w-auto" />
    </div>
  );
};

export default Logo;
