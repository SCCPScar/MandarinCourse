/**
 * data.js
 * Aqui eu guardo os dados do vocabulário e as funções da frase do dia,
 * da voz (ler em chinês), dos cartões de memória e do construtor de frases.
 * Nota: o campo "en" guarda o significado, que agora está em português.
 */

// ═══ VOCAB DATA ═══
const vocabData={
  people:[{zh:'我',py:'wǒ',en:'eu / me'},{zh:'你',py:'nǐ',en:'tu'},{zh:'他/她',py:'tā',en:'ele / ela'},{zh:'我们',py:'wǒmen',en:'nós'},{zh:'你们',py:'nǐmen',en:'vocês'},{zh:'他们',py:'tāmen',en:'eles / elas'},{zh:'爸爸',py:'bàba',en:'pai'},{zh:'妈妈',py:'māma',en:'mãe'},{zh:'哥哥',py:'gēge',en:'irmão mais velho'},{zh:'姐姐',py:'jiějie',en:'irmã mais velha'},{zh:'朋友',py:'péngyou',en:'amigo'},{zh:'同事',py:'tóngshì',en:'colega de trabalho'},{zh:'老板',py:'lǎobǎn',en:'chefe'},{zh:'老师',py:'lǎoshī',en:'professor'},{zh:'学生',py:'xuésheng',en:'estudante'},{zh:'外国人',py:'wàiguórén',en:'estrangeiro'}],
  verbs:[{zh:'是',py:'shì',en:'ser'},{zh:'有',py:'yǒu',en:'ter'},{zh:'去',py:'qù',en:'ir'},{zh:'来',py:'lái',en:'vir'},{zh:'说',py:'shuō',en:'falar'},{zh:'吃',py:'chī',en:'comer'},{zh:'喝',py:'hē',en:'beber'},{zh:'买',py:'mǎi',en:'comprar'},{zh:'卖',py:'mài',en:'vender'},{zh:'看',py:'kàn',en:'ver'},{zh:'听',py:'tīng',en:'ouvir'},{zh:'学',py:'xué',en:'estudar'},{zh:'工作',py:'gōngzuò',en:'trabalhar'},{zh:'想',py:'xiǎng',en:'pensar / querer'},{zh:'知道',py:'zhīdào',en:'saber'},{zh:'喜欢',py:'xǐhuān',en:'gostar'},{zh:'爱',py:'ài',en:'amar'},{zh:'住',py:'zhù',en:'morar em'},{zh:'睡觉',py:'shuìjiào',en:'dormir'},{zh:'帮',py:'bāng',en:'ajudar'},{zh:'开会',py:'kāihuì',en:'ter uma reunião'},{zh:'打电话',py:'dǎ diànhuà',en:'telefonar'}],
  adj:[{zh:'好',py:'hǎo',en:'bom'},{zh:'坏',py:'huài',en:'mau'},{zh:'大',py:'dà',en:'grande'},{zh:'小',py:'xiǎo',en:'pequeno'},{zh:'多',py:'duō',en:'muitos / muito'},{zh:'少',py:'shǎo',en:'poucos'},{zh:'快',py:'kuài',en:'rápido'},{zh:'慢',py:'màn',en:'lento'},{zh:'贵',py:'guì',en:'caro'},{zh:'便宜',py:'piányí',en:'barato'},{zh:'热',py:'rè',en:'quente'},{zh:'冷',py:'lěng',en:'frio'},{zh:'漂亮',py:'piàoliang',en:'bonito'},{zh:'忙',py:'máng',en:'ocupado'},{zh:'累',py:'lèi',en:'cansado'},{zh:'高兴',py:'gāoxìng',en:'contente'},{zh:'难过',py:'nánguò',en:'triste'},{zh:'容易',py:'róngyì',en:'fácil'},{zh:'难',py:'nán',en:'difícil'},{zh:'重要',py:'zhòngyào',en:'importante'},{zh:'有意思',py:'yǒu yìsi',en:'interessante'},{zh:'新',py:'xīn',en:'novo'},{zh:'旧',py:'jiù',en:'velho (coisas)'},{zh:'干净',py:'gānjìng',en:'limpo'}],
  places:[{zh:'中国',py:'Zhōngguó',en:'China'},{zh:'北京',py:'Běijīng',en:'Pequim'},{zh:'上海',py:'Shànghǎi',en:'Xangai'},{zh:'家',py:'jiā',en:'casa'},{zh:'公司',py:'gōngsī',en:'empresa'},{zh:'学校',py:'xuéxiào',en:'escola'},{zh:'医院',py:'yīyuàn',en:'hospital'},{zh:'超市',py:'chāoshì',en:'supermercado'},{zh:'餐厅',py:'cāntīng',en:'restaurante'},{zh:'地铁',py:'dìtiě',en:'metro'},{zh:'飞机场',py:'fēijīchǎng',en:'aeroporto'},{zh:'出租车',py:'chūzū chē',en:'táxi'},{zh:'左',py:'zuǒ',en:'esquerda'},{zh:'右',py:'yòu',en:'direita'},{zh:'直走',py:'zhí zǒu',en:'seguir em frente'},{zh:'附近',py:'fùjìn',en:'perto'}],
  food:[{zh:'米饭',py:'mǐfàn',en:'arroz'},{zh:'面条',py:'miàntiáo',en:'massa (noodles)'},{zh:'饺子',py:'jiǎozi',en:'jiaozi (pastéis cozidos)'},{zh:'包子',py:'bāozi',en:'pãezinhos recheados'},{zh:'水',py:'shuǐ',en:'água'},{zh:'茶',py:'chá',en:'chá'},{zh:'咖啡',py:'kāfēi',en:'café'},{zh:'啤酒',py:'píjiǔ',en:'cerveja'},{zh:'肉',py:'ròu',en:'carne'},{zh:'鱼',py:'yú',en:'peixe'},{zh:'蔬菜',py:'shūcài',en:'legumes'},{zh:'水果',py:'shuǐguǒ',en:'fruta'},{zh:'辣',py:'là',en:'picante'},{zh:'甜',py:'tián',en:'doce'},{zh:'好吃',py:'hǎo chī',en:'delicioso'},{zh:'菜单',py:'càidān',en:'ementa'},{zh:'早饭',py:'zǎofàn',en:'pequeno-almoço'},{zh:'午饭',py:'wǔfàn',en:'almoço'},{zh:'晚饭',py:'wǎnfàn',en:'jantar'}],
  time:[{zh:'今天',py:'jīntiān',en:'hoje'},{zh:'明天',py:'míngtiān',en:'amanhã'},{zh:'昨天',py:'zuótiān',en:'ontem'},{zh:'现在',py:'xiànzài',en:'agora'},{zh:'以后',py:'yǐhòu',en:'depois'},{zh:'以前',py:'yǐqián',en:'antes'},{zh:'早上',py:'zǎoshang',en:'manhã'},{zh:'下午',py:'xiàwǔ',en:'tarde'},{zh:'晚上',py:'wǎnshang',en:'noite'},{zh:'星期',py:'xīngqī',en:'semana'},{zh:'月',py:'yuè',en:'mês'},{zh:'年',py:'nián',en:'ano'},{zh:'常常',py:'chángcháng',en:'muitas vezes'},{zh:'有时候',py:'yǒushíhou',en:'às vezes'},{zh:'已经',py:'yǐjīng',en:'já'},{zh:'还',py:'hái',en:'ainda / também'},{zh:'刚',py:'gāng',en:'acabou de'}]
};
const allVocab=[...vocabData.people,...vocabData.verbs,...vocabData.adj,...vocabData.places,...vocabData.food,...vocabData.time];

