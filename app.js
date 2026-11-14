const $ = (id) => document.getElementById(id);
let lang = "ar";
let currentActivity = null;
let timerInterval = null;
let secondsLeft = 0;

const CHILD_STORAGE_KEY = "khotwa-child-profile";

const activities = [
  {
    id:"balance_line", category:"gross", icon:"🛤️", visual:"gross",
    ar:{
      title:"المشي على الخط المستقيم",
      tag:"التوازن والحركة الكبرى",
      desc:"نشاط أساسي لتعزيز التوازن الثابت والديناميكي والتحكم في وضعية الجسم أثناء المشي.",
      goal:"تحسين التوازن الجسدي، الوعي بالمكان، والتحكم في الخطوات.",
      tools:"شريط لاصق ملون أو طباشير لرسم خط مستقيم على الأرض.",
      steps:[
        "ارسم خطاً مستقيماً بطول 3 إلى 4 أمتار على أرضية غير زلقة.",
        "اطلب من الطفل المشي فوق الخط بوضع الكعب ملامساً لمقدمة القدم الأخرى تدريجياً.",
        "اجعل ذراعي الطفل ممدودتين للجانب للمساعدة على حفظ التوازن.",
        "شجع الطفل واحتفل بإكماله المسار دون استعجال."
      ],
      duration:5
    },
    fr:{
      title:"Marche sur ligne droite",
      tag:"Équilibre et motricité globale",
      desc:"Activité essentielle pour renforcer l’équilibre statique et dynamique et le contrôle postural.",
      goal:"Améliorer l’équilibre corporel, la conscience spatiale et le contrôle des pas.",
      tools:"Ruban adhésif coloré ou craie pour tracer une ligne au sol.",
      steps:[
        "Tracez une ligne droite de 3 à 4 mètres sur un sol non glissant.",
        "Demandez à l’enfant de marcher sur la ligne en plaçant le talon contre la pointe de l’autre pied.",
        "Gardez les bras tendus sur les côtés pour aider à maintenir l’équilibre.",
        "Encouragez l’enfant et félicitez-le à la fin du parcours sans précipitation."
      ],
      duration:5
    }
  },
  {
    id:"jumping_frog", category:"gross", icon:"🐸", visual:"gross",
    ar:{
      title:"قفز الضفدع الثابت والمتحرك",
      tag:"التوازن والحركة الكبرى",
      desc:"القفز بكلتا القدمين فوق حلقات أو علامات على الأرض لتطوير التآزر العضلي السفلي.",
      goal:"تقوية عضلات الأرجل، تحسين التوافق العضلي العصبي، وتوقيت القفز.",
      tools:"حلقات بلاستيكية، وسائد صغيرة، أو دوائر مرسومة على الأرض.",
      steps:[
        "ضع 3 إلى 4 وسائد أو دوائر على مسافات متقاربة وآمنة.",
        "أرِ الطفل كيفية ثني الركبتين ثم القفز معاً بكلتا القدمين من دائرة لأخرى.",
        "ابدأ بمسافات قصيرة ثم وسّع المسافة تدريجياً حسب قدرة الطفل.",
        "احرص على توفير بيئة آمنة وامتداح كل محاولة ناجحة."
      ],
      duration:6
    },
    fr:{
      title:"Sauts de grenouille",
      tag:"Équilibre et motricité globale",
      desc:"Sauter à pieds joints par-dessus des cerceaux ou des repères pour développer la coordination des membres inférieurs.",
      goal:"Renforcer les muscles des jambes, améliorer la coordination neuromusculaire et le timing.",
      tools:"Cerceaux, petits coussins ou cercles tracés au sol.",
      steps:[
        "Disposez 3 à 4 coussins ou cercles à distances rapprochées et sécurisées.",
        "Montrez à l’enfant comment fléchir les genoux puis sauter à pieds joints d’un cercle à l’autre.",
        "Commencez par de courtes distances puis augmentez progressivement selon les capacités.",
        "Veillez à offrir un environnement sécurisé et valorisez chaque essai réussi."
      ],
      duration:6
    }
  },
  {
    id:"button_zip", category:"fine", icon:"🧥", visual:"fine",
    ar:{
      title:"تمرين الأزرار والسحابات",
      tag:"المهارات الحركية الدقيقة",
      desc:"استخدام قميص أو سترة تحتوي على أزرار كبيرة وسحابات للتدريب على الاستقلالية اليومية.",
      goal:"تطوير التآزر الحركي الدقيق بين الأصابع والتحكم في القوة والقبضة.",
      tools:"قميص أو سترة بأزرار كبيرة، وسحاب (Zip).",
      steps:[
        "اجلس بجانب الطفل وأمامه قطعة ملابس سهلة التعامل.",
        "أرِ الطفل ببطء كيفية إدخال الزر في العروة أو سحب السحاب.",
        "دع الطفل يمحو الصعوبة بنفسه مع إعطائه الوقت الكافي دون استعجال.",
        "قدّم المساعدة الموجهة فقط عند الحاجة القصوى."
      ],
      duration:7
    },
    fr:{
      title:"Exercice des boutons et zips",
      tag:"Motricité fine",
      desc:"Manipuler une chemise ou une veste avec de grands boutons et fermetures éclair pour l’autonomie.",
      goal:"Développer la coordination fine des doigts et le contrôle de la force de préhension.",
      tools:"Chemise ou veste à grands boutons, fermeture éclair.",
      steps:[
        "Asseyez-vous à côté de l’enfant avec un vêtement facile à manipuler.",
        "Montrez lentement comment insérer un bouton dans sa boutonnière ou tirer le zip.",
        "Laissez l’enfant essayer à son rythme sans le presser.",
        "Apportez une aide guidée uniquement en cas de besoin."
      ],
      duration:7
    }
  },
  {
    id:"pegboard_shapes", category:"fine", icon:"🧩", visual:"fine",
    ar:{
      title:"تركيب الأشكال وتثبيت القطع",
      tag:"المهارات الحركية الدقيقة",
      desc:"إدخال قطع هندسية صغيرة في أماكنها المخصصة بدقة، أو تثبيت الأوتاد.",
      goal:"تحسين التنسيق الإصبعي، الدقة البصرية الحركية، والانتباه.",
      tools:"لوحة أوتاد، أشكال هندسية خشبية أو بلاستيكية.",
      steps:[
        "اعرض اللوحة والقطع أمام الطفل بشكل منظم.",
        "اطلب منه التقاط كل قطعة باستخدام الأصابع (وليس قبضة اليد الكاملة).",
        "وجّهه لتوجيه القطعة نحو الثقب أو المكان الصحيح وتثبيتها.",
        "تدرج في تعقيد الأشكال حسب استجابة الطفل."
      ],
      duration:8
    },
    fr:{
      title:"Encastrements et formes",
      tag:"Motricité fine",
      desc:"Insérer de petites pièces géométriques dans leurs emplacements avec précision.",
      goal:"Améliorer la coordination digitale, la précision visuomotrice et l'attention.",
      tools:"Planche à encastrer, formes géométriques en bois ou plastique.",
      steps:[
        "Présentez la planche et les pièces de manière organisée devant l’enfant.",
        "Demandez-lui de saisir chaque pièce avec le bout des doigts (pince fine).",
        "Guidez-le pour orienter la pièce vers le bon emplacement et l'insérer.",
        "Complexifiez les formes progressivement selon la réponse de l’enfant."
      ],
      duration:8
    }
  },
  {
    id:"ball_catch", category:"visual", icon:"⚽", visual:"visual",
    ar:{
      title:"رمي والتقاط الكرة الاسفنجية",
      tag:"التنسيق البصري الحركي",
      desc:"متابعة حركة الكرة بالعينين وتوجيه اليدين لالتقاطها في الوقت المناسب.",
      goal:"تحسين التآزر البصري الحركي، سرعة رد الفعل، وتقدير المسافات.",
      tools:"كرة إسفنجية خفيفة وآمنة.",
      steps:[
        "قف على مسافة قصيرة (حوالي متر أو مترين) مقابل الطفل.",
        "ارمِ الكرة برفق نحو الطفل واطلب منه التقاطها بكلتا يديه.",
        "شجعه على إبقاء عينيه مفتوحتين ومتابعة مسار الكرة.",
        "زيادة المسافة تدريجياً عندما يتحسن أداء الطفل."
      ],
      duration:6
    },
    fr:{
      title:"Lancer et attraper la balle",
      tag:"Coordination œil-main",
      desc:"Suivre la trajectoire d’une balle des yeux et coordonner les mains pour la réception.",
      goal:"Améliorer la coordination visuomotrice, le temps de réaction et l'estimation des distances.",
      tools:"Balle en mousse légère et sécurisée.",
      steps:[
        "Tenez-vous à courte distance (1 à 2 mètres) face à l’enfant.",
        "Lancez la balle doucement vers lui et demandez-lui de l’attraper à deux mains.",
        "Encouragez-le à garder les yeux fixés sur la balle pendant son trajet.",
        "Augmentez la distance progressivement à mesure qu’il s’améliore."
      ],
      duration:6
    }
  },
  {
    id:"target_throw", category:"visual", icon:"🎯", visual:"visual",
    ar:{
      title:"تصويب الهدف الدائري",
      tag:"التنسيق البصري الحركي",
      desc:"رمي كيس قماشي صغير أو كرة خفيفة نحو هدف مرسوم على الأرض أو الحائط.",
      goal:"ضبط القوة الحركية، توجيه النظر بدقة نحو الهدف، والتنظيم الفراغي.",
      tools:"هدف دائري مرسوم على الورق أو صندوق كرتوني مفتوح.",
      steps:[
        "ضع الهدف على مسافة مناسبة ومريحة للطفل.",
        "أرِ الطفل كيفية مسك الكيس أو الكرة وتوجيه النظر نحو مركز الهدف.",
        "اطلب منه محاولة الرمي بدقة داخل الدائرة.",
        "احتفل بالمحاولات الناجحة وادعمه للاستمرار."
      ],
      duration:6
    },
    fr:{
      title:"Lancer sur cible",
      tag:"Coordination œil-main",
      desc:"Lancer un petit sac de grains ou une balle légère vers une cible au sol ou au mur.",
      goal:"Ajuster la force musculaire, cibler avec précision et structuration spatiale.",
      tools:"Cible circulaire dessinée sur papier ou boîte en carton.",
      steps:[
        "Placez la cible à une distance adaptée et confortable pour l’enfant.",
        "Montrez comment tenir le projectile et fixer le centre de la cible du regard.",
        "Demandez-lui de lancer pour viser l’intérieur de la cible.",
        "Célébrez les essais réussis pour maintenir sa motivation."
      ],
      duration:6
    }
  },
  {
    id:"bottle_caps_sort", category:"table", icon:"🪙", visual:"table",
    ar:{
      title:"فرز أغطية القارورات بالألوان والأحجام",
      tag:"ألعاب الطاولة الاقتصادية",
      desc:"لعبة طاولة بسيطة وموفرة باستخدام أغطية القارورات البلاستيكية الملونة لتطوير الانتباه والتمييز البصري الحركي.",
      goal:"تحسين التركيز، التمييز البصري، والتحكم في الأصابع باستخدام الملقط أو باليد.",
      tools:"أغطية قارورات بلاستيكية ملونة، علب كرتون صغيرة أو أطباق بلاستيكية.",
      steps:[
        "اجمع مجموعة من أغطية القارورات بألوان مختلفة وضعها في وعاء مركزي.",
        "اطلب من الطفل فرز الأغطية ووضع كل لون في علبة أو طبق مخصص له.",
        "يمكن زيادة التحدي باستخدام ملقط مطبخ صغير لالتقاط الأغطية وتنمية القبضة الدقيقة.",
        "شجع الطفل على إتمام المهمة بهدوء ودعم."
      ],
      duration:6
    },
    fr:{
      title:"Tri de bouchons par couleur",
      tag:"Jeux de table économiques",
      desc:"Un jeu de table économique utilisant des bouchons en plastique colorés pour développer l'attention et la discrimination visuelle.",
      goal:"Améliorer la concentration, la discrimination visuelle et la pince digitale.",
      tools:"Bouchons en plastique colorés, petites boîtes ou assiettes.",
      steps:[
        "Rassemblez des bouchons de différentes couleurs dans un récipient central.",
        "Demandez à l’enfant de trier les bouchons et de les placer dans les boîtes correspondantes.",
        "Utilisez éventuellement une petite pince pour complexifier et stimuler la motricité fine.",
        "Encouragez l'enfant à terminer la tâche calmement."
      ],
      duration:6
    }
  },
  {
    id:"cardboard_maze", category:"table", icon:"🌀", visual:"table",
    ar:{
      title:"لعبة المتاهة بالكرتون والكرة الصغيرة",
      tag:"ألعاب الطاولة الاقتصادية",
      desc:"صنع متاهة بسيطة على صندوق كرتوني وتوجيه كرة زجاجية أو كرة صغيرة من البداية للنهاية.",
      goal:"تطوير التازر البصري الحركي، الصبر، والتحكم الدقيق في ميلان الطاولة.",
      tools:"غلاف علبة أحذية أو كرتون مقوى، عيدان خشبية أو لصق، كرة صغيرة.",
      steps:[
        "ارسم متاهة بسيطة وثبت حواجز من قطع الكرتون أو العيدان داخل الصندوق.",
        "ضع كرة صغيرة (أو حبة حُمص كبيرة) عند نقطة البداية.",
        "اطلب من الطفل تحريك الصندوق بيمناه ويسراه بحذر لتوجيه الكرة نحو المخرج دون السقوط.",
        "تدرج في تعقيد مسار المتاهة حسب تطور قدرات الطفل."
      ],
      duration:8
    },
    fr:{
      title:"Labyrinthe en carton et bille",
      tag:"Jeux de table économiques",
      desc:"Créer un labyrinthe simple sur un carton et guider une petite bille du début à la fin.",
      goal:"Développer la coordination visuomotrice, la patience et le contrôle postural fin.",
      tools:"Boîte en carton, bâtonnets de bois ou colle, petite bille.",
      steps:[
        "Tracez un labyrinthe simple et collez des barrières en carton à l'intérieur.",
        "Placez une petite bille au point de départ.",
        "Demandez-lui d’incliner délicatement le carton pour guider la bille vers la sortie.",
        "Complexifiez le labyrinthe au fur et à mesure des progrès."
      ],
      duration:8
    }
  },
  {
    id:"clothes_peg_match", category:"table", icon:"📌", visual:"table",
    ar:{
      title:"تثبيت ملاقط الغسيل على حافة الكرتون",
      tag:"ألعاب الطاولة الاقتصادية",
      desc:"تمرين ممتاز ومجاني لتقوية عضلات الأصابع والإبهام باستخدام ملاقط الغسيل الخشبية أو البلاستيكية.",
      goal:"تقوية القبضة الثنائية، زيادة قوة عضلات الأصابع، والتنسيق البصري.",
      tools:"قطعة كرتون مقوى، مجموعة ملاقط غسيل ملونة.",
      steps:[
        "ارسم ألواناً أو أرقاماً على حافة قطعة كرتون مقوى.",
        "اطلب من الطفل فتح الملقط بالضغط بالأصابع وتثبيته في اللون أو الرقم المطابق.",
        "ساعده في البداية إذا واجه صعوبة في فتح الملقط، ثم دعه يعتمد على نفسه.",
        "احتفوا معاً بإكمال كافة الملاقط."
      ],
      duration:7
    },
    fr:{
      title:"Jeu de pinces à linge",
      tag:"Jeux de table économiques",
      desc:"Un exercice excellent et gratuit pour renforcer les muscles des doigts et du pouce avec des pinces à linge.",
      goal:"Renforcer la pince digitale, accroître la force musculaire et la coordination.",
      tools:"Morceau de carton, pinces à linge colorées.",
      steps:[
        "Marquez des couleurs ou des chiffres sur le bord d’un carton.",
        "Demandez à l’enfant d’ouvrir la pince en pressant avec les doigts et de la fixer sur la zone correspondante.",
        "Aidez-le au début si nécessaire, puis laissez-le faire seul.",
        "Célébrez la réussite une fois toutes les pinces placées."
      ],
      duration:7
    }
  }
];

