import type { UserProfile } from "../../types/profile";

type ProgressSummaryCardProps = {
  profile: UserProfile;
};

type Rank = {
  name: string;
  minPoints: number;
  maxPoints: number | null;
  shortName: string;
  subtitle: string;
  cardClass: string;
  badgeClass: string;
  textClass: string;
  progressClass: string;
};

const RANKS: Rank[] = [
  {
    name: "Hierro",
    minPoints: 0,
    maxPoints: 499,
    shortName: "I",
    subtitle: "Rango inicial",
    cardClass: "border-stone-300 bg-gradient-to-br from-stone-100 to-neutral-50",
    badgeClass: "bg-stone-700 text-white shadow-stone-300",
    textClass: "text-stone-700",
    progressClass: "bg-stone-700",
  },
  {
    name: "Bronce",
    minPoints: 500,
    maxPoints: 999,
    shortName: "B",
    subtitle: "Buen avance",
    cardClass: "border-orange-300 bg-gradient-to-br from-orange-100 to-amber-50",
    badgeClass: "bg-orange-700 text-white shadow-orange-300",
    textClass: "text-orange-700",
    progressClass: "bg-orange-700",
  },
  {
    name: "Plata",
    minPoints: 1000,
    maxPoints: 1999,
    shortName: "P",
    subtitle: "Jugador constante",
    cardClass: "border-slate-300 bg-gradient-to-br from-slate-100 to-white",
    badgeClass: "bg-slate-600 text-white shadow-slate-300",
    textClass: "text-slate-700",
    progressClass: "bg-slate-600",
  },
  {
    name: "Oro",
    minPoints: 2000,
    maxPoints: 3499,
    shortName: "O",
    subtitle: "Muy buen nivel",
    cardClass: "border-yellow-300 bg-gradient-to-br from-yellow-100 to-amber-50",
    badgeClass: "bg-yellow-600 text-white shadow-yellow-300",
    textClass: "text-yellow-700",
    progressClass: "bg-yellow-600",
  },
  {
    name: "Platino",
    minPoints: 3500,
    maxPoints: 5499,
    shortName: "PL",
    subtitle: "Nivel avanzado",
    cardClass: "border-cyan-300 bg-gradient-to-br from-cyan-100 to-teal-50",
    badgeClass: "bg-cyan-700 text-white shadow-cyan-300",
    textClass: "text-cyan-700",
    progressClass: "bg-cyan-700",
  },
  {
    name: "Diamante",
    minPoints: 5500,
    maxPoints: 7999,
    shortName: "D",
    subtitle: "Alto rendimiento",
    cardClass: "border-blue-300 bg-gradient-to-br from-blue-100 to-indigo-50",
    badgeClass: "bg-blue-700 text-white shadow-blue-300",
    textClass: "text-blue-700",
    progressClass: "bg-blue-700",
  },
  {
    name: "Maestro",
    minPoints: 8000,
    maxPoints: 11999,
    shortName: "M",
    subtitle: "Dominio total",
    cardClass: "border-purple-300 bg-gradient-to-br from-purple-100 to-fuchsia-50",
    badgeClass: "bg-purple-700 text-white shadow-purple-300",
    textClass: "text-purple-700",
    progressClass: "bg-purple-700",
  },
  {
    name: "Retador",
    minPoints: 12000,
    maxPoints: null,
    shortName: "R",
    subtitle: "Elite",
    cardClass: "border-rose-300 bg-gradient-to-br from-rose-100 to-amber-50",
    badgeClass: "bg-rose-700 text-white shadow-rose-300",
    textClass: "text-rose-700",
    progressClass: "bg-rose-700",
  },
];

function getRankByPoints(points: number) {
  const rank =
    RANKS.find((rank) => {
      const isAboveMin = points >= rank.minPoints;
      const isBelowMax = rank.maxPoints === null || points <= rank.maxPoints;

      return isAboveMin && isBelowMax;
    }) ?? RANKS[0];

  const rankIndex = RANKS.findIndex((item) => item.name === rank.name);
  const nextRank = RANKS[rankIndex + 1] ?? null;

  const progressToNextRank = nextRank
    ? Math.min(
        100,
        Math.round(
          ((points - rank.minPoints) / (nextRank.minPoints - rank.minPoints)) *
            100,
        ),
      )
    : 100;

  return {
    rank,
    nextRank,
    progressToNextRank,
  };
}

export function ProgressSummaryCard({ profile }: ProgressSummaryCardProps) {
  const points = profile.stats.ap;
  const { rank, nextRank, progressToNextRank } = getRankByPoints(points);

  return (
    <section
      className={`h-full border p-6 shadow-sm transition-colors ${rank.cardClass}`}
    >
      <div className="flex items-center gap-5">
        <div
          className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl text-2xl font-black shadow-lg ${rank.badgeClass}`}
        >
          {rank.shortName}
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={`text-sm font-bold uppercase tracking-[0.2em] ${rank.textClass}`}
          >
            {rank.subtitle}
          </p>

          <div className="mt-1 flex flex-wrap items-end gap-x-3 gap-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-950">
              {rank.name}
            </h2>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between gap-4 text-xs font-medium text-neutral-600">
          <span>{points.toLocaleString()} pts</span>

          <span>{progressToNextRank}%</span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-white/80 shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-500 ${rank.progressClass}`}
            style={{ width: `${progressToNextRank}%` }}
          />
        </div>

        <div className="mt-2 flex justify-end text-xs text-neutral-500">
          {nextRank ? (
            <span>
              Próximo:{" "}
              <strong className="font-semibold text-neutral-700">
                {nextRank.name}
              </strong>{" "}
              a {nextRank.minPoints.toLocaleString()} pts
            </span>
          ) : (
            <span className="font-semibold text-neutral-700">
              Rango máximo
            </span>
          )}
        </div>
      </div>
    </section>
  );
}