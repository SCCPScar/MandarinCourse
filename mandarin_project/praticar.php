<?php
// praticar.php
// Aqui eu escrevo o conteúdo da página «Praticar».
// O início (head e navegação) vem de includes/topo.php e o fim (rodapé e scripts) de includes/fim.php.

require 'includes/sessao.php';

$titulo = 'Praticar';
$pagina = 'praticar';
$usa_hanzi = true;
require 'includes/topo.php';
?>
<?= cabeca_pagina('Praticar', '练习', 'liànxí', 'Diálogos, testes e ferramentas para treinares o que aprendeste: cartões, jogos, dicionário, traços e pronúncia.', 'selo') ?>
<div class="container">

<!-- ============================================================ -->
<!-- MÓDULO 10: DIÁLOGOS -->
<!-- ============================================================ -->
<div class="section-header">
  <div class="section-num">1</div>
  <h2>Diálogos reais para praticar <span class="zh">对话练习</span> <span class="section-header__py">duìhuà liànxí</span></h2>
</div>

<h3 style="margin: 1rem 0 0.75rem; font-size: 1.0625rem; color: var(--ink);">Situação 1: primeiro dia no escritório</h3>
<div class="dialogue">
  <div class="dialogue-line">
    <div class="speaker">同</div>
    <div class="bubble">
      <div class="zh">你好！你是新来的同事吗？</div>
      <div class="py">Nǐ hǎo! Nǐ shì xīn lái de tóngshì ma?</div>
      <div class="en">Olá! És o novo colega?</div>
    </div>
  </div>
  <div class="dialogue-line b">
    <div class="speaker">你</div>
    <div class="bubble">
      <div class="zh">是的！我叫李明，来自葡萄牙，很高兴认识你！</div>
      <div class="py">Shìde! Wǒ jiào Lǐ Míng, láizì Pútáoyá, hěn gāoxìng rènshi nǐ!</div>
      <div class="en">Sim! Chamo-me Li Ming, sou de Portugal. Muito prazer!</div>
    </div>
  </div>
  <div class="dialogue-line">
    <div class="speaker">同</div>
    <div class="bubble">
      <div class="zh">我叫王芳。你会说中文，真厉害！</div>
      <div class="py">Wǒ jiào Wáng Fāng. Nǐ huì shuō Zhōngwén, zhēn lìhai!</div>
      <div class="en">Eu sou a Wang Fang. Falas chinês, que bom!</div>
    </div>
  </div>
  <div class="dialogue-line b">
    <div class="speaker">你</div>
    <div class="bubble">
      <div class="zh">还在学习中，说得不好，请多指教！</div>
      <div class="py">Hái zài xuéxí zhōng, shuō de bù hǎo, qǐng duō zhǐjiào!</div>
      <div class="en">Ainda estou a aprender e não falo bem, conto com a tua ajuda! (humilde e educado)</div>
    </div>
  </div>
</div>

<h3 style="margin: 1.5rem 0 0.75rem; font-size: 1.0625rem; color: var(--ink);">Situação 2: apanhar um táxi</h3>
<div class="dialogue">
  <div class="dialogue-line">
    <div class="speaker">司</div>
    <div class="bubble">
      <div class="zh">去哪儿？</div>
      <div class="py">Qù nǎr?</div>
      <div class="en">Para onde?</div>
    </div>
  </div>
  <div class="dialogue-line b">
    <div class="speaker">你</div>
    <div class="bubble">
      <div class="zh">去北京路，麻烦您快一点。</div>
      <div class="py">Qù Běijīng Lù, máfan nín kuài yīdiǎn.</div>
      <div class="en">Para a Rua de Pequim, se puder ir um pouco mais depressa.</div>
    </div>
  </div>
  <div class="dialogue-line">
    <div class="speaker">司</div>
    <div class="bubble">
      <div class="zh">好的，大概二十分钟。</div>
      <div class="py">Hǎo de, dàgài èrshí fēnzhōng.</div>
      <div class="en">Está bem, são uns 20 minutos.</div>
    </div>
  </div>
  <div class="dialogue-line b">
    <div class="speaker">你</div>
    <div class="bubble">
      <div class="zh">到了，多少钱？</div>
      <div class="py">Dào le, duōshao qián?</div>
      <div class="en">Chegámos. Quanto é?</div>
    </div>
  </div>
  <div class="dialogue-line">
    <div class="speaker">司</div>
    <div class="bubble">
      <div class="zh">三十五块。</div>
      <div class="py">Sānshíwǔ kuài.</div>
      <div class="en">35 yuans.</div>
    </div>
  </div>
</div>

<!-- ============================================================ -->
<!-- MÓDULO 11: QUIZ -->
<!-- ============================================================ -->
<div class="section-header anchor" id="quiz">
  <div class="section-num">2</div>
  <h2>Testa-te <span class="zh">测验</span> <span class="section-header__py">cèyàn</span></h2>
