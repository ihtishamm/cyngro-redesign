// Coded product mockups (1200×750 design canvas) standing in for project
// imagery — cyngro.com publishes no case-study screenshots.

import type { Project } from "@/lib/data";

const bars = [42, 58, 51, 66, 73, 61, 79, 88, 72, 93, 84, 97];

function ErpMock() {
  const nav = ["Dashboard", "Inventory", "Sales", "Accounting", "HR", "Manufacturing", "CRM"];
  return (
    <div className="flex h-full w-full bg-[#f5f6f8] font-sans text-[#14213d]">
      <aside className="flex w-[220px] flex-col gap-1 bg-[#14213d] p-6 text-white">
        <div className="mb-8 flex items-center gap-2 text-[20px] font-semibold">
          <span className="h-7 w-7 rounded-md bg-[#fca311]" /> StellarMart
        </div>
        {nav.map((n, i) => (
          <div
            key={n}
            className={`rounded-lg px-3 py-2.5 text-[15px] ${i === 0 ? "bg-white/10 text-white" : "text-white/60"}`}
          >
            {n}
          </div>
        ))}
        <div className="mt-auto rounded-xl bg-[#fca311] p-4 text-[13px] text-[#14213d]">
          <div className="font-semibold">Odoo 17 · synced</div>
          <div className="opacity-70">Last sync 12s ago</div>
        </div>
      </aside>
      <main className="flex flex-1 flex-col gap-5 p-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[13px] uppercase tracking-wider opacity-50">Operations overview</div>
            <div className="text-[28px] font-semibold">Good morning, Amit</div>
          </div>
          <div className="h-10 w-72 rounded-full bg-white shadow-sm" />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[
            ["Revenue", "£1.24M", "+12.4%"],
            ["Orders", "3,482", "+8.1%"],
            ["Stock value", "£418K", "-2.3%"],
            ["Invoices due", "37", "4 overdue"],
          ].map(([k, v, d]) => (
            <div key={k} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="text-[13px] opacity-50">{k}</div>
              <div className="mt-1 text-[26px] font-semibold">{v}</div>
              <div className="text-[12px] text-[#e07a00]">{d}</div>
            </div>
          ))}
        </div>
        <div className="grid flex-1 grid-cols-[1.6fr_1fr] gap-4">
          <div className="flex flex-col rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex justify-between text-[15px] font-semibold">
              Sales by month <span className="text-[12px] font-normal opacity-50">2026</span>
            </div>
            <div className="flex flex-1 items-end gap-3">
              {bars.map((b, i) => (
                <div key={i} className="flex-1 rounded-t-md bg-[#14213d]" style={{ height: `${b}%`, opacity: i === 11 ? 1 : 0.18 + i * 0.05 }} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm">
            <div className="text-[15px] font-semibold">Recent orders</div>
            {["SO-4821 · Northwind", "SO-4820 · Acme Ltd", "SO-4819 · Bluebird", "SO-4818 · Kestrel", "SO-4817 · Halcyon"].map((o, i) => (
              <div key={o} className="flex items-center justify-between border-b border-black/5 pb-2 text-[14px]">
                <span>{o}</span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] ${i % 2 ? "bg-[#14213d]/10" : "bg-[#fca311]/25"}`}>
                  {i % 2 ? "Delivered" : "Picking"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function Phone({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`h-[600px] w-[290px] rounded-[44px] bg-[#0b1b1b] p-3 shadow-2xl ${className}`}>
      <div className="relative h-full w-full overflow-hidden rounded-[34px] bg-white">
        <div className="absolute left-1/2 top-2 h-6 w-24 -translate-x-1/2 rounded-full bg-[#0b1b1b]" />
        {children}
      </div>
    </div>
  );
}

function AppMock() {
  return (
    <div className="relative flex h-full w-full items-center justify-center gap-10 overflow-hidden bg-gradient-to-br from-[#0e7c7b] to-[#17bebb] font-sans">
      <div className="absolute -left-20 -top-20 h-[420px] w-[420px] rounded-full bg-white/10" />
      <div className="absolute -bottom-40 right-10 h-[520px] w-[520px] rounded-full bg-[#ff6b6b]/25" />
      <Phone className="-rotate-6 translate-y-6">
        <div className="flex h-full flex-col gap-4 p-6 pt-12 text-[#0b1b1b]">
          <div className="text-[13px] opacity-50">Today</div>
          <div className="text-[24px] font-semibold leading-tight">Hi Lisa, you&apos;re on track</div>
          <div className="relative mx-auto my-2 h-44 w-44">
            {[0, 1, 2].map((r) => (
              <svg key={r} viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
                <circle cx="50" cy="50" r={44 - r * 11} fill="none" stroke="#e8f4f4" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r={44 - r * 11}
                  fill="none"
                  stroke={["#ff6b6b", "#17bebb", "#0e7c7b"][r]}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * (44 - r * 11) * [0.78, 0.62, 0.9][r]} 999`}
                />
              </svg>
            ))}
          </div>
          {[
            ["Steps", "8,240"],
            ["Heart rate", "72 bpm"],
            ["Sleep", "7h 32m"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between rounded-2xl bg-[#f1f8f8] px-4 py-3 text-[14px]">
              <span className="opacity-60">{k}</span>
              <span className="font-semibold">{v}</span>
            </div>
          ))}
        </div>
      </Phone>
      <Phone className="rotate-3 -translate-y-4">
        <div className="flex h-full flex-col gap-3 p-6 pt-12 text-[#0b1b1b]">
          <div className="text-[24px] font-semibold">Appointments</div>
          <div className="rounded-3xl bg-[#ff6b6b] p-5 text-white">
            <div className="text-[12px] opacity-80">Next · Tomorrow 10:30</div>
            <div className="mt-1 text-[18px] font-semibold">Dr. Patel — Cardiology</div>
            <div className="mt-4 inline-block rounded-full bg-white/25 px-3 py-1 text-[12px]">Video consult</div>
          </div>
          {["Blood test results", "Prescription renewal", "Physio follow-up", "Annual check-up"].map((t, i) => (
            <div key={t} className="flex items-center gap-3 rounded-2xl border border-black/5 p-3 text-[14px]">
              <span className="h-9 w-9 rounded-xl" style={{ background: ["#17bebb", "#0e7c7b", "#ffd166", "#ff6b6b"][i] }} />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </Phone>
    </div>
  );
}

function FintechMock() {
  const pts = [70, 64, 68, 55, 58, 47, 50, 38, 42, 30, 26, 18];
  const line = pts.map((y, i) => `${(i / (pts.length - 1)) * 100},${y}`).join(" ");
  return (
    <div className="flex h-full w-full flex-col bg-[#0c0a1d] p-10 font-sans text-white">
      <div className="flex items-center justify-between text-[15px]">
        <div className="flex items-center gap-2 text-[20px] font-semibold">
          <span className="h-6 w-6 rotate-45 rounded-sm bg-[#c6f432]" /> FinEdge
        </div>
        <div className="flex gap-8 opacity-60">
          <span>Platform</span>
          <span>Pricing</span>
          <span>Developers</span>
          <span>Company</span>
        </div>
        <div className="rounded-full bg-[#c6f432] px-5 py-2 text-[#0c0a1d]">Open account</div>
      </div>
      <div className="mt-14 grid flex-1 grid-cols-[1.1fr_1fr] gap-10">
        <div>
          <div className="text-[13px] uppercase tracking-[0.2em] text-[#c6f432]">Wealth infrastructure</div>
          <div className="mt-4 text-[64px] font-semibold leading-[1.02] tracking-tight">
            Finance,
            <br />
            built on the edge.
          </div>
          <div className="mt-6 max-w-[420px] text-[17px] leading-relaxed opacity-60">
            Real-time portfolios, instant settlements and reporting your auditors will actually enjoy.
          </div>
          <div className="mt-8 flex gap-3">
            <div className="rounded-full bg-white px-6 py-3 text-[#0c0a1d]">Get started</div>
            <div className="rounded-full border border-white/30 px-6 py-3">Book a demo</div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex-1 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="flex justify-between text-[14px] opacity-70">
              Portfolio value <span className="text-[#c6f432]">+18.2%</span>
            </div>
            <div className="mt-1 text-[36px] font-semibold">$2,481,930</div>
            <svg viewBox="0 0 100 80" preserveAspectRatio="none" className="mt-4 h-[180px] w-full">
              <defs>
                <linearGradient id="fe" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#c6f432" stopOpacity=".35" />
                  <stop offset="1" stopColor="#c6f432" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon points={`0,80 ${line} 100,80`} fill="url(#fe)" />
              <polyline points={line} fill="none" stroke="#c6f432" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              ["Equities", "54%"],
              ["Bonds", "28%"],
              ["Cash", "18%"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="text-[13px] opacity-60">{k}</div>
                <div className="text-[22px] font-semibold">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SaasMock() {
  const cols: [string, string[]][] = [
    ["To do", ["Approve Q3 budget", "Onboard 3 new hires", "Asset audit — Leeds"]],
    ["In progress", ["CRM pipeline revamp", "Shift rota automation"]],
    ["Done", ["KPI dashboard v2", "Invoice reminders", "Role permissions"]],
  ];
  return (
    <div className="flex h-full w-full flex-col gap-6 bg-[#f4f6f1] p-10 font-sans text-[#0b0d0a]">
      <div className="flex items-center justify-between">
        <div className="text-[28px] font-semibold">Team workspace</div>
        <div className="flex -space-x-3">
          {["#7cc046", "#0b0d0a", "#3e7a1e", "#d9dcdf", "#9fd477"].map((c) => (
            <span key={c} className="h-10 w-10 rounded-full border-4 border-[#f4f6f1]" style={{ background: c }} />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          ["Tasks done", "128"],
          ["Hours tracked", "1,942"],
          ["Automations run", "6.4K"],
          ["Deals closed", "£86K"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl bg-white p-5">
            <div className="text-[13px] opacity-50">{k}</div>
            <div className="text-[28px] font-semibold">{v}</div>
          </div>
        ))}
      </div>
      <div className="grid flex-1 grid-cols-3 gap-4">
        {cols.map(([title, cards], ci) => (
          <div key={title} className="flex flex-col gap-3 rounded-2xl bg-white/70 p-4">
            <div className="flex items-center justify-between text-[15px] font-semibold">
              {title}
              <span className="rounded-full bg-black/5 px-2 text-[12px]">{cards.length}</span>
            </div>
            {cards.map((c, i) => (
              <div key={c} className="rounded-xl bg-white p-4 shadow-sm">
                <div className="text-[15px]">{c}</div>
                <div className="mt-3 h-1.5 rounded-full bg-black/5">
                  <div className="h-full rounded-full bg-[#7cc046]" style={{ width: `${ci === 2 ? 100 : 25 + i * 30 + ci * 20}%` }} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectMock({ kind }: { kind: Project["kind"] }) {
  switch (kind) {
    case "erp":
      return <ErpMock />;
    case "app":
      return <AppMock />;
    case "fintech":
      return <FintechMock />;
    default:
      return <SaasMock />;
  }
}
