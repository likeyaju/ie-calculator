export default {
  app: { title: 'IE 计算器', subtitle: '生产现场实用工具', home: 'IE计算器首页', back: '返回', language: '语言', comingSoon: '即将开放' },
  home: {
    eyebrow: '现场工作台', greeting: '今天要算什么？', description: '把常用的 IE 计算集中在一个地方，快速、清楚、可离线使用。',
    core: '核心工具', frequent: '高频入口', allTools: '全部工具',
    bottleneck: { title: '瓶颈 CT 判断', desc: '测CT · 判断产能 · 找出差距', action: '开始判断' },
    calculator: { title: '增强计算器', desc: '混合运算 · 历史回溯 · 顺手优化' },
    efficiency: { title: '生产效率', desc: '根据产量、SAM、人数和工时实时计算' },
    ctCapacity: { title: 'CT 与产能', desc: '节拍、目标产量与人员需求换算' },
    time: { title: '时间工具', desc: '日期差、工作时间与时间换算' },
    average: { title: '平均值 / 求和', desc: '快速汇总多组测量数据' }
  },
  common: { input: '输入数据', result: '计算结果', waiting: '请完整填写必填数据', reset: '重置', formula: '查看计算公式', optional: '可选', pieces: '件', piecesPerHour: '件/小时', people: '人', hours: '小时', minutes: '分钟', seconds: '秒', countUnit: '个' },
  productionTools: { title: '生产效率', intro: '选择效率、产量、达成率或理论人数计算。' },
  ctTools: { title: 'CT 与产能', intro: '选择 CT 产能、TT 或线平衡率计算。' },
  targetOutput: { title: '目标产量', intro: '根据目标效率、人数、工时和 SAM 计算所需产量。', targetEfficiency: '目标效率', workers: '人数', hours: '工作时长', required: '所需产量', formula: '所需产量 = 目标效率 × 人数 × 工时 × 60 ÷ SAM', terms: 'SAM 是什么意思？', termText: 'SAM：按标准方法来说，做这一件产品应该需要多少分钟。结果保留小数，不自动取整。' },
  theoreticalPeople: { title: '理论人数', intro: '根据目标产量、SAM、工时和目标效率计算理论人数。', target: '目标产量', hours: '工作时长', targetEfficiency: '目标效率', required: '理论所需人数', formula: '人数 = 目标产量 × SAM ÷（60 × 工时 × 目标效率）', terms: '理论人数怎样理解？', termText: '这是按当前目标和效率推算出的理论人数，结果不自动取整，也不提供向上或向下取整建议。' },
  achievement: { title: '达成率', intro: '计算件数或效率达成率，也可以由达成率反推实际值。', quantity: '件数达成率', efficiency: '效率达成率', forward: '已知实际 → 算达成率', reverse: '已知达成率 → 反推实际', targetQuantity: '目标件数', actualQuantity: '实际件数', targetEfficiency: '目标效率', actualEfficiency: '实际效率', rate: '达成率', theoreticalActual: '反推实际值', quantityDifference: '与目标相差', efficiencyDifference: '效率差', points: '个百分点', status: '状态', reached: '达到目标', notReached: '未达到目标', quantityFormula: '件数达成率 = 实际件数 ÷ 目标件数 × 100%', efficiencyFormula: '效率达成率 = 实际效率 ÷ 目标效率 × 100%' },
  ctCapacity: { title: 'CT 产能', intro: '由 CT 同时查看 100%、90% 和 80% 三档产能。', workHours: '工作时长', hourly: '小时产能', periodTotal: '对应时段总产量', formula: '小时产能 = 3600 ÷ CT × 对应效率档位', terms: 'CT 和产能是什么意思？', termText: 'CT：实际做1件需要多久。CT越短，同一小时内理论上能够完成的件数越多。' },
  taktTime: { title: 'TT 计算', intro: '根据小时目标或日目标计算目标要求的生产节拍。', hourlyMode: '小时目标', dailyMode: '日目标', hourlyTarget: '每小时目标', dailyTarget: '日目标产量', workHours: '当天工作时长', secondsPerPiece: '秒/件', convertedHourly: '折算小时目标', explanationBefore: '按照当前目标，平均每', explanationAfter: '秒需要完成1件。', hourlyFormula: 'TT = 3600 ÷ 小时目标', dailyFormula: '折算小时目标 = 日目标 ÷ 工时；TT = 3600 ÷ 折算小时目标', terms: 'TT 是什么意思？', termText: 'TT：为了达到目标，平均多久必须做出1件，也就是目标要求做得多快。' },
  lineBalance: { title: '线平衡率', intro: '根据 TCT、工序数和最大工序 CT 计算线平衡率。', processCount: '工序数', maxCt: '最大工序 CT', resultLabel: '线平衡率', formula: '线平衡率 = TCT ÷（工序数 × 最大工序 CT）× 100%', terms: 'TCT 和线平衡率是什么意思？', termText: 'TCT：所有工序时间的总和。线平衡率：这条线各工序的工作量分得均不均匀。这里只计算理论结果，不设置优秀或较差阈值。' },
  bottleneck: {
    title: '瓶颈 CT 判断', reset: '重置', hourTarget: '每小时目标', pcsHour: '件/小时', single: '单人操作', multi: '多人操作',
    ctMeasure: '实际用时', worker: '员工', seconds: '秒', stopwatchComing: '秒表测量将在下一步接入', openStopwatch: '用秒表测量 CT', stopwatchCount: '秒表测量', validAverage: '有效平均 CT', manualInput: '改为手动输入', result: '判断结果',
    reached: '达到目标', notReached: '未达到目标', currentCapacity: '按当前速度每小时可做', groupCapacity: '这些人每小时可做',
    more: '每小时多出', short: '每小时还差', empty: '填写小时目标和至少一次 CT 后，这里会实时显示判断结果。',
    actualTime: '实际做 1 件用时', allowedTime: '目标要求用时', details: '查看详细 IE 数据', pieces: '件',
    improveTo: '需要改善到', from: '做 1 件需要从', downTo: '降到', secondsWithin: '秒以内', fasterBy: '至少还要快',
    meetsRequirement: '当前速度已经达到目标要求。', currentAverageCT: '当前平均 CT', currentProcessCT: '当前工序 CT', targetTT: '目标 TT',
    theoreticalCapacity: '理论产能', hourlyGap: '每小时差距', averageCT: '平均 CT', addWorker: '添加员工', viewRecords: '查看测量记录', help: '使用方法', helpTitle: '怎样使用瓶颈 CT 判断？', help1: '发现小时产量未达到目标。', help2: '找到持续堆积或疑似瓶颈的工序。', help3: '使用秒表或手动测量该工序 CT。', help4: '输入小时目标和 CT，查看差距与需要改善的时间。', closeOnce: '关闭本次', hideToday: '今日不再显示', hideForever: '永久不再自动显示'
  },
  stopwatch: { title: 'CT 秒表测量', total: '总计时', current: '本次用时', start: '开始', lap: '记一次', stop: '停止', reset: '重新测量', records: '测量记录', empty: '还没有测量记录', count: '次', average: '平均用时', delete: '删除', retest: '重测', useData: '使用这组数据', running: '正在计时，请尽量保持当前页面开启', retesting: '正在重测第', cancel: '取消重测', keepAwakeUnavailable: '无法自动保持屏幕亮起，请暂时不要锁屏。', leftPageWarning: '此次计时期间离开过页面，计时仍按真实经过时间计算。', unusual: '与其他测量差异较大，请确认是否需要重测', leaveTitle: '正在计时', leaveMessage: '现在返回将停止计时，本次测量数据不会保存。', leave: '返回', continue: '继续计时' },
  calculator: { title: '增强计算器', history: '计算历史', noHistory: '还没有计算记录', expression: '当前算式', result: '结果', undo: '撤销', redo: '重做', clear: '清除', clearAll: '清空全部', delete: '删除', restore: '恢复此结果', restoreHere: '恢复到这里', deleteFromHere: '从这里删除', error: '算式有误', showPercent: '百分比', showDecimal: '小数', fullscreen: '全屏', exitFullscreen: '退出', moreHistory: '更多', allHistory: '全部计算历史', close: '关闭' },
  average: { title: '平均值／求和', input: '数据录入', add: '增加一项', reset: '重置', item: '第', itemSuffix: '项', placeholder: '输入数值', remove: '删除', result: '计算结果', average: '平均值', sum: '合计', count: '有效数据', empty: '输入至少一个数值后自动计算', copy: '复制结果', copyAverage: '复制平均值', copySum: '复制合计', copied: '已复制' },
  timeTools: {
    title: '时间工具', intro: '选择需要使用的时间计算方式。',
    conversion: '时间换算', conversionDesc: '小时、分钟、秒与 Excel 时间互相换算',
    difference: '时间／日期差', differenceDesc: '计算两个时间或日期之间的间隔',
    addSubtract: '日期／时间加减', addSubtractDesc: '在指定日期时间上增加或减去时长', developing: '开发中'
  },
  timeConvert: {
    title: '时间换算', intro: '在任意一种格式中输入，其他格式会自动换算。', reset: '重置', copy: '复制', copied: '已复制',
    total: '总时间', totalHours: '总小时', totalMinutes: '总分钟', totalSeconds: '总秒数',
    combined: '组合格式', hoursMinutes: '小时＋分钟', minutesSeconds: '分钟＋秒', hoursMinutesSeconds: '小时＋分钟＋秒',
    clock: '常用时间格式', daysTime: '天＋时＋分＋秒', hourMinute: 'h:mm', hourMinuteSecond: 'h:mm:ss', excel: 'Excel 时间值',
    hour: '小时', minute: '分钟', second: '秒', day: '天', excelMultiplier: '× 24小时', excelHint: 'Excel 中 1 代表 1 天，0.5 代表 12 小时。'
  },
  timeDifference: {
    title: '时间／日期差', reset: '重置', company: '正常工作时间', natural: '自然时间', currentMethod: '当前计算方式：', companyMethod: '正常工作时间', naturalMethod: '自然时间',
    companyMeaning: '按实际时间区间与正常工作区间的交集计算。', naturalMeaning: '只计算真实经过的时间，不扣除任何非工作时间。',
    scheduleTitle: '当前工作时间', weekdays: '周一～周五', saturday: '周六', sunday: '周日', rest: '休息', lunch: '午休', fixedDate: '每月10号', fixedDateRule: '若10号遇到周日，仍按周日休息',
    start: '开始时间', end: '结束时间', showDate: '显示日期', hideDate: '隐藏日期', date: '日期', time: '时间',
    adjustment: '本次特殊工作时间调整', adjustmentHint: '只影响本次计算，不会写入长期设置。', addRest: '增加特殊休息／停工', addWork: '增加特殊工作时间',
    specialRest: '特殊休息／停工', specialWork: '特殊工作时间', remove: '删除', adjustmentStart: '开始', adjustmentEnd: '结束',
    overnightQuestion: '结束时间早于开始时间，是否按第二天计算？', nextDay: '按第二天计算', returnEdit: '返回修改', endBeforeStart: '结束时间必须晚于开始时间。',
    result: '计算结果', waiting: '请完整填写开始时间和结束时间。', totalSeconds: '总秒数', totalMinutes: '总分钟', totalHours: '总小时', readable: '时分秒', longReadable: '天时分秒',
    naturalElapsed: '自然经过时间', deducted: '实际扣除的非工作时间', effective: '正常工作时间', process: '计算过程', arrow: '→', viewDetail: '查看明细', hideDetail: '收起明细', deductionDetail: '扣除时间明细', nonWorkingInterval: '非工作区间',
    longWarning: '⚠ 本次时间跨度较长，请核对开始日期和结束日期是否输入正确。', yearUnit: '年', monthUnit: '个月', weekUnit: '周', dayUnit: '天', hourUnit: '小时', minuteUnit: '分钟', secondUnit: '秒', reason: { specialRest: '本次设置的特殊休息／停工', sunday: '当前时间位于周日，不计入计算', restDay: '当前日期为休息日，不计入计算', lunch: '午休时间', beforeWork: '上班前时间', afterWork: '下班时间', nonWorking: '不属于正常工作时间' }
  },
  timeAdd: {
    title: '日期／时间加减', startPoint: '起始日期／时间', dateSwitch: '日期', timeSwitch: '时间', add: '加', subtract: '减', years: '年', months: '月', days: '日', hours: '小时', minutes: '分钟', seconds: '秒', year: '年', month: '个月', day: '天', hour: '小时', minute: '分钟', second: '秒', decimalHours: '小时', totalMinutes: '分钟', totalSeconds: '秒', totalDays: '天', week: '周', amountConversions: '加减量的多种表示', modeHint: '年、月、日始终按自然日历计算；此模式只影响小时、分钟、秒。', result: '推算结果', waiting: '请完整填写已开启的起始项和至少一项加减量。', process: '推算过程', first: '先', then: '，再', addVerb: '增加', subtractVerb: '减少', workingSuffix: '正常工作时间', naturalSuffix: '自然时间', naturalDirect: '自然时间直接', skipped: '跳过', skippedStandardDay: '非工作时段：跳过', notCounted: '结果未计入正常工作时间', unresolvedWork: '结果未计入正常工作时间：在可推算范围内没有找到可用工作区间', noWorkingTime: '在可推算范围内没有找到正常工作时间，请检查工作时间设置。'
  },
  settings: {
    title: '设置', intro: '管理需要长期保存的默认规则。', colorHints: '颜色提示', colorHintsHint: '用绿色表示达到目标，用红色表示未达到目标；关闭后仍保留文字判断。', workTime: '工作时间设置', sharedHint: '由时间／日期差和日期／时间加减共同使用。', currentRules: '当前规则摘要', modify: '修改工作时间', restore: '恢复默认工作时间', restoreConfirm: '仅恢复默认工作时间规则，语言等其他设置不会改变。确定恢复吗？', modifyTitle: '修改工作时间', modifyIntro: '修改后保存为长期默认工作规则。', weeklyRules: '每周工作规则', weekday: '周一～周五', saturday: '周六', sunday: '周日', working: '工作', rest: '休息', startWork: '上班时间', endWork: '下班时间', lunch: '午休', lunchStart: '午休开始', lunchEnd: '午休结束', enabled: '已启用', disabled: '已停用', fixedDates: '每月固定日期', fixedHint: '固定日期规则优先于普通星期规则。', addFixed: '添加固定日期', fixedRule: '固定日期规则', monthlyDay: '每月第', monthDay: '每月第几日', sundayOffRule: '如果这一天是周日，仍然休息', delete: '删除', deleteConfirm: '确定删除这条固定日期规则吗？', unsavedConfirm: '工作时间尚未保存，确定离开吗？', save: '保存工作时间', errors: { weekdayTime: '周一～周五的下班时间必须晚于上班时间。', saturdayTime: '周六的下班时间必须晚于上班时间。', sundayTime: '周日的下班时间必须晚于上班时间。', lunchTime: '午休结束时间必须晚于开始时间。', fixedTime: '固定日期的下班时间必须晚于上班时间。', fixedDay: '固定日期必须是1至31之间的整数。', fixedConflict: '同一天存在两条启用的固定日期规则，请停用或删除其中一条后再保存。' }
  },
  efficiency: {
    title: '生产效率', kicker: 'EFFICIENCY', intro: '输入现场数据，结果会自动更新。', input: '生产数据',
    output: '实际产量', outputHint: '完成的合格产品数量', sam: 'SAM', samHint: '每件产品的标准分钟数',
    workers: '人数', workersHint: '参与生产的实际人数', hours: '工作时长', hoursHint: '实际生产时间',
    optional: '可选', target: '目标效率', targetHint: '填写后可计算差值与达成率', units: { pcs: '件', min: '分钟', people: '人', hour: '小时', percent: '%' },
    result: '计算结果', mainResult: '实际效率', waiting: '等待输入', readyHint: '请完整填写产量、SAM、人数和工时', live: '实时',
    difference: '效率差', points: '个百分点', achievement: '目标达成率', status: '状态', noTarget: '未设置目标',
    good: '已达到目标', close: '接近目标', low: '未达到目标', invalid: '请输入大于 0 的有效数值', reset: '重置数据',
    formulaTitle: '查看计算公式', formula: '效率 =（实际产量 × SAM）÷（人数 × 工作时长 × 60）× 100%',
    formulaNote: '工作时长按小时输入，因此需要乘以 60 转换为分钟。', terminology: 'SAM 术语说明',
    samName: 'Standard Allowed Minutes · 标准允许分钟', samDefinition: '完成一件合格产品在标准条件下允许使用的时间。',
    samExample: '例如：SAM 为 12 分钟，表示每件产品的标准工时是 12 分钟。'
  }
} as const
