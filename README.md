# Rubik’s Cube Beginner Walkthrough and Helper 

> My **first ever programming project**, originally started as my **CS50x Final Project** – an attempt to build an interactive Rubik’s Cube tutorial for complete beginners.

## Introduction

This project was originally created as an **interactive Rubik’s Cube learning platform** that would teach users:

* What **centers, edges, and corners** are
* Basic **cube notation** (`R`, `U`, `F`, etc.)
* The **beginner’s method** for solving a 3×3 cube step by step

The goal was not just to simulate a cube, but to create a **guided walkthrough for people who had never solved a Rubik’s Cube before**.

---

## Current Status

⚠️ **This project is unfinished.**

I completed most of the **algorithmic and functional parts** of the project, including:

* Accurate cube state tracking
* Face rotation algorithms
* Move notation parsing
* Animated move execution
* Scramble generation
* Piece highlighting
* Touch/mouse interaction
* Basic tutorial lesson logic

However, the **frontend UI/UX and educational presentation layer were never completed**. The project reached a point where the cube engine worked, but the interface needed to turn it into a polished beginner-friendly learning experience was still missing.

I decided to pause the project and move on to newer projects, but I’m keeping this repository public as a record of my first major programming attempt and the learning process behind it.

---

## Features Implemented

### Cube Engine

* 3×3 Rubik’s Cube representation
* Correct cubie permutation tracking
* Layer rotations with animation
* Support for standard WCA notation

### Move Support

* Face turns (`R U F L D B`)
* Prime moves (`R'`)
* Double turns (`R2`)
* Slice moves (`M E S`)
* Wide moves (`r u f`)
* Whole cube rotations (`x y z`)

### Interaction

* Mouse and touch dragging
* Raycasting on visible stickers
* Gesture-based move detection
* Orbit camera controls

### Tutorial System (Partial)

* Lesson navigation
* Piece highlighting
* Instruction text rendering
* Step-by-step move demonstrations

---

## What Is Missing

The following parts are incomplete:

* Final UI design
* Responsive educational layout
* Complete beginner lesson flow
* Progress tracking
* Polished animations/transitions
* Accessibility improvements
* Full guided solve experience

---

## Tech Stack

* **JavaScript (ES6)**
* **Three.js** – 3D rendering
* **Vite** – Development/build tool
* **@tweenjs/tween.js** – Animation
* **HTML/CSS**

---

## Project Structure

```text
rubiks-cube/
├── src/
│   ├── RubiksCube.js      # Core cube engine
│   ├── World.js           # Three.js scene setup
│   └── Utils.js           # Notation and helper functions
├── playground/            # Interactive cube playground
├── beginner/              # Beginner tutorial mode (unfinished)
├── main.js                # Main demo entry
├── index.html
└── style.css
```

---

## Installation

### Prerequisites

* Node.js (v18+ recommended)
* npm

### Clone the repository

```bash
git clone https://github.com/Vish2503/rubiks-cube.git
cd rubiks-cube
```

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open the local URL shown in the terminal (usually `http://localhost:5173`).

### Build for production

```bash
npm run build
```

---

## Available Modes

### Main Demo

Shows an animated cube demonstration and algorithm playback.

### Playground

Allows free interaction with the cube using mouse or touch gestures.

### Beginner Mode

Contains the unfinished tutorial system and lesson navigation logic.

---

## References

This project was built while learning Three.js, cube notation systems, and Rubik’s Cube algorithms from the following resources.

### Three.js & 3D Graphics

* **Three.js Journey** — https://threejs-journey.com/lessons/introduction
* **Three.js Official Documentation** — https://threejs.org/docs/index.html#manual/introduction/Creating-a-scene
* **Discover Three.js** — https://discoverthreejs.com/
* **Wael Yasmina (YouTube)** — https://www.youtube.com/@WaelYasmina/videos
* **Three.js Tutorial Video** — https://www.youtube.com/watch?v=Q7AOvWpIVHU

### Rubik’s Cube Algorithms & Solving

* **Herbert Kociemba – Cube Representation & Solver** — http://kociemba.org/cube.htm
* **Rubik’s Cube Algorithm Tutorial (YouTube)** — https://www.youtube.com/watch?v=A6JyElruhwE
* **Online Cube Solver / Visualizer** — http://d4m4s74.pythonanywhere.com/
* **cubejs GitHub Repository** — https://github.com/ldez/cubejs

These resources were used for learning concepts, understanding cube state representation, studying notation systems, and implementing the underlying cube algorithms and interactions.
