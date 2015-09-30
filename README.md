Nortims
=======

NoRTiMS (Node Real Time MP3 Streamer) is a quick project I built to allow multiple clients listen to the same mp3 stream at the same time.

It works by attempting to dectect frames in the MP3 file, then streaming each frame at the same time to every client.

Currently only MPEG-1, Layer 3 files are supported due to my lazy frame sync detection.
