const API_KEY = "afb9ab817431d51ff5cedf9926c4ff24ffaece19ddad0985510799a253345913"


const tickersHandlers = new Map()


// todo: refactor to use URLSearchParams
const loadTickers = () => {
    if (tickersHandlers.size === 0) {
        return
    }

    fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[...tickersHandlers.keys()].join(',')}&tsyms=USD&api_key=${API_KEY}`)
        .then(r => r.json())
        .then(rawData => {
            const updatedPrices = Object.fromEntries(
                Object.entries(rawData).map(([key, value]) => [key, value.USD])
            )

            Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
                const handlers = tickersHandlers.get(currency) || []
                handlers.forEach(fn => fn(newPrice))
            })

        })

}

export const subscribeToTicker = (ticker, cb) => {
    const subscribers = tickersHandlers.get(ticker) || []
    tickersHandlers.set(ticker, [...subscribers, cb])
}

export const unsubscribeFromTicker = ticker => {
    tickersHandlers.delete(ticker)
    /*const subscribers = tickersHandlers.get(ticker) || []
    tickersHandlers.set(ticker,
        subscribers.filter(fn => fn !== cb)
    )*/
}


setInterval(loadTickers, 5000)

window.tickersHandlers = tickersHandlers

// получить стоимость криптовалютных пар с АПИшки
// полать ОБНОВЛЕНИЯ стоимости криптовалютных пар с апи