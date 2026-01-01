import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router';
import { Character } from '@/pages/Character';
import { Home } from '@/pages/Home';
import { Kill } from '@/pages/Kill';
import { Guild } from '@/pages/Guild';
import { Search } from '@/pages/Search';
import { SearchGuild } from '@/pages/SearchGuild';
import { PlayerFeudPage } from '@/pages/PlayerFeudPage';
import { GuildFeudPage } from '@/pages/GuildFeudPage';
import { Kills } from '@/pages/Kills';
import { Scenario } from '@/pages/Scenario';
import { Skirmish } from '@/pages/Skirmish';
import { Item } from '@/pages/Item';

import { LoadingStateCentered } from '@/components/shared/LoadingState';

// Loading component
const LoadingSpinner = () => <LoadingStateCentered />;

// Lazy loaded components
const LazyItems = lazy(() => import('@/pages/Items').then(module => ({ default: module.Items })));
const LazyCreatures = lazy(() => import('@/pages/Creatures').then(module => ({ default: module.Creatures })));
const LazyCreature = lazy(() => import('@/pages/Creature').then(module => ({ default: module.Creature })));
const LazyQuests = lazy(() => import('@/pages/Quests').then(module => ({ default: module.Quests })));
const LazyQuest = lazy(() => import('@/pages/Quest').then(module => ({ default: module.Quest })));
const LazyInstanceRuns = lazy(() => import('@/pages/InstanceRuns').then(module => ({ default: module.InstanceRuns })));
const LazyInstanceRun = lazy(() => import('@/pages/InstanceRun').then(module => ({ default: module.InstanceRun })));
const LazyInstances = lazy(() => import('@/pages/Instances').then(module => ({ default: module.Instances })));
const LazyInstanceEncounterRun = lazy(() => import('@/pages/InstanceEncounterRun').then(module => ({ default: module.InstanceEncounterRun })));
const LazyGameObject = lazy(() => import('@/pages/GameObject').then(module => ({ default: module.GameObject })));
const LazyChapter = lazy(() => import('@/pages/Chapter').then(module => ({ default: module.Chapter })));
const LazyChapters = lazy(() => import('@/pages/Chapters').then(module => ({ default: module.Chapters })));
const LazyStorylines = lazy(() => import('@/pages/Storylines').then(module => ({ default: module.Storylines })));
const LazyStoryline = lazy(() => import('@/pages/Storyline').then(module => ({ default: module.Storyline })));
const LazyStorylineEntry = lazy(() => import('@/pages/StorylineEntry').then(module => ({ default: module.StorylineEntry })));
const LazyStorylineActivity = lazy(() => import('@/pages/StorylineActivity').then(module => ({ default: module.StorylineActivity })));
const LazyInstanceStatistics = lazy(() => import('@/pages/InstanceStatistics').then(module => ({ default: module.InstanceStatistics })));
const LazyRankedLeaderboard = lazy(() => import('@/pages/RankedLeaderboard').then(module => ({ default: module.RankedLeaderboard })));
const LazyZoneMap = lazy(() => import('@/pages/ZoneMap').then(module => ({ default: module.ZoneMap })));

export const AppRoutes = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      {/* Core routes - eager loaded */}
      <Route path="/" element={<Home tab="players" />} />
      <Route path="/guilds" element={<Home tab="guilds" />} />
      <Route path="/scenarios" element={<Home tab="scenarios" />} />
      <Route path="/kill/:id" element={<Kill />} />
      <Route path="/kills" element={<Kills />} />
      <Route path="/character/:id" element={<Character tab="kills" />} />
      <Route path="/character/:id/scenarios" element={<Character tab="scenarios" />} />
      <Route path="/character/:id/skirmishes" element={<Character tab="skirmishes" />} />
      <Route path="/character/:id/kills" element={<Character tab="kills" />} />
      <Route path="/character/:id/armory" element={<Character tab="armory" />} />
      <Route path="/character/:playerId1/feud/:playerId2" element={<PlayerFeudPage />} />
      <Route path="/guild/:id" element={<Guild tab="kills" />} />
      <Route path="/guild/:id/members" element={<Guild tab="members" />} />
      <Route path="/guild/:id/scenarios" element={<Guild tab="scenarios" />} />
      <Route path="/guild/:id/skirmishes" element={<Guild tab="skirmishes" />} />
      <Route path="/guild/:guildId1/feud/:guildId2" element={<GuildFeudPage />} />
      <Route path="/search/:query" element={<Search />} />
      <Route path="/search/guild/:query" element={<SearchGuild />} />
      <Route path="/scenario/:id" element={<Scenario tab="scoreboard" />} />
      <Route path="/scenario/:id/kills" element={<Scenario tab="kills" />} />
      <Route path="/scenario/:id/skirmishes" element={<Scenario tab="skirmishes" />} />
      <Route path="/scenario/:id/map" element={<Scenario tab="map" />} />
      <Route path="/skirmishes" element={<Home tab="skirmishes" />} />
      <Route path="/skirmish/:id" element={<Skirmish tab="scoreboard" />} />
      <Route path="/skirmish/:id/kills" element={<Skirmish tab="kills" />} />
      <Route path="/skirmish/:id/damage/:characterId" element={<Skirmish tab="characterDamage" />} />
      <Route path="/skirmish/:id/damage" element={<Skirmish tab="damage" />} />
      <Route path="/item/:id" element={<Item tab="vendors" />} />
      <Route path="/item/:id/purchase" element={<Item tab="purchase" />} />
      <Route path="/item/:id/quests" element={<Item tab="quests" />} />

      {/* Lazy loaded routes */}
      <Route path="/items" element={<LazyItems />} />
      <Route path="/creatures" element={<LazyCreatures />} />
      <Route path="/creature/:id" element={<LazyCreature />} />
      <Route path="/creature/:id/quests" element={<LazyCreature tab="quests" />} />
      <Route path="/creature/:id/vendorItems" element={<LazyCreature tab="vendorItems" />} />
      <Route path="/creature/:id/zone/:zoneId" element={<LazyCreature />} />
      <Route path="/gameobject/:id" element={<LazyGameObject />} />
      <Route path="/quests" element={<LazyQuests />} />
      <Route path="/quest/:id" element={<LazyQuest />} />
      <Route path="/instance-runs" element={<LazyInstanceRuns />} />
      <Route path="/instance-run/:id" element={<LazyInstanceRun />} />
      <Route path="/instance-run/:instanceRunId/:id" element={<LazyInstanceEncounterRun />} />
      <Route path="/instances" element={<LazyInstances />} />
      <Route path="/instance-statistics/:id" element={<LazyInstanceStatistics />} />
      <Route path="/chapters" element={<LazyChapters />} />
      <Route path="/chapter/:id" element={<LazyChapter />} />
      <Route path="/storylines" element={<LazyStorylines />} />
      <Route path="/storylines/:id" element={<LazyStoryline />} />
      <Route path="/storylines/:storylineId/:id" element={<LazyStorylineEntry />} />
      <Route path="/storylines/:storylineId/:storylineEntryId/:id" element={<LazyStorylineActivity />} />
      <Route path="/ranked-leaderboard" element={<LazyRankedLeaderboard />} />
      <Route path="/zone_heatmap/:id" element={<LazyZoneMap />} />
    </Routes>
  </Suspense>
);
