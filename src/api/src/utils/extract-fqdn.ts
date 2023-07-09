export const extractFqdn = (fqdn: string): { tld: string; name?: string; host?: string } => {
  const parts = fqdn.split(".");
  const tld = parts.pop();
  if (!tld) throw new Error("Could not extract TLD from FQDN"); // TODO:
  if (parts.length) {
    const name = parts.pop();
    if (!name) return { tld };
    if (parts.length) {
      const host = parts.join(".");
      return { tld, name, host };
    } else {
      return { tld, name };
    }
  } else {
    return { tld };
  }
};
