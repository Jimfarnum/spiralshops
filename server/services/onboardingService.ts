import { cpostDoc } from '../utils/cloudantCore.js';

export async function onboardShopper(userId:string, email:string){
  const doc = { _id:`shopper_${userId}`, type:'shopper', userId, email, status:'onboarding', created_at:new Date().toISOString() };
  await cpostDoc(doc).catch(()=>({}));
  // award early bonus for joining
  const bonus = { _id:`bonus_${userId}_${Date.now()}`, type:'spirals_ledger', userId, delta:500, reason:'bonus', created_at:new Date().toISOString() };
  await cpostDoc(bonus).catch(()=>({}));
  return { ok:true, id: userId, message:'Thanks for joining early! 500 SPIRALS added for launch.' };
}

export async function onboardRetailer(retailerId:string, email:string, name?:string, location?:string){
  const doc = { _id:`retailer_${retailerId}`, type:'retailer', retailerId, email, name, location, status:'pending_review', created_at:new Date().toISOString() };
  await cpostDoc(doc).catch(()=>({}));
  return { ok:true, id: retailerId, message:'Retailer application received. Early partners get 90 days fee-free at launch.' };
}

export async function onboardMall(mallId:string, email:string, name?:string, location?:string){
  const doc = { _id:`mall_${mallId}`, type:'mall', mallId, email, name, location, status:'pending_review', created_at:new Date().toISOString() };
  await cpostDoc(doc).catch(()=>({}));
  return { ok:true, id: mallId, message:'Mall partner request received. You will be featured in the Grand Celebration.' };
}