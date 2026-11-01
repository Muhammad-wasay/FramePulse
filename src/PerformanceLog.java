import java.time.LocalDate;

/**
 * PerformanceLog class from the Class Diagram:
 *   - logId : String
 *   - averageFps : double
 *   - cpuUsagePercent : double
 *   - gpuUsagePercent : double
 *   - resolution : String
 *   + getMetricSummary() : String
 */
public class PerformanceLog {

    private String logId;
    private Player player;
    private Game game;
    private String resolution;
    private double averageFps;
    private double cpuUsagePercent;
    private double gpuUsagePercent;
    private boolean crashed;
    private String timestamp;
    private LocalDate date;

    public PerformanceLog(String logId, Player player, Game game, String resolution,
                          double averageFps, double cpuUsagePercent, double gpuUsagePercent,
                          boolean crashed, String timestamp) {
        this.logId = logId;
        this.player = player;
        this.game = game;
        this.resolution = resolution;
        this.averageFps = averageFps;
        this.cpuUsagePercent = cpuUsagePercent;
        this.gpuUsagePercent = gpuUsagePercent;
        this.crashed = crashed;
        this.timestamp = timestamp;
        this.date = LocalDate.now();
    }

    public PerformanceLog(String logId, Gamer gamer, Game game, String resolution,
                          double averageFps, double cpuUsagePercent, double gpuUsagePercent,
                          boolean crashed) {
        this(logId,
             gamer instanceof Player ? (Player) gamer : new Player(gamer.getUserId(), gamer.getUsername()),
             game, resolution, averageFps, cpuUsagePercent, gpuUsagePercent, crashed,
             LocalDate.now().toString() + " 09:15");
    }

    /** Diagram method: + getMetricSummary() */
    public String getMetricSummary() {
        return String.format("%s | %s | %.1f FPS | CPU: %.1f%% | GPU: %.1f%%",
                logId, resolution, averageFps, cpuUsagePercent, gpuUsagePercent);
    }

    public String getLogId()           { return logId; }
    public String getSessionId()       { return logId; }
    public Player getPlayer()          { return player; }
    public Game getGame()              { return game; }
    public String getResolution()      { return resolution; }
    public double getAverageFps()      { return averageFps; }
    public double getCpuUsagePercent() { return cpuUsagePercent; }
    public double getGpuUsagePercent() { return gpuUsagePercent; }
    public double getCpuUsage()        { return cpuUsagePercent; }
    public double getGpuUsage()        { return gpuUsagePercent; }
    public boolean isCrashed()         { return crashed; }
    public String getTimestamp()       { return timestamp; }
    public LocalDate getDate()         { return date; }
}
