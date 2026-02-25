//controllers/analyticsController.js
const AnalyticsService = require("../services/analytics.service");

exports.getAnalyticsDashboard = async (req, res) => {
    try {
        const startDate = req.query.start || "7daysAgo";
        const endDate = req.query.end || "today";

        const data = await AnalyticsService.getDashboardData(startDate, endDate);
        
        res.render("admin/analytics", { title: "Analytics Dashboard", viewPage: "analytics", dateRange: startDate, ...data });

    } catch (error) {
        console.error(error);
        res.status(500).send("Analytics fetch failed");
    }
};

exports.getRealtimeData = async (req, res) => {
    try {
        const realtime = await AnalyticsService.getRealtimeUsers();
        res.json({ realtimeUsers: Number(realtime.rows[0].metricValues[0].value) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch realtime data" });
    }
};