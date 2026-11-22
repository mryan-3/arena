is a personal live-event control system that allows users to turn everyday devices (phones, tablets, laptops, LED devices) into synchronized lighting fixtures.

A user can create a "show", connect devices by scanning a QR code, design lighting cues, and trigger synchronized effects with music.

The goal is to recreate the fundamentals of professional live event production:

Lighting consoles
Fixtures
Cue lists
Timelines
Music synchronization
Show playback

in a small, accessible environment.

Vision

To let anyone experience how concerts, wrestling entrances, and live events are controlled by building a miniature version using devices they already own.

A user should feel:

"I am running my own arena show."

Problem

Professional live shows rely on complex systems that are difficult to understand without access to expensive equipment.

People can see the final result but cannot easily experiment with:

lighting cues
synchronization
timing
show programming

This project creates a simplified playground for learning those concepts.

Core Concept

A connected device becomes a "fixture."

Example:

Your phone:

Phone #1
Bedroom Light

Status:
Connected

Current:
Blue
Brightness:
80%

The main controller can tell it:

Change to red
Fade in
Flash
Follow a sequence

Main User Flow
1. Create a Show

User opens dashboard.

Clicks:

+ New Show

Creates:

My Wrestling Entrance
2. Connect Devices

Dashboard shows:

Connect Fixture

[ QR CODE ]

Scan with your phone

Phone opens:

You are connected!

Fixture:
iPhone Bedroom

Ready

Dashboard updates:

Connected Fixtures

✓ iPhone Bedroom
✓ iPad Living Room
✓ Laptop Screen
3. Create a Cue

User creates:

Cue:
Blue Entrance

Settings:

Color:
Blue

Brightness:
100%

Duration:
5 seconds

Preview:

The devices turn blue.

4. Build a Show

User creates a sequence:

00:00
Blackout

00:05
Blue Entrance

00:10
Flash

00:15
Red Chase
5. Play Show

User presses:

▶ PLAY SHOW

Everything runs together.

Product Phases

The product should be built in small, satisfying milestones.

Phase 1 — "First Light"
Goal

Make one phone respond.

Features
Open phone page
Change screen color
Dashboard button controls phone
User Experience

Dashboard:

Turn Blue

Phone:

Screen turns blue.

Phase 2 — "The Network"
Goal

Connect multiple devices.

Features
QR joining
Device names
Online status
User Experience

Scan QR:

Phone joins.

Dashboard:

3 Fixtures Connected

Phase 3 — "The Lighting Console"
Goal

Create reusable cues.

Features
Save lighting scenes
Cue list
Play next cue

Example:

Cue list:

1. Blackout
2. Blue Entrance
3. White Flash
4. Red Finish

Phase 4 — "The Show Timeline"
Goal

Control a full sequence.

Features
Timeline editor
Cue timing
Automatic playback

Example:

0 sec:
Blackout

5 sec:
Blue

10 sec:
Flash

15 sec:
Red

Phase 5 — "Music Sync"
Goal

Make it feel like a real concert.

Features
Upload song
Create markers
Sync cues

Example:

Song:

0:00
Lights off

0:15
Beat drop

Lights flash

0:30
Chorus

Full color change

Phase 6 — "Effects Engine"
Goal

Add production-style effects.

Add:

Pulses
Waves
Chases
Strobes
Random patterns

Example:

Chase:

Phone 1
↓
Phone 2
↓
Phone 3
↓
Phone 4
Demo

Phones behave like arena lights.