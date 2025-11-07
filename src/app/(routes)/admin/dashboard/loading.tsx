export default function Loading() {
  return (
    <div className="p-6 animate-pulse space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-6 w-48 bg-muted rounded" />
          <div className="h-4 w-72 bg-muted rounded mt-2" />
        </div>
        <div className="h-10 w-40 rounded bg-muted" />
      </div>

      {/* Stats Cards */}
      <div className="grid lg:grid-cols-4 grid-cols-1 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 h-28 bg-muted"/>
        ))}
      </div>

      {/* Projects */}
      <div className="space-y-4">
        <div className="h-6 w-52 bg-muted rounded" />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 h-32 bg-muted"/>
          ))}
        </div>
      </div>

      {/* Budget + Meetings */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6 h-64 bg-muted"/>
        <div className="border rounded-lg p-6 h-64 bg-muted"/>
      </div>

      <div className="border rounded-lg p-6 h-64 bg-muted"/>
    </div>
  );
}