</div>
<p class="section-intro">Põe à prova o que sabes. As perguntas mudam sempre. Tenta chegar aos 80% antes de passar ao nível seguinte.</p>

<div class="quiz-box" id="quiz-container">
  <h3>Teste rápido</h3>
  <div id="quiz-area"></div>
  <div style="text-align:center;margin-top:1rem">
    <button type="button" id="quiz-comecar" class="botao-cha" onclick="comecarQuiz()"><i class="i i-jogar" aria-hidden="true"></i> Começar o quiz</button>
  </div>
</div>

<!-- ============================================================ -->
<!-- FERRAMENTAS -->
<!-- ============================================================ -->
<div class="section-header anchor" id="features">
  <div class="section-num">3</div>
  <h2>Ferramentas para praticar <span class="zh">互动工具</span> <span class="section-header__py">hùdòng gōngjù</span></h2>
</div>
<p class="section-intro">11 ferramentas para praticar: cartões de memória, jogos, dicionário, temporizador, cultura, pronúncia e mais.</p>

<div id="api-tabs" style="display:flex;gap:3px;border-bottom:2px solid var(--paper-dark);flex-wrap:wrap;margin-bottom:0">
  <button class="api-tab-btn active" onclick="abrirFerramenta(event,'tab-flash')">Cartões</button>
  <button class="api-tab-btn" onclick="abrirFerramenta(event,'tab-sb')">Construir frases</button>
  <button class="api-tab-btn" onclick="abrirFerramenta(event,'tab-chargame')">Jogo de caracteres</button>
  <button class="api-tab-btn" onclick="abrirFerramenta(event,'tab-speak')">Ouvir</button>
  <button class="api-tab-btn" onclick="abrirFerramenta(event,'tab-dict')">Dicionário</button>
  <button class="api-tab-btn" onclick="abrirFerramenta(event,'tab-hanzi')">Traços</button>
  <button class="api-tab-btn" onclick="abrirFerramenta(event,'tab-notebook')">Caderno</button>
  <button class="api-tab-btn" onclick="abrirFerramenta(event,'tab-timer')">Temporizador</button>
  <button class="api-tab-btn" onclick="abrirFerramenta(event,'tab-keyboard')">Teclado</button>
  <button class="api-tab-btn" onclick="abrirFerramenta(event,'tab-mic')">Pronúncia</button>
</div>

<!-- CARTÕES DE MEMÓRIA -->
<div id="tab-flash" class="api-tab-content active" style="padding-top:1.2rem">
  <div class="info" style="margin-bottom:.8rem"><strong>Cartões com revisão espaçada</strong>. Toca para virar e avalia-te. Os cartões difíceis voltam mais cedo. O progresso fica guardado sozinho.</div>
  <div id="fc-box">
    <div class="fc-stats-row">
      <div class="fc-stat"><div class="fsn" id="fc-total">0</div><div class="fsl">Total</div></div>
      <div class="fc-stat"><div class="fsn" id="fc-learned" style="color:#0E7C66">0</div><div class="fsl">Aprendidas</div></div>
      <div class="fc-stat"><div class="fsn" id="fc-due" style="color:var(--red)">0</div><div class="fsl">Por aprender</div></div>
    </div>
    <div class="fc-card-wrap" onclick="virarCartao()">
      <div class="fc-card" id="fc-card">
        <div class="fc-front"><div class="fc-zh-big" id="fc-zh-front">—</div><div class="fc-hint-txt">Toca para ver</div></div>
        <div class="fc-back">
          <div class="fc-zh-sm" id="fc-zh-back"></div>
          <div class="fc-py" id="fc-py-back"></div>
          <div class="fc-en-txt" id="fc-en-back"></div>
          <div style="display:flex;gap:6px;margin-top:4px">
            <button class="speak-btn" id="fc-speak"><i class="i i-ouvir" aria-hidden="true"></i> Ouvir</button>
            <button class="speak-btn" id="fc-speak-devagar"><i class="i i-devagar" aria-hidden="true"></i> Devagar</button>
          </div>
        </div>
      </div>
    </div>
    <div style="text-align:center;font-size:0.8125rem;color:var(--ink-light);margin:6px 0" id="fc-prog">Toca no cartão para começar</div>
    <div class="fc-controls" id="fc-controls" style="display:none">
      <button class="fc-btn hard" onclick="avaliarCartao('hard')">Difícil</button>
      <button class="fc-btn ok" onclick="avaliarCartao('ok')">Razoável</button>
      <button class="fc-btn easy" onclick="avaliarCartao('easy')">Fácil</button>
    </div>
    <p class="fc-shortcuts">Atalhos: <span class="kbd">Espaço</span> virar o cartão · <span class="kbd">1</span> Difícil · <span class="kbd">2</span> Razoável · <span class="kbd">3</span> Fácil</p>
  </div>
