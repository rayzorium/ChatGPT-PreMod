// ==UserScript==
// @name         ChatGPT PreMod
// @namespace    HORSELOCK.chatgpt
// @version      0.2.0
// @description  Hides moderation visual effects. Prevents the deletion of streaming response after it fully comes in. Lost on page reload.
// @match        *://chatgpt.com/*
// @match        *://chat.openai.com/*
// @downloadURL  https://github.com/rayzorium/ChatGPT-PreMod/raw/main/ChatGPT%20PreMod.user.js
// @updateURL    https://github.com/rayzorium/ChatGPT-PreMod/raw/main/ChatGPT%20PreMod.user.js
// @run-at       document-start
// @grant        none
// ==/UserScript==


'use strict';

const clearFlagging = t => {
    const wasBlocked = /"blocked":\s*true/i.test(t);
    const cleared = t.replace(/"flagged":\s*true/ig, '"flagged":false').replace(/"blocked":\s*true/ig, '"blocked":false');
    return wasBlocked ? { cleared, blocked: true } : { cleared, blocked: false };
};

let isInitialLoad = true;
setTimeout(() => { isInitialLoad = false; }, 2000);

const originalFetch = window.fetch;
window.fetch = async (...args) => {
    const res = await originalFetch(...args);
    const ct = res.headers.get('content-type') || '';

    if (ct.includes('text/event-stream') || ct.includes('application/json')) {
        if (!res.body) return res;

        const stream = new ReadableStream({
            async start(controller) {
                const reader = res.body.getReader(), dec = new TextDecoder(), enc = new TextEncoder();
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) { controller.close(); break; }
                    let chunk = dec.decode(value, { stream: true });
                    const { cleared, blocked } = clearFlagging(chunk);

                    if (blocked && !isInitialLoad) {
                        window.alert("Message BLOCKED\n\nIf you just loaded the page, ignore this.\n\nIf a response, just finished, note it will be lost upon leaving page.\n\n If it was YOUR request, note response may not ever show up: wait until done, you can ChatGPT to repeat last response.\n\n");
                    }

                    controller.enqueue(enc.encode(cleared));
                }
            }
        });

        return new Response(stream, { headers: res.headers, status: res.status, statusText: res.statusText });
    }

    return res;
};
