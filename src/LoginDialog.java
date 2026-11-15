import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;

/**
 * Login Dialog using Supabase Auth.
 *
 * Activity Diagram Flow:
 *   Enter Email & Password -> Verify with Supabase -> If valid: load role + data, open Dashboard;
 *   If invalid: Show Error & Retry.
 */
public class LoginDialog extends JDialog {

    /** Everything the background thread brings back after a successful login. */
    private static class AuthResult {
        String userId, username, email, role;
        DatabaseHandler.Snapshot snapshot;
    }

    private AnalyticsSystem system;
    private boolean authenticated = false;

    private JTextField emailField = Theme.textField();
    private JPasswordField passwordField = new JPasswordField();
    private JCheckBox showPasswordCheck = new JCheckBox("Show Password");
    private JLabel statusLabel = new JLabel(" ");
    private JButton loginBtn;
    private JButton signupBtn;

    public LoginDialog(Frame parent, AnalyticsSystem system) {
        super(parent, "FramePulse — User Authentication", true);
        this.system = system;

        setSize(540, 470);
        setMinimumSize(new Dimension(500, 450));
        setResizable(true);
        setLocationRelativeTo(parent);
        getContentPane().setBackground(Theme.BG_DARK);
        setLayout(new BorderLayout());

        // Header
        JPanel header = new JPanel();
        header.setOpaque(false);
        header.setLayout(new BoxLayout(header, BoxLayout.Y_AXIS));
        header.setBorder(new EmptyBorder(22, 28, 12, 28));

        JLabel title = Theme.label("⚡ FramePulse Login", Theme.FONT_TITLE, Theme.TEXT_PRIMARY);
        JLabel subtitle = Theme.label("Sign in to access telemetry, moderation, and community reviews",
                Theme.FONT_NORMAL, Theme.TEXT_MUTED);
        header.add(title);
        header.add(Box.createVerticalStrut(4));
        header.add(subtitle);
        add(header, BorderLayout.NORTH);

        // Form
        JPanel form = new JPanel(new GridBagLayout());
        form.setOpaque(false);

        Theme.styleInput(passwordField);
        passwordField.setCaretColor(Theme.TEXT_PRIMARY);

        final char defaultEcho = passwordField.getEchoChar();
        showPasswordCheck.setOpaque(false);
        showPasswordCheck.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        showPasswordCheck.setForeground(Theme.TEXT_MUTED);
        showPasswordCheck.setFocusPainted(false);
        showPasswordCheck.setCursor(new Cursor(Cursor.HAND_CURSOR));
        showPasswordCheck.addActionListener(e ->
                passwordField.setEchoChar(showPasswordCheck.isSelected() ? (char) 0 : defaultEcho));

        JPanel passWrapper = new JPanel();
        passWrapper.setOpaque(false);
        passWrapper.setLayout(new BoxLayout(passWrapper, BoxLayout.Y_AXIS));
        passWrapper.add(passwordField);
        passWrapper.add(Box.createVerticalStrut(4));
        passWrapper.add(showPasswordCheck);

        Theme.addFormRow(form, 0, "Email", emailField);
        Theme.addFormRow(form, 1, "Password", passWrapper);

        statusLabel.setFont(Theme.FONT_SMALL);
        statusLabel.setForeground(Theme.ROSE);
        Theme.addFormRow(form, 2, "", statusLabel);

        // Buttons
        loginBtn = Theme.button("Login", Theme.INDIGO);
        signupBtn = Theme.button("Sign Up", Theme.BUTTON_SOFT);
        JButton guestBtn = Theme.button("Continue as Guest", Theme.BUTTON_SOFT);

        loginBtn.addActionListener(e -> doAuth(false));
        signupBtn.addActionListener(e -> doAuth(true));
        guestBtn.addActionListener(e -> dispose());

        KeyAdapter enterListener = new KeyAdapter() {
            @Override
            public void keyPressed(KeyEvent e) {
                if (e.getKeyCode() == KeyEvent.VK_ENTER) doAuth(false);
            }
        };
        emailField.addKeyListener(enterListener);
        passwordField.addKeyListener(enterListener);

        JPanel btnRow = new JPanel(new FlowLayout(FlowLayout.LEFT, 0, 0));
        btnRow.setOpaque(false);
        btnRow.add(loginBtn);
        btnRow.add(Box.createHorizontalStrut(10));
        btnRow.add(signupBtn);
        btnRow.add(Box.createHorizontalStrut(10));
        btnRow.add(guestBtn);
        Theme.addFormRow(form, 3, "", btnRow);

        RoundedPanel card = Theme.sectionCard("Account Credentials", form);
        card.setBorder(new EmptyBorder(16, 22, 16, 22));

        JPanel centerPanel = new JPanel(new BorderLayout());
        centerPanel.setOpaque(false);
        centerPanel.setBorder(new EmptyBorder(0, 24, 20, 24));
        centerPanel.add(card, BorderLayout.CENTER);
        add(centerPanel, BorderLayout.CENTER);
    }

