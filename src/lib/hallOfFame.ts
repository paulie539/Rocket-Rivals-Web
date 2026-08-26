import type { AwardEntry } from '../data/Hall of Fame/types';

export interface SeasonAwards {
  season: string;
  seasonNumber: number;
  awards: AwardEntry[];
  minorAwards: AwardEntry[];
}

interface SeasonModule {
  AWARDS: AwardEntry[];
  MINOR_AWARDS: AwardEntry[];
}

// Auto-discovers every `Hall of Fame/Season <n>/awards.ts` file, so a new
// season shows up on the About page (newest first) just by adding its file —
// no other code changes needed.
const seasonModules = import.meta.glob<SeasonModule>('../data/Hall of Fame/Season */awards.ts', { eager: true });

function seasonNumberFromPath(path: string): number {
  const match = path.match(/Season (\d+)/);
  return match ? Number(match[1]) : 0;
}

export const HALL_OF_FAME_SEASONS: SeasonAwards[] = Object.entries(seasonModules)
  .map(([path, mod]) => {
    const seasonNumber = seasonNumberFromPath(path);
    return {
      season: `Season ${seasonNumber}`,
      seasonNumber,
      awards: mod.AWARDS,
      minorAwards: mod.MINOR_AWARDS,
    };
  })
  .sort((a, b) => b.seasonNumber - a.seasonNumber);
