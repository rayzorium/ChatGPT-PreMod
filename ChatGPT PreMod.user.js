// ==UserScript==
// @name         ChatGPT PreMod
// @namespace    HORSELOCK.chatgpt
// @version      0.1.0
// @description  Hides moderation visual effects. _Prevents_ the deletion of streaming response after it fully comes in. Lost on reload, and note response streaming will not even be allowed to even start if your request is BLOCKED (red/removed). There is somewhat of a workaround, though - you can ask "repeat your last response" afterward - _that_ request will not be BLOCKED. The model has zero knowledge of what was blocked or not.
// @match        *://chatgpt.com/*
// @match        *://chat.openai.com/*
// @downloadURL  https://raw.githubusercontent.com/rayzorium/ChatGPT-PreMod/main/ChatGPT%20PreMod.js
// @updateURL    https://raw.githubusercontent.com/rayzorium/ChatGPT-PreMod/main/ChatGPT%20PreMod.js
// @run-at       document-start
// @grant        none
// ==/UserScript==


'use strict';

const clearFlagging = t => t.replaceAll(/\"flagged\": ?true/ig, "\"flagged\":false").replaceAll(/\"blocked\": ?true/ig, "\"blocked\":false");

var originalFetch = window.fetch;
window.fetch = async (...args) => {
    const res = await originalFetch(...args), ct = res.headers.get('content-type') || '';
    if (ct.includes('text/event-stream') || ct.includes('application/json')) {
        if (!res.body) return res;
        const stream = new ReadableStream({
            async start(c) {
                const reader = res.body.getReader(), dec = new TextDecoder(), enc = new TextEncoder();
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) { c.close(); break; }
                    let chunk = clearFlagging(dec.decode(value, { stream: true }));
                    c.enqueue(enc.encode(chunk));
                }
            }
        });
        return new Response(stream, { headers: res.headers, status: res.status, statusText: res.statusText });
    }
    return res;
};
