"use client";

import _CategoriesBar from "@/components/dashboard/_CategoriesBar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/services/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = Readonly<{
  categoryId?: string;
}>;

const CategoriesBar = ({ categoryId }: Props) => {
  return (
    <Suspense fallback={<CategoriesBarSkeleton />}>
      <ErrorBoundary fallback={<div>Failed to load categories</div>}>
        <CategoriesBarSuspense categoryId={categoryId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const CategoriesBarSkeleton = () => {
  return (
    <Carousel className="animate-pulse">
      <CarouselContent>
        {Array.from({ length: 14 }).map((_, idx) => (
          <CarouselItem key={idx} className="pl-3 basis-auto">
            <Skeleton className="rounded-lg px-3 py-1 h-full text-sm w-[6.25rem] font-semibold bg-muted">
              &nbsp;
            </Skeleton>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

const CategoriesBarSuspense = ({ categoryId }: Props) => {
  const [categories] = trpc.categories.getMany.useSuspenseQuery();

  const data = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  return <_CategoriesBar data={data} value={categoryId} />;
};

export default CategoriesBar;
