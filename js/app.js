/* ===== LinguaVerse 主应用 ===== */
const App = {
  route:'home',
  state:{},

  init(){
    this.bindGlobal();
    this.renderNav();
    this.route=location.hash.slice(1)||'home';
    window.addEventListener('hashchange',()=>{this.route=location.hash.slice(1)||'home';this.render();});
    this.render();
  },

  bindGlobal(){
    // 导航点击
    document.addEventListener('click',e=>{
      const a=e.target.closest('[data-route]');
      if(a){ e.preventDefault(); location.hash=a.dataset.route; }
    });
    // 认证弹窗
    const modal=document.getElementById('authModal');
    document.querySelectorAll('[data-auth-tab]').forEach(t=>{
      t.onclick=()=>{
        document.querySelectorAll('[data-auth-tab]').forEach(x=>x.classList.remove('active'));
        t.classList.add('active');
        const isReg=t.dataset.authTab==='register';
        document.getElementById('authPassConfirmField').style.display=isReg?'block':'none';
        document.getElementById('authNickField').style.display=isReg?'block':'none';
        document.getElementById('authSubmit').textContent=isReg?'注册':'登录';
        document.getElementById('authError').textContent='';
      };
    });
    document.querySelectorAll('[data-close-auth]').forEach(b=>b.onclick=()=>modal.classList.remove('show'));
    modal.onclick=e=>{if(e.target===modal) modal.classList.remove('show');};
    document.getElementById('authSubmit').onclick=()=>this.handleAuth();
    // 回车提交
    ['authUser','authPass','authPass2','authNick'].forEach(id=>{
      const el=document.getElementById(id);
      if(el) el.onkeydown=e=>{if(e.key==='Enter') this.handleAuth();};
    });
  },

  openAuth(){ document.getElementById('authModal').classList.add('show'); document.getElementById('authUser').focus(); },

  handleAuth(){
    const isReg=document.querySelector('[data-auth-tab].active').dataset.authTab==='register';
    const u=document.getElementById('authUser').value.trim();
    const p=document.getElementById('authPass').value;
    const err=document.getElementById('authError');
    err.textContent='';
    let res;
    if(isReg){
      const p2=document.getElementById('authPass2').value;
      const nick=document.getElementById('authNick').value.trim();
      if(p!==p2){ err.textContent='两次密码不一致'; return; }
      res=Auth.register(u,p,nick);
      if(res.ok){ Auth.login(u,p); toast('注册成功，已自动登录','success'); }
    }else{
      res=Auth.login(u,p);
      if(res.ok) toast(`欢迎回来，${res.user.nick}！`,'success');
    }
    if(!res.ok){ err.textContent=res.msg; return; }
    document.getElementById('authModal').classList.remove('show');
    document.getElementById('authUser').value='';
    document.getElementById('authPass').value='';
    document.getElementById('authPass2').value='';
    document.getElementById('authNick').value='';
    this.renderNav();
    this.render();
  },

  requireAuth(){
    if(!Auth.getCurrent()){ this.openAuth(); return false; }
    return true;
  },

  renderNav(){
    const user=Auth.getCurrent();
    const navUser=document.getElementById('navUser');
    if(user){
      const initial=user.nick.charAt(0).toUpperCase();
      navUser.innerHTML=`
        <div class="user-chip">
          <div class="avatar">${initial}</div>
          <div>
            <div style="font-weight:600;font-size:.9rem">${user.nick}</div>
            <div class="xp-pill">${user.stats.xp} XP</div>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm" id="logoutBtn">退出</button>`;
      document.getElementById('logoutBtn').onclick=()=>{
        Auth.logout(); toast('已退出登录'); this.renderNav(); this.render();
      };
    }else{
      navUser.innerHTML=`<button class="btn btn-primary btn-sm" id="loginBtn">登录 / 注册</button>`;
      document.getElementById('loginBtn').onclick=()=>this.openAuth();
    }
    // 高亮导航
    document.querySelectorAll('.nav-links a').forEach(a=>{
      a.classList.toggle('active', a.dataset.route===this.route);
    });
  },

  render(){
    this.renderNav();
    const app=document.getElementById('app');
    app.innerHTML='';
    const r=this.route;
    if(r==='home') this.renderHome(app);
    else if(r==='courses') this.renderCourses(app);
    else if(r.startsWith('course/')) this.renderCourseDetail(app, r.split('/')[1]);
    else if(r==='learn') this.renderLearn(app);
    else if(r.startsWith('lesson/')) this.renderLesson(app, r.split('/')[1]);
    else if(r==='community') this.renderCommunity(app);
    else if(r==='achievements') this.renderAchievements(app);
    else this.renderHome(app);
    window.scrollTo(0,0);
  },

  /* ============ 首页 ============ */
  renderHome(app){
    const tpl=document.getElementById('tpl-home').content.cloneNode(true);
    const user=Auth.getCurrent();
    // stats
    const stats=tpl.querySelector('#heroStats');
    if(user){
      stats.innerHTML=`
        <div class="stat-card"><div class="num">${user.stats.xp}</div><div class="lbl">总经验值</div></div>
        <div class="stat-card"><div class="num">${user.stats.streak}</div><div class="lbl">连续天数 🔥</div></div>
        <div class="stat-card"><div class="num">${user.stats.lessonsDone}</div><div class="lbl">已完成课时</div></div>
        <div class="stat-card"><div class="num">${user.achievements.length}</div><div class="lbl">解锁成就</div></div>`;
    }else{
      stats.innerHTML=`
        <div class="stat-card"><div class="num">3+</div><div class="lbl">支持语言</div></div>
        <div class="stat-card"><div class="num">6</div><div class="lbl">分级课程</div></div>
        <div class="stat-card"><div class="num">20+</div><div class="lbl">互动课时</div></div>
        <div class="stat-card"><div class="num">12</div><div class="lbl">成就徽章</div></div>`;
    }
    // 继续学习
    const cont=tpl.querySelector('#continueGrid');
    if(user){
      const inProgress=Object.entries(user.progress)
        .filter(([id,p])=>p.percent<100 && p.done.length>0)
        .slice(0,3);
      if(inProgress.length){
        cont.innerHTML=inProgress.map(([id,p])=>{
          const c=getCourse(id); if(!c) return '';
          return courseCardHTML(c,p.percent);
        }).join('');
      }else{
        cont.innerHTML=`<p class="muted">还没有进行中的课程，去挑一门开始吧！</p>`;
      }
    }else{
      cont.innerHTML=COURSES.slice(0,3).map(c=>courseCardHTML(c,0)).join('');
    }
    // 推荐
    const rec=tpl.querySelector('#recommendGrid');
    rec.innerHTML=this.getRecommendations().map(c=>courseCardHTML(c,0)).join('');
    // 语言
    tpl.querySelector('#langRow').innerHTML=Object.values(LANGUAGES).map(l=>`
      <div class="lang-card ${l.cls}" data-route="courses">
        <span class="icon">${l.flag}</span>
        <h3>${l.name}</h3>
        <div class="meta">${l.desc}</div>
      </div>`).join('');
    // continue 按钮
    const contBtn=tpl.querySelector('[data-action="continue"]');
    if(contBtn) contBtn.onclick=()=>location.hash='learn';
    app.appendChild(tpl);
  },

  getRecommendations(){
    const user=Auth.getCurrent();
    if(!user) return COURSES.filter(c=>c.level==='A1'||c.level==='N5'||c.level==='初级').slice(0,3);
    const done=Object.keys(user.progress);
    // 未完成的课优先
    let recs=COURSES.filter(c=>!done.includes(c.id) || user.progress[c.id].percent<100);
    if(recs.length<3) recs=COURSES.slice(0,3);
    return recs.slice(0,3);
  },

  /* ============ 课程列表 ============ */
  renderCourses(app){
    const tpl=document.getElementById('tpl-courses').content.cloneNode(true);
    const user=Auth.getCurrent();
    let filter='all';
    const filterBar=tpl.querySelector('#courseFilter');
    filterBar.innerHTML=`<button class="tag active" data-f="all">全部</button>`+
      Object.values(LANGUAGES).map(l=>`<button class="tag" data-f="${l.id}">${l.flag} ${l.name}</button>`).join('');
    const grid=tpl.querySelector('#courseGrid');
    function draw(){
      const list=filter==='all'?COURSES:COURSES.filter(c=>c.lang===filter);
      grid.innerHTML=list.map(c=>{
        const p=user&&user.progress[c.id]?user.progress[c.id].percent:0;
        return courseCardHTML(c,p);
      }).join('');
    }
    draw();
    filterBar.querySelectorAll('[data-f]').forEach(b=>{
      b.onclick=()=>{ filterBar.querySelectorAll('[data-f]').forEach(x=>x.classList.remove('active')); b.classList.add('active'); filter=b.dataset.f; draw(); };
    });
    app.appendChild(tpl);
  },

  /* ============ 课程详情 ============ */
  renderCourseDetail(app,id){
    const c=getCourse(id);
    if(!c){ app.innerHTML='<p>课程不存在</p>'; return; }
    const user=Auth.getCurrent();
    const p=user&&user.progress[c.id]?user.progress[c.id]:{done:[],percent:0};
    const tpl=document.getElementById('tpl-course-detail').content.cloneNode(true);
    const det=tpl.querySelector('#courseDetail');
    det.innerHTML=`
      <div class="course-banner" style="background:linear-gradient(135deg,${c.color},${shade(c.color,-30)})">
        <div>
          <span class="course-flag">${LANGUAGES[c.lang].flag}</span>
          <h1>${c.title}</h1>
          <p>${c.desc}</p>
          <p style="margin-top:8px;opacity:.9">等级 ${c.levelName} · ${c.lessons.length} 课时 · 进度 ${p.percent}%</p>
        </div>
        <button class="btn btn-accent btn-lg" id="startCourse">${p.percent>0?'继续学习':'开始学习'}</button>
      </div>
      <h2 style="margin-bottom:16px">课时列表</h2>
      <div class="lesson-list">
        ${c.lessons.map((l,i)=>{
          const done=p.done.includes(l.id);
          const typeMap={vocab:'📖 单词',grammar:'✏️ 语法',speak:'🎤 口语',listen:'🎧 听力'};
          return `<div class="lesson-item ${done?'done':''}" data-lesson="${l.id}">
            <div class="lesson-num">${done?'✓':i+1}</div>
            <div class="lesson-info"><h4>${l.title}</h4><p>${typeMap[l.type]||''}</p></div>
            <span class="muted">${done?'已完成':'开始'}</span>
          </div>`;
        }).join('')}
      </div>`;
    det.querySelector('#startCourse').onclick=()=>{
      const next=c.lessons.find(l=>!p.done.includes(l.id))||c.lessons[0];
      location.hash=`lesson/${next.id}`;
    };
    det.querySelectorAll('.lesson-item').forEach(it=>{
      it.onclick=()=>{ location.hash=`lesson/${it.dataset.lesson}`; };
    });
    app.appendChild(tpl);
  },

  /* ============ 学习中心 ============ */
  renderLearn(app){
    const tpl=document.getElementById('tpl-learn').content.cloneNode(true);
    const user=Auth.getCurrent();
    const mods=[
      {icon:'📖',name:'单词记忆',desc:'闪卡背诵，高效记忆',route:'learn'},
      {icon:'✏️',name:'语法练习',desc:'选择填空，即时解析',route:'learn'},
      {icon:'🎤',name:'口语跟读',desc:'语音识别，纠正发音',route:'learn'},
      {icon:'🎧',name:'听力训练',desc:'原音播放，理解问答',route:'learn'},
    ];
    tpl.querySelector('#moduleGrid').innerHTML=mods.map(m=>`
      <div class="card module-card" data-route="courses">
        <div class="mod-icon">${m.icon}</div>
        <h3>${m.name}</h3>
        <p>${m.desc}</p>
      </div>`).join('');
    // 我的进度
    const prog=tpl.querySelector('#myProgress');
    if(user){
      const entries=Object.entries(user.progress);
      if(entries.length){
        prog.innerHTML=`<div class="grid grid-3">${entries.map(([id,p])=>{
          const c=getCourse(id); if(!c) return '';
          return `<div class="card" data-route="course/${c.id}">
            <h3>${c.title}</h3>
            <div class="progress-bar"><span style="width:${p.percent}%"></span></div>
            <div class="course-meta"><span>${p.done.length}/${c.lessons.length} 课时</span><span class="muted">${p.percent}%</span></div>
          </div>`;
        }).join('')}</div>`;
      }else{
        prog.innerHTML='<p class="muted">还没有学习记录，去课程页开始吧！</p>';
      }
    }else{
      prog.innerHTML='<p class="muted">登录后可查看学习进度</p>';
    }
    app.appendChild(tpl);
  },

  /* ============ 单课训练 ============ */
  renderLesson(app,lessonId){
    const lesson=allLessons().find(l=>l.id===lessonId);
    if(!lesson){ app.innerHTML='<p>课时不存在</p>'; return; }
    if(!this.requireAuth()) return;
    const user=Auth.getCurrent();
    const wrap=document.createElement('div');
    wrap.className='section';
    wrap.innerHTML=`<a class="link" data-route="course/${lesson.courseId}">← 返回 ${lesson.courseTitle}</a>
      <h2 style="margin:12px 0">${lesson.title}</h2>
      <p class="muted">${LANGUAGES[lesson.lang].flag} ${LANGUAGES[lesson.lang].name} · ${lesson.level}</p>`;
    const container=document.createElement('div');
    wrap.appendChild(container);

    function onDone(xp){
      const u=Auth.getCurrent();
      Auth.completeLesson(u,lesson.courseId,lesson.id,xp);
      setTimeout(()=>{ location.hash=`course/${lesson.courseId}`; },800);
    }
    let el;
    if(lesson.type==='vocab') el=Modules.vocab(lesson,onDone);
    else if(lesson.type==='grammar') el=Modules.grammar(lesson,onDone);
    else if(lesson.type==='speak') el=Modules.speak(lesson,onDone);
    else if(lesson.type==='listen') el=Modules.listen(lesson,onDone);
    container.appendChild(el);
    app.appendChild(wrap);
  },

  /* ============ 社区 ============ */
  renderCommunity(app){
    const tpl=document.getElementById('tpl-community').content.cloneNode(true);
    let filter='all';
    const posts=this.getPosts();
    const feed=tpl.querySelector('#feed');
    function draw(){
      const list=filter==='all'?posts:posts.filter(p=>p.lang===filter);
      feed.innerHTML=list.map(p=>`
        <div class="post">
          <div class="post-head">
            <div class="avatar">${p.avatar}</div>
            <div><div class="post-author">${p.author}</div><div class="post-time">${p.time}</div></div>
          </div>
          <div class="post-body">${p.body}</div>
          <div class="post-tags"><span class="tag">${LANGUAGES[p.lang].flag} ${LANGUAGES[p.lang].name}</span></div>
          <div class="post-actions">
            <span data-like>❤ ${p.likes}</span>
            <span>💬 ${p.comments}</span>
          </div>
        </div>`).join('')||'<p class="muted">暂无动态</p>';
      feed.querySelectorAll('[data-like]').forEach((el,i)=>{
        el.onclick=()=>{ list[i].likes++; draw(); toast('已点赞','success'); };
      });
    }
    // 语言标签
    tpl.querySelector('#langTags').innerHTML=`<span class="tag ${filter==='all'?'active':''}" data-lang="all">全部</span>`+
      Object.values(LANGUAGES).map(l=>`<span class="tag" data-lang="${l.id}">${l.flag} ${l.name}</span>`).join('');
    tpl.querySelectorAll('[data-lang]').forEach(t=>{
      t.onclick=()=>{ filter=t.dataset.lang; tpl.querySelectorAll('[data-lang]').forEach(x=>x.classList.remove('active')); t.classList.add('active'); draw(); };
    });
    // 榜单
    const lb=tpl.querySelector('#leaderboard');
    const users=Auth.getUsers().sort((a,b)=>b.stats.xp-a.stats.xp).slice(0,5);
    lb.innerHTML=users.map(u=>`<li><span class="lb-name">${u.nick}</span><span class="lb-xp">${u.stats.xp} XP</span></li>`).join('')
      ||'<li class="muted">暂无数据</li>';
    // 发布动态
    tpl.querySelector('#newPostBtn').onclick=()=>{
      if(!this.requireAuth()) return;
      const user=Auth.getCurrent();
      const body=prompt('发布你的学习动态：');
      if(!body||!body.trim()) return;
      const lang=prompt('选择语言标签 (en/ja/ko)：','en');
      if(!['en','ja','ko'].includes(lang)) { toast('语言标签无效'); return; }
      posts.unshift({author:user.nick, avatar:user.nick.charAt(0).toUpperCase(), lang, time:'刚刚', body:body.trim(), likes:0, comments:0});
      this.savePosts(posts);
      toast('发布成功','success');
      draw();
    };
    draw();
    app.appendChild(tpl);
  },

  getPosts(){
    try{ return JSON.parse(localStorage.getItem('lv_posts')||'null') || [...SEED_POSTS]; }
    catch{ return [...SEED_POSTS]; }
  },
  savePosts(p){ localStorage.setItem('lv_posts',JSON.stringify(p)); },

  /* ============ 成就 ============ */
  renderAchievements(app){
    const tpl=document.getElementById('tpl-achievements').content.cloneNode(true);
    const user=Auth.getCurrent();
    const summary=tpl.querySelector('#achSummary');
    if(user){
      const got=user.achievements.length;
      summary.innerHTML=`
        <div class="stat-card"><div class="num">${got}/${ACHIEVEMENTS.length}</div><div class="lbl">已解锁成就</div></div>
        <div class="stat-card"><div class="num">${user.stats.xp}</div><div class="lbl">总经验值</div></div>
        <div class="stat-card"><div class="num">${user.stats.streak}</div><div class="lbl">连续学习天数</div></div>`;
      tpl.querySelector('#achGrid').innerHTML=ACHIEVEMENTS.map(a=>{
        const unlocked=user.achievements.includes(a.id);
        return `<div class="card ach-card ${unlocked?'':'locked'}">
          <div class="ach-icon">${unlocked?a.icon:'🔒'}</div>
          <h4>${a.name}</h4>
          <p>${a.desc}</p>
        </div>`;
      }).join('');
    }else{
      summary.innerHTML='<p class="muted">登录后查看你的成就</p>';
      tpl.querySelector('#achGrid').innerHTML=ACHIEVEMENTS.map(a=>`
        <div class="card ach-card locked">
          <div class="ach-icon">🔒</div>
          <h4>${a.name}</h4>
          <p>${a.desc}</p>
        </div>`).join('');
    }
    app.appendChild(tpl);
  },
};

