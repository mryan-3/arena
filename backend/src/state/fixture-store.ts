import { Fixture, FixtureState, DeviceInfo } from '../types';
import { Server } from 'socket.io';

export class FixtureStore {
  private fixtures: Record<string, Fixture> = {};
  private disconnectTimeouts: Record<string, NodeJS.Timeout> = {};
  private io: Server | null = null;
  private readonly gracePeriodMs = 30000; // 30 seconds

  public setIo(io: Server) {
    this.io = io;
  }

  private broadcastToOperators() {
    if (this.io) {
      this.io.to('operators').emit('operator:fixtures-update', this.getAll());
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
}

// Export singleton instance
export const fixtureStore = new FixtureStore();
