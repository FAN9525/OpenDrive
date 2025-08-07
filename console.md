[12:02:29.617] Running build in Washington, D.C., USA (East) – iad1
[12:02:29.617] Build machine configuration: 4 cores, 8 GB
[12:02:29.631] Cloning github.com/FAN9525/OpenDrive (Branch: main, Commit: 2fe2876)
[12:02:29.854] Cloning completed: 223.000ms
[12:02:31.628] Restored build cache from previous deployment (GpWvs4FvGyGXn9mFMx1vFGmcLtN5)
[12:02:35.250] Running "vercel build"
[12:02:35.873] Vercel CLI 44.7.2
[12:02:36.175] Installing dependencies...
[12:02:37.356] 
[12:02:37.356] up to date in 948ms
[12:02:37.356] 
[12:02:37.356] 141 packages are looking for funding
[12:02:37.356]   run `npm fund` for details
[12:02:37.385] Detected Next.js version: 15.4.6
[12:02:37.389] Running "npm run build"
[12:02:37.504] 
[12:02:37.505] > opendrive@0.1.0 build
[12:02:37.505] > next build
[12:02:37.505] 
[12:02:38.742]    ▲ Next.js 15.4.6
[12:02:38.742] 
[12:02:38.775]    Creating an optimized production build ...
[12:02:45.283]  ✓ Compiled successfully in 3.0s
[12:02:45.288]    Linting and checking validity of types ...
[12:02:49.561] Failed to compile.
[12:02:49.561] 
[12:02:49.562] ./src/components/ValuationResults.tsx:85:29
[12:02:49.562] Type error: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
[12:02:49.562]   Type 'undefined' is not assignable to type 'string'.
[12:02:49.562] 
[12:02:49.562] [0m [90m 83 |[39m   }
[12:02:49.562]  [90m 84 |[39m
[12:02:49.562] [31m[1m>[22m[39m[90m 85 |[39m   [36mconst[39m newValue [33m=[39m parseInt(valuation[33m.[39mmmNew) [33m||[39m [35m0[39m
[12:02:49.563]  [90m    |[39m                             [31m[1m^[22m[39m
[12:02:49.563]  [90m 86 |[39m   [36mconst[39m baseRetail [33m=[39m parseInt(valuation[33m.[39mmmRetail) [33m||[39m [35m0[39m
[12:02:49.563]  [90m 87 |[39m   [36mconst[39m baseTrade [33m=[39m parseInt(valuation[33m.[39mmmTrade) [33m||[39m [35m0[39m
[12:02:49.563]  [90m 88 |[39m[0m
[12:02:49.582] Next.js build worker exited with code: 1 and signal: null
[12:02:49.605] Error: Command "npm run build" exited with 1