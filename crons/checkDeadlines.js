const cron = require('node-cron');
const NotificationService = require('../services/notificationService');

function initDeadlineChecker() {
  cron.schedule('*/15 * * * *', async () => {
    try {
      await NotificationService.checkDeadlines();
    } catch (err) {
      console.error('[CRON] Error checking deadlines:', err);
    }
  });
}

module.exports = initDeadlineChecker;
