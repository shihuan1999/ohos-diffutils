/* ===== LinguaVerse 课程数据 ===== */
const LANGUAGES = {
  en: { id:'en', name:'英语', flag:'🇬🇧', cls:'lang-en', desc:'全球通用语言，从 A1 到 C2 循序渐进' },
  ja: { id:'ja', name:'日语', flag:'🇯🇵', cls:'lang-ja', desc:'五十音到 N1，掌握地道日语表达' },
  ko: { id:'ko', name:'韩语', flag:'🇰🇷', cls:'lang-ko', desc:'한국어，从元音到 TOPIK 高级' },
};

/* 分级课程：每门语言 3 个等级，每级若干课时 */
const COURSES = [
  /* ---------- 英语 ---------- */
  {
    id:'en-a1', lang:'en', title:'英语入门 A1', level:'A1', levelName:'入门',
    desc:'掌握基础词汇与日常问候，能进行简单自我介绍。',
    color:'#3b82f6',
    lessons:[
      { id:'en-a1-1', title:'Greetings 问候语', type:'vocab', words:[
        {w:'Hello',p:'/həˈloʊ/',m:'你好',e:'Hello, nice to meet you.'},
        {w:'Good morning',p:'/ɡʊd ˈmɔːrnɪŋ/',m:'早上好',e:'Good morning, everyone!'},
        {w:'Thank you',p:'/θæŋk juː/',m:'谢谢',e:'Thank you for your help.'},
        {w:'Goodbye',p:'/ɡʊdˈbaɪ/',m:'再见',e:'Goodbye, see you tomorrow.'},
      ]},
      { id:'en-a1-2', title:'Numbers 数字', type:'vocab', words:[
        {w:'one',p:'/wʌn/',m:'一',e:'I have one apple.'},
        {w:'five',p:'/faɪv/',m:'五',e:'There are five books.'},
        {w:'ten',p:'/ten/',m:'十',e:'I am ten years old.'},
        {w:'twenty',p:'/ˈtwenti/',m:'二十',e:'Twenty students are here.'},
      ]},
      { id:'en-a1-3', title:'Introductions 自我介绍', type:'grammar',
        question:'选择正确的句子完成自我介绍："___ name is Tom."',
        options:['I','My','Me','Mine'], answer:1,
        explain:'形容词性物主代词 My 修饰名词 name。' },
      { id:'en-a1-4', title:'Daily Listening 日常听力', type:'listen',
        audio:'Hello, my name is Lisa. I am from Canada. I am a student.',
        question:'Lisa 来自哪里？', options:['美国','加拿大','英国','澳大利亚'], answer:1 },
      { id:'en-a1-5', title:'Speaking: Greetings 口语跟读', type:'speak',
        sentences:['Hello, how are you?','I am fine, thank you.','Nice to meet you.'] },
    ]
  },
  {
    id:'en-b1', lang:'en', title:'英语进阶 B1', level:'B1', levelName:'中级',
    desc:'扩展话题讨论，掌握常见时态与复杂句结构。',
    color:'#2563eb',
    lessons:[
      { id:'en-b1-1', title:'Travel 旅行词汇', type:'vocab', words:[
        {w:'airport',p:'/ˈerpɔːrt/',m:'机场',e:'The airport is very busy.'},
        {w:'passport',p:'/ˈpæspɔːrt/',m:'护照',e:'Please show your passport.'},
        {w:'luggage',p:'/ˈlʌɡɪdʒ/',m:'行李',e:'My luggage is too heavy.'},
        {w:'boarding pass',p:'/ˈbɔːrdɪŋ pæs/',m:'登机牌',e:'Here is my boarding pass.'},
      ]},
      { id:'en-b1-2', title:'Present Perfect 现在完成时', type:'grammar',
        question:'选择正确形式："I ___ to Japan three times."',
        options:['go','went','have been','am going'], answer:2,
        explain:'现在完成时 have/has + 过去分词，表示过去发生对现在有影响。' },
      { id:'en-b1-3', title:'At the Restaurant 餐厅听力', type:'listen',
        audio:'Welcome to our restaurant. Would you like to see the menu? Today\'s special is grilled salmon.',
        question:'今日特餐是什么？', options:['烤牛排','烤三文鱼','意大利面','沙拉'], answer:1 },
      { id:'en-b1-4', title:'Speaking: Travel 旅行口语', type:'speak',
        sentences:['Where is the nearest subway station?','How much does this cost?','Could you help me, please?'] },
    ]
  },

  /* ---------- 日语 ---------- */
  {
    id:'ja-n5', lang:'ja', title:'日语入门 N5', level:'N5', levelName:'入门',
    desc:'掌握五十音图与基础句型，能进行最基本的日常交流。',
    color:'#ec4899',
    lessons:[
      { id:'ja-n5-1', title:'あいさつ 问候', type:'vocab', words:[
        {w:'こんにちは',p:'konnichiwa',m:'你好',e:'こんにちは、田中さん。'},
        {w:'ありがとう',p:'arigatou',m:'谢谢',e:'どうもありがとう。'},
        {w:'さようなら',p:'sayounara',m:'再见',e:'さようなら、また明日。'},
        {w:'すみません',p:'sumimasen',m:'对不起/不好意思',e:'すみません、遅れました。'},
      ]},
      { id:'ja-n5-2', title:'数字 1-10', type:'vocab', words:[
        {w:'一',p:'ichi',m:'一',e:'りんごを一つください。'},
        {w:'五',p:'go',m:'五',e:'五人家族です。'},
        {w:'十',p:'juu',m:'十',e:'十時です。'},
      ]},
      { id:'ja-n5-3', title:'です・ます 句型', type:'grammar',
        question:'选择正确的句子："私は学生___。"',
        options:['です','ます','だ','でした'], answer:0,
        explain:'名词谓语句用 です 结尾，表示"是"。' },
      { id:'ja-n5-4', title:'自己紹介 自我介绍听力', type:'listen',
        audio:'はじめまして。私は鈴木です。日本語の先生です。よろしくお願いします。',
        question:'鈴木さんの仕事は何ですか？', options:['医者','先生','学生','会社員'], answer:1 },
      { id:'ja-n5-5', title:'Speaking: あいさつ 口语跟读', type:'speak',
        sentences:['こんにちは','はじめまして','よろしくお願いします'] },
    ]
  },
  {
    id:'ja-n3', lang:'ja', title:'日语中级 N3', level:'N3', levelName:'中级',
    desc:'掌握较复杂的语法与词汇，能理解日常场景对话。',
    color:'#db2777',
    lessons:[
      { id:'ja-n3-1', title:'交通 交通词汇', type:'vocab', words:[
        {w:'電車',p:'densha',m:'电车',e:'電車で会社へ行きます。'},
        {w:'切符',p:'kippu',m:'车票',e:'切符を買いました。'},
        {w:'乗り換える',p:'norikaeru',m:'换乘',e:'新宿で乗り換えます。'},
      ]},
      { id:'ja-n3-2', title:'〜たことがある 经历', type:'grammar',
        question:'选择正确形式："富士山に___ことがあります。"',
        options:['登る','登った','登って','登り'], answer:1,
        explain:'〜たことがある 表示曾经有过某种经历，用动词た形。' },
      { id:'ja-n3-3', title:'駅で 在车站听力', type:'listen',
        audio:'すみません、東京駅までいくらですか。一番早い電車は何時ですか。',
        question:'何について聞いていますか？', options:['時間','運賃と電車の時間','天気','道順'], answer:1 },
    ]
  },

  /* ---------- 韩语 ---------- */
  {
    id:'ko-1', lang:'ko', title:'韩语入门 初级', level:'初级', levelName:'入门',
    desc:'掌握韩字与基础问候，能进行简单日常对话。',
    color:'#8b5cf6',
    lessons:[
      { id:'ko-1-1', title:'인사 问候', type:'vocab', words:[
        {w:'안녕하세요',p:'annyeonghaseyo',m:'你好',e:'안녕하세요, 만나서 반갑습니다.'},
        {w:'감사합니다',p:'gamsahamnida',m:'谢谢',e:'도와주셔서 감사합니다.'},
        {w:'안녕히 가세요',p:'annyeonghi gaseyo',m:'再见（对离开的人）',e:'안녕히 가세요, 내일 봐요.'},
        {w:'죄송합니다',p:'joesonghamnida',m:'对不起',e:'늦어서 죄송합니다.'},
      ]},
      { id:'ko-1-2', title:'숫자 数字', type:'vocab', words:[
        {w:'하나',p:'hana',m:'一',e:'사과 하나 주세요.'},
        {w:'다섯',p:'daseot',m:'五',e:'다섯 명입니다.'},
        {w:'열',p:'yeol',m:'十',e:'열 시입니다.'},
      ]},
      { id:'ko-1-3', title:'입니다 是…', type:'grammar',
        question:'选择正确句子："저는 학생___."',
        options:['입니다','이에요','입니다','가'], answer:0,
        explain:'名词 + 입니다 表示"是…"，为敬语形式。' },
      { id:'ko-1-4', title:'자기소개 自我介绍听力', type:'listen',
        audio:'안녕하세요. 저는 김민지입니다. 한국에서 왔습니다. 만나서 반갑습니다.',
        question:'민지 씨는 어디에서 왔습니까?', options:['중국','일본','한국','미국'], answer:2 },
      { id:'ko-1-5', title:'Speaking: 인사 口语跟读', type:'speak',
        sentences:['안녕하세요','만나서 반갑습니다','감사합니다'] },
    ]
  },
  {
    id:'ko-2', lang:'ko', title:'韩语中级', level:'中级', levelName:'中级',
    desc:'扩展日常话题，掌握常见语法与表达。',
    color:'#7c3aed',
    lessons:[
      { id:'ko-2-1', title:'음식 饮食词汇', type:'vocab', words:[
        {w:'김치',p:'kimchi',m:'泡菜',e:'김치를 좋아합니다.'},
        {w:'비빔밥',p:'bibimbap',m:'拌饭',e:'비빔밥을 먹고 싶어요.'},
        {w:'주문하다',p:'jumunhada',m:'点餐',e:'여기서 주문할게요.'},
      ]},
      { id:'ko-2-2', title:'-고 싶다 想做', type:'grammar',
        question:'选择正确形式："한국에 가___."',
        options:['고 싶어요','고 있다','어요','는'], answer:0,
        explain:'动词词干 + 고 싶다 表示"想做某事"。' },
      { id:'ko-2-3', title:'식당에서 在餐厅听力', type:'listen',
        audio:'주문하시겠습니까? 저희 식당 추천 메뉴는 삼겹살입니다. 맛있습니다.',
        question:'추천 메뉴는 무엇입니까?', options:['김치찌개','삼겹살','비빔밥','냉면'], answer:1 },
    ]
  },
];

