import CategoriesBar from "@/components/dashboard/CategoriesBar";
import HomeFeed from "@/components/dashboard/HomeFeed";

type Props = Readonly<{
  categoryId?: string;
}>;

const HomeView = ({ categoryId }: Props) => {
  return (
    <div className="max-w-[150rem] mx-auto mb-10 pt-2.5 flex flex-col gap-y-6">
      <CategoriesBar categoryId={categoryId} />
      <HomeFeed categoryId={categoryId} />
    </div>
  );
};

export default HomeView;
