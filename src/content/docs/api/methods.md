---
title: Methods
description: Programmatically control your form behavior with built-in helper methods.
---

Methods are functions returned by `createForm` that allow you to interact with the form state programmatically. Use them to reset data, watch for changes, or handle server-side errors.

---

## `watch(name)`

The `watch` method allows you to observe a specific field's value reactively. It's incredibly useful for building dynamic UIs that change based on user input.

#### Usage: Password Confirmation

A classic use case for `watch` is comparing two fields in real-time, such as checking if a "Confirm Password" field matches the original "Password".

```svelte
<script lang="ts">
  import { createForm } from 'svelte5-hook-form';

  const { form, watch, register, errors } = createForm({
    initialValues: { password: "", confirmPassword: "" },
    onSubmit: (data) => console.log("Password changed!", data)
  });

  // 1. Watch the primary password field
  const passwordValue = $derived(watch("password"));
  const confirmValue = $derived(watch("confirmPassword"));

  // 2. Derive a 'isMatching' state reactively
  const isMatching = $derived(
    passwordValue !== "" &&
    passwordValue === confirmValue
  );
</script>

<div class="field">
  <input
    type="password"
    bind:value={form.password}
    {@attach register("password", { required: true })}
    placeholder="New Password"
  />
</div>

<div class="field">
  <input
    type="password"
    bind:value={form.confirmPassword}
    {@attach register("confirmPassword", { required: true })}
    placeholder="Confirm Password"
  />

  {#if confirmValue !== "" && !isMatching}
    <p class="error">Passwords do not match!</p>
  {:else if isMatching}
    <p class="success">Passwords match ✅</p>
  {/if}
</div>
```

---

## `reset()`

The `reset` method restores the form to its original state. This includes clearing all `errors`, resetting `touchedFields`, and returning `form` values to their defaults.

### Usage

You can call `reset()` without arguments to use the `initialValues`, or pass a new object to set new defaults (e.g., after an API call).

```svelte
<script lang="ts">
  import { createForm } from 'svelte5-hook-form';

  const { form, register, reset, isDirty, handleSubmit } = createForm({
    // Initial data loaded from the server
    initialValues: { username: "elijah_k", theme: "dark" },
    onSubmit: async (data) => {
      await saveSettings(data);
      alert("Settings saved!");
    }
  });
</script>

<form onsubmit={handleSubmit} class="settings-form">
  <div class="field">
    <label>Username</label>
    <input
      bind:value={form.username}
      {@attach register("username", { required: true })}
    />
  </div>

  <div class="field">
    <label>Theme Preference</label>
    <select bind:value={form.theme}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </div>

  {#if isDirty()}
    <div class="action-buttons">
      <button type="button" class="btn-cancel" onclick={reset}>
        Discard Changes
      </button>
      <button type="submit" class="btn-save">
        Save Changes
      </button>
    </div>
  {/if}
</form>
```

---

## `setError(name, message)`

Sometimes validation happens on the server. `setError` allows you to manually inject an error message into a specific field from outside the `register` logic.

### Usage

Ideal for handling 400 or 401 errors from your backend after the user attempts to submit.

```ts
const { setError, handleSubmit } = createForm({
  initialValues: { email: "", password: "" },
  onSubmit: async (data) => {
    const response = await api.login(data);

    if (response.error === "INVALID_AUTH") {
      // Manually set a server-side error
      setError("password", "The password you entered is incorrect.");
    }
  },
});
```

---

## `clearErrors(name?)`

While validation rules in `register` handle errors automatically, there are times when you need to manually wipe an error message from the UI. `clearErrors` provides complete control over the `errors` object.

### Why do we need it?

1.  **Server-side Error Cleanup**: After calling `setError` for a server-side fail, you might want to clear that specific error as soon as the user starts typing again.
2.  **Bulk Reset**: When you want to clear all error messages without resetting the actual input values in the form.
3.  **Step-by-Step Forms**: When moving to a previous step in a multi-step form and you want to start with a clean slate.

### Usage

The method is flexible and accepts a single field, an array, or nothing.

```svelte
<script lang="ts">
  import { createForm } from 'svelte5-hook-form';

  const { form, errors, register, setError, clearErrors } = createForm({
    initialValues: { email: "" },
    onSubmit: async (data) => {
      // Simulating a server error
      setError("email", "This email is already taken by another user.");
    }
  });
</script>

<div class="field">
  <label>Email Address</label>
  <input
    bind:value={form.email}
    {@attach register("email", { required: true })}

    /* When the user focuses back on the input to fix the error,
       we clear ONLY the email error so they can start fresh.
    */
    onfocus={() => clearErrors("email")}

    class={errors.email ? 'border-red' : ''}
  />

  {#if errors.email}
    <p class="error-text">{errors.email}</p>
    <button type="button" onclick={() => clearErrors("email")}>
       I understand, dismiss this error
    </button>
  {/if}
</div>

<button onclick={() => clearErrors()}>
  Clear all form errors
</button>
```

### Key Differences at a Glance

| Feature            | `clearErrors()`                       | `reset()`                          |
| :----------------- | :------------------------------------ | :--------------------------------- |
| **Input Values**   | **Stays** (User's typed text remains) | **Reset** (Back to initial values) |
| **Error Messages** | **Removed**                           | **Removed**                        |
| **Touched State**  | **Stays**                             | **Reset**                          |

```

```
