/**
 * estudo.js
 * Aqui eu registo os dias de estudo do aluno:
 * - cada dia em que o aluno abre o site conta como um dia de estudo;
 * - o temporizador do Praticar soma os minutos estudados nesse dia;
 * - com isso calculo os "dias seguidos" (usados na Introdução, no Praticar e nas conquistas).
 *
 * Tudo fica num só registo no browser (chave 'studyLog'), com um número de minutos por dia:
 *   { 'Mon Oct 12 2026': 15, 'Tue Oct 13 2026': 0 }
 */

// ═══ O REGISTO DOS DIAS ═══
// toDateString() dá a data sem as horas, por exemplo "Mon Oct 12 2026"
function textoDoDia(data) {
  return data.toDateString();
}

function lerRegisto() {
  return lerGuardado('studyLog', {});
}

// Marco o dia de hoje como dia de estudo (se ainda não estiver marcado)
function registarHoje() {
  const registo = lerRegisto();
  const hoje = textoDoDia(new Date());
  if (registo[hoje] === undefined) {
    registo[hoje] = 0;
    guardar('studyLog', registo);
  }
}

// ═══ DIAS SEGUIDOS ═══
// Começo hoje e ando para trás, um dia de cada vez, enquanto houver estudo registado.
function contarDiasSeguidos() {
  const registo = lerRegisto();
  let dias = 0;
  const dia = new Date();
  while (registo[textoDoDia(dia)] !== undefined) {
    dias++;
    dia.setDate(dia.getDate() - 1);   // recuo um dia
  }
  return dias;
}

// Somo os minutos de todos os dias
function contarMinutos() {
  const registo = lerRegisto();
  let total = 0;
  for (const dia in registo) {
    total += registo[dia];
  }
  return total;
}

// ═══ MOSTRAR NA PÁGINA ═══
function mostrarDiasDeEstudo() {
  const registo = lerRegisto();
  const diasSeguidos = contarDiasSeguidos();

  // Faixa dourada no topo da Introdução
  const faixa = document.getElementById('streak-banner');
  if (faixa && diasSeguidos >= 1) {
    document.getElementById('streak-text').innerHTML =
      '<i class="i i-dias" aria-hidden="true"></i> ' + plural(diasSeguidos, 'dia') + ' de estudo seguidos. Continua assim!';
    faixa.classList.add('show');
  }

  // Números do separador «Temporizador» do Praticar
  escreverNumero('streak-num', diasSeguidos);
  escreverNumero('total-days', Object.keys(registo).length);
  escreverNumero('total-mins', contarMinutos());

  // Os últimos 7 dias: uma bolinha verde em cada dia com estudo
  const semana = document.getElementById('week-grid');
  if (semana) {
    const nomes = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    let html = '';
    for (let i = 6; i >= 0; i--) {
      const dia = new Date();
      dia.setDate(dia.getDate() - i);
      const estudou = registo[textoDoDia(dia)] !== undefined;
      html += `
        <div class="semana-dia">
          <div class="semana-bola${estudou ? ' semana-bola--feito' : ''}">${estudou ? '✓' : ''}</div>
          <div class="semana-nome">${nomes[dia.getDay()]}</div>
        </div>`;
    }
    semana.innerHTML = html;
  }
}

// Em cada página: registo o dia de hoje e mostro os números
aoAbrirPagina(function () {
  registarHoje();
  mostrarDiasDeEstudo();
});

// ═══ TEMPORIZADOR ═══
let segundosEstudados = 0;
let temporizadorLigado = false;
let intervaloDoTemporizador = null;

function comecarTemporizador() {
  if (temporizadorLigado) {
    return;
  }
  temporizadorLigado = true;
  document.getElementById('t-start').style.display = 'none';
  document.getElementById('t-stop').style.display = 'inline-block';

  // A cada segundo somo 1 e mostro o tempo como mm:ss
  intervaloDoTemporizador = setInterval(function () {
    segundosEstudados++;
    const minutos = Math.floor(segundosEstudados / 60);
    const segundos = segundosEstudados % 60;
    // padStart(2, '0') põe um zero à esquerda: 5 fica "05"
    document.getElementById('timer-display').textContent =
      String(minutos).padStart(2, '0') + ':' + String(segundos).padStart(2, '0');
  }, 1000);
}

function pararTemporizador() {
  if (!temporizadorLigado) {
    return;
  }
  temporizadorLigado = false;
  clearInterval(intervaloDoTemporizador);
  document.getElementById('t-start').style.display = 'inline-block';
  document.getElementById('t-stop').style.display = 'none';

  // Somo os minutos completos ao dia de hoje e recomeço a contagem
  const registo = lerRegisto();
  const hoje = textoDoDia(new Date());
  registo[hoje] = (registo[hoje] || 0) + Math.floor(segundosEstudados / 60);
  guardar('studyLog', registo);
  segundosEstudados = segundosEstudados % 60;
  mostrarDiasDeEstudo();
}

function recomecarTemporizador() {
  pararTemporizador();
  segundosEstudados = 0;
  document.getElementById('timer-display').textContent = '00:00';
}

// Ao sair da página com o temporizador ligado, guardo os minutos estudados
aoSairDaPagina(pararTemporizador);
