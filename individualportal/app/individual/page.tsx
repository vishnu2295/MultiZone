"use client";

import { useUser } from "@auth0/nextjs-auth0";

export default function Home() {
  const { user } = useUser();

const navigateTo = () => {
  window.location.href = `/`;
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-6 py-10">
  <main className="mx-auto max-w-6xl">
    {/* Header */}

    <div className="mb-10">
      <div className="mb-6 flex items-center justify-between">
        <button onClick= {navigateTo} className="text-blue-600 hover:text-blue-700 cursor-pointer text-sm font-semibold transition-colors">
      Go to Home Page
    </button>
        <a
          href={user ? "/auth/logout" : "/auth/login"}
          className="text-blue-600 hover:text-blue-700 cursor-pointer text-sm font-semibold transition-colors"
        >
          {user ? "Logout" : "Login"}
        </a>
      </div>
      <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
        Individual Portal
      </p>

      <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        Welcome back, John 👋
      </h1>

      <p className="mt-3 max-w-2xl text-lg text-slate-600">
        Manage your personal information, applications, documents, and
        account settings from one place.
      </p>
    </div>

    {/* Stats */}
    <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          Active Applications
        </p>
        <p className="mt-2 text-3xl font-bold text-slate-900">3</p>
        <p className="mt-1 text-sm text-green-600">
          ↑ 1 from last month
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          Pending Documents
        </p>
        <p className="mt-2 text-3xl font-bold text-slate-900">2</p>
        <p className="mt-1 text-sm text-amber-600">
          Action required
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          Completed
        </p>
        <p className="mt-2 text-3xl font-bold text-slate-900">12</p>
        <p className="mt-1 text-sm text-blue-600">
          All time
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          Profile Status
        </p>
        <p className="mt-2 text-3xl font-bold text-green-600">95%</p>
        <p className="mt-1 text-sm text-slate-500">
          Almost complete
        </p>
      </div>
    </div>

    {/* Quick Actions */}
    <section>
      <h2 className="mb-5 text-2xl font-bold text-slate-900">
        Quick Actions
      </h2>

      <div className="grid gap-5 md:grid-cols-3">
        <button className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
            👤
          </div>

          <h3 className="text-lg font-semibold text-slate-900">
            My Profile
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            View and update your personal information.
          </p>

          <p className="mt-4 text-sm font-semibold text-blue-600">
            Manage Profile →
          </p>
        </button>

        <button className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-2xl">
            📄
          </div>

          <h3 className="text-lg font-semibold text-slate-900">
            My Documents
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Upload, view, and manage your documents.
          </p>

          <p className="mt-4 text-sm font-semibold text-indigo-600">
            View Documents →
          </p>
        </button>

        <button className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-2xl">
            📋
          </div>

          <h3 className="text-lg font-semibold text-slate-900">
            Applications
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Track the status of your current applications.
          </p>

          <p className="mt-4 text-sm font-semibold text-emerald-600">
            View Applications →
          </p>
        </button>
      </div>
    </section>

    {/* Recent Activity */}
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">
          Recent Activity
        </h2>

        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
          View all
        </button>
      </div>

      <div className="mt-6 divide-y divide-slate-100">
        <div className="flex items-center justify-between py-4">
          <div>
            <p className="font-medium text-slate-900">
              Profile updated
            </p>
            <p className="text-sm text-slate-500">
              Your contact information was updated
            </p>
          </div>

          <span className="text-sm text-slate-400">
            Today
          </span>
        </div>

        <div className="flex items-center justify-between py-4">
          <div>
            <p className="font-medium text-slate-900">
              Document uploaded
            </p>
            <p className="text-sm text-slate-500">
              Passport document was successfully uploaded
            </p>
          </div>

          <span className="text-sm text-slate-400">
            Yesterday
          </span>
        </div>

        <div className="flex items-center justify-between py-4">
          <div>
            <p className="font-medium text-slate-900">
              Application submitted
            </p>
            <p className="text-sm text-slate-500">
              Application #APP-10234 is being reviewed
            </p>
          </div>

          <span className="text-sm text-slate-400">
            3 days ago
          </span>
        </div>
      </div>
    </section>
  </main>
</div>
  );
}