    /** signUp = false -> login only; signUp = true -> create account, then login. */
    private void doAuth(boolean signUp) {
        final String mail = emailField.getText().trim();
        final String pass = new String(passwordField.getPassword());

        if (mail.isEmpty() || pass.isEmpty()) {
            showError("Please enter both email and password.");
            return;
        }
        if (!mail.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) {
            showError("Please enter a valid email address.");
            return;
        }
        if (signUp && pass.length() < 6) {
            showError("Password must be at least 6 characters.");
            return;
        }

        setBusy(true, signUp ? "Creating account..." : "Signing in...");

        new SwingWorker<AuthResult, Void>() {
            private String error = null;

            @Override
            protected AuthResult doInBackground() {
                try {
                    SupabaseClient c = SupabaseClient.get();
                    if (signUp && !c.signUp(mail, pass)) {
                        error = "Sign up failed. The email may already be registered.";
                        return null;
                    }
                    if (!c.login(mail, pass)) {
                        error = "Invalid email or password.";
                        return null;
                    }
                    AuthResult r = new AuthResult();
                    r.userId = c.userId();
                    r.email = c.userEmail();
                    r.username = mail.substring(0, mail.indexOf('@'));
                    r.role = "GAMER";
                    com.google.gson.JsonObject profile = c.getProfile();
                    if (profile != null) {
                        if (profile.has("role") && !profile.get("role").isJsonNull())
                            r.role = profile.get("role").getAsString();
                        if (profile.has("username") && !profile.get("username").isJsonNull())
                            r.username = profile.get("username").getAsString();
                    }
                    try {
                        r.snapshot = system.getDatabaseHandler().fetchSnapshot();
                    } catch (Exception ex) {
                        System.err.println("[Supabase] Could not load data: " + ex.getMessage());
                    }
                    return r;
                } catch (Exception ex) {
                    error = "Connection error: " + ex.getMessage();
                    return null;
                }
            }

            @Override
            protected void done() {
                setBusy(false, " ");
                try {
                    AuthResult r = get();
                    if (r == null) {
                        authenticated = false;
                        showError(error != null ? error : "Login failed.");
                        return;
                    }
                    system.loginRemote(r.userId, r.username, r.email, r.role);
                    system.applySnapshot(r.snapshot);
                    authenticated = true;
                    dispose();
                } catch (Exception ex) {
                    showError("Unexpected error: " + ex.getMessage());
                }
            }
        }.execute();
    }

    private void setBusy(boolean busy, String message) {
        loginBtn.setEnabled(!busy);
        signupBtn.setEnabled(!busy);
        statusLabel.setForeground(Theme.TEXT_MUTED);
        statusLabel.setText(message);
    }

    private void showError(String msg) {
        statusLabel.setForeground(Theme.ROSE);
        statusLabel.setText(msg);
    }

    public boolean isAuthenticated() {
        return authenticated;
    }
}
