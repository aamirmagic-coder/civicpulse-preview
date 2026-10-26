(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.SukumaCasework=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const ISSUE_STATUSES=Object.freeze(['open','acknowledged','in_progress','escalated','resolved','closed']);
  const ISSUE_PRIORITIES=Object.freeze(['low','normal','high','urgent']);
  const ISSUE_CATEGORIES=Object.freeze(['Water','Sanitation','Roads & potholes','Electricity','Waste collection','Public safety','Public facilities','Other']);
  const STATUS_LABELS=Object.freeze({open:'Open',acknowledged:'Acknowledged',in_progress:'In progress',escalated:'Escalated',resolved:'Resolved',closed:'Closed'});
  function createIssueRecord(input,now=new Date().toISOString()){
    if(!input||typeof input!=='object'||typeof input.title!=='string'||!input.title.trim())throw new Error('A case summary is required.');
    const priority=input.priority||'normal';
    if(!ISSUE_PRIORITIES.includes(priority))throw new Error('Unsupported issue priority.');
    const status='open';
    const row={
      id:String(input.id||''),
      title:input.title.trim().slice(0,180),
      details:String(input.details||'').trim().slice(0,2000),
      date:typeof input.date==='string'?input.date.slice(0,10):'',
      amount:null,
      completed:false,
      status,
      priority,
      category:ISSUE_CATEGORIES.includes(input.category)?input.category:'Other',
      createdAt:now,
      history:[{status,at:now,note:'Case created locally'}]
    };
    return row;
  }
  function transitionIssue(issue,nextStatus,note='',now=new Date().toISOString()){
    if(!issue||typeof issue!=='object')throw new Error('A case is required.');
    if(!ISSUE_STATUSES.includes(nextStatus))throw new Error('Unsupported issue status.');
    if(issue.status===nextStatus)throw new Error('Case is already '+STATUS_LABELS[nextStatus].toLowerCase()+'.');
    const history=Array.isArray(issue.history)?issue.history.slice():[{status:ISSUE_STATUSES.includes(issue.status)?issue.status:'open',at:issue.createdAt||now,note:'Previous status recorded'}];
    history.push({status:nextStatus,at:now,note:String(note||'').trim().slice(0,240)});
    return {...issue,status:nextStatus,completed:nextStatus==='resolved'||nextStatus==='closed',history};
  }

  function sanitizeImportedIssueRecord(input){
    const row=input&&typeof input==='object'&&!Array.isArray(input)?input:{};
    const status=ISSUE_STATUSES.includes(row.status)?row.status:'open';
    const category=ISSUE_CATEGORIES.includes(row.category)?row.category:'Other';
    const priority=ISSUE_PRIORITIES.includes(row.priority)?row.priority:'normal';
    const rawHistory=Array.isArray(row.history)?row.history.slice(-500):[];
    const history=rawHistory.filter(event=>event&&typeof event==='object'&&!Array.isArray(event)&&
      ISSUE_STATUSES.includes(event.status)&&typeof event.at==='string'&&event.at.length<50)
      .map(event=>({status:event.status,at:event.at,note:typeof event.note==='string'?event.note.trim().slice(0,240):''}));
    if(!history.length&&status==='open'&&typeof row.createdAt==='string'&&row.createdAt.length<50){
      history.push({status:'open',at:row.createdAt,note:'Legacy case restored; prior history unavailable'});
    }
    return {...row,category,priority,status,completed:status==='resolved'||status==='closed',history};
  }

  return {ISSUE_STATUSES,ISSUE_PRIORITIES,ISSUE_CATEGORIES,STATUS_LABELS,createIssueRecord,transitionIssue,sanitizeImportedIssueRecord};
});
