// services/analytics.service.js
const { BetaAnalyticsDataClient } = require("@google-analytics/data");
const path = require("path");
require('dotenv').config();

const analyticsDataClient = new BetaAnalyticsDataClient({
    credentials: JSON.parse(process.env.GA_CREDENTIALS),
});

const PROPERTY_ID = process.env.GA4_PROPERTY_ID;

class AnalyticsService {

    static async getWebsiteStats() {
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${PROPERTY_ID}`,
            dateRanges: [
                { startDate: "7daysAgo", endDate: "today" },
            ],
            metrics: [
                { name: "activeUsers" },
                { name: "sessions" },
                { name: "screenPageViews" },
            ],
        });

        return response;
    }

    static async getTopPages() {
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${PROPERTY_ID}`,
            dateRanges: [
                { startDate: "7daysAgo", endDate: "today" },
            ],
            dimensions: [{ name: "pagePath" }],
            metrics: [{ name: "screenPageViews" }],
            limit: 5,
        });

        return response;
    }

    static async getRealtimeUsers() {
        const [response] = await analyticsDataClient.runRealtimeReport({
            property: `properties/${PROPERTY_ID}`,
            metrics: [{ name: "activeUsers" }],
        });

        return response;
    }

    static async getMonthlyComparison() {
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${PROPERTY_ID}`,
            dateRanges: [
                { startDate: "30daysAgo", endDate: "today" },
                { startDate: "60daysAgo", endDate: "31daysAgo" }
            ],
            metrics: [{ name: "activeUsers" }],
        });

        return response;
    }

    static async getDeviceStats() {
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${PROPERTY_ID}`,
            dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
            dimensions: [{ name: "deviceCategory" }],
            metrics: [{ name: "activeUsers" }],
        });

        return response;
    }

    static async getCountryStats() {
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${PROPERTY_ID}`,
            dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
            dimensions: [{ name: "country" }],
            metrics: [{ name: "activeUsers" }],
            limit: 10,
        });

        return response;
    }

    static async getTrafficSources() {
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${PROPERTY_ID}`,
            dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
            dimensions: [{ name: "sessionDefaultChannelGroup" }],
            metrics: [{ name: "sessions" }],
        });

        return response;
    }

    static async getDashboardData(startDate, endDate) {

        const [stats] = await analyticsDataClient.runReport({
            property: `properties/${PROPERTY_ID}`,
            dateRanges: [{ startDate, endDate }],
            metrics: [
                { name: "activeUsers" },
                { name: "sessions" },
                { name: "screenPageViews" }
            ]
        });

        const [devices] = await analyticsDataClient.runReport({
            property: `properties/${PROPERTY_ID}`,
            dateRanges: [{ startDate, endDate }],
            dimensions: [{ name: "deviceCategory" }],
            metrics: [{ name: "activeUsers" }]
        });

        const [countries] = await analyticsDataClient.runReport({
            property: `properties/${PROPERTY_ID}`,
            dateRanges: [{ startDate, endDate }],
            dimensions: [{ name: "country" }],
            metrics: [{ name: "activeUsers" }],
            limit: 10
        });

        const [traffic] = await analyticsDataClient.runReport({
            property: `properties/${PROPERTY_ID}`,
            dateRanges: [{ startDate, endDate }],
            dimensions: [{ name: "sessionDefaultChannelGroup" }],
            metrics: [{ name: "sessions" }]
        });

        // With this:
        const [monthlyResponse] = await analyticsDataClient.runReport({
            property: `properties/${PROPERTY_ID}`,
            dateRanges: [
                { startDate, endDate },
                { startDate: "60daysAgo", endDate: "31daysAgo" }
            ],
            metrics: [{ name: "activeUsers" }]
        });

        let monthlyRows = [];
        if (monthlyResponse.rows && monthlyResponse.rows.length > 0) {
            const row = monthlyResponse.rows[0];
            // Create two separate row-like objects to match the template's expectation
            monthlyRows.push({ metricValues: [{ value: row.metricValues[0]?.value || '0' }] }); // current period
            monthlyRows.push({ metricValues: [{ value: row.metricValues[1]?.value || '0' }] }); // previous period
        }

        const [realtime] = await analyticsDataClient.runRealtimeReport({
            property: `properties/${PROPERTY_ID}`,
            metrics: [{ name: "activeUsers" }],
        });

        return {
            summary: {
                activeUsers: Number(stats.rows?.[0]?.metricValues?.[0]?.value || 0),
                sessions: Number(stats.rows?.[0]?.metricValues?.[1]?.value || 0),
                pageViews: Number(stats.rows?.[0]?.metricValues?.[2]?.value || 0),
                realtimeUsers: Number(realtime.rows[0]?.metricValues?.[0]?.value || 0)
            },
            devices: devices.rows || [],
            countries: countries.rows || [],
            traffic: traffic.rows || [],
            monthly: monthlyRows || []
        };
    }
}

module.exports = AnalyticsService;