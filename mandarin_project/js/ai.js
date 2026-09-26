/**
 * ai.js
 * Ponto ÚNICO de contato com a IA (tutor, dicionário, conversação, feedback de pronúncia).
 *
 * Por que um arquivo só? Hoje o site chama a API diretamente do browser, o que só funciona
 * dentro do Claude.ai. Quando fizermos o servidor (backend), muda-se APENAS a função askClaude
 * para chamar /api/... e todas as ferramentas passam a funcionar.
 * 学中文 — Curso Completo de Mandarim
 */

const AI_MODEL = 'claude-sonnet-4-6';
const AI_UNAVAILABLE_MSG =
  'A IA ainda não está disponível neste site: falta configurar o servidor (backend). ' +
  'As outras ferramentas funcionam normalmente.';

/**
 * Envia uma conversa à IA e devolve o texto da resposta.
 * Lança um Error com uma mensagem em português se algo falhar.
 */
async function askClaude({ system, messages, maxTokens = 600 }) {
  let resp;
  try {
    resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: AI_MODEL, max_tokens: maxTokens, ...(system ? { system } : {}), messages })
    });
  } catch (err) {
    throw new Error(AI_UNAVAILABLE_MSG);          // sem rede, CORS bloqueado, etc.
  }
  let data = null;
  try { data = await resp.json(); } catch (err) { /* resposta sem JSON */ }
  if (!resp.ok || !data || !Array.isArray(data.content)) throw new Error(AI_UNAVAILABLE_MSG);
  return data.content.map(c => c.text || '').join('');
}

/**
 * Prepara texto da IA (ou do aluno) para mostrar em HTML com segurança:
 * 1.º escapa tudo (assim nenhum <script> ou <img onerror> corre),
 * 2.º só depois aplica a formatação simples que nós controlamos.
 */
function formatAIText(text) {
  return esc(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/([一-鿿]+)/g, '<span class="ai-han">$1</span>')
    .replace(/\n/g, '<br>');
}
