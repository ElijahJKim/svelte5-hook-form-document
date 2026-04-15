---
title: Quick Start
description: Learn how to build your first form with svelte5-hook-form in minutes.
---

In this guide, we will build a simple login form. You'll learn how to initialize a form, register your inputs, handle validation, and process the submission using the core features of **svelte5-hook-form**.

## Your First Form

Here is a complete, working example of a basic login form using Svelte 5 Runes and TypeScript.

```svelte
<script lang="ts">
  import { createForm } from 'svelte5-hook-form';

  // 1. Initialize the form engine
  const { form, errors, register, handleSubmit } = createForm({
    initialValues: {
      username: "",
      password: ""
    },
    onSubmit: (data) => {
      alert(`Welcome, ${data.username}!`);
    },
  });
</script>

<form onsubmit={handleSubmit} class="login-form">

  <div class="field">
    <label for="username">Username</label>
    <input
      id="username"
      bind:value={form.username}
      {@attach register("username", { required: "Username is required" })}
    />
    <span class="error">{errors.username || ""}</span>
  </div>

  <div class="field">
    <label for="password">Password</label>
    <input
      id="password"
      type="password"
      bind:value={form.password}
      {@attach register("password", {
        required: "Password is required",
        minLength: { value: 6, message: "Must be at least 6 characters" }
      })}
    />
    <span class="error">{errors.password || ""}</span>
  </div>

  <button type="submit">Login</button>
</form>

```
