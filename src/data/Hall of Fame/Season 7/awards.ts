import type { AwardEntry } from '../types';

// Season 7 Hall of Fame results once they're finalized.
export const AWARDS: AwardEntry[] = [
  // Challengers
  { award: 'MVP', playerName: 'Chief', team: 'Voidborn', allstar: true, division: 'challengers' },
  { award: 'Offensive Player', playerName: 'RWDT_Draco', team: 'Agni Kai Gaming', allstar: true, division: 'challengers' },
  { award: 'Defensive Player', playerName: 'Skeddyz', team: '', allstar: false, division: 'challengers' },

  // Legends
  { award: 'MVP', playerName: 'RaunchyRomanian', team: 'Necro Bloodlust', allstar: true, division: 'legends' },
  { award: 'Offensive Player', playerName: 'ResilientFury', team: 'Twisted Fates', allstar: true, division: 'legends' },
  { award: 'Defensive Player', playerName: 'Cokilla', team: 'Black Jackets', allstar: false, division: 'legends' },

  // Titans
  { award: 'MVP', playerName: 'LEUMYY', team: 'Team Necro', allstar: true, division: 'titans' },
  { award: 'Offensive Player', playerName: 'LEUMYY', team: 'Team Necro', allstar: true, division: 'titans' },
  { award: 'Defensive Player', playerName: 'Luminati', team: 'Sync Esports', allstar: false, division: 'titans' },
];

export const MINOR_AWARDS: AwardEntry[] = [
  // Challengers
  { award: 'Assisting Player', playerName: 'Shy Axolotl', team: 'Agni Kai Gaming', allstar: false, division: 'challengers' },
  { award: 'Rookie of the Season', playerName: 'Chief', team: 'Voidborn', allstar: true, division: 'challengers' },
  { award: 'Most Improved Player', playerName: 'T E A', team: 'Ice Titans', allstar: false, division: 'challengers' },

  // Legends
  { award: 'Assisting Player', playerName: 's0xxqt', team: 'Boost Stealers', allstar: false, division: 'legends' },
  { award: 'Rookie of the Season', playerName: 'RaunchyRomanian', team: 'Necro Bloodlust', allstar: true, division: 'legends' },
  { award: 'Most Improved Player', playerName: 'ResilientFury', team: 'Twisted Fates', allstar: true, division: 'legends' },

  // Titans
  { award: 'Assisting Player', playerName: 'Dorca', team: 'Team Solis', allstar: false, division: 'titans' },
  { award: 'Rookie of the Season', playerName: 'LEUMYY', team: 'Team Necro', allstar: true, division: 'titans' },
  { award: 'Most Improved Player', playerName: 'ghosty', team: 'Team Necro', allstar: true, division: 'titans' },
];
