"use client";

import { useRouter } from "next/navigation";

export default function MemberPortalHome() {
  const router = useRouter();

  const navigateTo = (path: string) => {
  window.location.href = `/${path}`;
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-6 py-12">
      <main className="mx-auto flex min-h-[80vh] max-w-5xl flex-col items-center justify-center">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
            Member Portal
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Welcome to the Member Portal
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Choose a portal below to continue.
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid w-full max-w-3xl gap-6 sm:grid-cols-2">
          {/* Individual Portal */}
          <button
            onClick={() => navigateTo("individual")}
            className="group rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-2xl transition-colors group-hover:bg-blue-600">
              👤
            </div>

            <h2 className="text-xl font-semibold text-slate-900">
              Individual Portal
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Manage your personal account, profile, and individual services.
            </p>

            <div className="mt-6 flex items-center font-medium text-blue-600 cursor-pointer">
              Go to Individual Portal
              <span className="ml-2 transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>
          </button>

          {/* Company Portal */}
          <button
            onClick={() => navigateTo("company")}
            className="group rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-100 text-2xl transition-colors group-hover:bg-indigo-600">
              🏢
            </div>

            <h2 className="text-xl font-semibold text-slate-900">
              Company Portal
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Access company information, manage your organization, and
              collaborate with your team.
            </p>

            <div className="mt-6 flex items-center font-medium text-indigo-600 cursor-pointer">
              Go to Company Portal
              <span className="ml-2 transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}