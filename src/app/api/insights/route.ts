const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const oAuth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);
oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});
const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const calendarId = searchParams.get("calendarId");
  const timeMin = new Date(Number(searchParams.get("timeMin")!)).toISOString();
  const timeMax = new Date().toISOString();

  const calendarResponse = await calendar.events.list({
    calendarId,
    timeMin,
    timeMax,
    maxResults: 1000,
  });

  return new Response(JSON.stringify(calendarResponse.data.items));
}
