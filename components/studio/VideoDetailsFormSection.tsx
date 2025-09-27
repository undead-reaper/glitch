"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import VideoPlayer from "@/components/videos/VideoPlayer";
import { clientEnv } from "@/env/env.client";
import { capitalize } from "@/lib/utils";
import { videoUpdateSchema } from "@/services/drizzle/schema/videos";
import { trpc } from "@/services/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Copy,
  CopyCheck,
  Globe,
  Lock,
  Link as LucideLink,
  MoreVertical,
  Trash,
} from "lucide-react";
import { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type Props = Readonly<{
  videoId: string;
}>;

export const VideoDetailsFormSection = ({ videoId }: Props) => {
  return (
    <Suspense fallback={<VideoDetailsFormSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Failed to load video details</p>}>
        <VideoDetailsFormSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideoDetailsFormSectionSkeleton = () => {
  return <div>Loading video details...</div>;
};

const VideoDetailsFormSectionSuspense = ({ videoId }: Props) => {
  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  const utils = trpc.useUtils();
  const router = useRouter();

  const update = trpc.videos.update.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId });
      toast.success("Video Updated Successfully", {
        description: "Your video details have been updated.",
      });
    },
  });

  const deleteVideo = trpc.videos.delete.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      toast.success("Video Deleted Successfully", {
        description: "Your video has been deleted.",
      });
      router.replace("/studio/content");
    },
    onError: (error) => {
      toast.error("Could not Delete Video", {
        description: error.message,
      });
    },
  });

  const form = useForm<z.infer<typeof videoUpdateSchema>>({
    resolver: zodResolver(videoUpdateSchema),
    defaultValues: video,
  });

  const onSubmit = (data: z.infer<typeof videoUpdateSchema>) => {
    update.mutate(data);
  };

  const fullUrl = `${clientEnv.NEXT_PUBLIC_BASE_URL}/watch?v=${video.id}`;
  const [isCopied, setIsCopied] = useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast.success("Copied to clipboard", {
      description: "The video link has been copied to your clipboard.",
    });
  };

  const isPending = update.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between mb-6 select-none">
          <div>
            <h1 className="text-2xl font-bold">Video Details</h1>
            <p className="text-xs text-muted-foreground">
              Edit and manage your video information
            </p>
          </div>
          <div className="flex items-center gap-x-2">
            <Button
              type="submit"
              disabled={isPending}
              className="cursor-pointer"
            >
              Save
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  disabled={isPending}
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer"
                >
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => deleteVideo.mutate({ id: video.id })}
                >
                  <Trash className="size-4 mr-2" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="space-y-8 lg:col-span-3">
            <FormField
              control={form.control}
              name="title"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Add a title that describes your video"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ""}
                      rows={10}
                      className="resize-none pr-10 field-sizing-fixed"
                      placeholder="Tell viewers about your video"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem value={category.id} key={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-y-8 lg:col-span-2 mb-5">
            <div className="flex flex-col gap-4 bg-muted rounded-xl overflow-hidden h-fit">
              <div className="aspect-video overflow-hidden relative">
                <VideoPlayer
                  playbackId={video.muxPlaybackId}
                  thumbnailUrl={video.thumbnailUrl}
                />
              </div>
              <div className="px-4 pb-4 flex flex-col gap-y-6">
                <div className="flex justify-between items-center gap-x-2">
                  <div className="flex flex-row items-center w-full">
                    <div className="flex grow flex-col mr-auto items-start gap-x-2">
                      <p className="text-muted-foreground text-xs">
                        Video Link
                      </p>
                      <Link href={fullUrl as Route}>
                        <p className="break-words line-clamp-2 text-sm text-primary">
                          {fullUrl}
                        </p>
                      </Link>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      type="button"
                      className="shrink-1"
                      onClick={onCopy}
                      disabled={isCopied}
                    >
                      {isCopied ? <CopyCheck /> : <Copy />}
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <p className="text-muted-foreground text-xs">
                      Video Status
                    </p>
                    <p className="text-sm">{capitalize(video.muxStatus)}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <p className="text-muted-foreground text-xs">
                      Subtitle Status
                    </p>
                    <p className="text-sm">
                      {capitalize(video.muxTrackStatus || "no_subtitles")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <FormField
              control={form.control}
              name="visibility"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Visibility" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="public">
                        <Globe className="size-4 mr-2" />
                        <span>Public</span>
                      </SelectItem>
                      <SelectItem value="unlisted">
                        <LucideLink className="size-4 mr-2" />
                        <span>Unlisted</span>
                      </SelectItem>
                      <SelectItem value="private">
                        <Lock className="size-4 mr-2" />
                        <span>Private</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};

export default VideoDetailsFormSection;
