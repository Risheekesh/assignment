var rp = require("request-promise");

(async function () {

    try {
        let finalResult= [];
        console.log('start');
        const document = await rp('http://norvig.com/big.txt');
        console.log('resilt loaded');
        const resultObjArray = [];
        document.split(" ").forEach((word) => {
            word = word.replace(/[^a-zA-Z0-9]/g, '');
            
            const numberOfOccurrences = (document.match(new RegExp(word, "g")) && document.match(new RegExp(word, "g")).length) || 0;
            resultObjArray.push({
                'word': word,
                count: numberOfOccurrences
            })
        })
        const sortEle= resultObjArray.sort((a, b) => {
            return a.count - b.count;
        })
        sortEle.length=10;

        console.log('first 10 ele', sortEle);

        sortEle.forEach(async(ele)=>{
            const url=`https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20170610T055246Z.0f11bdc42e7b693a.eefbde961e10106a4efa7d852287caa49ecc68cf&lang=en-ru&text=${ele.word}`
            const outPut = await rp(url);
            finalResult.push({
                'word': ele.word,
                'count': ele.count,
                'synonyms': outPut.def[0].ts,
                'pos':outPut.def[0].pos
            })
        })

        for(let key in finalResult){
            console.log(`word:${finalResult[key].word} count: ${finalResult[key].count} synonyms: ${finalResult[key].synonyms} pos:${finalResult[key].pos}`);
        }

    } catch (err) {
        console.error('error', err);
    }
    
})();