const content = (obj) => {
    if (obj.isDownload) {
      return obj.records;
    }
    if (obj.errorCode) {
      return res.status(obj.status || 500).send(getError(obj, obj.errorCode));
    }
    if (obj.records) {
      obj = obj.records;
    }
   return getContent(obj);
 };

 function getContent(obj) {
   let meta = {
     server: 'localhost:8001/',
     count: obj.count ? obj.count : obj.length > 0 ? obj.length : 0,
     limit: obj.pg ? obj.pg.limit || 100 : 100,
     offset: obj.pg ? obj.pg.offset || 0 : 0,
     page: obj.pg ? obj.pg.page || 1 : 1
   };
   meta.pageCount = Math.ceil(meta.count / meta.limit);
   return {
     meta: meta,
     records: getList(obj)
   };
 }

 function getList(obj) {
   if (obj.rows) obj = obj.rows;
   if (!Array.isArray(obj)) obj = [obj];
   return obj;
 }


 function getError(obj, errorCode) {
   obj = obj.original ? obj.original : obj;
   return {
     developerMessage: obj.developerMessage || obj.message || obj.userMessage,
     userMessage: obj.userMessage
       ? obj.userMessage
       : "Ocorreu algum problema com esta operação! \n Tente novamente ou entre em contato com nosso suporte : )" ,
     errorCode: errorCode
   };
 }

 export default content;
