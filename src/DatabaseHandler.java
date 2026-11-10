import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * DatabaseHandler class from the Sequence Diagram (4_sequence_diagram.puml)
 * and Component Diagram (7_component_diagram.puml - Data Access Layer).
 *
 * Diagram methods:
 *   + verifyCredentials(username, password) : boolean
 *   + savePerformanceLog(game, log) : boolean
 *   + saveReview(game, review) : boolean
 *   + fetchAllReviews(gameId) : List<Review>
 *   + fetchAllLogs(gameId) : List<PerformanceSession>
 */
public class DatabaseHandler {

    private final List<Game> gamesStore;
    private final AuthService authService;

    public DatabaseHandler(List<Game> gamesStore, AuthService authService) {
        this.gamesStore = gamesStore;
        this.authService = authService;
    }

    /** Sequence Diagram Step 2: UI -> DB : verifyCredentials() */
    public boolean verifyCredentials(String username, String password) {
        return authService != null && authService.verifyCredentials(username, password);
    }

    /** Sequence Diagram Step 7: Game -> DB : savePerformanceLog() */
    public boolean savePerformanceLog(Game game, PerformanceLog log) {
        if (game == null || log == null) return false;
        game.recordPerformance(log);
        return true;
    }

    /** Sequence Diagram Step 11: Game -> DB : saveReview() */
    public boolean saveReview(Game game, Review review) {
        if (game == null || review == null) return false;
        game.addReview(review);
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
