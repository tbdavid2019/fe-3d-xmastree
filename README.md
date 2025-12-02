# WebGPU Christmas Tree

A real-time 3D Christmas tree visualization with 8.19 million particles, powered by WebGPU and MediaPipe hand tracking.

## Features
- **8.19 Million Particles**: Rendered efficiently using WebGPU Compute Shaders.
- **Hand Tracking**: Control the tree with your hand gestures (Open Palm to explode, Closed Fist to snap back).
- **Force Field**: Move your hand to push particles.
- **PBR-ish Rendering**: Gold and Teal iridescent colors.

## Requirements
- A browser with WebGPU support (Chrome 113+, Edge, or Firefox Nightly).
- A webcam for hand tracking.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open the link in your browser (usually `http://localhost:5173`).

## Controls
- **Open Palm**: Explode the tree.
- **Closed Fist**: Snap particles back to the tree shape.
- **Move Hand**: Create a force field that interacts with particles.
