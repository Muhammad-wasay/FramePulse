import java.util.HashMap;
import java.util.Map;

/**
 * Authentication Component from Component, Sequence & Activity Diagrams.
 * Manages user credentials, authentication verification, and current active session.
 * 
 * Sequence Diagram:
 *   Gamer -> UI : login(userName, password)
 *   UI -> DB/AuthService : verifyCredentials()
 *   AuthService --> UI : Success
 *   UI --> Gamer : Login Successful
 */
public class AuthService {

    private Map<String, String> credentials = new HashMap<>();
    private Map<String, User> userRegistry = new HashMap<>();
    private User currentUser;

    public AuthService() {
        initDefaultAccounts();
    }

    /**
     * Initializes default accounts matching the Object Diagram:
     * - Admin: admin_usman (A-101)
     * - Gamer: shadow_ninja (G-201)
     */
    private void initDefaultAccounts() {
        // Admin from Object Diagram
        Admin admin = new Admin("A-101", "admin_usman", "admin@gaming.org");
        registerUser(admin, "admin123");

        // Gamer from Object Diagram
        Player gamer = new Player("G-201", "shadow_ninja", "gamer1@gmail.com", 45.5);
        registerUser(gamer, "gamer123");
    }

    /**
     * Registers a new user with credentials into the in-memory store.
     */
    public void registerUser(User user, String password) {
        String key = user.getUsername().toLowerCase();
        credentials.put(key, password);
        userRegistry.put(key, user);
    }

    /**
     * Diagram method: verifyCredentials(username, password)
     * Verifies provided credentials against in-memory user registry.
     */
    public boolean verifyCredentials(String username, String password) {
        if (username == null || password == null) {
            return false;
        }
        String key = username.trim().toLowerCase();
        if (!credentials.containsKey(key)) {
            return false;
        }
        return credentials.get(key).equals(password);
    }

    /**
     * Diagram method: login(username, password)
     * Authenticates the user and sets the current session.
     */
    public User login(String username, String password) {
        if (verifyCredentials(username, password)) {
            String key = username.trim().toLowerCase();
            User user = userRegistry.get(key);
            user.login();
            this.currentUser = user;
            return user;
        }
        return null;
    }

    /**
     * Diagram method: logout()
     * Logs out the current user and clears active session.
     */
    public void logout() {
        if (currentUser != null) {
            currentUser.logout();
            currentUser = null;
        }
    }

    public User getCurrentUser() {
        return currentUser;
    }

    public boolean isAuthenticated() {
        return currentUser != null && currentUser.isLoggedIn();
    }

    public boolean isAdmin() {
        return currentUser instanceof Admin;
    }

    public User getUserByUsername(String username) {
        if (username == null) return null;
        return userRegistry.get(username.trim().toLowerCase());
    }
}
