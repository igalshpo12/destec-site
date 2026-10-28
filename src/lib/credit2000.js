// Credit2000 (D.C.S International) — the SOAP client for card clearing. VERBATIM COPY of
// des-manager/api/_lib/credit2000.js (the source of truth, unit-tested and live-verified there on
// 2026-10-28). Change it THERE first, then re-copy; do not edit here.
//
// Owner 2026-10-16: the card is typed on Credit2000's OWN hosted form, shown inside our receipt,
// never in our app (PCI: no card number touches our server or database). Flow, per their API
// document "Credit2000 - English.pdf":
//   1. SendParamToCredit2000 (return_Code "123")  -> the URL of a payment page for our amount.
//   2. The payer finishes; the page redirects the browser to our `host` URL with
//      ?params=<uid>&TotalPayment=…  — that redirect is UNTRUSTED (anyone can type a URL).
//   3. The server asks Credit2000 itself: BitIsTransactionResolvedByUID (approval number, last 4)
//      and getTokenAndApproveWithParams (token, return code, acquirer / brand, payments).
//   4. Refund = CreditXML actionType 7 against the token (no card number needed).
//
// Amounts on the wire are AGOROT as an integer string ("10100" = ₪101.00).

export const C2K_DEFAULT_URL = 'https://www.credit2000.co.il/pci_emv_ver4/wcf/wscredit2000.asmx'

export const ACTION = { TEST: '2', CHARGE: '4', APPROVAL_ONLY: '5', REFUND: '7' }
export const PURCHASE = { REGULAR: 1, PAYMENTS: 2, CREDIT: 3 }
export const CURRENCY = { ILS: '1', USD: '2', EUR: '3' }

// ₪ → agorot without float drift (12.34 * 100 = 1233.9999…).
export function toAgorot(amount) {
  const n = Number(amount)
  if (!Number.isFinite(n)) return NaN
  return Math.round(Math.round(n * 1000) / 10)
}

export const fromAgorot = (a) => Math.round(Number(a) || 0) / 100

// Split a total into Credit2000's first_Payment + fixed_Amount (every later payment).
// Regular deal: first = total, fixed = "000000" (their document). Payments: equal fixed
// payments, the remainder agorot go on the first one.
export function splitInstallments(totalAgorot, installments) {
  const total = Math.round(Number(totalAgorot) || 0)
  const n = Math.max(1, Math.min(99, Math.round(Number(installments) || 1)))
  if (n === 1) return { purchaseType: PURCHASE.REGULAR, payments: 1, first: total, fixed: 0 }
  const fixed = Math.floor(total / n)
  return { purchaseType: PURCHASE.PAYMENTS, payments: n, first: total - fixed * (n - 1), fixed }
}

// product_Id: exactly 16 digits, unique per attempt (UNIQUE in card_transactions).
export function newOrderRef(randomBytes) {
  const bytes = randomBytes(8)
  let digits = ''
  for (const b of bytes) digits += String(b % 100).padStart(2, '0')
  return digits.slice(0, 16)
}

export const xmlEscape = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&apos;')

