/**
 * palavras.js
 * Aqui eu guardo as 114 palavras do vocabulário que as ferramentas do Praticar usam
 * (cartões de memória, dicionário, jogo de caracteres e sessão de hoje),
 * o progresso do aluno nessas palavras e a frase do dia da Introdução.
 *
 * Cada palavra tem três campos:
 *   zh = os caracteres chineses
 *   py = o pinyin (a pronúncia escrita com letras e acentos dos tons)
 *   pt = o significado em português
 */

// ═══ AS PALAVRAS, POR TEMA ═══
const VOCABULARIO = {
  pessoas: [
    { zh: '我', py: 'wǒ', pt: 'eu / me' },
    { zh: '你', py: 'nǐ', pt: 'tu' },
    { zh: '他/她', py: 'tā', pt: 'ele / ela' },
    { zh: '我们', py: 'wǒmen', pt: 'nós' },
    { zh: '你们', py: 'nǐmen', pt: 'vocês' },
    { zh: '他们', py: 'tāmen', pt: 'eles / elas' },
    { zh: '爸爸', py: 'bàba', pt: 'pai' },
    { zh: '妈妈', py: 'māma', pt: 'mãe' },
    { zh: '哥哥', py: 'gēge', pt: 'irmão mais velho' },
    { zh: '姐姐', py: 'jiějie', pt: 'irmã mais velha' },
    { zh: '朋友', py: 'péngyou', pt: 'amigo' },
    { zh: '同事', py: 'tóngshì', pt: 'colega de trabalho' },
    { zh: '老板', py: 'lǎobǎn', pt: 'chefe' },
    { zh: '老师', py: 'lǎoshī', pt: 'professor' },
    { zh: '学生', py: 'xuésheng', pt: 'estudante' },
    { zh: '外国人', py: 'wàiguórén', pt: 'estrangeiro' },
  ],
  verbos: [
    { zh: '是', py: 'shì', pt: 'ser' },
    { zh: '有', py: 'yǒu', pt: 'ter' },
    { zh: '去', py: 'qù', pt: 'ir' },
    { zh: '来', py: 'lái', pt: 'vir' },
    { zh: '说', py: 'shuō', pt: 'falar' },
    { zh: '吃', py: 'chī', pt: 'comer' },
    { zh: '喝', py: 'hē', pt: 'beber' },
    { zh: '买', py: 'mǎi', pt: 'comprar' },
    { zh: '卖', py: 'mài', pt: 'vender' },
    { zh: '看', py: 'kàn', pt: 'ver' },
    { zh: '听', py: 'tīng', pt: 'ouvir' },
    { zh: '学', py: 'xué', pt: 'estudar' },
    { zh: '工作', py: 'gōngzuò', pt: 'trabalhar' },
    { zh: '想', py: 'xiǎng', pt: 'pensar / querer' },
    { zh: '知道', py: 'zhīdào', pt: 'saber' },
    { zh: '喜欢', py: 'xǐhuān', pt: 'gostar' },
    { zh: '爱', py: 'ài', pt: 'amar' },
    { zh: '住', py: 'zhù', pt: 'morar em' },
    { zh: '睡觉', py: 'shuìjiào', pt: 'dormir' },
    { zh: '帮', py: 'bāng', pt: 'ajudar' },
    { zh: '开会', py: 'kāihuì', pt: 'ter uma reunião' },
    { zh: '打电话', py: 'dǎ diànhuà', pt: 'telefonar' },
  ],
  adjetivos: [
    { zh: '好', py: 'hǎo', pt: 'bom' },
    { zh: '坏', py: 'huài', pt: 'mau' },
    { zh: '大', py: 'dà', pt: 'grande' },
    { zh: '小', py: 'xiǎo', pt: 'pequeno' },
    { zh: '多', py: 'duō', pt: 'muitos / muito' },
    { zh: '少', py: 'shǎo', pt: 'poucos' },
    { zh: '快', py: 'kuài', pt: 'rápido' },
    { zh: '慢', py: 'màn', pt: 'lento' },
    { zh: '贵', py: 'guì', pt: 'caro' },
    { zh: '便宜', py: 'piányí', pt: 'barato' },
    { zh: '热', py: 'rè', pt: 'quente' },
    { zh: '冷', py: 'lěng', pt: 'frio' },
    { zh: '漂亮', py: 'piàoliang', pt: 'bonito' },
    { zh: '忙', py: 'máng', pt: 'ocupado' },
    { zh: '累', py: 'lèi', pt: 'cansado' },
    { zh: '高兴', py: 'gāoxìng', pt: 'contente' },
    { zh: '难过', py: 'nánguò', pt: 'triste' },
    { zh: '容易', py: 'róngyì', pt: 'fácil' },
    { zh: '难', py: 'nán', pt: 'difícil' },
    { zh: '重要', py: 'zhòngyào', pt: 'importante' },
    { zh: '有意思', py: 'yǒu yìsi', pt: 'interessante' },
    { zh: '新', py: 'xīn', pt: 'novo' },
    { zh: '旧', py: 'jiù', pt: 'velho (coisas)' },
    { zh: '干净', py: 'gānjìng', pt: 'limpo' },
  ],
  lugares: [
    { zh: '中国', py: 'Zhōngguó', pt: 'China' },
    { zh: '北京', py: 'Běijīng', pt: 'Pequim' },
    { zh: '上海', py: 'Shànghǎi', pt: 'Xangai' },
    { zh: '家', py: 'jiā', pt: 'casa' },
    { zh: '公司', py: 'gōngsī', pt: 'empresa' },
    { zh: '学校', py: 'xuéxiào', pt: 'escola' },
    { zh: '医院', py: 'yīyuàn', pt: 'hospital' },
    { zh: '超市', py: 'chāoshì', pt: 'supermercado' },
    { zh: '餐厅', py: 'cāntīng', pt: 'restaurante' },
    { zh: '地铁', py: 'dìtiě', pt: 'metro' },
    { zh: '飞机场', py: 'fēijīchǎng', pt: 'aeroporto' },
    { zh: '出租车', py: 'chūzū chē', pt: 'táxi' },
    { zh: '左', py: 'zuǒ', pt: 'esquerda' },
    { zh: '右', py: 'yòu', pt: 'direita' },
    { zh: '直走', py: 'zhí zǒu', pt: 'seguir em frente' },
    { zh: '附近', py: 'fùjìn', pt: 'perto' },
  ],
  comida: [
    { zh: '米饭', py: 'mǐfàn', pt: 'arroz' },
    { zh: '面条', py: 'miàntiáo', pt: 'massa (noodles)' },
    { zh: '饺子', py: 'jiǎozi', pt: 'jiaozi (pastéis cozidos)' },
    { zh: '包子', py: 'bāozi', pt: 'pãezinhos recheados' },
    { zh: '水', py: 'shuǐ', pt: 'água' },
    { zh: '茶', py: 'chá', pt: 'chá' },
    { zh: '咖啡', py: 'kāfēi', pt: 'café' },
    { zh: '啤酒', py: 'píjiǔ', pt: 'cerveja' },
    { zh: '肉', py: 'ròu', pt: 'carne' },
    { zh: '鱼', py: 'yú', pt: 'peixe' },
    { zh: '蔬菜', py: 'shūcài', pt: 'legumes' },
    { zh: '水果', py: 'shuǐguǒ', pt: 'fruta' },
    { zh: '辣', py: 'là', pt: 'picante' },
    { zh: '甜', py: 'tián', pt: 'doce' },
    { zh: '好吃', py: 'hǎo chī', pt: 'delicioso' },
    { zh: '菜单', py: 'càidān', pt: 'ementa' },
    { zh: '早饭', py: 'zǎofàn', pt: 'pequeno-almoço' },
    { zh: '午饭', py: 'wǔfàn', pt: 'almoço' },
    { zh: '晚饭', py: 'wǎnfàn', pt: 'jantar' },
  ],
  tempo: [
    { zh: '今天', py: 'jīntiān', pt: 'hoje' },
    { zh: '明天', py: 'míngtiān', pt: 'amanhã' },
    { zh: '昨天', py: 'zuótiān', pt: 'ontem' },
    { zh: '现在', py: 'xiànzài', pt: 'agora' },
    { zh: '以后', py: 'yǐhòu', pt: 'depois' },
    { zh: '以前', py: 'yǐqián', pt: 'antes' },
    { zh: '早上', py: 'zǎoshang', pt: 'manhã' },
    { zh: '下午', py: 'xiàwǔ', pt: 'tarde' },
    { zh: '晚上', py: 'wǎnshang', pt: 'noite' },
    { zh: '星期', py: 'xīngqī', pt: 'semana' },
    { zh: '月', py: 'yuè', pt: 'mês' },
    { zh: '年', py: 'nián', pt: 'ano' },
    { zh: '常常', py: 'chángcháng', pt: 'muitas vezes' },
    { zh: '有时候', py: 'yǒushíhou', pt: 'às vezes' },
    { zh: '已经', py: 'yǐjīng', pt: 'já' },
    { zh: '还', py: 'hái', pt: 'ainda / também' },
    { zh: '刚', py: 'gāng', pt: 'acabou de' },
  ],
};
// Todas as palavras numa só lista (os três pontos "abrem" cada lista dentro da nova)
const TODAS_AS_PALAVRAS = [
  ...VOCABULARIO.pessoas,
  ...VOCABULARIO.verbos,
  ...VOCABULARIO.adjetivos,
  ...VOCABULARIO.lugares,
  ...VOCABULARIO.comida,
  ...VOCABULARIO.tempo,
];

