export function GET() {
  return new Response("pong", {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      Expires: "0",
    },
  });
}
