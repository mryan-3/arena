import { Socket, Server } from 'socket.io';
import { fixtureStore } from '../state/fixture-store';

export function registerOperatorHandlers(io: Server, socket: Socket) {
  socket.on('operator:register', () => {
    console.log(`[Operator] Controller joined: ${socket.id}`);
    socket.join('operators');
    socket.emit('operator:fixtures-update', fixtureStore.getAll());
  });

  socket.on('operator:trigger-color', (data: { color: string; brightness?: number }) => {
    const brightness = data.brightness ?? 100;
    const newState = { color: data.color, brightness };
    
    console.log(`[Operator] Triggered color: ${data.color} at ${brightness}% brightness`);

    // Update state of all active fixtures
    fixtureStore.updateAllStates(newState);

    // Broadcast lighting cue to all online fixtures
    io.to('fixtures').emit('fixture:cue', newState);
  });
}
