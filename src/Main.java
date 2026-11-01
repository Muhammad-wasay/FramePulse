import javax.swing.SwingUtilities;

/**
 * Program starts here.
 */
public class Main {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            Theme.applyGlobalDefaults();
            AnalyticsSystem system = new AnalyticsSystem();
            new MainFrame(system).setVisible(true);
        });
    }
}
