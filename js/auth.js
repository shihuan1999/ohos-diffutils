/* ===== 用户认证系统 ===== */
const Auth = {
  KEY_USERS:'lv_users',
  KEY_SESSION:'lv_session',

  getUsers(){ return JSON.parse(localStorage.getItem(this.KEY_USERS)||'[]'); },
  saveUsers(u){ localStorage.setItem(this.KEY_USERS,JSON.stringify(u)); },

  getCurrent(){
    const s=localStorage.getItem(this.KEY_SESSION);
    if(!s) return null;
    const users=this.getUsers();
    return users.find(u=>u.username===s)||null;
  },

  updateCurrent(user){
    const users=this.getUsers();
    const i=users.findIndex(u=>u.username===user.username);
    if(i>=0){ users[i]=user; this.saveUsers(users); }
  },

  register(username,password,nick){
    if(!username||!password) return {ok:false,msg:'用户名和密码不能为空'};
    if(username.length<3) return {ok:false,msg:'用户名至少 3 个字符'};
    if(password.length<4) return {ok:false,msg:'密码至少 4 个字符'};
    const users=this.getUsers();
    if(users.find(u=>u.username===username)) return {ok:false,msg:'该用户名已被注册'};
    const user={
      username,
      password,
      nick:nick||username,
      createdAt:Date.now(),
      stats:{ xp:0, streak:0, lastStudy:null, lessonsDone:0, wordsLearned:0, grammarDone:0, speakDone:0, listenDone:0, perfectRuns:0 },
      progress:{}, // courseId -> {done:[lessonId], percent}
      langs:{},    // lang -> level
      achievements:[],
    };
    users.push(user);
    this.saveUsers(users);
    return {ok:true,user};
  },

  login(username,password){
    const users=this.getUsers();
    const u=users.find(x=>x.username===username);
    if(!u) return {ok:false,msg:'用户不存在'};
    if(u.password!==password) return {ok:false,msg:'密码错误'};
    localStorage.setItem(this.KEY_SESSION,username);
    this.touchStreak(u);
    return {ok:true,user:u};
  },

  logout(){ localStorage.removeItem(this.KEY_SESSION); },

  /* 连续学习天数 */
  touchStreak(user){
    const today=new Date().toDateString();
    const last=user.stats.lastStudy;
    if(last!==today){
      if(last){
        const lastDate=new Date(last);
        const diff=Math.round((new Date(today)-lastDate)/86400000);
        user.stats.streak = diff===1 ? user.stats.streak+1 : 1;
      }else{
        user.stats.streak=1;
      }
      user.stats.lastStudy=today;
      this.updateCurrent(user);
    }
  },

  /* 完成一节课，更新进度与 XP */
  completeLesson(user,courseId,lessonId,xpGain=10){
    if(!user.progress[courseId]) user.progress[courseId]={done:[]};
    const p=user.progress[courseId];
    if(!p.done.includes(lessonId)){
      p.done.push(lessonId);
      user.stats.lessonsDone++;
      user.stats.xp+=xpGain;
    }
    const course=getCourse(courseId);
    p.percent=course? Math.round(p.done.length/course.lessons.length*100):0;
    // 记录学习语言
    if(course) user.langs[course.lang]=(user.langs[course.lang]||0)+1;
    this.touchStreak(user);
    this.checkAchievements(user);
    return user;
  },

  addWordsLearned(user,n){ user.stats.wordsLearned+=n; this.updateCurrent(user); },
  addGrammar(user,n){ user.stats.grammarDone+=n; this.updateCurrent(user); },
  addSpeak(user){ user.stats.speakDone++; this.updateCurrent(user); },
  addListen(user){ user.stats.listenDone++; this.updateCurrent(user); },
  addPerfectRun(user){ user.stats.perfectRuns++; this.updateCurrent(user); },

  checkAchievements(user){
    ACHIEVEMENTS.forEach(a=>{
      if(!user.achievements.includes(a.id) && a.check(user)){
        user.achievements.push(a.id);
        toast(`🏆 解锁成就：${a.name}`,'success');
      }
    });
    this.updateCurrent(user);
  },
};
