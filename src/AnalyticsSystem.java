import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Main controller & in-memory business logic repository.
 * Coordinates between UI, AuthService, DatabaseHandler, Games, Reviews, PerformanceLogs, and AnalyticsEngine.
 */
public class AnalyticsSystem {

    private List<Game> games = new ArrayList<>();
    private List<Player> players = new ArrayList<>();
    // Matches Object Diagram: admin1 : Admin (userId = "A-101", username = "admin_usman", email = "admin@gaming.org")
    private Admin admin = new Admin("A-101", "admin_usman", "admin@gaming.org");
    private AnalyticsEngine engine = AnalyticsEngine.getInstance();
    private AuthService authService = new AuthService();
    private DatabaseHandler databaseHandler = new DatabaseHandler(games, authService);

    // Counters matching Object Diagram IDs (GM-501, G-201, LOG-301, REV-901)
    private int nextGameNumber = 501;
    private int nextSessionNumber = 301;
    private int nextReviewNumber = 901;
    private int nextPlayerNumber = 201;

    public AnalyticsSystem() {
        // Wire up game lookup for the AnalyticsEngine
        engine.setGameLookup(this::findGameById);

        // Offline / guest demo data (replaced by Supabase data after login)
        loadSampleData();
    }

    public List<Game> getGames()                   { return games; }
    public List<Player> getPlayers()               { return players; }
    public Admin getAdmin()                        { return admin; }
    public AnalyticsEngine getEngine()             { return engine; }
    public AuthService getAuthService()            { return authService; }
    public DatabaseHandler getDatabaseHandler()    { return databaseHandler; }

    // ---------------- Authentication Operations ----------------

    /**
     * Diagram method: login(username, password) -> verifyCredentials()
     */
    public User login(String username, String password) {
        return authService.login(username, password);
    }

    /** Supabase login: sets the session user (Admin or Gamer) from the verified account. */
    public User loginRemote(String userId, String username, String email, String role) {
        return authService.loginRemote(userId, username, email, role);
    }

    /**
     * Diagram method: logout()
     * Ends the Supabase session and returns to guest demo data
     * so one user's data never stays on screen for the next person.
     */
    public void logout() {
        authService.logout();
        try {
            SupabaseClient.get().logout();
        } catch (Exception ignored) {
        }
        games.clear();
        players.clear();
        nextGameNumber = 501;
        nextSessionNumber = 301;
        nextReviewNumber = 901;
        nextPlayerNumber = 201;
        loadSampleData();
    }

    /**
     * Replaces the in-memory data with the rows downloaded from Supabase.
     * Returns false (and keeps current data) if the database has no games yet.
     * Must run on the Swing thread.
     */
    public boolean applySnapshot(DatabaseHandler.Snapshot snap) {
        if (snap == null || snap.games == null || snap.games.size() == 0) return false;

        games.clear();
        players.clear();
        nextGameNumber = 501;
        nextSessionNumber = 301;
        nextReviewNumber = 901;
        nextPlayerNumber = 201;

        Map<String, Game> byId = new LinkedHashMap<>();
        for (JsonElement e : snap.games) {
            JsonObject o = e.getAsJsonObject();
            String id = str(o, "id", "");
            Game g = new Game(id, str(o, "title", "Untitled"), str(o, "genre", ""),
                    str(o, "release_date", "2023-11-15"));
            byId.put(id, g);
            games.add(g);
            nextGameNumber = Math.max(nextGameNumber, numberOf(id) + 1);
        }

        for (JsonElement e : snap.logs) {
            JsonObject o = e.getAsJsonObject();
            Game g = byId.get(str(o, "game_id", ""));
            if (g == null) continue;
            String id = str(o, "id", "");
            String stamp = str(o, "created_at", "").replace('T', ' ');
            if (stamp.length() > 16) stamp = stamp.substring(0, 16);
            g.addSession(new PerformanceSession(id, getOrCreatePlayer(str(o, "player", "unknown")), g,
                    str(o, "resolution", ""), num(o, "fps"), num(o, "cpu"), num(o, "gpu"),
                    o.has("crashed") && !o.get("crashed").isJsonNull() && o.get("crashed").getAsBoolean(),
                    stamp));
            nextSessionNumber = Math.max(nextSessionNumber, numberOf(id) + 1);
        }

        for (JsonElement e : snap.reviews) {
            JsonObject o = e.getAsJsonObject();
            Game g = byId.get(str(o, "game_id", ""));
            if (g == null) continue;
            String id = str(o, "id", "");
            String date = str(o, "created_at", "");
            if (date.length() > 10) date = date.substring(0, 10);
            ReviewStatus status;
            try {
                status = ReviewStatus.valueOf(str(o, "status", "PENDING"));
            } catch (IllegalArgumentException ex) {
                status = ReviewStatus.PENDING;
            }
            g.addReview(new Review(id, getOrCreatePlayer(str(o, "player", "unknown")), g,
                    (int) num(o, "rating"), str(o, "comment", ""), date, status));
            nextReviewNumber = Math.max(nextReviewNumber, numberOf(id) + 1);
        }
        return true;
    }