// Os nomes que aparecem no painel de progresso da Introdução
const TEMAS = [
  { nome: 'Pessoas', palavras: VOCABULARIO.pessoas },
  { nome: 'Verbos', palavras: VOCABULARIO.verbos },
  { nome: 'Adjetivos', palavras: VOCABULARIO.adjetivos },
  { nome: 'Lugares', palavras: VOCABULARIO.lugares },
  { nome: 'Comida', palavras: VOCABULARIO.comida },
  { nome: 'Tempo', palavras: VOCABULARIO.tempo },
];

// ═══ PALAVRAS APRENDIDAS ═══
// Um objeto em que cada chave é uma palavra em chinês: { '我': true, '你': true }
// Uma palavra fica aprendida quando o aluno a avalia como Razoável ou Fácil nos cartões.
let palavrasAprendidas = lerGuardado('learned', {});

function contarAprendidas(lista) {
  return lista.filter(function (palavra) {
    return palavrasAprendidas[palavra.zh];
  }).length;
}

// Atualizo os números do progresso que existirem na página:
// o painel por temas (Introdução) e os números dos cartões (Praticar).
function atualizarProgresso() {
  const grelha = document.getElementById('po-grid');
  if (grelha) {
    let html = '';
    TEMAS.forEach(function (tema) {
      const feitas = contarAprendidas(tema.palavras);
      const total = tema.palavras.length;
      const percentagem = Math.round((feitas / total) * 100);
      html += `
        <div class="po-item">
          <div class="poi-topo">
            <span class="poi-label">${tema.nome}</span>
            <span class="poi-num">${feitas} de ${total}</span>
          </div>
          <div class="poi-bar-wrap"><div class="poi-bar" style="width: ${percentagem}%"></div></div>
          <div class="poi-pct">${percentagem}%</div>
        </div>`;
    });
    grelha.innerHTML = html;
  }

  const aprendidas = contarAprendidas(TODAS_AS_PALAVRAS);
  escreverNumero('fc-learned', aprendidas);
  escreverNumero('fc-total', TODAS_AS_PALAVRAS.length);
  escreverNumero('fc-due', TODAS_AS_PALAVRAS.length - aprendidas);
}