</div>

<!-- CONSTRUTOR DE FRASES -->
<div id="tab-sb" class="api-tab-content" style="padding-top:1.2rem">
  <div class="info" style="margin-bottom:.8rem"><strong>Construir frases</strong>. Escolhe uma estrutura e toca nas palavras para as pôr no sítio certo. O site verifica a tua resposta!</div>
  <div id="sb-box">
    <select class="sb-select" id="sb-pattern" onchange="novaFrase()">
      <option value="">Escolhe uma estrutura…</option>
      <option value="svo">Sujeito + verbo + objeto</option>
      <option value="shi">Sujeito + 是 + nome</option>
      <option value="neg">Negação com 不/没</option>
      <option value="modal">Frase com verbo modal</option>
      <option value="time">Tempo + sujeito + verbo</option>
    </select>
    <div class="sb-slot-row" id="sb-slots"></div>
    <div class="sb-pool" id="sb-pool"></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button onclick="verificarFrase()" style="background:var(--red);color:#fff;border:none;padding:8px 18px;border-radius:10px;font-size:0.8125rem;font-weight:600;cursor:pointer;font-family:var(--font-main)">Verificar ✓</button>
      <button onclick="limparFrase()" style="background:var(--paper-dark);color:var(--ink);border:none;padding:8px 18px;border-radius:10px;font-size:0.8125rem;font-weight:600;cursor:pointer;font-family:var(--font-main)">Recomeçar <i class="i i-repetir" aria-hidden="true"></i></button>
      <button onclick="novaFrase()" style="background:var(--blue);color:#fff;border:none;padding:8px 18px;border-radius:10px;font-size:0.8125rem;font-weight:600;cursor:pointer;font-family:var(--font-main)">Seguinte</button>
    </div>
    <div class="sb-result" id="sb-result"></div>
  </div>
</div>

<!-- JOGO DE CARACTERES -->
<div id="tab-chargame" class="api-tab-content" style="padding-top:1.2rem">
  <div class="info" style="margin-bottom:.8rem"><strong>Jogo de reconhecer caracteres</strong>. Vês um caractere e adivinhas o pinyin, contra o relógio. Há dois modos.</div>
  <div id="cg-box">
    <div style="display:flex;gap:10px;margin-bottom:1rem;flex-wrap:wrap;align-items:center">
      <button onclick="comecarJogo('choice')" style="background:var(--red);color:#fff;border:none;padding:8px 16px;border-radius:10px;font-size:0.8125rem;font-weight:600;cursor:pointer;font-family:var(--font-main)"><i class="i i-jogar" aria-hidden="true"></i> Escolha múltipla</button>
      <button onclick="comecarJogo('type')" style="background:var(--blue);color:#fff;border:none;padding:8px 16px;border-radius:10px;font-size:0.8125rem;font-weight:600;cursor:pointer;font-family:var(--font-main)">Escrever o pinyin</button>
      <button id="cg-parar" onclick="pararJogo()" style="display:none;background:var(--paper-dark);color:var(--ink);border:none;padding:8px 16px;border-radius:10px;font-size:0.8125rem;font-weight:600;cursor:pointer;font-family:var(--font-main)"><i class="i i-parar" aria-hidden="true"></i> Parar o jogo</button>
      <span id="cg-score-label" style="font-size:0.8125rem;font-weight:600;color:var(--ink-light)">Pontos: 0 | Recorde: 0</span>
    </div>
    <div id="cg-area"><div style="text-align:center;padding:2rem;color:var(--ink-light);font-size:0.875rem">Escolhe um modo para começar! </div></div>
  </div>
</div>

