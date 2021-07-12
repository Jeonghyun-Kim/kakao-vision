import Link from 'next/link';

export default function IndexPage() {
  return (
    <div>
      <h1>Index Page</h1>
      <nav>
        <Link href="/face/detect">Face Detection</Link>
      </nav>
    </div>
  );
}
