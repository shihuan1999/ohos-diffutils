/* ===== 互动学习模块 ===== */
const Modules = {

  /* ---------- 单词记忆（闪卡） ---------- */
  vocab(lesson, onDone){
    const words=lesson.words||[];
    let idx=0, known=0;
    const wrap=document.createElement('div');
    wrap.className='trainer';
    wrap.innerHTML=`
      <div class="trainer-card">
        <div class="score-bar"><span>单词 ${idx+1}/${words.length}</span><span id="vocKnown">已掌握 0</span></div>
        <div class="flashcard" id="flashcard">
          <div class="flashcard-inner">
            <div class="flash-face flash-front">
              <div class="word" id="fcWord">${words[0].w}</div>
              <div class="pron" id="fcPron">${words[0].p||''}</div>
              <div style="margin-top:16px;font-size:.85rem;opacity:.8">点击卡片查看释义</div>
            </div>
            <div class="flash-face flash-back">
              <div class="meaning" id="fcMeaning">${words[0].m}</div>
              <div class="example" id="fcExample">${words[0].e||''}</div>
            </div>
          </div>
        </div>
        <div class="trainer-actions">
          <button class="btn btn-ghost" id="fcPrev">← 上一个</button>
          <button class="btn btn-ghost" id="fcSpeak">🔊 朗读</button>
          <button class="btn btn-primary" id="fcKnow">认识 ✓</button>
          <button class="btn btn-ghost" id="fcNext">下一个 →</button>
        </div>
        <p class="muted" style="text-align:center;margin-top:16px">学完所有单词即可完成本课</p>
      </div>`;
    const card=wrap.querySelector('#flashcard');
    card.onclick=()=>card.classList.toggle('flipped');

    function render(){
      const w=words[idx];
      wrap.querySelector('#fcWord').textContent=w.w;
      wrap.querySelector('#fcPron').textContent=w.p||'';
      wrap.querySelector('#fcMeaning').textContent=w.m;
      wrap.querySelector('#fcExample').textContent=w.e||'';
      wrap.querySelector('.score-bar span:first-child').textContent=`单词 ${idx+1}/${words.length}`;
      card.classList.remove('flipped');
    }
    wrap.querySelector('#fcPrev').onclick=e=>{e.stopPropagation();idx=(idx-1+words.length)%words.length;render();};
    wrap.querySelector('#fcNext').onclick=e=>{e.stopPropagation();
      if(idx<words.length-1){idx++;render();}
      else finish();
    };
    wrap.querySelector('#fcSpeak').onclick=e=>{e.stopPropagation();speak(words[idx].w);};
    wrap.querySelector('#fcKnow').onclick=e=>{
      e.stopPropagation(); known++;
      wrap.querySelector('#vocKnown').textContent=`已掌握 ${known}`;
      if(idx<words.length-1){idx++;render();}else finish();
    };
    function finish(){
      const user=Auth.getCurrent();
      if(user){ Auth.addWordsLearned(user,words.length); }
      toast(`🎉 完成 ${words.length} 个单词，获得 ${words.length*2} XP`,'success');
      onDone(words.length*2);
    }
    return wrap;
  },

  /* ---------- 语法练习 ---------- */
  grammar(lesson, onDone){
    const q=lesson;
    let answered=false, correct=false;
    const wrap=document.createElement('div');
    wrap.className='trainer';
    wrap.innerHTML=`
      <div class="trainer-card">
        <div class="score-bar"><span>语法练习</span><span>答对 +15 XP</span></div>
        <div class="q-sub">选择正确答案</div>
        <div class="q-text" style="font-size:1.4rem">${q.question}</div>
        <div class="options" id="gOptions">
          ${q.options.map((o,i)=>`<button class="option" data-i="${i}">${String.fromCharCode(65+i)}. ${o}</button>`).join('')}
        </div>
        <div id="gExplain" style="margin-top:16px;padding:14px;background:var(--bg-soft);border-radius:10px;display:none"></div>
        <div class="trainer-actions">
          <button class="btn btn-primary" id="gNext" style="display:none">下一题 / 完成 →</button>
        </div>
      </div>`;
    wrap.querySelectorAll('.option').forEach(btn=>{
      btn.onclick=()=>{
        if(answered) return;
        answered=true;
        const i=+btn.dataset.i;
        wrap.querySelectorAll('.option').forEach((b,j)=>{
          if(j===q.answer) b.classList.add('correct');
          if(j===i && i!==q.answer) b.classList.add('wrong');
        });
        correct=(i===q.answer);
        const exp=wrap.querySelector('#gExplain');
        exp.style.display='block';
        exp.innerHTML=`<strong>${correct?'✅ 回答正确！':'❌ 回答错误'}</strong><br/>${q.explain||''}`;
        wrap.querySelector('#gNext').style.display='inline-flex';
      };
    });
    wrap.querySelector('#gNext').onclick=()=>{
      const user=Auth.getCurrent();
      if(user){ Auth.addGrammar(user,1); if(correct) Auth.addPerfectRun(user); }
      const xp=correct?15:5;
      toast(`${correct?'✅ 正确':'继续加油'}，获得 ${xp} XP`,correct?'success':'');
      onDone(xp);
    };
    return wrap;
  },

  /* ---------- 口语跟读（Web Speech API） ---------- */
  speak(lesson, onDone){
    const sents=lesson.sentences||[];
    let idx=0, score=0;
    const wrap=document.createElement('div');
    wrap.className='trainer';
    wrap.innerHTML=`
      <div class="trainer-card">
        <div class="score-bar"><span>口语跟读 ${idx+1}/${sents.length}</span><span id="spScore">得分 0</span></div>
        <div class="q-sub">跟着原音朗读，系统会识别你的发音</div>
        <div class="q-text" id="spSentence">${sents[0]}</div>
        <button class="play-btn" id="spPlay" style="margin:0 auto 16px;display:flex">🔊</button>
        <button class="mic-btn" id="spMic">🎤</button>
        <div class="speech-result" id="spResult">点击麦克风开始录音…</div>
        <div class="trainer-actions">
          <button class="btn btn-ghost" id="spPrev">← 上一句</button>
          <button class="btn btn-primary" id="spSkip">跳过</button>
        </div>
      </div>`;
    const mic=wrap.querySelector('#spMic');
    const result=wrap.querySelector('#spResult');
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    let recognition=null;
    if(SR){
      recognition=new SR();
      recognition.lang='en-US';
      recognition.interimResults=false;
      recognition.onstart=()=>{mic.classList.add('recording');result.textContent='正在聆听…';};
      recognition.onresult=e=>{
        const said=e.results[0][0].transcript.toLowerCase().trim();
        const target=sents[idx].toLowerCase().replace(/[^\w\s]/g,'').trim();
        result.textContent=`你说："${said}"`;
        const sim=similarity(said,target);
        const got=Math.round(sim*100);
        score+=got;
        wrap.querySelector('#spScore').textContent=`得分 ${score}`;
        toast(`发音匹配度 ${got}%`,'success');
        setTimeout(next,1200);
      };
      recognition.onerror=()=>{mic.classList.remove('recording');result.textContent='识别失败，请重试或跳过';};
      recognition.onend=()=>{mic.classList.remove('recording');};
    }
    function speakIt(){ speak(sents[idx]); }
    wrap.querySelector('#spPlay').onclick=speakIt;
    mic.onclick=()=>{
      if(!recognition){ result.textContent='当前浏览器不支持语音识别，请使用 Chrome 浏览器'; return; }
      try{ recognition.start(); }catch(e){}
    };
    wrap.querySelector('#spPrev').onclick=()=>{if(idx>0){idx--;render();}};
    wrap.querySelector('#spSkip').onclick=next;
    function render(){
      wrap.querySelector('#spSentence').textContent=sents[idx];
      wrap.querySelector('.score-bar span:first-child').textContent=`口语跟读 ${idx+1}/${sents.length}`;
    }
    function next(){
      if(idx<sents.length-1){idx++;render();}
      else{
        const user=Auth.getCurrent();
        if(user) Auth.addSpeak(user);
        const xp=20+Math.round(score/sents.length/10);
        toast(`🎉 口语训练完成，获得 ${xp} XP`,'success');
        onDone(xp);
      }
    }
    return wrap;
  },

  /* ---------- 听力训练 ---------- */
  listen(lesson, onDone){
    const q=lesson;
    let answered=false;
    const wrap=document.createElement('div');
    wrap.className='trainer';
    wrap.innerHTML=`
      <div class="trainer-card">
        <div class="score-bar"><span>听力训练</span><span>答对 +20 XP</span></div>
        <div class="q-sub">点击播放音频，然后选择正确答案</div>
        <div class="audio-player">
          <button class="play-btn" id="lPlay">▶️</button>
          <button class="btn btn-ghost btn-sm" id="lSlow">慢速重播</button>
        </div>
        <div class="q-text" style="font-size:1.2rem">${q.question}</div>
        <div class="options" id="lOptions">
          ${q.options.map((o,i)=>`<button class="option" data-i="${i}">${o}</button>`).join('')}
        </div>
        <div id="lExplain" style="margin-top:16px;padding:14px;background:var(--bg-soft);border-radius:10px;display:none"></div>
        <div class="trainer-actions">
          <button class="btn btn-primary" id="lNext" style="display:none">完成 →</button>
        </div>
      </div>`;
    wrap.querySelector('#lPlay').onclick=()=>speak(q.audio,1);
    wrap.querySelector('#lSlow').onclick=()=>speak(q.audio,0.6);
    wrap.querySelectorAll('.option').forEach(btn=>{
      btn.onclick=()=>{
        if(answered) return;
        answered=true;
        const i=+btn.dataset.i;
        wrap.querySelectorAll('.option').forEach((b,j)=>{
          if(j===q.answer) b.classList.add('correct');
          if(j===i && i!==q.answer) b.classList.add('wrong');
        });
        const exp=wrap.querySelector('#lExplain');
        exp.style.display='block';
        exp.innerHTML=`<strong>${i===q.answer?'✅ 正确！':'❌ 错误'}</strong><br/>原文："${q.audio}"`;
        wrap.querySelector('#lNext').style.display='inline-flex';
        const correct=(i===q.answer);
        const user=Auth.getCurrent();
        if(user){ Auth.addListen(user); if(correct) Auth.addPerfectRun(user); }
        const xp=correct?20:5;
        wrap.querySelector('#lNext').onclick=()=>{
          toast(`${correct?'听力正确':'再接再厉'}，获得 ${xp} XP`,correct?'success':'');
          onDone(xp);
        };
      };
    });
    return wrap;
  },
};

/* ===== 工具：TTS 朗读 ===== */
function speak(text,rate=1){
  if(!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.rate=rate;
  // 简单语言检测
  if(/[\u3040-\u30ff]/.test(text)) u.lang='ja-JP';
  else if(/[\uac00-\ud7af]/.test(text)) u.lang='ko-KR';
  else u.lang='en-US';
  speechSynthesis.speak(u);
}

/* ===== 工具：字符串相似度 ===== */
function similarity(a,b){
  if(!a||!b) return 0;
  const sa=new Set(a.split(/\s+/)), sb=new Set(b.split(/\s+/));
  let common=0;
  sa.forEach(w=>{ if(sb.has(w)) common++; });
  return common/Math.max(sa.size,sb.size);
}
