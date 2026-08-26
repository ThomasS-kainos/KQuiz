# K-Quiz (Temp Name) System
K Quiz is a local first quiz app about running local quizes via the network, It is built on Typescript and React. It is idealy meant to be run for quizes inisde of Kainos to prevent the use of paper and make running, hosting and crafting quizes easier for memebers. This is currently a labour of love worked on in my time between tickets and has had Copilot guide me in its creation around design and implementaion.

### Dependencies
For this project to work you must be using **Node 26.x**
You can install Node Here: https://nodejs.org/en/download 

### Setup Guide

** Note the following commands should be run in the root of K-Quiz**

1. Clone the repo into your desired folder like such:
```bash
git clone https://github.com/ThomasS-kainos/KQuiz.git YOUR_NAME_HERE
```
2. Run the node installer
```bash
npm install # This Example uses npm
```
3. Run the current server file with the command:
```
npm run dev
```

### Project Design
This project is exculsively written in typescript and uses React as the rendering package (Sorry Tauri & Wails Devs). It consists of 3 main components that are all tightly intergrated together:
1. Native App (Electron)
    > Imports all server logic and acts as a standard app with the ability to add, edit & host a quiz.
2. Game Server (Express Local Package)
    > Is a local package that uses express to server a clasic web Rest API & Web sockets. This adds the mechanism for clients to join a hosted quiz over the local network.
3. Client Webpage (Vite React app)
    > Is the static webpage that is built into the servers public directory so that the app can be servered when a user wants to join a quiz.

To work within a mono repo the use of NPM workspaces is used so that the server module can be injected into the quiz app and served.

## Issues/ Todo

#### Clients can join midway through a game
> Through an error if the game is already running.

#### API can be modified by any client
> Leave game and other important endpoints currently are modifiable by either non admin or non joined users. They game should have auth protection on admin endpoints and only allow modifications of the teams endpoints by the team themselves.

#### Answer Questions are not currently single use
> Currently users can post multiple answers to the same endpoint, This needs to be locked down to single send unless there is an error.

### When no answer is provided and next show answer is pressed issue
> When the user does not have a answer for a question it holds the client on the page unitl next question is pressed instead of locking in a null answer

### NPM package for server is a nightmare
> Make it easier to clone the repo as it is currently a nightmare to do. NPM packaging for @server is magic
