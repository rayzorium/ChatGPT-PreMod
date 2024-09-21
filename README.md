# ChatGPT-PreMod
Hides moderation visual effects. _Prevents_ the deletion of streaming response after it fully comes in. Lost on reload, and note response streaming will not even be allowed to even start if your request is BLOCKED (red/removed). There is somewhat of a workaround, though - you can ask "repeat your last response" afterward - _that_ request will not be BLOCKED. The model has zero knowledge of what was blocked or not.

To install, have TamperMonkey extension installed and go here: https://github.com/rayzorium/ChatGPT-PreMod/raw/refs/heads/main/ChatGPT%20PreMod.user.js

There's like 200K lines of browser code on ChatGPT.com and I'm not a front end guy at all, but I'm going by my gut and guessing that OpenAI finally did the 1-line API code change needed to kill DeMod for good. We still have options, but they're a hollow shell of what we could do before. 

Basically, when providing conversation history, OpenAI used to send BLOCKED messages all the way to your browser, and the front end code is instructed to delete it. All a script had to do was intercept that deletion. Unfortunately, they now likely delete it before sending it to us. Aaaaaand that's that, lol.

HOWEVER, there are cracks - can take advantage of how moderation is done. If your request is BLOCKED, they cut off streaming right away. If your request is clean or orange, however, the entire response comes in, and  THEN the moderation check is done. Note that even if your request is BLOCKED, you can still ask ChatGPT after it's done to "repeat your last response." The model has no idea what's going on with moderation, which is completely separte, and a simple "repeat" request would obviously be clean. =)

Also, for now, the option is available to have it be read out loud.

The "ChatGPT anti censorship" extension also does these, but it's Chrome only. DeMod could trivially add it, but IDK how active 4as is and they've stated they don't currently used ChatGPT for NSFW. fine_ill_do_it_myself.gif

# Options for Improvement
The only thing we can really do better is save that text locally, and intelligently populate conversations from that local data. That's quite a bit more work that I'm not going to do it anytime soon, but just an FYI for any motivated developers (or non-developers willing to learn or do a lot of back-and-forth with ChatGPT, lol)

And another option: official data export. All the data is there, and CRDP requires them to give us everything they have. Nothing is actually lost, it's just not conveniently there for us to look at in their interface.
