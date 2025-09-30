import { HydrateClient, trpc } from "@/services/trpc/server";
import HomeView from "@/views/dashboard/HomeView";

export const dynamic = "force-dynamic";

interface HomeProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { category } = await searchParams;

  void trpc.categories.getMany.prefetch();

  return (
    <HydrateClient>
      <HomeView categoryId={category} />
    </HydrateClient>
  );
}
