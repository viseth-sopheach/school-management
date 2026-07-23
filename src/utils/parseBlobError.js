export async function parseBlobError(error) {
  const data = error?.response?.data;

  if (data instanceof Blob) {
    try {
      const text = await data.text();
      const parsed = JSON.parse(text);
      return parsed.message || "Something went wrong. Please try again.";
    } catch {
      return "Something went wrong. Please try again.";
    }
  }

  return (
    error?.response?.data?.message || "Something went wrong. Please try again."
  );
}
