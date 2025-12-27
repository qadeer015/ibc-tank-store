// middleware/settingMiddleware.js
const Setting = require("../models/Setting");
const { readSettingsCookie, saveSettingsCookie } = require("../utils/settingsCookie");

module.exports = async function settingMiddleware(req, res, next) {
    try {
        let settings = readSettingsCookie(req);

        // If not cached, fetch from DB
        if (!settings) {
            const settingsArray = await Setting.all();
            settings = {};

            settingsArray.forEach((s) => {
                try {
                    settings[s.key] = JSON.parse(s.value);
                } catch {
                    settings[s.key] = s.value;
                }
            });
            // Save to cookie for future requests
            saveSettingsCookie(res, settings);
        }

        // Make settings accessible to views
        res.locals.settings = settings;
        next();
    } catch (err) {
        console.error("Error in setting middleware:", err);
        res.locals.settings = {};
        next();
    }
};