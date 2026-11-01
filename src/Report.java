/**
 * Report class from the Class & Object Diagrams:
 *   - reportId : String
 *   - generatedDate : String
 *   - overallScore : double
 *   - summaryText : String
 *   + exportReport() : String
 */
public class Report {

    private String reportId;
    private Game game;
    private String generatedDate;
    private double overallScore;
    private String summaryText;

    public Report(String reportId, Game game, String generatedDate, double overallScore, String summaryText) {
        this.reportId = reportId;
        this.game = game;
        this.generatedDate = generatedDate;
        this.overallScore = overallScore;
        this.summaryText = summaryText;
    }

    public String getReportId()      { return reportId; }
    public Game getGame()            { return game; }
    public String getGeneratedDate() { return generatedDate; }
    public double getOverallScore()  { return overallScore; }
    public String getSummaryText()   { return summaryText; }

    /** Diagram method: + exportReport() */
    public String exportReport() {
        return "=== GAME ANALYTICS REPORT (" + reportId + ") ===\n"
                + "Game           : " + game.getGameDetails() + "\n"
                + "Generated Date : " + generatedDate + "\n"
                + String.format("Average Rating : %.1f / 5.0\n", game.getAverageRating())
                + String.format("Average FPS    : %.1f FPS (CPU %.0f%% | GPU %.1f%%)\n",
                        game.getAverageFps(), game.getAverageCpu(), game.getAverageGpu())
                + String.format("Overall Score  : %.1f / 100\n", overallScore)
                + "Summary        : " + summaryText;
    }
}
