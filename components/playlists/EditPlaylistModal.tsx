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
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/services/trpc/client";
import { Globe, Link, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type Props = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playlistId: string;
}>;

const EditPlaylistModal = ({ onOpenChange, open, playlistId }: Props) => {
  const [data] = trpc.playlists.getOne.useSuspenseQuery({
    playlistId,
  });

  const utils = trpc.useUtils();

  const update = trpc.playlists.update.useMutation({
    onSuccess: () => {
      toast.success("Playlist updated successfully", {
        description: "Your playlist has been updated.",
      });
      utils.playlists.getOne.invalidate({ playlistId });
      utils.playlists.getUserPlaylists.invalidate();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Could not update playlist", {
        description: error.message,
      });
    },
  });

  const schema = z.object({
    name: z.string(),
    description: z.string().nullable(),
    visibility: z.enum(["private", "public", "unlisted"]),
  });

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: schema.parse(data),
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    update.mutate({
      playlistId: playlistId,
      name: values.name,
      description: values.description,
      visibility: values.visibility,
    });
  };

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Playlist"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 px-5 md:px-0"
        >
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Playlist Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value || ""}
                    placeholder="Playlist Description"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="visibility"
            control={form.control}
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
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={!form.formState.isDirty || update.isPending}
            type="submit"
            className="self-end"
          >
            <span>Save Changes</span>
          </Button>
        </form>
      </Form>
    </ResponsiveModal>
  );
};

export default EditPlaylistModal;