<!-- OUVIR -->
<div id="tab-speak" class="api-tab-content" style="padding-top:1.2rem">
  <div class="info" style="margin-bottom:.8rem"><i class="i i-ouvir" aria-hidden="true"></i> <strong>Ouvir em chinês</strong>. Escreve qualquer frase em chinês e ouve-a em mandarim. Usa a voz do teu browser.</div>
  <div style="background:var(--white);border-radius:var(--radius);border:1.5px solid var(--paper-dark);padding:1.3rem">
    <div style="display:flex;gap:8px;margin-bottom:.8rem;flex-wrap:wrap">
      <input id="speak-input" type="text" value="你好，我叫李明，很高兴认识你！" style="flex:1;min-width:160px;padding:9px 12px;border-radius:10px;border:1.5px solid var(--paper-dark);font-size:1.125rem;font-family:var(--font-chinese);background:var(--paper-mid);outline:none;color:var(--ink)">
      <button onclick="falar(document.getElementById('speak-input').value)" style="padding:9px 16px;background:var(--red);color:#fff;border:none;border-radius:10px;font-size:0.8125rem;font-weight:600;cursor:pointer;font-family:var(--font-main)"><i class="i i-ouvir" aria-hidden="true"></i> Ouvir</button>
    </div>
    <div style="margin-bottom:.8rem">
      <label style="font-size:0.75rem;color:var(--ink-light);margin-right:8px">Velocidade:</label>
      <input type="range" id="speak-rate" min="0.5" max="1.5" step="0.1" value="0.8" style="vertical-align:middle;width:100px">
      <span id="speak-rate-label" style="font-size:0.75rem;color:var(--ink-light);margin-left:6px">0.8×</span>
    </div>
    <div style="display:flex;gap:7px;flex-wrap:wrap">
      <button class="preset-char" style="font-size:0.75rem;padding:5px 10px" onclick="falar('你好！早上好！')">你好！早上好！</button>
      <button class="preset-char" style="font-size:0.75rem;padding:5px 10px" onclick="falar('这个多少钱？')">这个多少钱？</button>
      <button class="preset-char" style="font-size:0.75rem;padding:5px 10px" onclick="falar('我是葡萄牙人，我在学中文。')">我是葡萄牙人</button>
      <button class="preset-char" style="font-size:0.75rem;padding:5px 10px" onclick="falar('请再说一遍，慢一点。')">请再说一遍</button>
      <button class="preset-char" style="font-size:0.75rem;padding:5px 10px" onclick="falar('对不起，我不明白。')">对不起，我不明白</button>
    </div>
    <div id="speak-status" style="font-size:0.75rem;color:var(--green);min-height:18px;margin-top:6px"></div>
  </div>
</div>

<!-- DICIONÁRIO -->
<div id="tab-dict" class="api-tab-content" style="padding-top:1.2rem">
  <div class="info" style="margin-bottom:.8rem"><strong>Dicionário</strong>. Procura uma palavra do vocabulário do curso em chinês, em pinyin ou em português. Carrega em «+ Guardar» para a pôr no caderno.</div>
  <div id="dict-section">
    <div id="dict-input-row">
      <input id="dict-input" type="text" placeholder="Escreve em chinês ou em português… ex.: 朋友 ou amigo" onkeydown="if(event.key==='Enter')procurarPalavra()">
      <button id="dict-btn" onclick="procurarPalavra()">Procurar <i class="i i-procurar" aria-hidden="true"></i></button>
    </div>
    <div id="dict-result"><p style="color:var(--ink-light);font-size:0.8125rem">Experimenta: 朋友 (péngyou) · gōngzuò · casa · 学习 (xuéxí) · caro</p></div>
  </div>
</div>

<!-- ORDEM DOS TRAÇOS -->
<div id="tab-hanzi" class="api-tab-content" style="padding-top:1.2rem">
  <div class="info" style="margin-bottom:.8rem"><i class="i i-escrever" aria-hidden="true"></i> <strong>HanziWriter</strong>. Vê a animação da ordem dos traços de qualquer caractere ou treina a desenhá-lo.</div>
  <div id="hanzi-section">
    <div id="hanzi-input-row">
      <input id="hanzi-input" type="text" maxlength="1" placeholder="字" value="中">
      <button class="hanzi-action-btn" id="hanzi-animate-btn" onclick="animarTracos()"><i class="i i-jogar" aria-hidden="true"></i> Animar</button>
      <button class="hanzi-action-btn" id="hanzi-quiz-btn" onclick="praticarTracos()"><i class="i i-escrever" aria-hidden="true"></i> Praticar</button>
      <button class="speak-btn" style="padding:7px 12px;font-size:0.75rem" onclick="falar(document.getElementById('hanzi-input').value)"><i class="i i-ouvir" aria-hidden="true"></i> Ouvir</button>
    </div>
    <div id="hanzi-canvas-wrap">
      <div><svg id="hanzi-target" width="200" height="200"></svg><div style="text-align:center;font-size:0.6875rem;color:var(--ink-light);margin-top:3px" id="hanzi-hint"></div></div>
      <div id="hanzi-info">
        <h4>Escolhe um caractere para treinar</h4>
        <div id="hanzi-presets"><!-- o js/hanzi.js mostra aqui os conjuntos de caracteres --></div>
        <!-- Folha de treino com os caracteres que o aluno quiser -->
        <div class="folha-propria">
          <label for="hanzi-folha">Folha de treino com outros caracteres:</label>
          <div class="folha-propria__linha">
            <input id="hanzi-folha" type="text" maxlength="30" placeholder="ex.: 你好谢谢" lang="zh-CN">
            <button type="button" class="botao-cha" onclick="imprimirFolhaTracos()"><i class="i i-imprimir" aria-hidden="true"></i> Criar folha</button>
          </div>
        </div>
        <div class="tip" style="margin-top:8px">Escolhe um caractere, carrega em Animar para ver a ordem dos traços e depois em Praticar para o desenhar com o rato ou com o dedo. Para treinar no papel, imprime uma folha.</div>
      </div>
    </div>
  </div>
