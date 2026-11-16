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

-- 4. Users Table (Authentication & OOAD Profiles: Admin & Gamer)
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150),
    role VARCHAR(50) NOT NULL DEFAULT 'Gamer',
    badge VARCHAR(50) DEFAULT 'Verified Gamer',
    play_time_hours NUMERIC(6, 1) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) but allow public read/insert for easy demo
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "Allow public read users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update users" ON users FOR UPDATE USING (true);

-- Seed Initial Games (matches OOAD Object Diagram and Catalog: GM-501 through GM-505)
INSERT INTO games (game_id, title, genre, release_date, engine_stack, patch_version, cover_url)
VALUES 
  ('GM-501', 'Cyber Odyssey', 'RPG', '2023-11-15', '2023 • REDengine 4.2 (Vulkan 1.3)', 'Patch v2.12a', 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0X2GHUAYEMTRrTWRQQlpyPqA_a7D1bWIW54hk2ugywnPw8lTkdUFBb5oakK2nP8GClCicSJuylmt7Vwb8VN19oaCksysm6_FzZSn3lKSug1LbMx-arn8cF7L17yjck2jZkZ_3Bc8PGSppkSe-k4T0vw7O4drShecxcXpzWLb8BDQ_PQzFkOYql98FtThJ2av8uR9QCV0zxAtQwA4taTTT3ujr5XGDB6fR_QWDbp8'),
  ('GM-502', 'Apex Overdrive', 'Racing', '2024-02-20', '2024 • Custom Chaos Engine (DX12)', 'Patch 1.8', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAq06WQSPaSrp6iKXvASSeUbqh97Ser3SVCMXXTg8Wa89FiuwmpbTu-DILgup4Ykv06G-WWMcJBifTRmMkedYjcmOw5xALIshtC4x5EISFFuVZQu_ddOhT7q6Iac0jkWwfJsms7gJ0BoDydM-MEN3qtFaJUZhM6N85Mj29zfrp1cKCDbbHdEAa9uxhN-Kj2w9dTSYtL8N_in83zRLuRSXVGAzJcAMnn3NDZqKR_V2E'),
  ('GM-503', 'Chronos Rift', 'Shooter', '2024-05-10', '2024 • Unreal Engine 5.3', 'Update 1.04', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBncisXrKUsgQQShZJR5QUNeE9EOFAuYetZNiz_r2g18TJIYeuM8aMMlh4xBOJ0JHlPPL_e-vP7R_VhgG9G59nio8zaHF-9tWak0FAtp8irzBy5ydmVwu9FXAs2eKclwNW8ovySUy2pubXzxIOwkTG7m8xhDynKivCOlKVPYwAzX-KijOmH3bI2BwRvXo4dMffAHvav0pT1tWYJhgSTqoDPnh2Ki-OIrtlQSYuh54w'),
  ('GM-504', 'Valkyrie Strike 2', 'Shooter', '2024-08-01', '2024 • Unity 6 DX12', 'Day 1 Release', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIe6sCFpnelxesiOUwxiV_5tMecLwZ8ySkRl5yDuSaknB8yZzPKj5ikgxQVzSs1qmFllg2IR1Zp21G168Dd5x0Chf5uEwoDrm9oX5UFCuPNEDdudDFbziNZi-9homFxJCGqHFWNAicBqtOiBgl5bp2MKI8XQ4bfyZ3zSYr2EKx0hfZzxOeWAtkMSxDSk5P2UA7Ft6xXjkEjvHWMw_FNFvwtqL_Y84pS7XYez3NCrg'),
  ('GM-505', 'Armored Core Horizon', 'Mecha Action', '2024-09-15', '2024 • Proprietary Ray Engine', 'v1.0.2', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwZcfjbxl2kbNMZzyyOkKu09SNhMsjvITylH-OBQHAOI4TIwbZ_FfVMjmrFRcdIhuIqtxx5gOaM9-dhO32OKK49fIzyRDr3nFXZHRK9rrT9KGxahw6ihSO5OxDra7yaJRQBG4ORf2qAyCdXI0RSbdqjBQh23-0KILKF0hbG2t1VAGPJ182FHsOawrrW3RsOf9Qf1HB6x2X29FIrTkRO5UHm_PiYl8nHNSWElD3_bI')
ON CONFLICT (game_id) DO NOTHING;

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

-- Seed 10 Real Community Reviews (Matches Supabase Database & Frontend)
INSERT INTO reviews (review_id, game_id, player, rating, comment, status, role_badge, submission_date)
VALUES 
  ('REV-901', 'GM-501', 'shadow_ninja', 4, 'Great story and visuals. Solid 1440p performance with minimal stutter.', 'APPROVED', 'Verified Rig', '2026-10-10'),
  ('REV-902', 'GM-501', 'mustafa_shah', 5, 'Super smooth 120 FPS on 1440p, zero stutter! Combat feels incredible.', 'APPROVED', 'Verified Rig', '2026-11-16'),
  ('REV-903', 'GM-501', 'usman_gamer', 4, 'Solid ray tracing performance. DLSS Quality gives consistent 75+ FPS in heavy city zones.', 'APPROVED', 'Overclocked Rig', '2026-11-15'),
  ('REV-904', 'GM-502', 'hamza_rigs', 5, 'Buttery smooth 144 FPS locked on 1080p Competitive preset. Zero frame pacing spikes.', 'APPROVED', 'High-FPS Rig', '2026-11-14'),
  ('REV-905', 'GM-501', 'zain_tech', 3, 'Good visuals but slight frame dips in night city downtown. Needs shader compilation optimization.', 'APPROVED', 'Budget Gamer', '2026-11-13'),
  ('REV-906', 'GM-503', 'bilal_fps', 5, 'Chronos Protocol runs like a dream on Unreal Engine 5. Lumen reflections are breathtaking.', 'APPROVED', 'Enthusiast Rig', '2026-11-12'),
  ('REV-907', 'GM-502', 'ali_raza', 4, 'High refresh rate gameplay is very responsive. No crashes in a 3-hour marathon session.', 'APPROVED', 'Verified Rig', '2026-11-11'),
  ('REV-908', 'GM-504', 'tariq_plays', 4, 'Solid 90 FPS on Ultra 1440p. Combat animations and frame pacing are super crisp.', 'APPROVED', 'Custom Rig', '2026-11-10'),
  ('REV-909', 'GM-501', 'ayesha_gaming', 5, 'Best RPG release of the year. Frame generation on RTX 40-series doubles the FPS cleanly.', 'APPROVED', 'Verified Rig', '2026-11-09'),
  ('REV-910', 'GM-503', 'fahad_bench', 3, 'Stuttering noticed when loading new procedural sectors. VRAM usage stays around 11GB on 4K.', 'PENDING', 'Benchmark Pro', '2026-11-08')
ON CONFLICT (review_id) DO NOTHING;

-- Seed Initial Users (Matches OOAD Object Diagram: A-101 admin_usman, G-201 shadow_ninja)
INSERT INTO users (user_id, username, email, role, badge, play_time_hours)
VALUES 
  ('A-101', 'admin_usman', 'admin@gaming.org', 'Admin', 'A-101 ADMIN', 120.0),
  ('G-201', 'shadow_ninja', 'gamer1@gmail.com', 'Gamer', 'G-201 GAMER', 45.5)
ON CONFLICT (user_id) DO NOTHING;
