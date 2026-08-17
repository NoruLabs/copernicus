import { HeaderTools } from "./HeaderTools";

export function FeedHeader({ title }: { title: string }) {
  return (
    <header className="feed-header">
      <h1>{title}</h1>
      <HeaderTools />
    </header>
  );
}
