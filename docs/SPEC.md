# KidQuest: Spec

**Screen-free activity ideas in seconds** · #6 of 15 · Wave 1: Daily keepers · Used: Weekly · Easy, content-heavy · Revenue potential: Medium · Family, Pets & Plants · Source: Perplexity

## One-liner

Tell KidQuest your children's ages, how long you've got, indoors or out, and what's in the house, and it suggests activities with simple instructions. Save favourites and plan a week of ideas.

## Problem / audience

- **Who it's for:** Parents and carers of children aged 3–12.
- **The problem it solves:** Bored kids, no plan and 30 minutes. Finding a suitable idea quickly is hard.
- **Example:** A parent with 30 minutes and two bored children gets three indoor ideas using what's in the kitchen.

## MVP features (ship with only these)

1. Filters: age, indoor/outdoor, time, energy, cost, materials
2. Activity cards with simple steps
3. Favourites and 'done today'
4. Weekly activity planner
5. Saved activities available offline

## Not in MVP

- Printable packs
- Seasonal packs: half-term, Christmas, summer
- Rainy-day mode

## Monetisation

| Model | Detail |
|---|---|
| Free | Starter library, with non-personalised ads (the app is for parents) |
| Premium | £24.99/year (shown first) or £3.49/month: full library, printables, offline packs |

Prices are starting points; test before committing. **Portfolio premium promise:** free has ads; the moment you pay you get no ads, cloud backup and storage, and sync across your devices, plus this app's extras.

## Retention: The Progression Loop

| Stage | Design |
|---|---|
| Cue | Weekend and holiday prompts; rainy-day nudge |
| Tiny win | Pick an activity |
| Progress | Activities done, favourites |
| Share | Activity photos (shared by parents) |
| Next step | A new seasonal pack |
| Cadence | Weekly, with holiday peaks |

Follow the portfolio guardrails: no guilt-trip notifications, no fake urgency, progress is
never wiped, at most one notification a day by default.

## Animation and tone: five signature animations

**Playful.** Celebrations, confetti, cute characters, satisfying sounds and mild comic reactions. Nothing tragic.

- Pick an activity: a giant dice rolls across the screen
- Done today: a sticker slaps onto the chart
- Rainy-day mode: a stickman family in raincoats jumps in puddles
- Week planned: a cardboard rocket launches
- Seasonal pack: pumpkins or snowmen roll in


## AI

**None.** Not needed. Plain code does everything this app does. (Portfolio rule: plain code first, code does the maths,
cheapest model, shared budget cap, premium-gated.)

## Platform & data

- **Platform:** Expo app.
- **Data:** On the device only; the library ships as content.
- **Backend:** Content delivery for new activity packs. Premium backup and sync use the shared portfolio backend (see the master repo's HOSTING.md).
- **Stack:** shared portfolio foundation (Expo, PostHog, RevenueCat, AdMob, shared Progression Loop module).

## Growth engine

- **Content pillars:** Rainy-day ideas; Half-term activities; Cheap and free fun
- **Shareable output:** Activity photos (shared by parents)

## Risks

The depth and quality of the library is the real work. Parent-facing only: keep children's data out and ads non-personalised.

## Launch checklist

- [ ] Name checked on the App Store, Play Store and a trademark search
- [ ] MVP features done and tested
- [ ] Progression Loop wired (cue, tiny win, progress, milestone, next step)
- [ ] Privacy policy and terms
- [ ] Landing page
- [ ] Analytics wired (D1/D7/D30 retention)
- [ ] Payments / ads wired
- [ ] Added to the Growth & Maintenance Engine as an app config
