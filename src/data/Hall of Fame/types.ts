export interface AwardEntry {
  award: string;
  playerName: string;
  team: string;
  allstar: boolean;
  division: 'challengers' | 'legends' | 'titans';
}
