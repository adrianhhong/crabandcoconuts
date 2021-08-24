# Crab & Coconuts

Play online here: http://crabandcoconuts.herokuapp.com/ (Please wait for the Heroku server to start up)

An online adaption of the bluffing based board game called [Skull & Roses](https://boardgamegeek.com/boardgame/92415/skull), but redesigned because `✧ crabs are cool ✧`

## Introduction

Inspired by other online adaptions of popular board games, I went ahead and created my own. Crab & Coconuts involves placing down Skulls (in my version `Crabs`) or Roses (`Coconuts`), and winning points (`Pearls`) by reading your friends' bluffs.
The game uses Socket.IO to allow real-time, bidirectional communication between the server and clients in order to continually update the game state.

The official rules are [here](http://www.skull-and-roses.com/pdf/Skull_rules_Us.pdf).

## Installation

To set it up locally:

```bash
  cd crabandcoconuts
  npm install
  npm run serve:client # on one terminal
  npm run serve:server # on another terminal
```

## Features

- Games for 3-10 players
- Create and join rooms using room codes (multiple games can run concurrently)
- Custom designed icons created by yours truly ⧹(⦁ᴗ⦁)⧸

## Screenshots

<img src="./public/screenshots/1.png " width="500" />
<img src="./public/screenshots/2.png " width="500" />
<img src="./public/screenshots/3.png " width="500" />
<img src="./public/screenshots/4.png " width="500" />
<img src="./public/screenshots/5.png " width="500" />
