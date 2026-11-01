import java.time.LocalDate;

/**
 * Review class from the Class Diagram:
 *   - reviewId : String
 *   - comment : String
 *   - rating : int
 *   - submissionDate : String
 *   + getReviewSummary() : String
 */
public class Review {

    private String reviewId;
    private Player player;
    private Game game;
    private int rating;          // 1 to 5
    private String comment;
    private String submissionDate;
    private ReviewStatus status;
    private LocalDate date;

    public Review(String reviewId, Gamer gamer, Game game, int rating, String comment) {
        this(reviewId,
             gamer instanceof Player ? (Player) gamer : new Player(gamer.getUserId(), gamer.getUsername()),
             game, rating, comment, LocalDate.now().toString(), ReviewStatus.APPROVED);
    }

    public Review(String reviewId, Player player, Game game, int rating, String comment,
                  String submissionDate, ReviewStatus status) {
        this.reviewId = reviewId;
        this.player = player;
        this.game = game;
        this.rating = rating;
        this.comment = comment;
        this.submissionDate = submissionDate;
        this.status = status;
        this.date = LocalDate.now();
    }

    /** Diagram method: + getReviewSummary() */
    public String getReviewSummary() {
        return reviewId + " (" + rating + "/5 by " + player.getUsername() + "): " + comment;
    }

    public String getReviewId()       { return reviewId; }
    public Player getPlayer()         { return player; }
    public Game getGame()             { return game; }
    public int getRating()            { return rating; }
    public String getComment()        { return comment; }
    public String getSubmissionDate() { return submissionDate; }
    public ReviewStatus getStatus()   { return status; }
    public LocalDate getDate()        { return date; }

    public void setStatus(ReviewStatus status) {
        this.status = status;
    }

    public boolean isApproved() {
        return status == ReviewStatus.APPROVED;
    }
}
