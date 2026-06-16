/**
 * data.js
 * Dados — Vocabulário, Potd, Speak, Flashcard
 * 学中文 — Curso Completo de Mandarim
 */

// ═══ VOCAB DATA ═══
const vocabData={
  people:[{zh:'我',py:'wǒ',en:'I / me'},{zh:'你',py:'nǐ',en:'you'},{zh:'他/她',py:'tā',en:'he / she'},{zh:'我们',py:'wǒmen',en:'we / us'},{zh:'你们',py:'nǐmen',en:'you (plural)'},{zh:'他们',py:'tāmen',en:'they'},{zh:'爸爸',py:'bàba',en:'father'},{zh:'妈妈',py:'māma',en:'mother'},{zh:'哥哥',py:'gēge',en:'older brother'},{zh:'姐姐',py:'jiějie',en:'older sister'},{zh:'朋友',py:'péngyou',en:'friend'},{zh:'同事',py:'tóngshì',en:'colleague'},{zh:'老板',py:'lǎobǎn',en:'boss'},{zh:'老师',py:'lǎoshī',en:'teacher'},{zh:'学生',py:'xuésheng',en:'student'},{zh:'外国人',py:'wàiguórén',en:'foreigner'}],
  verbs:[{zh:'是',py:'shì',en:'to be'},{zh:'有',py:'yǒu',en:'to have'},{zh:'去',py:'qù',en:'to go'},{zh:'来',py:'lái',en:'to come'},{zh:'说',py:'shuō',en:'to speak'},{zh:'吃',py:'chī',en:'to eat'},{zh:'喝',py:'hē',en:'to drink'},{zh:'买',py:'mǎi',en:'to buy'},{zh:'卖',py:'mài',en:'to sell'},{zh:'看',py:'kàn',en:'to see/watch'},{zh:'听',py:'tīng',en:'to listen'},{zh:'学',py:'xué',en:'to study'},{zh:'工作',py:'gōngzuò',en:'to work'},{zh:'想',py:'xiǎng',en:'to think/want'},{zh:'知道',py:'zhīdào',en:'to know'},{zh:'喜欢',py:'xǐhuān',en:'to like'},{zh:'爱',py:'ài',en:'to love'},{zh:'住',py:'zhù',en:'to live at'},{zh:'睡觉',py:'shuìjiào',en:'to sleep'},{zh:'帮',py:'bāng',en:'to help'},{zh:'开会',py:'kāihuì',en:'to hold meeting'},{zh:'打电话',py:'dǎ diànhuà',en:'to call'}],
  adj:[{zh:'好',py:'hǎo',en:'good'},{zh:'坏',py:'huài',en:'bad'},{zh:'大',py:'dà',en:'big'},{zh:'小',py:'xiǎo',en:'small'},{zh:'多',py:'duō',en:'many/much'},{zh:'少',py:'shǎo',en:'few'},{zh:'快',py:'kuài',en:'fast'},{zh:'慢',py:'màn',en:'slow'},{zh:'贵',py:'guì',en:'expensive'},{zh:'便宜',py:'piányí',en:'cheap'},{zh:'热',py:'rè',en:'hot'},{zh:'冷',py:'lěng',en:'cold'},{zh:'漂亮',py:'piàoliang',en:'beautiful'},{zh:'忙',py:'máng',en:'busy'},{zh:'累',py:'lèi',en:'tired'},{zh:'高兴',py:'gāoxìng',en:'happy'},{zh:'难过',py:'nánguò',en:'sad'},{zh:'容易',py:'róngyì',en:'easy'},{zh:'难',py:'nán',en:'difficult'},{zh:'重要',py:'zhòngyào',en:'important'},{zh:'有意思',py:'yǒu yìsi',en:'interesting'},{zh:'新',py:'xīn',en:'new'},{zh:'旧',py:'jiù',en:'old (things)'},{zh:'干净',py:'gānjìng',en:'clean'}],
  places:[{zh:'中国',py:'Zhōngguó',en:'China'},{zh:'北京',py:'Běijīng',en:'Beijing'},{zh:'上海',py:'Shànghǎi',en:'Shanghai'},{zh:'家',py:'jiā',en:'home'},{zh:'公司',py:'gōngsī',en:'company'},{zh:'学校',py:'xuéxiào',en:'school'},{zh:'医院',py:'yīyuàn',en:'hospital'},{zh:'超市',py:'chāoshì',en:'supermarket'},{zh:'餐厅',py:'cāntīng',en:'restaurant'},{zh:'地铁',py:'dìtiě',en:'subway'},{zh:'飞机场',py:'fēijīchǎng',en:'airport'},{zh:'出租车',py:'chūzū chē',en:'taxi'},{zh:'左',py:'zuǒ',en:'left'},{zh:'右',py:'yòu',en:'right'},{zh:'直走',py:'zhí zǒu',en:'go straight'},{zh:'附近',py:'fùjìn',en:'nearby'}],
  food:[{zh:'米饭',py:'mǐfàn',en:'rice'},{zh:'面条',py:'miàntiáo',en:'noodles'},{zh:'饺子',py:'jiǎozi',en:'dumplings'},{zh:'包子',py:'bāozi',en:'buns'},{zh:'水',py:'shuǐ',en:'water'},{zh:'茶',py:'chá',en:'tea'},{zh:'咖啡',py:'kāfēi',en:'coffee'},{zh:'啤酒',py:'píjiǔ',en:'beer'},{zh:'肉',py:'ròu',en:'meat'},{zh:'鱼',py:'yú',en:'fish'},{zh:'蔬菜',py:'shūcài',en:'vegetables'},{zh:'水果',py:'shuǐguǒ',en:'fruit'},{zh:'辣',py:'là',en:'spicy'},{zh:'甜',py:'tián',en:'sweet'},{zh:'好吃',py:'hǎo chī',en:'delicious'},{zh:'菜单',py:'càidān',en:'menu'},{zh:'早饭',py:'zǎofàn',en:'breakfast'},{zh:'午饭',py:'wǔfàn',en:'lunch'},{zh:'晚饭',py:'wǎnfàn',en:'dinner'}],
  time:[{zh:'今天',py:'jīntiān',en:'today'},{zh:'明天',py:'míngtiān',en:'tomorrow'},{zh:'昨天',py:'zuótiān',en:'yesterday'},{zh:'现在',py:'xiànzài',en:'now'},{zh:'以后',py:'yǐhòu',en:'after/later'},{zh:'以前',py:'yǐqián',en:'before'},{zh:'早上',py:'zǎoshang',en:'morning'},{zh:'下午',py:'xiàwǔ',en:'afternoon'},{zh:'晚上',py:'wǎnshang',en:'evening'},{zh:'星期',py:'xīngqī',en:'week'},{zh:'月',py:'yuè',en:'month'},{zh:'年',py:'nián',en:'year'},{zh:'常常',py:'chángcháng',en:'often'},{zh:'有时候',py:'yǒushíhou',en:'sometimes'},{zh:'已经',py:'yǐjīng',en:'already'},{zh:'还',py:'hái',en:'still/also'},{zh:'刚',py:'gāng',en:'just did'}]
};
const allVocab=[...vocabData.people,...vocabData.verbs,...vocabData.adj,...vocabData.places,...vocabData.food,...vocabData.time];