// Escrevo um número num elemento, se ele existir nesta página
function escreverNumero(id, numero) {
  const elemento = document.getElementById(id);
  if (elemento) {
    elemento.textContent = numero;
  }
}

aoAbrirPagina(atualizarProgresso);

// ═══ FRASE DO DIA (Introdução) ═══
const FRASES_DO_DIA = [
  { zh: '加油', py: 'jiā yóu', pt: 'Força! Tu consegues!', exemplo: '考试加油！ Boa sorte no exame!' },
  { zh: '没问题', py: 'méi wèntí', pt: 'Não há problema!', exemplo: '这件事没问题。 Isto não é problema.' },
  { zh: '慢慢来', py: 'màn màn lái', pt: 'Com calma, sem pressa', exemplo: '慢慢来，不要着急。 Com calma, não te apresses.' },
  { zh: '好好学习', py: 'hǎo hǎo xuéxí', pt: 'Estuda com afinco!', exemplo: '好好学习，天天向上。 Estuda com afinco e melhora todos os dias.' },
  { zh: '坚持就是胜利', py: 'jiānchí jiù shì shènglì', pt: 'Persistir é vencer', exemplo: '坚持学习！ Continua a estudar!' },
  { zh: '请多指教', py: 'qǐng duō zhǐjiào', pt: 'Conto com a tua ajuda! (educado e humilde)', exemplo: '初次见面，请多指教！' },
  { zh: '天天进步', py: 'tiān tiān jìnbù', pt: 'Melhorar todos os dias', exemplo: '每天学一点，天天进步！' },
  { zh: '一步一步来', py: 'yī bù yī bù lái', pt: 'Passo a passo', exemplo: '学语言要一步一步来。' },
  { zh: '入乡随俗', py: 'rù xiāng suí sú', pt: 'Em Roma, sê romano', exemplo: '到了中国，入乡随俗！' },
  { zh: '活到老学到老', py: 'huó dào lǎo xué dào lǎo', pt: 'Nunca é tarde para aprender', exemplo: '学中文永远不晚！' },
];

// Escolho a frase pelo dia do mês: assim todos os alunos veem a mesma frase no mesmo dia
// e ela muda à meia-noite. O % (resto da divisão) faz o número voltar a 0 depois da última frase.
function mostrarFraseDoDia() {
  const caixa = document.getElementById('potd-zh');
  if (!caixa) {
    return;
  }
  const hoje = new Date().getDate();   // 1 a 31
  const frase = FRASES_DO_DIA[hoje % FRASES_DO_DIA.length];
  document.getElementById('potd-zh').textContent = frase.zh;
  document.getElementById('potd-py').textContent = frase.py;
  document.getElementById('potd-en').textContent = frase.pt;
  document.getElementById('potd-ex').textContent = frase.exemplo;
}

aoAbrirPagina(mostrarFraseDoDia);
