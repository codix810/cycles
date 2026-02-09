export async function getCraftsmenRatings(ids: string[]) {
  const res = await fetch("/api/reviews/bulk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });
  return res.json();
}