</div>

<!-- CADERNO DE VOCABULÁRIO -->
<div id="tab-notebook" class="api-tab-content" style="padding-top:1.2rem">
  <div class="info" style="margin-bottom:.8rem"><i class="i i-caderno" aria-hidden="true"></i> <strong>O meu caderno de vocabulário</strong>. As palavras que guardas no Dicionário aparecem aqui e ficam guardadas no teu browser.</div>
  <div id="nb-box">
    <div style="display:flex;gap:7px;margin-bottom:.9rem;flex-wrap:wrap">
      <button onclick="apagarCaderno()" style="background:#FBE3DE;color:#A32A18;border:1.5px solid #FBE3DE;border-radius:8px;padding:5px 12px;cursor:pointer;font-size:0.75rem;font-family:var(--font-main)">Apagar tudo</button>
      <button onclick="exportarCaderno()" style="background:var(--paper-dark);color:var(--ink);border:none;border-radius:8px;padding:5px 12px;cursor:pointer;font-size:0.75rem;font-family:var(--font-main)">Exportar como texto</button>
    </div>
    <div id="nb-list"></div>
  </div>
  <div class="partilhar">
    <button type="button" class="partilhar__botao" onclick="partilharProgresso()">Partilhar progresso</button>
    <div id="share-card"></div>
  </div>
</div>

<!-- TEMPORIZADOR DE ESTUDO -->
<div id="tab-timer" class="api-tab-content" style="padding-top:1.2rem">
  <div class="info" style="margin-bottom:.8rem"><i class="i i-relogio" aria-hidden="true"></i> <strong>Temporizador de estudo e dias seguidos</strong>. Regista as tuas sessões e os dias seguidos. Estudar sempre é o segredo!</div>
  <div id="timer-wrap">
    <div id="timer-display">00:00</div>
    <div class="timer-btns">
      <button class="timer-btn" id="t-start" onclick="comecarTemporizador()" style="background:#0E7C66;color:#fff"><i class="i i-jogar" aria-hidden="true"></i> Começar</button>
      <button class="timer-btn" id="t-stop" onclick="pararTemporizador()" style="background:var(--red);color:#fff;display:none"><i class="i i-pausa" aria-hidden="true"></i> Pausa</button>
      <button class="timer-btn" id="t-reset" onclick="recomecarTemporizador()" style="background:var(--paper-dark);color:var(--ink)"><i class="i i-repetir" aria-hidden="true"></i> Recomeçar</button>
    </div>
    <div class="streak-row">
      <div class="s-item"><div class="sn" id="streak-num">0</div><div class="sl"><i class="i i-dias" aria-hidden="true"></i> Dias seguidos</div></div>
      <div class="s-item"><div class="sn" id="total-days">0</div><div class="sl"><i class="i i-hoje" aria-hidden="true"></i> Total de dias</div></div>
      <div class="s-item"><div class="sn" id="total-mins">0</div><div class="sl"><i class="i i-relogio" aria-hidden="true"></i> Total de minutos</div></div>
    </div>
    <div style="margin-top:1rem">
      <p style="font-size:0.75rem;font-weight:700;color:var(--ink-light);margin-bottom:7px">ESTA SEMANA:</p>
      <div id="week-grid" style="display:flex;gap:6px;flex-wrap:wrap"></div>
    </div>
  </div>
</div>

