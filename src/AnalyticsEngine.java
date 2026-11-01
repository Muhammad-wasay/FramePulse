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

    private AnalyticsEngine() {
    }

    public static AnalyticsEngine getInstance() {
        return INSTANCE;
    }

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
        String reportId = String.format("REP-%03d", nextReportNumber++);
        double score = getSystemStabilityScore(game);
        String summary = String.format("Solid performance with %.1f/5 user rating and %.1f avg FPS",
                calculateAverageRating(game), calculateAverageFps(game));
        return new Report(reportId, game, java.time.LocalDate.now().toString(), score, summary);
    }
}
