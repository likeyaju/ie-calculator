<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { t } from '../i18n'
import { diagnose } from '../logic/bottleneckCT'
const router=useRouter(),mode=ref<'single'|'multi'>('single'),target=ref<number|null>(null),details=ref(false),helpOpen=ref(false)
const workers=reactive<Array<Array<number|null>>>([[null,null,null],[null,null,null],[null,null,null],[null,null,null]])
const stopwatchRecords=reactive<Array<number[]>>([[],[],[],[]]),recordDetails=reactive<boolean[]>([false,false,false,false])
const calculationWorkers=computed(()=>workers.map((row,index)=>stopwatchRecords[index].length?[stopwatchRecords[index].reduce((a,b)=>a+b,0)/stopwatchRecords[index].length]:row))
const active=computed(()=>mode.value==='single'?[calculationWorkers.value[0]]:calculationWorkers.value),result=computed(()=>diagnose(target.value,active.value)),improvement=computed(()=>result.value?Math.max(0,result.value.equivalentCT-result.value.targetCT):0)
function sanitize(raw:string){const normalized=raw.replace(/[^0-9.]/g,''),dot=normalized.indexOf('.');return dot<0?normalized:normalized.slice(0,dot+1)+normalized.slice(dot+1).replace(/\./g,'')}
function parseInput(event:Event){const input=event.target as HTMLInputElement,clean=sanitize(input.value);if(clean!==input.value)input.value=clean;return clean===''||clean==='.'?null:Number(clean)}
function updateTarget(event:Event){target.value=parseInput(event)}
function update(w:number,i:number,event:Event){stopwatchRecords[w]=[];workers[w][i]=parseInput(event)}
function selectOnFirstFocus(event:FocusEvent){const input=event.target as HTMLInputElement;if(input.dataset.justFocused!=='1'){input.dataset.justFocused='1';input.select()}}
function allowCursor(event:MouseEvent){const input=event.currentTarget as HTMLInputElement;if(input.dataset.justFocused==='1'){event.preventDefault();input.select();input.dataset.justFocused='0'}}
function measuredAverage(w:number){const row=stopwatchRecords[w];return row.length?row.reduce((a,b)=>a+b,0)/row.length:0}
function openStopwatch(w:number){sessionStorage.setItem('ie-bottleneck-state',JSON.stringify({mode:mode.value,target:target.value,workers,stopwatchRecords}));sessionStorage.setItem('ie-stopwatch-context',JSON.stringify({workerIndex:w}));router.push('/stopwatch')}
function clearMeasurement(w:number){stopwatchRecords[w]=[];recordDetails[w]=false}
function addWorker(){workers.push([null,null,null]);stopwatchRecords.push([]);recordDetails.push(false)}
function reset(){target.value=null;details.value=false;while(workers.length>4)workers.pop();while(stopwatchRecords.length>4)stopwatchRecords.pop();workers.forEach(row=>row.splice(0,3,null,null,null));stopwatchRecords.forEach((_,i)=>stopwatchRecords[i]=[]);recordDetails.splice(0,recordDetails.length,false,false,false,false);sessionStorage.removeItem('ie-bottleneck-state');sessionStorage.removeItem('ie-ct-records');sessionStorage.removeItem('ie-stopwatch-context')}
function closeHelp(){helpOpen.value=false}function hideToday(){localStorage.setItem('ie-bottleneck-help-date',new Date().toISOString().slice(0,10));helpOpen.value=false}function hideForever(){localStorage.setItem('ie-bottleneck-help-never','true');helpOpen.value=false}
onMounted(()=>{try{const saved=JSON.parse(sessionStorage.getItem('ie-bottleneck-state')||'null');if(saved){mode.value=saved.mode==='multi'?'multi':'single';target.value=saved.target??null;while(workers.length<(saved.workers?.length||0)){workers.push([null,null,null]);stopwatchRecords.push([]);recordDetails.push(false)}saved.workers?.forEach((row:Array<number|null>,i:number)=>workers[i]?.splice(0,3,...row));saved.stopwatchRecords?.forEach((row:number[],i:number)=>stopwatchRecords[i]=row)}const returned=JSON.parse(sessionStorage.getItem('ie-ct-records')||'null'),context=JSON.parse(sessionStorage.getItem('ie-stopwatch-context')||'null');if(Array.isArray(returned)&&context&&Number.isInteger(context.workerIndex)){stopwatchRecords[context.workerIndex]=returned;mode.value=saved?.mode==='multi'?'multi':'single';sessionStorage.removeItem('ie-ct-records');sessionStorage.removeItem('ie-stopwatch-context');sessionStorage.removeItem('ie-bottleneck-state')}}catch{sessionStorage.removeItem('ie-bottleneck-state')}const today=new Date().toISOString().slice(0,10);helpOpen.value=localStorage.getItem('ie-bottleneck-help-never')!=='true'&&localStorage.getItem('ie-bottleneck-help-date')!==today})
</script>
<template>
<div class="page bottleneck-page">
  <section class="ct-panel ct-entry">
