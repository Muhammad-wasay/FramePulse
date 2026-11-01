import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;

/**
 * Screen 2: Player logs a new FPS / performance session.
 */
public class LogSessionPanel extends JPanel implements Refreshable {

    private AnalyticsSystem system;

    private JComboBox<Game> gameCombo = Theme.comboBox();
    private JTextField playerField = Theme.textField();
    private JComboBox<String> resolutionCombo = Theme.comboBox();
    private JTextField fpsField = Theme.textField();
    private JTextField cpuField = Theme.textField();
    private JTextField gpuField = Theme.textField();
    private JCheckBox crashedBox = new JCheckBox("The game crashed during this session");

    public LogSessionPanel(AnalyticsSystem system) {
        this.system = system;
        setLayout(new BorderLayout(0, 20));
        setBackground(Theme.BG_DARK);
        setBorder(new EmptyBorder(25, 30, 25, 30));

        add(Theme.pageHeader("Log FPS Session",
                new JLabel("Record how the game performed on your system")), BorderLayout.NORTH);

        String[] resolutions = {"720p", "1080p", "1440p", "4K"};
        for (String r : resolutions) resolutionCombo.addItem(r);
        resolutionCombo.setSelectedItem("1080p");

        crashedBox.setOpaque(false);
        crashedBox.setForeground(Theme.TEXT_PRIMARY);
        crashedBox.setFont(Theme.FONT_NORMAL);
        crashedBox.setFocusPainted(false);

        // ----- Form -----
        JPanel form = new JPanel(new GridBagLayout());
        form.setOpaque(false);
        Theme.addFormRow(form, 0, "Game", gameCombo);
        Theme.addFormRow(form, 1, "Player Name", playerField);
        Theme.addFormRow(form, 2, "Resolution", resolutionCombo);
        Theme.addFormRow(form, 3, "Average FPS", fpsField);
        Theme.addFormRow(form, 4, "CPU Usage (%)", cpuField);
        Theme.addFormRow(form, 5, "GPU Usage (%)", gpuField);
        Theme.addFormRow(form, 6, "", crashedBox);

        JButton submitButton = Theme.button("Log Session", Theme.INDIGO);
        JButton clearButton = Theme.button("Clear", Theme.BUTTON_SOFT);
        submitButton.addActionListener(e -> submit());
        clearButton.addActionListener(e -> clearForm());

        JPanel buttons = new JPanel(new FlowLayout(FlowLayout.LEFT, 0, 0));
        buttons.setOpaque(false);
        buttons.add(submitButton);
        buttons.add(Box.createHorizontalStrut(10));
        buttons.add(clearButton);
        Theme.addFormRow(form, 7, "", buttons);

        RoundedPanel formCard = Theme.sectionCard("Session Details", form);
        formCard.setPreferredSize(new Dimension(560, 470));

        RoundedPanel helpCard = Theme.infoCard("How is Stability Score calculated?",
                "<b>70 points</b> come from FPS. 60 FPS or more gives full points.<br><br>"
                + "<b>30 points</b> come from sessions that did <b>not</b> crash.<br><br>"
                + "Example: Avg 45 FPS and 1 crash out of 4 sessions =<br>"
                + "(45/60 x 70) + (3/4 x 30) = <b>75 / 100</b>");
        helpCard.setPreferredSize(new Dimension(340, 470));

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

    private void submit() {
        Game game = (Game) gameCombo.getSelectedItem();
        String player = playerField.getText().trim();

        if (game == null) {
            showError("Please add a game first (Manage Games).");
            return;
        }
        if (player.isEmpty()) {
            showError("Please enter the player name.");
            return;
        }

        double fps, cpu, gpu;
        try {
            fps = Double.parseDouble(fpsField.getText().trim());
            cpu = Double.parseDouble(cpuField.getText().trim());
            gpu = Double.parseDouble(gpuField.getText().trim());
        } catch (NumberFormatException ex) {
            showError("FPS, CPU and GPU must be numbers (e.g. 60 or 72.5).");
            return;
        }

        if (fps <= 0 || fps > 1000) {
            showError("FPS must be between 1 and 1000.");
            return;
        }
        if (cpu < 0 || cpu > 100 || gpu < 0 || gpu > 100) {
            showError("CPU and GPU usage must be between 0 and 100.");
            return;
        }

        PerformanceSession s = system.logSession(game, player,
                (String) resolutionCombo.getSelectedItem(), fps, cpu, gpu, crashedBox.isSelected());

        JOptionPane.showMessageDialog(this,
                "Session " + s.getSessionId() + " logged for " + game.getTitle() + ".\n"
                + String.format("New stability score: %.1f / 100", game.getStabilityScore()),
                "Session Logged", JOptionPane.INFORMATION_MESSAGE);
        clearForm();
    }

    private void clearForm() {
        playerField.setText("");
        fpsField.setText("");
        cpuField.setText("");
        gpuField.setText("");
        crashedBox.setSelected(false);
        resolutionCombo.setSelectedItem("1080p");
    }

    private void showError(String message) {
        JOptionPane.showMessageDialog(this, message, "Invalid Input", JOptionPane.WARNING_MESSAGE);
    }
}
