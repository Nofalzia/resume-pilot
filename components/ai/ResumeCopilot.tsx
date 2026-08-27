"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import Image from "next/image";

export default function ResumeCopilot() {
  const [input, setInput] = useState("");

  const {
    messages,
    sendMessage,
    stop,
    status,
  } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isStreaming =
    status === "submitted" || status === "streaming";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!input.trim() || isStreaming) {
      return;
    }

    sendMessage({
      text: input,
    });

    setInput("");
  }

  return (
    <section className="mx-auto flex min-h-[650px] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white text-zinc-900 shadow-xl">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-zinc-900">
            <Image src="/resume-pilot-logo.png" alt="" aria-hidden="true" width={40} height={40} className="h-full w-full object-cover" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-zinc-950">
              Resume Pilot AI
            </h2>

            <p className="text-sm text-zinc-500">
              Your AI resume assistant
            </p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-zinc-50 px-4 py-6 sm:px-6">
        {messages.length === 0 ? (
          <div className="flex min-h-[480px] items-center justify-center">
            <div className="w-full max-w-xl text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 text-lg font-bold text-white shadow-lg">
                ✦
              </div>

              <h3 className="text-2xl font-semibold tracking-tight text-zinc-950">
                How can I help with your resume?
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                Improve your resume, tailor it to a job, or get
                practical feedback from your AI career assistant.
              </p>

              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {[
                  "Improve my professional summary",
                  "Tailor my resume for a job",
                  "Improve an experience bullet",
                  "What skills am I missing?",
                ].map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setInput(prompt)}
                    className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-100"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-3xl">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-6 flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[90%] sm:max-w-[80%] ${
                    message.role === "user"
                      ? "rounded-2xl rounded-br-md bg-zinc-900 px-4 py-3 text-white"
                      : "px-1 py-2 text-zinc-900"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="mb-2 flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg bg-zinc-900">
                        <Image src="/resume-pilot-logo.png" alt="" aria-hidden="true" width={28} height={28} className="h-full w-full object-cover" />
                      </div>

                      <span className="text-xs font-semibold text-zinc-500">
                        Resume Pilot
                      </span>
                    </div>
                  )}

                  {message.parts.map((part, index) => {
                    if (part.type !== "text") {
                      return null;
                    }

                    return (
                      <p
                        key={index}
                        className="whitespace-pre-wrap text-sm leading-7"
                      >
                        {part.text}
                      </p>
                    );
                  })}
                </div>
              </div>
            ))}

            {status === "submitted" && (
              <div className="mb-6 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg bg-zinc-900">
                  <Image src="/resume-pilot-logo.png" alt="" aria-hidden="true" width={28} height={28} className="h-full w-full object-cover" />
                </div>

                <div className="rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-zinc-200">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-zinc-600">
                      Thinking
                    </span>

                    <span className="flex gap-0.5">
                      <span className="animate-bounce text-zinc-400">
                        •
                      </span>
                      <span className="animate-bounce text-zinc-400 [animation-delay:150ms]">
                        •
                      </span>
                      <span className="animate-bounce text-zinc-400 [animation-delay:300ms]">
                        •
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-zinc-200 bg-white p-4 sm:p-5">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex w-full max-w-3xl items-end gap-2"
        >
          <div className="flex min-w-0 flex-1 items-center rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-1 transition focus-within:border-zinc-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-zinc-100">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask Resume Pilot anything..."
              disabled={isStreaming}
              className="min-w-0 flex-1 bg-transparent py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed"
            />
          </div>

          {isStreaming ? (
            <button
              type="button"
              onClick={stop}
              className="shrink-0 rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="shrink-0 rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Send
            </button>
          )}
        </form>

        <p className="mt-3 text-center text-xs text-zinc-400">
          Resume Pilot can help improve wording, structure, and
          job-specific tailoring.
        </p>
      </div>
    </section>
  );
}