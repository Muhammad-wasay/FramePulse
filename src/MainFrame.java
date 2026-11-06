import javax.imageio.ImageIO;
import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.geom.RoundRectangle2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Main window: sidebar on the left, the current screen on the right.
 * CardLayout is used to switch between screens.
 */
public class MainFrame extends JFrame {

    private AnalyticsSystem system;
    private CardLayout cardLayout = new CardLayout();
    private JPanel content = new JPanel(cardLayout);
    private JPanel sidebar = new JPanel();
    private Map<String, Refreshable> pages = new HashMap<>();
    private List<NavButton> navButtons = new ArrayList<>();
    private JLabel userBadge = new JLabel(" ");
    private JButton authBtn;

    public MainFrame(AnalyticsSystem system) {
        this.system = system;
        setTitle("FramePulse - Game Performance & Review Analytics System");
        setSize(1280, 820);
        setMinimumSize(new Dimension(1150, 720));
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout());

        // ----- Load Custom Logo (Title Bar + Sidebar) -----
        BufferedImage logoImage = loadLogo();
        if (logoImage != null) {
            setIconImage(logoImage);
        }

        // ----- Sidebar -----
        sidebar.setBackground(Theme.SIDEBAR_BG);
        sidebar.setPreferredSize(new Dimension(250, 0));
        sidebar.setLayout(new BoxLayout(sidebar, BoxLayout.Y_AXIS));
        sidebar.setBorder(new EmptyBorder(25, 16, 25, 16));

