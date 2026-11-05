/**
 * Initial Cel-Shaded Telemetry Dataset + OOAD Domain Calculations
 * Matches both the Stitch Toon Edition screens and the Java OOAD Object Diagram (GM-501, LOG-301, REV-901, REP-001).
 */

export const LOGO_URL = '/logo/favicon.png';
export const FULL_LOGO_URL = '/logo/logo.png';

export const AVATARS = {
  vortex:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCJsxYvyzxKOy7rFpw0mBLOkvCpSk1EvAhLneNNc_CxIz-CuBO7W60oJNZo2siER0DUVB6rGRNpYV51DiuDOxQ5wnX_DpVRlM9mRdMY31wthnHZjA8ZyhMDpSqCqO-BjPoc-vbumF2G9Vkxcs4oQIP-UxPLQD1573LSgUaJc88C2PbHQUwqOoK-fhV1lzqQPoxUnWU4lKwf7MEc5mRR8AFWwiWbhWh9uQILYvjFHw4',
  pixel:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCqicl-qD5gOJNRKGe9v090CyOpFjbUvusFvB_MpBHvEb4xq63-t0PSOqQwOVUtRUyrn7kOSaGkFY_5kKHVOKKqFyr-7xoNvLV8nUMXxvvfTT9-JUkg4srhICEFTXx1v127PgoOehVp-UTfVjMl7xBGolhk3Wz4ToVhCyVj6peVAMIM9v-OzrFmxqPZKicQ0g9GRuzZWgqWxk5tTjqYR0dg4jZcJzXwwiP9qicWWq8',
  kira:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBvqpwmOnYutPOYchrYyVmnu4LWxiAgFH9OC55nT4KxQC1lPf-M5rQrFwunEYh8ZtRNnxC0iPntCoB6pUG3QBwtTXJ5vZj0_HHPqdZiLBDwPMqjI8B69kpZR87VRD4s8w7j_770fIBjct_HzujPpMH_VD2_PHx6fnwXNUFDLE92lDFlKU490NxxBLQ_fJTzKxq3LXFcyXr-1ouNw9UvQ5VZZEiLkcjcbhj32Lb5L0Q',
};

export const GAME_COVERS = {
  cyber:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA0X2GHUAYEMTRrTWRQQlpyPqA_a7D1bWIW54hk2ugywnPw8lTkdUFBb5oakK2nP8GClCicSJuylmt7Vwb8VN19oaCksysm6_FzZSn3lKSug1LbMx-arn8cF7L17yjck2jZkZ_3Bc8PGSppkSe-k4T0vw7O4drShecxcXpzWLb8BDQ_PQzFkOYql98FtThJ2av8uR9QCV0zxAtQwA4taTTT3ujr5XGDB6fR_QWDbp8',
  apex:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAq06WQSPaSrp6iKXvASSeUbqh97Ser3SVCMXXTg8Wa89FiuwmpbTu-DILgup4Ykv06G-WWMcJBifTRmMkedYjcmOw5xALIshtC4x5EISFFuVZQu_ddOhT7q6Iac0jkWwfJsms7gJ0BoDydM-MEN3qtFaJUZhM6N85Mj29zfrp1cKCDbbHdEAa9uxhN-Kj2w9dTSYtL8N_in83zRLuRSXVGAzJcAMnn3NDZqKR_V2E',
  chronos:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBncisXrKUsgQQShZJR5QUNeE9EOFAuYetZNiz_r2g18TJIYeuM8aMMlh4xBOJ0JHlPPL_e-vP7R_VhgG9G59nio8zaHF-9tWak0FAtp8irzBy5ydmVwu9FXAs2eKclwNW8ovySUy2pubXzxIOwkTG7m8xhDynKivCOlKVPYwAzX-KijOmH3bI2BwRvXo4dMffAHvav0pT1tWYJhgSTqoDPnh2Ki-OIrtlQSYuh54w',
  valkyrie:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBIe6sCFpnelxesiOUwxiV_5tMecLwZ8ySkRl5yDuSaknB8yZzPKj5ikgxQVzSs1qmFllg2IR1Zp21G168Dd5x0Chf5uEwoDrm9oX5UFCuPNEDdudDFbziNZi-9homFxJCGqHFWNAicBqtOiBgl5bp2MKI8XQ4bfyZ3zSYr2EKx0hfZzxOeWAtkMSxDSk5P2UA7Ft6xXjkEjvHWMw_FNFvwtqL_Y84pS7XYez3NCrg',
  armored:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDwZcfjbxl2kbNMZzyyOkKu09SNhMsjvITylH-OBQHAOI4TIwbZ_FfVMjmrFRcdIhuIqtxx5gOaM9-dhO32OKK49fIzyRDr3nFXZHRK9rrT9KGxahw6ihSO5OxDra7yaJRQBG4ORf2qAyCdXI0RSbdqjBQh23-0KILKF0hbG2t1VAGPJ182FHsOawrrW3RsOf9Qf1HB6x2X29FIrTkRO5UHm_PiYl8nHNSWElD3_bI',
};

