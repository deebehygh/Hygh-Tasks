class Logger {
    color = {
        reset: "\x1b[0m",
        bright: "\x1b[1m",
        dim: "\x1b[2m",
        underscore: "\x1b[4m",
        blink: "\x1b[5m",
        reverse: "\x1b[7m",
        hidden: "\x1b[8m",
        fg: {
            black: "\x1b[30m",
            red: "\x1b[31m",
            green: "\x1b[32m",
            yellow: "\x1b[33m",
            blue: "\x1b[34m",
            magenta: "\x1b[35m",
            cyan: "\x1b[36m",
            white: "\x1b[37m",
            crimson: "\x1b[38m"
        },
        bg: {
            black: "\x1b[40m",
            red: "\x1b[41m",
            green: "\x1b[42m",
            yellow: "\x1b[43m",
            blue: "\x1b[44m",
            magenta: "\x1b[45m",
            cyan: "\x1b[46m",
            white: "\x1b[47m",
            crimson: "\x1b[48m"
        }
    }
    date_time = new Date();
    date = ("0" + this.date_time.getDate()).slice(-2);
    month = ("0" + (this.date_time.getMonth() + 1)).slice(-2);
    year = this.date_time.getFullYear();
    hours = this.date_time.getHours();
    minutes = this.date_time.getMinutes();
    seconds = this.date_time.getSeconds();
    time = `[${this.year}/${this.month}/${this.date} | ${this.hours}:${this.minutes}:${this.seconds}]`;

    /**
     * @param {string} text
     */
    async event(text) {
        console.log(`${this.color.fg.magenta}%s${this.color.reset}`, `${this.time} ${text}`);
    }

    /**
     * @param {string} text
     */
    async info(text) {
        console.log(`${this.color.fg.green}%s${this.color.reset}`, `${this.time} ${text}`);
    }

    /**
     * @param {any} text
     */
    async error(text) {
        console.log(`${this.color.fg.red}%s${this.color.reset}`, `${this.time} ${text}`);
    }

    /**
     * @param {any} text
     */
    async on_command_used(text) {
        console.log(`${this.color.fg.crimson}%s${this.color.reset}`, `${this.time} ${text}`);
    }
}

module.exports = { Logger }