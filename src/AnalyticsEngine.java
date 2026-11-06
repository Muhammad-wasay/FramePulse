import java.util.List;
import java.util.function.Function;

/**
 * AnalyticsEngine class from the Class, Sequence, Activity & Communication Diagrams.
 * Uses the Singleton Design Pattern:
 *   + calculateAverageRating(gameId)
 *   + calculateAverageFps(gameId)
 *   + getSystemStabilityScore(gameId)
 *   + generateGameReport(gameId)
 */
public class AnalyticsEngine {

    private static final AnalyticsEngine INSTANCE = new AnalyticsEngine();
    private int nextReportNumber = 1;
    private Function<String, Game> gameLookup;

    private AnalyticsEngine() {
    }

    public static AnalyticsEngine getInstance() {
        return INSTANCE;
    }

    /**
     * Registers a game lookup function (e.g. from AnalyticsSystem)
     * to resolve Game objects by their String gameId.
     */
    public void setGameLookup(Function<String, Game> lookup) {
        this.gameLookup = lookup;
    }

    // ---------------- UML Diagram Overloads (by String gameId) ----------------

    /** Diagram method: + calculateAverageRating(gameId) */
    public double calculateAverageRating(String gameId) {
        Game game = findGame(gameId);
        return calculateAverageRating(game);
    }

    /** Diagram method: + calculateAverageFps(gameId) */
    public double calculateAverageFps(String gameId) {
        Game game = findGame(gameId);
        return calculateAverageFps(game);
    }

    /** Diagram method: + getSystemStabilityScore(gameId) */
    public double getSystemStabilityScore(String gameId) {
        Game game = findGame(gameId);
        return getSystemStabilityScore(game);
    }

    /** Diagram method: + generateGameReport(gameId) */
    public Report generateGameReport(String gameId) {
        Game game = findGame(gameId);
        return generateGameReport(game);
    }

    // ---------------- Object-based Methods (Existing Compatibility) ----------------

    public double calculateAverageRating(Game game) {
        return game == null ? 0.0 : game.getAverageRating();
    }

    public double calculateAverageFps(Game game) {
        return game == null ? 0.0 : game.getAverageFps();
    }

    public double getSystemStabilityScore(Game game) {
        return game == null ? 0.0 : game.getStabilityScore();
    }

    public Report generateGameReport(Game game) {
        if (game == null) return null;
        String reportId = String.format("REP-%03d", nextReportNumber++);
        double score = getSystemStabilityScore(game);
        String summary = String.format("Solid performance with %.1f/5 user rating and %.1f avg FPS",
                calculateAverageRating(game), calculateAverageFps(game));
        return new Report(reportId, game, java.time.LocalDate.now().toString(), score, summary);
    }

    private Game findGame(String gameId) {
        if (gameId == null || gameLookup == null) {
            return null;
        }
        return gameLookup.apply(gameId);
    }
}