<!-- CONFIGURAR O TECLADO -->
<div id="tab-keyboard" class="api-tab-content" style="padding-top:1.2rem">
  <div class="info" style="margin-bottom:.8rem"><strong>Configurar o teclado chinês</strong>. Como escrever em chinês em todos os teus aparelhos. Essencial para o WeChat, os e-mails e o dia a dia na China.</div>
  <div class="kb-grid">
    <div class="kb-card"><h3>Windows</h3>
      <div class="kb-step"><strong>1.</strong> Definições → Hora e idioma → Idioma</div>
      <div class="kb-step"><strong>2.</strong> Adicionar idioma → «Chinês (simplificado)»</div>
      <div class="kb-step"><strong>3.</strong> Instala o teclado Microsoft Pinyin</div>
      <div class="kb-step"><strong>4.</strong> Trocar: <kbd>Win</kbd> + <kbd>Space</kbd></div>
      <div class="kb-step"><strong>5.</strong> Escreve o pinyin e escolhe o caractere na lista</div>
    </div>
    <div class="kb-card"><h3>macOS</h3>
      <div class="kb-step"><strong>1.</strong> Definições do Sistema → Teclado → Fontes de entrada</div>
      <div class="kb-step"><strong>2.</strong> Carrega em + → Chinês simplificado → Pinyin</div>
      <div class="kb-step"><strong>3.</strong> Trocar: <kbd>Ctrl</kbd> + <kbd>Space</kbd></div>
      <div class="kb-step"><strong>4.</strong> Escreve o pinyin e escolhe na lista</div>
    </div>
    <div class="kb-card"><h3>iPhone</h3>
      <div class="kb-step"><strong>1.</strong> Definições → Geral → Teclado → Teclados</div>
      <div class="kb-step"><strong>2.</strong> Adicionar teclado → Chinês simplificado</div>
      <div class="kb-step"><strong>3.</strong> Escolhe: Pinyin</div>
      <div class="kb-step"><strong>4.</strong> Trocar: mantém premido o botão </div>
    </div>
    <div class="kb-card"><h3>Android</h3>
      <div class="kb-step"><strong>1.</strong> Definições → Idioma e introdução</div>
      <div class="kb-step"><strong>2.</strong> Gboard → Idiomas → Adicionar → Chinês simplificado</div>
      <div class="kb-step"><strong>3.</strong> Trocar: toca no botão de idioma do teclado</div>
      <div class="kb-step"><strong>4.</strong> Ou instala o <strong>Sogou Pinyin</strong> (o mais usado na China)</div>
    </div>
    <div class="kb-card"><h3>Como funciona o teclado de pinyin</h3>
      <div class="kb-step">Escreve <strong>n-i-h-a-o</strong> e aparece 你好 (nǐ hǎo)</div>
      <div class="kb-step">Carrega em <strong>Space</strong> para escolher o primeiro da lista</div>
      <div class="kb-step">Carrega em <strong>2-9</strong> para os outros</div>
      <div class="kb-step">O teclado aprende com o teu uso e vai melhorando</div>
    </div>
    <div class="kb-card"><h3>Aplicações essenciais na China</h3>
      <div class="kb-step"><strong>WeChat (微信, Wēixìn)</strong>: instala ANTES de ir!</div>
      <div class="kb-step"><strong>Alipay (支付宝, Zhīfùbǎo)</strong>: pagamentos em todo o lado</div>
      <div class="kb-step"><strong>Didi (滴滴, Dīdī)</strong>: táxis e transporte</div>
      <div class="kb-step"><strong>VPN</strong>: configura antes de chegar</div>
    </div>
  </div>
</div>

