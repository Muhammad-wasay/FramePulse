/**
 * Possible states of a review.
 * PENDING  -> just submitted, waiting for admin
 * APPROVED -> visible on dashboard, counted in rating
 * REJECTED -> hidden
 */
public enum ReviewStatus {
    PENDING,
    APPROVED,
    REJECTED
}