// ═══ PROGRESS ═══
let learned=LS.get('learned',{});
function markLearned(zh,btn){if(learned[zh]){delete learned[zh];btn.classList.remove('done');}else{learned[zh]=true;btn.classList.add('done');}LS.set('learned',learned);updateProgress();}
function updateProgress(){
  const cats=[{l:'Pessoas',d:vocabData.people},{l:'Verbos',d:vocabData.verbs},{l:'Adjetivos',d:vocabData.adj},{l:'Lugares',d:vocabData.places},{l:'Comida',d:vocabData.food},{l:'Tempo',d:vocabData.time}];
  const g=document.getElementById('po-grid');if(!g)return;
  g.innerHTML=cats.map(c=>{const done=c.d.filter(w=>learned[w.zh]).length;const pct=Math.round(done/c.d.length*100);return`<div class="po-item"><div class="poi-label">${c.l}: ${done}/${c.d.length}</div><div class="poi-bar-wrap"><div class="poi-bar" style="width:${pct}%"></div></div><div class="poi-pct">${pct}%</div></div>`;}).join('');
  const fl=document.getElementById('fc-learned');if(fl)fl.textContent=allVocab.filter(w=>learned[w.zh]).length;
  const ft=document.getElementById('fc-total');if(ft)ft.textContent=allVocab.length;
  const fd=document.getElementById('fc-due');if(fd)fd.textContent=allVocab.filter(w=>!learned[w.zh]).length;
}

