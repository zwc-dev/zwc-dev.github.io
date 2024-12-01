document.addEventListener('DOMContentLoaded', () => {
   // 创建遮罩层
   const overlay = document.createElement('div');
   overlay.className = 'overlay';
   document.body.appendChild(overlay);

   // 禁用导航和主内容区域
   const nav = document.querySelector('nav');
   const main = document.querySelector('main');
   nav.classList.add('disabled');
   main.classList.add('disabled');

   // 登录成功后的处理函数
   function handleLoginSuccess() {
      // 移除遮罩层
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 300);

      // 启用导航和主内容区域
      nav.classList.remove('disabled');
      main.classList.remove('disabled');

      // 隐藏登录表单
      const form = document.querySelector('form');
      form.style.opacity = '0';
      setTimeout(() => form.style.display = 'none', 300);
   }

   // 在原有的登录处理代码中调用 handleLoginSuccess
   document.getElementById('loginIn').addEventListener('click', async (e) => {
      e.preventDefault();
      let users = Model.users;
      let userName = UI.form.user.value;
      let passWord = UI.form.pass.value;

      let success = false;
      for (let u of users) {
         if (u.userName === userName && u.passWord === passWord) {
            success = true;
            break;
         }
      }

      if (success && Model.CET6.length > 5000) {
         handleLoginSuccess();
         UI.log(userName + '成功登录！');
         Model.user = userName;
      }
   });

   // 鼠标跟随效果代码...

   // 优化按钮点击响应
   function initializeButtons() {
      // 按钮点击添加动画效果
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
         button.addEventListener('click', function (e) {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
               this.style.transform = 'scale(1)';
            }, 100);
         });
      });
   }

   // 优化单词选项交互
   function enhanceWordOptions() {
      UI.cnDoms = document.querySelectorAll('p.cn');
      for (let cn of UI.cnDoms) {
         cn.onclick = function () {
            // 移除之前的选中状态
            UI.cnDoms.forEach(dom => {
               dom.classList.remove('selected', 'right', 'wrong');
            });

            // 添加选中效果
            this.classList.add('selected');

            let txt = cn.textContent;
            let pos = Model.pos;

            if (txt === Model.learning[pos].cn) {
               // 正确答案动画
               this.classList.add('right');
               UI.response("答对了!");
               Model.learning[pos].level--;

               // 添加正确提示动画
               const correctTip = document.createElement('span');
               correctTip.className = 'answer-tip correct';
               correctTip.textContent = '✓';
               this.appendChild(correctTip);
               setTimeout(() => correctTip.remove(), 1000);
            } else {
               // 错误答案动画
               this.classList.add('wrong');
               UI.response("答错了!");
               Model.learning[pos].level++;

               // 添加错误提示动画
               const wrongTip = document.createElement('span');
               wrongTip.className = 'answer-tip wrong';
               wrongTip.textContent = '✗';
               this.appendChild(wrongTip);
               setTimeout(() => wrongTip.remove(), 1000);

               // 显示正确答案
               UI.cnDoms.forEach(dom => {
                  if (dom.textContent === Model.learning[pos].cn) {
                     dom.classList.add('correct-answer');
                     setTimeout(() => dom.classList.remove('correct-answer'), 1500);
                  }
               });
            }

            Model.learning[pos].timer = new Date();
         }

         // 添加悬停效果
         cn.addEventListener('mouseenter', function () {
            this.classList.add('hover');
         });

         cn.addEventListener('mouseleave', function () {
            this.classList.remove('hover');
         });
      }
   }

   // 在原有代码中添加相应的CSS样式
   const style = document.createElement('style');
   style.textContent = `
      .cn {
         cursor: pointer;
         transition: all 0.3s ease;
         padding: 10px;
         border-radius: 8px;
         position: relative;
         overflow: hidden;
      }

      .cn.hover {
         background: rgba(255, 255, 255, 0.1);
         transform: translateX(10px);
      }

      .cn.selected {
         background: rgba(255, 255, 255, 0.15);
      }

      .cn.right {
         background: rgba(0, 255, 136, 0.2);
         animation: correctAnswer 0.5s ease;
      }

      .cn.wrong {
         background: rgba(255, 71, 87, 0.2);
         animation: wrongAnswer 0.5s ease;
      }

      .cn.correct-answer {
         border: 2px solid rgba(0, 255, 136, 0.5);
         animation: showCorrect 0.5s ease;
      }

      .answer-tip {
         position: absolute;
         right: 10px;
         top: 50%;
         transform: translateY(-50%);
         font-size: 1.2em;
         animation: tipFadeIn 0.3s ease;
      }

      .answer-tip.correct {
         color: #00ff88;
      }

      .answer-tip.wrong {
         color: #ff4757;
      }

      @keyframes correctAnswer {
         0% { transform: translateX(0); }
         50% { transform: translateX(10px); }
         100% { transform: translateX(0); }
      }

      @keyframes wrongAnswer {
         0% { transform: translateX(0); }
         25% { transform: translateX(-5px); }
         75% { transform: translateX(5px); }
         100% { transform: translateX(0); }
      }

      @keyframes showCorrect {
         from { opacity: 0; }
         to { opacity: 1; }
      }

      @keyframes tipFadeIn {
         from { opacity: 0; transform: translateY(-50%) scale(0.5); }
         to { opacity: 1; transform: translateY(-50%) scale(1); }
      }
   `;
   document.head.appendChild(style);

   // 在DOMContentLoaded事件中初始化
   initializeButtons();
   enhanceWordOptions();

   // 添加按钮点击波纹效果
   function addRippleEffect(button) {
      button.addEventListener('click', function (e) {
         const ripple = document.createElement('span');
         ripple.className = 'ripple';
         this.appendChild(ripple);

         const rect = this.getBoundingClientRect();
         const size = Math.max(rect.width, rect.height);
         ripple.style.width = ripple.style.height = size + 'px';

         const x = e.clientX - rect.left - size / 2;
         const y = e.clientY - rect.top - size / 2;
         ripple.style.left = x + 'px';
         ripple.style.top = y + 'px';

         setTimeout(() => ripple.remove(), 600);
      });
   }

   // 添加单词切换动画
   function addWordTransition() {
      const wordContainer = document.getElementById('en');
      const pnContainer = document.getElementById('pn');

      function animateWord() {
         wordContainer.style.animation = 'fadeInUp 0.5s ease-out';
         pnContainer.style.animation = 'fadeInUp 0.5s ease-out 0.1s';

         setTimeout(() => {
            wordContainer.style.animation = '';
            pnContainer.style.animation = '';
         }, 500);
      }

      // 在切换单词时调用动画
      const nextButton = document.getElementById('nextWord');
      nextButton.addEventListener('click', animateWord);
   }

   // 添加进度提示
   function addProgressIndicator() {
      const progressBar = document.createElement('div');
      progressBar.className = 'progress-bar';
      document.querySelector('main').appendChild(progressBar);

      function updateProgress() {
         const progress = ((Model.pos + 1) / Model.learning.length) * 100;
         progressBar.style.width = progress + '%';
      }

      // 在单词切换时更新进度
      ['firstWord', 'nextWord', 'lastWord'].forEach(id => {
         document.getElementById(id).addEventListener('click', updateProgress);
      });
   }

   // 添加相应的CSS样式
   const extraStyles = document.createElement('style');
   extraStyles.textContent = `
      /* 按钮波纹效果 */
      button {
         position: relative;
         overflow: hidden;
      }
      
      .ripple {
         position: absolute;
         background: rgba(255, 255, 255, 0.3);
         border-radius: 50%;
         transform: scale(0);
         animation: ripple 0.6s linear;
         pointer-events: none;
      }

      @keyframes ripple {
         to {
            transform: scale(4);
            opacity: 0;
         }
      }

      /* 单词切换动画 */
      @keyframes fadeInUp {
         from {
            opacity: 0;
            transform: translateY(20px);
         }
         to {
            opacity: 1;
            transform: translateY(0);
         }
      }

      /* 进度条样式 */
      .progress-bar {
         position: fixed;
         bottom: 0;
         left: 0;
         height: 3px;
         background: linear-gradient(to right, #00ff88, #00b8ff);
         transition: width 0.3s ease;
      }

      /* 优化选项悬停效果 */
      .cn {
         transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .cn:hover {
         transform: translateX(10px) scale(1.02);
         background: rgba(255, 255, 255, 0.1);
      }
   `;
   document.head.appendChild(extraStyles);

   // 在页面加载完成后初始化所有效果
   document.addEventListener('DOMContentLoaded', () => {
      // 为所有按钮添加波纹效果
      document.querySelectorAll('button').forEach(addRippleEffect);

      // 添加单词切换动画
      addWordTransition();

      // 添加进度提示
      addProgressIndicator();
   });
});

