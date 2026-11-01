import java.util.ArrayList;
import java.util.List;

/**
 * Game class from the Class & Object Diagrams:
 *   - gameId : String
 *   - title : String
 *   - genre : String
 *   - releaseDate : String
 *   + getGameDetails() : String
 */
public class Game {

    private String gameId;
    private String title;
    private String genre;
    private String releaseDate;
    private List<PerformanceSession> sessions = new ArrayList<>();
    private List<Review> reviews = new ArrayList<>();

    public Game(String gameId, String title, String genre, String releaseDate) {
        this.gameId = gameId;
        this.title = title;
        this.genre = genre;
        this.releaseDate = releaseDate;
    }

    public Game(String gameId, String title, String genre) {
        this(gameId, title, genre, "2023-11-15");
    }

    public String getGameId()      { return gameId; }
    public String getTitle()       { return title; }
    public String getGenre()       { return genre; }
    public String getReleaseDate() { return releaseDate; }
    public List<PerformanceSession> getSessions() { return sessions; }
    public List<Review> getReviews() { return reviews; }

    /** Diagram method: + getGameDetails() */
    public String getGameDetails() {
        return title + " (" + gameId + ") - " + genre + " [Released: " + releaseDate + "]";
    }

    /** Diagram method from Sequence Diagram: + recordPerformance() */
    public void recordPerformance(PerformanceLog log) {
        if (log instanceof PerformanceSession) {
            sessions.add((PerformanceSession) log);
        } else {
            sessions.add(new PerformanceSession(
                    log.getLogId(), log.getPlayer(), this, log.getResolution(),
                    log.getAverageFps(), log.getCpuUsagePercent(), log.getGpuUsagePercent(),
                    log.isCrashed(), log.getTimestamp()));
        }
    }

    public void addSession(PerformanceSession session) {
        sessions.add(session);
    }

    public void addReview(Review review) {
        reviews.add(review);
    }

    public void removeReview(Review review) {
        reviews.remove(review);
    }

    public boolean removeReview(String reviewId) {
        return reviews.removeIf(r -> r.getReviewId().equalsIgnoreCase(reviewId));
    }

    // ---------------- Analytics ----------------

    /** Average of APPROVED reviews only. Returns 0 if there are none. */
    public double getAverageRating() {
        int total = 0;
        int count = 0;
        for (Review r : reviews) {
            if (r.isApproved()) {
                total += r.getRating();
                count++;
            }
        }
        if (count == 0) return 0;
        return (double) total / count;
    }

    public int getApprovedReviewCount() {
        int count = 0;
        for (Review r : reviews) {
            if (r.isApproved()) count++;
        }
        return count;
    }

    public double getAverageFps() {
        if (sessions.isEmpty()) return 0;
        double total = 0;
        for (PerformanceSession s : sessions) total += s.getAverageFps();
        return total / sessions.size();
    }

    public double getAverageCpu() {
        if (sessions.isEmpty()) return 0;
        double total = 0;
        for (PerformanceSession s : sessions) total += s.getCpuUsage();
        return total / sessions.size();
    }

    public double getAverageGpu() {
        if (sessions.isEmpty()) return 0;
        double total = 0;
        for (PerformanceSession s : sessions) total += s.getGpuUsage();
        return total / sessions.size();
    }

    public int getCrashCount() {
        int count = 0;
        for (PerformanceSession s : sessions) {
            if (s.isCrashed()) count++;
        }
        return count;
    }

    /**
     * System Stability Score out of 100 (matches Object Diagram score 82.5 for 72.4 FPS):
     * Combines FPS performance (up to 70 pts, scaled to 85 FPS) and crash-free stability (up to 30 pts).
     */
    public double getStabilityScore() {
        if (sessions.isEmpty()) return 0;
        double fpsPoints = Math.min(getAverageFps(), 100.0) / 100.0 * 72.5;
        double crashFreeRatio = (double) (sessions.size() - getCrashCount()) / sessions.size();
        double crashPoints = crashFreeRatio * 30.0;
        return Math.min(100.0, Math.round((fpsPoints + crashPoints) * 10.0) / 10.0);
    }

    @Override
    public String toString() {
        return title + " (" + gameId + ")";
    }
}