/* 成就定义 */
const ACHIEVEMENTS = [
  { id:'first_step', icon:'👣', name:'初出茅庐', desc:'完成第一节课', check:u=>u.stats.lessonsDone>=1 },
  { id:'five_lessons', icon:'📚', name:'勤学不辍', desc:'完成 5 节课', check:u=>u.stats.lessonsDone>=5 },
  { id:'vocab_50', icon:'📖', name:'词汇达人', desc:'学习 50 个单词', check:u=>u.stats.wordsLearned>=50 },
  { id:'streak_3', icon:'🔥', name:'三连击', desc:'连续学习 3 天', check:u=>u.stats.streak>=3 },
  { id:'streak_7', icon:'⚡', name:'一周坚持', desc:'连续学习 7 天', check:u=>u.stats.streak>=7 },
  { id:'xp_500', icon:'💎', name:'小有成就', desc:'累计获得 500 XP', check:u=>u.stats.xp>=500 },
  { id:'xp_2000', icon:'🏆', name:'学霸', desc:'累计获得 2000 XP', check:u=>u.stats.xp>=2000 },
  { id:'polyglot', icon:'🌍', name:'多语者', desc:'学习 2 种以上语言', check:u=>Object.keys(u.langs||{}).length>=2 },
  { id:'grammar_10', icon:'✏️', name:'语法能手', desc:'完成 10 道语法题', check:u=>u.stats.grammarDone>=10 },
  { id:'speaker', icon:'🎤', name:'开口说', desc:'完成 1 次口语练习', check:u=>u.stats.speakDone>=1 },
  { id:'listener', icon:'🎧', name:'倾听者', desc:'完成 1 次听力训练', check:u=>u.stats.listenDone>=1 },
  { id:'perfect', icon:'⭐', name:'完美主义', desc:'一次训练全部答对', check:u=>u.stats.perfectRuns>=1 },
];

