/**
 * Gamer class from the Class Diagram (inherits from User):
 *   - playTimeHours : double
 *   + submitReview(gameId, rating, comment)
 *   + logSession(gameId, fps, cpu, gpu)
 */
public class Gamer extends User {

    private double playTimeHours;

    public Gamer(String userId, String username, String email, double playTimeHours) {
        super(userId, username, email);
        this.playTimeHours = playTimeHours;
    }

    public Gamer(String userId, String username) {
        this(userId, username, username.toLowerCase().replace(" ", "_") + "@gmail.com", 12.0);
    }

    public double getPlayTimeHours() {
        return playTimeHours;
    }

    public void setPlayTimeHours(double playTimeHours) {
        this.playTimeHours = playTimeHours;
    }

    /** Diagram method: + submitReview(gameId, rating, comment) */
    public Review submitReview(Game game, String reviewId, int rating, String comment) {
        Review review = new Review(reviewId, this, game, rating, comment);
        game.addReview(review);
        return review;
    }

    /** Diagram method: + logSession(gameId, fps, cpu, gpu) */
    public PerformanceLog logSession(Game game, String logId, String resolution,
                                     double fps, double cpu, double gpu, boolean crashed) {
        PerformanceLog log = new PerformanceLog(logId, this, game, resolution, fps, cpu, gpu, crashed);
        game.recordPerformance(log);
        return log;
    }

    @Override
    public String getRole() {
        return "Gamer";
    }
}