// Credit2000's client_Name is "Last/First"; it only pre-fills the page. Keep it short and plain.
export function payerName(name) {
  const clean = String(name || '').replace(/[<>&"'/\\]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 40)
  return clean ? `${clean}/` : ''
}

export function envelope(op, inner) {
  return '<?xml version="1.0" encoding="utf-8"?>'
    + '<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">'
    + `<soap12:Body><${op} xmlns="http://tempuri.org/">${inner}</${op}></soap12:Body></soap12:Envelope>`
}

const fields = (obj) => Object.entries(obj).map(([k, v]) => `<${k}>${xmlEscape(v)}</${k}>`).join('')

// Field order and the "always" values are exactly the API document's.
// holderId (ת.ז, digits ≤ 9) pre-fills the form's ID field so the payer is not asked twice.
export function sendParamsEnvelope({ vendor, clientKey, host, amountAgorot, installments, clientName, orderRef, holderId = '', action = ACTION.CHARGE, lang = 'he' }) {
  const split = splitInstallments(amountAgorot, installments)
  return envelope('SendParamToCredit2000', '<parametr>' + fields({
    // club: '0', not '' — an empty club is refused live with error 589 ("club can not have non
    // numerical characters"), seen by another integration (milzer-tech/checkout CREDIT2000.md).
    tz_Number: String(holderId || '').replace(/\D/g, '').slice(0, 9), club: '0', confirmation_Source: '0', action_Type: action, card_Reader: '0',
    client_Name: payerName(clientName), host, company_Key: clientKey, stars: '0', reader_Data: '',
    currency: CURRENCY.ILS, total_Pyment: String(split.first + split.fixed * (split.payments - 1)),
    purchase_Type: String(split.purchaseType), uID: '', vendor_Name: vendor, product_Id: orderRef,
    return_Code: '123', fixed_Amount: split.payments === 1 ? '000000' : String(split.fixed),
    payments_Number: String(split.payments), first_Payment: String(split.first), Approve: '0000000',
    ValidDate: '', StyleSheet: '', Lang: lang, card_type: '', sp_type: '', manpik: '', solek: '',
    brand: '', original_uid: '', stream: '',
  }) + '</parametr>')
}

export const resolvedEnvelope = ({ uid, vendor }) =>
  envelope('BitIsTransactionResolvedByUID', fields({ Uid: uid, Vendor: vendor }))

// getTokenAndApprovePro: the live-verified way to read a hosted-page result — the non-Pro
// getTokenAndApprove returned empty fields after a real approval (milzer-tech/checkout).
export const TOKEN_OP = 'getTokenAndApprovePro'
export const tokenEnvelope = ({ uid }) =>
  envelope(TOKEN_OP, fields({ uid }))

// Refund against the token. validDate is MMYY as Credit2000 returned it.
export function refundEnvelope({ vendor, clientKey, token, validDate, amountAgorot, installments, purchaseType }) {
  const split = splitInstallments(amountAgorot, installments)
  const vd = String(validDate || '').replace(/\D/g, '')
  return envelope('CreditXML', fields({
    cvvNumber: '', cardType: '', vendorName: vendor,
    purchaseType: String(purchaseType || split.purchaseType), currency: CURRENCY.ILS,
    cardNumber: token, validationMonth: vd.slice(0, 2), validationYear: vd.slice(2, 4),
    totalPayment: String(Math.round(Number(amountAgorot))), paymentsNumber: String(split.payments),
    firstPayment: String(split.first), fixedAmmount: split.payments === 1 ? '000' : String(split.fixed),
    customerId: '', returnCode: '000', confirmationNumber: '00000', actionType: ACTION.REFUND,
    cardReader: '0', confirmationSource: '2', tzNumber: '', club: '0', stars: '0', readerData: '',
    ClientKey: clientKey,
  }))
}

// ---------------------------------------------------------------- response parsing
const decode = (s) => String(s)
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&')

// First <tag>…</tag> (any namespace prefix), decoded. '' when absent or self-closed.
export function tagText(xml, tag) {
  const m = new RegExp(`<(?:\\w+:)?${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</(?:\\w+:)?${tag}>`).exec(String(xml || ''))
  return m ? decode(m[1]).trim() : ''
}

export function soapFault(xml) {
  const s = String(xml || '')
  if (!/<(?:\w+:)?Fault[\s>]/.test(s)) return null
  return tagText(s, 'Text') || tagText(s, 'faultstring') || 'SOAP fault'
}

// Terminal 5432336 answers with the payment ID only — "<uid>&css=" (live, 2026-10-16), not a
// URL. The page address it belongs to comes from DCS and lives in CREDIT2000_PAGE_URL, a
// template with {result} (the whole answer) or {uid}. A full https URL answer is used as is.
export function parsePageUrl(xml, pageTemplate = '') {
  const result = tagText(xml, 'SendParamToCredit2000Result')
  if (/^https:\/\/[^\s<>"]+$/i.test(result)) return result
  const uid = uidFromUrl(result)
  if (!uid || !result.startsWith(uid) || !/^https:\/\//i.test(pageTemplate || '')) return null
  if (!/^[0-9a-f-]+(&[\w]*=[\w-]*)*$/i.test(result)) return null
  const url = pageTemplate.replace('{result}', result).replace('{uid}', uid)
  return /^https:\/\/[^\s<>"]+$/i.test(url) ? url : null
}

// The uid the page will report back, when the page URL carries one (lets the server poll even
// if the redirect never arrives). Best effort: GUID anywhere in the URL.
export function uidFromUrl(url) {
  const m = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.exec(String(url || ''))
  return m ? m[0] : null
}

export const isUid = (s) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(s || ''))

export function parseResolved(xml) {
  return {
    resolved: tagText(xml, 'BitIsTransactionResolvedByUIDResult').toLowerCase() === 'true',
    approval: tagText(xml, 'ApprovalNumber').replace(/\s/g, ''),
    last4: (tagText(xml, 'SuffixCard').replace(/\D/g, '').slice(-4)) || '',
    resolvedAt: tagText(xml, 'TransactionResolvedAt'),
  }
}

export function parseToken(xml) {
  // the transaction fields sit inside the *Result element (Pro and WithParams alike)
  const r = tagText(xml, 'getTokenAndApproveProResult') || tagText(xml, 'getTokenAndApproveWithParamsResult') || xml
  const int = (v) => { const n = parseInt(String(v).replace(/\D/g, ''), 10); return Number.isFinite(n) ? n : null }
  return {
    token: tagText(xml, 'token'),
    cardType: tagText(xml, 'cardType'),
    returnCode: tagText(r, 'return_Code'),
    approval: tagText(r, 'Approve').replace(/\s/g, ''),
    validDate: tagText(r, 'ValidDate').replace(/\D/g, ''),
    totalAgorot: int(tagText(r, 'total_Pyment')),
    payments: int(tagText(r, 'payments_Number')),
    purchaseType: int(tagText(r, 'purchase_Type')),
    productId: tagText(r, 'product_Id'),
    solek: tagText(r, 'solek'),
    manpik: tagText(r, 'manpik'),
    brand: tagText(r, 'brand') || tagText(xml, 'mutag'),
    last4: (tagText(xml, 'SuffixCard') || tagText(xml, 'last4')).replace(/\D/g, '').slice(-4),
  }
}

// "000" is approved on every Credit2000 response we have seen documented.
export const isApprovedCode = (code) => /^0+$/.test(String(code || '').trim())

export function parseRefund(xml) {
  const result = tagText(xml, 'CreditXMLResult')
  const code = tagText(xml, 'returnCode') || result
  return { ok: isApprovedCode(code), returnCode: code, result }
}

// ---------------------------------------------------------------- unified file (D120)
// Shva acquirer (solek) codes == the unified file's "קוד החברה הסולקת":
// 1 ישראכרט, 2 כאל, 3 דיינרס, 4 אמריקן אקספרס, 6 לאומי קארד / מקס.
const CLEARING_CODES = new Set([1, 2, 3, 4, 6])
export function clearingCompany(solek) {
  const n = parseInt(String(solek || '').trim(), 10)
  return CLEARING_CODES.has(n) ? n : null
}

// Shva brand (מותג) → our CARD_BRANDS value. Issuer (manpik) decides the local brands.
// brand: 1 Mastercard, 2 Visa, 3 Maestro (→ mastercard), 0/5 Isracard private label.
// manpik: 1 Isracard, 3 Diners, 4 Amex.
export function cardBrand({ brand, manpik } = {}) {
  const m = parseInt(String(manpik || '').trim(), 10)
  if (m === 4) return 'amex'
  if (m === 3) return 'diners'
  const b = parseInt(String(brand || '').trim(), 10)
  if (b === 1 || b === 3) return 'mastercard'
  if (b === 2) return 'visa'
  if ((b === 0 || b === 5) && m === 1) return 'isracard'
  return ''
}

// The unified file's "סוג עסקת אשראי": 1 רגיל, 2 תשלומים, 3 קרדיט. Credit2000 purchase_Type
// uses the same 1/2/3.
export function creditDealType(purchaseType, installments) {
  const p = Number(purchaseType)
  if (p === 1 || p === 2 || p === 3) return p
  return Number(installments) > 1 ? 2 : 1
}

// ---------------------------------------------------------------- transport
export async function soapCall(fetchImpl, url, op, body, { timeoutMs = 20000 } = {}) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetchImpl(url, {
      method: 'POST',
      headers: { 'Content-Type': `application/soap+xml; charset=utf-8; action="http://tempuri.org/${op}"` },
      body,
      signal: ctrl.signal,
    })
    const text = await res.text()
    const fault = soapFault(text)
    if (fault) throw Object.assign(new Error(`Credit2000 ${op}: ${fault}`), { code: 'gateway_fault' })
    if (!res.ok) throw Object.assign(new Error(`Credit2000 ${op}: HTTP ${res.status}`), { code: 'gateway_http' })
    return text
  } finally {
    clearTimeout(timer)
  }
}
