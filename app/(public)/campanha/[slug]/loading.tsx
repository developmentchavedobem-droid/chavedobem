export default function CampaignLoading() {
  return (
    <div className="min-h-screen bg-zinc-100 pb-20 font-sans text-gray-800">
      <div className="w-full bg-[#053B80] px-4 pb-24 pt-16">
        <div className="mx-auto max-w-4xl space-y-4 text-center">
          <div className="mx-auto h-7 w-56 animate-pulse rounded-full bg-white/15" />
          <div className="mx-auto h-12 w-4/5 max-w-2xl animate-pulse rounded-2xl bg-white/15" />
          <div className="mx-auto h-5 w-40 animate-pulse rounded-full bg-white/10" />
        </div>
      </div>

      <main className="mx-auto -mt-12 max-w-4xl px-4">
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
          <div className="h-64 w-full animate-pulse bg-zinc-200 md:h-[450px]" />
          <div className="space-y-6 p-6 md:p-12">
            <div className="h-9 w-4/5 animate-pulse rounded-xl bg-zinc-100" />
            <div className="space-y-3">
              <div className="h-4 w-full animate-pulse rounded bg-zinc-100" />
              <div className="h-4 w-11/12 animate-pulse rounded bg-zinc-100" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-100" />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="h-28 animate-pulse rounded-2xl bg-zinc-100" />
              <div className="h-28 animate-pulse rounded-2xl bg-zinc-100" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
