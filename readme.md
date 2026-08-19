# Quiz Server System
This is a little demo project to learn about websockets and data management with express. This is part of a wider idea for a localy managed quiz app over the local network.

### Dependencies
For this project to work you must be using **Node 26.x**

### Setup Guide
1. Clone the repo into your desired folder like such:
```bash
git clone https://github.com/ThomasS-kainos/KQuiz.git YOUR_NAME_HERE
```
2. Run the node installer
```bash
# This Example uses npm
npm install
```
3. Run the current server file with the command:
```
npm run dev
```

## Design
The overall plan realting to the system design of this subcomponent is as such:

TODO FINISH LATER

### API
The API is built using express with typescript. All routes are defined in the `src/routes` folder of the project, and registered in the `src/server.ts` 

### Websockets
Websockets are used in this project to inform the clients of state changes, There is a defenition file of what types of messages that you can use (here)[./src/websocket/message.ts]

## Issues/ Todo
#### Leaderboard to next question
> Currently when the user is on the leaderboard there is no javascript that can be used to tell the client where to go. This could be solved via a gloabl router that redirects based on the webscoket message.

#### Clients can join midway through a game
> Through an error if the game is already running.

#### API can be modified by any client
> Leave game and other important endpoints currently are modifiable by either non admin or non joined users. They game should have auth protection on admin endpoints and only allow modifications of the teams endpoints by the team themselves.

#### Answer Questions are not currently single use
> Currently users can post multiple answers to the same endpoint, This needs to be locked down to single send unless there is an error.

#### Test what happens with no answers
> Just test the outcome of what happens if no answer is provided.

#### Add Vite React Frontend
> Implent a sub project that allows for vite to be used and served as the static webpage rather than Raw HTML.

#### Add Loading/ idle sections
> Add loading/ idle pages eg, when you have submitted an answer, waiting in the lobby etc
