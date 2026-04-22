<script setup>
import { computed, onMounted, reactive, ref } from "vue";

const API_BASE =
  import.meta.env.VITE_API_BASE;

if (!API_BASE) {
  throw new Error("Missing required env VITE_API_BASE");
}

const token = ref(localStorage.getItem("token"));
const user = ref(null);
const notes = ref([]);
const loading = ref(false);
const message = ref("");
const isError = ref(false);

const authForm = reactive({
  username: "",
  password: "",
});

const noteForm = reactive({
  title: "",
  body: "",
});

const isLoggedIn = computed(() => Boolean(token.value && user.value));

function setMessage(text, error = false) {
  message.value = text;
  isError.value = error;
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(body.detail || "Request failed");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function loadNotes() {
  notes.value = await request("/notes");
}

async function loadProfile() {
  user.value = await request("/auth/me");
  await loadNotes();
}

async function login() {
  loading.value = true;
  setMessage("Signing in...");

  try {
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify(authForm),
    });

    token.value = data.access_token;
    localStorage.setItem("token", token.value);
    await loadProfile();
    setMessage("");
  } catch (error) {
    setMessage(error.message, true);
  } finally {
    loading.value = false;
  }
}

async function register() {
  loading.value = true;
  setMessage("Creating account...");

  try {
    await request("/auth/register", {
      method: "POST",
      body: JSON.stringify(authForm),
    });
    await login();
  } catch (error) {
    setMessage(error.message, true);
  } finally {
    loading.value = false;
  }
}

async function logout() {
  await request("/auth/logout", { method: "POST" }).catch(() => null);
  token.value = null;
  user.value = null;
  notes.value = [];
  localStorage.removeItem("token");
}

async function createNote() {
  await request("/notes", {
    method: "POST",
    body: JSON.stringify(noteForm),
  });

  noteForm.title = "";
  noteForm.body = "";
  await loadNotes();
}

function formatDate(value) {
  return new Date(value).toLocaleString();
}

onMounted(async () => {
  if (!token.value) {
    return;
  }

  try {
    await loadProfile();
  } catch {
    localStorage.removeItem("token");
    token.value = null;
  }
});
</script>

<template>
  <main class="layout">
    <section v-if="!isLoggedIn" class="auth-panel">
      <div class="brand">
        <span class="brand-mark">V</span>
        <div>
          <h1>Vue Practice Login</h1>
          <p>Vue, Node.js, PostgreSQL, Redis</p>
        </div>
      </div>

      <form class="form" @submit.prevent="login">
        <label>
          Login
          <input v-model.trim="authForm.username" autocomplete="username" minlength="3" required />
        </label>
        <label>
          Password
          <input
            v-model="authForm.password"
            autocomplete="current-password"
            minlength="4"
            required
            type="password"
          />
        </label>
        <div class="actions">
          <button :disabled="loading" type="submit">Sign in</button>
          <button :disabled="loading" class="secondary" type="button" @click="register">
            Register
          </button>
        </div>
      </form>
      <p :class="['message', { error: isError }]">{{ message }}</p>
    </section>

    <section v-else class="app-panel">
      <header class="topbar">
        <div>
          <p class="eyebrow">User</p>
          <h2>{{ user.username }}</h2>
        </div>
        <button class="secondary" type="button" @click="logout">Logout</button>
      </header>

      <form class="note-form" @submit.prevent="createNote">
        <input v-model.trim="noteForm.title" maxlength="120" placeholder="Title" required />
        <textarea v-model="noteForm.body" maxlength="2000" placeholder="Note text"></textarea>
        <button type="submit">Add</button>
      </form>

      <div class="notes">
        <p v-if="notes.length === 0" class="empty">No notes yet.</p>
        <article v-for="note in notes" :key="note.id" class="note">
          <h3>{{ note.title }}</h3>
          <p>{{ note.body || "No text" }}</p>
          <time>{{ formatDate(note.created_at) }}</time>
        </article>
      </div>
    </section>
  </main>
</template>
