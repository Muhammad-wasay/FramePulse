import { supabase, isSupabaseConfigured } from './supabaseClient';

/**
 * OOAD Diagram System Actors (Immutable)
 * - Diagram 1 (Class Diagram): Gamer & Admin inherit User
 * - Diagram 2 (Object Diagram): admin1 (A-101), gamer1 (G-201)
 * - Java AuthService.java: admin123, gamer123
 */
export const DEFAULT_ACCOUNTS = Object.freeze([
  {
    userId: 'A-101',
    username: 'admin_usman',
    password: 'admin123',
    role: 'Admin',
    email: 'admin@gaming.org',
    badge: 'A-101 ADMIN',
  },
  {
    userId: 'G-201',
    username: 'shadow_ninja',
    password: 'gamer123',
    role: 'Gamer',
    email: 'gamer1@gmail.com',
    badge: 'G-201 GAMER',
    playTimeHours: 45.5,
  },
]);

const REGISTERED_USERS_KEY = 'framepulse_registered_users_v2';

export function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Ignore storage parse error
  }
  return [];
}

function saveRegisteredUser(user) {
  try {
    const existing = getRegisteredUsers();
    const updated = [...existing.filter((u) => u.username.toLowerCase() !== user.username.toLowerCase()), user];
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage write error
  }
}

export async function authenticateUser(username, password) {
  const cleanUser = username?.trim().toLowerCase();
  if (!cleanUser || !password) {
    return { success: false, error: 'Please enter both username and password.' };
  }

  // 1. Check fixed system actors (admin_usman, shadow_ninja)
  const defaultFound = DEFAULT_ACCOUNTS.find(
    (acc) => acc.username.toLowerCase() === cleanUser && acc.password === password
  );
  if (defaultFound) {
    const { password: _, ...safeUser } = defaultFound;
    return { success: true, user: safeUser };
  }

  // 2. Check local registered users store
  const registered = getRegisteredUsers();
  const regFound = registered.find(
    (u) => u.username.toLowerCase() === cleanUser && u.password === password
  );
  if (regFound) {
    const { password: _, ...safeUser } = regFound;
    return { success: true, user: safeUser };
  }

  // 3. Check Supabase auth / users table if connected
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: supaUser } = await supabase
        .from('users')
        .select('*')
        .ilike('username', cleanUser)
        .maybeSingle();

      if (supaUser) {
        return {
          success: true,
          user: {
            userId: supaUser.user_id,
            username: supaUser.username,
            email: supaUser.email,
            role: supaUser.role || 'Gamer',
            badge: supaUser.badge || 'Verified Gamer',
          },
        };
      }
    } catch {
      // Fallback seamlessly
    }
  }

  return { success: false, error: 'Invalid username or password. Check credentials and retry.' };
}

export async function registerNewUser({ username, email, password }) {
  const cleanUser = username?.trim();
  const cleanEmail = email?.trim().toLowerCase();

  if (!cleanUser || cleanUser.length < 3) {
    return { success: false, error: 'Username must be at least 3 characters.' };
  }

  if (!password || password.length < 4) {
    return { success: false, error: 'Please enter a password with at least 4 characters.' };
  }

  // Disallow taking system actor usernames
  if (DEFAULT_ACCOUNTS.some((acc) => acc.username.toLowerCase() === cleanUser.toLowerCase())) {
    return { success: false, error: 'This username is reserved. Please pick another gamer tag.' };
  }

  const existingUsers = getRegisteredUsers();
  if (existingUsers.some((u) => u.username.toLowerCase() === cleanUser.toLowerCase())) {
    return { success: false, error: 'Gamer tag already registered. Please sign in or choose another.' };
  }

  const newUserId = `G-${202 + existingUsers.length}`;
  const newUser = {
    userId: newUserId,
    username: cleanUser,
    password: password.trim(),
    role: 'Gamer',
    email: cleanEmail || `${cleanUser.toLowerCase()}@framepulse.io`,
    badge: `${newUserId} GAMER`,
    playTimeHours: 0,
  };

  // Save to local registry
  saveRegisteredUser(newUser);

  // Sync to Supabase users table in background if configured
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('users').insert([
        {
          user_id: newUserId,
          username: cleanUser,
          email: newUser.email,
          role: 'Gamer',
          badge: `${newUserId} GAMER`,
          play_time_hours: 0,
        },
      ]);
    } catch {
      // Non-blocking
    }
  }

  const { password: _, ...safeUser } = newUser;
  return { success: true, user: safeUser };
}

// Fetch all data from Supabase
export async function fetchSupabaseData() {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data: gamesData, error: gamesErr } = await supabase
      .from('games')
      .select('*');

    if (gamesErr || !gamesData) return null;

    const { data: sessionsData } = await supabase
      .from('performance_sessions')
      .select('*');

    const { data: reviewsData } = await supabase
      .from('reviews')
      .select('*');

    return {
      games: gamesData,
      sessions: sessionsData || [],
      reviews: reviewsData || [],
    };
  } catch {
    return null;
  }
}

// Push a new session to Supabase
export async function syncSessionToSupabase(session) {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from('performance_sessions').insert([
      {
        log_id: session.logId,
        game_id: session.gameId,
        run_number: session.runNumber || '#01',
        player: session.player,
        hardware: session.hardware,
        resolution: session.resolution,
        avg_fps: session.fps,
        fps_1percent_low: session.low1Percent || session.fps * 0.85,
        cpu_usage: session.cpu,
        gpu_usage: session.gpu,
        vram_used: session.vram || '8.0 GB',
        stability_status: session.stability || 'Optimal',
        is_crashed: Boolean(session.crashed),
      },
    ]);
    return !error;
  } catch {
    return false;
  }
}

// Push a new review to Supabase
export async function syncReviewToSupabase(review) {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from('reviews').insert([
      {
        review_id: review.reviewId,
        game_id: review.gameId,
        player: review.player,
        rating: review.rating,
        comment: review.comment,
        status: review.status || 'PENDING',
        role_badge: review.roleBadge || 'Verified Gamer',
        submission_date: review.date || new Date().toISOString().split('T')[0],
      },
    ]);
    return !error;
  } catch {
    return false;
  }
}

// Moderate a review in Supabase
export async function moderateReviewInSupabase(reviewId, action) {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    if (action === 'DELETE') {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('review_id', reviewId);
      return !error;
    } else {
      const { error } = await supabase
        .from('reviews')
        .update({ status: action })
        .eq('review_id', reviewId);
      return !error;
    }
  } catch {
    return false;
  }
}

// Add a game to Supabase
export async function addGameToSupabase(game) {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from('games').insert([
      {
        game_id: game.gameId,
        title: game.title,
        genre: game.genre,
        release_date: game.releaseDate || '2023-11-15',
        engine_stack: game.engineStack || 'Vulkan 1.3',
        patch_version: game.patchVersion || 'v1.0',
        cover_url: game.coverUrl,
      },
    ]);
    return !error;
  } catch {
    return false;
  }
}
