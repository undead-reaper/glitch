import { ReactNode } from "react";

type Props = Readonly<{
  children: ReactNode;
}>;

const AuthLayout = ({ children }: Props) => {
  return (
    <main className="flex min-h-screen flex-row items-center justify-center py-5 md:py-0">
      {children}
    </main>
  );
};

export default AuthLayout;