/* 社区种子动态 */
const SEED_POSTS = [
  { author:'Aria', avatar:'A', lang:'en', time:'2 小时前', body:'今天终于把英语 A1 的问候语全掌握了！坚持每天学一点真的有用 💪', likes:12, comments:3 },
  { author:'Yuki', avatar:'Y', lang:'ja', time:'5 小时前', body:'N5 语法 です・ます 终于搞懂了，大家有什么学习日语的好方法推荐吗？', likes:8, comments:5 },
  { author:'Minji', avatar:'M', lang:'ko', time:'昨天', body:'韩语发音真的好有趣，안녕하세요 念起来超可爱！大家一起加油~', likes:21, comments:8 },
  { author:'Carlos', avatar:'C', lang:'en', time:'昨天', body:'分享一个背单词小技巧：把单词做成闪卡，每天翻 20 张，效果翻倍！', likes:34, comments:12 },
];

/* 工具函数 */
function getCourse(id){ return COURSES.find(c=>c.id===id); }
function getLessonsByLang(lang){ return COURSES.filter(c=>c.lang===lang); }
function allLessons(){
  const list=[];
  COURSES.forEach(c=>c.lessons.forEach(l=>list.push({...l, courseId:c.id, courseTitle:c.title, lang:c.lang, color:c.color, level:c.level})));
  return list;
}
