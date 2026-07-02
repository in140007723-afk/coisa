export function ActivityTimeline({ events }: { events: Array<{ id: string; user: string; action: string; date: string; time: string; status: string; }> }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/90 p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Recent activity</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Activity timeline</h3>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {events.map((event) => (
          <div key={event.id} className="grid gap-3 rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span className="rounded-full bg-slate-800 px-2 py-1">{event.status}</span>
                <span>{event.date} · {event.time}</span>
              </div>
              <p className="text-base font-semibold text-white">{event.action}</p>
              <p className="text-sm text-slate-500">Performed by {event.user}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
