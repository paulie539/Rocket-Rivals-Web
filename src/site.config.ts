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

export type SeasonStageKind = 'span' | 'live' | 'finale' | 'group';

export interface SeasonStage {
  id: string;
  name: string;
  tag: string;
  kind: SeasonStageKind;
  // Date the timeline flips this stage to "active". Intentionally set to
  // the END of the previous stage (not this stage's real start) so the
  // site updates ahead of a short buffer/gap before the event actually
  // begins. Drives season_timeline.js — do not use this for display.
  startDate: string;
  // The event's real, calendar-accurate start/end dates. Shown to visitors
  // (e.g. tooltips) who need to know the actual event window.
  actualDate: string;
  actualEndDate: string;
}

// Canonical season roadmap shown on the homepage "Live Streaming & Events"
// timeline, in chronological order.
export const SEASON_TIMELINE: SeasonStage[] = [
  { id: 'split1', name: 'Split 1', tag: 'Regular Season', kind: 'span', startDate: '2026-07-25', actualDate: '2026-07-25', actualEndDate: '2026-08-16' },
  { id: 'major1', name: 'Major 1', tag: 'Title Event', kind: 'live', startDate: '2026-08-17', actualDate: '2026-08-22', actualEndDate: '2026-08-30' },
  { id: 'split2', name: 'Split 2', tag: 'Regular Season', kind: 'span', startDate: '2026-08-31', actualDate: '2026-09-05', actualEndDate: '2026-10-04' },
  { id: 'major2', name: 'Major 2', tag: 'Title Event', kind: 'live', startDate: '2026-10-05', actualDate: '2026-10-10', actualEndDate: '2026-10-18' },
  { id: 'groupstage', name: 'Group Stage', tag: 'Playoffs', kind: 'group', startDate: '2026-10-19', actualDate: '2026-10-24', actualEndDate: '2026-11-08' },
  { id: 'lc', name: 'League Championship', tag: 'Main Event', kind: 'finale', startDate: '2026-11-09', actualDate: '2026-11-14', actualEndDate: '2026-11-22' },
];



