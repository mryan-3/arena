import { Socket, Server } from 'socket.io';
import { fixtureStore } from '../state/fixture-store';
import { Cue, TimelineEvent } from '../types';

export function registerOperatorHandlers(io: Server, socket: Socket) {
  socket.on('operator:register', () => {
    console.log(`[Operator] Controller joined: ${socket.id}`);
    socket.join('operators');
    socket.emit('operator:fixtures-update', fixtureStore.getAll());
    socket.emit('operator:cues-update', fixtureStore.getCuesState());
    socket.emit('operator:timeline-update', fixtureStore.getTimelineState());
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

  socket.on('operator:save-cue', (cue: Cue) => {
    console.log(`[Operator] Saved cue: ${cue.name} (${cue.id})`);
    fixtureStore.saveCue(cue);
  });

  socket.on('operator:delete-cue', (cueId: string) => {
    console.log(`[Operator] Deleted cue: ${cueId}`);
    fixtureStore.deleteCue(cueId);
  });

  socket.on('operator:trigger-cue', (cueId: string) => {
    console.log(`[Operator] Triggered cue ID: ${cueId}`);
    const cue = fixtureStore.getCuesState().cues.find(c => c.id === cueId);
    if (!cue) return;

    fixtureStore.setActiveCue(cueId);

    const newState = { color: cue.color, brightness: cue.brightness };
    fixtureStore.updateAllStates(newState);
    io.to('fixtures').emit('fixture:cue', newState);
  });

  socket.on('operator:reorder-cues', (cues: Cue[]) => {
    console.log(`[Operator] Reordered cues`);
    fixtureStore.reorderCues(cues);
  });

  socket.on('operator:add-to-timeline', (event: TimelineEvent) => {
    console.log(`[Operator] Added timeline event: Cue ${event.cueId} at ${event.timestampMs}ms`);
    fixtureStore.addTimelineEvent(event);
  });

  socket.on('operator:delete-timeline-event', (eventId: string) => {
    console.log(`[Operator] Deleted timeline event: ${eventId}`);
    fixtureStore.deleteTimelineEvent(eventId);
  });

  socket.on('operator:play-show', () => {
    console.log(`[Operator] Play show`);
    fixtureStore.playShow();
  });

  socket.on('operator:pause-show', () => {
    console.log(`[Operator] Pause show`);
    fixtureStore.pauseShow();
  });

  socket.on('operator:stop-show', () => {
    console.log(`[Operator] Stop show`);
    fixtureStore.stopShow();
  });
}
