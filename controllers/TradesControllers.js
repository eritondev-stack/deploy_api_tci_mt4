"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }


var _connection = require('../database/connection'); var _connection2 = _interopRequireDefault(_connection);
var _moment = require('moment'); var _moment2 = _interopRequireDefault(_moment);

let databases;

class TradesControllers {
  
   trades(req, res) {

    try {
      const { account } = req.params
      const trades = req.body 
      global.SocketServer.emit('trades',convertJson(trades, account))
      return res.status(200).json({ bool: true });
    } catch (error) {
      return res.status(401).json({ error: error });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async histoty(req, res) {

    try {
      const { account } = req.params
      const trades = req.body 
      databases = convertJson(trades, account)
      const countDatabase = await _connection2.default.call(void 0, 'TB_HISTORY_TRADES').where('numberAccount', account)
      if(countDatabase.length != databases.length){
        global.SocketServer.emit('history',convertJson(trades, account))
        _connection2.default.call(void 0, 'TB_HISTORY_TRADES').where('numberAccount', account).del().then(async ()=> {
          _connection2.default.call(void 0, 'TB_HISTORY_TRADES').insert(databases).then(()=>{       
          return res.status(200).json({ bool: true});
          })
        })
       
      }else{ 
        return res.status(200).json({ bool: true});
      }
    } catch (error) {
      return res.status(401).json({ error: error });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async targetForDay(req, res) {

    try {

      const dataTradesDay = await _connection2.default.call(void 0, 'VW_PROFIT_DAY').select("*")
      const dataConsolidado = await _connection2.default.call(void 0, 'TB_HISTORY_TRADES').select("*")
      const dataContaUm = await _connection2.default.call(void 0, 'TB_HISTORY_TRADES').where('numberAccount', '1500099777')
      const dataContaDois = await _connection2.default.call(void 0, 'TB_HISTORY_TRADES').where('numberAccount', '1500098957')
      const tableConsolidado = getTableCalculada(dataConsolidado, dataTradesDay)
      const table1 = getTableCalculada(dataContaUm, dataTradesDay)
      const table2 = getTableCalculada(dataContaDois, dataTradesDay)

      Promise.all([ dataTradesDay, dataConsolidado,dataContaDois, tableConsolidado  ]).then(()=> {
        return res.status(200).json({
          consolidado: tableConsolidado,
          table1: table1,
          table2: table2
        });
      })
    } catch (error) {
      return res.status(401).json({ error: error });
    }
  }

  acoount(req, res) {

    try {
      const { accountt } = req.params
      console.log(accountt)
      const acc = req.body
      const account = {
        balance: parseFloat(acc.account[0]),
        equity: parseFloat(acc.account[1]),
        marginUsed: parseFloat(acc.account[2]),
        marginFree: parseFloat(acc.account[3])
      }
      global.SocketServer.emit('account', account)

      return res.status(200).json({ bool: true });
    } catch (error) {
      return res.status(401).json({ error: error });
    }
  } 

}



// eslint-disable-next-line @typescript-eslint/no-explicit-any
function convertJson(data, numberAccount) {
  const totalRegistros = parseInt(data.total);
  const tradesCurrent = []
  for (let index = 0; index < totalRegistros; index++) {
    const obj = `o${index}`;
    // Symbol, Lucro, TimeFechada, Lots, Comimission, TicketOrdem, Swap, tipoordem
    tradesCurrent.push({
      numberAccount: numberAccount,
      symbol: String(data[obj][0]),
      profit: parseFloat(data[obj][1]),
      dateClose: String(data[obj][2]),
      lots: parseFloat(data[obj][3]),
      commission: parseFloat(data[obj][4]),
      ticketOrder: parseInt(data[obj][5]),
      swap: parseFloat(data[obj][6]),
      typeOrder: checkTypeOrder(parseInt(data[obj][7]))
    });
  }

  return tradesCurrent
}

function checkTypeOrder(typeOrder) {
  switch (typeOrder) {
    case 0:
      return "buy";
    case 1:
      return "sell";
    case 2:
      return "buy";
    case 3:
      return "sell";
    case 4:
      return "buy";
    case 5:
      return "sell";
    case 6:
      return "balance";
    default:
      return "Not Found";
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findBalance (date, array) {
  let balance = 0
  for (let index = 0; index < array.length; index++) {
    if (
      array[index].dateClose === date &&
      array[index].typeOrder === 'balance'
    ) {
      balance += array[index].profit
    }
  }
  return balance
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findProfitDay (date, array) {
  let profit = 0
  for (let index = 0; index < array.length; index++) {
    if (
      _moment2.default.call(void 0, array[index].dateClose).format('YYYY-MM-DD')
      .toString() === date
    ) {
      profit = array[index].profitEquity
    }
  }
  return profit
}

function getTotalDaysMonth (month, year) {
  return new Date(year, month, 0).getDate()
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getTableCalculada(data, dataTradesDay) {
  let sumProfitEvolution = 0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firstArray = []
  data.map(item => {
    firstArray.push({
      dateClose: _moment2.default.call(void 0, item.dateClose).format('YYYY-MM-DD'.toString()),
      typeOrder: item.typeOrder,
      profit: item.profit
    })
  })
  const historycalc = firstArray

  const target = 0.4
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const arraySecond = []
  const firstDayYear = new Date(new Date().getFullYear(), 0, 1)
  const yearCurrent = Number(_moment2.default.call(void 0, firstDayYear).format('YYYY'))
  const lastDayYear = `${yearCurrent}-12-${getTotalDaysMonth(
    12,
    yearCurrent
  )}`
  const totalDaysYear =
    _moment2.default.call(void 0, lastDayYear).diff(_moment2.default.call(void 0, firstDayYear), 'days') + 1
  for (let index = 0; index < totalDaysYear; index++) {
    const indexBefore = index - 1
    // Add Data
    const newDate = _moment2.default.call(void 0, firstDayYear)
      .add(index, 'days')
      .format('YYYY-MM-DD')
      .toString()
    // Total Days Month
    const totalDaysMonth = getTotalDaysMonth(
      Number(_moment2.default.call(void 0, newDate).format('MM')),
      yearCurrent
    )
    // Balance
    const balance = findBalance(newDate, historycalc)
    // target Day Percent Day
    const targetDayPercent = target / totalDaysMonth
    // profit day
    const profitDay = findProfitDay(newDate, dataTradesDay)

    if (index === 0) {
      arraySecond.push({
        date: _moment2.default.call(void 0, firstDayYear)
          .format('YYYY-MM-DD')
          .toString(),
        totalDaysMonth: totalDaysMonth,
        balance: balance,
        balanceFloating: 0,
        targetDayPercent: targetDayPercent,
        targetUsdDay: 0,
        evolutionDay: 0,
        profitDay: profitDay,
        evolutionProfitDay: 0,
        balanceReal: 0
      })
      continue
    }

    const balanceFloating =
      balance === 0
        ? arraySecond[indexBefore].balanceFloating
        : balance + arraySecond[indexBefore].balanceFloating
    const targetUsdDay = balanceFloating * targetDayPercent
    const evolutionDay = balanceFloating === balance ? balance + targetUsdDay : arraySecond[indexBefore].evolutionDay + targetUsdDay
    sumProfitEvolution += profitDay
    arraySecond.push({
      date: newDate,
      totalDaysMonth: totalDaysMonth,
      balance: balance,
      balanceFloating: balanceFloating,
      targetDayPercent: targetDayPercent,
      targetUsdDay: targetUsdDay,
      evolutionDay: evolutionDay,
      profitDay: profitDay,
      evolutionProfitDay: sumProfitEvolution,
      balanceReal: balanceFloating + sumProfitEvolution
    })
  }
  const tableCalc = arraySecond
   return tableCalc
}

exports. default = TradesControllers;