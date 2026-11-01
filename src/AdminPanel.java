import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Screen 4: Admin approves, rejects or deletes reviews.
 */
public class AdminPanel extends JPanel implements Refreshable {

    private AnalyticsSystem system;

    private JLabel subtitle = new JLabel(" ");
    private JComboBox<String> filterCombo = Theme.comboBox();
    private DefaultTableModel model = Theme.tableModel(
            "Review ID", "Game", "Player", "Rating", "Comment", "Date", "Status");
    private JTable table = Theme.table(model);

    // The reviews currently shown in the table (same order as table rows)
    private List<Review> shownReviews = new ArrayList<>();

    public AdminPanel(AnalyticsSystem system) {
        this.system = system;
        setLayout(new BorderLayout(0, 20));
        setBackground(Theme.BG_DARK);
        setBorder(new EmptyBorder(25, 30, 25, 30));

        // ----- Header with filter -----
        JPanel header = new JPanel(new BorderLayout());
        header.setOpaque(false);
        header.add(Theme.pageHeader("Admin Moderation", subtitle), BorderLayout.WEST);

        filterCombo.addItem("ALL");
        filterCombo.addItem("PENDING");
        filterCombo.addItem("APPROVED");
        filterCombo.addItem("REJECTED");
        filterCombo.setSelectedItem("PENDING");
        filterCombo.setPreferredSize(new Dimension(160, 38));
        filterCombo.addActionListener(e -> refresh());

        JPanel filterPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 8));
        filterPanel.setOpaque(false);
        filterPanel.add(Theme.label("Show:", Theme.FONT_BOLD, Theme.TEXT_MUTED));
        filterPanel.add(filterCombo);
        header.add(filterPanel, BorderLayout.EAST);
        add(header, BorderLayout.NORTH);

        // ----- Table -----
        table.getColumnModel().getColumn(1).setPreferredWidth(140);
        table.getColumnModel().getColumn(4).setPreferredWidth(300);
        table.getColumnModel().getColumn(5).setPreferredWidth(110);

        // ----- Action buttons -----
        JButton approveButton = Theme.button("Approve", Theme.EMERALD);
        JButton rejectButton = Theme.button("Reject", Theme.AMBER);
        JButton deleteButton = Theme.button("Delete", Theme.ROSE);
        approveButton.addActionListener(e -> approveSelected());
        rejectButton.addActionListener(e -> rejectSelected());
        deleteButton.addActionListener(e -> deleteSelected());

        JPanel actions = new JPanel(new FlowLayout(FlowLayout.LEFT, 0, 0));
        actions.setOpaque(false);
        actions.add(Theme.label("Select a review, then:   ", Theme.FONT_NORMAL, Theme.TEXT_MUTED));
        actions.add(approveButton);
        actions.add(Box.createHorizontalStrut(10));
        actions.add(rejectButton);
        actions.add(Box.createHorizontalStrut(10));
        actions.add(deleteButton);

        JPanel content = new JPanel(new BorderLayout(0, 15));
        content.setOpaque(false);
        content.add(Theme.scroll(table), BorderLayout.CENTER);
        content.add(actions, BorderLayout.SOUTH);

        add(Theme.sectionCard("Player Reviews", content), BorderLayout.CENTER);
    }

    @Override
    public void refresh() {
        String filter = (String) filterCombo.getSelectedItem();
        model.setRowCount(0);
        shownReviews.clear();

        for (Review r : system.getAllReviews()) {
            if (filter.equals("ALL") || r.getStatus().name().equals(filter)) {
                shownReviews.add(r);
                model.addRow(new Object[]{
                        r.getReviewId(),
                        r.getGame().getTitle(),
                        r.getPlayer().getName(),
                        r.getRating() + " / 5",
                        r.getComment(),
                        r.getDate(),
                        r.getStatus().name()
                });
            }
        }
        subtitle.setText("Logged in as " + system.getAdmin().getName() + "  |  "
                + system.getPendingReviewCount() + " review(s) waiting for moderation");
    }

    /** Returns the selected review, or null (and shows a message) if nothing is selected. */
    private Review getSelectedReview() {
        int row = table.getSelectedRow();
        if (row == -1) {
            JOptionPane.showMessageDialog(this, "Please select a review in the table first.",
                    "No Review Selected", JOptionPane.WARNING_MESSAGE);
            return null;
        }
        return shownReviews.get(row);
    }

    private void approveSelected() {
        Review review = getSelectedReview();
        if (review == null) return;
        system.getAdmin().approveReview(review);
        refresh();
    }

    private void rejectSelected() {
        Review review = getSelectedReview();
        if (review == null) return;
        system.getAdmin().rejectReview(review);
        refresh();
    }

    private void deleteSelected() {
        Review review = getSelectedReview();
        if (review == null) return;
        int answer = JOptionPane.showConfirmDialog(this,
                "Delete review " + review.getReviewId() + " permanently?",
                "Confirm Delete", JOptionPane.YES_NO_OPTION);
        if (answer == JOptionPane.YES_OPTION) {
            system.deleteReview(review);
            refresh();
        }
    }
}
