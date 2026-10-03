# Deploying VisualProof AI to Render

VisualProof AI is configured for a **unified full-stack deployment** on [Render](https://render.com). 
Both the React frontend (SPA) and the Express backend (Gemma 4 Multimodal API) are served from a single Render Web Service on the Free or Paid tier with zero CORS configuration required.

---

## Method 1: Deploy with Blueprint (Recommended - 1 Click)

Render automatically reads the [`render.yaml`](./render.yaml) file included in the repository.

1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** in the top right and select **Blueprint**.
3. Connect your GitHub repository:
   ```
   https://github.com/padigalaisaac-web/visualize-ai
   ```
4. Render will detect `render.yaml` and prompt you for the secret environment variable:
   - **`GEMINI_API_KEY`**: Paste your Google Gemini API key.
5. Click **Apply**. Render will build and deploy both frontend and backend automatically.
6. Once deployed, open your live URL (e.g., `https://visualproof-ai.onrender.com`).

---

## Method 2: Manual Web Service Setup

If you prefer to configure the Web Service manually in Render without Blueprints:

1. In Render Dashboard, click **New +** and select **Web Service**.
2. Connect your repository: `https://github.com/padigalaisaac-web/visualize-ai`.
3. Configure the following service settings:

| Setting | Value |
| :--- | :--- |
| **Name** | `visualproof-ai` (or your preferred name) |
| **Language / Runtime** | `Node` |
| **Branch** | `main` |
| **Region** | Oregon (US West) or your closest region |
| **Build Command** | `npm run render-build` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

4. Scroll down to **Environment Variables** and add:

| Key | Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production optimizations |
| `GEMINI_API_KEY` | `AQ.Ab8RN6KFd6...` | Your Google Gemini API Key |
| `GEMINI_MODEL` | `gemma-4-31b-it` | Gemma 4 model (or `gemma-4-26b-a4b-it`) |

5. Under **Advanced**, set **Health Check Path** to:
   ```
   /api/health
   ```
6. Click **Create Web Service**.

---

## What Happens During Build (`npm run render-build`)

1. Installs server dependencies: `server/package.json`
2. Installs client dependencies: `client/package.json`
3. Builds the client Vite bundle: outputs to `client/dist/`
4. Builds the Express TypeScript backend: outputs to `server/dist/`
5. Express serves the React SPA statically and routes API calls to `/api/analyze` and `/api/health`.

---

## Verifying Your Live Deployment

Once Render finishes deploying:

1. **Check Backend Health**:
   Visit `https://<your-render-app>.onrender.com/api/health`
   Expected response:
   ```json
   {
     "status": "ok",
     "app": "VisualProof AI",
     "model_configured": "gemma-4-31b-it",
     "api_key_present": true,
     "environment": "production"
   }
   ```

2. **Open the Web Interface**:
   Visit `https://<your-render-app>.onrender.com/`
   - Click any of the **Benchmark Vectors** (`TEST // DEMO-1`, `TEST // DEMO-2`, `TEST // DEMO-3`)
   - Click **Run Verification (Gemma 4)**
   - Confirm live multimodal inference completes and produces the structured verdict!
