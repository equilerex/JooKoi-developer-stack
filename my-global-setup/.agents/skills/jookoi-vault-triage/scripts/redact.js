#!/usr/bin/env node
'use strict';
// Secret redaction for staged capture copies and for everything a triage batch wrote.
// Patterns are deliberately broad: a false positive costs one word, a miss puts a secret into the vault.
// CLI: node redact.js <file>... [--check]   (--check reports hits without rewriting)
const fs = require('fs');

const R = '[REDACTED]';

const TOKENS = [
  ['private key', /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g],
  ['auth header', /\b(?:Bearer|Basic)\s+[A-Za-z0-9._~+\/=|-]{8,}/gi],
  ['jwt', /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/g],
  ['api key', /\b(?:sk|pk|rk)-[A-Za-z0-9_-]{16,}/g],
  ['github token', /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}/g],
  ['github token', /\bgithub_pat_[A-Za-z0-9_]{20,}/g],
  ['aws key', /\bAKIA[0-9A-Z]{16}\b/g],
  ['slack token', /\bxox[abprs]-[A-Za-z0-9-]{10,}/g],
  ['google key', /\bAIza[0-9A-Za-z_-]{30,}/g],
];

// label: value. Keeps the label, replaces the value.
const LABELED = [
  ['token', /((?:api[_-]?key|secret|token|authorization)["']?[ \t]*[:=][ \t]*["']?)(?!\[REDACTED\])[^\s"',;]{8,}/gi],
  // Passwords in English and Estonian. Needs a separator ("password: x", "parool on x"), so "password manager" is left alone.
  ['password', /(\b(?:password|passwd|pwd|passcode|parool|salasõna)\b["']?[ \t]*(?:[:=]|\bis\b|\bon\b)[ \t]*["']?)(?!\[REDACTED\])[^\s"',;]{4,}/gi],
  // PINs: PIN, PIN1/PIN2, PUK, PIN code, PIN-kood. Digits only, so "pin the photo" is left alone.
  ['pin', /(\b(?:pin[ -]?[12]?|puk[12]?|pin[ -]?(?:code|kood|koodid?))\b["']?[ \t]*(?:[:=-]|\bis\b|\bon\b)?[ \t]*["']?)(\d[\d \t-]{2,14}\d)/gi],
];

function luhn(digits) {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = +digits[digits.length - 1 - i];
    if (i % 2) d = d * 2 > 9 ? d * 2 - 9 : d * 2;
    sum += d;
  }
  return sum % 10 === 0;
}

function ibanValid(s) {
  const v = s.replace(/\s/g, '').toUpperCase();
  if (v.length < 15 || v.length > 34) return false;
  const moved = (v.slice(4) + v.slice(0, 4)).replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
  let rem = 0;
  for (const ch of moved) rem = (rem * 10 + +ch) % 97;
  return rem === 1;
}

// Card numbers, Luhn-valid: 13 to 19 digits in one run, in groups of four, or Amex 4-6-5.
// Anchored against surrounding digits and dashes so capture names (2026-09-25-081200) never match.
const CARD = /(?<![\d-])(?:\d{13,19}|\d{4}([ -])\d{4}\1\d{4}\1\d{1,7}|\d{4}([ -])\d{6}\2\d{5})(?![\d-])/g;
// IBAN: country code, check digits, then 11 to 30 alphanumerics, optionally in groups of four. Mod-97 checked.
const IBAN = /\b[A-Z]{2}\d{2}(?: ?[A-Z0-9]{1,4}){3,8}\b/g;

function redact(text) {
  const hits = [];
  let out = text;
  for (const [kind, re] of TOKENS) out = out.replace(re, () => (hits.push(kind), R));
  for (const [kind, re] of LABELED) out = out.replace(re, (m, label) => (hits.push(kind), label + R));
  out = out.replace(CARD, (m) => (luhn(m.replace(/\D/g, '')) ? (hits.push('card number'), R) : m));
  out = out.replace(IBAN, (m) => (ibanValid(m) ? (hits.push('iban'), R) : m));
  return { text: out, hits };
}

// Redacts a file in place. Returns the hit kinds (empty when nothing changed).
function redactFile(f) {
  const before = fs.readFileSync(f, 'utf8');
  const { text, hits } = redact(before);
  if (hits.length) fs.writeFileSync(f, text);
  return hits;
}

module.exports = { redact, redactFile };

if (require.main === module) {
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  let found = 0;
  for (const f of args.filter((a) => a !== '--check')) {
    const hits = check ? redact(fs.readFileSync(f, 'utf8')).hits : redactFile(f);
    if (hits.length) {
      found++;
      console.log(`${f}: ${[...new Set(hits)].join(', ')}${check ? '' : ' (redacted)'}`);
    }
  }
  if (check && found) process.exitCode = 1;
}
