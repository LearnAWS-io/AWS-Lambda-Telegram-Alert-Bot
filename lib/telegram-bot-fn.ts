import { SNSEvent } from "aws-lambda";
import { envSchema } from "./schema";
import { stringify as yamlStringify } from "yaml";

// Create Telegram bot using @BotFather
// INFO: get chat_id from https://api.telegram.org/bot{Bot_token}/getUpdates
const { CHAT_ID, TOKEN } = envSchema.parse(process.env);

export const handler = async (e: SNSEvent) => {
  const snsReq = e.Records[0].Sns;
  const msgRaw = snsReq.Message;

  // parse the raw message
  const msg = JSON.parse(msgRaw);
  const errorMsg = msg?.failure?.errorMessage;

  const yamlMsg = yamlStringify(msg)
    // escape characters for telegram API
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("&", "&amp;");

  const text = `
<b>${snsReq.Subject}</b>

${errorMsg ? `Error: ${errorMsg}` : ""}

Event type: ${msg?.eventType ?? "Unkwown"}

<pre>
  <code class="language-yaml">
    ${yamlMsg}
  </code>
</pre>
`;

  const body = {
    chat_id: CHAT_ID,
    text,
    parse_mode: "HTML",
  };

  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (res.status !== 200) {
    console.log("Got non 200 response of ", await res.text());
    throw Error(`Request failed with ${res.statusText}`);
  }
};
