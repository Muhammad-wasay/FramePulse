/**
 * Admin class from the Class Diagram (inherits from User):
 *   + addGame(game)
 *   + deleteReview(reviewId)
 */
public class Admin extends User {

    public Admin(String userId, String username, String email) {
        super(userId, username, email);
    }

    public Admin(String userId, String username) {
        super(userId, username, "admin@gaming.org");
    }

    @Override
    public String getRole() {
        return "Admin";
    }

    /** Diagram method: + addGame(game) */
    public void addGame(Game game, java.util.List<Game> catalog) {
        catalog.add(game);
    }

    /** Diagram method: + deleteReview(reviewId) */
    public boolean deleteReview(String reviewId, java.util.List<Game> catalog) {
        for (Game g : catalog) {
            if (g.removeReview(reviewId)) {
                return true;
            }
        }
        return false;
    }

    public void approveReview(Review review) {
        review.setStatus(ReviewStatus.APPROVED);
    }

    public void rejectReview(Review review) {
        review.setStatus(ReviewStatus.REJECTED);
    }
}
