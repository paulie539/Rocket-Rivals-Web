export const SITE = {
  name: 'Rocket Rivals',
  url: 'https://rocketrivals.org',
  discordInvite: 'https://discord.gg/bNVBfCfVpY',
  twitchChannel: 'Rocket_Rivals',
  twitchUrl: 'https://www.twitch.tv/rocket_rivals',
  gaMeasurementId: 'G-LV35PJEETF',
};

export type DivisionId = 'titans' | 'legends' | 'challengers';

export interface DivisionConfig {
  id: DivisionId;
  label: string;
  discordInvite: string;
}

// Canonical order used by the stats league filter and the schedule tabs.
export const DIVISIONS: DivisionConfig[] = [
  { id: 'titans', label: 'Titans', discordInvite: 'https://discord.gg/KzV7czKBAk' },
  { id: 'legends', label: 'Legends', discordInvite: 'https://discord.gg/4VsVf5BSQ8' },
  { id: 'challengers', label: 'Challengers', discordInvite: 'https://discord.gg/8M6HYuqaRB' },
];

export function getDivision(id: DivisionId): DivisionConfig {
  const division = DIVISIONS.find((d) => d.id === id);
  if (!division) throw new Error(`Unknown division: ${id}`);
  return division;
}

export type SeasonStageKind = 'span' | 'live' | 'finale';

export interface SeasonStage {
  id: string;
  name: string;
  tag: string;
  kind: SeasonStageKind;
}

// Canonical season roadmap shown on the homepage "Live Streaming & Events"
// timeline, in chronological order.
export const SEASON_TIMELINE: SeasonStage[] = [
  { id: 'split1', name: 'Split 1', tag: 'Regular Season', kind: 'span' },
  { id: 'major1', name: 'Major 1', tag: 'Title Event', kind: 'live' },
  { id: 'split2', name: 'Split 2', tag: 'Regular Season', kind: 'span' },
  { id: 'major2', name: 'Major 2', tag: 'Title Event', kind: 'live' },
  { id: 'allstar', name: 'All Star Games', tag: 'Event', kind: 'live' },
  { id: 'lc', name: 'League Championship', tag: 'Main Event', kind: 'finale' },
];

// Update this as the season moves forward — every stage up to and including
// this one lights up gold on the homepage timeline. Must match a SEASON_TIMELINE id.
export const CURRENT_SEASON_STAGE = 'major1';
