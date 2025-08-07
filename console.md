[11:57:26.671] Running build in Washington, D.C., USA (East) – iad1
[11:57:26.671] Build machine configuration: 4 cores, 8 GB
[11:57:26.684] Cloning github.com/FAN9525/OpenDrive (Branch: main, Commit: 1494c56)
[11:57:26.929] Cloning completed: 245.000ms
[11:57:28.712] Restored build cache from previous deployment (GpWvs4FvGyGXn9mFMx1vFGmcLtN5)
[11:57:32.888] Running "vercel build"
[11:57:33.371] Vercel CLI 44.7.2
[11:57:33.666] Installing dependencies...
[11:57:34.787] 
[11:57:34.788] up to date in 857ms
[11:57:34.788] 
[11:57:34.788] 141 packages are looking for funding
[11:57:34.788]   run `npm fund` for details
[11:57:34.817] Detected Next.js version: 15.4.6
[11:57:34.821] Running "npm run build"
[11:57:34.931] 
[11:57:34.932] > opendrive@0.1.0 build
[11:57:34.932] > next build
[11:57:34.932] 
[11:57:36.122]    ▲ Next.js 15.4.6
[11:57:36.122] 
[11:57:36.152]    Creating an optimized production build ...
[11:57:42.504]  ✓ Compiled successfully in 3.0s
[11:57:42.508]    Linting and checking validity of types ...
[11:57:45.804] 
[11:57:45.804] Failed to compile.
[11:57:45.805] 
[11:57:45.805] ./src/app/page.tsx
[11:57:45.805] 33:60  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[11:57:45.805] 
[11:57:45.805] ./src/components/ValuationResults.tsx
[11:57:45.806] 3:10  Warning: 'ValuationData' is defined but never used.  @typescript-eslint/no-unused-vars
[11:57:45.806] 6:13  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[11:57:45.806] 77:24  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[11:57:45.806] 80:24  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[11:57:45.807] 
[11:57:45.807] info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules
[11:57:45.833] Error: Command "npm run build" exited with 1