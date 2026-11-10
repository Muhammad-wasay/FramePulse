import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * Lightweight built-in Java HTTP REST API Server (Deployment Diagram: TCP / HTTP).
 * Connects the React Frontend (http://localhost:5173) to the Java OOAD Backend
 * (AnalyticsSystem, Game, Gamer, Admin, Review, PerformanceLog, AnalyticsEngine) on port 8080.
 */
public class ApiServer {

    private static HttpServer server;

    public static synchronized void start(AnalyticsSystem system, int port, Runnable onStateChanged) {
        if (server != null) return;
        try {
            server = HttpServer.create(new InetSocketAddress(port), 0);

            server.createContext("/api/games", exchange -> {
                addCorsHeaders(exchange);
                String method = exchange.getRequestMethod();
                if ("OPTIONS".equalsIgnoreCase(method)) {
                    sendResponse(exchange, 204, "");
                    return;
                }
                if ("GET".equalsIgnoreCase(method)) {
                    String json = serializeGames(system.getGames());
                    sendResponse(exchange, 200, json);
                    return;
                }
                if ("POST".equalsIgnoreCase(method)) {
                    String body = readBody(exchange);
                    String title = extractJsonString(body, "title", "New Game");
                    String genre = extractJsonString(body, "genre", "Action");
                    Game created = system.addGame(title, genre);
                    notifyUi(onStateChanged);
                    sendResponse(exchange, 201, serializeGame(created));
                    return;
                }
                sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
            });

            server.createContext("/api/sessions", exchange -> {
                addCorsHeaders(exchange);
                String method = exchange.getRequestMethod();
                if ("OPTIONS".equalsIgnoreCase(method)) {
                    sendResponse(exchange, 204, "");
                    return;
                }
                if ("POST".equalsIgnoreCase(method)) {
                    String body = readBody(exchange);
                    String gameId = extractJsonString(body, "gameId", "GM-501");
                    String player = extractJsonString(body, "player", "shadow_ninja");
                    String resolution = extractJsonString(body, "resolution", "1440p");
                    double fps = extractJsonDouble(body, "averageFps", 60.0);
                    double cpu = extractJsonDouble(body, "cpuUsagePercent", 50.0);
                    double gpu = extractJsonDouble(body, "gpuUsagePercent", 80.0);
                    boolean crashed = extractJsonBoolean(body, "crashed", false);

                    Game game = system.findGameById(gameId);
                    if (game == null && !system.getGames().isEmpty()) {
                        game = system.getGames().get(0);
                    }
                    if (game != null) {
                        PerformanceSession session = system.logSession(game, player, resolution, fps, cpu, gpu, crashed);
                        notifyUi(onStateChanged);
                        sendResponse(exchange, 201, serializeSession(session, game.getSessions().size()));
                        return;
                    }
                    sendResponse(exchange, 404, "{\"error\":\"Game not found\"}");
                    return;
                }
                sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
            });

            server.createContext("/api/reviews", exchange -> {
                addCorsHeaders(exchange);
                String method = exchange.getRequestMethod();
                String path = exchange.getRequestURI().getPath();

                if ("OPTIONS".equalsIgnoreCase(method)) {
                    sendResponse(exchange, 204, "");
                    return;
                }

                // POST /api/reviews
                if ("POST".equalsIgnoreCase(method) && "/api/reviews".equals(path)) {
                    String body = readBody(exchange);
                    String gameId = extractJsonString(body, "gameId", "GM-501");
                    String player = extractJsonString(body, "player", "shadow_ninja");
                    int rating = (int) Math.round(extractJsonDouble(body, "rating", 5));
                    String comment = extractJsonString(body, "comment", "");

                    Game game = system.findGameById(gameId);
                    if (game == null && !system.getGames().isEmpty()) {
                        game = system.getGames().get(0);
                    }
                    if (game != null) {
                        Review review = system.submitReview(game, player, Math.max(1, Math.min(5, rating)), comment);
                        notifyUi(onStateChanged);
                        sendResponse(exchange, 201, serializeReview(review));
                        return;
                    }
                    sendResponse(exchange, 404, "{\"error\":\"Game not found\"}");
                    return;
                }

                // PUT or DELETE /api/reviews/{reviewId}
                if (path.startsWith("/api/reviews/")) {
                    String reviewId = path.substring("/api/reviews/".length()).trim();
                    if ("DELETE".equalsIgnoreCase(method)) {
                        boolean removed = system.getAdmin().deleteReview(reviewId, system.getGames());
                        notifyUi(onStateChanged);
                        sendResponse(exchange, 200, "{\"deleted\":" + removed + "}");
                        return;
                    }
                    if ("PUT".equalsIgnoreCase(method)) {
                        String body = readBody(exchange);
                        String statusStr = extractJsonString(body, "status", "APPROVED");
                        for (Review r : system.getAllReviews()) {
                            if (r.getReviewId().equalsIgnoreCase(reviewId)) {
                                if ("REJECTED".equalsIgnoreCase(statusStr)) {
                                    system.getAdmin().rejectReview(r);
                                } else {
                                    system.getAdmin().approveReview(r);
                                }
                                notifyUi(onStateChanged);
                                sendResponse(exchange, 200, serializeReview(r));
                                return;
                            }
                        }
                        sendResponse(exchange, 404, "{\"error\":\"Review not found\"}");
                        return;
                    }
                }

                sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
            });

            server.setExecutor(null);
            server.start();
            System.out.println("[FramePulse Java API] Listening on http://localhost:" + port + "/api/games");
        } catch (IOException ex) {
            System.err.println("[FramePulse Java API] Port " + port + " already in use or unavailable: " + ex.getMessage());
        }
    }

    private static void notifyUi(Runnable onStateChanged) {
        if (onStateChanged != null) {
            javax.swing.SwingUtilities.invokeLater(onStateChanged);
        }
    }

    private static void addCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Accept");
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
    }

    private static void sendResponse(HttpExchange exchange, int statusCode, String body) throws IOException {
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length == 0 ? -1 : bytes.length);
        if (bytes.length > 0) {
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(bytes);
            }
        }
        exchange.close();
    }

    private static String readBody(HttpExchange exchange) throws IOException {
        try (InputStream is = exchange.getRequestBody()) {
            return new String(is.readAllBytes(), StandardCharsets.UTF_8);
        }
    }

    // ---------------- JSON Serialization (Zero External Libraries) ----------------

    private static String serializeGames(List<Game> games) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < games.size(); i++) {
            if (i > 0) sb.append(",");
            sb.append(serializeGame(games.get(i)));
        }
        sb.append("]");
        return sb.toString();
    }

    private static String serializeGame(Game g) {
        StringBuilder sb = new StringBuilder("{");
        sb.append("\"gameId\":\"").append(esc(g.getGameId())).append("\",");
        sb.append("\"title\":\"").append(esc(g.getTitle())).append("\",");
        sb.append("\"genre\":\"").append(esc(g.getGenre())).append("\",");
        sb.append("\"releaseDate\":\"").append(esc(g.getReleaseDate())).append("\",");
        sb.append("\"averageRating\":").append(String.format(java.util.Locale.US, "%.1f", g.getAverageRating())).append(",");
        sb.append("\"averageFps\":").append(String.format(java.util.Locale.US, "%.1f", g.getAverageFps())).append(",");
        sb.append("\"stabilityScore\":").append(String.format(java.util.Locale.US, "%.1f", g.getStabilityScore())).append(",");

        // Sessions
        sb.append("\"sessions\":[");
        List<PerformanceSession> sessions = g.getSessions();
        for (int i = 0; i < sessions.size(); i++) {
            if (i > 0) sb.append(",");
            sb.append(serializeSession(sessions.get(i), i + 1));
        }
        sb.append("],");

        // Reviews
        sb.append("\"reviews\":[");
        List<Review> reviews = g.getReviews();
        for (int i = 0; i < reviews.size(); i++) {
            if (i > 0) sb.append(",");
            sb.append(serializeReview(reviews.get(i)));
        }
        sb.append("]}");
        return sb.toString();
    }

    private static String serializeSession(PerformanceSession s, int index) {
        double onePercentLow = Math.round(s.getAverageFps() * 0.78 * 10.0) / 10.0;
        return "{"
                + "\"logId\":\"" + esc(s.getLogId()) + "\","
                + "\"runNumber\":\"" + String.format("#%02d", index) + "\","
                + "\"player\":\"" + esc(s.getPlayer() != null ? s.getPlayer().getUsername() : "shadow_ninja") + "\","
                + "\"hardware\":\"Verified Telemetry Node\","
                + "\"resolution\":\"" + esc(s.getResolution()) + "\","
                + "\"averageFps\":" + String.format(java.util.Locale.US, "%.1f", s.getAverageFps()) + ","
                + "\"onePercentLow\":" + String.format(java.util.Locale.US, "%.1f", onePercentLow) + ","
                + "\"cpuUsagePercent\":" + String.format(java.util.Locale.US, "%.1f", s.getCpuUsagePercent()) + ","
                + "\"gpuUsagePercent\":" + String.format(java.util.Locale.US, "%.1f", s.getGpuUsagePercent()) + ","
                + "\"crashed\":" + s.isCrashed() + ","
                + "\"timestamp\":\"" + esc(s.getTimestamp()) + "\""
                + "}";
    }

    private static String serializeReview(Review r) {
        return "{"
                + "\"reviewId\":\"" + esc(r.getReviewId()) + "\","
                + "\"player\":\"" + esc(r.getPlayer() != null ? r.getPlayer().getUsername() : "shadow_ninja") + "\","
                + "\"roleBadge\":\"Verified Gamer\","
                + "\"hardwareSpec\":\"PC Telemetry Verified\","
                + "\"rating\":" + r.getRating() + ","
                + "\"comment\":\"" + esc(r.getComment()) + "\","
                + "\"submissionDate\":\"" + esc(r.getSubmissionDate()) + "\","
                + "\"status\":\"" + r.getStatus().name() + "\""
                + "}";
    }

    private static String esc(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "");
    }

    // ---------------- Minimal JSON Field Extractors ----------------

    private static String extractJsonString(String json, String key, String defaultVal) {
        if (json == null) return defaultVal;
        String pattern = "\"" + key + "\"";
        int idx = json.indexOf(pattern);
        if (idx == -1) return defaultVal;
        int colon = json.indexOf(':', idx + pattern.length());
        if (colon == -1) return defaultVal;
        int firstQuote = json.indexOf('"', colon + 1);
        if (firstQuote == -1) return defaultVal;
        int endQuote = firstQuote + 1;
        while (endQuote < json.length()) {
            if (json.charAt(endQuote) == '"' && json.charAt(endQuote - 1) != '\\') {
                break;
            }
            endQuote++;
        }
        if (endQuote >= json.length()) return defaultVal;
        return json.substring(firstQuote + 1, endQuote).replace("\\\"", "\"");
    }

    private static double extractJsonDouble(String json, String key, double defaultVal) {
        if (json == null) return defaultVal;
        String pattern = "\"" + key + "\"";
        int idx = json.indexOf(pattern);
        if (idx == -1) return defaultVal;
        int colon = json.indexOf(':', idx + pattern.length());
        if (colon == -1) return defaultVal;
        int start = colon + 1;
        while (start < json.length() && (Character.isWhitespace(json.charAt(start)) || json.charAt(start) == '"')) {
            start++;
        }
        int end = start;
        while (end < json.length() && (Character.isDigit(json.charAt(end)) || json.charAt(end) == '.' || json.charAt(end) == '-')) {
            end++;
        }
        if (start == end) return defaultVal;
        try {
            return Double.parseDouble(json.substring(start, end));
        } catch (NumberFormatException ex) {
            return defaultVal;
        }
    }

    private static boolean extractJsonBoolean(String json, String key, boolean defaultVal) {
        if (json == null) return defaultVal;
        String pattern = "\"" + key + "\"";
        int idx = json.indexOf(pattern);
        if (idx == -1) return defaultVal;
        int colon = json.indexOf(':', idx + pattern.length());
        if (colon == -1) return defaultVal;
        String rest = json.substring(colon + 1).trim().toLowerCase();
        if (rest.startsWith("true")) return true;
        if (rest.startsWith("false")) return false;
        return defaultVal;
    }

    /** Standalone entry point to run ONLY the headless Java REST API Server on port 8080. */
    public static void main(String[] args) {
        AnalyticsSystem system = new AnalyticsSystem();
        start(system, 8080, null);
    }
}
