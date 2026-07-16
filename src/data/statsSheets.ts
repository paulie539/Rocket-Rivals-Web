import type { DivisionId } from '../site.config';

export interface StatsSheetLink {
  season: string;
  url: string;
}

// Newest season first — this order is what renders on each /stats/<division> page.
export const STATS_SHEETS: Record<DivisionId, StatsSheetLink[]> = {
  titans: [
    { season: 'Season 8', url: 'https://docs.google.com/spreadsheets/d/1S3J0PwsASL1dH5ggkp9aER264nBNF134VIw3ZAqH8Ug/edit?gid=2051195156#gid=2051195156' },
    { season: 'Season 7', url: 'https://docs.google.com/spreadsheets/d/1pvfiSczm9Oe25x9OL9hhB8FcEiZlRHDj7hjEpxSVv7o/edit?gid=839524028#gid=839524028' },
  ],
  legends: [
    { season: 'Season 8', url: 'https://docs.google.com/spreadsheets/d/1VqUrGZkOMeYOPwuf5kpenwpgUq9RaOq3fQlhxAjMu3Q/edit?gid=2051195156#gid=2051195156' },
    { season: 'Season 7', url: 'https://docs.google.com/spreadsheets/d/1PKTHIkg-SzGdHHjcesXzay_ZM3E3jwsm2HM8sWSEshg/edit?gid=839524028#gid=839524028' },
    { season: 'Season 6', url: 'https://docs.google.com/spreadsheets/d/1ChdHRGtzgiHXUTX8W9XefHp9Bf3AkkC_s__NwlivSs4/edit?gid=839524028#gid=839524028' },
    { season: 'Season 5', url: 'https://docs.google.com/spreadsheets/d/1eGy7_gWf4Bksmr2BoKYLau2xLNg0rSKfFvTiPmquUVU/edit?gid=839524028#gid=839524028' },
    { season: 'Season 4', url: 'https://docs.google.com/spreadsheets/d/1pRcQBGikBaS7fz4yCucSH_p6N34RUTKMCytbleojn0U/edit?gid=839524028#gid=839524028' },
  ],
  challengers: [
    { season: 'Season 8', url: 'https://docs.google.com/spreadsheets/d/11Ma9369xpbWUzivr8CYwahte6IVxGcBfAOCCgxj6i9U/edit?gid=2051195156#gid=2051195156' },
    { season: 'Season 7', url: 'https://docs.google.com/spreadsheets/d/1EKOyW0ohNMf5gn_DJot82IiDlmGp8GG5iTrHiK1_eEo/edit?gid=839524028#gid=839524028' },
    { season: 'Season 6', url: 'https://docs.google.com/spreadsheets/d/1NYdscoHv0Xt8VPLLbSDPbh5qO2ALAaz_ugAdqj7hfc0/edit?gid=839524028#gid=839524028' },
    { season: 'Season 5', url: 'https://docs.google.com/spreadsheets/d/1TUJzpfcr6N3DZPB4tPldviRtDi6VRAYnq4IBze6glk0/edit?gid=839524028#gid=839524028' },
    { season: 'Season 4', url: 'https://docs.google.com/spreadsheets/d/1vblUJx895cid3OKNjmz8ex-1PMu8uLNIPmUq5zIJe14/edit?gid=839524028#gid=839524028' },
    { season: 'Season 3', url: 'https://docs.google.com/spreadsheets/d/1DWPji0whH4D59DRMrckpsNtuACYGw-RgCM9GL2DUmuI/edit?gid=1062276367#gid=1062276367' },
    { season: 'Season 2', url: 'https://docs.google.com/spreadsheets/d/1I9DVQSHxa__2qY7OO8l8O-I9Q7le34fGIPgydEl8R5Y/edit?usp=sharing' },
  ],
};
