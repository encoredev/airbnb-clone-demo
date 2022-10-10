import * as functions from "firebase-functions";
import * as rp from "request-promise";

const isEmulator = process.env.FUNCTIONS_EMULATOR === "true";
const baseURL = isEmulator
  ? "http://localhost:4000"
  : "https://staging-airbnb-mkg2.encr.app";

export const notifyBackend = functions
  .runWith({
    secrets: ["ENCORE_WEBHOOK_SHARED_SECRET"],
  })
  .auth.user()
  .beforeCreate(async (user) => {
    const url = baseURL + "/user.BeforeCreateWebhook";
    await rp(url, {
      headers: {
        "X-Shared-Secret": process.env.ENCORE_WEBHOOK_SHARED_SECRET!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        User: {
          ID: user.uid,
          Email: user.email ?? "",
          DisplayName: user.displayName ?? "",
          PictureURL: user.photoURL ?? "",
          Disabled: user.disabled,
        },
      }),
    });
  });