<div class="ct-heading">
<h1>{{t('bottleneck.title')}}</h1>
<span>
<button @click="helpOpen=true">ⓘ {{t('bottleneck.help')}}</button>
<button @click="reset">{{t('bottleneck.reset')}}</button>
</span>
</div>
    <label class="ct-target">
<b>{{t('bottleneck.hourTarget')}}</b>
<span>
<input type="text" inputmode="decimal" :value="target??''" @input="updateTarget" @focus="selectOnFirstFocus" @click="allowCursor">
<i>{{t('bottleneck.pcsHour')}}</i>
</span>
</label>
    <div class="mode-switch">
<button :class="{active:mode==='single'}" @click="mode='single'">{{t('bottleneck.single')}}</button>
<button :class="{active:mode==='multi'}" @click="mode='multi'">{{t('bottleneck.multi')}}</button>
</div>
    <div class="worker-list">
<article v-for="(_,w) in active" :key="w" class="worker-row">
<strong>{{mode==='single'?t('bottleneck.ctMeasure'):`${t('bottleneck.worker')}${w+1}`}}</strong>
<div v-if="stopwatchRecords[w].length" class="stopwatch-summary">
<span>
<small>{{t('bottleneck.stopwatchCount')}}</small>
<b>{{stopwatchRecords[w].length}} {{t('stopwatch.count')}}</b>
</span>
<span>
<small>{{t('bottleneck.validAverage')}}</small>
<b>{{measuredAverage(w).toFixed(1)}} {{t('bottleneck.seconds')}}</b>
</span>
<button @click="recordDetails[w]=!recordDetails[w]">{{t('bottleneck.viewRecords')}}</button>
<button @click="clearMeasurement(w)">{{t('bottleneck.manualInput')}}</button>
</div>
<ol v-if="recordDetails[w]" class="ct-record-detail">
<li v-for="(record,index) in stopwatchRecords[w]" :key="index">
<span>{{index+1}}</span>
<b>{{record.toFixed(1)}} {{t('bottleneck.seconds')}}</b>
</li>
</ol>
<div v-if="!stopwatchRecords[w].length" class="ct-three">
<label v-for="(_,i) in workers[w]" :key="i">
<small>CT{{i+1}}</small>
<span>
<input type="text" inputmode="decimal" :value="workers[w][i]??''" @input="update(w,i,$event)" @focus="selectOnFirstFocus" @click="allowCursor">
<i>{{t('bottleneck.seconds')}}</i>
</span>
</label>
</div>
<button class="worker-stopwatch" @click="openStopwatch(w)">{{t('bottleneck.openStopwatch')}}</button>
</article>
</div>
<button v-if="mode==='multi'" class="add-worker" @click="addWorker">＋ {{t('bottleneck.addWorker')}}</button>
  </section>
  <section class="ct-panel ct-result" :class="result?.reached?'reached':'missed'">
