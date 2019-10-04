const mkdirp = require('mkdirp');
const fs = require('fs');

let _account = '';
let _resultpathname = '';
let _resultObject = 0;

class LidRecorder {
    constructor(account) {
        _account = account;
        _resultpathname = `/result/${account}`;

        console.log(` creating LidRecorder to ${account}`);
    }

    async init() {
        const response = await readData();
        console.log(` read data is... ${response}`);
        if (!response) await writeData();
        console.log('------    Lid recorder inited! ');
    }

    async record(data) {
        console.log(`>> record to Lidrecored from ${_account} some data:`);
        console.log(data);

        Object.assign(_resultObject, data);
        await writeData();
    }

}

const writeData = async () => {
    console.log(' ...writeData');
    return new Promise((resolve) => {
        if (!_resultObject)
            _resultObject = { accountName: _account };

        console.log(_resultObject);

        mkdirp(`.${_resultpathname}`, async (err) => {
            if (err) console.error(`Make dir ERROR: ${err}`)
            else fs.writeFile(`.${_resultpathname}/peoples.json`, JSON.stringify(_resultObject, null, '  '),
                (err) => {
                    if (err)
                        resolve(console.log(`The file ".${_resultpathname}/peoples.json" could not be written.`, err));
                    else
                        resolve(console.log(`*** data created ${_resultpathname}/peoples.json`));
                });
        });
    });
}

const readData = async () => {
    console.log(' ...readData');
    return new Promise((resolve) => {
        fs.readFile(`.${_resultpathname}/peoples.json`, async (err, data) => {
            if (err) {
                console.log(`read peoples data ERROR: ${err}`);
                resolve(false);
            } else {
                _resultObject = JSON.parse(data);
                if (Object.keys(_resultObject).length) {
                    console.log('***peoples has been loaded to data');
                    console.log(_resultObject);
                    resolve(true);
                } else {
                    console.log('***peoples for this account dons not exist');
                    resolve(false);
                }
            }
            // reject();
        });
    });
}

module.exports = LidRecorder;
