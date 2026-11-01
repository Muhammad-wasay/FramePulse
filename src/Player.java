/**
 * Player alias extending Gamer so both diagram name (Gamer) and UI work seamlessly.
 */
public class Player extends Gamer {

    public Player(String userId, String username, String email, double playTimeHours) {
        super(userId, username, email, playTimeHours);
    }

    public Player(String userId, String username) {
        super(userId, username);
    }
}