    private static String str(JsonObject o, String key, String def) {
        return (o.has(key) && !o.get(key).isJsonNull()) ? o.get(key).getAsString() : def;
    }

    private static double num(JsonObject o, String key) {
        return (o.has(key) && !o.get(key).isJsonNull()) ? o.get(key).getAsDouble() : 0;
    }

    /** "REV-907" -> 907 (0 if there is no number). */
    private static int numberOf(String id) {
        int dash = id.lastIndexOf('-');
        try {
            return Integer.parseInt(id.substring(dash + 1));
        } catch (Exception e) {
            return 0;
        }
    }

    public User getCurrentUser() {
        return authService.getCurrentUser();
    }

    public boolean isAdminLoggedIn() {
        return authService.isAdmin();
    }

    // ---------------- Game Management Operations ----------------

    /**
     * Finds a game by its ID (e.g. "GM-501").
     */
    public Game findGameById(String gameId) {
        if (gameId == null) return null;
        for (Game g : games) {
            if (g.getGameId().equalsIgnoreCase(gameId.trim())) {
                return g;
            }
        }
        return null;
    }

    /** Use case: Admin adds a new game. */
    public Game addGame(String title, String genre) {
        Game game = new Game("GM-" + nextGameNumber, title, genre, "2023-11-15");
        nextGameNumber++;
        admin.addGame(game, games);
        databaseHandler.saveGame(game);
        return game;
    }

    /** Updates an existing game's details. */
    public boolean updateGame(String gameId, String newTitle, String newGenre) {
        Game game = findGameById(gameId);
        if (game != null) {
            // Note: Game fields title & genre are private, we keep encapsulation intact
            int index = games.indexOf(game);
            if (index != -1) {
                Game updated = new Game(game.getGameId(), newTitle, newGenre, game.getReleaseDate());
                // Preserve existing reviews and sessions
                for (PerformanceSession s : game.getSessions()) updated.addSession(s);
                for (Review r : game.getReviews()) updated.addReview(r);
                games.set(index, updated);
                databaseHandler.updateGame(updated);
                return true;
            }
        }
        return false;
    }

    /** Finds a player by name, or registers a new Gamer if not found. */
    public Player getOrCreatePlayer(String name) {
        for (Player p : players) {
            if (p.getName().equalsIgnoreCase(name)) {
                return p;
            }
        }
        Player player = new Player("G-" + nextPlayerNumber, name,
                name.toLowerCase().replace(" ", "_") + "@gmail.com", 45.5);
        nextPlayerNumber++;
        players.add(player);
        return player;
    }

    // ---------------- Performance Logging Operations ----------------

    /** Use case: Gamer logs a hardware performance session (LOG-301, LOG-302, ...). */
    public PerformanceSession logSession(Game game, String playerName, String resolution,
                                         double fps, double cpu, double gpu, boolean crashed) {
        Player player = getOrCreatePlayer(playerName);
        PerformanceSession session = new PerformanceSession(
                "LOG-" + nextSessionNumber, player, game, resolution, fps, cpu, gpu, crashed);
        nextSessionNumber++;
        databaseHandler.savePerformanceLog(game, session);
        return session;
    }

