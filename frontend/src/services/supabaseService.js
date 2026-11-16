import { supabase, isSupabaseConfigured } from './supabaseClient';

/**
 * OOAD Default User Accounts matching:
 * - Diagram 1 (Class Diagram): Gamer & Admin inherit User
 * - Diagram 2 (Object Diagram): admin1 (A-101), gamer1 (G-201)
 * - Java AuthService.java: admin123, gamer123
 */
export const DEFAULT_ACCOUNTS = [
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
];

export async function authenticateUser(username, password) {
  const cleanUser = username?.trim().toLowerCase();
  const found = DEFAULT_ACCOUNTS.find(
    (acc) =>
      acc.username.toLowerCase() === cleanUser && acc.password === password
  );

  if (found) {
    const { password: _, ...safeUser } = found;
    return { success: true, user: safeUser };
  }

  // Also check if user registered in Supabase auth if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username,
        password: password,
      });
      if (!error && data?.user) {
        return {
          success: true,
          user: {
            userId: data.user.id.slice(0, 8),
            username: data.user.email.split('@')[0],
            email: data.user.email,
            role: data.user.user_metadata?.role || 'Gamer',
            badge: data.user.user_metadata?.role === 'Admin' ? 'ADMIN' : 'GAMER',
          },
        };
      }
    } catch {
      // Ignore network errors and return failure
    }
  }

  return { success: false, error: 'Invalid username or password. Check credentials and retry.' };
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
