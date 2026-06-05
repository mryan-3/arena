import { Fixture, FixtureState, DeviceInfo, Cue } from '../types';
import { Server } from 'socket.io';

export class FixtureStore {
  private fixtures: Record<string, Fixture> = {};
  private disconnectTimeouts: Record<string, NodeJS.Timeout> = {};
  private io: Server | null = null;
  private readonly gracePeriodMs = 30000; // 30 seconds

  // Cue Management State
  private cues: Cue[] = [];
  private activeCueId: string | null = null;

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
}

// Export singleton instance
export const fixtureStore = new FixtureStore();