function renderVocab(id,data){
  const el=document.getElementById(id);if(!el)return;
  el.innerHTML=data.map(w=>`<div class="card" onclick="speakText('${w.zh}')"><div class="zh">${w.zh}</div><div class="pinyin">${w.py}</div><div class="en">${w.en}</div><button class="learn-btn${learned[w.zh]?' done':''}" onclick="event.stopPropagation();markLearned('${w.zh.replace(/'/g,"\'")}',this)">✓</button></div>`).join('');
}

// ═══ PHRASE OF THE DAY ═══
const potdList=[
  {zh:'加油',py:'jiā yóu',en:'Força! Tu consegues!',ex:'考试加油！ Boa sorte no exame!'},
  {zh:'没问题',py:'méi wèntí',en:'Não há problema!',ex:'这件事没问题。 Isto não é problema.'},
  {zh:'慢慢来',py:'màn màn lái',en:'Com calma, sem pressa',ex:'慢慢来，不要着急。 Com calma, não te apresses.'},
  {zh:'好好学习',py:'hǎo hǎo xuéxí',en:'Estuda com afinco!',ex:'好好学习，天天向上。 Estuda com afinco e melhora todos os dias.'},
  {zh:'坚持就是胜利',py:'jiānchí jiù shì shènglì',en:'Persistir é vencer',ex:'坚持学习！ Continua a estudar!'},
  {zh:'请多指教',py:'qǐng duō zhǐjiào',en:'Conto com a tua ajuda! (educado e humilde)',ex:'初次见面，请多指教！'},
  {zh:'天天进步',py:'tiān tiān jìnbù',en:'Melhorar todos os dias',ex:'每天学一点，天天进步！'},
  {zh:'一步一步来',py:'yī bù yī bù lái',en:'Passo a passo',ex:'学语言要一步一步来。'},
  {zh:'入乡随俗',py:'rù xiāng suí sú',en:'Em Roma, sê romano',ex:'到了中国，入乡随俗！'},
  {zh:'活到老学到老',py:'huó dào lǎo xué dào lǎo',en:'Nunca é tarde para aprender',ex:'学中文永远不晚！'},
];
function setPotd(){const t=new Date().toDateString();const idx=Math.abs(t.split('').reduce((a,c)=>a+c.charCodeAt(0),0))%potdList.length;const p=potdList[idx];document.getElementById('potd-zh').textContent=p.zh;document.getElementById('potd-py').textContent=p.py;document.getElementById('potd-en').textContent=p.en;document.getElementById('potd-ex').textContent='📝 '+p.ex;}

