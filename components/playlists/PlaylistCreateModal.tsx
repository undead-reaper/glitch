import ResponsiveModal from "@/components/ResponsiveModal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/services/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, Link, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  visibility: z.enum(["private", "public", "unlisted"]),
});

const PlaylistCreateModal = ({ onOpenChange, open }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      visibility: "private",
    },
  });
  const utils = trpc.useUtils();

  const create = trpc.playlists.create.useMutation({
    onSuccess: () => {
      toast.success("Playlist Created Successfully", {
        description: "You can now add content to your playlist",
      });
      form.reset();
      onOpenChange(false);
      utils.playlists.getUserPlaylists.invalidate();
    },
    onError: (error) => {
      toast.error("Failed to create playlist", {
        description: error.message,
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    create.mutate(values);
  };

  return (
    <ResponsiveModal
      title="New Playlist"
      open={open}
      onOpenChange={onOpenChange}
    >
      <Form {...form}>
        <form
          className="flex flex-col gap-4 px-5 md:px-0"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Choose a name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="visibility"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visibility</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        <Globe className="inline mr-2" />
                        <span>Public</span>
                      </SelectItem>
                      <SelectItem value="unlisted">
                        <Link className="inline mr-2" />
                        <span>Unlisted</span>
                      </SelectItem>
                      <SelectItem value="private">
                        <Lock className="inline mr-2" />
                        <span>Private</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              disabled={create.isPending || !form.formState.isDirty}
              type="submit"
              className="cursor-pointer"
            >
              Create
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
};

export default PlaylistCreateModal;