const translations = {
 ar:{
  brandSub:"كل خطوة تصنع فرقاً",heroEyebrow:"دليل مبسّط للأولياء",heroTitle:"خطوات صغيرة، تطوّر أكبر",
  heroText:"أنشطة منزلية إرشادية لدعم التنسيق الحركي لدى الطفل ذي TDC، بالتدرّج وبدون ضغط.",
  exploreBtn:"اكتشف الأنشطة",noticeText:"<strong>ما هو TDC؟</strong> اضطراب النمو التناسقي قد يجعل تعلّم وتنفيذ بعض الحركات اليومية أصعب. هذا التطبيق للتوعية والأنشطة العامة، ولا يعوّض تقييم المختص.",
  activitiesEyebrow:"تعلّموا بالممارسة",activitiesTitle:"الأنشطة والتمارين المقترحة",activityCount:"أنشطة",filterAll:"الكل",filterGross:"التوازن والحركة",filterFine:"المهارات الدقيقة",filterVisual:"التنسيق البصري",filterTable:"ألعاب الطاولة الاقتصادية",
  followEyebrow:"مرافقة الطفل",followTitle:"متابعة الأنشطة",archiveTitle:"أرشيف الصور والفيديوهات",archiveText:"احتفظوا بتسجيلات الأنشطة على هذا الجهاز فقط.",openArchive:"فتح الأرشيف",tipsTitle:"نصائح للأولياء",tipsText:"التشجيع، التدرّج، وتكييف النشاط مع قدرات الطفل.",tipsBtn:"قراءة النصائح",aboutTitle:"عن تطبيق خطوة",aboutText:"مبادرة توعوية لمرافقة أولياء الأطفال ذوي اضطراب النمو التناسقي (TDC).",navHome:"الرئيسية",navActivities:"الأنشطة",navProfileText:"الطفل",navRecords:"الأرشيف",navAboutText:"حول",footerText:"محتوى توعوي وليس تشخيصاً أو علاجاً بديلاً.",
  view:"عرض النشاط",minutes:"دقائق",goal:"الهدف",tools:"الأدوات",steps:"طريقة النشاط",video:"الفيديو التوضيحي التعليمي",videoHelp:"اضغط على الزر أدناه للانتقال مباشرة إلى يوتيوب ومشاهدة فيديوهات وتطبيقات الـ Psychomotricité الخاصة بهذا التمرين.",openOnYoutube:"مشاهدة الشرح على يوتيوب (Psychomotricité) ↗",
  start:"بدء المؤقت",pause:"إيقاف مؤقت",reset:"إعادة",done:"إنهاء النشاط",timer:"الوقت المتبقي",activityDone:"أحسنتم! تذكّروا أن جودة المشاركة أهم من السرعة أو النتيجة.",
  archiveHeading:"Archive",archiveEyebrow:"المتابعة",privacyNote:"الملفات محفوظة محلياً على هذا الجهاز ولا تُرفع إلى خادم. لا تشاركوا صور الطفل دون موافقة وليّه.",uploadLabel:"＋ إضافة صورة أو فيديو للنشاط",emptyArchive:"لا توجد ملفات محفوظة بعد.",delete:"حذف",infoTitle:"معلومات مهمة",infoBody:"<p>اضطراب النمو التناسقي (TDC/DCD) يؤثر في اكتساب وتنفيذ المهارات الحركية، وقد تظهر الصعوبات في اللباس والكتابة واللعب والأنشطة اليومية.</p><p>تختلف احتياجات كل طفل. اختاروا أنشطة آمنة وممتعة، وتوقفوا إذا ظهر ألم أو تعب أو انزعاج. استشيروا مختصاً مؤهلاً لتحديد الأهداف المناسبة.</p><p><b>سلامة:</b> أشرفوا على الطفل طوال النشاط، وأبعدوا القطع الصغيرة والأدوات الحادة.</p>",tipsBody:"<ul><li>اختاروا وقتاً يكون فيه الطفل مرتاحاً.</li><li>قسّموا المهمة إلى خطوات قصيرة وواضحة.</li><li>ابدؤوا بمستوى سهل ثم عدّلوا الصعوبة تدريجياً.</li><li>امدحوا المحاولة والاستقلالية، ولا تقارنوا الطفل بغيره.</li><li>لا تفرضوا التمرين إذا رفض الطفل أو شعر بالتعب.</li></ul>",saved:"تمت إضافة الملف إلى الأرشيف على هذا الجهاز.",fileTooLarge:"حجم الملف كبير جداً لهذا النموذج. اختاروا ملفاً أصغر.",
  profileBtnDefault:"ملف الطفل",heroProfileAdd:"＋ تسجيل بيانات الطفل",heroProfileEdit:"✎ ملف الطفل",editChildSummaryBtn:"تعديل الملف",
  profileEyebrow:"المتابعة الشخصية",profileHeading:"ملف الطفل",profilePrivacyNote:"تُحفظ بيانات الطفل محلياً على هذا الجهاز فقط لتخصيص التجربة، ولا تُرسل لأي خادم خارجي.",
  childNameLabel:"اسم الطفل",childNamePlaceholder:"مثال: آدم",childAgeLabel:"العمر (بالسنوات)",childAgePlaceholder:"مثال: 6",
  childIssueLabel:"المشكل أو الصعوبة الأساسية",optGross:"صعوبة في التوازن والحركة الكبرى (المشي، القفز، الجري)",optFine:"صعوبة في المهارات الدقيقة (مسك القلم، الأزرار، الخيط)",optVisual:"صعوبة في التنسيق البصري الحركي (التركيب، رمي والتقاط الكرة)",optMixed:"صعوبات مختلطة في التنسيق الحركي العام",optOther:"أخرى (تحديد مخصص)",
  childNotesLabel:"وصف المشكل أو ملاحظات إضافية",childNotesPlaceholder:"اكتب تفاصيل المشكل الذي يعاني منه الطفل...",
  saveChildBtn:"حفظ البيانات",deleteChildBtn:"حذف الملف",childSavedAlert:"تم حفظ بيانات الطفل بنجاح!",childDeleteConfirm:"هل أنت متأكد من حذف بيانات الطفل؟",
  yearsUnit:"سنوات",recommendedBadge:"مقترح لحالة الطفل",
  issueShort:{gross:"التوازن والحركة الكبرى",fine:"المهارات الحركية الدقيقة",visual:"التنسيق البصري الحركي",table:"ألعاب الطاولة الاقتصادية",mixed:"صعوبات حركية مختلطة",other:"ملاحظات خاصة"},
  
  // نظام متابعة التقدم للمختص (Psychomotricien)
  therapistNotesTitle:"متابعة أخصائي النفس الحركي (Psychomotricien)",
  evalLevelLabel:"مستوى أداء واستجابة الطفل في الجلسة",
  level1:"مساعدة كاملة / صعوبة بالغة",
  level2:"استجابة جزئية / مساعدة موجهة",
  level3:"استقلالية تامة وإنجاز ناجح",
  therapistNotesLabel:"ملاحظات إكلينيكية / توصيات الجلسة",
  therapistNotesPlaceholder:"سجل ملاحظات التوتر، التركيز، أو الملاحظات الحركية...",
  saveSessionBtn:"حفظ تقييم الجلسة",
  sessionSavedAlert:"تم حفظ تقييم الجلسة بنجاح في سجل المريض!"
 },
 fr:{
  brandSub:"Chaque petit pas compte",heroEyebrow:"Guide simple pour les parents",heroTitle:"De petits pas, de grands progrès",
  heroText:"Des activités à domicile pour accompagner la coordination motrice de l’enfant avec un TDC, progressivement et sans pression.",
  exploreBtn:"Décorer les activités",noticeText:"<strong>Qu’est-ce que le TDC ?</strong> Le trouble développemental de la coordination peut rendre l’apprentissage et l’exécution de certains gestes quotidiens plus difficiles. Cette application informe et propose des activités générales; elle ne remplace pas une évaluation spécialisée.",
  activitiesEyebrow:"Apprendre en pratiquant",activitiesTitle:"Activités et exercices proposés",activityCount:"activités",filterAll:"Tout",filterGross:"Équilibre et mouvement",filterFine:"Motricité fine",filterVisual:"Coordination visuelle",filterTable:"Jeux de table économiques",
  followEyebrow:"Accompagner l’enfant",followTitle:"Suivi des activités",archiveTitle:"Archive photos et vidéos",archiveText:"Conservez les médias sur cet appareil uniquement.",openArchive:"Ouvrir l’archive",tipsTitle:"Conseils aux parents",tipsText:"Encourager, progresser par étapes et adapter l’activité.",tipsBtn:"Lire les conseils",aboutTitle:"À propos de Khotwa",aboutText:"Une initiative d’information pour accompagner les parents d’enfants avec un TDC.",navHome:"Accueil",navActivities:"Activités",navProfileText:"Enfant",navRecords:"Archive",navAboutText:"À propos",footerText:"Contenu informatif; ne remplace ni diagnostic ni suivi professionnel.",
  view:"Voir l'activité",minutes:"min",goal:"Objectif",tools:"Matériel",steps:"Déroulement",video:"Vidéo explicative (Psychomotricité)",videoHelp:"Cliquez sur le bouton ci-dessous pour accéder directement à YouTube et visionner les exercices de psychomotricité adaptés à cet atelier.",openOnYoutube:"Voir la démonstration sur YouTube (Psychomotricité) ↗",
  start:"Démarrer",pause:"Pause",reset:"Réinitialiser",done:"Terminer l’activité",timer:"Temps restant",activityDone:"Bravo ! La participation compte davantage que la vitesse ou le résultat.",
  archiveHeading:"Archive",archiveEyebrow:"Suivi",privacyNote:"Les fichiers sont enregistrés localement sur cet appareil et ne sont pas envoyés à un serveur. Ne partagez pas les images de l’enfant sans l’accord de son responsable légal.",uploadLabel:"＋ Ajouter une photo ou une vidéo",emptyArchive:"Aucun fichier enregistré pour le moment.",delete:"Supprimer",infoTitle:"Informations importantes",infoBody:"<p>Le trouble développemental de la coordination (TDC/DCD) affecte l’acquisition et l’exécution des habiletés motrices. Les difficultés peuvent concerner l’habillage, l’écriture, le jeu et les activités quotidiennes.</p><p>Les besoins varient selon chaque enfant. Choisissez des activités sûres et agréables; arrêtez en cas de douleur, fatigue ou inconfort. Consultez un professionnel qualifié pour définir des objectifs adaptés.</p><p><b>Sécurité :</b> surveillez l’enfant pendant toute l’activité et éloignez les petits objets et les outils coupants.</p>",tipsBody:"<ul><li>Choisissez un moment où l’enfant est disponible.</li><li>Divisez la tâche en étapes courtes et claires.</li><li>Commencez facilement puis adaptez progressivement.</li><li>Valorisez les essais et l’autonomie, sans comparaison.</li><li>Ne forcez pas l’activité si l’enfant refuse ou se fatigue.</li></ul>",saved:"Fichier ajouté à l’archive de cet appareil.",fileTooLarge:"Fichier trop volumineux pour cette version. Choisissez un fichier plus petit.",
  profileBtnDefault:"Profil enfant",heroProfileAdd:"＋ Enregistrer l'enfant",heroProfileEdit:"✎ Profil enfant",editChildSummaryBtn:"Modifier",
  profileEyebrow:"Suivi personnalisé",profileHeading:"Profil de l'enfant",profilePrivacyNote:"Les données de l'enfant sont enregistrées localement sur cet appareil uniquement et ne sont envoyées à aucun serveur.",
  childNameLabel:"Nom de l'enfant",childNamePlaceholder:"Ex : Adam",childAgeLabel:"Âge (en années)",childAgePlaceholder:"Ex : 6",
  childIssueLabel:"Difficulté principale",optGross:"Équilibre et motricité globale (marcher, sauter, courir)",optFine:"Motricité fine (tenir un crayon, boutons, lacer)",optVisual:"Coordination œil-main (construction, lancer/attraper)",optMixed:"Difficultés mixtes de coordination générale",optOther:"Autre (préciser)",
  childNotesLabel:"Description du problème ou remarques",childNotesPlaceholder:"Décrivez les difficultés rencontrées par l'enfant...",
  saveChildBtn:"Enregistrer",deleteChildBtn:"Supprimer",childSavedAlert:"Profil de l'enfant enregistré !",childDeleteConfirm:"Voulez-vous vraiment supprimer ce profil ?",
  yearsUnit:"ans",recommendedBadge:"Recommandé pour l'enfant",
  issueShort:{gross:"Équilibre et motricité globale",fine:"Motricité fine",visual:"Coordination œil-main",table:"Jeux de table économiques",mixed:"Difficultés mixtes",other:"Remarques spécifiques"},

  therapistNotesTitle:"Suivi du Psychomotricien",
  evalLevelLabel:"Niveau d'évaluation de l'enfant",
  level1:"Aide totale / Difficulté majeure",
  level2:"Réponse partielle / Aide guidée",
  level3:"Autonomie complète et réussite",
  therapistNotesLabel:"Notes cliniques / Remarques de la séance",
  therapistNotesPlaceholder:"Notez la tonicité, l'attention, ou les observations motrices...",
  saveSessionBtn:"Enregistrer l'évaluation",
  sessionSavedAlert:"Évaluation de la séance enregistrée avec succès !"
 }
};

