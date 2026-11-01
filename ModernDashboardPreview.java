import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.geom.RoundRectangle2D;

public class ModernDashboardPreview extends JFrame {

    // Tailwind / Modern Web Inspired Color Palette (Slate & Neon Accents)
    private final Color BG_DARK = new Color(15, 23, 42);       // Slate-900
    private final Color CARD_BG = new Color(30, 41, 59);       // Slate-800
    private final Color TEXT_PRIMARY = new Color(248, 250, 252); // Slate-50
    private final Color TEXT_MUTED = new Color(148, 163, 184);   // Slate-400
    private final Color ACCENT_INDIGO = new Color(99, 102, 241); // Indigo-500
    private final Color ACCENT_EMERALD = new Color(16, 185, 129);// Emerald-500
    private final Color ACCENT_CYAN = new Color(6, 182, 212);    // Cyan-500

    public ModernDashboardPreview() {
        setTitle("Game Performance & Review Analytics — Cyber Odyssey (GM-501)");
        setSize(1050, 680);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        getContentPane().setBackground(BG_DARK);
        setLayout(new BorderLayout());

        // 1. MODERN SIDEBAR (Web App Style)
        JPanel sidebar = new JPanel();
        sidebar.setBackground(new Color(11, 17, 32));
        sidebar.setPreferredSize(new Dimension(230, 0));
        sidebar.setLayout(new BoxLayout(sidebar, BoxLayout.Y_AXIS));
        sidebar.setBorder(new EmptyBorder(25, 20, 25, 20));

        JLabel brand = new JLabel("⚡ PULSE ANALYTICS");
        brand.setFont(new Font("Segoe UI", Font.BOLD, 18));
        brand.setForeground(TEXT_PRIMARY);
        sidebar.add(brand);
        sidebar.add(Box.createVerticalStrut(35));

        sidebar.add(createNavButton("📊  Analytics Dashboard", true));
        sidebar.add(Box.createVerticalStrut(10));
        sidebar.add(createNavButton("🎮  Log FPS Session", false));
        sidebar.add(Box.createVerticalStrut(10));
        sidebar.add(createNavButton("⭐  Submit Review", false));
        sidebar.add(Box.createVerticalStrut(10));
        sidebar.add(createNavButton("🛡️  Admin Moderation", false));

        add(sidebar, BorderLayout.WEST);

        // 2. MAIN CONTENT AREA
        JPanel mainContent = new JPanel(new BorderLayout(0, 20));
        mainContent.setBackground(BG_DARK);
        mainContent.setBorder(new EmptyBorder(25, 30, 25, 30));

        // Header
        JPanel header = new JPanel(new BorderLayout());
        header.setOpaque(false);
        JLabel pageTitle = new JLabel("Cyber Odyssey (GM-501) — Telemetry & Reviews");
        pageTitle.setFont(new Font("Segoe UI", Font.BOLD, 24));
        pageTitle.setForeground(TEXT_PRIMARY);
        header.add(pageTitle, BorderLayout.WEST);
        mainContent.add(header, BorderLayout.NORTH);

        // Top Metric Bento Cards (Grid of 3)
        JPanel metricsGrid = new JPanel(new GridLayout(1, 3, 20, 0));
        metricsGrid.setOpaque(false);
        metricsGrid.setPreferredSize(new Dimension(0, 140));

        metricsGrid.add(createMetricCard("AVERAGE RATING", "4.0 / 5.0", "★ Positive Sentiment", ACCENT_INDIGO));
        metricsGrid.add(createMetricCard("AVERAGE FPS (1440p)", "72.4 FPS", "CPU: 64% | GPU: 91.5%", ACCENT_CYAN));
        metricsGrid.add(createMetricCard("SYSTEM STABILITY SCORE", "82.5 / 100", "✓ Solid Performance", ACCENT_EMERALD));

        mainContent.add(metricsGrid, BorderLayout.CENTER);
        add(mainContent, BorderLayout.CENTER);
    }

    // Custom Rounded Card Component (Like CSS border-radius: 20px)
    private JPanel createMetricCard(String title, String value, String subtitle, Color accent) {
        JPanel card = new JPanel(new BorderLayout(0, 8)) {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g2.setColor(CARD_BG);
                g2.fill(new RoundRectangle2D.Float(0, 0, getWidth(), getHeight(), 22, 22));
                g2.setColor(accent);
                g2.fill(new RoundRectangle2D.Float(0, 0, 6, getHeight(), 6, 6)); // Left Neon Accent Bar
                g2.dispose();
            }
        };
        card.setOpaque(false);
        card.setBorder(new EmptyBorder(20, 24, 20, 20));

        JLabel lblTitle = new JLabel(title);
        lblTitle.setFont(new Font("Segoe UI", Font.BOLD, 12));
        lblTitle.setForeground(TEXT_MUTED);

        JLabel lblValue = new JLabel(value);
        lblValue.setFont(new Font("Segoe UI", Font.BOLD, 30));
        lblValue.setForeground(TEXT_PRIMARY);

        JLabel lblSub = new JLabel(subtitle);
        lblSub.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        lblSub.setForeground(accent);

        card.add(lblTitle, BorderLayout.NORTH);
        card.add(lblValue, BorderLayout.CENTER);
        card.add(lblSub, BorderLayout.SOUTH);
        return card;
    }

    private JButton createNavButton(String text, boolean active) {
        JButton btn = new JButton(text);
        btn.setMaximumSize(new Dimension(200, 42));
        btn.setFont(new Font("Segoe UI", Font.BOLD, 13));
        btn.setForeground(active ? TEXT_PRIMARY : TEXT_MUTED);
        btn.setBackground(active ? ACCENT_INDIGO : new Color(11, 17, 32));
        btn.setFocusPainted(false);
        btn.setBorderPainted(false);
        btn.setHorizontalAlignment(SwingConstants.LEFT);
        btn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        return btn;
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new ModernDashboardPreview().setVisible(true));
    }
}