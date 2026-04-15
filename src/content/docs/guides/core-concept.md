---
title: Core Concepts
description: Understand the fundamental building blocks of svelte5-hook-form.
---

To get the most out of **svelte5-hook-form**, it helps to understand its core building blocks. Let's walk through the essential lifecycle of a form: from initialization to submission.

---

## 1. Initialization (`createForm`)

Every form starts with the `createForm` function. Unlike other libraries, we require two essential properties upfront: `initialValues` and `onSubmit`.

```ts
import { createForm } from "svelte5-hook-form";

const { form, errors, register, handleSubmit } = createForm({
  initialValues: { username: "", age: 0 },
  onSubmit: (data) => {
    console.log("Success!", data);
  },
});
```

### Why are these required?

- **`initialValues`**: This is the magic behind our **zero-boilerplate Type Safety**. By providing the initial data, the library automatically infers the TypeScript schema for your entire form. It also sets the reactive baseline for Svelte's Runes.
- **`onSubmit`**: By defining your success logic here, the library can guarantee that this function will _only_ run when the form data is 100% valid.

---

## 2. The Core API

Once initialized, `createForm` returns an object with reactive states and methods. Here are the 4 essentials you will use in almost every form.

### `form` (State Binding)

We don't reinvent the wheel. We leverage Svelte's native two-way binding. The `form` object holds your real-time reactive data.

```svelte
<input bind:value={form.username} placeholder="Username" />
```

### `register` (Attaching Validation)

The `register` function connects a specific field to the validation engine. You attach it to your input alongside your rules.

```svelte
<input
  bind:value={form.age}
  {@attach register("age", { required: "Age is required" })}
/>
```

Why {@attach} instead of use: ?

If you've used Svelte 4, you are likely familiar with the use: action directive. In Svelte 5, the {@attach} tag was introduced as the modern, more powerful replacement for actions.

### `errors` & Validation Rules

When a user breaks a rule defined in `register`, the `errors` object reactively updates with the corresponding message.

```svelte
<div class="error-msg">{errors.age || ""}</div>
```

#### Available Validation Rules

When using `register`, you can apply the following rules to catch errors:

- **`required`**: `string | boolean` - Ensures the field is not empty.
- **`minLength` / `maxLength`**: `{ value: number, message: string }` - Limits string length.
- **`min` / `max`**: `{ value: number, message: string }` - Limits numeric values.
- **`pattern`**: `{ value: RegExp, message: string }` - Validates against a Regular Expression (e.g., email format).
- **`validate`**: `(value) => boolean | string` - A custom function for complex, cross-field, or asynchronous validation.

### `handleSubmit` (Triggering Submission)

Finally, bind `handleSubmit` to your form or submit button. It acts as a gatekeeper: it prevents the default browser reload, runs all validation rules, and triggers your `onSubmit` function only if the `errors` object is completely empty.

```svelte
<button onclick={handleSubmit}>
  Submit Form
</button>
```

```svelte
<form onsubmit={handleSubmit}>
  <input bind:value={form.username} {@attach register("username")} />
  <button type="submit">
    Submit Form
  </button>
</form>
```

---
