# Rocket Rivals

Welcome to the official repository for the Rocket Rivals web platform. Rocket Rivals is a premier league dedicated to high-level Rocket League players, built on a foundation of three core pillars:

- **Fun**: An engaging and enjoyable experience for the community
- **Fair**: Transparent, structured leagues and unbiased moderation
- **Competitive**: A community desgined to facilitate elite team-based gameplay and synergy

We have competitive divisions of 3 tiers:

- **Challengers** [ Champion 1 --- Champion 3 ]
- **Legends** [ Grand Champion 1 --- Grand Champion 2 ]
- **Titans** [ Grand Champion 3 --- Supersonic Legend ]

Feel free to join our discord and get to know us if you're interested! https://discord.gg/593WCuF9

## Tech stack

- **[Astro](https://docs.astro.build)**: static site generator powering the site, no UI framework attached
- **[Netlify](https://www.netlify.com/)**: builds and hosts the site from this repo (config in `netlify.toml`)
- **GitHub**: source control and CI trigger for Netlify deploys
- **Google Analytics (GA4)**: site analytics, configured via `src/site.config.ts`

## Development

```sh
npm install
npm run dev       # start local dev server at localhost:4321
npm run build     # build production site to ./dist/
npm run preview   # preview the production build locally
```
