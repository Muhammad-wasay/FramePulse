import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.table.DefaultTableModel;
import java.awt.*;

/**
 * Screen 5: Add new games and see a summary of all games.
 * Enforces role-based permissions per the Use Case Diagram (Admin actor manages games).
 */
public class GamesPanel extends JPanel implements Refreshable {

    private AnalyticsSystem system;

    private JTextField titleField = Theme.textField();
    private JTextField genreField = Theme.textField();
    private JLabel subtitleLabel = new JLabel(" ");
    private DefaultTableModel model = Theme.tableModel(
            "Game ID", "Title", "Genre", "Sessions", "Approved Reviews", "Avg Rating", "Avg FPS", "Stability");

    public GamesPanel(AnalyticsSystem system) {
        this.system = system;
        setLayout(new BorderLayout(0, 20));
        setBackground(Theme.BG_DARK);
        setBorder(new EmptyBorder(25, 30, 25, 30));

        add(Theme.pageHeader("Manage Games", subtitleLabel), BorderLayout.NORTH);

        // ----- Add game form (one row) -----
        titleField.setPreferredSize(new Dimension(260, 38));
        genreField.setPreferredSize(new Dimension(200, 38));
        JButton addButton = Theme.button("Add Game", Theme.INDIGO);
        addButton.addActionListener(e -> addGame());

        JPanel form = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 0));
        form.setOpaque(false);
        form.add(Theme.label("Title", Theme.FONT_BOLD, Theme.TEXT_MUTED));
        form.add(titleField);
        form.add(Box.createHorizontalStrut(10));
        form.add(Theme.label("Genre", Theme.FONT_BOLD, Theme.TEXT_MUTED));
        form.add(genreField);
        form.add(Box.createHorizontalStrut(10));
        form.add(addButton);

        JPanel body = new JPanel(new BorderLayout(0, 20));
        body.setOpaque(false);
        body.add(Theme.sectionCard("Add New Game (Admin Only)", form), BorderLayout.NORTH);
        body.add(Theme.sectionCard("All Games", Theme.scroll(Theme.table(model))), BorderLayout.CENTER);
        add(body, BorderLayout.CENTER);
    }

    @Override
    public void refresh() {
        model.setRowCount(0);
        for (Game g : system.getGames()) {
            boolean hasSessions = !g.getSessions().isEmpty();
            boolean hasReviews = g.getApprovedReviewCount() > 0;
            model.addRow(new Object[]{
                    g.getGameId(),
                    g.getTitle(),
                    g.getGenre(),
                    g.getSessions().size(),
                    g.getApprovedReviewCount(),
                    hasReviews ? String.format("%.1f / 5", g.getAverageRating()) : "-",
                    hasSessions ? String.format("%.1f", g.getAverageFps()) : "-",
                    hasSessions ? String.format("%.1f / 100", g.getStabilityScore()) : "-"
            });
        }

        User current = system.getCurrentUser();
        if (current != null && current.getRole().equals("Admin")) {
            subtitleLabel.setText("Logged in as Admin: " + current.getUsername() + "  |  Full catalog management authorized");
        } else if (current != null) {
            subtitleLabel.setText("Browsing as " + current.getUsername() + " (" + current.getRole() + ")  |  Catalog view mode");
        } else {
            subtitleLabel.setText("Add games to the catalog and compare their analytics");
        }
    }

    private void addGame() {
        if (!system.isAdminLoggedIn()) {
            JOptionPane.showMessageDialog(this,
                    "Access Denied: Only administrators can add new games to the catalog.\nPlease switch to an Admin account (e.g. admin_usman).",
                    "Admin Privileges Required", JOptionPane.WARNING_MESSAGE);
            return;
        }

        String title = titleField.getText().trim();
        String genre = genreField.getText().trim();

        if (title.isEmpty() || genre.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please enter both title and genre.",
                    "Invalid Input", JOptionPane.WARNING_MESSAGE);
            return;
        }
        for (Game g : system.getGames()) {
            if (g.getTitle().equalsIgnoreCase(title)) {
                JOptionPane.showMessageDialog(this, "A game with this title already exists.",
                        "Duplicate Game", JOptionPane.WARNING_MESSAGE);
                return;
            }
        }

        Game game = system.addGame(title, genre);
        JOptionPane.showMessageDialog(this, "Game added with ID " + game.getGameId() + ".",
                "Game Added", JOptionPane.INFORMATION_MESSAGE);
        titleField.setText("");
        genreField.setText("");
        refresh();
    }
}
