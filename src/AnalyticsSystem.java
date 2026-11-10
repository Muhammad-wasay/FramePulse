import java.util.ArrayList;
import java.util.List;

/**
 * Main controller & in-memory business logic repository.
 * Coordinates between UI, AuthService, DatabaseHandler, Games, Reviews, PerformanceLogs, and AnalyticsEngine.
 */
public class AnalyticsSystem {

    private List<Game> games = new ArrayList<>();
    private List<Player> players = new ArrayList<>();
    // Matches Object Diagram: admin1 : Admin (userId = "A-101", username = "admin_usman", email = "admin@gaming.org")
    private Admin admin = new Admin("A-101", "admin_usman", "admin@gaming.org");
    private AnalyticsEngine engine = AnalyticsEngine.getInstance();
    private AuthService authService = new AuthService();
    private DatabaseHandler databaseHandler = new DatabaseHandler(games, authService);

    // Counters matching Object Diagram IDs (GM-501, G-201, LOG-301, REV-901)
    private int nextGameNumber = 501;
    private int nextSessionNumber = 301;
    private int nextReviewNumber = 901;
    private int nextPlayerNumber = 201;

    public AnalyticsSystem() {
        // Wire up game lookup for the AnalyticsEngine
        engine.setGameLookup(this::findGameById);

        // Register default admin in auth service
        authService.registerUser(admin, "admin123");

        // Load predefined data from Object Diagram
        loadSampleData();

        // Default login as admin (or current active session)
        authService.login("admin_usman", "admin123");
    }

    public List<Game> getGames()                   { return games; }
    public List<Player> getPlayers()               { return players; }
    public Admin getAdmin()                        { return admin; }
    public AnalyticsEngine getEngine()             { return engine; }
    public AuthService getAuthService()            { return authService; }
    public DatabaseHandler getDatabaseHandler()    { return databaseHandler; }

    // ---------------- Authentication Operations ----------------

    /**
     * Diagram method: login(username, password) -> verifyCredentials()
     */
    public User login(String username, String password) {
        return authService.login(username, password);
    }

    /**
     * Diagram method: logout()
     */
    public void logout() {
        authService.logout();
    }

    public User getCurrentUser() {
        return authService.getCurrentUser();
    }

    public boolean isAdminLoggedIn() {
        return authService.isAdmin();
    }

    // ---------------- Game Management Operations ----------------

    /**
     * Finds a game by its ID (e.g. "GM-501").
     */
    public Game findGameById(String gameId) {
        if (gameId == null) return null;
        for (Game g : games) {
            if (g.getGameId().equalsIgnoreCase(gameId.trim())) {
                return g;
            }
        }
        return null;
    }

    /** Use case: Admin adds a new game. */
    public Game addGame(String title, String genre) {
        Game game = new Game("GM-" + nextGameNumber, title, genre, "2023-11-15");
        nextGameNumber++;
        admin.addGame(game, games);
        return game;
    }

    /** Updates an existing game's details. */
    public boolean updateGame(String gameId, String newTitle, String newGenre) {
        Game game = findGameById(gameId);
        if (game != null) {
            // Note: Game fields title & genre are private, we keep encapsulation intact
            int index = games.indexOf(game);
            if (index != -1) {
                Game updated = new Game(game.getGameId(), newTitle, newGenre, game.getReleaseDate());
                // Preserve existing reviews and sessions
                for (PerformanceSession s : game.getSessions()) updated.addSession(s);
                for (Review r : game.getReviews()) updated.addReview(r);
                games.set(index, updated);
                return true;
            }
        }
        return false;
    }

    /** Finds a player by name, or registers a new Gamer if not found. */
    public Player getOrCreatePlayer(String name) {
        for (Player p : players) {
            if (p.getName().equalsIgnoreCase(name)) {
                return p;
            }
        }
        Player player = new Player("G-" + nextPlayerNumber, name,
                name.toLowerCase().replace(" ", "_") + "@gmail.com", 45.5);
        nextPlayerNumber++;
        players.add(player);
        // Register in auth service so newly created gamers can also log in
        authService.registerUser(player, "gamer123");
        return player;
    }

