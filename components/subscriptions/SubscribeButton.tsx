import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type Props = Readonly<{
  onClick: ComponentProps<typeof Button>["onClick"];
  disabled?: boolean;
  isSubscribed: boolean;
  className?: string;
  size?: ComponentProps<typeof Button>["size"];
}>;

const SubscribeButton = ({
  disabled,
  isSubscribed,
  onClick,
  className,
  size,
}: Props) => {
  return (
    <Button
      size={size}
      variant={isSubscribed ? "default" : "secondary"}
      className={cn("rounded-full", className)}
      onClick={onClick}
      disabled={disabled}
    >
      {isSubscribed ? "Subscribed" : "Subscribe"}
    </Button>
  );
};

export default SubscribeButton;
