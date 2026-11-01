import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.List;

/**
 * All colors, fonts and small "factory" methods for styled components.
 * Keeping styling here means the screen classes stay short and simple.
 */
public class Theme {

    // Slate + neon color palette
    // Minimal coffee brown + white palette
    public static final Color BG_DARK      = new Color(247, 243, 238); // page background (cream)
    public static final Color SIDEBAR_BG   = new Color(255, 255, 255); // sidebar (white)
    public static final Color CARD_BG      = new Color(255, 255, 255); // cards (white)
    public static final Color CARD_BG_ALT  = new Color(250, 247, 243); // zebra rows
    public static final Color INPUT_BG     = new Color(250, 247, 243); // text fields
    public static final Color BORDER       = new Color(226, 216, 206); // thin borders
    public static final Color TEXT_PRIMARY = new Color(59, 42, 32);    // dark espresso
    public static final Color TEXT_MUTED   = new Color(139, 119, 102); // latte grey-brown
    public static final Color INDIGO       = new Color(111, 78, 55);   // main accent: coffee brown
    public static final Color EMERALD      = new Color(91, 140, 90);   // soft green
    public static final Color CYAN         = new Color(164, 117, 81);  // caramel
    public static final Color AMBER        = new Color(201, 139, 58);  // honey
    public static final Color ROSE         = new Color(181, 82, 74);   // muted red
    public static final Color BUTTON_SOFT  = new Color(142, 122, 106); // secondary buttons

    public static final Font FONT_TITLE   = new Font("Segoe UI", Font.BOLD, 24);
    public static final Font FONT_HEADING = new Font("Segoe UI", Font.BOLD, 16);
    public static final Font FONT_NORMAL  = new Font("Segoe UI", Font.PLAIN, 14);
    public static final Font FONT_BOLD    = new Font("Segoe UI", Font.BOLD, 13);
    public static final Font FONT_SMALL   = new Font("Segoe UI", Font.BOLD, 12);

    /** Makes dialogs (JOptionPane) and combo box popups dark too. */
    public static void applyGlobalDefaults() {
        UIManager.put("OptionPane.background", CARD_BG);
        UIManager.put("Panel.background", CARD_BG);
        UIManager.put("OptionPane.messageForeground", TEXT_PRIMARY);
        UIManager.put("Button.background", INPUT_BG);
        UIManager.put("Button.foreground", TEXT_PRIMARY);
        UIManager.put("OptionPane.messageFont", FONT_NORMAL);
        UIManager.put("ComboBox.background", INPUT_BG);
        UIManager.put("ComboBox.foreground", TEXT_PRIMARY);
        UIManager.put("ComboBox.buttonBackground", INPUT_BG);
        UIManager.put("ComboBox.selectionBackground", INDIGO);
        UIManager.put("ComboBox.selectionForeground", Color.WHITE);
    }

    // ---------------- Labels ----------------

    public static JLabel label(String text, Font font, Color color) {
        JLabel label = new JLabel(text);
        label.setFont(font);
        label.setForeground(color);
        return label;
    }

    /** Big page title with a small grey subtitle under it. */
    public static JPanel pageHeader(String title, JLabel subtitleLabel) {
        JPanel header = new JPanel();
        header.setOpaque(false);
        header.setLayout(new BoxLayout(header, BoxLayout.Y_AXIS));
        header.setBorder(new EmptyBorder(0, 0, 0, 10));
        header.add(label(title + "  ", FONT_TITLE, TEXT_PRIMARY));
        header.add(Box.createVerticalStrut(4));
        subtitleLabel.setFont(FONT_NORMAL);
        subtitleLabel.setForeground(TEXT_MUTED);
        header.add(subtitleLabel);
        return header;
    }

    // ---------------- Inputs ----------------

    public static JTextField textField() {
        JTextField field = new JTextField();
        styleInput(field);
        field.setCaretColor(TEXT_PRIMARY);
        return field;
    }

    public static void styleInput(JComponent c) {
        c.setBackground(INPUT_BG);
        c.setForeground(TEXT_PRIMARY);
        c.setFont(FONT_NORMAL);
        c.setBorder(BorderFactory.createCompoundBorder(
                new LineBorder(BORDER, 1, true), new EmptyBorder(8, 10, 8, 10)));
    }

    public static <T> JComboBox<T> comboBox() {
        JComboBox<T> combo = new JComboBox<>();
        combo.setBackground(INPUT_BG);
        combo.setForeground(TEXT_PRIMARY);
        combo.setFont(FONT_NORMAL);
        combo.setPreferredSize(new Dimension(240, 38));
        return combo;
    }

    /** Puts all games into a combo box and keeps the old selection if possible. */
    public static void fillGameCombo(JComboBox<Game> combo, List<Game> games) {
        Object oldSelection = combo.getSelectedItem();
        combo.removeAllItems();
        for (Game g : games) {
            combo.addItem(g);
        }
        if (oldSelection != null) {
            combo.setSelectedItem(oldSelection);
        }
    }

