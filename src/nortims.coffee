Queue = require 'priority-queue'
events = require 'events'

class NortimStreamer extends events.EventEmitter
  constructor: ->
    @songQueue = new Queue()
    @interval = 0
    @currentSong = new Buffer(0)
    @currentSongLength = 0
    @songPointer = 0

  start: ->
    @interval = setInterval @handleFrame, 26

  stop: ->
    clearInterval @interval

  next: ->
    @currentSong = @songQueue.pop()
    @songPointer = 0
    return unless @currentSong?
    @currentSongLength = @currentSong.length
    @emit 'changetracks'

  queueSong: (buf) ->
    @songQueue.push buf

  handleFrame: =>
    songOnFirstFrame = @songPointer is 0
    songOnLastFrame = yes
    if @currentSongLength <= @songPointer
      @next()

    p = @songPointer + 2
    while @currentSongLength > p+1
      b1 = @currentSong.readUInt8 p
      b2 = @currentSong.readUInt8 p+1
      if b1 is 255 and Math.floor(b2/16) is 15 and b2%16 is 11
        songOnLastFrame = no
        break
      p++

    if songOnLastFrame or songOnFirstFrame
      @songPointer = p
      @handleFrame()
      return

    outBuf = new Buffer p-@songPointer
    @currentSong.copy(outBuf, 0, @songPointer, p)
    @emit 'data', outBuf
    @songPointer = p


module.exports = NortimStreamer
