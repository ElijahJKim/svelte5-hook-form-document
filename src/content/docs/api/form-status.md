---
title: Form Status
description: Master the reactive states of your form to provide real-time feedback.
---

Form status properties are reactive Svelte 5 states. They allow you to track whether a form is valid, being submitted, or has been modified, enabling you to build highly interactive UIs.

---

## `isValid()`

The `isValid` function returns a boolean indicating whether the entire form is free of validation errors.

### Usage

It is best used to disable the submit button until the user provides correct information.

```svelte
<script lang="ts">
  const { form, register, isValid, handleSubmit } = createForm({
    initialValues: { email: "" },
    onSubmit: (data) => console.log(data)
  });
</script>

<form onsubmit={handleSubmit}>
  <input bind:value={form.email} {@attach register("email", { required: true })} />

  <button type="submit" disabled={!isValid()}>
    Submit
  </button>
</form>
```

---

## `isSubmitting()`

`isSubmitting` returns `true` while your `onSubmit` function is executing. This is particularly useful for handling asynchronous operations like API calls.

### Usage

Use it to show loading spinners or prevent double submissions.

```svelte
<script lang="ts">
  const { isSubmitting, handleSubmit } = createForm({
    initialValues: { username: "" },
    onSubmit: async (data) => {
      await fetch('/api/save', { method: 'POST', body: JSON.stringify(data) });
    }
  });
</script>

<button onclick={handleSubmit} disabled={isSubmitting()}>
  {isSubmitting() ? "Saving..." : "Save Changes"}
</button>
```

---

## `isDirty()`

The `isDirty` state tracks whether the user has changed any field from its original `initialValues`.

### Usage

Great for showing "Unsaved Changes" warnings or resetting buttons.

```svelte
<script lang="ts">
  const { isDirty, reset } = createForm({
    initialValues: { bio: "Hello world" }
  });
</script>

<textarea bind:value={form.bio}></textarea>

{#if isDirty()}
  <p class="warning">You have unsaved changes!</p>
  <button onclick={() => reset()}>Discard Changes</button>
{/if}
```

---

## `touchedFields`

`touchedFields` is a reactive object that tracks which fields the user has interacted with. A field becomes "touched" (`true`) the moment it loses focus (`blur`).

### Using `mode` with `touchedFields`

To get the most out of `touchedFields`, you should pair it with the `mode` option in your `register` function. The `mode` determines the **Validation Timing** (when the error is calculated), while `touchedFields` determines the **Visibility** (when the error is shown).

We **strongly recommend** using `mode` when working with `touchedFields`. This ensures that errors are calculated and displayed only after the user has finished their intent with a specific field.

```svelte
<script lang="ts">
  const { form, errors, register, touchedFields, isValid, isSubmitting } = createForm({
    initialValues: { username: "" },
    onSubmit: (data) => console.log(data),
  });
</script>

<div class="field">
  <label>Username</label>
  <input
    bind:value={form.username}
    {@attach register("username", {
      required: "Username is required.",
      mode: "onBlur" // Timing: Calculate the error when leaving the input
    })}
  />

  {#if touchedFields.username && errors.username}
    <p class="error-text">{errors.username}</p>
  {/if}
</div>

<button type="submit" disabled={!isValid() || isSubmitting()}>
  {isSubmitting() ? "Submitting..." : "Submit"}
</button>
```

---

### Comparison of Validation Strategies

While we recommend the `onBlur` + `touchedFields` combination, you can adjust the `mode` based on your needs:

| Mode        | Description                                                           |
| :---------- | :-------------------------------------------------------------------- |
| `"onBlur"`  | Triggers validation when the input field loses focus.                 |
| `"onInput"` | Triggers validation every time the value changes (as the user types). |

---
