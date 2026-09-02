<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { t } from '../i18n'
type State='idle'|'running'|'completed'|'retesting'
const router=useRouter(),state=ref<State>('idle'),elapsed=ref(0),segment=ref(0),records=ref<number[]>([]),retestIndex=ref<number|null>(null)
const pendingLeave=ref(false),leftPage=ref(false),wakeUnavailable=ref(false)
let startedAt=0,segmentAt=0,frame=0,allowLeave=false,wakeLock:any=null
const isActive=computed(()=>state.value==='running'||state.value==='retesting')
const average=computed(()=>records.value.length?records.value.reduce((a,b)=>a+b,0)/records.value.length:0)
const unusual=computed(()=>{if(records.value.length<2)return new Set<number>();const sorted=[...records.value].sort((a,b)=>a-b),median=sorted[Math.floor(sorted.length/2)];return new Set(records.value.map((v,i)=>Math.abs(v-median)/median>.3?i:-1).filter(i=>i>=0))})
function snapshot(now=Date.now()){if(!isActive.value)return;elapsed.value=Math.max(0,now-startedAt);segment.value=Math.max(0,now-segmentAt)}
function tick(){if(!isActive.value)return;snapshot();frame=requestAnimationFrame(tick)}
async function requestWakeLock(){try{const api=(navigator as any).wakeLock;if(!api){wakeUnavailable.value=true;return}wakeLock=await api.request('screen');wakeUnavailable.value=false}catch{wakeUnavailable.value=true}}
async function releaseWakeLock(){try{await wakeLock?.release()}catch{}wakeLock=null}
function begin(next:'running'|'retesting'){if(isActive.value)return;state.value=next;startedAt=Date.now();segmentAt=startedAt;elapsed.value=0;segment.value=0;leftPage.value=false;void requestWakeLock();frame=requestAnimationFrame(tick)}
function start(){if(state.value!=='idle'||records.value.length)return;begin('running')}
function lap(){if(state.value!=='running')return;const now=Date.now();snapshot(now);records.value.push(Math.max(0,now-segmentAt));segmentAt=now;segment.value=0}
function stop(){if(!isActive.value)return;const now=Date.now();snapshot(now);cancelAnimationFrame(frame);const finalSegment=Math.max(0,now-segmentAt);if(state.value==='retesting'&&retestIndex.value!==null){records.value[retestIndex.value]=finalSegment;retestIndex.value=null}else if(state.value==='running'&&finalSegment>0){records.value.push(finalSegment)}state.value='completed';void releaseWakeLock()}
function reset(){cancelAnimationFrame(frame);void releaseWakeLock();state.value='idle';elapsed.value=0;segment.value=0;records.value=[];retestIndex.value=null;leftPage.value=false;pendingLeave.value=false}
function remove(i:number){if(state.value!=='completed')return;records.value.splice(i,1);if(!records.value.length)state.value='idle'}
function retest(i:number){if(state.value!=='completed')return;retestIndex.value=i;begin('retesting')}
function cancelRetest(){if(state.value!=='retesting')return;cancelAnimationFrame(frame);void releaseWakeLock();retestIndex.value=null;elapsed.value=0;segment.value=0;state.value='completed'}
function useData(){if(state.value!=='completed'||!records.value.length)return;sessionStorage.setItem('ie-ct-records',JSON.stringify(records.value.map(v=>v/1000)));allowLeave=true;router.push('/bottleneck-ct')}
function confirmLeave(){allowLeave=true;reset();router.back()}
function continueTiming(){pendingLeave.value=false}
function visibilityChanged(){if(!isActive.value)return;if(document.hidden){leftPage.value=true;void releaseWakeLock()}else{snapshot();void requestWakeLock()}}
function format(ms:number){const m=Math.floor(ms/60000),s=Math.floor(ms%60000/1000),d=Math.floor(ms%1000/100);return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${d}`}
onBeforeRouteLeave(()=>{if(isActive.value&&!allowLeave){pendingLeave.value=true;return false}})
onMounted(()=>document.addEventListener('visibilitychange',visibilityChanged))
onBeforeUnmount(()=>{cancelAnimationFrame(frame);void releaseWakeLock();document.removeEventListener('visibilitychange',visibilityChanged)})
</script>
<template><div class="page stopwatch-page">
  <section class="watch-face"><div class="watch-status"><span>{{isActive?t('stopwatch.running'):t('stopwatch.title')}}</span><b v-if="state==='retesting'">{{t('stopwatch.retesting')}} {{(retestIndex??0)+1}} {{t('stopwatch.count')}}</b></div>
    <p v-if="wakeUnavailable&&isActive" class="watch-notice">{{t('stopwatch.keepAwakeUnavailable')}}</p><p v-if="leftPage" class="watch-notice warning">{{t('stopwatch.leftPageWarning')}}</p>
    <div class="time-block"><small>{{t('stopwatch.total')}}</small><strong>{{format(elapsed)}}</strong><span>{{t('stopwatch.current')}} · {{format(segment)}}</span></div>
    <div v-if="state==='idle'" class="watch-actions"><button class="secondary" @click="reset">{{t('stopwatch.reset')}}</button><button class="primary" @click="start">{{t('stopwatch.start')}}</button></div>
    <div v-else-if="state==='running'" class="watch-actions"><button class="secondary" @click="lap">{{t('stopwatch.lap')}}</button><button class="danger" @click="stop">{{t('stopwatch.stop')}}</button></div>
    <div v-else-if="state==='completed'" class="watch-actions single"><button class="secondary" @click="reset">{{t('stopwatch.reset')}}</button></div>
    <div v-else class="watch-actions single"><button class="danger" @click="stop">{{t('stopwatch.stop')}}</button></div>
    <button v-if="state==='retesting'" class="cancel-retest" @click="cancelRetest">{{t('stopwatch.cancel')}}</button>
  </section>
  <section class="watch-records"><div class="records-head"><h2>{{t('stopwatch.records')}}</h2><span v-if="records.length">{{records.length}} {{t('stopwatch.count')}} · {{t('stopwatch.average')}} {{format(average)}}</span></div><p v-if="!records.length" class="records-empty">{{t('stopwatch.empty')}}</p><ol v-else><li v-for="(value,i) in records" :key="i" :class="{unusual:unusual.has(i)}"><span>{{i+1}}</span><span class="record-value"><b>{{format(value)}}</b><small v-if="unusual.has(i)">{{t('stopwatch.unusual')}}</small></span><div><button :disabled="state!=='completed'" @click="retest(i)">{{t('stopwatch.retest')}}</button><button :disabled="state!=='completed'" @click="remove(i)">{{t('stopwatch.delete')}}</button></div></li></ol><button v-if="state==='completed'&&records.length" class="use-data" @click="useData">{{t('stopwatch.useData')}}</button></section>
  <div v-if="pendingLeave" class="watch-dialog-backdrop"><section class="watch-dialog" role="dialog" aria-modal="true"><h2>{{t('stopwatch.leaveTitle')}}</h2><p>{{t('stopwatch.leaveMessage')}}</p><div><button class="danger" @click="confirmLeave">{{t('stopwatch.leave')}}</button><button class="primary" @click="continueTiming">{{t('stopwatch.continue')}}</button></div></section></div>
</div></template>
