import { DEFAULT_SEARCH_LIMIT } from "@/constants/dashboard";
import { HydrateClient, trpc } from "@/services/trpc/server";
import SearchView from "@/views/dashboard/SearchView";
import { redirect } from "next/navigation";

;

type Props = {
  searchParams: Promise<{
    search_query: string;
  }>;
};

const SearchPage = async ({ searchParams }: Props) => {
  const { search_query: searchQuery } = await searchParams;

  if (searchQuery === undefined) {
    redirect("/results?search_query=");
  }

  void trpc.search.getMany.prefetchInfinite({
    query: searchQuery,
    limit: DEFAULT_SEARCH_LIMIT,
  });

  return (
    <HydrateClient>
      <SearchView searchParams={{ search_query: searchQuery }} />
    </HydrateClient>
  );
};

export default SearchPage;
