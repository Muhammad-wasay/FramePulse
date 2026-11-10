import javax.swing.SwingUtilities;

/**
 * Program starts here.
 * Integrates Theme defaults, AnalyticsSystem controller, REST API Server (:8080),
 * MainFrame presentation, and user authentication per OOAD Activity, Sequence & Deployment diagrams.
 */
public class Main {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            Theme.applyGlobalDefaults();
            AnalyticsSystem system = new AnalyticsSystem();
            MainFrame frame = new MainFrame(system);

            // Start the built-in Java HTTP REST API server on port 8080 for the React Frontend
            ApiServer.start(system, 8080, frame::repaint);

            frame.setVisible(true);

            // Displays Login Dialog on startup to fulfill the Activity Diagram & Sequence Diagram
            LoginDialog loginDialog = new LoginDialog(frame, system);
            loginDialog.setVisible(true);
            frame.updateUserBadge();
        });
    }
}
