export interface FixtureState {
  color: string;
  brightness: number; // 0 to 100
  effect?: string;
}

export interface DeviceInfo {
  width: number;
  height: number;
  userAgent: string;
}

export interface Fixture {
  id: string;
  name: string;
  socketId: string | null;
  status: 'online' | 'offline';
  state: FixtureState;
  deviceInfo: DeviceInfo;
  lastConnected: number;
}

export interface Cue {
  id: string;
  name: string;
  color: string;
  brightness: number;
  duration: number; // in seconds
}
