import SearchResults from "@/components/dashboard/SearchResults";

type Props = {
  searchParams: {
    search_query: string;
  };
};

const SearchView = ({ searchParams }: Props) => {
  const { search_query: searchQuery } = searchParams;

  return (
    <div className="max-w-7xl mx-auto mb-10 flex flex-col gap-y-6 pt-2.5">
      <SearchResults searchQuery={searchQuery} />
    </div>
  );
};

export default SearchView;
