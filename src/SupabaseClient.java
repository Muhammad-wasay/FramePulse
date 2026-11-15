import com.google.gson.*;
import java.io.FileInputStream;
import java.net.URI;
import java.net.http.*;
import java.util.Properties;

/**
 * Thin Supabase client (Auth + PostgREST) built on java.net.http.
 * Reads SUPABASE_URL and SUPABASE_ANON_KEY from config.properties.
 */
public class SupabaseClient {
    private static SupabaseClient instance;
    private final HttpClient http = HttpClient.newHttpClient();
    private final String url, anonKey;
    private volatile String accessToken;
    private volatile JsonObject currentUser;

    private SupabaseClient() throws Exception {
        Properties p = new Properties();
        try (FileInputStream in = new FileInputStream("config.properties")) {
            p.load(in);
        }
        url = p.getProperty("SUPABASE_URL").trim();
        anonKey = p.getProperty("SUPABASE_ANON_KEY").trim();
    }

    public static synchronized SupabaseClient get() throws Exception {
        if (instance == null) instance = new SupabaseClient();
        return instance;
    }

    private HttpRequest.Builder req(String path) {
        HttpRequest.Builder b = HttpRequest.newBuilder(URI.create(url + path))
            .header("apikey", anonKey)
            .header("Content-Type", "application/json");
        String token = accessToken;
        if (token != null) b.header("Authorization", "Bearer " + token);
        return b;
    }

    private String credentialsBody(String email, String password) {
        JsonObject o = new JsonObject();
        o.addProperty("email", email);
        o.addProperty("password", password);
        return o.toString();
    }

    // ---------- AUTH ----------
    public boolean signUp(String email, String password) throws Exception {
        HttpResponse<String> r = http.send(
            req("/auth/v1/signup").POST(HttpRequest.BodyPublishers.ofString(credentialsBody(email, password))).build(),
            HttpResponse.BodyHandlers.ofString());
        if (r.statusCode() != 200) System.err.println("Signup error: " + r.body());
        return r.statusCode() == 200;
    }

    public boolean login(String email, String password) throws Exception {
        HttpResponse<String> r = http.send(
            req("/auth/v1/token?grant_type=password")
                .POST(HttpRequest.BodyPublishers.ofString(credentialsBody(email, password))).build(),
            HttpResponse.BodyHandlers.ofString());
        if (r.statusCode() != 200) {
            System.err.println("Login error: " + r.body());
            return false;
        }
        JsonObject json = JsonParser.parseString(r.body()).getAsJsonObject();
        accessToken = json.get("access_token").getAsString();
        currentUser = json.getAsJsonObject("user");
        return true;
    }

    /** Clears the local session immediately, then revokes the token in the background. */
    public void logout() {
        String token = accessToken;
        accessToken = null;
        currentUser = null;
        if (token == null) return;
        try {
            HttpRequest r = HttpRequest.newBuilder(URI.create(url + "/auth/v1/logout"))
                .header("apikey", anonKey)
                .header("Authorization", "Bearer " + token)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.noBody()).build();
            http.sendAsync(r, HttpResponse.BodyHandlers.ofString());
        } catch (Exception ignored) {
        }
    }

    public boolean isLoggedIn() { return accessToken != null; }
    public String userId() { return currentUser.get("id").getAsString(); }
    public String userEmail() { return currentUser.get("email").getAsString(); }

    // ---------- DATABASE (PostgREST) ----------
    public JsonArray select(String table, String query) throws Exception {
        HttpResponse<String> r = http.send(req("/rest/v1/" + table + "?" + query).GET().build(),
            HttpResponse.BodyHandlers.ofString());
        if (r.statusCode() >= 300) throw new RuntimeException("Select failed: " + r.body());
        return JsonParser.parseString(r.body()).getAsJsonArray();
    }

    public void insert(String table, JsonObject row) throws Exception {
        HttpResponse<String> r = http.send(
            req("/rest/v1/" + table).POST(HttpRequest.BodyPublishers.ofString(row.toString())).build(),
            HttpResponse.BodyHandlers.ofString());
        if (r.statusCode() >= 300) throw new RuntimeException("Insert failed: " + r.body());
    }

    public void update(String table, String filter, JsonObject patch) throws Exception {
        HttpResponse<String> r = http.send(
            req("/rest/v1/" + table + "?" + filter)
                .method("PATCH", HttpRequest.BodyPublishers.ofString(patch.toString())).build(),
            HttpResponse.BodyHandlers.ofString());
        if (r.statusCode() >= 300) throw new RuntimeException("Update failed: " + r.body());
    }

    public void delete(String table, String filter) throws Exception {
        HttpResponse<String> r = http.send(req("/rest/v1/" + table + "?" + filter).DELETE().build(),
            HttpResponse.BodyHandlers.ofString());
        if (r.statusCode() >= 300) throw new RuntimeException("Delete failed: " + r.body());
    }

    /** Returns {username, role} from the profiles table for the logged-in user, or null. */
    public JsonObject getProfile() throws Exception {
        JsonArray rows = select("profiles", "select=username,role&id=eq." + userId());
        return rows.size() > 0 ? rows.get(0).getAsJsonObject() : null;
    }

    public String getRole() throws Exception {
        JsonObject p = getProfile();
        return (p != null && !p.get("role").isJsonNull()) ? p.get("role").getAsString() : "GAMER";
    }
}