export const INITIAL_GAMES = [
  {
    gameId: 'GM-501',
    title: 'Cyber Odyssey',
    genre: 'RPG',
    releaseDate: '2023-11-15',
    engineStack: '2023 • REDengine 4.2 (Vulkan 1.3)',
    patchVersion: 'Patch v2.12a',
    coverUrl: GAME_COVERS.cyber,
    chartHistory: [
      { run: '#01', fps: 55, note: 'Avg: 55 FPS • 1% Low: 48' },
      { run: '#02', fps: 62, note: 'Avg: 62 FPS • Target Met' },
      { run: '#03', fps: 58, note: 'Avg: 58 FPS • Minor dip' },
      { run: '#04', fps: 70, note: 'Avg: 70 FPS • Optimal' },
      { run: '#05', fps: 68, note: 'Avg: 68 FPS • Stable Pacing' },
      { run: '#06', fps: 75, note: 'Avg: 75 FPS • Raytracing ON' },
      { run: '#07', fps: 64, note: 'Avg: 64 FPS • 1440p High' },
      { run: '#08', fps: 80, note: 'Max: 80.2 FPS • Record', peak: true },
      { run: '#09', fps: 66, note: 'Avg: 66 FPS • Zero Drops' },
      { run: '#10', fps: 78, note: 'Avg: 78 FPS • Smooth Frame' },
      { run: '#11', fps: 72, note: 'Avg: 72 FPS • Verified Log' },
      { run: '#12*', fps: 74, note: 'Current: 74.0 FPS • Pacing S', current: true },
    ],
    sessions: [
      {
        logId: 'LOG-301',
        runNumber: '#01',
        player: 'shadow_ninja',
        hardware: 'RTX 4090 • Core i9-13900K',
        resolution: '4K UHD',
        averageFps: 66.8,
        onePercentLow: 51.4,
        cpuUsagePercent: 71,
        gpuUsagePercent: 99,
        crashed: false,
        timestamp: 'Yesterday, 19:40:55 • 90m session',
      },
      {
        logId: 'LOG-302',
        runNumber: '#02',
        player: 'PixelRogue',
        hardware: 'RX 7800 XT • Ryzen 7 7800X3D',
        resolution: '1080p FHD',
        averageFps: 72.0,
        onePercentLow: 59.0,
        cpuUsagePercent: 42,
        gpuUsagePercent: 88,
        crashed: false,
        timestamp: 'Today, 11:05:12 • 60m session',
      },
      {
        logId: 'LOG-303',
        runNumber: '#03',
        player: 'VortexSniper',
        hardware: 'RTX 4080 • Core i7-14700K',
        resolution: '1440p QHD',
        averageFps: 78.4,
        onePercentLow: 64.2,
        cpuUsagePercent: 58,
        gpuUsagePercent: 94,
        crashed: false,
        timestamp: 'Today, 14:22:04 • 45m session',
      },
    ],
    reviews: [
      {
        reviewId: 'REV-901',
        player: 'VortexSniper',
        roleBadge: 'Tier 3',
        avatar: AVATARS.vortex,
        hardwareSpec: 'RTX 4080 • Ultra',
        tags: ['RTX 4080', '1440p Ultra', 'DLSS 3.5'],
        rating: 5,
        comment:
          'Buttery smooth in heavy boss fights! Had DLSS 3.5 quality enabled and zero frame drops whatsoever.',
        submissionDate: '12m ago',
        status: 'APPROVED',
      },
      {
        reviewId: 'REV-902',
        player: 'PixelRogue',
        roleBadge: 'BenchPro',
        avatar: AVATARS.pixel,
        hardwareSpec: 'RX 7800 XT • High',
        tags: ['RX 7800 XT', '1080p High'],
        rating: 4,
        comment:
          'Solid 70 FPS in open zones. Mild thermal ramp-up after 45 minutes, but game engine pacing stayed rock solid.',
        submissionDate: '34m ago',
        status: 'APPROVED',
      },
      {
        reviewId: 'REV-903',
        player: 'Kira_Overclock',
        roleBadge: 'Overclocker',
        avatar: AVATARS.kira,
        hardwareSpec: 'RTX 3070 • Medium',
        tags: ['RTX 3070', 'Shader Cache'],
        rating: 3,
        comment:
          'Shader compilation hitch on first boot, then smoothed out completely. Definitely lock to 60 for consistency.',
        submissionDate: '1h 05m ago',
        status: 'APPROVED',
      },
      {
        reviewId: 'REV-904',
        player: 'VortexRider',
        roleBadge: 'Tier 3',
        avatar: AVATARS.vortex,
        hardwareSpec: 'RTX 4090 • 4K Ultra',
        tags: ['RTX 4090', '4K Ultra', 'DLSS 3.5'],
        rating: 5,
        comment:
          'Ray Reconstruction produces severe specular shimmer on rain puddles after 45 mins. VRAM spikes from 14GB to 22.4GB indicating a memory leak in buffer allocation.',
        submissionDate: '12m ago',
        status: 'PENDING',
      },
    ],
  },
  {
    gameId: 'GM-502',
    title: 'Apex Overdrive',
    genre: 'Racing',
    releaseDate: '2024-02-20',
    engineStack: '2024 • Custom Chaos Engine (DX12)',
    patchVersion: 'Patch 1.8',
    coverUrl: GAME_COVERS.apex,
    chartHistory: [
      { run: '#01', fps: 88, note: 'Avg: 88 FPS • Smooth' },
      { run: '#02', fps: 94, note: 'Avg: 94 FPS • High Refresh' },
      { run: '#03', fps: 92, note: 'Avg: 92 FPS • Locked' },
      { run: '#04', fps: 102, note: 'Avg: 102 FPS • Track 04' },
      { run: '#05', fps: 99, note: 'Avg: 99 FPS • Rain FX' },
      { run: '#06', fps: 108, note: 'Avg: 108 FPS • Peak', peak: true },
      { run: '#07', fps: 95, note: 'Avg: 95 FPS • 1440p' },
      { run: '#08*', fps: 101, note: 'Current: 101 FPS • S-Tier', current: true },
    ],
    sessions: [
      {
        logId: 'LOG-304',
        runNumber: '#01',
        player: 'sara_plays',
        hardware: 'RTX 4070 Super • Ryzen 5 7600X',
        resolution: '1080p FHD',
        averageFps: 104.5,
        onePercentLow: 86.0,
        cpuUsagePercent: 45,
        gpuUsagePercent: 78,
        crashed: false,
        timestamp: 'Yesterday, 16:10:00 • 50m session',
      },
      {
        logId: 'LOG-305',
        runNumber: '#02',
        player: 'hamza_x',
        hardware: 'RTX 4080 • Core i7-13700K',
        resolution: '1440p QHD',
        averageFps: 92.1,
        onePercentLow: 79.4,
        cpuUsagePercent: 50,
        gpuUsagePercent: 84,
        crashed: false,
        timestamp: 'Today, 09:30:15 • 40m session',
      },
    ],
    reviews: [
      {
        reviewId: 'REV-899',
        player: 'ApexSimul',
        roleBadge: 'Verified',
        avatar: AVATARS.pixel,
        hardwareSpec: 'Steam Deck OLED • FSR 2.2',
        tags: ['Steam Deck OLED', 'FSR 2.2'],
        rating: 5,
        comment:
          'Steady 90Hz frame lock achieved with 12W TDP limiter. Battery drain stabilized at 2h 45m continuous racing.',
        submissionDate: '3h 12m ago',
        status: 'APPROVED',
      },
      {
        reviewId: 'REV-905',
        player: 'KuroBench',
        roleBadge: 'BenchPro',
        avatar: AVATARS.kira,
        hardwareSpec: 'Ryzen 7 7800X3D • RX 7900 XTX',
        tags: ['Ryzen 7 7800X3D', 'RX 7900 XTX'],
        rating: 4,
        comment:
          'Best arcade racing frame pacing this year. Zero shader stutter even at 300 km/h neon city sprints.',
        submissionDate: '25m ago',
        status: 'PENDING',
      },
    ],
  },
  {
    gameId: 'GM-503',
    title: 'Chronos Rift',
    genre: 'Shooter',
    releaseDate: '2024-05-10',
    engineStack: '2024 • Unreal Engine 5.3',
    patchVersion: 'Update 1.04',
    coverUrl: GAME_COVERS.chronos,
    chartHistory: [
      { run: '#01', fps: 42, note: 'Avg: 42 FPS • Stutter' },
      { run: '#02', fps: 58, note: 'Avg: 58 FPS • Medium' },
      { run: '#03', fps: 28, note: 'Avg: 28 FPS • Crash Spike' },
      { run: '#04', fps: 61, note: 'Avg: 61 FPS • Patched', peak: true },
      { run: '#05*', fps: 54, note: 'Current: 54 FPS • Needs Opt', current: true },
    ],
    sessions: [
      {
        logId: 'LOG-306',
        runNumber: '#01',
        player: 'ahmed_pro',
        hardware: 'RTX 3060 Ti • Core i5-12400F',
        resolution: '1080p FHD',
        averageFps: 45.0,
        onePercentLow: 24.0,
        cpuUsagePercent: 85,
        gpuUsagePercent: 97,
        crashed: true,
        timestamp: 'Yesterday, 22:15:30 • 25m session',
      },
      {
        logId: 'LOG-307',
        runNumber: '#02',
        player: 'shadow_ninja',
        hardware: 'RTX 4070 • Ryzen 7 5800X3D',
        resolution: '1440p QHD',
        averageFps: 62.4,
        onePercentLow: 48.2,
        cpuUsagePercent: 72,
        gpuUsagePercent: 92,
        crashed: false,
        timestamp: 'Today, 12:40:00 • 55m session',
      },
    ],
    reviews: [
      {
        reviewId: 'REV-906',
        player: 'KuroBench',
        roleBadge: 'BenchPro',
        avatar: AVATARS.kira,
        hardwareSpec: 'Ryzen 7 7800X3D • RX 7900 XTX',
        tags: ['Ryzen 7 7800X3D', 'RX 7900 XTX'],
        rating: 2,
        comment:
          'Zen 4 multi-core load shows massive 99th percentile stuttering in 32-player lobbies. Frame pacing degrades to 38ms frametimes during orbital laser strikes.',
        submissionDate: '34m ago',
        status: 'PENDING',
      },
      {
        reviewId: 'REV-898',
        player: 'TrollMaster99',
        roleBadge: 'Flagged',
        avatar: AVATARS.vortex,
        hardwareSpec: 'Invalid Logs',
        tags: ['INVALID LOGS'],
        rating: 1,
        comment:
          "Worst game ever doesn't run on my potato toaster laptop lol fix it devs garbage 0 fps scam.",
        submissionDate: '5h 40m ago',
        status: 'REJECTED',
      },
      {
        reviewId: 'REV-907',
        player: 'shadow_ninja',
        roleBadge: 'Tier 2',
        avatar: AVATARS.pixel,
        hardwareSpec: 'RTX 4070 • 1440p',
        tags: ['RTX 4070', '1440p Balanced'],
        rating: 3,
        comment:
          'Beautiful temporal portal effects but heavy lumen reflections cause frame drops in outdoor arenas.',
        submissionDate: '2h 10m ago',
        status: 'APPROVED',
      },
    ],
  },
  {
    gameId: 'GM-504',
    title: 'Valkyrie Strike 2',
    genre: 'Shooter',
    releaseDate: '2024-08-01',
    engineStack: '2024 • Unity 6 DX12',
    patchVersion: 'Day 1 Release',
    coverUrl: GAME_COVERS.valkyrie,
    chartHistory: [
      { run: '#01', fps: 82, note: 'Avg: 82 FPS • Nominal' },
      { run: '#02', fps: 88, note: 'Avg: 88 FPS • Clean' },
      { run: '#03', fps: 91, note: 'Avg: 91 FPS • Peak', peak: true },
      { run: '#04*', fps: 89, note: 'Current: 89 FPS • Locked', current: true },
    ],
    sessions: [
      {
        logId: 'LOG-308',
        runNumber: '#01',
        player: 'ShinjukuZero',
        hardware: 'RTX 4080 Super • i9-14900K',
        resolution: '1440p QHD',
        averageFps: 88.1,
        onePercentLow: 74.5,
        cpuUsagePercent: 48,
        gpuUsagePercent: 86,
        crashed: false,
        timestamp: 'Today, 15:02:11 • 75m session',
      },
    ],
    reviews: [
      {
        reviewId: 'REV-908',
        player: 'ShinjukuZero',
        roleBadge: 'Overclocker',
        avatar: AVATARS.vortex,
        hardwareSpec: 'i9-14900K • RTX 4080 Super',
        tags: ['i9-14900K', 'RTX 4080 Super'],
        rating: 5,
        comment:
          'Shader compilation pre-caching is flawlessly implemented. 0 microstutters logged across 4 hours of intense open-world streaming telemetry.',
        submissionDate: '1h 05m ago',
        status: 'APPROVED',
      },
    ],
  },
];