<div class="ct-result-head">
<span>{{t('bottleneck.result')}}</span>
<b v-if="result">{{result.reached?t('bottleneck.reached'):t('bottleneck.notReached')}}</b>
</div>
<template v-if="result">
<div class="ct-focus-row">
<div class="ct-gap">
<small>{{result.gap>=0?t('bottleneck.more'):t('bottleneck.short')}}</small>
<strong>{{Math.abs(result.gap).toFixed(1)}} <em>{{t('bottleneck.pieces')}}</em>
</strong>
</div>
<div v-if="!result.reached" class="improvement-box">
<small>{{t('bottleneck.improveTo')}}</small>
<p>{{t('bottleneck.from')}} <b>{{result.equivalentCT.toFixed(1)}}<i>{{t('bottleneck.seconds')}}</i>
</b>
<span>→</span>
<b>{{result.targetCT.toFixed(1)}}<i>{{t('bottleneck.secondsWithin')}}</i>
</b>
</p>
<strong>{{t('bottleneck.fasterBy')}} <em>{{improvement.toFixed(1)}}</em> {{t('bottleneck.seconds')}}</strong>
</div>
<div v-else class="improvement-box success">
<strong>{{t('bottleneck.meetsRequirement')}}</strong>
</div>
</div>
<div class="ct-facts">
<span>
<small>{{t('bottleneck.actualTime')}}</small>
<b>{{result.equivalentCT.toFixed(1)}} {{t('bottleneck.seconds')}}</b>
</span>
<span>
<small>{{t('bottleneck.allowedTime')}}</small>
<b>{{result.targetCT.toFixed(1)}} {{t('bottleneck.seconds')}}</b>
</span>
<span>
<small>{{mode==='single'?t('bottleneck.currentCapacity'):t('bottleneck.groupCapacity')}}</small>
<b>{{result.capacity.toFixed(1)}} {{t('bottleneck.pieces')}}</b>
</span>
<span>
<small>{{t('bottleneck.hourTarget')}}</small>
<b>{{target?.toFixed(1)}} {{t('bottleneck.pieces')}}</b>
</span>
</div>
<button class="detail-toggle" @click="details=!details">{{t('bottleneck.details')}} {{details?'−':'+'}}</button>
<div v-if="details" class="ie-details">
<template v-if="mode==='multi'">
<span v-for="(v,i) in result.averages" :key="i">
<small>{{t('bottleneck.worker')}}{{i+1}}{{t('bottleneck.averageCT')}}</small>
<b>{{v.toFixed(1)}} {{t('bottleneck.seconds')}}</b>
</span>
</template>
<span>
<small>{{mode==='multi'?t('bottleneck.currentProcessCT'):t('bottleneck.currentAverageCT')}}</small>
<b>{{result.equivalentCT.toFixed(1)}} {{t('bottleneck.seconds')}}</b>
</span>
<span>
<small>{{t('bottleneck.targetTT')}}</small>
<b>{{result.targetCT.toFixed(1)}} {{t('bottleneck.seconds')}}</b>
</span>
<span>
<small>{{t('bottleneck.theoreticalCapacity')}}</small>
<b>{{result.capacity.toFixed(1)}} {{t('bottleneck.pcsHour')}}</b>
</span>
<span>
<small>{{t('bottleneck.hourlyGap')}}</small>
<b>{{Math.abs(result.gap).toFixed(1)}} {{t('bottleneck.pieces')}}</b>
</span>
</div>
</template>
<p v-else class="ct-empty">{{t('bottleneck.empty')}}</p>
</section>
  <div v-if="helpOpen" class="ct-help-backdrop">
<section class="ct-help" role="dialog" aria-modal="true">
<h2>{{t('bottleneck.helpTitle')}}</h2>
<ol>
<li>{{t('bottleneck.help1')}}</li>
<li>{{t('bottleneck.help2')}}</li>
<li>{{t('bottleneck.help3')}}</li>
<li>{{t('bottleneck.help4')}}</li>
</ol>
<div>
<button @click="closeHelp">{{t('bottleneck.closeOnce')}}</button>
<button @click="hideToday">{{t('bottleneck.hideToday')}}</button>
<button @click="hideForever">{{t('bottleneck.hideForever')}}</button>
</div>
</section>
</div>
</div>
</template>