function t(key){return translations[lang][key] || key}

function getChildProfile(){
  try{
    const raw = localStorage.getItem(CHILD_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  }catch(e){return null}
}

function saveChildProfile(profile){
  localStorage.setItem(CHILD_STORAGE_KEY, JSON.stringify(profile));
}

function deleteChildProfile(){
  localStorage.removeItem(CHILD_STORAGE_KEY);
}

function renderChildUI(){
  const profile = getChildProfile();
  const bar = $("childSummaryBar");
  const profileBtn = $("profileBtn");
  const profileBtnLabel = $("profileBtnLabel");
  const heroProfileBtn = $("heroProfileBtn");

  if(profile && profile.name){
    profileBtn.classList.add("has-profile");
    profileBtnLabel.textContent = profile.name;
    heroProfileBtn.textContent = t("heroProfileEdit");
    bar.hidden = false;
    $("childAvatar").textContent = profile.name.trim().charAt(0).toUpperCase();
    $("summaryChildName").textContent = `${profile.name} (${profile.age} ${t("yearsUnit")})`;
    const issueLabel = t("issueShort")[profile.issue] || "";
    const notePart = profile.notes && profile.notes.trim() ? ` · ${profile.notes.trim()}` : "";
    $("summaryChildDetails").textContent = `${issueLabel}${notePart}`;
  }else{
    profileBtn.classList.remove("has-profile");
    profileBtnLabel.textContent = t("profileBtnDefault");
    heroProfileBtn.textContent = t("heroProfileAdd");
    bar.hidden = true;
  }
}

function openProfileModal(){
  const profile = getChildProfile();
  $("profileEyebrow").textContent = t("profileEyebrow");
  $("profileHeading").textContent = t("profileHeading");
  $("profilePrivacyNote").textContent = t("profilePrivacyNote");
  $("childNameLabel").textContent = t("childNameLabel");
  $("childNameInput").placeholder = t("childNamePlaceholder");
  $("childAgeLabel").textContent = t("childAgeLabel");
  $("childAgeInput").placeholder = t("childAgePlaceholder");
  $("childIssueLabel").textContent = t("childIssueLabel");
  $("optGross").textContent = t("optGross");
  $("optFine").textContent = t("optFine");
  $("optVisual").textContent = t("optVisual");
  $("optMixed").textContent = t("optMixed");
  $("optOther").textContent = t("optOther");
  $("childNotesLabel").textContent = t("childNotesLabel");
  $("childNotesInput").placeholder = t("childNotesPlaceholder");
  $("saveChildBtn").textContent = t("saveChildBtn");
  $("deleteChildBtn").textContent = t("deleteChildBtn");

  if(profile){
    $("childNameInput").value = profile.name || "";
    $("childAgeInput").value = profile.age || "";
    $("childIssueSelect").value = profile.issue || "gross";
    $("childNotesInput").value = profile.notes || "";
    $("deleteChildBtn").hidden = false;
  }else{
    $("childForm").reset();
    $("deleteChildBtn").hidden = true;
  }
  $("profileDialog").showModal();
}

$("childForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const profile = {
    name: $("childNameInput").value.trim(),
    age: $("childAgeInput").value.trim(),
    issue: $("childIssueSelect").value,
    notes: $("childNotesInput").value.trim(),
    updatedAt: new Date().toISOString()
  };
  if(!profile.name || !profile.age) return;
  saveChildProfile(profile);
  renderChildUI();
  const activeFilter = document.querySelector(".filter.active")?.dataset.filter || "all";
  renderActivities(activeFilter);
  $("profileDialog").close();
  alert(t("childSavedAlert"));
});

