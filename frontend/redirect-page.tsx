export default function RedirectPage({
  url,
  destination,
}: {
  url: string;
  destination: string;
}) {
  return (
    <div>
      {url} takes to {destination}
    </div>
  );
}
