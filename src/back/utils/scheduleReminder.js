const schedule = require("node-schedule");
const scheduledJobs = new Map();

exports.scheduleReminder = (task) => {

    if (!task.reminder) return;
    if (scheduledJobs.has(task.id)) {
        const job = scheduledJobs.get(task.id);
        job.cancel();
        scheduledJobs.delete(task.id);
    }

    const job = schedule.scheduleJob(new Date(task.reminder), () => {
        console.log(`Reminder: Task "${task.title}" is due!`);
    });

    scheduledJobs.set(task.id, job);

};
