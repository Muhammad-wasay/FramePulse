import javax.swing.*;
import java.awt.*;
import java.util.List;

/**
 * A simple bar chart that shows the FPS of the last 12 sessions of a game.
 * Green bar = 60+ FPS, Amber = 30-59 FPS, Red = below 30 FPS.
 */
public class FpsChartPanel extends JPanel {

    private Game game;

    public FpsChartPanel() {
        setOpaque(false);
        setPreferredSize(new Dimension(300, 200));
    }

    public void setGame(Game game) {
        this.game = game;
        repaint();
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2.setFont(new Font("Segoe UI", Font.PLAIN, 11));

        int left = 36, right = getWidth() - 10, top = 18, bottom = getHeight() - 22;
        int chartHeight = bottom - top;

        if (game == null || game.getSessions().isEmpty()) {
            g2.setColor(Theme.TEXT_MUTED);
            g2.drawString("No sessions logged yet", left, getHeight() / 2);
            g2.dispose();
            return;
        }

        // Take only the last 12 sessions
        List<PerformanceSession> all = game.getSessions();
        int start = Math.max(0, all.size() - 12);
        List<PerformanceSession> shown = all.subList(start, all.size());

        double maxFps = 120;
        for (PerformanceSession s : shown) {
            maxFps = Math.max(maxFps, s.getAverageFps());
        }

        // Horizontal grid lines every 30 FPS
        for (int v = 0; v <= maxFps; v += 30) {
            int y = bottom - (int) (v / maxFps * chartHeight);
            g2.setColor(Theme.BORDER);
            g2.drawLine(left, y, right, y);
            g2.setColor(Theme.TEXT_MUTED);
            g2.drawString(String.valueOf(v), 4, y + 4);
        }

        // Line + soft area chart (one point per session)
        int n = shown.size();
        double slot = (right - left) / (double) n;
        int[] xs = new int[n];
        int[] ys = new int[n];
        for (int i = 0; i < n; i++) {
            xs[i] = left + (int) (i * slot + slot / 2);
            ys[i] = bottom - (int) (shown.get(i).getAverageFps() / maxFps * chartHeight);
        }

        // soft filled area under the line
        Polygon area = new Polygon();
        area.addPoint(xs[0], bottom);
        for (int i = 0; i < n; i++) area.addPoint(xs[i], ys[i]);
        area.addPoint(xs[n - 1], bottom);
        g2.setColor(new Color(Theme.INDIGO.getRed(), Theme.INDIGO.getGreen(), Theme.INDIGO.getBlue(), 40));
        g2.fillPolygon(area);

        // line
        g2.setColor(Theme.INDIGO);
        g2.setStroke(new BasicStroke(2.2f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
        for (int i = 0; i < n - 1; i++) g2.drawLine(xs[i], ys[i], xs[i + 1], ys[i + 1]);

        // dots, FPS values and session numbers
        FontMetrics fm = g2.getFontMetrics();
        for (int i = 0; i < n; i++) {
            double fps = shown.get(i).getAverageFps();
            if (fps >= 60) g2.setColor(Theme.EMERALD);
            else if (fps >= 30) g2.setColor(Theme.AMBER);
            else g2.setColor(Theme.ROSE);
            g2.fillOval(xs[i] - 5, ys[i] - 5, 10, 10);
            g2.setColor(Color.WHITE);
            g2.fillOval(xs[i] - 2, ys[i] - 2, 4, 4);

            String value = String.valueOf((int) fps);
            g2.setColor(Theme.TEXT_PRIMARY);
            g2.drawString(value, xs[i] - fm.stringWidth(value) / 2, ys[i] - 10);

            String index = "#" + (start + i + 1);
            g2.setColor(Theme.TEXT_MUTED);
            g2.drawString(index, xs[i] - fm.stringWidth(index) / 2, bottom + 15);
        }

        // 60 FPS target line (dashed)
        int y60 = bottom - (int) (60 / maxFps * chartHeight);
        g2.setColor(Theme.CYAN);
        g2.setStroke(new BasicStroke(1.5f, BasicStroke.CAP_BUTT, BasicStroke.JOIN_MITER,
                10, new float[]{6, 4}, 0));
        g2.drawLine(left, y60, right, y60);
        g2.drawString("60 FPS target", right - 80, y60 - 5);

        g2.dispose();
    }
}