    // ---------------- Performance Logging Operations ----------------

    /** Use case: Gamer logs a hardware performance session (LOG-301, LOG-302, ...). */
    public PerformanceSession logSession(Game game, String playerName, String resolution,
                                         double fps, double cpu, double gpu, boolean crashed) {
        Player player = getOrCreatePlayer(playerName);
        PerformanceSession session = new PerformanceSession(
                "LOG-" + nextSessionNumber, player, game, resolution, fps, cpu, gpu, crashed);
        nextSessionNumber++;
        databaseHandler.savePerformanceLog(game, session);
        return session;
    }

    // ---------------- Review Management Operations ----------------

    /** Use case: Gamer submits a review (REV-901, REV-902, ...). */
    public Review submitReview(Game game, String playerName, int rating, String comment) {
        Player player = getOrCreatePlayer(playerName);
        Review review = new Review("REV-" + nextReviewNumber, player, game, rating, comment,
                "2026-10-10", ReviewStatus.PENDING);
        nextReviewNumber++;
        databaseHandler.saveReview(game, review);
        return review;
    }

    /** Use case: Admin deletes a toxic review. */
    public void deleteReview(Review review) {
        admin.deleteReview(review.getReviewId(), games);
    }

    /** All reviews across all games. */
    public List<Review> getAllReviews() {
        List<Review> all = new ArrayList<>();
        for (Game g : games) {
            all.addAll(g.getReviews());
        }
        return all;
    }

    public int getPendingReviewCount() {
        int count = 0;
        for (Review r : getAllReviews()) {
            if (r.getStatus() == ReviewStatus.PENDING) count++;
        }
        return count;
    }

    // ---------------- Sample data matching the Object Diagram ----------------

    private void loadSampleData() {
        // Object Diagram: cyberGame : Game (GM-501, "Cyber Odyssey", "Action", "2023-11-15")
        Game cyber = addGame("Cyber Odyssey", "Action");
        Game racers = addGame("Shadow Racers", "Racing");
        Game mystic = addGame("Mystic Realms", "Adventure");

        // Object Diagram: gamer1 : Gamer (G-201, "shadow_ninja", "gamer1@gmail.com", 45.5)
        Player gamer1 = getOrCreatePlayer("shadow_ninja");
        authService.registerUser(gamer1, "gamer123");
        gamer1.login();

        // Object Diagram: perfLog1 : PerformanceLog (LOG-301, 1440p, 72.4 FPS, CPU 64.0%, GPU 91.5%)
        logSession(cyber, "shadow_ninja", "1440p", 72.4, 64.0, 91.5, false);
        logSession(cyber, "ali_gamer", "1080p", 84.0, 58.0, 88.0, false);
        logSession(cyber, "sara_plays", "1440p", 60.8, 70.0, 95.0, false);

        logSession(racers, "sara_plays", "1080p", 120.0, 45.0, 70.0, false);
        logSession(racers, "hamza_x", "1440p", 101.0, 50.0, 82.0, false);

        logSession(mystic, "ahmed_pro", "1080p", 35.0, 85.0, 97.0, true);
        logSession(mystic, "shadow_ninja", "720p", 52.0, 78.0, 88.0, false);

        // Object Diagram: review1 : Review (REV-901, rating = 4, "Great story and visuals")
        admin.approveReview(submitReview(cyber, "shadow_ninja", 4, "Great story and visuals"));
        admin.approveReview(submitReview(cyber, "sara_plays", 5, "Runs smooth on 1440p, loved it!"));
        admin.approveReview(submitReview(cyber, "ali_gamer", 3, "Minor frame drops in crowded city scenes."));
        submitReview(cyber, "hamza_x", 4, "Combat feels nice. Needs more optimization.");

        admin.approveReview(submitReview(racers, "sara_plays", 5, "Best racing game this year."));
        submitReview(racers, "hamza_x", 2, "Too short, only 10 tracks.");

        admin.rejectReview(submitReview(mystic, "toxic_user", 1, "spam toxic review delete me"));
        submitReview(mystic, "shadow_ninja", 3, "Beautiful world but low FPS in forests.");
    }
}