// ═══ SPEECH ═══
let voices=[];window.speechSynthesis.onvoiceschanged=()=>{voices=speechSynthesis.getVoices();};
function speakText(text,rate){
  if(!text)return;speechSynthesis.cancel();
  const utt=new SpeechSynthesisUtterance(text);
  voices=speechSynthesis.getVoices();
  const v=voices.find(v=>v.lang.includes('zh')&&v.lang.includes('CN'))||voices.find(v=>v.lang.startsWith('zh'))||null;
  if(v)utt.voice=v;utt.lang='zh-CN';
  utt.rate=rate||parseFloat(document.getElementById('speak-rate')?.value||0.85);
  speechSynthesis.speak(utt);
  const st=document.getElementById('speak-status');if(st){st.textContent='🔊 A falar…';utt.onend=()=>{st.textContent='';};}
}
document.getElementById('speak-rate')?.addEventListener('input',function(){const l=document.getElementById('speak-rate-label');if(l)l.textContent=this.value+'×';});

// ═══ FLASHCARDS ═══
let fcDeck=[],fcIdx=0,fcFlipped=false;
function initFC(){fcDeck=[...allVocab].sort(()=>Math.random()-.5);fcIdx=0;updateProgress();renderFC();}
function renderFC(){
  if(!fcDeck.length)return;
  const w=fcDeck[fcIdx%fcDeck.length];
  document.getElementById('fc-zh-front').textContent=w.zh;
  document.getElementById('fc-zh-back').textContent=w.zh;
  document.getElementById('fc-py-back').textContent=w.py;
  document.getElementById('fc-en-back').textContent=w.en;
  document.getElementById('fc-speak').onclick=()=>speakText(w.zh);
  document.getElementById('fc-card').classList.remove('flipped');
  fcFlipped=false;
  document.getElementById('fc-controls').style.display='none';
  document.getElementById('fc-prog').textContent=`Cartão ${fcIdx%fcDeck.length+1} de ${fcDeck.length}`;
}
function flipCard(){if(fcFlipped)return;fcFlipped=true;document.getElementById('fc-card').classList.add('flipped');document.getElementById('fc-controls').style.display='flex';speakText(fcDeck[fcIdx%fcDeck.length].zh);}
function rateCard(r){
  const w=fcDeck[fcIdx%fcDeck.length];
  // SRS integration
  const qualMap={hard:0,ok:1,easy:2};
  if(typeof srsRate==='function') srsRate(w.zh, qualMap[r]??1);
  if(r==='easy'||r==='ok'){learned[w.zh]=true;LS.set('learned',learned);updateProgress();}
  fcIdx++;
  if(fcIdx>=fcDeck.length){fcDeck=[...allVocab].sort(()=>Math.random()-.5);fcIdx=0;}
  renderFC();
  if(typeof checkAchievements==='function') checkAchievements();
}