<!-- SEPARADOR DE PRONÚNCIA E TONS -->
<div id="tab-mic" class="api-tab-content" style="padding-top:1.2rem">
  <div class="info" style="margin-bottom:.8rem"><i class="i i-gravar" aria-hidden="true"></i> <strong>Treino de pronúncia e tons</strong>. Usa o teu microfone para analisar os tons e a pronúncia em tempo real. Funciona melhor no Chrome ou no Edge.</div>

  <div class="mic-tabs">
    <button class="mic-tab active" onclick="abrirTreinoPronuncia(event,'mictab-tone')">Ver os tons</button>
    <button class="mic-tab" onclick="abrirTreinoPronuncia(event,'mictab-repeat')">Repetir</button>
    <button class="mic-tab" onclick="abrirTreinoPronuncia(event,'mictab-recog')">Reconhecimento de voz</button>
    <button class="mic-tab" onclick="abrirTreinoPronuncia(event,'mictab-score')">Os meus resultados</button>
  </div>

  <!-- VISUALIZADOR DE TONS -->
  <div id="mictab-tone" class="mic-tab-content active">
    <p style="font-size:0.8125rem;color:var(--ink-light);margin-bottom:10px">Escolhe um tom, carrega em Gravar e fala. O gráfico mostra a altura da tua voz em tempo real: tenta imitar a forma do tom!</p>

    <div class="tone-practice-grid" id="tone-target-grid">
      <div class="tone-target-card selected" onclick="escolherTom(this,1)" data-tone="1">
        <div class="ttc-zh">妈</div><div class="ttc-py">mā</div>
        <div class="ttc-tone" style="color:#2F6FD0">1.º tom: alto e plano ―</div>
      </div>
      <div class="tone-target-card" onclick="escolherTom(this,2)" data-tone="2">
        <div class="ttc-zh">麻</div><div class="ttc-py">má</div>
        <div class="ttc-tone" style="color:#0E7C66">2.º tom: a subir ↗</div>
      </div>
      <div class="tone-target-card" onclick="escolherTom(this,3)" data-tone="3">
        <div class="ttc-zh">马</div><div class="ttc-py">mǎ</div>
        <div class="ttc-tone" style="color:#9A6A08">3.º tom: desce e sobe ↘↗</div>
      </div>
      <div class="tone-target-card" onclick="escolherTom(this,4)" data-tone="4">
        <div class="ttc-zh">骂</div><div class="ttc-py">mà</div>
        <div class="ttc-tone" style="color:#A32A18">4.º tom: a descer ↘</div>
      </div>
    </div>

    <div id="tone-canvas-wrap" style="position:relative">
      <canvas id="tone-canvas" height="140"></canvas>
      <!-- as linhas-guia dos tons são desenhadas pelo JavaScript -->
    </div>

    <canvas id="wave-canvas" height="80"></canvas>

    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px">
      <button class="mic-btn idle" id="tone-mic-btn" onclick="gravarTom()"><i class="i i-gravar" aria-hidden="true"></i> Começar a gravar</button>
      <button onclick="ouvirTomAlvo()" style="background:var(--gold);color:#fff;border:none;padding:10px 18px;border-radius:20px;font-size:0.8125rem;font-weight:700;cursor:pointer;font-family:var(--font-main)"><i class="i i-ouvir" aria-hidden="true"></i> Ouvir o modelo</button>
      <button onclick="limparGraficoTom()" style="background:var(--paper-dark);color:var(--ink);border:none;padding:10px 18px;border-radius:20px;font-size:0.8125rem;font-weight:600;cursor:pointer;font-family:var(--font-main)">✕ Limpar</button>
    </div>
    <div id="tone-feedback" style="margin-top:10px"></div>

    <div style="margin-top:8px;display:flex;align-items:center;gap:8px;">
      <label style="font-size:0.8125rem;color:var(--ink-mid);display:flex;align-items:center;gap:6px;cursor:pointer;">
        <input type="checkbox" id="show-pinyin-toggle" onchange="mostrarOuEsconderPinyin()" checked style="cursor:pointer;">
        <span>Mostrar Pinyin nos caracteres</span>
      </label>
    </div>
    <div class="tip" style="margin-top:12px;font-size:0.75rem">
      <strong>Como ler o gráfico:</strong> A <span style="color:var(--gold);font-weight:700">linha dourada tracejada</span> mostra a forma ideal do tom. A tua voz aparece como uma <span style="color:var(--red);font-weight:700">linha vermelha</span>. Tenta imitar a forma e fala claramente durante 1 ou 2 segundos.
    </div>
  </div>

  <!-- REPETIR PALAVRAS -->
  <div id="mictab-repeat" class="mic-tab-content">
    <p style="font-size:0.8125rem;color:var(--ink-light);margin-bottom:10px">Carrega em <i class="i i-ouvir" aria-hidden="true"></i> para ouvir a palavra, depois em <i class="i i-gravar" aria-hidden="true"></i> e diz a palavra. O reconhecimento de voz verifica se a disseste bem.</p>

    <div style="display:flex;gap:8px;margin-bottom:1rem;flex-wrap:wrap;align-items:center">
      <select id="repeat-category" onchange="mostrarPalavrasParaRepetir()" style="padding:8px 12px;border-radius:10px;border:1.5px solid var(--paper-dark);font-size:0.8125rem;font-family:var(--font-main);background:var(--paper-mid);outline:none;color:var(--ink)">
        <option value="greetings">Cumprimentos</option>
        <option value="numbers">Números</option>
        <option value="food">Comida</option>
        <option value="work">Frases de trabalho</option>
        <option value="tones">Pares de tons (os mais difíceis!)</option>
      </select>
      <button onclick="mostrarPalavrasParaRepetir()" style="background:var(--paper-dark);color:var(--ink);border:none;padding:8px 14px;border-radius:10px;font-size:0.8125rem;cursor:pointer;font-family:var(--font-main)">Recarregar <i class="i i-repetir" aria-hidden="true"></i></button>
    </div>

    <div id="repeat-word-list"></div>

    <div style="margin-top:1rem;padding:12px;background:var(--paper-mid);border-radius:10px" id="repeat-active-wrap" style="display:none">
      <div style="text-align:center">
        <div id="repeat-target-zh" style="font-family:var(--font-chinese);font-size:3.25rem;font-weight:700;color:var(--red)"></div>
        <div id="repeat-target-py" style="font-style:italic;color:var(--ink-light);font-size:0.9375rem;margin:2px 0"></div>
        <div id="repeat-target-en" style="font-size:0.875rem;color:var(--ink)"></div>
      </div>
      <div style="display:flex;gap:10px;justify-content:center;margin-top:12px;flex-wrap:wrap">
        <button onclick="ouvirPalavraAlvo()" style="background:var(--gold);color:#fff;border:none;padding:10px 20px;border-radius:20px;font-size:0.875rem;font-weight:700;cursor:pointer;font-family:var(--font-main)"><i class="i i-ouvir" aria-hidden="true"></i> Ouvir</button>
        <button class="mic-btn idle" id="repeat-mic-btn" onclick="gravarRepeticao()" style="padding:10px 20px"><i class="i i-gravar" aria-hidden="true"></i> Dizer</button>
      </div>
      <div id="repeat-result" style="text-align:center;margin-top:10px;font-size:0.875rem;min-height:30px"></div>
    </div>
  </div>

  <!-- RECONHECIMENTO DE VOZ (FALA LIVRE) -->
  <div id="mictab-recog" class="mic-tab-content">
    <p style="font-size:0.8125rem;color:var(--ink-light);margin-bottom:10px">Diz livremente qualquer frase em chinês. O reconhecimento de voz escreve o que disseste e compara com a frase que escolheste.</p>

    <div style="background:var(--paper-mid);border-radius:10px;padding:12px 16px;margin-bottom:10px">
      <p style="font-size:0.75rem;font-weight:700;color:var(--ink-light);margin-bottom:6px">Experimenta dizer uma destas:</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap" id="recog-prompts">
        <span onclick="escolherFraseParaDizer(this)" style="font-family:var(--font-chinese);font-size:1rem;color:var(--red);cursor:pointer;padding:4px 10px;border:1.5px solid var(--paper-dark);border-radius:8px;background:var(--white)">你好</span>
        <span onclick="escolherFraseParaDizer(this)" style="font-family:var(--font-chinese);font-size:1rem;color:var(--red);cursor:pointer;padding:4px 10px;border:1.5px solid var(--paper-dark);border-radius:8px;background:var(--white)">谢谢你</span>
        <span onclick="escolherFraseParaDizer(this)" style="font-family:var(--font-chinese);font-size:1rem;color:var(--red);cursor:pointer;padding:4px 10px;border:1.5px solid var(--paper-dark);border-radius:8px;background:var(--white)">我爱学中文</span>
        <span onclick="escolherFraseParaDizer(this)" style="font-family:var(--font-chinese);font-size:1rem;color:var(--red);cursor:pointer;padding:4px 10px;border:1.5px solid var(--paper-dark);border-radius:8px;background:var(--white)">今天天气很好</span>
        <span onclick="escolherFraseParaDizer(this)" style="font-family:var(--font-chinese);font-size:1rem;color:var(--red);cursor:pointer;padding:4px 10px;border:1.5px solid var(--paper-dark);border-radius:8px;background:var(--white)">我是葡萄牙人</span>
        <span onclick="escolherFraseParaDizer(this)" style="font-family:var(--font-chinese);font-size:1rem;color:var(--red);cursor:pointer;padding:4px 10px;border:1.5px solid var(--paper-dark);border-radius:8px;background:var(--white)">请问厕所在哪里</span>
      </div>
    </div>

    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
      <div id="recog-target-display" style="flex:1;min-width:160px;background:var(--white);border:1.5px solid var(--paper-dark);border-radius:10px;padding:10px 14px;font-family:var(--font-chinese);font-size:1.25rem;color:var(--ink);min-height:44px">Carrega numa frase acima ou fala livremente…</div>
      <button class="mic-btn idle" id="recog-mic-btn" onclick="gravarFalaLivre()" style="white-space:nowrap"><i class="i i-gravar" aria-hidden="true"></i> Gravar</button>
    </div>

    <div id="recog-result" style="margin-top:10px">
      <p style="color:var(--ink-light);font-size:0.8125rem">O que disseres vai aparecer aqui…</p>
    </div>

    <div id="recog-feedback" style="margin-top:10px"></div>
  </div>

  <!-- PONTUAÇÕES -->
  <div id="mictab-score" class="mic-tab-content">
    <p style="font-size:0.8125rem;color:var(--ink-light);margin-bottom:12px">O teu histórico de pronúncia. Continua a praticar: mais vale sempre do que perfeito!</p>
    <div class="pronun-score-row" id="pronun-score-row">
      <div class="pronun-score-item"><div class="psn" id="ps-attempts">0</div><div class="psl">Tentativas</div></div>
      <div class="pronun-score-item"><div class="psn" id="ps-correct" style="color:var(--green)">0</div><div class="psl">Certas</div></div>
      <div class="pronun-score-item"><div class="psn" id="ps-streak" style="color:var(--red)">0</div><div class="psl">Melhor sequência</div></div>
      <div class="pronun-score-item"><div class="psn" id="ps-pct" style="color:var(--gold)">0%</div><div class="psl">Acerto</div></div>
    </div>
    <div style="margin-top:1.2rem">
      <p style="font-size:0.75rem;font-weight:700;color:var(--ink-light);margin-bottom:8px">ÚLTIMAS TENTATIVAS:</p>
      <div id="ps-history"></div>
    </div>
    <button onclick="apagarHistoricoPronuncia()" style="margin-top:1rem;background:var(--red-light);color:var(--red-dark);border:1.5px solid var(--red-light);border-radius:8px;padding:6px 14px;cursor:pointer;font-size:0.75rem;font-family:var(--font-main)">Apagar o histórico</button>
  </div>

</div>

</div><!-- /container -->

<?php require 'includes/fim.php'; ?>
