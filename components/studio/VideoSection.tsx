"use client";

import InfiniteScroll from "@/components/InfiniteScroll";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import VideoThumbnail from "@/components/videos/VideoThumbnail";
import { STUDIO_DEFAULT_VIDEO_LIMIT } from "@/constants/studio";
import { capitalize } from "@/lib/utils";
import { trpc } from "@/services/trpc/client";
import { format } from "date-fns";
import { Globe2, Link, Lock } from "lucide-react";
import { Route } from "next";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const VideoSection = () => {
  return (
    <Suspense fallback={<VideoSectionSkeleton />}>
      <ErrorBoundary fallback={<div>Error loading videos</div>}>
        <VideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideoSectionSkeleton = () => {
  return (
    <>
      <div className="border-y">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6 w-[31.875rem]">Video</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Comments</TableHead>
              <TableHead className="text-right pr-6">Likes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="animate-pulse">
            {Array.from({ length: STUDIO_DEFAULT_VIDEO_LIMIT }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="pl-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="bg-muted h-20 w-36" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="bg-muted h-4 w-[6.25rem]" />
                      <Skeleton className="bg-muted h-3 w-[9.375rem]" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="bg-muted h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="bg-muted h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="bg-muted h-4 w-24" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="bg-muted h-4 w-12 ml-auto" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="bg-muted h-4 w-12 ml-auto" />
                </TableCell>
                <TableCell className="text-right pr-6">
                  <Skeleton className="bg-muted h-4 w-12 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

const VideosSectionSuspense = () => {
  const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    {
      limit: STUDIO_DEFAULT_VIDEO_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const router = useRouter();

  return (
    <div>
      <div className="border-y">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6 w-[31.875rem]">Video</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Comments</TableHead>
              <TableHead className="text-right pr-6">Likes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.pages
              .flatMap((page) => page.items)
              .map((video) => (
                <TableRow
                  onClick={() =>
                    router.push(`/studio/videos/${video.id}` as Route)
                  }
                  className="cursor-pointer"
                  key={video.id}
                >
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-4">
                      <div className="relative aspect-video w-36 shrink-0 bg-foreground dark:bg-muted rounded-sm">
                        <VideoThumbnail
                          imageUrl={video.thumbnailUrl}
                          previewUrl={video.previewUrl}
                          title={video.title}
                          duration={video.duration}
                        />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm line-clamp-1 truncate w-[31.875rem]">
                          {video.title}
                        </span>
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {video.description || "No Description Available"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {video.visibility === "unlisted" ? (
                        <Link className="size-4 mr-2" />
                      ) : video.visibility === "private" ? (
                        <Lock className="size-4 mr-2" />
                      ) : (
                        <Globe2 className="size-4 mr-2" />
                      )}
                      {capitalize(video.visibility)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {capitalize(video.muxStatus)}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm truncate">
                    {format(new Date(video.createdAt), "dd MMM, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">Views</TableCell>
                  <TableCell className="text-right">Comments</TableCell>
                  <TableCell className="text-right pr-6">Likes</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
};

export default VideoSection;
