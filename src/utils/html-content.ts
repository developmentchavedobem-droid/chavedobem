function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&amp;/gi, "&");
}

export function stripHtml(value?: string | null) {
  if (!value) return "";

  return decodeHtmlEntities(value)
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function sanitizeCampaignHtml(value?: string | null) {
  if (!value) return "";

  return decodeHtmlEntities(value)
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[\s\S]*?>[\s\S]*?<\/object>/gi, "")
    .replace(/<embed[\s\S]*?>[\s\S]*?<\/embed>/gi, "")
    .replace(/<svg[\s\S]*?>[\s\S]*?<\/svg>/gi, "")
    .replace(/\s+on\w+=(["']).*?\1/gi, "")
    .replace(/\s+on\w+=[^\s>]+/gi, "")
    .replace(/\s+(href|src)=(["'])\s*javascript:[\s\S]*?\2/gi, ' $1="#"')
    .trim();
}

export function getTextPreview(value?: string | null, fallback = "") {
  return stripHtml(value) || fallback;
}
