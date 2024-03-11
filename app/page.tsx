import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-col gap-y-4">
      This is state for only auth users
      <UserButton>Click me</UserButton>
    </div>
  );
}