$("deleteChildBtn").addEventListener("click", () => {
  if(confirm(t("childDeleteConfirm"))){
    deleteChildProfile();
    renderChildUI();
    const activeFilter = document.querySelector(".filter.active")?.dataset.filter || "all";
    renderActivities(activeFilter);
    $("profileDialog").close();
  }
});

function applyLanguage(){
 document.documentElement.lang=lang;document.documentElement.dir=lang==="ar"?"rtl":"ltr";document.body.dir=document.documentElement.dir;
 ["brandSub","heroEyebrow","heroTitle","heroText","exploreBtn","noticeText","activitiesEyebrow","activitiesTitle","activityCount","filterAll","filterGross","filterFine","filterVisual","followEyebrow","followTitle","archiveTitle","archiveText","openArchive","tipsTitle","tipsText","tipsBtn","aboutTitle","aboutText","navHome","navActivities","navProfileText","navRecords","navAboutText","footerText","editChildSummaryBtn"].forEach(id=>{
   const el=$(id);
   if(el){
     if(id==="noticeText") el.innerHTML=t(id);
     else if(id==="exploreBtn") el.innerHTML=`${t(id)} <span>${lang==="ar"?"←":"→"}</span>`;
     else el.textContent=t(id);
   }
 });
 $("langBtn").textContent=lang==="ar"?"FR":"ع";
 renderChildUI();
 const activeFilter = document.querySelector(".filter.active")?.dataset.filter || "all";
 renderActivities(activeFilter);
}

