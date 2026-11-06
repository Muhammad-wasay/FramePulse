import javax.swing.SwingUtilities;

/**
 * Program starts here.
 * Integrates Theme defaults, AnalyticsSystem controller, MainFrame presentation,
 * and user authentication per OOAD Activity & Sequence diagrams.
 */
public class Main {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            Theme.applyGlobalDefaults();
            AnalyticsSystem system = new AnalyticsSystem();
            MainFrame frame = new MainFrame(system);
            frame.setVisible(true);

            // Displays Login Dialog on startup to fulfill the Activity Diagram & Sequence Diagram
            LoginDialog loginDialog = new LoginDialog(frame, system);
            loginDialog.setVisible(true);
            frame.updateUserBadge();
        });
    }
}
