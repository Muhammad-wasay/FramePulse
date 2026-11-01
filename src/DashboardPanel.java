import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.List;

/**
 * Screen 1: Analytics Dashboard.
 * Shows rating, FPS, stability and session stats for the selected game.
 */
public class DashboardPanel extends JPanel implements Refreshable {

    private AnalyticsSystem system;

    private JComboBox<Game> gameCombo = Theme.comboBox();
    private JLabel subtitle = new JLabel(" ");
    private MetricCard ratingCard = new MetricCard("AVERAGE RATING", Theme.INDIGO);
    private MetricCard fpsCard = new MetricCard("AVERAGE FPS", Theme.CYAN);
    private MetricCard stabilityCard = new MetricCard("STABILITY SCORE", Theme.EMERALD);
    private MetricCard sessionsCard = new MetricCard("TOTAL SESSIONS", Theme.AMBER);
    private FpsChartPanel chart = new FpsChartPanel();

    private DefaultTableModel reviewModel = Theme.tableModel("Player", "Rating", "Comment");
    private DefaultTableModel sessionModel = Theme.tableModel(
            "Session", "Player", "Resolution", "FPS", "CPU %", "GPU %", "Status", "Date");

    // true while we are filling the combo box, so the listener ignores those events
    private boolean fillingCombo = false;

    public DashboardPanel(AnalyticsSystem system) {
        this.system = system;
        setLayout(new BorderLayout(0, 20));
        setBackground(Theme.BG_DARK);
        setBorder(new EmptyBorder(25, 30, 25, 30));

        // ----- Header (title on left, game selector on right) -----
        JPanel header = new JPanel(new BorderLayout());
        header.setOpaque(false);
        header.add(Theme.pageHeader("Analytics Dashboard", subtitle), BorderLayout.WEST);

        JPanel selector = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 8));
        selector.setOpaque(false);
        selector.add(Theme.label("Game:", Theme.FONT_BOLD, Theme.TEXT_MUTED));
        gameCombo.setPreferredSize(new Dimension(240, 38));
        selector.add(gameCombo);
        JButton reportBtn = Theme.button("Export Report", Theme.INDIGO);
        reportBtn.addActionListener(e -> exportCurrentReport());
        selector.add(reportBtn);
        header.add(selector, BorderLayout.EAST);
        add(header, BorderLayout.NORTH);

        gameCombo.addActionListener(e -> {
            if (!fillingCombo) showSelectedGame();
        });

        // ----- Metric cards -----
        JPanel metrics = new JPanel(new GridLayout(1, 4, 20, 0));
        metrics.setOpaque(false);
        metrics.setPreferredSize(new Dimension(0, 120));
        metrics.add(ratingCard);
        metrics.add(fpsCard);
        metrics.add(stabilityCard);
        metrics.add(sessionsCard);

        // ----- Chart + reviews -----
        JPanel middle = new JPanel(new GridLayout(1, 2, 20, 0));
        middle.setOpaque(false);
        middle.add(Theme.sectionCard("FPS per Session (last 12)", chart));

        JTable reviewTable = Theme.table(reviewModel);
        reviewTable.getColumnModel().getColumn(0).setPreferredWidth(105);
        reviewTable.getColumnModel().getColumn(1).setPreferredWidth(65);
        reviewTable.getColumnModel().getColumn(2).setPreferredWidth(260);
        middle.add(Theme.sectionCard("Approved Player Reviews", Theme.scroll(reviewTable)));

        // ----- Sessions table -----
        RoundedPanel sessionsCardPanel = Theme.sectionCard("Performance Sessions (newest first)",
                Theme.scroll(Theme.table(sessionModel)));
        sessionsCardPanel.setPreferredSize(new Dimension(0, 220));

        JPanel body = new JPanel(new BorderLayout(0, 20));
        body.setOpaque(false);
        body.add(metrics, BorderLayout.NORTH);
        body.add(middle, BorderLayout.CENTER);
        body.add(sessionsCardPanel, BorderLayout.SOUTH);
        add(body, BorderLayout.CENTER);
    }

    @Override
    public void refresh() {
        fillingCombo = true;
        Theme.fillGameCombo(gameCombo, system.getGames());
        fillingCombo = false;
        showSelectedGame();
    }

    private void showSelectedGame() {
        Game game = (Game) gameCombo.getSelectedItem();
        if (game == null) return;

        subtitle.setText(game.getTitle() + " (" + game.getGameId() + ")  |  Genre: "
                + game.getGenre() + "  |  Telemetry & Reviews");

        // Rating card
        int reviewCount = game.getApprovedReviewCount();
        if (reviewCount == 0) {
            ratingCard.update("- / 5.0", "No approved reviews yet");
        } else {
            double rating = game.getAverageRating();
            String mood;
            if (rating >= 4) mood = "Positive";
            else if (rating >= 3) mood = "Mixed";
            else mood = "Negative";
            ratingCard.update(String.format("%.1f / 5.0", rating),
                    mood + " - " + reviewCount + " reviews");
        }

        // FPS / Stability / Sessions cards
        if (game.getSessions().isEmpty()) {
            fpsCard.update("- FPS", "No sessions logged");
            stabilityCard.update("- / 100", "No data");
            sessionsCard.update("0", "Log a session to begin");
        } else {
            fpsCard.update(String.format("%.1f FPS", game.getAverageFps()),
                    String.format("CPU: %.0f%%  |  GPU: %.0f%%", game.getAverageCpu(), game.getAverageGpu()));

            double score = game.getStabilityScore();
            String level;
            if (score >= 80) level = "Excellent performance";
            else if (score >= 60) level = "Good performance";
            else if (score >= 40) level = "Fair performance";
            else level = "Poor performance";
            stabilityCard.update(String.format("%.1f / 100", score), level);

            sessionsCard.update(String.valueOf(game.getSessions().size()),
                    "Crashes: " + game.getCrashCount());
        }

        // Reviews table (approved only)
        reviewModel.setRowCount(0);
        for (Review r : game.getReviews()) {
            if (r.isApproved()) {
                reviewModel.addRow(new Object[]{r.getPlayer().getName(), r.getRating() + " / 5", r.getComment()});
            }
        }

        // Sessions table (newest first)
        sessionModel.setRowCount(0);
        List<PerformanceSession> sessions = game.getSessions();
        for (int i = sessions.size() - 1; i >= 0; i--) {
            PerformanceSession s = sessions.get(i);
            sessionModel.addRow(new Object[]{
                    s.getSessionId(),
                    s.getPlayer().getName(),
                    s.getResolution(),
                    String.format("%.0f", s.getAverageFps()),
                    String.format("%.0f", s.getCpuUsage()),
                    String.format("%.0f", s.getGpuUsage()),
                    s.isCrashed() ? "Crashed" : "Stable",
                    s.getDate()
            });
        }

        chart.setGame(game);
    }

    private void exportCurrentReport() {
        Game game = (Game) gameCombo.getSelectedItem();
        if (game == null) return;
        Report report = system.getEngine().generateGameReport(game);
        JOptionPane.showMessageDialog(this, report.exportReport(),
                "Generated Game Report (" + report.getReportId() + ")",
                JOptionPane.INFORMATION_MESSAGE);
    }
}
