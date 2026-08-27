# Reflection

## Hardest part
The hardest part was keeping the AI workflow useful while constraining it. Resume feedback needs enough context to be specific, but the product must not invent metrics or achievements. The structured Zod output, focused prompts, input limits, and safe API failures work together to make that boundary explicit.

## What I would do differently
I would establish the test and audit harness earlier. The product had meaningful validation and error behavior before it had executable evidence, so documenting and testing those contracts became a separate capstone task instead of part of the initial implementation loop.

## One surprising lesson
A small visual change can expose a real accessibility defect: the footer’s muted 30% white text looked intentional, but axe measured it at only 2.56:1. The audit made the contrast tradeoff concrete and led to a focused fix without changing the product’s overall visual language.
