/**
 * Keeps compatibility with UI tables while extending PerformanceLog from the Class Diagram.
 */
public class PerformanceSession extends PerformanceLog {

    public PerformanceSession(String sessionId, Player player, Game game, String resolution,
                              double averageFps, double cpuUsage, double gpuUsage, boolean crashed) {
        super(sessionId, player, game, resolution, averageFps, cpuUsage, gpuUsage, crashed,
              java.time.LocalDate.now().toString() + " 09:15");
    }

    public PerformanceSession(String sessionId, Player player, Game game, String resolution,
                              double averageFps, double cpuUsage, double gpuUsage, boolean crashed,
                              String timestamp) {
        super(sessionId, player, game, resolution, averageFps, cpuUsage, gpuUsage, crashed, timestamp);
    }
}
