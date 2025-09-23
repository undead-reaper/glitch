import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const StudioUploadButton = () => {
  return (
    <Button variant="secondary" className="cursor-pointer">
      <Plus />
      Create
    </Button>
  );
};

export default StudioUploadButton;
