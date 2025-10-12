import UserSection from "@/components/users/UserSection";
import UserVideos from "@/components/users/UserVideos";

type Props = Readonly<{
  userId: string;
}>;

const UserView = ({ userId }: Props) => {
  return (
    <div className="flex flex-col max-w-[81rem] pt-2.5 mx-auto mb-10 gap-y-6">
      <UserSection userId={userId} />
      <UserVideos userId={userId} />
    </div>
  );
};

export default UserView;
