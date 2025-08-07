[10:37:01.934] Running build in Washington, D.C., USA (East) – iad1
[10:37:01.934] Build machine configuration: 4 cores, 8 GB
[10:37:01.957] Cloning github.com/FAN9525/OpenDrive (Branch: main, Commit: 6672ce6)
[10:37:02.097] Previous build caches not available
[10:37:02.226] Cloning completed: 269.000ms
[10:37:04.790] Running "vercel build"
[10:37:05.272] Vercel CLI 44.7.2
[10:37:05.702] Installing dependencies...
[10:37:17.448] 
[10:37:17.449] added 358 packages in 12s
[10:37:17.449] 
[10:37:17.449] 141 packages are looking for funding
[10:37:17.449]   run `npm fund` for details
[10:37:17.514] Detected Next.js version: 15.4.6
[10:37:17.519] Running "npm run build"
[10:37:17.644] 
[10:37:17.645] > opendrive@0.1.0 build
[10:37:17.645] > next build
[10:37:17.645] 
[10:37:18.527] Attention: Next.js now collects completely anonymous telemetry regarding usage.
[10:37:18.527] This information is used to shape Next.js' roadmap and prioritize features.
[10:37:18.527] You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
[10:37:18.527] https://nextjs.org/telemetry
[10:37:18.528] 
[10:37:18.650]    ▲ Next.js 15.4.6
[10:37:18.650] 
[10:37:18.681]    Creating an optimized production build ...
[10:37:30.103]  ✓ Compiled successfully in 8.0s
[10:37:30.109]    Linting and checking validity of types ...
[10:37:34.118]    Collecting page data ...
[10:37:34.647] Error: supabaseUrl is required.
[10:37:34.647]     at new bF (.next/server/chunks/437.js:6:78159)
[10:37:34.647]     at bG (.next/server/chunks/437.js:6:83052)
[10:37:34.647]     at 6707 (.next/server/app/api/vehicles/accessories/route.js:1:8569)
[10:37:34.647]     at c (.next/server/webpack-runtime.js:1:128)
[10:37:34.647]     at 1562 (.next/server/app/api/vehicles/accessories/route.js:1:605)
[10:37:34.648]     at c (.next/server/webpack-runtime.js:1:128)
[10:37:34.648]     at <unknown> (.next/server/app/api/vehicles/accessories/route.js:1:9000)
[10:37:34.648]     at c.X (.next/server/webpack-runtime.js:1:1206)
[10:37:34.648]     at <unknown> (.next/server/app/api/vehicles/accessories/route.js:1:8979)
[10:37:34.648]     at Object.<anonymous> (.next/server/app/api/vehicles/accessories/route.js:1:9031)
[10:37:34.681] Error: supabaseUrl is required.
[10:37:34.681]     at new bF (.next/server/chunks/437.js:6:78159)
[10:37:34.682]     at bG (.next/server/chunks/437.js:6:83052)
[10:37:34.682]     at 6707 (.next/server/app/api/valuation/route.js:1:9207)
[10:37:34.682]     at c (.next/server/webpack-runtime.js:1:128)
[10:37:34.682]     at 47 (.next/server/app/api/valuation/route.js:1:418)
[10:37:34.682]     at c (.next/server/webpack-runtime.js:1:128)
[10:37:34.682]     at <unknown> (.next/server/app/api/valuation/route.js:1:9903)
[10:37:34.682]     at c.X (.next/server/webpack-runtime.js:1:1206)
[10:37:34.682]     at <unknown> (.next/server/app/api/valuation/route.js:1:9878)
[10:37:34.683]     at Object.<anonymous> (.next/server/app/api/valuation/route.js:1:9932)
[10:37:34.683] 
[10:37:34.683] > Build error occurred
[10:37:34.693] [Error: Failed to collect page data for /api/vehicles/accessories] {
[10:37:34.693]   type: 'Error'
[10:37:34.693] }
[10:37:34.721] Error: Command "npm run build" exited with 1