    // ---------------- Review Management Operations ----------------

    /** Use case: Gamer submits a review (REV-901, REV-902, ...). */
    public Review submitReview(Game game, String playerName, int rating, String comment) {
        Player player = getOrCreatePlayer(playerName);
        Review review = new Review("REV-" + nextReviewNumber, player, game, rating, comment,
                "2026-10-10", ReviewStatus.PENDING);
        nextReviewNumber++;
        databaseHandler.saveReview(game, review);
        return review;
    }

    /** Use case: Admin approves a pending review (saved to Supabase). */
    public void approveReview(Review review) {
        admin.approveReview(review);
        databaseHandler.updateReviewStatus(review);
    }

    /** Use case: Admin rejects a review (saved to Supabase). */
    public void rejectReview(Review review) {
        admin.rejectReview(review);
        databaseHandler.updateReviewStatus(review);
    }

    /** Use case: Admin deletes a toxic review. */
    public void deleteReview(Review review) {
        deleteReviewById(review.getReviewId());
    }

    /** Deletes by id from memory and from Supabase. */
    public boolean deleteReviewById(String reviewId) {
        boolean removed = admin.deleteReview(reviewId, games);
        if (removed) databaseHandler.deleteReview(reviewId);
        return removed;
    }

    /** All reviews across all games. */
    public List<Review> getAllReviews() {
        List<Review> all = new ArrayList<>();
        for (Game g : games) {
            all.addAll(g.getReviews());
        }
        return all;
    }

    public int getPendingReviewCount() {
        int count = 0;
        for (Review r : getAllReviews()) {
            if (r.getStatus() == ReviewStatus.PENDING) count++;
        }
        return count;
    }

    // ---------------- Sample data matching the Object Diagram ----------------

    private void loadSampleData() {
        // Object Diagram: cyberGame : Game (GM-501, "Cyber Odyssey", "Action", "2023-11-15")
        Game cyber = addGame("Cyber Odyssey", "Action");
        Game racers = addGame("Shadow Racers", "Racing");
        Game mystic = addGame("Mystic Realms", "Adventure");

        // Object Diagram: gamer1 : Gamer (G-201, "shadow_ninja", "gamer1@gmail.com", 45.5)
        Player gamer1 = getOrCreatePlayer("shadow_ninja");

        // Object Diagram: perfLog1 : PerformanceLog (LOG-301, 1440p, 72.4 FPS, CPU 64.0%, GPU 91.5%)
        logSession(cyber, "shadow_ninja", "1440p", 72.4, 64.0, 91.5, false);
        logSession(cyber, "ali_gamer", "1080p", 84.0, 58.0, 88.0, false);
        logSession(cyber, "sara_plays", "1440p", 60.8, 70.0, 95.0, false);

        logSession(racers, "sara_plays", "1080p", 120.0, 45.0, 70.0, false);
        logSession(racers, "hamza_x", "1440p", 101.0, 50.0, 82.0, false);

        logSession(mystic, "ahmed_pro", "1080p", 35.0, 85.0, 97.0, true);
        logSession(mystic, "shadow_ninja", "720p", 52.0, 78.0, 88.0, false);

        // Object Diagram: review1 : Review (REV-901, rating = 4, "Great story and visuals")
        admin.approveReview(submitReview(cyber, "shadow_ninja", 4, "Great story and visuals"));
        admin.approveReview(submitReview(cyber, "sara_plays", 5, "Runs smooth on 1440p, loved it!"));
        admin.approveReview(submitReview(cyber, "ali_gamer", 3, "Minor frame drops in crowded city scenes."));
        submitReview(cyber, "hamza_x", 4, "Combat feels nice. Needs more optimization.");

        admin.approveReview(submitReview(racers, "sara_plays", 5, "Best racing game this year."));
        submitReview(racers, "hamza_x", 2, "Too short, only 10 tracks.");

        admin.rejectReview(submitReview(mystic, "toxic_user", 1, "spam toxic review delete me"));
        submitReview(mystic, "shadow_ninja", 3, "Beautiful world but low FPS in forests.");
    }
}