        JPanel brandHeader = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 0));
        brandHeader.setOpaque(false);
        brandHeader.setAlignmentX(Component.LEFT_ALIGNMENT);
        brandHeader.setMaximumSize(new Dimension(230, 56));

        if (logoImage != null) {
            brandHeader.add(new JLabel(createRoundedLogoIcon(logoImage, 44)));
        }

        JPanel brandText = new JPanel();
        brandText.setOpaque(false);
        brandText.setLayout(new BoxLayout(brandText, BoxLayout.Y_AXIS));
        JLabel brand = Theme.label("FramePulse", new Font("Segoe UI", Font.BOLD, 20), Theme.TEXT_PRIMARY);
        JLabel tagline = Theme.label("Performance & Reviews", Theme.FONT_SMALL, Theme.CYAN);
        brandText.add(brand);
        brandText.add(Box.createVerticalStrut(2));
        brandText.add(tagline);
        brandHeader.add(brandText);

        sidebar.add(brandHeader);
        sidebar.add(Box.createVerticalStrut(18));

        // ----- User Session Card (Auth Component Integration) -----
        JPanel userCard = new JPanel(new BorderLayout(8, 4));
        userCard.setOpaque(false);
        userCard.setAlignmentX(Component.LEFT_ALIGNMENT);
        userCard.setMaximumSize(new Dimension(230, 55));
        userCard.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(Theme.BORDER, 1, true),
                new EmptyBorder(8, 10, 8, 10)));

        userBadge.setFont(Theme.FONT_SMALL);
        userBadge.setForeground(Theme.INDIGO);
        userCard.add(userBadge, BorderLayout.NORTH);

        authBtn = new JButton("Switch User / Login");
        authBtn.setFont(new Font("Segoe UI", Font.PLAIN, 11));
        authBtn.setForeground(Theme.TEXT_MUTED);
        authBtn.setBackground(Theme.INPUT_BG);
        authBtn.setFocusPainted(false);
        authBtn.setBorderPainted(false);
        authBtn.setContentAreaFilled(false);
        authBtn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        authBtn.setHorizontalAlignment(SwingConstants.LEFT);
        authBtn.addActionListener(e -> openLoginDialog());
        userCard.add(authBtn, BorderLayout.CENTER);

        sidebar.add(userCard);
        sidebar.add(Box.createVerticalStrut(20));

        // ----- Screens -----
        addPage("Analytics Dashboard", new DashboardPanel(system));
        addPage("Log FPS Session", new LogSessionPanel(system));
        addPage("Submit Review", new ReviewPanel(system));
        addPage("Admin Moderation", new AdminPanel(system));
        addPage("Manage Games", new GamesPanel(system));

        sidebar.add(Box.createVerticalGlue());
        JLabel footer = Theme.label("CT-263 OOAD  |  Java Swing", Theme.FONT_SMALL, Theme.TEXT_MUTED);
        footer.setAlignmentX(Component.LEFT_ALIGNMENT);
        sidebar.add(footer);

        add(sidebar, BorderLayout.WEST);
        add(content, BorderLayout.CENTER);

        updateUserBadge();
        showPage("Analytics Dashboard");
    }

    public void updateUserBadge() {
        User user = system.getCurrentUser();
        if (user != null) {
            userBadge.setText("👤 " + user.getUsername() + " (" + user.getRole() + ")");
            authBtn.setText("Switch User (" + user.getRole() + ")");
        } else {
            userBadge.setText("👤 Guest (Not Authenticated)");
            authBtn.setText("Login to Account");
        }
    }

    public void openLoginDialog() {
        LoginDialog dialog = new LoginDialog(this, system);
        dialog.setVisible(true);
        updateUserBadge();
        // Refresh current visible page so any role changes take effect
        for (Map.Entry<String, Refreshable> entry : pages.entrySet()) {
            entry.getValue().refresh();
        }
    }

    private BufferedImage loadLogo() {
        try {
            File file = new File("assets/logo.png");
            if (file.exists()) {
                return ImageIO.read(file);
            }
        } catch (Exception ignored) {
        }
        return null;
    }

    private ImageIcon createRoundedLogoIcon(BufferedImage src, int size) {
        BufferedImage out = new BufferedImage(size, size, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2 = out.createGraphics();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g2.setClip(new RoundRectangle2D.Float(0, 0, size, size, 12, 12));
        g2.drawImage(src, 0, 0, size, size, null);
        g2.dispose();
        return new ImageIcon(out);
    }

    private void addPage(String name, JPanel page) {
        content.add(page, name);
        pages.put(name, (Refreshable) page);

        NavButton button = new NavButton(name);
        button.addActionListener(e -> showPage(name));
        navButtons.add(button);
        sidebar.add(button);
        sidebar.add(Box.createVerticalStrut(8));
    }

    /** Reloads the screen data, shows it and highlights its sidebar button. */
    private void showPage(String name) {
        pages.get(name).refresh();
        cardLayout.show(content, name);
        for (NavButton b : navButtons) {
            b.setActive(b.getText().equals(name));
        }
    }

    /** Sidebar button that is highlighted when its screen is open. */
    private static class NavButton extends JButton {
        private boolean active = false;

        NavButton(String text) {
            super(text);
            setAlignmentX(Component.LEFT_ALIGNMENT);
            setMaximumSize(new Dimension(218, 44));
            setHorizontalAlignment(SwingConstants.LEFT);
            setFont(Theme.FONT_BOLD);
            setBorder(new EmptyBorder(10, 16, 10, 16));
            setContentAreaFilled(false);
            setBorderPainted(false);
            setFocusPainted(false);
            setOpaque(false);
            setCursor(new Cursor(Cursor.HAND_CURSOR));
            setActive(false);
        }

        void setActive(boolean active) {
            this.active = active;
            setForeground(active ? Color.WHITE : Theme.TEXT_MUTED);
            repaint();
        }

        @Override
        protected void paintComponent(Graphics g) {
            Graphics2D g2 = (Graphics2D) g.create();
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            if (active) {
                g2.setColor(Theme.INDIGO);
                g2.fillRoundRect(0, 0, getWidth(), getHeight(), 12, 12);
            } else if (getModel().isRollover()) {
                g2.setColor(Theme.BG_DARK);
                g2.fillRoundRect(0, 0, getWidth(), getHeight(), 12, 12);
            }
            g2.dispose();
            super.paintComponent(g);
        }
    }
}
