Please implement this full interactive 3D Christmas tree experience. Merry Christmas! 🎄Please help me create an interactive 3D Christmas Tree web application with the following features:Project OverviewName: Merry Christmas (merryXmas)
Tech Stack: React 19 + TypeScript + Three.js + Vite + Tailwind CSSCore Features1. 3D Christmas Tree RenderingUse React Three Fiber (
@react
-three/fiber) to create a WebGL 3D scene:Tree foliage made of 250 green particles using a custom shader with a multi-layered green palette (#2E7D32 to #1B5E20)
Conical tree shape: height 16 units, base radius 5.5 units
Particles have gentle wind-swaying animation
2. Ornaments SystemUse InstancedMesh for performance optimization, including 6 types of decorations:Balls: 400 instances, metallic material, colors: gold, deep red, firebrick red, etc.
Gift Boxes: 150 instances, placed around the tree base
Lights: 600 instances with pulsing glow animation
Cascade Lights: 300 instances with flowing waterfall effect cycling from top to bottom
Gems: 200 octahedral gems with rotation animation
Bells: 150 instances with swinging animation
3. Tree TopperGolden star decoration featuring:Dodecahedron core + multi-directional conical spikes
Two rotating gyroscope-style torus rings
Point light emission
Sparkles particle effect (80 particles)
Heartbeat-style pulsing scale animation
4. Two Display ModesCHAOS Mode: All particles and ornaments randomly scattered in a spherical volume
FORMED Mode: Particles smoothly transition and converge into the Christmas tree shape
5. Hand Gesture InteractionUse MediaPipe Hands for real-time hand tracking:Camera feed at 320×240 resolution, 15 FPS

Recognize three gestures:OPEN (open hand) → Switch to CHAOS mode
PINCH (pinch gesture) → Switch to FORMED mode
FIST (closed fist) → Switch to FORMED mode
Palm position controls 3D scene offset/translation
Draw hand skeleton overlay on canvas (21 keypoints + connections)
6. Control Panel HUDLeft side:Title: "XMAS ARCHITECT"
Current mode indicator (C/P/F)
Status lights (camera, hand tracking, pinch lock, fist deform)
Real-time stats: particle count, FPS, uptime, data stream rate
Right side controls:Sliders: Spin, Scale, Density, Distortion, Field Radius
Toggles: Hand Tracking, HUD Skeleton
"NEXT FORM" button for manual mode switching
7. Visual EffectsPost-processing: Bloom (threshold 0.8, intensity 1.2) + Vignette
Starfield background with 5000 stars
Environment reflection: "lobby" preset
Semi-transparent camera feed as background (opacity: 0.2)
Grid floor decoration
File StructuremerryXmas/
├── index.html           # Entry HTML with Tailwind CDN + Google Fonts
├── index.tsx            # React entry point
├── App.tsx              # Main app component
├── types.ts             # TypeScript type definitions
├── vite.config.ts       # Vite config
├── tsconfig.json        # TypeScript config
├── package.json         # Dependencies
├── components/
│   ├── Scene.tsx        # 3D scene container (Canvas, camera, lights, post-processing)
│   ├── Foliage.tsx      # Foliage particle system (custom shader)
│   ├── Ornaments.tsx    # Ornaments system (InstancedMesh)
│   ├── TreeTopper.tsx   # Tree topper star
│   ├── ControlPanel.tsx # HUD control panel
│   └── HandSkeleton.tsx # Hand skeleton visualization
└── hooks/
    └── useHandTracking.ts # Hand gesture recognition hook
Dependenciesjson{
  "dependencies": {
    "@mediapipe/camera_utils": "^0.3.1675466862",
    "@mediapipe/drawing_utils": "^0.3.1675466124",
    "@mediapipe/hands": "^0.4.1675469240",
    "
@react
-three/drei": "^10.7.7",
    "
@react
-three/fiber": "^9.4.0",
    "
@react
-three/postprocessing": "^3.0.4",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "three": "^0.181.2"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/three": "^0.181.0",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  }
}
Styling RequirementsDark background (#050505)
Monospace, cyberpunk/HUD-style font
Color theme: Gold (#FFD700), Crimson (#DC143C), Deep Green (#2E7D32)
Smooth CSS transition animations when switching modes
Strong Christmas atmosphere with glowing effects
Animation DetailsCHAOS → FORMED transition uses lerp interpolation (speed factor 2.5)
Each ornament type has its own motion: bells swing, gems rotate, lights pulse
Tree topper has gyroscope rotation + heartbeat scale effect
OrbitControls with auto-rotation enabled in FORMED mode when no hand gesture is detected