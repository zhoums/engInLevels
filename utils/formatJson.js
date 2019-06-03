module.exports = function(param){
  let code = 0,
      msg = "",
      data = param?param:"";

      code=param.code;
  if(param.ok==0){
    msg=param.errmsg;

  }
  return {code,msg:'',data}
}