function renderActivities(filter="all"){
 const grid=$("activityGrid");grid.innerHTML="";
 const profile = getChildProfile();
 const list=activities.filter(a=>filter==="all"||a.category===filter);
 $("activityCount").textContent=`${list.length} ${t("activityCount")}`;
 list.forEach(a=>{
  const d=a[lang];
  const isRecommended = profile && (profile.issue === a.category || profile.issue === "mixed");
  const card=document.createElement("article");
  card.className=`activity-card${isRecommended ? " recommended" : ""}`;
  const badgeHtml = isRecommended ? `<span class="rec-badge">★ ${t("recommendedBadge")}</span>` : "";
  card.innerHTML=`${badgeHtml}<div class="activity-visual visual-${a.visual}"><span class="visual-icon">${a.icon}</span></div><div class="activity-content"><span class="tag">${d.tag}</span><h3>${d.title}</h3><p>${d.desc}</p><div class="meta"><span>◷ ${d.duration} ${t("minutes")}</span><span>✦ ${lang==="ar"?"نشاط منزلي":"À domicile"}</span></div><button class="secondary-btn">${t("view")}　↗</button></div>`;
  card.querySelector("button").addEventListener("click",()=>openActivity(a.id));grid.appendChild(card);
 });
}

document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{
 document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));btn.classList.add("active");renderActivities(btn.dataset.filter);
}));

