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
