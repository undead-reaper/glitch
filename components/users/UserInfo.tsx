import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const userInfoVariants = cva("flex items-center gap-1", {
  variants: {
    size: {
      default: "text-sm size-4",
      lg: "text-base size-5 font-medium text-foreground",
      sm: "text-xs size-3.5",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface UserInfoProps extends VariantProps<typeof userInfoVariants> {
  name: string;
  className?: string;
}

export const UserInfo = ({ name, size, className }: UserInfoProps) => {
  return (
    <div className={cn(userInfoVariants({ size, className }))}>
      <Tooltip>
        <TooltipTrigger asChild>
          <p className="line-clamp-1 min-w-max">{name}</p>
        </TooltipTrigger>
        <TooltipContent align="center">{name}</TooltipContent>
      </Tooltip>
    </div>
  );
};
