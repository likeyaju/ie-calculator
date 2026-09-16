export function weightConversion(sampleAmount:number,sampleWeight:number,totalWeight:number){
  if(![sampleAmount,sampleWeight,totalWeight].every(v=>Number.isFinite(v)&&v>0))return null
  return totalWeight/sampleWeight*sampleAmount
}
export function materialUsage(measuredCm:number,allowanceCm:number,orderQuantity:number,processMeters?:number|null){
  if(![measuredCm,allowanceCm,orderQuantity].every(v=>Number.isFinite(v)&&v>=0)||measuredCm<=0||orderQuantity<=0)return null
  const perPieceCm=measuredCm+allowanceCm,totalCm=perPieceCm*orderQuantity,totalMeters=totalCm/100
  const difference=processMeters!=null&&Number.isFinite(processMeters)&&processMeters>=0?processMeters-totalMeters:null
  return{perPieceCm,totalCm,totalMeters,difference}
}
