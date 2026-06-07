import { Fixture, FixtureState, DeviceInfo, Cue, TimelineEvent, PlaybackState } from '../types';
import { Server } from 'socket.io';

export class FixtureStore {
  private fixtures: Record<string, Fixture> = {};
  private disconnectTimeouts: Record<string, NodeJS.Timeout> = {};
  private io: Server | null = null;
  private readonly gracePeriodMs = 30000; // 30 seconds

  // Cue Management State
  private cues: Cue[] = [];
  private activeCueId: string | null = null;

  // Timeline State
  private timelineEvents: TimelineEvent[] = [];
  private playbackState: PlaybackState = { isPlaying: false, currentTimeMs: 0, startTime: null };
  private playbackInterval: NodeJS.Timeout | null = null;
  private nextTimelineEventIndex: number = 0;

  public setIo(io: Server) {
    this.io = io;
  }

  private broadcastToOperators() {
    if (this.io) {
      this.io.to('operators').emit('operator:fixtures-update', this.getAll());
    }
  }

  private broadcastCuesToOperators() {
    if (this.io) {
      this.io.to('operators').emit('operator:cues-update', {
        cues: this.cues,
        activeCueId: this.activeCueId,
      });
    }
  }

  private broadcastTimelineToOperators() {
    if (this.io) {
      this.io.to('operators').emit('operator:timeline-update', {
        events: this.timelineEvents,
        playback: this.playbackState,
      });
    }
  }

  public register(
    socketId: string,
    data: { id?: string; name: string; deviceInfo: DeviceInfo }
  ): Fixture {
    const fixtureId = data.id || `fixture_${Math.random().toString(36).substring(2, 11)}`;

    // Clear any pending cleanup timeout
    if (this.disconnectTimeouts[fixtureId]) {
      clearTimeout(this.disconnectTimeouts[fixtureId]);
      delete this.disconnectTimeouts[fixtureId];
    }

    const existing = this.fixtures[fixtureId];
    const updatedState = existing?.state || { color: '#ffffff', brightness: 100 };

    this.fixtures[fixtureId] = {
      id: fixtureId,
      name: data.name,
      socketId,
      status: 'online',
      state: updatedState,
      deviceInfo: data.deviceInfo,
      lastConnected: Date.now(),
    };

    this.broadcastToOperators();
    return this.fixtures[fixtureId];
  }

  public handleDisconnect(socketId: string): void {
    const fixtureId = Object.keys(this.fixtures).find(
      (id) => this.fixtures[id].socketId === socketId
    );

    if (!fixtureId) return;

    this.fixtures[fixtureId].status = 'offline';
    this.fixtures[fixtureId].socketId = null;
    this.broadcastToOperators();
    console.log(`[Store] Fixture "${this.fixtures[fixtureId].name}" went offline (grace period started)`);

    // Start cleanup grace period
    this.disconnectTimeouts[fixtureId] = setTimeout(() => {
      console.log(`[Store] Fixture "${fixtureId}" permanently removed (grace period ended)`);
      delete this.fixtures[fixtureId];
      delete this.disconnectTimeouts[fixtureId];
      this.broadcastToOperators();
    }, this.gracePeriodMs);
  }

  public updateAllStates(state: FixtureState): void {
    Object.keys(this.fixtures).forEach((id) => {
      if (this.fixtures[id].status === 'online') {
        this.fixtures[id].state = { ...state };
      }
    });
    this.broadcastToOperators();
  }

  public getAll(): Fixture[] {
    return Object.values(this.fixtures);
  }

  public get(id: string): Fixture | undefined {
    return this.fixtures[id];
  }

  // --- Cue Management ---

  public getCuesState() {
    return { cues: this.cues, activeCueId: this.activeCueId };
  }

  public saveCue(cue: Cue): void {
    const existingIndex = this.cues.findIndex((c) => c.id === cue.id);
    if (existingIndex >= 0) {
      this.cues[existingIndex] = cue;
    } else {
      this.cues.push(cue);
    }
    this.broadcastCuesToOperators();
  }

  public deleteCue(cueId: string): void {
    this.cues = this.cues.filter((c) => c.id !== cueId);
    if (this.activeCueId === cueId) {
      this.activeCueId = null;
    }
    this.broadcastCuesToOperators();
  }

  public setActiveCue(cueId: string | null): void {
    this.activeCueId = cueId;
    this.broadcastCuesToOperators();
  }

  public reorderCues(newCues: Cue[]): void {
    this.cues = newCues;
    this.broadcastCuesToOperators();
  }

  // --- Timeline Management ---

  public getTimelineState() {
    return { events: this.timelineEvents, playback: this.playbackState };
  }

  public addTimelineEvent(event: TimelineEvent): void {
    this.timelineEvents.push(event);
    this.timelineEvents.sort((a, b) => a.timestampMs - b.timestampMs);
    this.broadcastTimelineToOperators();
  }

  public deleteTimelineEvent(eventId: string): void {
    this.timelineEvents = this.timelineEvents.filter((e) => e.id !== eventId);
    this.broadcastTimelineToOperators();
  }

  public playShow(): void {
    if (this.playbackState.isPlaying) return;

    this.playbackState.isPlaying = true;
    this.playbackState.startTime = Date.now() - this.playbackState.currentTimeMs;
    this.nextTimelineEventIndex = this.timelineEvents.findIndex(e => e.timestampMs >= this.playbackState.currentTimeMs);
    if (this.nextTimelineEventIndex === -1) this.nextTimelineEventIndex = this.timelineEvents.length;

    this.broadcastTimelineToOperators();

    this.playbackInterval = setInterval(() => {
      if (!this.playbackState.startTime) return;
      this.playbackState.currentTimeMs = Date.now() - this.playbackState.startTime;

      // Check for cues to trigger
      while (
        this.nextTimelineEventIndex < this.timelineEvents.length &&
        this.playbackState.currentTimeMs >= this.timelineEvents[this.nextTimelineEventIndex].timestampMs
      ) {
        const event = this.timelineEvents[this.nextTimelineEventIndex];
        const cue = this.cues.find(c => c.id === event.cueId);
        if (cue) {
          this.setActiveCue(cue.id);
          const newState = { color: cue.color, brightness: cue.brightness };
          this.updateAllStates(newState);
          if (this.io) this.io.to('fixtures').emit('fixture:cue', newState);
        }
        this.nextTimelineEventIndex++;
      }

      // Broadcast clock updates roughly every 100ms
      this.broadcastTimelineToOperators();
    }, 100);
  }

  public pauseShow(): void {
    if (!this.playbackState.isPlaying) return;
    this.playbackState.isPlaying = false;
    this.playbackState.startTime = null;
    if (this.playbackInterval) clearInterval(this.playbackInterval);
    this.broadcastTimelineToOperators();
  }

  public stopShow(): void {
    this.playbackState.isPlaying = false;
    this.playbackState.currentTimeMs = 0;
    this.playbackState.startTime = null;
    this.nextTimelineEventIndex = 0;
    if (this.playbackInterval) clearInterval(this.playbackInterval);
    this.broadcastTimelineToOperators();
  }
}

// Export singleton instance
export const fixtureStore = new FixtureStore();
