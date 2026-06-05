/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Origin of the contact API (see server/). Empty means same origin, proxied to the API in dev. */
  readonly VITE_CONTACT_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
