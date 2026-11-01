/**
 * Abstract base class from the Class Diagram:
 *   # userId : String
 *   # username : String
 *   # email : String
 *   + login() : boolean
 *   + logout() : void
 */
public abstract class User {

    protected String userId;
    protected String username;
    protected String email;
    private boolean loggedIn;

    public User(String userId, String username, String email) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.loggedIn = false;
    }

    public User(String userId, String username) {
        this(userId, username, username.toLowerCase().replace(" ", "_") + "@gaming.org");
    }

    public boolean login() {
        this.loggedIn = true;
        return true;
    }

    public void logout() {
        this.loggedIn = false;
    }

    public boolean isLoggedIn() {
        return loggedIn;
    }

    public String getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    /** Alias used by UI tables. */
    public String getName() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public abstract String getRole();

    @Override
    public String toString() {
        return username + " (" + userId + ")";
    }
}
