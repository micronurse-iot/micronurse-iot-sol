shared.pulse_transducer = {
  timer: null,
  send_timestamp: 0,
  send_interval: parseInt(CONFIG.send_interval),
  timer_interval: null,

  callback: function() {},
  pause: function() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = null;
  },
  stop: function() {
    this.pause();
  },
  resume: function() {
    this.timer = setInterval(this.callback, this.send_interval);
  },
  start: function(cb, interval) {
    if(!this.timer)
      this.stop();
    this.callback = cb;
    this.timer_interval = parseInt(interval);
    this.resume();
  }
};

if(shared.pulse_transducer.send_interval < 1000)
  shared.pulse_transducer.send_interval = 1000;

done();
