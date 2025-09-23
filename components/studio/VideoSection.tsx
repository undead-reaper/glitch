"use client";

import InfiniteScroll from "@/components/InfiniteScroll";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { STUDIO_DEFAULT_VIDEO_LIMIT } from "@/constants/studio";
import { trpc } from "@/services/trpc/client";
import { Route } from "next";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const VideoSection = () => {
  return (
    <Suspense fallback={<div>Loading videos...</div>}>
      <ErrorBoundary fallback={<div>Error loading videos</div>}>
        <VideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
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
                  <TableCell>{video.title}</TableCell>
                  <TableCell>Visibility</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
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
