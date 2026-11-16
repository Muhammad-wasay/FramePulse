-- ========================================================
-- FramePulse - Supabase PostgreSQL Schema
-- Run this in Supabase Dashboard -> SQL Editor -> New query
-- ========================================================

-- 1. Games Table
CREATE TABLE IF NOT EXISTS games (
    game_id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    genre VARCHAR(50) NOT NULL,
    release_date VARCHAR(50) DEFAULT '2023-11-15',
    engine_stack VARCHAR(150) DEFAULT 'DirectX 12 / Vulkan',
    patch_version VARCHAR(50) DEFAULT 'v1.0',
    cover_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Performance Sessions (Hardware Telemetry Logs)
CREATE TABLE IF NOT EXISTS performance_sessions (
    log_id VARCHAR(50) PRIMARY KEY,
    game_id VARCHAR(50) REFERENCES games(game_id) ON DELETE CASCADE,
    run_number VARCHAR(20) DEFAULT '#01',
    player VARCHAR(100) NOT NULL DEFAULT 'Verified Gamer',
    hardware VARCHAR(150) DEFAULT 'RTX 4080 • i7-13700K',
    resolution VARCHAR(50) DEFAULT '1440p',
    avg_fps NUMERIC(6, 2) NOT NULL,
    fps_1percent_low NUMERIC(6, 2),
    cpu_usage NUMERIC(5, 2) DEFAULT 50.0,
    gpu_usage NUMERIC(5, 2) DEFAULT 80.0,
    vram_used VARCHAR(50) DEFAULT '8.2 GB',
    stability_status VARCHAR(50) DEFAULT 'Rock-solid',
    is_crashed BOOLEAN DEFAULT FALSE,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Reviews Table (Player Reviews + Admin Moderation)
CREATE TABLE IF NOT EXISTS reviews (
    review_id VARCHAR(50) PRIMARY KEY,
    game_id VARCHAR(50) REFERENCES games(game_id) ON DELETE CASCADE,
    player VARCHAR(100) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    role_badge VARCHAR(50) DEFAULT 'Verified Gamer',
    submission_date VARCHAR(50) DEFAULT CURRENT_DATE::TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) but allow public read/insert for easy demo
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public access policies (Demo friendly)
CREATE POLICY "Allow public read games" ON games FOR SELECT USING (true);
CREATE POLICY "Allow public insert games" ON games FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update games" ON games FOR UPDATE USING (true);

CREATE POLICY "Allow public read sessions" ON performance_sessions FOR SELECT USING (true);
CREATE POLICY "Allow public insert sessions" ON performance_sessions FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Allow public insert reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update reviews" ON reviews FOR UPDATE USING (true);
CREATE POLICY "Allow public delete reviews" ON reviews FOR DELETE USING (true);

-- Seed Initial Game (matches OOAD Object Diagram: GM-501 Cyber Odyssey)
INSERT INTO games (game_id, title, genre, release_date, engine_stack, patch_version, cover_url)
VALUES (
    'GM-501',
    'Cyber Odyssey',
    'RPG',
    '2023-11-15',
    '2023 • REDengine 4.2 (Vulkan 1.3)',
    'Patch v2.12a',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA0X2GHUAYEMTRrTWRQQlpyPqA_a7D1bWIW54hk2ugywnPw8lTkdUFBb5oakK2nP8GClCicSJuylmt7Vwb8VN19oaCksysm6_FzZSn3lKSug1LbMx-arn8cF7L17yjck2jZkZ_3Bc8PGSppkSe-k4T0vw7O4drShecxcXpzWLb8BDQ_PQzFkOYql98FtThJ2av8uR9QCV0zxAtQwA4taTTT3ujr5XGDB6fR_QWDbp8'
) ON CONFLICT (game_id) DO NOTHING;

-- Seed Performance Log (LOG-301)
INSERT INTO performance_sessions (log_id, game_id, run_number, player, hardware, resolution, avg_fps, fps_1percent_low, cpu_usage, gpu_usage, vram_used, stability_status, is_crashed)
VALUES (
    'LOG-301',
    'GM-501',
    '#01',
    'shadow_ninja',
    'RTX 4090 • Core i9-13900K',
    '1440p',
    72.4,
    64.0,
    64.0,
    91.5,
    '12.4 GB',
    'Rock-solid',
    false
) ON CONFLICT (log_id) DO NOTHING;

-- Seed Review (REV-901)
INSERT INTO reviews (review_id, game_id, player, rating, comment, status, role_badge, submission_date)
VALUES (
    'REV-901',
    'GM-501',
    'shadow_ninja',
    4,
    'Great story and visuals. Solid 1440p performance with minimal stutter.',
    'APPROVED',
    'Verified Rig',
    '2026-10-10'
) ON CONFLICT (review_id) DO NOTHING;
