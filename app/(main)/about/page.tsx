export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">About City Library</h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Serving our community since 1952, City Library is more than a building—it&apos;s a place where ideas come to life.
        </p>
      </div>

      <div className="prose prose-slate max-w-none space-y-10">
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Our History</h2>
          <p className="text-slate-600 leading-relaxed">
            Founded in 1952, City Library has grown from a small reading room with just 500 books to a modern cultural
            institution housing over 150,000 volumes. Through decades of community support and dedication, we have
            become the heart of our city&apos;s intellectual and cultural life.
          </p>
          <p className="text-slate-600 leading-relaxed mt-4">
            Our building was designed by renowned architect James Morrison and opened its doors on March 15, 1952.
            Since then, it has been expanded three times to accommodate our ever-growing collection and services.
          </p>
        </section>

        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Mission & Vision</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-xl p-5">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Mission</h3>
              <p className="text-sm text-slate-600">
                To provide free and equitable access to information, ideas, and inspiration to everyone in our community,
                fostering lifelong learning and civic engagement.
              </p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-5">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Vision</h3>
              <p className="text-sm text-slate-600">
                A vibrant community where everyone has the resources and opportunities to learn, grow, and connect
                through the power of knowledge and shared stories.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { name: 'Sarah Johnson', role: 'Chief Librarian', initials: 'SJ' },
              { name: 'Michael Chen', role: 'Head of Collections', initials: 'MC' },
              { name: 'Emily Rodriguez', role: 'Community Manager', initials: 'ER' },
            ].map((member) => (
              <div key={member.name} className="text-center p-5 bg-slate-50 rounded-xl">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                  {member.initials}
                </div>
                <h3 className="font-semibold text-slate-900">{member.name}</h3>
                <p className="text-sm text-slate-500 mt-0.5">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Books', value: '150,000+' },
            { label: 'Members', value: '25,000+' },
            { label: 'Events/Year', value: '500+' },
            { label: 'Years Serving', value: '70+' },
          ].map((stat) => (
            <div key={stat.label} className="bg-blue-600 rounded-2xl p-6 text-center text-white">
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-blue-200 text-sm">{stat.label}</div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