UI.form = select('form');
/**
  *异步代码开始，用于用户UI的交互控制（按钮点击事件） 
  * 
  */
select('button#signIn').onclick = function (ev) {
   ev.preventDefault();
   let users = Model.users;
   let userName = UI.form.user.value.trim();
   let passWord = UI.form.pass.value.trim();
   if (userName.length > 0 && passWord.length > 0) {
      let user = {
         'userName': userName,
         'passWord': passWord
      }

      let exist = false;
      for (let u of users) {
         if (u.userName == userName) {
            exist = true;
            break;
         }
      }
      if (exist) {
         UI.footerLog(userName + '已经存在， 注册不成功！');
      } else {
         UI.footerLog(userName + '注册成功！');
         users.push(user);
      }
      //所有在网络和磁盘IO的异步数据的传送，要用JSON字符串
      let s = JSON.stringify(users);
      localStorage.setItem('users', s);
   } else {//有效的用户名和密码注册
      UI.footerLog("无效注册，用户名和密码不能为空");

   }
}; //注册按钮点击事件

select('button#loginIn').onclick = function (ev) {
   ev.preventDefault();
   let users = Model.users;
   let userName = UI.form.user.value;
   let passWord = UI.form.pass.value;

   let success = false;
   for (let u of users) {
      if (u.userName === userName && u.passWord === passWord) {
         success = true;
         break;
      }
   }
   if (success && Model.CET6.length > 5000) {
      UI.log(userName + '成功登录！');
      Model.user = userName;
      UI.form.style.display = 'none';
      //预读每个用户的背单词的状态
      let learned = localStorage.getItem(Model.user + '-learned');
      if (learned) {
         Model.learned = JSON.parse(learned);
      } else {
         Model.learned = [];
      }

      let learning = [];
      for (let i = 0; i < Model.numOfLearning; i++) {
         let rand = Math.floor(Math.random() * Model.CET6.length);
         let word = Model.CET6[rand];
         word.sn = rand;
         learning.push(word);
      }
      Model.learning = learning;
      UI.printWord();
      UI.userStatus();
   } else { //不允许登录的二种情况，用户名和密码问题， 单词库未加载的问题
      if (!success) {
         UI.footerLog(userName + '登录不成功，请查看用户名和密码！');
      }
      if (Model.CET6.length < 5000) {
         UI.footerLog('单词库还未加载完毕，请等会儿再登录！');
      }
   }
}; //登录按钮点击事件