function openActivity(id){
 currentActivity=activities.find(a=>a.id===id);const d=currentActivity[lang];
 $("modalTitle").textContent=d.title;$("modalEyebrow").textContent=d.tag;
 
 const ytSearchUrl = "https://www.youtube.com/results?search_query=" + encodeURIComponent(d.title + ' psychomotricité');

 // جلب التقييمات والملاحظات السابقة المسجلة للأخصائي إن وجدت
 const sessionKey = "khotwa-session-"+id;
 const savedSession = JSON.parse(localStorage.getItem(sessionKey) || "{}");

 $("modalBody").innerHTML=`
   <p class="detail-desc">${d.desc}</p>
   <div class="timer-row"><span>${t("timer")}</span><strong id="timerDisplay">${String(d.duration).padStart(2,"0")}:00</strong></div>
   <h3>${t("goal")}</h3><p class="detail-desc">${d.goal}</p>
   <h3>${t("tools")}</h3><p class="detail-desc">${d.tools}</p>
   <h3>${t("steps")}</h3><ol class="detail-list">${d.steps.map(s=>`<li>${s}</li>`).join("")}</ol>
   
   <h3>${t("video")}</h3>
   <p class="detail-desc">${t("videoHelp")}</p>
   <div class="detail-actions" style="margin-top:8px; margin-bottom:18px;">
     <a class="primary-btn" id="openExternalYouTube" href="${ytSearchUrl}" target="_blank" style="text-decoration:none; display:inline-grid; place-items:center; text-align:center; width:100%; padding:14px;">${t("openOnYoutube")}</a>
   </div>

   <hr style="border:0; border-top:1px solid var(--line); margin:20px 0;">
   
   <div style="background:#f4faf6; border:1px solid #cfe1d8; border-radius:16px; padding:16px; margin-bottom:14px;">
     <h3 style="margin-top:0; color:var(--green-dark); font-size:15px;">📊 ${t("therapistNotesTitle")}</h3>
     <div class="form-group" style="margin-bottom:10px;">
       <label for="evalLevelSelect">${t("evalLevelLabel")}</label>
       <select id="evalLevelSelect" class="video-input" style="background:#fff; margin-top:4px;">
         <option value="1" ${savedSession.level==="1"?"selected":""}>🔴 ${t("level1")}</option>
         <option value="2" ${savedSession.level==="2"?"selected":""}>🟡 ${t("level2")}</option>
         <option value="3" ${savedSession.level==="3"?"selected":""}>🟢 ${t("level3")}</option>
       </select>
     </div>
     <div class="form-group" style="margin-bottom:10px;">
       <label for="therapistNotesInput">${t("therapistNotesLabel")}</label>
       <textarea id="therapistNotesInput" rows="3" class="video-input" style="background:#fff; margin-top:4px;" placeholder="${t("therapistNotesPlaceholder")}">${savedSession.notes||""}</textarea>
     </div>
     <button class="secondary-btn" id="saveSessionBtn" style="width:100%; background:var(--green); color:#fff; border:0; padding:11px;">${t("saveSessionBtn")}</button>
   </div>

   <div class="detail-actions">
     <button class="primary-btn" id="timerStart">${t("start")}</button>
     <button class="secondary-btn" id="timerReset">${t("reset")}</button>
     <button class="secondary-btn" id="finishActivity">${t("done")}</button>
   </div>
 `;

 $("activityDialog").showModal();
 secondsLeft=d.duration*60;
 renderTimer();

 $("timerStart").onclick=toggleTimer;
 $("timerReset").onclick=()=>{stopTimer();secondsLeft=d.duration*60;renderTimer()};
 $("finishActivity").onclick=()=>{stopTimer();alert(t("activityDone"));$("activityDialog").close()};

 $("saveSessionBtn").onclick = () => {
   const sessionData = {
     level: $("evalLevelSelect").value,
     notes: $("therapistNotesInput").value.trim(),
     date: new Date().toLocaleString(lang==="ar"?"ar-DZ":"fr-FR")
   };
   localStorage.setItem(sessionKey, JSON.stringify(sessionData));
   alert(t("sessionSavedAlert"));
 };
}

