import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center flex-1 bg-zinc-50 p-6">
      <div className="w-full max-w-4xl flex flex-col gap-12 text-center items-center relative">
        {/* Background grid effect for premium console feel */}
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <div className="z-10 flex flex-col items-center gap-6">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-zinc-950 uppercase">
            Arena
          </h1>
          <p className="text-zinc-900 max-w-md text-sm md:text-base uppercase tracking-widest leading-relaxed font-semibold">
            Personal Live-Event Control System. Turn everyday screens into synchronized lighting fixtures.
          </p>
        </div>

        <div className="z-10 flex flex-col md:flex-row w-full max-w-xl gap-4">
          <Link
            href="/operator"
            className="flex-1 border border-zinc-300 bg-white p-6 hover:bg-zinc-100 transition-colors flex flex-col items-center gap-2 group"
          >
            <span className="text-xl font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">
              Operator Console
            </span>
            <span className="text-xs font-bold text-zinc-800 uppercase tracking-widest">
              Design & Control
            </span>
          </Link>

          <Link
            href="/fixture"
            className="flex-1 border border-zinc-300 bg-white p-6 hover:bg-zinc-100 transition-colors flex flex-col items-center gap-2 group"
          >
            <span className="text-xl font-bold text-zinc-900 group-hover:text-amber-500 transition-colors">
              Join as Fixture
            </span>
            <span className="text-xs font-bold text-zinc-800 uppercase tracking-widest">
              Display Lighting Cues
            </span>
          </Link>
        </div>
        
        <div className="z-10 text-xs font-bold text-zinc-900 uppercase tracking-widest mt-12">
          Ready to go
        </div>
      </div>
    </main>
  );
}
