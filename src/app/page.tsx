import IntakeForm from "@/components/IntakeForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 text-center">
          <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl text-gray-900 mb-3">
            Let&apos;s Build Your Website
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Complete the form below and we&apos;ll have your professional
            insurance agency website live within 48 hours. Every field
            helps us make it yours.
          </p>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <IntakeForm />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Agency Brain. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
