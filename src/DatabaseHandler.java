import com.google.gson.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * DatabaseHandler class from the Sequence Diagram (4_sequence_diagram.puml)
 * and Component Diagram (7_component_diagram.puml - Data Access Layer).
 *
 * Data is kept in memory (for the Swing UI) and, when a user is logged in through
 * Supabase, every change is also written to the Supabase Postgres database.
 * Remote writes run on a background thread so the UI never freezes.
 *
 * Diagram methods:
 *   + verifyCredentials(username, password) : boolean
 *   + savePerformanceLog(game, log) : boolean
 *   + saveReview(game, review) : boolean
 *   + fetchAllReviews(gameId) : List<Review>
 *   + fetchAllLogs(gameId) : List<PerformanceSession>
 */
public class DatabaseHandler {

    /** Raw rows downloaded from Supabase. */
    public static class Snapshot {
        public JsonArray games, logs, reviews;
    }

    private interface RemoteTask { void run(SupabaseClient db) throws Exception; }

    private final List<Game> gamesStore;
    private final AuthService authService;
    private final ExecutorService io = Executors.newSingleThreadExecutor(r -> {
        Thread t = new Thread(r, "supabase-io");
        t.setDaemon(true);
        return t;
    });

    public DatabaseHandler(List<Game> gamesStore, AuthService authService) {
        this.gamesStore = gamesStore;
        this.authService = authService;
    }

    /** True only while a Supabase user is logged in. Guests stay purely in-memory. */
    public boolean isRemoteReady() {
        try {
            return SupabaseClient.get().isLoggedIn();
        } catch (Exception e) {
            return false;
        }
    }

    private void runRemote(String what, RemoteTask task) {
        if (!isRemoteReady()) return;
        io.execute(() -> {
            try {
                task.run(SupabaseClient.get());
            } catch (Exception ex) {
                System.err.println("[Supabase] " + what + " failed: " + ex.getMessage());
            }
        });
    }

    // ---------------- Download ----------------

    /** Downloads games, logs and reviews. Call from a background thread. */
    public Snapshot fetchSnapshot() throws Exception {
        SupabaseClient db = SupabaseClient.get();
        Snapshot s = new Snapshot();
        s.games = db.select("games", "select=*&order=id.asc");
        s.logs = db.select("performance_logs", "select=*&order=created_at.asc");
        s.reviews = db.select("reviews", "select=*&order=created_at.asc");
        return s;
    }

    // ---------------- Diagram methods ----------------

    /** Sequence Diagram Step 2: UI -> DB : verifyCredentials() */
    public boolean verifyCredentials(String username, String password) {
        return authService != null && authService.verifyCredentials(username, password);
    }

    /** Sequence Diagram Step 7: Game -> DB : savePerformanceLog() */
    public boolean savePerformanceLog(Game game, PerformanceLog log) {
        if (game == null || log == null) return false;
        game.recordPerformance(log);

        JsonObject row = new JsonObject();
        row.addProperty("id", log.getLogId());
        row.addProperty("game_id", game.getGameId());
        row.addProperty("player", log.getPlayer().getName());
        row.addProperty("resolution", log.getResolution());
        row.addProperty("fps", log.getAverageFps());
        row.addProperty("cpu", log.getCpuUsagePercent());
        row.addProperty("gpu", log.getGpuUsagePercent());
        row.addProperty("crashed", log.isCrashed());
        runRemote("save log " + log.getLogId(), db -> db.insert("performance_logs", row));
        return true;
    }

    /** Sequence Diagram Step 11: Game -> DB : saveReview() */
    public boolean saveReview(Game game, Review review) {
        if (game == null || review == null) return false;
        game.addReview(review);

        JsonObject row = new JsonObject();
        row.addProperty("id", review.getReviewId());
        row.addProperty("game_id", game.getGameId());
        row.addProperty("player", review.getPlayer().getName());
        row.addProperty("rating", review.getRating());
        row.addProperty("comment", review.getComment());
        row.addProperty("status", review.getStatus().name());
        runRemote("save review " + review.getReviewId(), db -> db.insert("reviews", row));
        return true;
    }

    /** Sequence Diagram Step 14: Engine -> DB : fetchAllReviews(gameId) */
    public List<Review> fetchAllReviews(String gameId) {
        Game game = findGame(gameId);
        if (game == null) return Collections.emptyList();
        return new ArrayList<>(game.getReviews());
    }

    /** Sequence Diagram Step 18: Engine -> DB : fetchAllLogs(gameId) */
    public List<PerformanceSession> fetchAllLogs(String gameId) {
        Game game = findGame(gameId);
        if (game == null) return Collections.emptyList();
        return new ArrayList<>(game.getSessions());
    }

    // ---------------- Extra remote writes ----------------

    public void saveGame(Game game) {
        JsonObject row = new JsonObject();
        row.addProperty("id", game.getGameId());
        row.addProperty("title", game.getTitle());
        row.addProperty("genre", game.getGenre());
        row.addProperty("release_date", game.getReleaseDate());
        runRemote("save game " + game.getGameId(), db -> db.insert("games", row));
    }

    public void updateGame(Game game) {
        JsonObject patch = new JsonObject();
        patch.addProperty("title", game.getTitle());
        patch.addProperty("genre", game.getGenre());
        runRemote("update game " + game.getGameId(),
                db -> db.update("games", "id=eq." + game.getGameId(), patch));
    }

    public void updateReviewStatus(Review review) {
        JsonObject patch = new JsonObject();
        patch.addProperty("status", review.getStatus().name());
        runRemote("update review " + review.getReviewId(),
                db -> db.update("reviews", "id=eq." + review.getReviewId(), patch));
    }

    public void deleteReview(String reviewId) {
        runRemote("delete review " + reviewId, db -> db.delete("reviews", "id=eq." + reviewId));
    }

    private Game findGame(String gameId) {
        if (gameId == null || gamesStore == null) return null;
        for (Game g : gamesStore) {
            if (g.getGameId().equalsIgnoreCase(gameId.trim())) {
                return g;
            }
        }
        return null;
    }
}
