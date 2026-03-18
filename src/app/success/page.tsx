import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl text-gray-900 mb-4">
          We&apos;re On It!
        </h1>
        <p className="text-gray-500 mb-2">
          Your submission has been received. We&apos;ll review your information and
          have your website ready within 48 hours.
        </p>
        <p className="text-gray-500 mb-8">
          You&apos;ll receive a preview link via email before we go live.
        </p>
        <Link
          href="/"
          className="text-blue-600 font-medium hover:underline"
        >
          &larr; Back to form
        </Link>
      </div>
    </div>
  );
}
