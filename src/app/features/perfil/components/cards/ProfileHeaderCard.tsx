import {
  BriefcaseBusiness,
  Clock,
  Flame,
  Pencil,
  Star,
  Trophy,
  UserRound,
} from "lucide-react";
import type { UserProfile } from "../../types/profile";
import { getInitials } from "../../lib/formatting";

type ProfileHeaderCardProps = {
  profile: UserProfile;
};

export function ProfileHeaderCard({ profile }: ProfileHeaderCardProps) {

  return (
    <section className="h-full border border-neutral-1 bg-white shadow-sm">
      <div className="grid h-full grid-cols-1 gap-8 p-7 lg:grid-cols-12">
        <div className="flex items-center gap-8 col-span-5">
          <div className="relative shrink-0">
            {/* <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="h-36 w-36 rounded-full border-4 border-purple-100 object-cover"
            /> */}

            <div className="h-32 w-32 flex rounded-full border-4 border-purple-100 text-center justify-center items-center uppercase text-primary-1 text-4xl font-semibold bg-purple-100 ">
              {getInitials(profile.name)}
            </div>

            {/* <button
              type="button"
              onClick={() => alert("Editar foto")}
              className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm transition hover:bg-neutral-50"
              aria-label="Editar foto"
            >
              <Pencil size={15} />
            </button> */}
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold tracking-tight text-neutral-950">
              {profile.name}
            </h2>

            <p className="mt-3 truncate text-sm font-medium text-purple-700">
              {profile.email}
            </p>

            <div className="mt-6 flex items-center gap-3 text-neutral-600">
              <BriefcaseBusiness size={16} />
              <span className="text-xs">{profile.title}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:col-span-7 lg:grid-cols-4 divide-x">
          <ProfileStat
            icon={<Clock size={16} />}
            label="Horas en oficina"
            value={profile.stats.hoursInOffice.toLocaleString("es-MX")}
          />

          <ProfileStat
            icon={<Flame size={16} />}
            label="Racha actual"
            value={`${profile.stats.streak} días`}
          />

          <ProfileStat
            icon={<UserRound size={16} />}
            label="Amigos"
            value={profile.stats.friendCount}
          />

          <ProfileStat
            icon={<Trophy size={16} />}
            label="Niveles completados"
            value={profile.stats.levelsPassed}
          />
        </div>
      </div>
    </section>
  );
}

type ProfileStatProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
};

function ProfileStat({ icon, label, value }: ProfileStatProps) {
  return (
    <div className="flex min-h-[150px] flex-col items-center  border-neutral-1 px-6">
      <div className="mb-auto flex h-11 w-11 items-center justify-center bg-purple-50 text-purple-700 rounded-full">
        {icon}
      </div>
      <p className="mt-2 text-lg text-center font-semibold tracking-tight text-neutral-950">
        {value}
      </p>
            <p className="text-sm mb-auto text-neutral-500 text-center">{label}</p>

    </div>
  );
}
