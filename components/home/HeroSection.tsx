import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-700 to-blue-900 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }} />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Discover Your Next<br />
            <span className="text-blue-200">Great Story</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
            Explore thousands of books, attend community events, and connect with fellow readers at City Library.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/books"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors duration-200"
            >
              Browse Books
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center justify-center px-6 py-3 border border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors duration-200"
            >
              View Events
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
