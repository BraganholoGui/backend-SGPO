const utils = {
    getAge,
    dateFormatter: new Intl.DateTimeFormat('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' }),
    include,
    months,
    weeksDays
  };

  function include(model, where, required, atts, include, alias) {
    let ret = {};
    if (model) ret.model = model;
    if (atts) ret.attributes = atts;
    ret.required = required ? required : false;
    if (where) ret.where = where;
    if (include) ret.include = include;
    if (alias) ret.as = alias;
    return ret;
  }

  function getAge(date) {
    return new Date().getFullYear() - new Date(date).getFullYear();
  }

  function months() {
    return [{
      number: 0,
      name: "Janeiro"
    }, {
      number: 1,
      name: "Fevereiro"
    }, {
      number: 2,
      name: "Março"
    }, {
      number: 3,
      name: "Abril"
    }, {
      number: 4,
      name: "Maio"
    }, {
      number: 5,
      name: "Junho"
    }, {
      number: 6,
      name: "Julho"
    }, {
      number: 7,
      name: "Agosto"
    }, {
      number: 8,
      name: "Setembro"
    }, {
      number: 9,
      name: "Outubro"
    }, {
      number: 10,
      name: "Novembro"
    }, {
      number: 11,
      name: "Dezembro"
    }
    ]
  }

  function weeksDays() {
    return [{
      number: 1,
      name: "Domingo"
    }, {
      number: 2,
      name: "Segunda-feira"
    }, {
      number: 3,
      name: "Terça-feira"
    }, {
      number: 4,
      name: "Quarta-feira"
    }, {
      number: 5,
      name: "Quinta-feira"
    }, {
      number: 6,
      name: "Sexta-feira"
    }, {
      number: 7,
      name: "Sábado"
    }]
  }

export default utils;
