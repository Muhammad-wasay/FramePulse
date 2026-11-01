import javax.swing.*;
import java.awt.*;
import java.awt.geom.RoundRectangle2D;

/**
 * A JPanel with rounded corners (like CSS border-radius).
 * If an accent color is given, a thin colored bar is drawn on the left side.
 */
public class RoundedPanel extends JPanel {

    private Color background;
    private Color accent;

    public RoundedPanel(Color background, Color accent) {
        this.background = background;
        this.accent = accent;
        setOpaque(false);
    }

    @Override
    protected void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        RoundRectangle2D shape = new RoundRectangle2D.Float(0, 0, getWidth(), getHeight(), 20, 20);
        g2.setColor(background);
        g2.fill(shape);
        // thin border so white cards stand out on the cream page
        g2.setColor(Theme.BORDER);
        g2.draw(new RoundRectangle2D.Float(0.5f, 0.5f, getWidth() - 1, getHeight() - 1, 20, 20));
        if (accent != null) {
            g2.setClip(shape);
            g2.setColor(accent);
            g2.fillRect(0, 0, 6, getHeight());
        }
        g2.dispose();
        super.paintComponent(g);
    }
}
