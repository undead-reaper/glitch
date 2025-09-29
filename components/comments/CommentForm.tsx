import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import UserAvatar from "@/components/UserAvatar";
import { commentInsertSchema } from "@/services/drizzle/schema/comments";
import { trpc } from "@/services/trpc/client";
import { useClerk, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type Props = Readonly<{
  videoId: string;
  onSuccess?: () => void;
}>;

const CommentForm = ({ videoId, onSuccess }: Props) => {
  const { user } = useUser();
  const { resolvedTheme } = useTheme();
  const clerk = useClerk();

  const commentFormSchema = commentInsertSchema.omit({ userId: true });
  type CommentFormData = z.infer<typeof commentFormSchema>;
  const utils = trpc.useUtils();

  const create = trpc.comments.create.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId });
      form.reset();
      toast.success("Comment Posted!", {
        description: "Your comment has been added successfully.",
      });
      onSuccess?.();
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      } else {
        toast.error("Failed to Post Comment", {
          description: error.message,
        });
      }
    },
  });

  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      videoId,
      content: "",
    },
  });

  const handleSubmit = (values: CommentFormData) => {
    if (values.content === "") return;
    create.mutate(values);
  };

  const placeholderName = "Anonymous";
  const placeholderImage =
    resolvedTheme === "dark" ? "/avatar-dark.svg" : "/avatar-light.svg";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex gap-4 group"
      >
        <UserAvatar
          size="lg"
          imageUrl={user?.imageUrl || placeholderImage}
          name={user?.username || placeholderName}
        />
        <div className="flex-1">
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Add a comment..."
                    className="resize-none bg-transparent overflow-hidden min-h-0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="justify-end gap-2 mt-2 flex">
            <Button
              disabled={create.isPending || !form.formState.isDirty}
              type="submit"
              className="cursor-pointer"
              size="sm"
            >
              Comment
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CommentForm;