// ═══ PROGRESS ═══
let learned=LS.get('learned',{});
function markLearned(zh,btn){if(learned[zh]){delete learned[zh];btn.classList.remove('done');}else{learned[zh]=true;btn.classList.add('done');}LS.set('learned',learned);updateProgress();}
function updateProgress(){
  const cats=[{l:'People',d:vocabData.people},{l:'Verbs',d:vocabData.verbs},{l:'Adjectives',d:vocabData.adj},{l:'Places',d:vocabData.places},{l:'Food',d:vocabData.food},{l:'Time',d:vocabData.time}];
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
  {zh:'加油',py:'jiā yóu',en:"Keep going! You've got this!",ex:'考试加油！— Good luck on the exam!'},
  {zh:'没问题',py:'méi wèntí',en:'No problem!',ex:'这件事没问题。— This matter is no problem.'},
  {zh:'慢慢来',py:'màn màn lái',en:'Take it slow / No rush',ex:'慢慢来，不要着急。— Take it slow, don\'t rush.'},
  {zh:'好好学习',py:'hǎo hǎo xuéxí',en:'Study hard!',ex:'好好学习，天天向上。— Study hard, improve every day.'},
  {zh:'坚持就是胜利',py:'jiānchí jiù shì shènglì',en:'Perseverance is victory',ex:'坚持学习！— Keep studying!'},
  {zh:'请多指教',py:'qǐng duō zhǐjiào',en:"Please guide me! (humble, polite)",ex:'初次见面，请多指教！'},
  {zh:'天天进步',py:'tiān tiān jìnbù',en:'Improve every day',ex:'每天学一点，天天进步！'},
  {zh:'一步一步来',py:'yī bù yī bù lái',en:'Step by step',ex:'学语言要一步一步来。'},
  {zh:'入乡随俗',py:'rù xiāng suí sú',en:'When in Rome do as Romans do',ex:'到了中国，入乡随俗！'},
  {zh:'活到老学到老',py:'huó dào lǎo xué dào lǎo',en:"Never too old to learn",ex:'学中文永远不晚！'},
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
  const st=document.getElementById('speak-status');if(st){st.textContent='🔊 Speaking…';utt.onend=()=>{st.textContent='';};}
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
  document.getElementById('fc-prog').textContent=`Card ${fcIdx%fcDeck.length+1} of ${fcDeck.length}`;
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
  svo:[{slots:['[Subject]','[Verb]','[Object]'],correct:['我','喝','茶'],pool:['我','你','他','喝','吃','买','茶','咖啡','书'],hint:'I drink tea'},{slots:['[Subject]','[Verb]','[Object]'],correct:['她','买','书'],pool:['我','她','他','买','喝','学','书','茶','中文'],hint:'She buys a book'}],
  shi:[{slots:['[Subject]','是','[Noun]'],correct:['我','是','学生'],pool:['我','你','是','有','学生','老师','朋友'],hint:'I am a student',fx:[0,1,0]},{slots:['[Subject]','是','[Noun]'],correct:['他','是','老师'],pool:['他','我','是','有','老师','学生','朋友'],hint:'He is a teacher',fx:[0,1,0]}],
  neg:[{slots:['[Subject]','不','[Verb]'],correct:['我','不','喜欢'],pool:['我','你','不','没','喜欢','去','吃','来'],hint:"I don't like it",fx:[0,1,0]},{slots:['[Subject]','没有','[Object]'],correct:['我','没有','钱'],pool:['我','你','没有','有','不','钱','书','时间'],hint:"I don't have money",fx:[0,1,0]}],
  modal:[{slots:['[Subject]','想','[Verb]'],correct:['我','想','去'],pool:['我','你','想','会','去','来','吃','学'],hint:'I want to go',fx:[0,1,0]},{slots:['[Subject]','会','说中文'],correct:['他','会','说中文'],pool:['他','你','会','能','说中文','学','写'],hint:'He can speak Chinese',fx:[0,1,0]}],
  time:[{slots:['[Time]','[Subject]','[Verb]'],correct:['今天','我','去'],pool:['今天','明天','我','你','去','来','吃'],hint:'Today I go'},{slots:['[Time]','[Subject]','[Verb]'],correct:['明天','他','来'],pool:['今天','明天','他','我','来','去','学'],hint:'Tomorrow he comes'}]
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
  r.textContent=ok?`✓ Correct! "${sbCur.correct.join('')}" — ${sbCur.hint}`:`✗ Correct order: ${sbCur.correct.join(' ')} — ${sbCur.hint}`;
  if(ok)speakText(sbCur.correct.join(''));
}

