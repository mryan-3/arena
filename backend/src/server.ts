import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { fixtureStore } from './state/fixture-store';
import { registerFixtureHandlers } from './sockets/fixture-handler';
import { registerOperatorHandlers } from './sockets/operator-handler';

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Provide the Socket.IO server to the store for status broadcasts
fixtureStore.setIo(io);

io.on('connection', (socket: Socket) => {
  console.log(`Socket connected: ${socket.id}`);
  
  registerFixtureHandlers(io, socket);
  registerOperatorHandlers(io, socket);

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    fixturesCount: fixtureStore.getAll().length
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Arena Show-Control Server listening on port ${PORT}`);
});
