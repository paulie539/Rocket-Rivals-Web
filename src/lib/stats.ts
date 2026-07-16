import { DIVISIONS } from '../site.config';

// Each folder is named "<League> Division Season <N> Statistics" and holds one
// CSV per week (or a "Split N Overall.csv" rollup) exported from ballchasing.com.
// import.meta.glob inlines the file contents at build time, so this doesn't
// depend on the on-disk layout surviving into the compiled output.
const csvModules = import.meta.glob<string>('../data/**/*.csv', {
  query: '?raw',
  import: 'default',
  eager: true,
});
const FOLDER_PATTERN = /\.\.\/data\/(.+) Division Season (\d+) Statistics\//;

const RAW_COLUMNS = {
  playerName: 'player name',
  games: 'games',
  wins: 'wins',
  score: 'score',
  goals: 'goals',
  assists: 'assists',
  saves: 'saves',
  avgSpeedPerGame: 'avg speed per game',
  slowSpeedTime: 'time slow speed',
  boostSpeedTime: 'time boost speed',
  supersonicSpeedTime: 'time supersonic speed',
};

interface PlayerAgg {
  playerName: string;
  games: number;
  wins: number;
  score: number;
  goals: number;
  assists: number;
  saves: number;
  speedWeighted: number; // sum(avg speed per game * games), lets us recombine per-week averages into a season average
  slowTime: number;
  boostTime: number;
  supersonicTime: number;
}

export interface StatGroup {
  season: string;
  league: string;
  rows: string[][];
}

export interface StatGroups {
  groups: StatGroup[];
  seasonOptions: string[];
  leagueOptions: string[];
}

// Display/default order for the league filter, taken from the division config
const LEAGUE_ORDER = DIVISIONS.map((division) => division.label);

function sortLeagues(leagues: string[]): string[] {
  return [...leagues].sort((a, b) => {
    const aIndex = LEAGUE_ORDER.indexOf(a);
    const bIndex = LEAGUE_ORDER.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
}

export function loadStatGroups(): StatGroups {
  // Group the globbed files by their parent folder (one folder == one league+season).
  const filesByFolder = new Map<string, { league: string; season: string; contents: string[] }>();

  for (const [filePath, raw] of Object.entries(csvModules)) {
    const match = filePath.match(FOLDER_PATTERN);
    if (!match) continue;

    const league = match[1].trim();
    const season = `Season ${match[2]}`;
    const folderKey = `${season}||${league}`;

    const folder = filesByFolder.get(folderKey) ?? { league, season, contents: [] };
    folder.contents.push(raw);
    filesByFolder.set(folderKey, folder);
  }

  const seasons = new Set<string>();
  const leagues = new Set<string>();
  const groups: StatGroup[] = [];

  for (const { league, season, contents } of filesByFolder.values()) {
    seasons.add(season);
    leagues.add(league);

    const players = new Map<string, PlayerAgg>();

    for (const csvContent of contents) {
      const raw = csvContent.trim();
      const [headerLine, ...dataLines] = raw.split('\n');
      const headers = headerLine.split(';');
      const col = (name: string) => headers.indexOf(name);

      const idx = {
        playerName: col(RAW_COLUMNS.playerName),
        games: col(RAW_COLUMNS.games),
        wins: col(RAW_COLUMNS.wins),
        score: col(RAW_COLUMNS.score),
        goals: col(RAW_COLUMNS.goals),
        assists: col(RAW_COLUMNS.assists),
        saves: col(RAW_COLUMNS.saves),
        avgSpeedPerGame: col(RAW_COLUMNS.avgSpeedPerGame),
        slowTime: col(RAW_COLUMNS.slowSpeedTime),
        boostTime: col(RAW_COLUMNS.boostSpeedTime),
        supersonicTime: col(RAW_COLUMNS.supersonicSpeedTime),
      };

      for (const line of dataLines) {
        if (!line.trim()) continue;
        const cells = line.split(';');
        const name = cells[idx.playerName]?.trim();
        if (!name) continue;

        const games = parseFloat(cells[idx.games]) || 0;

        const existing = players.get(name) ?? {
          playerName: name,
          games: 0,
          wins: 0,
          score: 0,
          goals: 0,
          assists: 0,
          saves: 0,
          speedWeighted: 0,
          slowTime: 0,
          boostTime: 0,
          supersonicTime: 0,
        };

        existing.games += games;
        existing.wins += parseFloat(cells[idx.wins]) || 0;
        existing.score += parseFloat(cells[idx.score]) || 0;
        existing.goals += parseFloat(cells[idx.goals]) || 0;
        existing.assists += parseFloat(cells[idx.assists]) || 0;
        existing.saves += parseFloat(cells[idx.saves]) || 0;
        existing.speedWeighted += (parseFloat(cells[idx.avgSpeedPerGame]) || 0) * games;
        existing.slowTime += parseFloat(cells[idx.slowTime]) || 0;
        existing.boostTime += parseFloat(cells[idx.boostTime]) || 0;
        existing.supersonicTime += parseFloat(cells[idx.supersonicTime]) || 0;

        players.set(name, existing);
      }
    }

    const rows = Array.from(players.values())
      .sort((a, b) => b.wins - a.wins || a.playerName.localeCompare(b.playerName))
      .map((p) => {
        const winPercentage = p.games > 0 ? (p.wins / p.games) * 100 : 0;
        const avgScore = p.games > 0 ? p.score / p.games : 0;
        const avgGoals = p.games > 0 ? p.goals / p.games : 0;
        const avgAssists = p.games > 0 ? p.assists / p.games : 0;
        const avgSaves = p.games > 0 ? p.saves / p.games : 0;
        const avgSpeed = p.games > 0 ? p.speedWeighted / p.games : 0;
        const totalSpeedTime = p.slowTime + p.boostTime + p.supersonicTime;
        const supersonicPct = totalSpeedTime > 0 ? (p.supersonicTime / totalSpeedTime) * 100 : 0;

        return [
          p.playerName,
          String(p.games),
          String(p.wins),
          winPercentage.toFixed(2),
          avgScore.toFixed(2),
          avgGoals.toFixed(2),
          avgAssists.toFixed(2),
          avgSaves.toFixed(2),
          avgSpeed.toFixed(2),
          supersonicPct.toFixed(2),
        ];
      });

    groups.push({ season, league, rows });
  }

  return {
    groups,
    seasonOptions: Array.from(seasons).sort(),
    leagueOptions: sortLeagues(Array.from(leagues)),
  };
}
