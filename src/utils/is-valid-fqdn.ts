import fs from "fs";
import path from "path";

const EMOJI_REGEX = fs.readFileSync(path.join(process.cwd(), "static/domain-emoji-regex.txt"), "utf8");
const FQDN_REGEX = new RegExp(`(?=^.{1,253}$)(^(((?!-)([a-z0-9-_]|${EMOJI_REGEX}){1,128}(?<!-))|((?!-)([a-z0-9-]|${EMOJI_REGEX}){1,128}(?<!-)\.)+[a-z_-]{2,63})$)`, "u");
export const isValidFqdn = (fqdn: string): boolean => FQDN_REGEX.test(fqdn);
