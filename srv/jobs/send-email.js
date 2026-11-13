const SapCfMailer = require("sap-cf-mailer").default;

(async () => {
    try {
        const mailer = new SapCfMailer("sap_process_automation_mail");
        await mailer.sendMail({
            to: "mohammed.misbhah@incture.com",
            subject: "Scheduled email from Dealer Portal",
            html: "Sent by the scheduler"
        });
        console.log("Email sent");
        process.exit(0);
    } catch (err) {
        console.error("Email failed:", err);
        process.exit(1);
    }
})();