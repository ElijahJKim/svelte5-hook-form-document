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

`touchedFields` is a reactive `Set` that contains the names of all fields the user has interacted with (focused and then blurred).

### Usage

Useful for hiding validation errors until a user has actually touched the field, avoiding a "sea of red" on an empty form.

```svelte
<script lang="ts">
  const { form, errors, register, touchedFields } = createForm({
    initialValues: { email: "" }
  });
</script>

<input
  bind:value={form.email}
  {@attach register("email", { required: "Required" })}
/>

{#if touchedFields.has("email") && errors.email}
  <span class="error">{errors.email}</span>
{/if}
```
