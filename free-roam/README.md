# Free Roam Package

This package contains the free roam mode for the game. It is a simple mode where the player can move around the map freely and interact with the environment.

## How to use

-  Add the package to your project
-  Copy the assets to the `public` folder of your project
-  Build a wrapper component around the `FreeRoam` component
-  Run `npm run build` to build the package
-  Import the package contents from the `dist` folder

## How it works

![image](https://user-images.githubusercontent.com/71443682/212587522-3ae90416-8d9d-4c8b-ab29-d9884085b20d.png)

-  EventEmitters are used to communicate between the `FreeRoam` component and the wrapper component.
-  The wrapper component is responsible for handling the events and displaying overlays (e.g. the minicon reveal) and the `FreeRoam` component is responsible for the actual game physics while business logic is hanled partly by `FreeRoam` and partly by the server

## Lootbox Strategy

Refer the [this](https://github.com/delta/arcadia-frontend/pull/15)
