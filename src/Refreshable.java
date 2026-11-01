/**
 * Every screen implements this so MainFrame can reload its data
 * whenever the user opens that screen.
 */
public interface Refreshable {
    void refresh();
}
