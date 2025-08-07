[11:03:34.768] Running build in Washington, D.C., USA (East) – iad1
[11:03:34.769] Build machine configuration: 4 cores, 8 GB
[11:03:34.780] Cloning github.com/FAN9525/OpenDrive (Branch: main, Commit: 658ef86)
[11:03:35.008] Cloning completed: 227.000ms
[11:03:37.302] Restored build cache from previous deployment (6rvLHT3HFLuffwTNgdpPo4GZVCPk)
[11:03:41.243] Running "vercel build"
[11:03:41.724] Vercel CLI 44.7.2
[11:03:42.033] Installing dependencies...
[11:03:43.110] 
[11:03:43.110] up to date in 836ms
[11:03:43.111] 
[11:03:43.111] 141 packages are looking for funding
[11:03:43.111]   run `npm fund` for details
[11:03:43.141] Detected Next.js version: 15.4.6
[11:03:43.145] Running "npm run build"
[11:03:43.262] 
[11:03:43.262] > opendrive@0.1.0 build
[11:03:43.262] > next build
[11:03:43.262] 
[11:03:44.486]    ▲ Next.js 15.4.6
[11:03:44.487] 
[11:03:44.504]    Creating an optimized production build ...
[11:03:51.012]  ✓ Compiled successfully in 2000ms
[11:03:51.016]    Linting and checking validity of types ...
[11:03:54.246] 
[11:03:54.247] ./src/app/api/config/test/route.ts
[11:03:54.247] 4:10  Warning: 'decrypt' is defined but never used.  @typescript-eslint/no-unused-vars
[11:03:54.247] 
[11:03:54.248] info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules
[11:03:55.177] Failed to compile.
[11:03:55.178] 
[11:03:55.178] ./src/app/api/config/test/route.ts:4:10
[11:03:55.178] Type error: Module '"@/utils/encryption"' has no exported member 'decrypt'.
[11:03:55.178] 
[11:03:55.178] [0m [90m 2 |[39m [36mimport[39m { supabase } [36mfrom[39m [32m'@/utils/supabase'[39m
[11:03:55.178]  [90m 3 |[39m [36mimport[39m { [33mEVALUE8_ENDPOINTS[39m } [36mfrom[39m [32m'@/utils/constants'[39m
[11:03:55.178] [31m[1m>[22m[39m[90m 4 |[39m [36mimport[39m { decrypt } [36mfrom[39m [32m'@/utils/encryption'[39m
[11:03:55.178]  [90m   |[39m          [31m[1m^[22m[39m
[11:03:55.179]  [90m 5 |[39m
[11:03:55.179]  [90m 6 |[39m [36mexport[39m [36masync[39m [36mfunction[39m [33mPOST[39m(request[33m:[39m [33mNextRequest[39m) {
[11:03:55.179]  [90m 7 |[39m   [36mtry[39m {[0m
[11:03:55.197] Next.js build worker exited with code: 1 and signal: null
[11:03:55.219] Error: Command "npm run build" exited with 1