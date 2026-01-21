// controllers/contactController.js
const Contact = require('../models/Contact');
const { sendEmail } = require("../api/emailService");
const renderTemplate = require("../utils/templateRenderer");
const sendDiscordMessage = require('../utils/discordNotifier');
const Setting = require('../models/Setting');

const contactController = {
    async showForm(req, res) {
        res.render('contact', { title: 'Contact Us' });
    },

    async submit(req, res) {
        const { name, email, message, contact_no } = req.body;
        const messageData = await Contact.create(name, email, message, contact_no);

        const settingsArr = await Setting.all();

        // Convert array → object
        const settings = {};
        settingsArr.forEach((s) => {
            try {
                settings[s.key] = JSON.parse(s.value);
            } catch {
                settings[s.key] = s.value;
            }
        });

        if (settings.notify_contact_submission) {
            if (settings.notification_method === 'email') {
                const html = renderTemplate("contact_message.html", {
                    name,
                    email,
                    contact_no,
                    message,
                    year: new Date().getFullYear()
                });

                sendEmail({
                    to: "ibctank.team@gmail.com",
                    subject: "New Contact Form Message",
                    text: `Message from ${name}`,
                    html
                });
            } else if (settings.notification_method === 'discord') {
                sendDiscordMessage('notification_endpoint', messageData);
            }
        }
        req.flash('success', 'Your query submitted successfully.');
        res.json({ success: true });
    },

    async list(req, res) {
        const contacts = await Contact.getAll();
        res.render('admin/contact/index', { title: 'Contacts', contacts, viewPage: 'contacts' });
    },

    async getTotal() {
        return await Contact.count();
    },

    async show(req, res) {
        const { id } = req.params;
        const contact = await Contact.getById(id);
        if (contact) {
            contact.created_at = formateDate(contact.created_at);
        }
        res.render('admin/contact/show', { title: 'Contact Message', contact, viewPage: 'contacts-show' });
    },

    async delete(req, res) {
        const { id } = req.params;
        await Contact.delete(id);
        req.flash('success', 'Message deleted successfully.');
        res.redirect('/admin/contacts');
    },

    async markAsRead(req, res) {
        const { id } = req.params;
        await Contact.updateStatus(id, 'read');
        res.json({ success: true });
    },

    async markAsReplied(req, res) {
        const { id } = req.params;
        await Contact.updateStatus(id, 'replied');
        res.json({ success: true });
    },

    async replyForm(req, res) {
        const { id } = req.params;
        const contact = await Contact.getById(id);
        if (!contact) {
            req.flash('error', 'Contact not found');
            return res.redirect('/admin/contacts');
        }
        if (contact) {
            contact.created_at = formateDate(contact.created_at);
        }
        res.render('admin/contact/reply', { title: 'Reply to Contact', contact, viewPage: 'contacts-reply' });
    },

    async sendReply(req, res) {
        try {
            const { id } = req.params;
            const { reply_message } = req.body;

            if (!reply_message || !reply_message.trim()) {
                return res.json({ success: false, message: 'Reply message cannot be empty' });
            }

            const contact = await Contact.getById(id);
            if (!contact) {
                return res.json({ success: false, message: 'Contact not found' });
            }

            // Render the email template
            const html = renderTemplate("contact_reply.html", {
                customerName: contact.name,
                replyMessage: reply_message,
                originalMessage: contact.message,
                year: new Date().getFullYear()
            });

            // Send the reply email
            await sendEmail({
                to: contact.email,
                subject: 'Re: Your Inquiry - IBC Tank Store',
                text: `Reply to your inquiry`,
                html
            });

            // Update contact status to 'replied'
            await Contact.updateStatus(id, 'replied');

            res.json({ success: true, message: 'Reply sent successfully' });
        } catch (error) {
            console.error('Error sending reply:', error);
            res.json({ success: false, message: 'Error sending reply: ' + error.message });
        }
    }

}

function formateDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()]; // Month should be as Jan to Dec
    const year = d.getFullYear();
    const hours = d.getHours() % 12 || 12; //12-hour format
    const ampm = d.getHours() >= 12 ? 'PM' : 'AM'; // Uncomment this line if using 12-hour format
    const minutes = d.getMinutes();
    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`; // Include AM/PM if using 12-hour format
}

module.exports = contactController;