//为页面上DOM元素（四个按钮），设置点击程序的功能
select('button#firstWord').onclick = function () {
   Model.pos = 0;
   UI.printWord();

}


select('button#nextWord').onclick = function () {
   if (Model.pos < Model.learning.length - 1) {
      Model.pos++;
   } else {
      Model.pos = 0;
   }
   UI.printWord();
   UI.response('加油，继续吧！');

}

select('button#lastWord').onclick = function () {
   Model.pos = Model.learning.length - 1;
   UI.printWord();

}
/***
 *  5个中文选项的动态代码，记录用户是否认识本单词
 * */
UI.cnDoms = document.querySelectorAll('p.cn');
for (let cn of UI.cnDoms) {
   cn.onclick = function () {
      // console.log(cn.textContent) ;
      let txt = cn.textContent;
      let pos = Model.pos;
      if (txt === Model.learning[pos].cn) {
         UI.response("答对了!");
         Model.learning[pos].level--;
         this.className += ' right';
      } else {
         UI.response("答错了!");
         Model.learning[pos].level++;
         this.className += ' wrong';
      }
      Model.learning[pos].timer = new Date();
   }
}

select('button#saveWord').onclick = function () {
   if (Model.pos === Model.numOfLearning - 1) {
      let learned = Model.learned;
      if (learned.length >= Model.numOfLearning) {
         for (let word of Model.learning) {
            let found = false;
            for (let l of learned) {
               if (l.sn == word.sn) {
                  if (word.timer) l.timer = word.timer;
                  if (l.level > word.level) l.level = word.level;
                  found = true;
                  break;
               }
            }
            if (!found) {
               let w = {};
               w.sn = word.sn; w.level = word.level;
               if (word.timer) w.timer = word.timer;
               learned.push(w);
            }
         }
      } else {
         learned = [];
         for (let w of Model.learning) {
            let l = {};
            l.sn = w.sn;
            l.level = w.level;
            learned.push(l);
         }
      }
      let str = JSON.stringify(learned);
      localStorage.setItem(Model.user + '-learned', str);
      UI.log("您曾学过单词总计： " + learned.length + " 个！");
      UI.userStatus();
   } else {
      UI.log('本组单词还未背完，不能存储学习进度！');
   }
};//saveWord 结束

select('button#reviewWord').onclick = function () {

   let learned = Model.learned;
   if (learned.length >= 2 * Model.numOfLearning) {
      Model.learning = [];
      let randLearned = function () {
         let rand = Math.floor(Math.random() * learned.length);
         let word = learned[rand];
         if (word.level < 1) {
            randLearned();
         } else {
            return word;
         }
      };
      for (let i = 0; i < Model.numOfLearning; i++) {
         let word = randLearned();
         if (word) {
            let en = Model.CET6[word.sn].en;
            let pn = Model.CET6[word.sn].pn;
            let cn = Model.CET6[word.sn].cn;
            word.cn = cn; word.en = en; word.pn = pn;
            Model.learning.push(word);
         }
      }
      Model.pos = 0;
      Model.numOfLearning = Model.learning.length;
      UI.printWord();
      UI.response('复习' + Model.learning.length + '个单词！');
   } else {
      UI.log('您没背完2组单词,不能进入复习环节');
   }
}; //reviewWord 结束


// 创建全局函数
function select(s) {
   let dom = document.querySelector(s);
   return dom;

}