// ═══ SENTENCE BUILDER ═══
const sbP={
  svo:[{slots:['[Sujeito]','[Verbo]','[Objeto]'],correct:['我','喝','茶'],pool:['我','你','他','喝','吃','买','茶','咖啡','书'],hint:'Eu bebo chá'},{slots:['[Sujeito]','[Verbo]','[Objeto]'],correct:['她','买','书'],pool:['我','她','他','买','喝','学','书','茶','中文'],hint:'Ela compra um livro'}],
  shi:[{slots:['[Sujeito]','是','[Nome]'],correct:['我','是','学生'],pool:['我','你','是','有','学生','老师','朋友'],hint:'Eu sou estudante',fx:[0,1,0]},{slots:['[Sujeito]','是','[Nome]'],correct:['他','是','老师'],pool:['他','我','是','有','老师','学生','朋友'],hint:'Ele é professor',fx:[0,1,0]}],
  neg:[{slots:['[Sujeito]','不','[Verbo]'],correct:['我','不','喜欢'],pool:['我','你','不','没','喜欢','去','吃','来'],hint:'Eu não gosto',fx:[0,1,0]},{slots:['[Sujeito]','没有','[Objeto]'],correct:['我','没有','钱'],pool:['我','你','没有','有','不','钱','书','时间'],hint:'Eu não tenho dinheiro',fx:[0,1,0]}],
  modal:[{slots:['[Sujeito]','想','[Verbo]'],correct:['我','想','去'],pool:['我','你','想','会','去','来','吃','学'],hint:'Eu quero ir',fx:[0,1,0]},{slots:['[Sujeito]','会','说中文'],correct:['他','会','说中文'],pool:['他','你','会','能','说中文','学','写'],hint:'Ele sabe falar chinês',fx:[0,1,0]}],
  time:[{slots:['[Tempo]','[Sujeito]','[Verbo]'],correct:['今天','我','去'],pool:['今天','明天','我','你','去','来','吃'],hint:'Hoje eu vou'},{slots:['[Tempo]','[Sujeito]','[Verbo]'],correct:['明天','他','来'],pool:['今天','明天','他','我','来','去','学'],hint:'Amanhã ele vem'}]
};
let sbCur=null,sbSel=[];
function loadSbPattern(){const k=document.getElementById('sb-pattern').value;if(!k)return;const arr=sbP[k];sbCur=arr[Math.floor(Math.random()*arr.length)];sbSel=new Array(sbCur.slots.length).fill(null);renderSb();}
function newSbQ(){const k=document.getElementById('sb-pattern').value;if(!k)return;const arr=sbP[k];sbCur=arr[Math.floor(Math.random()*arr.length)];sbSel=new Array(sbCur.slots.length).fill(null);renderSb();}
function renderSb(){
  if(!sbCur)return;
  document.getElementById('sb-slots').innerHTML=sbCur.slots.map((s,i)=>{if(sbCur.fx&&sbCur.fx[i]===1)return`<div class="sb-slot fixed">${sbCur.correct[i]}</div>`;const f=sbSel[i];return`<div class="sb-slot${f?' filled':''}" onclick="clearSlot(${i})">${f||s}</div>`;}).join('<span style="font-size:18px;color:var(--ink-light);padding:0 2px">→</span>');
  const used=sbSel.filter(Boolean);
  document.getElementById('sb-pool').innerHTML=sbCur.pool.map(w=>`<div class="sb-word${used.includes(w)?' used':''}" onclick="selWord('${w}')">${w}</div>`).join('');
  const r=document.getElementById('sb-result');r.style.display='none';
}
function selWord(w){if(!sbCur)return;if(sbSel.filter(Boolean).includes(w))return;const i=sbCur.slots.findIndex((s,i)=>!sbSel[i]&&!(sbCur.fx&&sbCur.fx[i]===1));if(i===-1)return;sbSel[i]=w;renderSb();}
function clearSlot(i){if(sbCur&&(!sbCur.fx||sbCur.fx[i]!==1)){sbSel[i]=null;renderSb();}}
function resetSb(){if(sbCur){sbSel=new Array(sbCur.slots.length).fill(null);renderSb();}}
function checkSentence(){
  if(!sbCur)return;
  const user=sbCur.slots.map((s,i)=>sbCur.fx&&sbCur.fx[i]===1?sbCur.correct[i]:sbSel[i]).filter(Boolean);
  const ok=user.join('')===sbCur.correct.join('');
  const r=document.getElementById('sb-result');r.style.display='block';
  r.className='sb-result '+(ok?'good':'bad');
  r.textContent=ok?`✓ Certo! "${sbCur.correct.join('')}" significa: ${sbCur.hint}`:`✗ A ordem certa é: ${sbCur.correct.join(' ')} (${sbCur.hint})`;
  if(ok)speakText(sbCur.correct.join(''));
}

