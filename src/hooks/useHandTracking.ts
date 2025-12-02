import { useEffect, useRef, useState } from 'react';
import { Hands, Results, HAND_CONNECTIONS } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { HandResults } from '../types';

export const useHandTracking = (enabled: boolean) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [results, setResults] = useState<HandResults | null>(null);
  const [gesture, setGesture] = useState<'OPEN' | 'PINCH' | 'FIST' | 'NONE'>('NONE');
  const [handPos, setHandPos] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    if (!enabled || !videoRef.current) return;

    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    hands.onResults((res: Results) => {
      setResults(res as unknown as HandResults);
      
      if (res.multiHandLandmarks.length > 0) {
        const landmarks = res.multiHandLandmarks[0];
        processGesture(landmarks);
        
        // Draw on canvas if needed
        if (canvasRef.current && videoRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          // Match canvas size to video display size
          if (canvasRef.current.width !== videoRef.current.videoWidth || canvasRef.current.height !== videoRef.current.videoHeight) {
             canvasRef.current.width = videoRef.current.videoWidth;
             canvasRef.current.height = videoRef.current.videoHeight;
          }

          if (ctx) {
            ctx.save();
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            // ctx.drawImage(res.image, 0, 0, canvasRef.current.width, canvasRef.current.height); // Don't draw video, just skeleton
            drawConnectors(ctx, res.multiHandLandmarks[0], HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 2 });
            drawLandmarks(ctx, res.multiHandLandmarks[0], { color: '#FF0000', lineWidth: 1 });
            ctx.restore();
          }
        }
      } else {
        setGesture('NONE');
        // Clear canvas if no hand
        if (canvasRef.current) {
           const ctx = canvasRef.current.getContext('2d');
           if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current) {
          await hands.send({ image: videoRef.current });
        }
      },
      width: 320,
      height: 240
    });

    camera.start();

    return () => {
      camera.stop();
      hands.close();
    };
  }, [enabled]);

  const processGesture = (landmarks: any[]) => {
    // Simple gesture recognition
    const wrist = landmarks[0];
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];

    const thumbIndexDist = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);
    
    // Calculate average finger extension
    // Compare tip to MCP distance vs Wrist to MCP
    // Simplified: Check if tips are above MCPs (assuming hand is upright) 
    // or just check distance from wrist.
    
    // Better: Check if fingers are curled.
    // Tip to Wrist distance < MCP to Wrist distance implies curled? Not always.
    // Let's use the standard "is finger folded" check: Tip is closer to wrist than PIP.
    
    const isFingerOpen = (tipIdx: number, pipIdx: number) => {
      const dTip = Math.hypot(landmarks[tipIdx].x - wrist.x, landmarks[tipIdx].y - wrist.y);
      const dPip = Math.hypot(landmarks[pipIdx].x - wrist.x, landmarks[pipIdx].y - wrist.y);
      return dTip > dPip;
    };

    const indexOpen = isFingerOpen(8, 6);
    const middleOpen = isFingerOpen(12, 10);
    const ringOpen = isFingerOpen(16, 14);
    const pinkyOpen = isFingerOpen(20, 18);

    let g: 'OPEN' | 'PINCH' | 'FIST' | 'NONE' = 'NONE';

    if (!indexOpen && !middleOpen && !ringOpen && !pinkyOpen) {
      g = 'FIST';
    } else if (thumbIndexDist < 0.05) {
      g = 'PINCH';
    } else if (indexOpen && middleOpen && ringOpen && pinkyOpen) {
      g = 'OPEN';
    }

    setGesture(g);
    
    // Map hand position (0-1) to scene coordinates (-1 to 1 approx)
    // Invert X for mirror effect
    setHandPos({
      x: (1 - landmarks[9].x) * 2 - 1,
      y: -(landmarks[9].y * 2 - 1),
      z: 0
    });
  };

  return { videoRef, canvasRef, results, gesture, handPos };
};