/* ===== 辅助函数 ===== */
function courseCardHTML(c,percent){
  const l=LANGUAGES[c.lang];
  return `<div class="card course-card" data-route="course/${c.id}">
    <div class="course-head">
      <span class="course-flag">${l.flag}</span>
      <div>
        <h3>${c.title}</h3>
        <span class="level">${c.levelName}</span>
      </div>
    </div>
    <p class="desc">${c.desc}</p>
    <div class="progress-bar"><span style="width:${percent}%"></span></div>
    <div class="course-meta"><span>${c.lessons.length} 课时</span><span>${percent}%</span></div>
  </div>`;
}

function shade(hex,percent){
  const num=parseInt(hex.slice(1),16);
  const amt=Math.round(2.55*percent);
  const R=Math.max(0,Math.min(255,(num>>16)+amt));
  const G=Math.max(0,Math.min(255,((num>>8)&0xff)+amt));
  const B=Math.max(0,Math.min(255,(num&0xff)+amt));
  return '#'+(0x1000000+R*0x10000+G*0x100+B).toString(16).slice(1);
}

let toastTimer;
function toast(msg,type=''){
  const t=document.getElementById('toast');
  t.textContent=msg;
  t.className='toast show '+type;
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove('show'),2200);
}

/* 启动 */
document.addEventListener('DOMContentLoaded',()=>App.init());
