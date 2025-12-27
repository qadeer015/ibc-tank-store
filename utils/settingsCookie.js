// utils/settingCookie.js
const jwt = require("jsonwebtoken");

const COOKIE_NAME = "ibc_tank_store_settings";
const SECRET = process.env.SETTING_SECRET;
const EXPIRES = 30 * 24 * 60 * 60 * 1000;

module.exports = {

    saveSettingsCookie(res, settings) {
        try {
            const token = jwt.sign(settings, SECRET, { expiresIn: "7d" });

            res.cookie(COOKIE_NAME, token, {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: EXPIRES,
            });
        } catch (err) {
            console.error("Error saving settings cookie:", err);
        }
    },

    readSettingsCookie(req) {
        try {
            const token = req.cookies[COOKIE_NAME];
            if (!token) return null;
            return jwt.verify(token, SECRET);
        } catch (err) {
            return null;
        }
    },

    clearSettingsCookie(res) {
        res.clearCookie(COOKIE_NAME);
    }
};