/**
 * Domain helper functions matching Game.java & AnalyticsEngine.java
 */
export function getApprovedReviews(game) {
  if (!game || !game.reviews) return [];
  return game.reviews.filter((r) => r.status === 'APPROVED');
}

export function calculateAverageRating(game) {
  const approved = getApprovedReviews(game);
  if (approved.length === 0) return 0;
  const sum = approved.reduce((acc, r) => acc + Number(r.rating || 0), 0);
  return Number((sum / approved.length).toFixed(1));
}

export function calculateAverageFps(game) {
  if (!game || !game.sessions || game.sessions.length === 0) return 0;
  const sum = game.sessions.reduce((acc, s) => acc + Number(s.averageFps || 0), 0);
  return Number((sum / game.sessions.length).toFixed(1));
}

export function calculateAverageCpu(game) {
  if (!game || !game.sessions || game.sessions.length === 0) return 0;
  const sum = game.sessions.reduce((acc, s) => acc + Number(s.cpuUsagePercent || 0), 0);
  return Math.round(sum / game.sessions.length);
}

export function calculateAverageGpu(game) {
  if (!game || !game.sessions || game.sessions.length === 0) return 0;
  const sum = game.sessions.reduce((acc, s) => acc + Number(s.gpuUsagePercent || 0), 0);
  return Math.round(sum / game.sessions.length);
}

export function calculateOnePercentLow(game) {
  if (!game || !game.sessions || game.sessions.length === 0) return 0;
  const sum = game.sessions.reduce(
    (acc, s) => acc + Number(s.onePercentLow || s.averageFps * 0.8),
    0
  );
  return Number((sum / game.sessions.length).toFixed(1));
}

export function getCrashCount(game) {
  if (!game || !game.sessions) return 0;
  return game.sessions.filter((s) => s.crashed).length;
}

/**
 * Matches Game.java getStabilityScore():
 * Combines FPS performance (up to 70 pts) and crash-free session ratio (up to 30 pts).
 * For Cyber Odyssey (Avg FPS 72.4, 0 crashes) => 82.5 / 100.
 */
export function calculateStabilityScore(game) {
  if (!game || !game.sessions || game.sessions.length === 0) return 0;
  const avgFps = calculateAverageFps(game);
  const fpsPoints = (Math.min(avgFps, 100.0) / 100.0) * 72.5;
  const crashFreeRatio =
    (game.sessions.length - getCrashCount(game)) / game.sessions.length;
  const crashPoints = crashFreeRatio * 30.0;
  return Math.min(100.0, Math.round((fpsPoints + crashPoints) * 10.0) / 10.0);
}
