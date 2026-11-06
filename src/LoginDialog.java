import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;

/**
 * Login Dialog implementing the Authentication workflow from
 * the Activity Diagram and Sequence Diagram.
 * 
 * Activity Diagram Flow:
 *   Enter Username & Password -> Verify Credentials -> If valid: Open Dashboard; If invalid: Show Error & Retry.
 */
public class LoginDialog extends JDialog {

    private AnalyticsSystem system;
    private boolean authenticated = false;

    private JTextField usernameField = Theme.textField();
    private JPasswordField passwordField = new JPasswordField();
    private JCheckBox showPasswordCheck = new JCheckBox("Show Password");
    private JLabel statusLabel = new JLabel(" ");

    public LoginDialog(Frame parent, AnalyticsSystem system) {
        super(parent, "FramePulse — User Authentication", true);
        this.system = system;

        setSize(540, 500);
        setMinimumSize(new Dimension(500, 480));
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
        JLabel subtitle = Theme.label("Authenticate to access telemetry, moderation, and community reviews",
                Theme.FONT_NORMAL, Theme.TEXT_MUTED);
        header.add(title);
        header.add(Box.createVerticalStrut(4));
        header.add(subtitle);
        add(header, BorderLayout.NORTH);

        // Form Card
        JPanel form = new JPanel(new GridBagLayout());
        form.setOpaque(false);

        Theme.styleInput(passwordField);
        passwordField.setCaretColor(Theme.TEXT_PRIMARY);

        // Show / Hide Password toggle
        final char defaultEcho = passwordField.getEchoChar();
        showPasswordCheck.setOpaque(false);
        showPasswordCheck.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        showPasswordCheck.setForeground(Theme.TEXT_MUTED);
        showPasswordCheck.setFocusPainted(false);
        showPasswordCheck.setCursor(new Cursor(Cursor.HAND_CURSOR));
        showPasswordCheck.addActionListener(e -> {
            if (showPasswordCheck.isSelected()) {
                passwordField.setEchoChar((char) 0);
            } else {
                passwordField.setEchoChar(defaultEcho);
            }
        });

        JPanel passWrapper = new JPanel();
        passWrapper.setOpaque(false);
        passWrapper.setLayout(new BoxLayout(passWrapper, BoxLayout.Y_AXIS));
        passWrapper.add(passwordField);
        passWrapper.add(Box.createVerticalStrut(4));
        passWrapper.add(showPasswordCheck);

        Theme.addFormRow(form, 0, "Username", usernameField);
        Theme.addFormRow(form, 1, "Password", passWrapper);

        statusLabel.setFont(Theme.FONT_SMALL);
        statusLabel.setForeground(Theme.ROSE);
        Theme.addFormRow(form, 2, "", statusLabel);

        // Buttons Row
        JButton loginBtn = Theme.button("Login", Theme.INDIGO);
        JButton cancelBtn = Theme.button("Continue as Guest", Theme.BUTTON_SOFT);

        loginBtn.addActionListener(e -> attemptLogin());
        cancelBtn.addActionListener(e -> dispose());

        KeyAdapter enterListener = new KeyAdapter() {
            @Override
            public void keyPressed(KeyEvent e) {
                if (e.getKeyCode() == KeyEvent.VK_ENTER) {
                    attemptLogin();
                }
            }
        };
        usernameField.addKeyListener(enterListener);
        passwordField.addKeyListener(enterListener);

        JPanel btnRow = new JPanel(new FlowLayout(FlowLayout.LEFT, 0, 0));
        btnRow.setOpaque(false);
        btnRow.add(loginBtn);
        btnRow.add(Box.createHorizontalStrut(10));
        btnRow.add(cancelBtn);
        Theme.addFormRow(form, 3, "", btnRow);

        // Demo Quick Credentials (For University Viva & Demo)
        JPanel quickPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 8, 0));
        quickPanel.setOpaque(false);
        quickPanel.setBorder(new EmptyBorder(10, 0, 0, 0));

        JLabel quickLabel = Theme.label("Quick Fill:", Theme.FONT_SMALL, Theme.TEXT_MUTED);
        quickPanel.add(quickLabel);

        JButton adminQuick = new JButton("Admin (A-101)");
        styleQuickButton(adminQuick);
        adminQuick.addActionListener(e -> {
            usernameField.setText("admin_usman");
            passwordField.setText("admin123");
            attemptLogin();
        });
        quickPanel.add(adminQuick);

        JButton gamerQuick = new JButton("Gamer (G-201)");
        styleQuickButton(gamerQuick);
        gamerQuick.addActionListener(e -> {
            usernameField.setText("shadow_ninja");
            passwordField.setText("gamer123");
            attemptLogin();
        });
        quickPanel.add(gamerQuick);

        Theme.addFormRow(form, 4, "", quickPanel);

        RoundedPanel card = Theme.sectionCard("Account Credentials", form);
        card.setBorder(new EmptyBorder(16, 22, 16, 22));

        JPanel centerPanel = new JPanel(new BorderLayout());
        centerPanel.setOpaque(false);
        centerPanel.setBorder(new EmptyBorder(0, 24, 20, 24));
        centerPanel.add(card, BorderLayout.CENTER);
        add(centerPanel, BorderLayout.CENTER);

        // Pre-fill with Admin as default suggestion
        usernameField.setText("admin_usman");
        passwordField.setText("admin123");
    }

    private void styleQuickButton(JButton b) {
        b.setFont(new Font("Segoe UI", Font.BOLD, 11));
        b.setForeground(Theme.INDIGO);
        b.setBackground(Theme.INPUT_BG);
        b.setFocusPainted(false);
        b.setCursor(new Cursor(Cursor.HAND_CURSOR));
        b.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(Theme.BORDER, 1, true),
                new EmptyBorder(5, 10, 5, 10)));
    }

    private void attemptLogin() {
        String username = usernameField.getText().trim();
        String password = new String(passwordField.getPassword());

        if (username.isEmpty() || password.isEmpty()) {
            statusLabel.setText("Please enter both username and password.");
            return;
        }

        User user = system.login(username, password);
        if (user != null) {
            authenticated = true;
            statusLabel.setForeground(Theme.EMERALD);
            statusLabel.setText("Login successful as " + user.getRole() + "!");
            JOptionPane.showMessageDialog(this,
                    "Welcome back, " + user.getUsername() + " (" + user.getRole() + ")!\n"
                    + "Logged in successfully according to Activity & Sequence Diagrams.",
                    "Authentication Successful", JOptionPane.INFORMATION_MESSAGE);
            dispose();
        } else {
            authenticated = false;
            statusLabel.setForeground(Theme.ROSE);
            statusLabel.setText("Invalid credentials! Activity Diagram: Show Error & Retry.");
        }
    }

    public boolean isAuthenticated() {
        return authenticated;
    }
}