function renderTimer(){const el=$("timerDisplay");if(el)el.textContent=`${String(Math.floor(secondsLeft/60)).padStart(2,"0")}:${String(secondsLeft%60).padStart(2,"0")}`}
function stopTimer(){if(timerInterval){clearInterval(timerInterval);timerInterval=null}const b=$("timerStart");if(b)b.textContent=t("start")}
function toggleTimer(){
 if(timerInterval){stopTimer();return}
 $("timerStart").textContent=t("pause");
 timerInterval=setInterval(()=>{secondsLeft=Math.max(0,secondsLeft-1);renderTimer();if(secondsLeft===0){stopTimer();alert(t("activityDone"))}},1000);
}

let dbPromise;
function openDB(){
 if(!("indexedDB" in window))return Promise.reject(new Error("IndexedDB unavailable"));
 if(dbPromise)return dbPromise;
 dbPromise=new Promise((resolve,reject)=>{const req=indexedDB.open("KhotwaArchive",1);req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains("media"))db.createObjectStore("media",{keyPath:"id",autoIncrement:true})};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)});
 return dbPromise;
}
async function addMedia(file){
 if(file.size>35*1024*1024){alert(t("fileTooLarge"));return}
 const db=await openDB();await new Promise((resolve,reject)=>{const tx=db.transaction("media","readwrite");tx.objectStore("media").add({name:file.name,type:file.type,date:new Date().toISOString(),blob:file});tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)});
 alert(t("saved"));renderArchive();
}
async function renderArchive(){
 const box=$("archiveList");box.innerHTML="";
 try{
  const db=await openDB();const items=await new Promise((resolve,reject)=>{const req=db.transaction("media").objectStore("media").getAll();req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)});
  if(!items.length){box.textContent=t("emptyArchive");return}
  items.reverse().forEach(item=>{
   const url=URL.createObjectURL(item.blob);const el=document.createElement("div");el.className="archive-item";
   const media=item.type.startsWith("video/")?document.createElement("video"):document.createElement("img");
   media.src=url;if(media.tagName==="VIDEO")media.controls=true;else media.alt=item.name;
   const date=document.createElement("small");date.textContent=new Date(item.date).toLocaleString(lang==="ar"?"ar-DZ":"fr-FR");
   const del=document.createElement("button");del.className="delete-media";del.textContent=t("delete");del.onclick=async()=>{const db=await openDB();await new Promise(r=>{const tx=db.transaction("media","readwrite");tx.objectStore("media").delete(item.id);tx.oncomplete=r});URL.revokeObjectURL(url);renderArchive()};
   el.append(media,date,del);box.appendChild(el);
  });
 }catch(e){box.textContent=lang==="ar"?"تعذر فتح الأرشيف في هذا المتصفح.":"Impossible d’ouvrir l’archive dans ce navigateur."}
}
function openArchive(){ $("archiveDialog").showModal();renderArchive()}
$("mediaInput").addEventListener("change",async e=>{const file=e.target.files[0];if(file){try{await addMedia(file)}catch(err){alert("Archive error")}e.target.value=""}});
$("openArchive").onclick=openArchive;$("navArchive").onclick=openArchive;
$("profileBtn").onclick=openProfileModal;
$("heroProfileBtn").onclick=openProfileModal;
$("editChildSummaryBtn").onclick=openProfileModal;
$("navProfile").onclick=openProfileModal;
$("langBtn").onclick=()=>{lang=lang==="ar"?"fr":"ar";applyLanguage()};
$("helpBtn").onclick=()=>{$("infoTitle").textContent=t("infoTitle");$("infoBody").innerHTML=t("infoBody");$("infoDialog").showModal()};
$("tipsBtn").onclick=()=>{$("infoTitle").textContent=t("tipsTitle");$("infoBody").innerHTML=t("tipsBody");$("infoDialog").showModal()};
$("navAbout").onclick=()=>{$("infoTitle").textContent=t("aboutTitle");$("infoBody").innerHTML=`<p>${t("aboutText")}</p><p><b>Salim Bezzaou · Oussama Mansouri</b></p>`;$("infoDialog").showModal()};
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>$(b.dataset.close).close()));
["activityDialog","archiveDialog","infoDialog"].forEach(id=>$(id).addEventListener("close",stopTimer));
applyLanguage();
if("serviceWorker" in navigator && location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
