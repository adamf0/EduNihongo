import { Link } from "react-router-dom";

export function Page() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-on-background">
      <div className="max-w-md w-full bg-surface-container-lowest p-10 rounded-[32px] border border-outline-variant/30 text-center space-y-6 shadow-sm">
        <h1 className="text-3xl font-bold text-primary">Vocabulary Page</h1>
        <p className="text-on-surface-variant">
          This is a placeholder for the Vocabulary module.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/dashboard"
            className="inline-block bg-secondary text-on-secondary px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-all cursor-pointer"
          >
            Dashboard
          </Link>
          <Link
            to="/kanji"
            className="inline-block bg-secondary text-on-secondary px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-all cursor-pointer"
          >
            Kanji
          </Link>
        </div>
        <Link
          to="/"
          className="inline-block bg-primary text-on-primary px-6 py-2 rounded-lg font-bold text-sm hover:bg-primary/90 transition-all cursor-pointer"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Page;