    /** Adds "Label : Field" as one row of a GridBagLayout form. */
    public static void addFormRow(JPanel form, int row, String labelText, JComponent field) {
        GridBagConstraints g = new GridBagConstraints();
        g.gridx = 0;
        g.gridy = row;
        g.anchor = GridBagConstraints.WEST;
        g.insets = new Insets(8, 0, 8, 20);
        form.add(label(labelText, FONT_BOLD, TEXT_MUTED), g);

        g.gridx = 1;
        g.fill = GridBagConstraints.HORIZONTAL;
        g.weightx = 1;
        g.insets = new Insets(8, 0, 8, 0);
        form.add(field, g);
    }

    // ---------------- Buttons ----------------

    /** Rounded colored button with hover / press effect. */
    public static JButton button(String text, Color color) {
        JButton button = new JButton(text) {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                Color fill = color;
                if (getModel().isPressed()) fill = color.darker();
                else if (getModel().isRollover()) fill = color.brighter();
                g2.setColor(fill);
                g2.fillRoundRect(0, 0, getWidth(), getHeight(), 12, 12);
                g2.dispose();
                super.paintComponent(g);
            }
        };
        button.setContentAreaFilled(false);
        button.setBorderPainted(false);
        button.setFocusPainted(false);
        button.setOpaque(false);
        button.setForeground(Color.WHITE);
        button.setFont(FONT_BOLD);
        button.setBorder(new EmptyBorder(10, 20, 10, 20));
        button.setCursor(new Cursor(Cursor.HAND_CURSOR));
        return button;
    }

    // ---------------- Cards ----------------

    /** A rounded card with a heading on top and any content below. */
    public static RoundedPanel sectionCard(String heading, Component content) {
        RoundedPanel card = new RoundedPanel(CARD_BG, null);
        card.setLayout(new BorderLayout(0, 12));
        card.setBorder(new EmptyBorder(18, 20, 18, 20));
        card.add(label(heading, FONT_HEADING, TEXT_PRIMARY), BorderLayout.NORTH);
        card.add(content, BorderLayout.CENTER);
        return card;
    }

    /** A card that only shows some help text (HTML allowed). */
    public static RoundedPanel infoCard(String heading, String html) {
        JLabel text = label("<html><body style='width:220px'>" + html + "</body></html>",
                FONT_NORMAL, TEXT_MUTED);
        text.setVerticalAlignment(SwingConstants.TOP);
        return sectionCard(heading, text);
    }

    // ---------------- Tables ----------------

    /** Table model where the user cannot edit cells directly. */
    public static DefaultTableModel tableModel(String... columns) {
        return new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };
    }

    public static JTable table(DefaultTableModel model) {
        JTable table = new JTable(model);
        table.setBackground(CARD_BG);
        table.setForeground(TEXT_PRIMARY);
        table.setFont(FONT_NORMAL);
        table.setRowHeight(32);
        table.setGridColor(BORDER);
        table.setShowVerticalLines(false);
        table.setSelectionBackground(INDIGO);
        table.setSelectionForeground(Color.WHITE);
        table.setFillsViewportHeight(true);
        table.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        table.setDefaultRenderer(Object.class, new CellRenderer());

        table.getTableHeader().setReorderingAllowed(false);
        table.getTableHeader().setBackground(INPUT_BG);
        table.getTableHeader().setPreferredSize(new Dimension(0, 34));
        table.getTableHeader().setDefaultRenderer(new HeaderRenderer());
        return table;
    }

    public static JScrollPane scroll(Component c) {
        JScrollPane sp = new JScrollPane(c);
        sp.setBorder(BorderFactory.createEmptyBorder());
        sp.getViewport().setBackground(CARD_BG);
        sp.setBackground(CARD_BG);
        return sp;
    }

    /** Colors status words (APPROVED, PENDING, ...) and makes zebra rows. */
    private static class CellRenderer extends DefaultTableCellRenderer {
        @Override
        public Component getTableCellRendererComponent(JTable table, Object value, boolean selected,
                                                       boolean focus, int row, int col) {
            super.getTableCellRendererComponent(table, value, selected, false, row, col);
            setBorder(new EmptyBorder(0, 10, 0, 10));
            if (!selected) {
                setBackground(row % 2 == 0 ? CARD_BG : CARD_BG_ALT);
                String text = String.valueOf(value);
                if (text.equals("APPROVED") || text.equals("Stable")) setForeground(EMERALD);
                else if (text.equals("PENDING")) setForeground(AMBER);
                else if (text.equals("REJECTED") || text.equals("Crashed")) setForeground(ROSE);
                else setForeground(TEXT_PRIMARY);
            }
            return this;
        }
    }

    private static class HeaderRenderer extends DefaultTableCellRenderer {
        @Override
        public Component getTableCellRendererComponent(JTable table, Object value, boolean selected,
                                                       boolean focus, int row, int col) {
            super.getTableCellRendererComponent(table, value, false, false, row, col);
            setBackground(INPUT_BG);
            setForeground(TEXT_MUTED);
            setFont(FONT_SMALL);
            setBorder(new EmptyBorder(0, 10, 0, 10));
            return this;
        }
    }
}
