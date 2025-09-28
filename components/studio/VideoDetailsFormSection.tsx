"use client";

import ThumbnailUploadModal from "@/components/studio/ThumbnailUploadModal";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import VideoPlayer from "@/components/videos/VideoPlayer";
import { THUMBNAIL_PLACEHOLDER } from "@/constants/globals";
import { clientEnv } from "@/env/env.client";
import { capitalize } from "@/lib/utils";
import { videoUpdateSchema } from "@/services/drizzle/schema/videos";
import { trpc } from "@/services/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Copy,
  CopyCheck,
  Globe,
  ImagePlus,
  Loader2,
  Lock,
  Link as LucideLink,
  MoreVertical,
  RotateCcw,
  Sparkles,
  Trash,
} from "lucide-react";
import { Route } from "next";
import Image from "next/image";
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
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-32 bg-muted" />
          <Skeleton className="h-4 w-40 bg-muted" />
        </div>
        <Skeleton className="h-9 w-24 bg-muted" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-5">
        <div className="space-y-8 lg:col-span-3">
          <div className="space-y-2">
            <Skeleton className="h-5 w-16 bg-muted" />
            <Skeleton className="h-10 w-full bg-muted" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-24 bg-muted" />
            <Skeleton className="h-[13.75rem] w-full bg-muted" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-20 bg-muted" />
            <Skeleton className="h-[5.25rem] w-[9.563rem] bg-muted" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-20 bg-muted" />
            <Skeleton className="h-10 w-full bg-muted" />
          </div>
        </div>
        <div className="flex flex-col gap-y-8 lg:col-span-2">
          <div className="flex flex-col gap-4 bg-muted rounded-xl overflow-hidden">
            <Skeleton className="aspect-video bg-background" />
            <div className="px-4 py-4 space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 bg-background" />
                <Skeleton className="h-5 w-full bg-background" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 bg-background" />
                <Skeleton className="h-5 w-32 bg-background" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 bg-background" />
                <Skeleton className="h-5 w-32 bg-background" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-20 bg-muted" />
            <Skeleton className="h-10 w-full bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
};

const VideoDetailsFormSectionSuspense = ({ videoId }: Props) => {
  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
  const [categories] = trpc.categories.getMany.useSuspenseQuery();

  const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false);

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

  const generateTitle = trpc.videos.generateTitle.useMutation({
    onSuccess: () => {
      toast.success("Title Generation Started", {
        description: "The video title is being generated.",
      });
    },
    onSettled: () => {
      utils.studio.getOne.invalidate({ id: videoId });
      utils.studio.getMany.invalidate();
    },
  });

  const generateDescription = trpc.videos.generateDescription.useMutation({
    onSuccess: () => {
      toast.success("Description Generation Started", {
        description: "The video description is being generated.",
      });
    },
    onSettled: () => {
      utils.studio.getOne.invalidate({ id: videoId });
      utils.studio.getMany.invalidate();
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

  const restoreThumbnail = trpc.videos.restoreThumbnail.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId });
      toast.success("Thumbnail Restored", {
        description: "The video thumbnail has been restored to default.",
      });
    },
    onError: (error) => {
      toast.error("Could not Restore Thumbnail", {
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

  const isPending =
    update.isPending ||
    restoreThumbnail.isPending ||
    generateTitle.isPending ||
    generateDescription.isPending;

  return (
    <>
      <ThumbnailUploadModal
        open={thumbnailModalOpen}
        onOpenChange={setThumbnailModalOpen}
        videoId={videoId}
      />
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
                disabled={isPending || !form.formState.isDirty}
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
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-5">
            <div className="space-y-8 lg:col-span-3">
              <FormField
                control={form.control}
                name="title"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex items-center gap-x-2">
                        <span>Title</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          type="button"
                          className="rounded-full size-6 cursor-pointer"
                          onClick={() => generateTitle.mutate({ id: videoId })}
                          disabled={isPending || !video.muxTrackId}
                        >
                          {generateTitle.isPending ? (
                            <Loader2 className="animate-spin size-3" />
                          ) : (
                            <Sparkles className="size-3" />
                          )}
                        </Button>
                      </div>
                    </FormLabel>
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
                    <div className="flex items-center gap-x-2">
                      <span>Description</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        type="button"
                        className="rounded-full size-6 cursor-pointer"
                        onClick={() =>
                          generateDescription.mutate({ id: videoId })
                        }
                        disabled={isPending || !video.muxTrackId}
                      >
                        {generateDescription.isPending ? (
                          <Loader2 className="animate-spin size-3" />
                        ) : (
                          <Sparkles className="size-3" />
                        )}
                      </Button>
                    </div>
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
                name="thumbnailUrl"
                control={form.control}
                render={() => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <div className="p-0 5 border border-dashed border-muted relative h-[5.25rem] w-[9.563rem] group">
                        <Image
                          fill
                          alt="Thumbnail"
                          src={video.thumbnailUrl || THUMBNAIL_PLACEHOLDER}
                          className="object-cover bg-muted"
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              size="icon"
                              className="bg-black/50 hover:bg-black/50 absolute top-1 right-1 cursor-pointer rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 duration-700 size-7"
                            >
                              <MoreVertical className="text-white" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem
                              onClick={() => setThumbnailModalOpen(true)}
                            >
                              <ImagePlus className="size-4 mr-1" />
                              Change
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                restoreThumbnail.mutate({ id: video.id })
                              }
                            >
                              <RotateCcw className="size-4 mr-1" />
                              Restore Default
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </FormControl>
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
            <div className="flex flex-col gap-y-8 lg:col-span-2">
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
                        <Link href={fullUrl as Route} target="_blank">
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
    </>
  );
};

export default VideoDetailsFormSection;
