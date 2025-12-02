# WebGPU Christmas Tree

## 繁體中文說明
即時 3D 聖誕樹，使用 WebGPU 與 MediaPipe 手部追蹤驅動 819 萬粒子。

### 功能
- 819 萬粒子：以 WebGPU Compute Shader 高效運算。
- 手勢控制：張開手掌爆裂粒子、握拳將粒子收回樹形。
- 力場效果：手部位置會推開粒子。
- 類 PBR 呈現：金色與藍綠漸層光澤。

### 環境需求
- 支援 WebGPU 的瀏覽器（Chrome 113+、Edge，或 Firefox Nightly）。
- 可用的攝影機（用於手部追蹤）。

### 快速開始
1. 安裝套件：
   ```bash
   npm install
   ```
2. 啟動開發伺服器：
   ```bash
   npm run dev
   ```
3. 瀏覽器開啟提示網址（預設 `http://localhost:5173`）。
4. 正式建置與本機預覽：
   ```bash
   npm run build
   npm run preview
   ```

### 瀏覽器與 GPU 提示
- 建議使用 Chrome 113+ 或 Edge，必要時於 `chrome://flags/#enable-unsafe-webgpu` 啟用 WebGPU。
- 允許瀏覽器使用攝影機，否則手部追蹤不會啟動。
- 筆電雙顯卡請強制使用獨顯以提升效能。

### 控制方式
- 張開手掌：爆裂粒子。
- 握拳：粒子回到聖誕樹形狀。
- 移動手部：推動粒子產生力場。

### 專案結構
- `src/index.tsx`：React 入口。
- `src/App.tsx`：主要場景與 UI。
- `src/components/`：可重用 3D 元件與 UI。
- `src/hooks/`：自訂 hooks（如手部追蹤、動畫狀態）。
- `src/types.ts`：共用型別。

### 疑難排解
- 看不到 WebGPU？更新瀏覽器或啟用前述旗標。
- 攝影機無法使用？確認僅有一個分頁或應用程式佔用攝影機。
- 效能下降？縮小視窗或關閉其他吃 GPU 的分頁。

---

## English
A real-time 3D Christmas tree visualization with 8.19 million particles, powered by WebGPU and MediaPipe hand tracking.

### What This Is
- Built with Vite + React + TypeScript and `@react-three/fiber` on top of Three.js.
- Uses WebGPU compute shaders to push 8.19M particles and MediaPipe Hands for gesture input.
- Ideal for modern Chromium browsers on desktop with a GPU that supports WebGPU.

### Features
- **8.19 Million Particles**: Rendered efficiently using WebGPU Compute Shaders.
- **Hand Tracking**: Control the tree with your hand gestures (Open Palm to explode, Closed Fist to snap back).
- **Force Field**: Move your hand to push particles.
- **PBR-ish Rendering**: Gold and Teal iridescent colors.

### Requirements
- A browser with WebGPU support (Chrome 113+, Edge, or Firefox Nightly).
- A webcam for hand tracking.

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open the link in your browser (usually `http://localhost:5173`).

4. Build for production and preview locally:
   ```bash
   npm run build
   npm run preview
   ```

### Browser & GPU Tips
- Use Chrome 113+ or Edge with WebGPU enabled; on some platforms you may need to toggle `chrome://flags/#enable-unsafe-webgpu`.
- Allow camera access in the browser or the hand tracking will fail silently.
- For laptops with integrated + discrete GPUs, force the discrete GPU for best performance.

### Controls
- **Open Palm**: Explode the tree.
- **Closed Fist**: Snap particles back to the tree shape.
- **Move Hand**: Create a force field that interacts with particles.

### Project Structure
- `src/index.tsx`: Vite entry point that mounts the React app.
- `src/App.tsx`: Main scene setup and UI.
- `src/components/`: Reusable 3D scene pieces and UI parts.
- `src/hooks/`: Custom hooks (e.g., hand tracking, animation state).
- `src/types.ts`: Shared type definitions.

### Troubleshooting
- If WebGPU is unavailable, update your browser or toggle the WebGPU flag noted above.
- Make sure only one tab is using the webcam; close other apps that might hold the camera.
- Performance drops: reduce the window size or close other GPU-heavy tabs.
