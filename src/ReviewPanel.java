import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

/**
 * Screen 3: Player submits a review (1-5 stars + comment).
 * New reviews are PENDING until the admin approves them.
 */
public class ReviewPanel extends JPanel implements Refreshable {

    private AnalyticsSystem system;

    private JComboBox<Game> gameCombo = Theme.comboBox();
    private JTextField playerField = Theme.textField();
    private JTextArea commentArea = new JTextArea(5, 20);
    private JLabel[] stars = new JLabel[5];
    private JLabel ratingText = Theme.label("Click a star", Theme.FONT_NORMAL, Theme.TEXT_MUTED);
    private int selectedRating = 0;

    public ReviewPanel(AnalyticsSystem system) {
        this.system = system;
        setLayout(new BorderLayout(0, 20));
        setBackground(Theme.BG_DARK);
        setBorder(new EmptyBorder(25, 30, 25, 30));

        add(Theme.pageHeader("Submit Review",
                new JLabel("Share your experience - reviews are checked by an admin first")), BorderLayout.NORTH);

        // ----- Star rating (clickable labels) -----
        JPanel starPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 4, 0));
        starPanel.setOpaque(false);
        for (int i = 0; i < 5; i++) {
            final int value = i + 1;
            stars[i] = new JLabel("\u2605");  // star symbol
            stars[i].setFont(new Font("Segoe UI Symbol", Font.PLAIN, 30));
            stars[i].setCursor(new Cursor(Cursor.HAND_CURSOR));
            stars[i].addMouseListener(new MouseAdapter() {
                @Override
                public void mouseClicked(MouseEvent e) {
                    setRating(value);
                }
            });
            starPanel.add(stars[i]);
        }
        starPanel.add(Box.createHorizontalStrut(10));
        starPanel.add(ratingText);
        setRating(0);

        // ----- Comment box -----
        commentArea.setLineWrap(true);
        commentArea.setWrapStyleWord(true);
        Theme.styleInput(commentArea);
        commentArea.setCaretColor(Theme.TEXT_PRIMARY);
        JScrollPane commentScroll = new JScrollPane(commentArea);
        commentScroll.setBorder(BorderFactory.createEmptyBorder());

        // ----- Form -----
        JPanel form = new JPanel(new GridBagLayout());
        form.setOpaque(false);
        Theme.addFormRow(form, 0, "Game", gameCombo);
        Theme.addFormRow(form, 1, "Player Name", playerField);
        Theme.addFormRow(form, 2, "Rating", starPanel);
        Theme.addFormRow(form, 3, "Comment", commentScroll);

        JButton submitButton = Theme.button("Submit Review", Theme.INDIGO);
        JButton clearButton = Theme.button("Clear", Theme.BUTTON_SOFT);
        submitButton.addActionListener(e -> submit());
        clearButton.addActionListener(e -> clearForm());

        JPanel buttons = new JPanel(new FlowLayout(FlowLayout.LEFT, 0, 0));
        buttons.setOpaque(false);
        buttons.add(submitButton);
        buttons.add(Box.createHorizontalStrut(10));
        buttons.add(clearButton);
        Theme.addFormRow(form, 4, "", buttons);

        RoundedPanel formCard = Theme.sectionCard("Your Review", form);
        formCard.setPreferredSize(new Dimension(560, 430));

        RoundedPanel helpCard = Theme.infoCard("Review Rules",
                "1. Rating must be between 1 and 5 stars.<br><br>"
                + "2. Comment is required (max 300 characters).<br><br>"
                + "3. Every review starts as <b>PENDING</b>.<br><br>"
                + "4. Only <b>APPROVED</b> reviews appear on the dashboard and count in the average rating.");
        helpCard.setPreferredSize(new Dimension(340, 430));

        JPanel center = new JPanel(new FlowLayout(FlowLayout.LEFT, 0, 0));
        center.setOpaque(false);
        center.add(formCard);
        center.add(Box.createHorizontalStrut(20));
        center.add(helpCard);
        add(center, BorderLayout.CENTER);
    }

    @Override
    public void refresh() {
        Theme.fillGameCombo(gameCombo, system.getGames());
    }

    /** Colors the first "rating" stars yellow and the rest grey. */
    private void setRating(int rating) {
        selectedRating = rating;
        for (int i = 0; i < 5; i++) {
            stars[i].setForeground(i < rating ? Theme.AMBER : Theme.BORDER);
        }
        ratingText.setText(rating == 0 ? "Click a star" : rating + " / 5");
    }

    private void submit() {
        Game game = (Game) gameCombo.getSelectedItem();
        String player = playerField.getText().trim();
        String comment = commentArea.getText().trim();

        if (game == null) {
            showError("Please add a game first (Manage Games).");
            return;
        }
        if (player.isEmpty()) {
            showError("Please enter the player name.");
            return;
        }
        if (selectedRating == 0) {
            showError("Please select a rating (1 to 5 stars).");
            return;
        }
        if (comment.isEmpty()) {
            showError("Please write a comment.");
            return;
        }
        if (comment.length() > 300) {
            showError("Comment is too long (" + comment.length() + "/300 characters).");
            return;
        }

        Review review = system.submitReview(game, player, selectedRating, comment);
        JOptionPane.showMessageDialog(this,
                "Review " + review.getReviewId() + " submitted for " + game.getTitle() + ".\n"
                + "It will appear on the dashboard after admin approval.",
                "Review Submitted", JOptionPane.INFORMATION_MESSAGE);
        clearForm();
    }

    private void clearForm() {
        playerField.setText("");
        commentArea.setText("");
        setRating(0);
    }

    private void showError(String message) {
        JOptionPane.showMessageDialog(this, message, "Invalid Input", JOptionPane.WARNING_MESSAGE);
    }
}
