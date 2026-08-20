/**
 * Focus & ADHD Hub - Complete Master Application Logic
 * Integrates:
 * 1. User Onboarding (Name, Age, Avatar) -> Auto starts ADHD Assessment
 * 2. Home Dashboard (Level, XP Progress, Motivational Quotes, Next Task Reminder)
 * 3. Dedicated Interactive To-Do List View in Navbar
 * 4. Task Milestones Decomposer (Text & PDF/TXT upload)
 * 5. Floating AI ADHD Clinical Advisor Chatbot with Strict Guardrail
 * 6. Compact Navbar Focus Timer (15m, 25m, 5m)
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================================
    // 1. Translations & Local Storage State
    // =========================================================================
    const i18n = {
        ar: {
            nav_welcome: "الرئيسية",
            nav_milestones: "تفكيك المهام",
            nav_todolist: "قائمة To-Do",
            streak_unit: "يوم",
            score_unit: "نقطة",
            lang_btn: "English",
            onboarding_title: "مرحباً بك في منصة Focus",
            onboarding_subtitle: "عرفنا بنفسك لنبدأ تقييم ADHD المخصص لك ونخصص لك تجربة تركيز تناسب عقلك.",
            choose_avatar: "اختر صورتك الرمزية:",
            your_name: "الاسم / اللقب:",
            your_age: "العمر (الأعمار 15-25):",
            start_assessment_flow: "حفظ والبدء في اختبار ADHD تلقائياً",
            welcome_back: "أهلاً بك،",
            adhd_test_status_label: "نمط ADHD المقيم:",
            retake_test_link: "إعادة اختبار ADHD",
            next_task_tag: "مهمتك القادمة الآن للتركيز",
            mark_done_btn: "تم الإنجاز (+10 XP)",
            open_todo_btn: "عرض قائمة To-Do كاملة",
            decompose_new_btn: "تفكيك مهمة جديدة",
            quote_source: "— مبدأ هارفارد CBT لتجاوز الشلل التنفيذي",
            card_m_title: "تفكيك المهام والملفات (Milestones)",
            card_m_desc: "اكتب مهمتك أو ارفع ملف مشروعك وسيقوم النظام بتفكيكها إلى مراحل متوازنة مع نصائح تنفيذية من مراجع RAG وتحويلها لقائمة To-Do.",
            card_m_btn: "تفكيك مهمة",
            card_todo_desc: "تابع تقدم خطواتك المجهرية، اكسب نقاط الإنجاز اليومية، وحافظ على تدفق الدوبامين الطبيعي خطوة بخطوة.",
            m_heading_badge: "أداة تفكيك المهام المعرفية (CBT Chunking)",
            m_heading_title: "فكك مهمتك الكبيرة إلى مراحل قابلة للإنجاز",
            m_heading_sub: "الدماغ المصاب بـ ADHD يرى المهمة ككتلة ضخمة مستحيلة. تفكيكها إلى 3 مراحل يلغي الشلل التنفيذي فوراً.",
            tab_text_mode: "كتابة المهمة",
            tab_file_mode: "رفع ملف (PDF / TXT)",
            task_placeholder: "اكتب المهمة أو المشروع الذي يسبب لك شللاً أو تسويفاً... (مثال: كتابة تقرير البحث، ترتيب الغرفة وتصنيف الأغراض، المذاكرة للامتحان)",
            drop_text: "اسحب وأفلت ملف المشروع هنا أو اضغط للاختيار",
            drop_sub: "يدعم ملفات PDF و TXT و Markdown (حتى 10MB)",
            decompose_btn: "تفكيك المهمة وبناء الخطة",
            approve_btn: "موافق على الخطة (تحويل إلى قائمة To-Do)",
            todo_title: "قائمة المهام التفاعلية (To-Do List)",
            todo_sub: "كل خطوة تنجزها تمنحك +10 نقاط إنجاز لإفراز الدوبامين الطبيعي.",
            step_1_title: "الذاكرة العاملة",
            step_2_title: "اختبار الانتباه (X)",
            step_3_title: "استرجاع الرقم",
            step_4_title: "التقرير والنتيجة",
            game_intro_title: "اختبار تحديد نمط تشتت الانتباه وفرط الحركة",
            game_intro_desc: "ستخوض 3 ألعاب بسيطة ومتتالية تقيس: (1) الذاكرة العاملة الأولية، (2) الانتباه المستمر والتحكم في الاندفاع، (3) الذاكرة العاملة تحت تأثير المشتتات.",
            rule1_head: "لعبة 1: حفظ رقم سري",
            rule1_sub: "سيظهر رقم مكون من 7 خانات لمدة 10 ثوانٍ؛ احفظه جيداً في ذاكرتك دون كتابته.",
            rule2_head: "لعبة 2: اختبار الانتباه السريع (CPT)",
            rule2_sub: "ستتوالى الحروف على الشاشة؛ اضغط (المسافة SPACE) فور ظهور الحرف 'X' فقط!",
            rule3_head: "لعبة 3: استرجاع الرقم",
            rule3_sub: "سنطلب منك كتابة الرقم السري الذي حفظته في اللعبة الأولى لقياس ثبات الذاكرة.",
            start_game_btn: "ابدأ الاختبار الآن (جاهز)",
            g1_title: "احفظ الرقم التالي في ذاكرتك",
            g1_desc: "ركّز على الرقم جيداً؛ سيختفي بعد 10 ثوانٍ وسنطلب منك استرجاعه بعد اللعبة القادمة.",
            seconds_label: "ثوانٍ متبقية",
            g2_title: "اضغط على زر (المسافة SPACE) عند رؤية الحرف 'X' فقط!",
            g2_desc: "لا تضغط على أي حرف آخر. حاول أن تكون سريعاً ودقيقاً في نفس الوقت (20 محاولة سريعة).",
            space_btn_text: "اضغط هنا أو اضغط SPACE",
            trial_label: "المحاولة:",
            hits_label: "إصابات:",
            misses_label: "تشتت:",
            false_label: "اندفاع:",
            g3_title: "ما هو الرقم المكون من 7 خانات الذي رأيته في البداية؟",
            g3_desc: "اكتب الأرقام بنفس الترتيب الذي حفظته قبل لعبة الحروف.",
            calc_results_btn: "تحليل النتائج وعرض التقرير",
            confidence_label: "مستوى الثقة في التقييم:",
            score_g1_head: "الذاكرة العاملة الأولية",
            score_g2_om_head: "الانتباه المستمر (Misses)",
            score_g2_com_head: "التحكم في الاندفاع (Commissions)",
            score_g3_head: "الذاكرة بعد التشتيت",
            rec_title: "التوصيات والخطوات المقترحة:",
            go_home_btn: "الذهاب للرئيسية ومتابعة المهام",
            consult_ai_btn: "استشارة الشات بوت لخطة علاجية",
            disclaimer_text: "ملاحظة هامة: هذا الاختبار هو أداة فحص وتدريب أولية (Screening Tool) مبنية على أبحاث Digit Span و CPT للأعمار (15-25 سنة)، ولا يُعد تشخيصاً طبياً نهائياً. يُرجى مراجعة طبيب أو أخصائي نفسي معتمد للتشخيص الإكلينيكي الكامل.",
            fab_badge: "المستشار",
            chat_title: "مستشار ADHD الذكي",
            chat_status_online: "متصل - متخصص في تشتت الانتباه",
            chat_name: "المستشار",
            chat_welcome_msg: "مرحباً بك! أنا مستشارك المعتمد لـ ADHD. كيف يمكنني مساعدتك اليوم في التغلب على الشلل التنفيذي، إدارة التشتت، أو تنظيم وقتك؟",
            chat_input_placeholder: "اكتب استشارتك لمرض الـ ADHD...",
            timer_done_alert: "🎉 أحسنت! انتهت جلسة التركيز وحصلت على +25 نقطة إنجاز.",
            logout_btn: "خروج"
        },
        en: {
            nav_welcome: "Home",
            nav_milestones: "Milestones",
            nav_todolist: "To-Do List",
            streak_unit: "days",
            score_unit: "pts",
            lang_btn: "العربية",
            logout_btn: "Logout",
            onboarding_title: "Welcome to Focus Platform",
            onboarding_subtitle: "Tell us about yourself to begin your tailored ADHD assessment and personalized experience.",
            choose_avatar: "Choose your avatar:",
            your_name: "Your Name:",
            your_age: "Age (15-25 Target):",
            start_assessment_flow: "Save & Auto-Start ADHD Assessment",
            welcome_back: "Welcome back,",
            adhd_test_status_label: "Assessed ADHD Profile:",
            retake_test_link: "Retake ADHD Test",
            next_task_tag: "Next Immediate Focus Task",
            mark_done_btn: "Mark Done (+10 XP)",
            open_todo_btn: "Open Full To-Do List",
            decompose_new_btn: "Decompose New Task",
            quote_source: "— Harvard Adult CBT Protocol",
            card_m_title: "Task & File Milestones",
            card_m_desc: "Input your task or upload project files to automatically chunk them into structured milestones with RAG recommendations and an interactive To-Do list.",
            card_m_btn: "Decompose Task",
            card_todo_desc: "Track micro-steps, earn dopamine points, and keep execution smooth.",
            m_heading_badge: "Cognitive Task Chunking Tool (CBT)",
            m_heading_title: "Decompose Overwhelming Tasks into Manageable Milestones",
            m_heading_sub: "ADHD brains view complex tasks as monolithic threats. Chunking them into 3 phases eliminates executive paralysis.",
            tab_text_mode: "Type Task",
            tab_file_mode: "Upload File (PDF / TXT)",
            task_placeholder: "Type the task causing you avoidance or procrastination... (e.g. Write thesis chapter, declutter room, study for math exam)",
            drop_text: "Drag & drop project file here or click to browse",
            drop_sub: "Supports PDF, TXT, and Markdown files (up to 10MB)",
            decompose_btn: "Decompose Task & Build Plan",
            approve_btn: "Approve Plan (Convert to To-Do List)",
            todo_title: "Interactive Action To-Do List",
            todo_sub: "Checking off steps earns you +10 dopamine XP points.",
            step_1_title: "Working Memory",
            step_2_title: "Attention Test (X)",
            step_3_title: "Number Recall",
            step_4_title: "Report & Result",
            game_intro_title: "ADHD Presentation Assessment Test",
            game_intro_desc: "You will complete 3 sequential simple games measuring: (1) Initial working memory, (2) Sustained attention & impulse control, (3) Working memory under distraction.",
            rule1_head: "Game 1: Memorize a 7-Digit Number",
            rule1_sub: "A 7-digit number will appear for 10 seconds. Memorize it without writing it down.",
            rule2_head: "Game 2: Continuous Performance Test (CPT)",
            rule2_sub: "Letters will appear rapidly. Press SPACE ONLY when you see the letter 'X'!",
            rule3_head: "Game 3: Recall the 7 Digits",
            rule3_sub: "Type the 7-digit number from Game 1 to evaluate memory encoding under distraction.",
            start_game_btn: "Start Assessment (Ready)",
            g1_title: "Memorize this 7-digit number",
            g1_desc: "Focus carefully; it will disappear in 10 seconds and you will be asked to recall it after Game 2.",
            seconds_label: "seconds left",
            g2_title: "Press (SPACE) ONLY when you see 'X'!",
            g2_desc: "Do not press for any other letter. Be as fast and accurate as you can (20 fast trials).",
            space_btn_text: "Tap here or Press SPACE",
            trial_label: "Trial:",
            hits_label: "Hits:",
            misses_label: "Misses:",
            false_label: "False:",
            g3_title: "What was the 7-digit number from the beginning?",
            g3_desc: "Type the exact digits in the original order.",
            calc_results_btn: "Analyze Results & View Report",
            confidence_label: "Assessment Confidence Level:",
            score_g1_head: "Initial Working Memory",
            score_g2_om_head: "Sustained Attention (Misses)",
            score_g2_com_head: "Impulse Control (Commissions)",
            score_g3_head: "Recall After Distraction",
            rec_title: "Recommendations & Next Steps:",
            go_home_btn: "Go to Home & Manage Tasks",
            consult_ai_btn: "Consult Chatbot for Targeted Plan",
            disclaimer_text: "Important Note: This is an initial screening tool based on Digit Span and CPT research (ages 15-25) and is not a clinical medical diagnosis. Please consult a qualified psychiatrist or clinical psychologist for formal diagnosis.",
            fab_badge: "Advisor",
            chat_title: "ADHD Clinical Advisor",
            chat_status_online: "Online - ADHD Specialized",
            chat_name: "Advisor",
            chat_welcome_msg: "Hello! I am your evidence-based ADHD assistant. How can I help you tackle executive dysfunction, procrastination, or daily focus today?",
            chat_input_placeholder: "Ask your ADHD question...",
            timer_done_alert: "🎉 Great job! Focus session completed (+25 points awarded)."
        }
    };

    const motivationalQuotes = [
        "«ليس عليك أن تنهي المهمة كلها الآن؛ فقط ابدأ بأصغر خطوة ممكنة لـ 5 دقائق وسيتولى دماغك الباقي.»",
        "«الدوبامين لا يأتي قبل العمل، بل يتولد فور إنجاز أول خطوة مجهرية.»",
        "«التشتت ليس عيباً شخصياً، بل هو عقل شديد الفضول يحتاج إلى بيئة عمل هادئة وقواعد واضحة.»",
        "«قاعدة الـ 15 دقيقة: سباق تركيز قصير أفضل من ساعات من التردد والتسويف.»",
        "«حماية مساراتك العصبية من التبديل بين الشاشات هو أعظم هدية تقدمها لإنتاجيتك اليوم.»"
    ];

    const state = {
        lang: localStorage.getItem('focus_lang') || 'ar',
        theme: localStorage.getItem('focus_theme') || 'serene-light',
        score: parseInt(localStorage.getItem('focus_score') || '50', 10),
        streak: parseInt(localStorage.getItem('focus_streak') || '1', 10),
        lastActiveDate: localStorage.getItem('focus_last_active') || '',
        currentView: 'welcome',
        
        // User Profile
        user: JSON.parse(localStorage.getItem('focus_user_profile') || 'null'),
        adhdTypeResult: localStorage.getItem('focus_adhd_result') || '',
 
        // To-Do Tasks
        todoTasks: [],
        
        // Milestones
        milestonesData: null,
        selectedFile: null,
        milestoneSelection: new Set(),
        
        // Game State
        game: {
            targetDigits: [],
            game1Interval: null,
            cptTrials: [],
            currentTrialIdx: 0,
            trialInterval: null,
            cptHits: 0,
            cptMisses: 0,
            cptFalsePresses: 0,
            respondedInTrial: false,
            scores: {
                g1_score: 0,
                g2_om_score: 0,
                g2_com_score: 0,
                g3_score: 0,
                adhdType: 'Likely No ADHD',
                confidence: 'High'
            }
        },

        // Timer
        timer: {
            totalSeconds: 15 * 60,
            remainingSeconds: 15 * 60,
            isRunning: false,
            intervalId: null
        }
    };

    // DOM Elements
    const el = {
        html: document.documentElement,
        onboardingModal: document.getElementById('onboardingModal'),
        onboardingForm: document.getElementById('onboardingForm'),
        userNameInput: document.getElementById('userNameInput'),
        userAgeInput: document.getElementById('userAgeInput'),
        selectedAvatarInput: document.getElementById('selectedAvatarInput'),
        avatarBtns: document.querySelectorAll('.avatar-btn'),

        navBrandBtn: document.getElementById('navBrandBtn'),
        navUserProfileBtn: document.getElementById('navUserProfileBtn'),
        navUserAvatar: document.getElementById('navUserAvatar'),
        navUserName: document.getElementById('navUserName'),
        viewNavBtns: document.querySelectorAll('.view-nav-btn'),
        viewWelcome: document.getElementById('viewWelcome'),
        viewMilestones: document.getElementById('viewMilestones'),
        viewTodoList: document.getElementById('viewTodoList'),
        viewAssessment: document.getElementById('viewAssessment'),
        
        langToggleBtn: document.getElementById('langToggleBtn'),
        langLabel: document.getElementById('langLabel'),
        themeToggleBtn: document.getElementById('themeToggleBtn'),
        logoutBtn: document.getElementById('logoutBtn'),
        streakCount: document.getElementById('streakCount'),
        scoreCount: document.getElementById('scoreCount'),
        
        // Home Profile & Level
        homeUserAvatar: document.getElementById('homeUserAvatar'),
        homeUserName: document.getElementById('homeUserName'),
        homeUserAge: document.getElementById('homeUserAge'),
        userLevelBadge: document.getElementById('userLevelBadge'),
        userXpText: document.getElementById('userXpText'),
        userLevelProgressFill: document.getElementById('userLevelProgressFill'),
        homeAdhdTypeBadge: document.getElementById('homeAdhdTypeBadge'),
        retakeAssessmentFromHomeBtn: document.getElementById('retakeAssessmentFromHomeBtn'),
        
        // Next Task Reminder on Home
        nextTaskReminderCard: document.getElementById('nextTaskReminderCard'),
        nextTaskTitle: document.getElementById('nextTaskTitle'),
        nextTaskSubtitle: document.getElementById('nextTaskSubtitle'),
        nextTaskCheckBtn: document.getElementById('nextTaskCheckBtn'),
        goToTodoListBtn: document.getElementById('goToTodoListBtn'),
        goToDecomposeBtn: document.getElementById('goToDecomposeBtn'),
        homeTodoStats: document.getElementById('homeTodoStats'),
        startMilestonesCardBtn: document.getElementById('startMilestonesCardBtn'),
        startTodoListCardBtn: document.getElementById('startTodoListCardBtn'),
        dailyMotivationQuote: document.getElementById('dailyMotivationQuote'),

        // Milestones Elements
        tabTextMode: document.getElementById('tabTextMode'),
        tabFileMode: document.getElementById('tabFileMode'),
        textInputArea: document.getElementById('textInputArea'),
        fileInputArea: document.getElementById('fileInputArea'),
        milestoneTaskText: document.getElementById('milestoneTaskText'),
        fileDropzone: document.getElementById('fileDropzone'),
        milestoneFileInput: document.getElementById('milestoneFileInput'),
        selectedFileName: document.getElementById('selectedFileName'),
        decomposeTaskBtn: document.getElementById('decomposeTaskBtn'),
        decomposeSpinner: document.getElementById('decomposeSpinner'),
        milestonesResultArea: document.getElementById('milestonesResultArea'),
        milestoneTaskSummaryTitle: document.getElementById('milestoneTaskSummaryTitle'),
        milestoneAdviceSummaryText: document.getElementById('milestoneAdviceSummaryText'),
        milestoneTotalTime: document.getElementById('milestoneTotalTime'),
        milestonesGrid: document.getElementById('milestonesGrid'),
        approveMilestonesBtn: document.getElementById('approveMilestonesBtn'),

        // Dedicated To-Do List View
        todoItemsList: document.getElementById('todoItemsList'),
        todoProgressText: document.getElementById('todoProgressText'),
        todoProgressBarFill: document.getElementById('todoProgressBarFill'),
        quickAddTodoForm: document.getElementById('quickAddTodoForm'),
        quickTodoInput: document.getElementById('quickTodoInput'),
        goToDecomposeFromTodoBtn: document.getElementById('goToDecomposeFromTodoBtn'),

        // Assessment Stepper & Screens
        stepNodes: [
            document.getElementById('stepNode1'),
            document.getElementById('stepNode2'),
            document.getElementById('stepNode3'),
            document.getElementById('stepNode4')
        ],
        stepLines: [
            document.getElementById('stepLine1'),
            document.getElementById('stepLine2'),
            document.getElementById('stepLine3')
        ],
        gameIntroScreen: document.getElementById('gameIntroScreen'),
        game1Screen: document.getElementById('game1Screen'),
        game2Screen: document.getElementById('game2Screen'),
        game3Screen: document.getElementById('game3Screen'),
        assessmentResultScreen: document.getElementById('assessmentResultScreen'),
        startGameBtn: document.getElementById('startGameBtn'),
        game1NumberDisplay: document.getElementById('game1NumberDisplay'),
        game1Progress: document.getElementById('game1Progress'),
        game1TimerText: document.getElementById('game1TimerText'),
        game2LetterDisplay: document.getElementById('game2LetterDisplay'),
        game2SpaceBtn: document.getElementById('game2SpaceBtn'),
        game2TrialCount: document.getElementById('game2TrialCount'),
        game2HitsCount: document.getElementById('game2HitsCount'),
        game2MissesCount: document.getElementById('game2MissesCount'),
        game2FalseCount: document.getElementById('game2FalseCount'),
        game3RecallForm: document.getElementById('game3RecallForm'),
        digitInputs: document.querySelectorAll('.digit-input'),
        resultTypeBadge: document.getElementById('resultTypeBadge'),
        resultTypeHeading: document.getElementById('resultTypeHeading'),
        resultTypeDescription: document.getElementById('resultTypeDescription'),
        resultConfidenceLevel: document.getElementById('resultConfidenceLevel'),
        resG1Score: document.getElementById('resG1Score'),
        resG1Interp: document.getElementById('resG1Interp'),
        resG2OmScore: document.getElementById('resG2OmScore'),
        resG2OmInterp: document.getElementById('resG2OmInterp'),
        resG2ComScore: document.getElementById('resG2ComScore'),
        resG2ComInterp: document.getElementById('resG2ComInterp'),
        resG3Score: document.getElementById('resG3Score'),
        resG3Interp: document.getElementById('resG3Interp'),
        resultRecommendationText: document.getElementById('resultRecommendationText'),
        goHomeAfterAssessmentBtn: document.getElementById('goHomeAfterAssessmentBtn'),
        openChatbotForAssessmentBtn: document.getElementById('openChatbotForAssessmentBtn'),

        // Mini Navbar Timer
        timerMinutes: document.getElementById('timerMinutes'),
        timerSeconds: document.getElementById('timerSeconds'),
        timerPlayBtn: document.getElementById('timerPlayBtn'),
        timerResetBtn: document.getElementById('timerResetBtn'),
        timerModePills: document.querySelectorAll('.timer-mode-pill'),
        timerChime: document.getElementById('timerChime'),
        gameCorrectBeep: document.getElementById('gameCorrectBeep'),

        // Floating Chatbot
        chatbotFloatingBtn: document.getElementById('chatbotFloatingBtn'),
        chatbotDrawer: document.getElementById('chatbotDrawer'),
        closeChatBtn: document.getElementById('closeChatBtn'),
        chatMessages: document.getElementById('chatMessages'),
        chatForm: document.getElementById('chatForm'),
        chatInput: document.getElementById('chatInput'),
        chatSpinner: document.getElementById('chatSpinner'),
        chatPills: document.querySelectorAll('.chat-pill')
    };

    function normalizeTodoText(value) {
        return String(value || '').replace(/\s+/g, ' ').trim();
    }

    function getTodoStorageKey() {
        if (!state.user || !state.user.name) {
            return 'focus_todo_tasks_guest';
        }
        const ownerKey = `${state.user.name || 'user'}::${state.user.age || ''}::${state.user.avatar || ''}`;
        return `focus_todo_tasks_${ownerKey.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
    }

    function loadTodoTasksForCurrentUser() {
        const storageKey = getTodoStorageKey();
        try {
            const savedTasks = JSON.parse(localStorage.getItem(storageKey) || '[]');
            const normalized = Array.isArray(savedTasks) ? savedTasks : [];
            return normalized
                .map(task => {
                    const text = normalizeTodoText(task.text || task.title || '');
                    if (!text) return null;
                    const dueDate = task.dueDate ? String(task.dueDate).trim() : '';
                    const taskOwner = task.owner || {
                        id: state.user ? `${state.user.name || 'guest'}-${state.user.age || ''}` : 'guest',
                        name: state.user ? state.user.name : 'guest'
                    };
                    return {
                        id: String(task.id || `task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`),
                        text,
                        title: text,
                        milestoneTitle: normalizeTodoText(task.milestoneTitle || task.milestone || ''),
                        done: Boolean(task.done),
                        dueDate,
                        owner: taskOwner,
                        createdAt: task.createdAt || new Date().toISOString(),
                        source: task.source || 'manual'
                    };
                })
                .filter(Boolean);
        } catch (error) {
            console.warn('Could not load todo tasks for current user:', error);
            return [];
        }
    }

    function saveTodoTasks(tasks = state.todoTasks) {
        const storageKey = getTodoStorageKey();
        localStorage.setItem(storageKey, JSON.stringify(tasks));
        state.todoTasks = tasks;
    }

    function validateTodoTask(task, options = {}) {
        const { allowDuplicate = false, isUpdate = false } = options;
        const text = normalizeTodoText(task.text || task.title || '');

        if (!text) {
            throw new Error(state.lang === 'ar' ? 'عنوان المهمة لا يمكن أن يكون فارغاً.' : 'Task title cannot be empty.');
        }

        const duplicated = state.todoTasks.some(existing => {
            const existingText = normalizeTodoText(existing.text || existing.title || '');
            return existingText.toLowerCase() === text.toLowerCase() && (!isUpdate || existing.id !== task.id);
        });

        if (duplicated && !allowDuplicate) {
            throw new Error(state.lang === 'ar' ? 'تم إرسال نفس المهمة سابقاً. الرجاء اختيار عنوان مختلف.' : 'This task was already submitted. Please use a different title.');
        }

        const dueDate = task.dueDate ? String(task.dueDate).trim() : '';
        if (dueDate) {
            const parsedDate = new Date(dueDate);
            if (Number.isNaN(parsedDate.getTime())) {
                throw new Error(state.lang === 'ar' ? 'تاريخ المهمة غير صالح.' : 'The task due date is invalid.');
            }
        }

        return {
            id: String(task.id || `task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`),
            text,
            title: text,
            milestoneTitle: normalizeTodoText(task.milestoneTitle || task.milestone || ''),
            done: Boolean(task.done),
            dueDate,
            owner: task.owner || {
                id: state.user ? `${state.user.name || 'guest'}-${state.user.age || ''}` : 'guest',
                name: state.user ? state.user.name : 'guest'
            },
            createdAt: task.createdAt || new Date().toISOString(),
            source: task.source || 'manual'
        };
    }

    function addTodoTask(taskInput, options = {}) {
        try {
            const normalizedTask = validateTodoTask(taskInput, options);
            // Add new tasks to the top of the list so they appear at the top of Active Tasks
            state.todoTasks.unshift(normalizedTask);
            saveTodoTasks(state.todoTasks);
            renderTodoList();
            updateHomeNextTaskCard();
            return normalizedTask;
        } catch (error) {
            alert(error.message || (state.lang === 'ar' ? 'تعذر حفظ المهمة.' : 'Unable to save the task.'));
            return null;
        }
    }

    function removeTodoTask(taskId) {
        state.todoTasks = state.todoTasks.filter(task => task.id !== taskId);
        saveTodoTasks(state.todoTasks);
        renderTodoList();
        updateHomeNextTaskCard();
    }

    function updateTodoTask(taskId, nextText) {
        const trimmedText = normalizeTodoText(nextText);
        const existingTask = state.todoTasks.find(task => task.id === taskId);
        if (!existingTask) return null;

        try {
            const updatedTask = validateTodoTask({
                ...existingTask,
                text: trimmedText,
                title: trimmedText,
                id: taskId
            }, { isUpdate: true });

            state.todoTasks = state.todoTasks.map(task => (task.id === taskId ? updatedTask : task));
            saveTodoTasks(state.todoTasks);
            renderTodoList();
            updateHomeNextTaskCard();
            return updatedTask;
        } catch (error) {
            alert(error.message || (state.lang === 'ar' ? 'تعذر تحديث المهمة.' : 'Unable to update the task.'));
            return null;
        }
    }

    state.todoTasks = loadTodoTasksForCurrentUser();

    // =========================================================================
    // 2. User Onboarding Flow
    // =========================================================================
    function checkOnboarding() {
        if (!state.user || !state.user.name) {
            el.onboardingModal.classList.remove('hidden');
        } else {
            applyUserProfile(state.user);
        }
    }

    el.avatarBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            el.avatarBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            el.selectedAvatarInput.value = btn.getAttribute('data-avatar');
        });
    });

    el.onboardingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = el.userNameInput.value.trim();
        const age = parseInt(el.userAgeInput.value.trim(), 10) || 20;
        const avatar = el.selectedAvatarInput.value || '🧑‍💻';

        if (!name) {
            alert(state.lang === 'ar' ? 'الرجاء إدخال اسم المستخدم.' : 'Please enter the user name.');
            return;
        }

        state.user = { name, age, avatar };
        localStorage.setItem('focus_user_profile', JSON.stringify(state.user));
        state.todoTasks = loadTodoTasksForCurrentUser();

        applyUserProfile(state.user);
        el.onboardingModal.classList.add('hidden');

        // Automatically launch into ADHD Assessment
        switchView('assessment');
        resetGameTo(1);
    });

    function applyUserProfile(u) {
        if (!u) return;
        el.navUserAvatar.textContent = u.avatar;
        el.navUserName.textContent = u.name;
        el.homeUserAvatar.textContent = u.avatar;
        el.homeUserName.textContent = u.name;
        el.homeUserAge.textContent = `${u.age} ${state.lang === 'ar' ? 'سنة' : 'yrs'}`;
        state.todoTasks = loadTodoTasksForCurrentUser();
        updateHomeNextTaskCard();
        renderTodoList();
        updateUserLevelAndScore();
    }

    function updateUserLevelAndScore() {
        const score = state.score;
        const level = Math.floor(score / 100) + 1;
        const xpInCurrentLevel = score % 100;
        const isAr = state.lang === 'ar';

        const levelTitlesAr = ['مبتدئ التركيز', 'ممارس اليقظة', 'بطل الإنتاجية', 'سيد العمل العميق', 'أسطورة التركيز'];
        const levelTitlesEn = ['Focus Novice', 'Mindful Practitioner', 'Productivity Champion', 'Deep Work Master', 'Legend of Focus'];
        const title = isAr ? (levelTitlesAr[level - 1] || 'خبير عالي التركيز') : (levelTitlesEn[level - 1] || 'Grandmaster of Focus');

        el.userLevelBadge.textContent = isAr ? `المستوى ${level}: ${title}` : `Level ${level}: ${title}`;
        el.userXpText.textContent = `${xpInCurrentLevel} / 100 XP`;
        el.userLevelProgressFill.style.width = `${xpInCurrentLevel}%`;

        if (state.adhdTypeResult) {
            el.homeAdhdTypeBadge.textContent = state.adhdTypeResult;
        } else {
            el.homeAdhdTypeBadge.textContent = isAr ? 'لم يتم الاختبار بعد' : 'Not tested yet';
        }
    }

    el.navUserProfileBtn.addEventListener('click', () => {
        const newName = prompt(state.lang === 'ar' ? 'تعديل الاسم:' : 'Edit Name:', state.user ? state.user.name : '');
        if (newName && newName.trim()) {
            state.user.name = newName.trim();
            localStorage.setItem('focus_user_profile', JSON.stringify(state.user));
            applyUserProfile(state.user);
        }
    });

    if (el.logoutBtn) {
        el.logoutBtn.addEventListener('click', () => {
            const isAr = state.lang === 'ar';
            const msg = isAr 
                ? 'هل ترغب في تسجيل الخروج والبدء من جديد بحساب/تقييم آخر؟' 
                : 'Are you sure you want to log out and start a fresh profile / assessment?';
            
            if (confirm(msg)) {
                localStorage.removeItem('focus_user_profile');
                localStorage.removeItem('focus_adhd_result');
                state.user = null;
                state.adhdTypeResult = '';
                
                el.userNameInput.value = '';
                el.userAgeInput.value = '';
                el.navUserAvatar.textContent = '🧑‍💻';
                el.navUserName.textContent = isAr ? 'مستخدم' : 'User';
                el.homeUserName.textContent = isAr ? 'مستخدم' : 'User';
                el.homeAdhdTypeBadge.textContent = isAr ? 'لم يتم الاختبار بعد' : 'Not tested yet';
                
                el.onboardingModal.classList.remove('hidden');
                switchView('welcome');
            }
        });
    }

    // =========================================================================
    // 3. View Routing & Navigation
    // =========================================================================
    function switchView(viewName) {
        state.currentView = viewName;
        
        el.viewWelcome.classList.toggle('active', viewName === 'welcome');
        el.viewMilestones.classList.toggle('active', viewName === 'milestones');
        el.viewTodoList.classList.toggle('active', viewName === 'todolist');
        el.viewAssessment.classList.toggle('active', viewName === 'assessment');

        el.viewNavBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-view') === viewName);
        });

        if (viewName === 'welcome') {
            updateHomeNextTaskCard();
        } else if (viewName === 'todolist') {
            renderTodoList();
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    el.viewNavBtns.forEach(btn => {
        btn.addEventListener('click', () => switchView(btn.getAttribute('data-view')));
    });

    el.navBrandBtn.addEventListener('click', () => switchView('welcome'));
    el.startMilestonesCardBtn.addEventListener('click', () => switchView('milestones'));
    el.startTodoListCardBtn.addEventListener('click', () => switchView('todolist'));
    el.goToTodoListBtn.addEventListener('click', () => switchView('todolist'));
    el.goToDecomposeBtn.addEventListener('click', () => switchView('milestones'));
    if (el.goToDecomposeFromTodoBtn) {
        el.goToDecomposeFromTodoBtn.addEventListener('click', () => switchView('milestones'));
    }

    el.retakeAssessmentFromHomeBtn.addEventListener('click', () => {
        switchView('assessment');
        resetGameTo(1);
    });

    // =========================================================================
    // 4. Streak & Score Management
    // =========================================================================
    function checkStreak() {
        const today = new Date().toISOString().slice(0, 10);
        if (!state.lastActiveDate) {
            state.streak = 1;
        } else if (state.lastActiveDate !== today) {
            const lastDate = new Date(state.lastActiveDate);
            const currentDate = new Date(today);
            const diffDays = Math.round((currentDate - lastDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) state.streak += 1;
            else if (diffDays > 1) state.streak = 1;
        }
        state.lastActiveDate = today;
        localStorage.setItem('focus_last_active', today);
        localStorage.setItem('focus_streak', state.streak.toString());
        el.streakCount.textContent = state.streak;
    }

    function addScore(points) {
        state.score += points;
        localStorage.setItem('focus_score', state.score.toString());
        el.scoreCount.textContent = state.score;
        updateUserLevelAndScore();
        
        const pill = el.scoreCount.closest('.stat-pill');
        if (pill) {
            pill.style.transform = 'scale(1.15)';
            setTimeout(() => { pill.style.transform = 'scale(1)'; }, 220);
        }
    }

    // =========================================================================
    // 5. Language & Theme Handlers
    // =========================================================================
    function applyLanguage(lang) {
        state.lang = lang;
        localStorage.setItem('focus_lang', lang);
        
        el.html.setAttribute('lang', lang);
        el.html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        el.langLabel.textContent = i18n[lang].lang_btn;

        document.querySelectorAll('[data-i18n]').forEach(elem => {
            const key = elem.getAttribute('data-i18n');
            if (i18n[lang][key]) elem.textContent = i18n[lang][key];
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(elem => {
            const key = elem.getAttribute('data-i18n-placeholder');
            if (i18n[lang][key]) elem.setAttribute('placeholder', i18n[lang][key]);
        });
        
        updateHomeNextTaskCard();
        updateUserLevelAndScore();
    }

    el.langToggleBtn.addEventListener('click', () => {
        applyLanguage(state.lang === 'ar' ? 'en' : 'ar');
    });

    function applyTheme(theme) {
        state.theme = theme;
        localStorage.setItem('focus_theme', theme);
        el.html.setAttribute('data-theme', theme);
        
        const icon = el.themeToggleBtn.querySelector('i');
        if (theme === 'serene-dark') {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    }

    function toggleThemeWithAnimation(event) {
        const nextTheme = state.theme === 'serene-light' ? 'serene-dark' : 'serene-light';
        const isDark = nextTheme === 'serene-dark';
        
        // 1. Icon Rotation Animation
        const icon = el.themeToggleBtn.querySelector('i');
        icon.classList.remove('theme-icon-active');
        void icon.offsetWidth; // trigger reflow
        icon.classList.add('theme-icon-active');
        setTimeout(() => icon.classList.remove('theme-icon-active'), 600);

        // 2. Button Coordinates for Ripple Origin
        const rect = el.themeToggleBtn.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const maxRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        // 3. Modern View Transitions API with Circular Clip-Path
        if (document.startViewTransition) {
            const transition = document.startViewTransition(() => {
                applyTheme(nextTheme);
            });

            transition.ready.then(() => {
                document.documentElement.animate(
                    {
                        clipPath: [
                            `circle(0px at ${x}px ${y}px)`,
                            `circle(${maxRadius}px at ${x}px ${y}px)`
                        ]
                    },
                    {
                        duration: 520,
                        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                        pseudoElement: '::view-transition-new(root)'
                    }
                );
            });
        } else {
            // 4. Graceful Fallback: Expanding Ripple Wave Overlay + Smooth Transition Class
            document.documentElement.classList.add('theme-transitioning');
            
            let overlay = document.querySelector('.theme-ripple-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'theme-ripple-overlay';
                document.body.appendChild(overlay);
            }

            const circle = document.createElement('div');
            circle.className = `theme-ripple-circle ${isDark ? 'light-to-dark' : 'dark-to-light'}`;
            circle.style.left = `${x}px`;
            circle.style.top = `${y}px`;
            circle.style.width = `${maxRadius * 2.2}px`;
            circle.style.height = `${maxRadius * 2.2}px`;
            overlay.appendChild(circle);

            requestAnimationFrame(() => {
                circle.classList.add('expand');
                applyTheme(nextTheme);
            });

            setTimeout(() => {
                circle.remove();
                document.documentElement.classList.remove('theme-transitioning');
            }, 650);
        }
    }

    el.themeToggleBtn.addEventListener('click', toggleThemeWithAnimation);

    // =========================================================================
    // 6. HOME VIEW: NEXT TASK REMINDER & DAILY MOTIVATION
    // =========================================================================
    function updateHomeNextTaskCard() {
        const uncompleted = state.todoTasks.filter(t => !t.done);
        el.homeTodoStats.textContent = `${uncompleted.length} ${state.lang === 'ar' ? 'مهام متبقية' : 'tasks remaining'}`;

        if (uncompleted.length > 0) {
            const nextTask = uncompleted[0];
            el.nextTaskTitle.textContent = nextTask.text;
            el.nextTaskSubtitle.textContent = nextTask.milestoneTitle 
                ? `${state.lang === 'ar' ? 'مرحلة:' : 'Milestone:'} ${nextTask.milestoneTitle}`
                : (state.lang === 'ar' ? 'ابدأ بهذه المهمة الآن لكسر الشلل التنفيذي!' : 'Start this step now to break executive paralysis!');
            
            el.nextTaskCheckBtn.classList.remove('hidden');
            el.nextTaskCheckBtn.onclick = () => {
                nextTask.done = true;
                saveTodoTasks();
                addScore(10);
                updateHomeNextTaskCard();
            };
        } else {
            el.nextTaskTitle.textContent = state.lang === 'ar' ? 'لا توجد مهام معلقة في قائمتك!' : 'No pending tasks in your To-Do list!';
            el.nextTaskSubtitle.textContent = state.lang === 'ar' ? 'أحسنت! فكك مشروعاً أو مهمة جديدة للحفاظ على الزخم.' : 'Awesome! Decompose a new task to maintain momentum.';
            el.nextTaskCheckBtn.classList.add('hidden');
        }

        // Randomize quote
        const qIdx = Math.floor(Math.random() * motivationalQuotes.length);
        el.dailyMotivationQuote.textContent = motivationalQuotes[qIdx];
    }

    // =========================================================================
    // 7. DEDICATED TO-DO LIST VIEW
    // =========================================================================
    function renderTodoList() {
        el.todoItemsList.innerHTML = '';
        const total = state.todoTasks.length;
        const completedCount = state.todoTasks.filter(t => t.done).length;
        const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

        el.todoProgressText.textContent = `${completedCount}/${total} (${pct}%) ${state.lang === 'ar' ? 'منجز' : 'completed'}`;
        el.todoProgressBarFill.style.width = `${pct}%`;

        if (total === 0) {
            const emptyBox = document.createElement('div');
            emptyBox.className = 'empty-todo-state';
            emptyBox.innerHTML = `
                <i class="fa-solid fa-clipboard-list"></i>
                <p>${state.lang === 'ar' ? 'لا توجد مهام مسجلة حالياً. فكك مهمة جديدة لتحويلها لخطوات فورية!' : 'No tasks registered yet. Decompose a project into actionable steps!'}</p>
                <button class="btn-secondary-sm" id="emptyGoDecomposeBtn">
                    <i class="fa-solid fa-layer-group"></i> ${state.lang === 'ar' ? 'تفكيك مهمة الآن' : 'Decompose Task Now'}
                </button>
            `;
            el.todoItemsList.appendChild(emptyBox);
            document.getElementById('emptyGoDecomposeBtn').addEventListener('click', () => switchView('milestones'));
            return;
        }

        // Create Active / Completed containers
        const activeHeader = document.createElement('div');
        activeHeader.className = 'todo-section-header';
        activeHeader.innerHTML = `<h3>${state.lang === 'ar' ? 'المهام النشطة' : 'Active Tasks'}</h3>`;

        const activeContainer = document.createElement('div');
        activeContainer.id = 'todo-active-list';
        activeContainer.className = 'todo-section-list';

        // Completed section and header with Clear Completed button
        const completedHeader = document.createElement('div');
        completedHeader.className = 'todo-section-header completed-header';
        completedHeader.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
                <h3 style="margin:0;">${state.lang === 'ar' ? 'المهام المكتملة' : 'Completed Tasks'}</h3>
                <button type="button" id="clearCompletedBtn" class="btn-secondary-sm" ${completedCount === 0 ? 'disabled' : ''} aria-hidden="${completedCount === 0}">
                    <i class="fa-solid fa-broom"></i>
                    <span>${state.lang === 'ar' ? 'مسح المهام المكتملة' : 'Clear Completed'}</span>
                </button>
            </div>
        `;

        const completedContainer = document.createElement('div');
        completedContainer.id = 'todo-completed-list';
        completedContainer.className = 'todo-section-list completed-list';

        // Append headers and containers to list
        el.todoItemsList.appendChild(activeHeader);
        el.todoItemsList.appendChild(activeContainer);
        el.todoItemsList.appendChild(completedHeader);
        el.todoItemsList.appendChild(completedContainer);

        // Helper to create row
        function createRow(task) {
            const row = document.createElement('div');
            row.className = `todo-item-row ${task.done ? 'completed' : ''}`;
            row.innerHTML = `
                <div class="todo-check" aria-label="${state.lang === 'ar' ? 'تحديد كمكتملة' : 'Toggle complete'}"><i class="fa-solid fa-check"></i></div>
                <div style="flex:1;">
                    ${task.milestoneTitle ? `<div style="font-size:0.75rem; color:var(--primary); font-weight:700;">${task.milestoneTitle}</div>` : ''}
                    <div class="todo-text">${task.text}</div>
                    ${task.dueDate ? `<div style="font-size:0.7rem; color:var(--muted); margin-top:6px;">${state.lang === 'ar' ? 'تاريخ الاستحقاق:' : 'Due:'} ${task.dueDate}</div>` : ''}
                </div>
                <div class="todo-actions">
                    <button type="button" class="todo-action-btn todo-edit-btn" data-task-id="${task.id}" aria-label="${state.lang === 'ar' ? 'تعديل المهمة' : 'Edit task'}">
                        <i class="fa-solid fa-pen"></i>
                        <span>${state.lang === 'ar' ? 'تعديل' : 'Edit'}</span>
                    </button>
                    <button type="button" class="todo-action-btn todo-delete-btn" data-task-id="${task.id}" aria-label="${state.lang === 'ar' ? 'حذف المهمة' : 'Delete task'}">
                        <i class="fa-solid fa-trash"></i>
                        <span>${state.lang === 'ar' ? 'حذف' : 'Delete'}</span>
                    </button>
                </div>
            `;

            const checkBox = row.querySelector('.todo-check');
            checkBox.addEventListener('click', (event) => {
                event.stopPropagation();
                task.done = !task.done;
                // Optionally notify backend about completion change (non-blocking)
                try {
                    fetch(`/api/todos/${encodeURIComponent(task.id)}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ done: task.done })
                    }).catch(() => {});
                } catch (e) {}

                saveTodoTasks(state.todoTasks);
                renderTodoList();
                updateHomeNextTaskCard();
                if (task.done) addScore(10);
            });

            row.querySelector('.todo-edit-btn').addEventListener('click', (event) => {
                event.stopPropagation();
                const nextText = prompt(state.lang === 'ar' ? 'تعديل المهمة:' : 'Edit task:', task.text);
                if (nextText === null) return;
                updateTodoTask(task.id, nextText);
            });

            row.querySelector('.todo-delete-btn').addEventListener('click', (event) => {
                event.stopPropagation();
                const shouldDelete = confirm(state.lang === 'ar' ? 'هل تريد حذف هذه المهمة؟' : 'Delete this task?');
                if (shouldDelete) removeTodoTask(task.id);
            });

            row.addEventListener('click', (event) => {
                if (event.target.closest('button')) return;
                task.done = !task.done;
                saveTodoTasks(state.todoTasks);
                renderTodoList();
                updateHomeNextTaskCard();
                if (task.done) addScore(10);
            });

            return row;
        }

        // Render active tasks (newest-first)
        const activeTasks = state.todoTasks.filter(t => !t.done);
        activeTasks.forEach(task => {
            const r = createRow(task);
            activeContainer.appendChild(r);
        });

        // Render completed tasks
        const completedTasks = state.todoTasks.filter(t => t.done);
        completedTasks.forEach(task => {
            const r = createRow(task);
            completedContainer.appendChild(r);
        });

        // Clear Completed handler
        const clearBtn = document.getElementById('clearCompletedBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', async () => {
                if (!confirm(state.lang === 'ar' ? 'هل تريد حذف جميع المهام المكتملة نهائياً؟' : 'Remove all completed tasks permanently?')) return;
                // Animate existing completed rows
                const rows = completedContainer.querySelectorAll('.todo-item-row');
                rows.forEach(r => {
                    r.style.transition = 'opacity 220ms ease, transform 220ms ease';
                    r.style.opacity = '0';
                    r.style.transform = 'translateY(6px)';
                });

                // Try backend bulk delete first (non-blocking). If fails, fall back to client-only remove.
                let backendOk = false;
                try {
                    const res = await fetch('/api/todos/completed', { method: 'DELETE' });
                    if (res.ok) backendOk = true;
                } catch (e) { /* ignore */ }

                setTimeout(() => {
                    // Remove completed tasks from state and re-render
                    state.todoTasks = state.todoTasks.filter(t => !t.done);
                    saveTodoTasks(state.todoTasks);
                    renderTodoList();
                    updateHomeNextTaskCard();
                    showToast(state.lang === 'ar' ? 'تم حذف المهام المكتملة.' : 'Completed tasks removed.');
                }, 260);
            });
        }
    }

    el.quickAddTodoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = el.quickTodoInput.value.trim();
        if (!text) {
            alert(state.lang === 'ar' ? 'الرجاء كتابة عنوان المهمة.' : 'Please enter a task title.');
            return;
        }

        addTodoTask({
            id: 'task_' + Date.now(),
            text,
            milestoneTitle: state.lang === 'ar' ? 'مهمة سريعة' : 'Quick Task',
            done: false,
            owner: {
                id: state.user ? `${state.user.name || 'guest'}-${state.user.age || ''}` : 'guest',
                name: state.user ? state.user.name : 'guest'
            }
        }, { allowDuplicate: false });
        el.quickTodoInput.value = '';
    });

    // =========================================================================
    // 8. TASK MILESTONES DECOMPOSER
    // =========================================================================
    el.tabTextMode.addEventListener('click', () => {
        el.tabTextMode.classList.add('active');
        el.tabFileMode.classList.remove('active');
        el.textInputArea.classList.remove('hidden');
        el.fileInputArea.classList.add('hidden');
    });

    el.tabFileMode.addEventListener('click', () => {
        el.tabFileMode.classList.add('active');
        el.tabTextMode.classList.remove('active');
        el.fileInputArea.classList.remove('hidden');
        el.textInputArea.classList.add('hidden');
    });

    el.fileDropzone.addEventListener('click', () => el.milestoneFileInput.click());
    
    el.fileDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        el.fileDropzone.style.borderColor = 'var(--primary)';
    });

    el.fileDropzone.addEventListener('dragleave', () => {
        el.fileDropzone.style.borderColor = 'var(--border-hover)';
    });

    el.fileDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        el.fileDropzone.style.borderColor = 'var(--border-hover)';
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    });

    el.milestoneFileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    });

    function handleFileSelect(file) {
        state.selectedFile = file;
        el.selectedFileName.classList.remove('hidden');
        el.selectedFileName.innerHTML = `<i class="fa-solid fa-file"></i> ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
    }

    el.decomposeTaskBtn.addEventListener('click', async () => {
        const isFileMode = el.tabFileMode.classList.contains('active');
        let formData = new FormData();

        if (isFileMode) {
            if (!state.selectedFile) {
                alert(state.lang === 'ar' ? 'الرجاء اختيار أو إفلات ملف أولاً.' : 'Please select a file first.');
                return;
            }
            formData.append('file', state.selectedFile);
        } else {
            const textVal = el.milestoneTaskText.value.trim();
            if (!textVal) {
                alert(state.lang === 'ar' ? 'الرجاء كتابة المهمة أولاً.' : 'Please enter your task first.');
                return;
            }
            formData.append('task_text', textVal);
        }

        el.decomposeTaskBtn.disabled = true;
        el.decomposeSpinner.classList.remove('hidden');

        try {
            const res = await fetch('/api/decompose_task', {
                method: 'POST',
                body: formData
            });
            const json = await res.json();

            if (json.status === 'success' && json.data) {
                state.milestonesData = json.data;
                renderMilestones(json.data);
            } else {
                alert('حدث خطأ: ' + (json.message || 'خطأ في معالجة المهمة'));
            }
        } catch (e) {
            console.error('Decomposition error:', e);
            alert('تعذر الاتصال بالخادم.');
        } finally {
            el.decomposeTaskBtn.disabled = false;
            el.decomposeSpinner.classList.add('hidden');
        }
    });

    function renderMilestones(data) {
        el.milestonesResultArea.classList.remove('hidden');

        el.milestoneTaskSummaryTitle.textContent = `خطة: ${data.task_summary}`;
        el.milestoneAdviceSummaryText.textContent = data.advice_summary;
        el.milestoneTotalTime.textContent = data.total_estimated_time;

        const allTasks = [];
        data.milestones.forEach(m => {
            m.subtasks.forEach(st => {
                const taskText = normalizeTodoText(st.text);
                const taskId = `${normalizeTodoText(m.title)}::${taskText}`.toLowerCase();
                allTasks.push({
                    id: taskId,
                    text: taskText,
                    milestoneTitle: normalizeTodoText(m.title),
                    done: false,
                    owner: {
                        id: state.user ? `${state.user.name || 'guest'}-${state.user.age || ''}` : 'guest',
                        name: state.user ? state.user.name : 'guest'
                    }
                });
            });
        });

        state.milestoneSelection = state.milestoneSelection || new Set();
        const validSelection = new Set();
        allTasks.forEach(task => {
            if (state.milestoneSelection.has(task.id)) {
                validSelection.add(task.id);
            }
        });
        state.milestoneSelection = validSelection;

        const selectionBar = document.createElement('div');
        selectionBar.className = 'milestone-selection-bar';
        selectionBar.innerHTML = `
            <label class="select-all-toggle">
                <input type="checkbox" data-role="select-all-toggle" ${allTasks.length > 0 && validSelection.size === allTasks.length ? 'checked' : ''}>
                <span>${state.lang === 'ar' ? 'تحديد الكل' : 'Select All'}</span>
            </label>
            <button type="button" class="btn-selection-add" data-role="add-selected-btn" ${validSelection.size === 0 ? 'disabled' : ''}>
                <i class="fa-solid fa-square-plus"></i>
                <span>${state.lang === 'ar' ? 'إضافة المحدد' : 'Add Selected'}</span>
            </button>
        `;

        const selectAllToggle = selectionBar.querySelector('[data-role="select-all-toggle"]');
        const addSelectedBtn = selectionBar.querySelector('[data-role="add-selected-btn"]');

        selectAllToggle.addEventListener('change', () => {
            if (selectAllToggle.checked) {
                state.milestoneSelection = new Set(allTasks.map(task => task.id));
            } else {
                state.milestoneSelection.clear();
            }
            renderMilestones(data);
        });

        addSelectedBtn.addEventListener('click', () => {
            const selectedTasks = allTasks.filter(task => state.milestoneSelection.has(task.id));
            if (!selectedTasks.length) {
                addSelectedBtn.disabled = true;
                return;
            }

            let addedCount = 0;
            selectedTasks.forEach(task => {
                const duplicate = state.todoTasks.some(existing =>
                    normalizeTodoText(existing.text || existing.title || '').toLowerCase() === task.text.toLowerCase()
                );
                if (duplicate) return;

                state.todoTasks.push({
                    id: 'm_task_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
                    text: task.text,
                    milestoneTitle: task.milestoneTitle,
                    done: false,
                    owner: task.owner,
                    source: 'milestone'
                });
                addedCount += 1;
            });

            saveTodoTasks(state.todoTasks);
            renderTodoList();
            updateHomeNextTaskCard();
            state.milestoneSelection.clear();
            renderMilestones(data);

            if (addedCount === 0) {
                alert(state.lang === 'ar' ? 'جميع المهام المحددة موجودة بالفعل في قائمة To-Do.' : 'All selected tasks are already in your To-Do list.');
            }
        });

        el.milestonesGrid.innerHTML = '';
        el.milestonesGrid.appendChild(selectionBar);

        data.milestones.forEach(m => {
            const card = document.createElement('div');
            card.className = 'milestone-card';

            const subtasksHtml = m.subtasks.map(st => {
                const taskText = normalizeTodoText(st.text);
                const taskId = `${normalizeTodoText(m.title)}::${taskText}`.toLowerCase();
                const checked = state.milestoneSelection.has(taskId) ? 'checked' : '';
                return `
                    <div class="m-subtask-item">
                        <label class="m-task-selector" title="${state.lang === 'ar' ? 'تحديد المهمة' : 'Select task'}">
                            <input type="checkbox" class="m-task-check" data-task-id="${taskId}" ${checked}>
                        </label>
                        <div class="m-subtask-copy">
                            <i class="fa-solid fa-circle-check"></i>
                            <span>${st.text}</span>
                        </div>
                        <button type="button" class="add-to-todo-btn" data-task-text="${taskText}" data-milestone-title="${m.title}">
                            <i class="fa-solid fa-square-plus"></i>
                            <span>${state.lang === 'ar' ? 'إضافة إلى My To-Do' : 'Add to My To-Do'}</span>
                        </button>
                    </div>
                `;
            }).join('');

            card.innerHTML = `
                <div class="m-card-header">
                    <span class="m-title">${m.title}</span>
                    <span class="m-time-pill"><i class="fa-regular fa-clock"></i> ${m.est_time}</span>
                </div>
                <div class="m-subtasks">${subtasksHtml}</div>
                <div class="m-rag-tip">${m.rag_recommendation}</div>
            `;
            el.milestonesGrid.appendChild(card);
        });

        el.milestonesGrid.querySelectorAll('.m-task-check').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const taskId = checkbox.getAttribute('data-task-id');
                if (checkbox.checked) {
                    state.milestoneSelection.add(taskId);
                } else {
                    state.milestoneSelection.delete(taskId);
                }

                const total = el.milestonesGrid.querySelectorAll('.m-task-check').length;
                const selectedCount = el.milestonesGrid.querySelectorAll('.m-task-check:checked').length;
                const selectAll = el.milestonesGrid.querySelector('[data-role="select-all-toggle"]');
                if (selectAll) {
                    selectAll.checked = total > 0 && selectedCount === total;
                }
                const addSelectedBtn = el.milestonesGrid.querySelector('[data-role="add-selected-btn"]');
                if (addSelectedBtn) {
                    addSelectedBtn.disabled = selectedCount === 0;
                }
            });
        });

        el.milestonesGrid.querySelectorAll('.add-to-todo-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const taskText = normalizeTodoText(button.getAttribute('data-task-text'));
                const milestoneTitle = normalizeTodoText(button.getAttribute('data-milestone-title'));
                if (!taskText) {
                    alert(state.lang === 'ar' ? 'عنوان المهمة غير صالح.' : 'Task title is invalid.');
                    return;
                }

                const added = addTodoTask({
                    id: 'm_task_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
                    text: taskText,
                    milestoneTitle,
                    done: false,
                    owner: {
                        id: state.user ? `${state.user.name || 'guest'}-${state.user.age || ''}` : 'guest',
                        name: state.user ? state.user.name : 'guest'
                    },
                    source: 'milestone'
                });

                // If task was added successfully, remove the row from DOM smoothly
                if (added) {
                    const row = button.closest('.m-subtask-item');
                    if (row) {
                        // animate collapse
                        row.style.transition = 'all 300ms ease';
                        row.style.opacity = '0';
                        row.style.maxHeight = row.scrollHeight + 'px';
                        // force layout
                        void row.offsetHeight;
                        row.style.maxHeight = '0px';
                        row.style.overflow = 'hidden';

                        setTimeout(() => {
                            const card = row.closest('.milestone-card');
                            row.remove();

                            // if milestone has no more tasks, remove the whole card
                            if (card && card.querySelectorAll('.m-subtask-item').length === 0) {
                                card.style.transition = 'all 300ms ease';
                                card.style.opacity = '0';
                                card.style.maxHeight = card.scrollHeight + 'px';
                                void card.offsetHeight;
                                card.style.maxHeight = '0px';
                                setTimeout(() => card.remove(), 320);
                            }
                        }, 300);

                        // Remove from selection state if present
                        const idKey = `${milestoneTitle}::${taskText}`.toLowerCase();
                        if (state.milestoneSelection) state.milestoneSelection.delete(idKey);
                    }

                    // Update UI state
                    saveTodoTasks(state.todoTasks);
                    renderTodoList();
                    updateHomeNextTaskCard();
                }
            });
        });

        el.milestonesResultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Convert Milestones to To-Do List & Navigate to To-Do View
    el.approveMilestonesBtn.addEventListener('click', () => {
        // Add All Tasks handler: if user didn't select any individual tasks, add all generated tasks
        if (!state.milestonesData) return;

        const allTasks = [];
        state.milestonesData.milestones.forEach(m => {
            m.subtasks.forEach(st => {
                const taskText = normalizeTodoText(st.text);
                if (!taskText) return;
                allTasks.push({
                    text: taskText,
                    milestoneTitle: normalizeTodoText(m.title),
                    owner: {
                        id: state.user ? `${state.user.name || 'guest'}-${state.user.age || ''}` : 'guest',
                        name: state.user ? state.user.name : 'guest'
                    },
                    source: 'milestone'
                });
            });
        });

        // If there are selected tasks from the selection UI, respect that and only add those.
        const selectedIds = state.milestoneSelection && state.milestoneSelection.size > 0 ? new Set(state.milestoneSelection) : null;
        const tasksToAdd = [];

        if (selectedIds) {
            // Add only selected
            allTasks.forEach(t => {
                const idKey = `${t.milestoneTitle}::${t.text}`.toLowerCase();
                if (selectedIds.has(idKey)) tasksToAdd.push(t);
            });
        } else {
            // No selection -> add all
            tasksToAdd.push(...allTasks);
        }

        if (!tasksToAdd.length) {
            // No tasks to add (all duplicates or none) -> show info and navigate to To-Do
            showToast(state.lang === 'ar' ? 'لا توجد مهام جديدة للإضافة.' : 'No new tasks to add.');
            switchView('todolist');
            return;
        }

        // Add tasks while preventing duplicates
        let added = 0;
        tasksToAdd.forEach(t => {
            const duplicate = state.todoTasks.some(existing => normalizeTodoText(existing.text || existing.title || '').toLowerCase() === t.text.toLowerCase());
            if (duplicate) return;
            addTodoTask({
                id: 'm_task_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
                text: t.text,
                milestoneTitle: t.milestoneTitle,
                done: false,
                owner: t.owner,
                source: t.source
            }, { allowDuplicate: false });
            added += 1;
        });

        if (added > 0) {
            showToast(state.lang === 'ar' ? `تمت إضافة ${added} مهمة إلى قائمة To-Do.` : `Added ${added} tasks to your To-Do list.`);
        } else {
            showToast(state.lang === 'ar' ? 'لا توجد مهام جديدة (كلها موجودة مسبقاً).' : 'No new tasks (all already exist).');
        }

        // Clear selection and update UI
        state.milestoneSelection && state.milestoneSelection.clear();
        saveTodoTasks(state.todoTasks);
        renderTodoList();
        updateHomeNextTaskCard();
        switchView('todolist');
    });

    function showToast(msg, timeout = 2200) {
        try {
            let t = document.createElement('div');
            t.className = 'mini-toast';
            t.textContent = msg;
            document.body.appendChild(t);
            requestAnimationFrame(() => { t.classList.add('visible'); });
            setTimeout(() => { t.classList.remove('visible'); setTimeout(() => t.remove(), 300); }, timeout);
        } catch (e) { console.warn('Toast error', e); alert(msg); }
    }

    // Create a Cancel Plan button next to the Approve button (if not present)
    (function ensureCancelPlanButton() {
        try {
            if (!document.getElementById('cancelPlanBtn') && el.approveMilestonesBtn && el.approveMilestonesBtn.parentNode) {
                const cancelBtn = document.createElement('button');
                cancelBtn.id = 'cancelPlanBtn';
                // Reuse primary button geometry and override colors with a refined danger-outline style
                cancelBtn.className = 'btn-approve-lg btn-cancel-refined';
                cancelBtn.type = 'button';
                cancelBtn.innerHTML = `<i class="fa-solid fa-trash"></i> <span>${state.lang === 'ar' ? 'إلغاء الخطة / تفريغ' : 'Cancel Plan'}</span>`;

                el.approveMilestonesBtn.parentNode.insertBefore(cancelBtn, el.approveMilestonesBtn.nextSibling);

                cancelBtn.addEventListener('click', () => {
                    const confirmMsg = state.lang === 'ar' ? 'هل أنت تأكد من إلغاء هذه الخطة؟' : 'Are you sure you want to cancel this plan?';
                    if (!confirm(confirmMsg)) return;

                    // Clear generated view & reset inputs
                    state.milestonesData = null;
                    if (state.milestoneSelection) state.milestoneSelection.clear();
                    el.milestonesResultArea.classList.add('hidden');
                    if (el.milestonesGrid) el.milestonesGrid.innerHTML = '';

                    // Reset inputs
                    if (el.milestoneTaskText) el.milestoneTaskText.value = '';
                    if (el.selectedFileName) el.selectedFileName.classList.add('hidden');
                    if (el.milestoneFileInput) el.milestoneFileInput.value = '';
                    state.selectedFile = null;

                    showToast(state.lang === 'ar' ? 'تم إلغاء الخطة.' : 'Plan cancelled.');
                });
            }
        } catch (e) {
            console.warn('Could not create cancel button', e);
        }
    })();

    // =========================================================================
    // 9. ADHD ASSESSMENT 3-GAME ENGINE
    // =========================================================================
    function updateStepper(stepIndex) {
        el.stepNodes.forEach((node, idx) => {
            node.classList.toggle('active', idx === stepIndex);
            node.classList.toggle('done', idx < stepIndex);
        });
        el.stepLines.forEach((line, idx) => {
            line.classList.toggle('done', idx < stepIndex);
        });
    }

    function resetGameTo(screenIdx) {
        el.gameIntroScreen.classList.add('hidden');
        el.game1Screen.classList.add('hidden');
        el.game2Screen.classList.add('hidden');
        el.game3Screen.classList.add('hidden');
        el.assessmentResultScreen.classList.add('hidden');

        if (screenIdx === 0) {
            el.gameIntroScreen.classList.remove('hidden');
            updateStepper(0);
        } else if (screenIdx === 1) {
            el.game1Screen.classList.remove('hidden');
            updateStepper(0);
            startMemoryGame1();
        } else if (screenIdx === 2) {
            el.game2Screen.classList.remove('hidden');
            updateStepper(1);
            startAttentionGame2();
        } else if (screenIdx === 3) {
            el.game3Screen.classList.remove('hidden');
            updateStepper(2);
            setupRecallGame3();
        } else if (screenIdx === 4) {
            el.assessmentResultScreen.classList.remove('hidden');
            updateStepper(3);
            renderAssessmentReport();
        }
    }

    el.startGameBtn.addEventListener('click', () => resetGameTo(1));
    el.goHomeAfterAssessmentBtn.addEventListener('click', () => switchView('welcome'));

    // Game 1
    function startMemoryGame1() {
        state.game.targetDigits = [];
        for (let i = 0; i < 7; i++) {
            state.game.targetDigits.push(Math.floor(Math.random() * 9) + 1);
        }

        el.game1NumberDisplay.textContent = state.game.targetDigits.join(' - ');
        el.game1Progress.style.width = '100%';

        if (state.game.game1Interval) clearInterval(state.game.game1Interval);

        const startTime = Date.now();
        const durationMs = 10000;

        state.game.game1Interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, durationMs - elapsed);
            const remainingSecs = Math.ceil(remaining / 1000);
            
            el.game1TimerText.textContent = remainingSecs;
            const pct = (remaining / durationMs) * 100;
            el.game1Progress.style.width = `${pct}%`;

            if (remaining <= 0) {
                clearInterval(state.game.game1Interval);
                resetGameTo(2);
            }
        }, 100);
    }

    // Game 2: Fast 20-Trial CPT
    function startAttentionGame2() {
        const nonXLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'W'];
        const trials = [];

        // Build 20 trials with 6 target 'X' letters (~30% frequency)
        for (let i = 0; i < 20; i++) {
            if (Math.random() < 0.3 || (i > 15 && trials.filter(t => t === 'X').length < 5)) {
                trials.push('X');
            } else {
                trials.push(nonXLetters[Math.floor(Math.random() * nonXLetters.length)]);
            }
        }
        while (trials.filter(t => t === 'X').length < 6) {
            trials[Math.floor(Math.random() * 20)] = 'X';
        }

        state.game.cptTrials = trials;
        state.game.currentTrialIdx = 0;
        state.game.cptHits = 0;
        state.game.cptMisses = 0;
        state.game.cptFalsePresses = 0;

        updateCptStatsUI();
        runNextCptTrial();
    }

    function updateCptStatsUI() {
        el.game2TrialCount.textContent = state.game.currentTrialIdx;
        el.game2HitsCount.textContent = state.game.cptHits;
        el.game2MissesCount.textContent = state.game.cptMisses;
        el.game2FalseCount.textContent = state.game.cptFalsePresses;
    }

    function handleSpacePress() {
        if (state.currentView !== 'assessment' || el.game2Screen.classList.contains('hidden')) return;
        if (state.game.respondedInTrial) return;

        state.game.respondedInTrial = true;
        const currentLetter = state.game.cptTrials[state.game.currentTrialIdx - 1];

        el.game2SpaceBtn.classList.add('pressed');
        setTimeout(() => el.game2SpaceBtn.classList.remove('pressed'), 120);

        if (currentLetter === 'X') {
            state.game.cptHits += 1;
            try { el.gameCorrectBeep.play().catch(() => {}); } catch(e){}
            el.game2LetterDisplay.style.color = '#16a34a';
        } else {
            state.game.cptFalsePresses += 1;
            el.game2LetterDisplay.style.color = '#dc2626';
        }

        updateCptStatsUI();
    }

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && state.currentView === 'assessment' && !el.game2Screen.classList.contains('hidden')) {
            e.preventDefault();
            handleSpacePress();
        }
    });

    el.game2SpaceBtn.addEventListener('click', handleSpacePress);

    function runNextCptTrial() {
        if (state.game.currentTrialIdx >= 20) {
            resetGameTo(3);
            return;
        }

        state.game.currentTrialIdx += 1;
        state.game.respondedInTrial = false;
        const letter = state.game.cptTrials[state.game.currentTrialIdx - 1];

        el.game2LetterDisplay.textContent = letter;
        el.game2LetterDisplay.style.color = 'var(--text-main)';
        updateCptStatsUI();

        // Fast CPT: 700ms letter display + 80ms inter-trial gap
        state.game.trialInterval = setTimeout(() => {
            if (letter === 'X' && !state.game.respondedInTrial) {
                state.game.cptMisses += 1;
                updateCptStatsUI();
            }
            el.game2LetterDisplay.textContent = '';
            setTimeout(runNextCptTrial, 80);
        }, 700);
    }

    // Game 3
    function setupRecallGame3() {
        el.digitInputs.forEach((input, idx) => {
            input.value = '';
            input.oninput = () => {
                input.value = input.value.replace(/[^0-9]/g, '');
                if (input.value && idx < el.digitInputs.length - 1) {
                    el.digitInputs[idx + 1].focus();
                }
            };
            input.onkeydown = (e) => {
                if (e.key === 'Backspace' && !input.value && idx > 0) {
                    el.digitInputs[idx - 1].focus();
                }
            };
        });
        setTimeout(() => el.digitInputs[0].focus(), 200);
    }

    el.game3RecallForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const entered = Array.from(el.digitInputs).map(inp => inp.value.trim()).join('');
        if (entered.length < 7) {
            alert(state.lang === 'ar' ? 'الرجاء إدخال الـ 7 أرقام كاملة.' : 'Please enter all 7 digits.');
            return;
        }

        const targetStr = state.game.targetDigits.join('');
        let correctCount = 0;
        for (let i = 0; i < 7; i++) {
            if (entered[i] === targetStr[i]) correctCount++;
        }

        let g3_pts = correctCount === 7 ? 3 : (correctCount >= 5 ? 2 : (correctCount >= 3 ? 1 : 0));
        state.game.scores.g1_score = g3_pts;
        state.game.scores.g3_score = g3_pts;

        const misses = state.game.cptMisses;
        state.game.scores.g2_om_score = misses <= 0 ? 3 : (misses <= 1 ? 2 : (misses <= 2 ? 1 : 0));

        const falsePresses = state.game.cptFalsePresses;
        state.game.scores.g2_com_score = falsePresses <= 0 ? 3 : (falsePresses <= 1 ? 2 : (falsePresses <= 2 ? 1 : 0));

        const memoryTotal = state.game.scores.g1_score + state.game.scores.g3_score;
        let type = 'Likely No ADHD';
        let confidence = 'High';

        if (state.game.scores.g2_om_score <= 1 && state.game.scores.g2_com_score <= 1 && memoryTotal <= 4) {
            type = 'Combined (ADHD-C)';
        } else if (state.game.scores.g2_om_score <= 1 && state.game.scores.g2_com_score >= 2 && memoryTotal <= 4) {
            type = 'Predominantly Inattentive (ADHD-I)';
        } else if (state.game.scores.g2_om_score >= 2 && state.game.scores.g2_com_score <= 1 && memoryTotal >= 4) {
            type = 'Predominantly Hyperactive-Impulsive (ADHD-HI)';
        } else if (state.game.scores.g2_om_score >= 2 && state.game.scores.g2_com_score >= 2 && memoryTotal >= 5) {
            type = 'Likely No ADHD';
        } else {
            type = state.game.scores.g2_om_score < state.game.scores.g2_com_score ? 'Predominantly Inattentive (ADHD-I)' : 'Combined (ADHD-C)';
            confidence = 'Moderate';
        }

        state.game.scores.adhdType = type;
        state.game.scores.confidence = confidence;
        state.adhdTypeResult = type;
        localStorage.setItem('focus_adhd_result', type);

        addScore(50);
        resetGameTo(4);
        updateUserLevelAndScore();
    });

    function renderAssessmentReport() {
        const s = state.game.scores;
        const isAr = state.lang === 'ar';

        el.resG1Score.textContent = `${s.g1_score}/3`;
        el.resG2OmScore.textContent = `${s.g2_om_score}/3 (${state.game.cptMisses} Misses)`;
        el.resG2ComScore.textContent = `${s.g2_com_score}/3 (${state.game.cptFalsePresses} False)`;
        el.resG3Score.textContent = `${s.g3_score}/3`;

        el.resG1Interp.textContent = s.g1_score >= 2 ? (isAr ? 'سعة ذاكرة عاملة سليمة' : 'Intact working memory') : (isAr ? 'قصور في الذاكرة الأولية' : 'Working memory deficit');
        el.resG2OmInterp.textContent = s.g2_om_score >= 2 ? (isAr ? 'انتباه مستمر جيد' : 'Sustained attention intact') : (isAr ? 'تشتت انتباه ملحوظ' : 'Inattention present');
        el.resG2ComInterp.textContent = s.g2_com_score >= 2 ? (isAr ? 'تحكم جيد في الاندفاع' : 'Good impulse control') : (isAr ? 'اندفاعية واستجابة متسرعة' : 'Elevated impulsivity');
        el.resG3Interp.textContent = s.g3_score >= 2 ? (isAr ? 'ثبات الذاكرة تحت التشتيت' : 'Encoding stable under distraction') : (isAr ? 'تأثر الذاكرة بالمشتتات' : 'Memory disrupted by distraction');

        el.resultTypeBadge.textContent = s.adhdType;
        el.resultConfidenceLevel.textContent = isAr ? (s.confidence === 'High' ? 'مرتفع (High)' : 'متوسط (Moderate)') : s.confidence;

        if (s.adhdType.includes('Inattentive')) {
            el.resultTypeHeading.textContent = isAr ? 'نمط تشتت الانتباه الغالب (ADHD-I)' : 'Predominantly Inattentive Type (ADHD-I)';
            el.resultTypeDescription.textContent = isAr 
                ? 'أظهرت النتائج صعوبة في الحفاظ على الانتباه المستمر مع ضعف في تشفير الذاكرة تحت المشتتات، وهو النمط الأكثر ارتباطاً بالشلل التنفيذي والتسويف.'
                : 'Difficulty sustaining attention and working memory load impact. Associated with executive dysfunction and procrastination.';
            el.resultRecommendationText.textContent = isAr
                ? 'نوصي بالتركيز على استراتيجيات بروتوكول هارفارد CBT (نظام الدفتر الموحد، تفكيك المهام إلى 15 دقيقة، وتأخير المشتتات) بالإضافة إلى تقليل المثيرات البيئية وفق NICE NG87.'
                : 'Focus on Harvard CBT (single notebook, 15-min task chunking, distraction delay) and environmental modifications per NICE NG87.';
        } else if (s.adhdType.includes('Hyperactive')) {
            el.resultTypeHeading.textContent = isAr ? 'نمط فرط الحركة والاندفاعية الغالب (ADHD-HI)' : 'Predominantly Hyperactive-Impulsive Type (ADHD-HI)';
            el.resultTypeDescription.textContent = isAr
                ? 'أظهرت النتائج ميلاً للاستجابة الاندفاعية مع بقاء الذاكرة جيدة نسبياً، وهو النمط المرتبط بالتململ ونفاد الصبر.'
                : 'Elevated impulsive responses with relatively intact working memory. Associated with restlessness and impatience.';
            el.resultRecommendationText.textContent = isAr
                ? 'نوصي بدمج فترات تفريغ حركي وتطبيق طقوس البدء الثابتة من كتاب Deep Work.'
                : 'Integrate physical movement intervals and ritualized start protocols from Deep Work.';
        } else if (s.adhdType.includes('Combined')) {
            el.resultTypeHeading.textContent = isAr ? 'النمط المشترك: تشتت واندفاعية (ADHD-C)' : 'Combined Presentation Type (ADHD-C)';
            el.resultTypeDescription.textContent = isAr
                ? 'أظهرت النتائج وجود أعراض متزامنة لكل من تشتت الانتباه والاستجابة الاندفاعية وتأثر الذاكرة العاملة.'
                : 'Co-occurring inattention, impulsivity, and working memory load impact.';
            el.resultRecommendationText.textContent = isAr
                ? 'يوصى بالجمع بين العلاج السلوكي المعرفي (CBT) لتقسيم المهام واستشارة طبيب مختص لبحث خيارات الدعم الشامل وفق إرشادات NICE NG87.'
                : 'A multimodal approach combining CBT behavioral restructuring and clinical consultation per NICE NG87 guidelines is strongly recommended.';
        } else {
            el.resultTypeHeading.textContent = isAr ? 'أداء طبيعي - انخفاض مؤشرات ADHD' : 'Likely No ADHD (Typical Performance)';
            el.resultTypeDescription.textContent = isAr
                ? 'أظهرت النتائج مستويات جيدة ومستقرة في الذاكرة العاملة والتحكم في الاندفاع والانتباه المستمر.'
                : 'Healthy sustained attention, working memory capacity, and impulse control.';
            el.resultRecommendationText.textContent = isAr
                ? 'يمكنك الاستفادة من مؤقت التركيز وتقنيات العمل العميق للحفاظ على إنتاجيتك.'
                : 'Leverage focus timers and Deep Work protocols for peak productivity.';
        }
    }

    el.openChatbotForAssessmentBtn.addEventListener('click', () => {
        openChatbot();
        const type = state.game.scores.adhdType;
        const q = state.lang === 'ar'
            ? `لقد أجريت اختبار تقييم ADHD وكانت نتيجتي (${type}). ما هي أفضل خطة علاجية وعملية من هارفارد CBT وإرشادات NICE لنمطي؟`
            : `I completed the ADHD test and scored as (${type}). What is the most effective evidence-based plan from Harvard CBT and NICE guidelines for me?`;
        sendChatMessage(q);
    });

    // =========================================================================
    // 10. COMPACT NAVBAR FOCUS TIMER
    // =========================================================================
    function updateTimerDisplay() {
        const mins = Math.floor(state.timer.remainingSeconds / 60);
        const secs = state.timer.remainingSeconds % 60;
        el.timerMinutes.textContent = String(mins).padStart(2, '0');
        el.timerSeconds.textContent = String(secs).padStart(2, '0');
    }

    function setTimerMinutes(minutes) {
        pauseTimer();
        state.timer.totalSeconds = minutes * 60;
        state.timer.remainingSeconds = minutes * 60;
        updateTimerDisplay();

        el.timerModePills.forEach(pill => {
            pill.classList.toggle('active', parseInt(pill.getAttribute('data-time'), 10) === minutes);
        });
    }

    function startTimer() {
        if (state.timer.isRunning) return;
        state.timer.isRunning = true;
        el.timerPlayBtn.querySelector('i').className = 'fa-solid fa-pause';

        state.timer.intervalId = setInterval(() => {
            if (state.timer.remainingSeconds > 0) {
                state.timer.remainingSeconds--;
                updateTimerDisplay();
            } else {
                clearInterval(state.timer.intervalId);
                state.timer.isRunning = false;
                el.timerPlayBtn.querySelector('i').className = 'fa-solid fa-play';

                try { el.timerChime.play().catch(() => {}); } catch (e) {}
                addScore(25);
                alert(i18n[state.lang].timer_done_alert);
            }
        }, 1000);
    }

    function pauseTimer() {
        if (!state.timer.isRunning) return;
        clearInterval(state.timer.intervalId);
        state.timer.isRunning = false;
        el.timerPlayBtn.querySelector('i').className = 'fa-solid fa-play';
    }

    el.timerPlayBtn.addEventListener('click', () => {
        if (state.timer.isRunning) pauseTimer();
        else startTimer();
    });

    el.timerResetBtn.addEventListener('click', () => {
        pauseTimer();
        state.timer.remainingSeconds = state.timer.totalSeconds;
        updateTimerDisplay();
    });

    el.timerModePills.forEach(pill => {
        pill.addEventListener('click', () => {
            const mins = parseInt(pill.getAttribute('data-time'), 10);
            setTimerMinutes(mins);
        });
    });

    // =========================================================================
    // 11. FLOATING CHATBOT WITH STRICT DOMAIN GUARDRAIL
    // =========================================================================
    function openChatbot() {
        el.chatbotDrawer.classList.remove('hidden');
        setTimeout(() => el.chatInput.focus(), 150);
    }

    function closeChatbot() {
        el.chatbotDrawer.classList.add('hidden');
    }

    el.chatbotFloatingBtn.addEventListener('click', () => {
        if (el.chatbotDrawer.classList.contains('hidden')) openChatbot();
        else closeChatbot();
    });

    el.closeChatBtn.addEventListener('click', closeChatbot);

    el.chatPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const q = pill.getAttribute('data-query');
            sendChatMessage(q);
        });
    });

    el.chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const q = el.chatInput.value.trim();
        if (q) {
            el.chatInput.value = '';
            sendChatMessage(q);
        }
    });

    async function sendChatMessage(messageText) {
        const userBubble = document.createElement('div');
        userBubble.className = 'chat-bubble user-bubble';
        userBubble.textContent = messageText;
        el.chatMessages.appendChild(userBubble);
        el.chatMessages.scrollTop = el.chatMessages.scrollHeight;

        el.chatSpinner.classList.remove('hidden');
        el.chatForm.querySelector('.send-icon').classList.add('hidden');

        try {
            const res = await fetch('/api/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: messageText, top_k: 3 })
            });
            const data = await res.json();

            if (data.status === 'success' && data.data) {
                renderBotResponse(data.data);
            }
        } catch (err) {
            console.error('Chat error:', err);
            const errBubble = document.createElement('div');
            errBubble.className = 'chat-bubble bot-bubble';
            errBubble.textContent = 'تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً.';
            el.chatMessages.appendChild(errBubble);
        } finally {
            el.chatSpinner.classList.add('hidden');
            el.chatForm.querySelector('.send-icon').classList.remove('hidden');
            el.chatMessages.scrollTop = el.chatMessages.scrollHeight;
        }
    }

    function renderBotResponse(data) {
        const botBubble = document.createElement('div');
        botBubble.className = 'chat-bubble bot-bubble';

        if (data.out_of_domain) {
            botBubble.classList.add('chat-out-of-scope-bubble');
            botBubble.innerHTML = `
                <div class="bubble-header"><i class="fa-solid fa-shield-halved"></i> <span>نطاق التخصص</span></div>
                <p>${data.tldr}</p>
            `;
        } else {
            const stepsList = (data.action_steps || []).map((s) => `
                <div style="display:flex; align-items:flex-start; gap:0.4rem; margin:0.25rem 0;">
                    <i class="fa-solid fa-check" style="color:var(--primary); font-size:0.75rem; margin-top:0.25rem;"></i>
                    <span>${s.step}</span>
                </div>
            `).join('');

            const sourcesBadges = (data.citations || []).map(c => `
                <span class="source-pill" style="font-size:0.7rem; padding:0.1rem 0.45rem;">
                    ${c.doc_title} (p.${c.pages})
                </span>
            `).join(' ');

            botBubble.innerHTML = `
                <div class="bubble-header"><i class="fa-solid fa-brain"></i> <span>مستشار ADHD</span></div>
                <p style="font-weight:700; margin-bottom:0.4rem;">${data.tldr}</p>
                <div style="font-size:0.84rem; margin-bottom:0.5rem;">${stepsList}</div>
                ${sourcesBadges ? `<div style="display:flex; gap:0.25rem; flex-wrap:wrap; margin-top:0.4rem;">${sourcesBadges}</div>` : ''}
            `;
        }

        el.chatMessages.appendChild(botBubble);
        el.chatMessages.scrollTop = el.chatMessages.scrollHeight;
    }

    // =========================================================================
    // 12. Init
    // =========================================================================
    checkStreak();
    el.scoreCount.textContent = state.score;
    applyTheme(state.theme);
    applyLanguage(state.lang);
    updateTimerDisplay();
    updateHomeNextTaskCard();
    checkOnboarding();

});
