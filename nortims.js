// Generated by CoffeeScript 1.3.3
(function() {
  var NortimStreamer, Queue, events,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Queue = require('priority-queue');

  events = require('events');

  NortimStreamer = (function(_super) {

    __extends(NortimStreamer, _super);

    function NortimStreamer() {
      this.handleFrame = __bind(this.handleFrame, this);
      this.songQueue = new Queue();
      this.interval = 0;
      this.currentSong = new Buffer(0);
      this.currentSongLength = 0;
      this.songPointer = 0;
    }

    NortimStreamer.prototype.start = function() {
      return this.interval = setInterval(this.handleFrame, 26);
    };

    NortimStreamer.prototype.stop = function() {
      return clearInterval(this.interval);
    };

    NortimStreamer.prototype.next = function() {
      this.currentSong = this.songQueue.pop();
      this.songPointer = 0;
      if (this.currentSong == null) {
        return;
      }
      this.currentSongLength = this.currentSong.length;
      return this.emit('changetracks');
    };

    NortimStreamer.prototype.queueSong = function(buf) {
      return this.songQueue.push(buf);
    };

    NortimStreamer.prototype.handleFrame = function() {
      var b1, b2, outBuf, p, songOnFirstFrame, songOnLastFrame;
      songOnFirstFrame = this.songPointer === 0;
      songOnLastFrame = true;
      if (this.currentSongLength <= this.songPointer) {
        this.next();
      }
      p = this.songPointer + 2;
      while (this.currentSongLength > p + 1) {
        b1 = this.currentSong.readUInt8(p);
        b2 = this.currentSong.readUInt8(p + 1);
        if (b1 === 255 && Math.floor(b2 / 16) === 15 && b2 % 16 === 11) {
          songOnLastFrame = false;
          break;
        }
        p++;
      }
      if (songOnLastFrame || songOnFirstFrame) {
        this.songPointer = p;
        this.handleFrame();
        return;
      }
      outBuf = new Buffer(p - this.songPointer);
      this.currentSong.copy(outBuf, 0, this.songPointer, p);
      this.emit('data', outBuf);
      return this.songPointer = p;
    };

    return NortimStreamer;

  })(events.EventEmitter);

  module.exports = NortimStreamer;

}).call(this);