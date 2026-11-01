import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;

/**
 * A small dashboard card: TITLE, big VALUE and a colored subtitle.
 */
public class MetricCard extends RoundedPanel {

    private JLabel valueLabel;
    private JLabel subtitleLabel;

    public MetricCard(String title, Color accent) {
        super(Theme.CARD_BG, accent);
        setLayout(new BorderLayout(0, 6));
        setBorder(new EmptyBorder(18, 24, 18, 18));

        valueLabel = Theme.label("-", new Font("Segoe UI", Font.BOLD, 28), Theme.TEXT_PRIMARY);
        subtitleLabel = Theme.label(" ", new Font("Segoe UI", Font.PLAIN, 13), accent);

        add(Theme.label(title, Theme.FONT_SMALL, Theme.TEXT_MUTED), BorderLayout.NORTH);
        add(valueLabel, BorderLayout.CENTER);
        add(subtitleLabel, BorderLayout.SOUTH);
    }

    public void update(String value, String subtitle) {
        valueLabel.setText(value);
        subtitleLabel.setText(subtitle);
    }
}
