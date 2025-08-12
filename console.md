[07:56:28.074] Running build in Washington, D.C., USA (East) – iad1
[07:56:28.075] Build machine configuration: 4 cores, 8 GB
[07:56:28.100] Cloning github.com/FAN9525/OpenDrive (Branch: main, Commit: 9b114a1)
[07:56:28.482] Cloning completed: 381.000ms
[07:56:30.380] Restored build cache from previous deployment (EbLLt18jLnUSNmwGPgQ8sSz22hPD)
[07:56:34.877] Running "vercel build"
[07:56:35.365] Vercel CLI 44.7.3
[07:56:35.680] Installing dependencies...
[07:56:36.812] 
[07:56:36.812] up to date in 895ms
[07:56:36.812] 
[07:56:36.813] 141 packages are looking for funding
[07:56:36.813]   run `npm fund` for details
[07:56:36.844] Detected Next.js version: 15.4.6
[07:56:36.848] Running "npm run build"
[07:56:37.038] 
[07:56:37.039] > opendrive@0.1.0 build
[07:56:37.039] > next build
[07:56:37.039] 
[07:56:38.359]    ▲ Next.js 15.4.6
[07:56:38.359] 
[07:56:38.393]    Creating an optimized production build ...
[07:56:45.330]  ✓ Compiled successfully in 2000ms
[07:56:45.334]    Linting and checking validity of types ...
[07:56:48.823] 
[07:56:48.826] ./src/app/api/vehicles/accessories/route.ts
[07:56:48.827] 84:14  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
[07:56:48.827] 
[07:56:48.827] ./src/app/api/vehicles/identify/route.ts
[07:56:48.827] 36:11  Warning: 'params' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[07:56:48.827] 45:11  Warning: 'previewUrl' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[07:56:48.827] 87:14  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
[07:56:48.827] 
[07:56:48.827] ./src/app/api/vehicles/models/route.ts
[07:56:48.827] 79:14  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
[07:56:48.827] 
[07:56:48.827] ./src/app/api/vehicles/nonstandard/route.ts
[07:56:48.827] 34:14  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
[07:56:48.827] 
[07:56:48.828] ./src/app/api/vehicles/years/route.ts
[07:56:48.828] 92:14  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
[07:56:48.828] 
[07:56:48.828] ./src/components/AccessorySelector.tsx
[07:56:48.828] 246:26  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
[07:56:48.828] 
[07:56:48.828] info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules
[07:56:49.886] Failed to compile.
[07:56:49.886] 
[07:56:49.887] ./src/components/ValuationResults.tsx:220:8
[07:56:49.887] Type error: Cannot find name 'accessories'.
[07:56:49.887] 
[07:56:49.887] [0m [90m 218 |[39m
[07:56:49.887]  [90m 219 |[39m       {[90m/* No Accessories Message */[39m}
[07:56:49.887] [31m[1m>[22m[39m[90m 220 |[39m       {accessories[33m.[39mlength [33m===[39m [35m0[39m [33m&&[39m (
[07:56:49.887]  [90m     |[39m        [31m[1m^[22m[39m
[07:56:49.887]  [90m 221 |[39m         [33m<[39m[33mdiv[39m className[33m=[39m[32m"bg-slate-50 border border-slate-200 p-4 rounded-lg text-center text-slate-600"[39m[33m>[39m
[07:56:49.887]  [90m 222 |[39m           💡 [33mNo[39m accessories selected[33m.[39m [33mAdd[39m accessories to increase the vehicle value[33m.[39m
[07:56:49.887]  [90m 223 |[39m         [33m<[39m[33m/[39m[33mdiv[39m[33m>[39m[0m
[07:56:49.907] Next.js build worker exited with code: 1 and signal: null
[07:56:49.930] Error: Command "npm run build" exited with 1