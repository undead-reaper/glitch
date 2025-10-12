import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import BannerUploadModal from "@/components/users/BannerUploadModal";
import { cn } from "@/lib/utils";
import { UserGetOneOutput } from "@/types/dashboard";
import { useAuth } from "@clerk/nextjs";
import { Edit2 } from "lucide-react";
import { useState } from "react";

type Props = Readonly<{
  user: UserGetOneOutput;
}>;

export const UserBannerSkeleton = () => {
  return (
    <Skeleton className="w-full max-h-[12.5rem] h-[15vh] md:h-[25vh] bg-muted" />
  );
};

const UserBanner = ({ user }: Props) => {
  const { userId } = useAuth();
  const [isBannerUploadModalOpen, setIsBannerUploadModalOpen] = useState(false);

  return (
    <div className="relative group">
      <BannerUploadModal
        userId={user.id}
        open={isBannerUploadModalOpen}
        onOpenChange={setIsBannerUploadModalOpen}
      />
      <div
        className={cn(
          "w-full max-h-[12.5rem] h-[15vh] md:h-[25vh] bg-gradient-to-r from-primary to-secondary rounded-xl",
          user.bannerUrl && "bg-cover bg-center"
        )}
        style={{
          backgroundImage: user.bannerUrl
            ? `url(${user.bannerUrl})`
            : undefined,
        }}
      >
        {user.clerkId === userId && (
          <Button
            onClick={() => setIsBannerUploadModalOpen(true)}
            size="icon"
            className="cursor-pointer absolute transition-opacity duration-200 top-4 right-4 rounded-full bg-background hover:bg-background opacity-100 md:opacity-0 group-hover:opacity-100"
            type="button"
          >
            <Edit2 className="size-4 text-foreground" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserBanner;
