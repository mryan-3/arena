import { Socket, Server } from 'socket.io';
import { fixtureStore } from '../state/fixture-store';
import { DeviceInfo } from '../types';

export function registerFixtureHandlers(io: Server, socket: Socket) {
  socket.on('fixture:register', (data: {
    id?: string;
    name: string;
    deviceInfo: DeviceInfo;
  }) => {
    const fixture = fixtureStore.register(socket.id, data);
    console.log(`[Fixture] Registered: "${fixture.name}" (ID: ${fixture.id}, Socket: ${socket.id})`);

    socket.join('fixtures');
    socket.join(`fixture:${fixture.id}`);

    // Confirm registration and push current state
    socket.emit('fixture:registered', { id: fixture.id, state: fixture.state });
    socket.emit('fixture:cue', fixture.state);
  });

  socket.on('disconnect', () => {
    fixtureStore.handleDisconnect(socket.id);
  });
}
