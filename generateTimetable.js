const CONF = require('./config.json');
const fs = require('fs');
const ObjectsToCsv = require('objects-to-csv');
require ('./inc/dateformat.js');


/**
 * writes and stringifies the object into file‚
 * @param {String} _file path and full file name incl. extension
 * @param {object} _json key-value-object, not stringified
 */
saveToFile = (_file, _json) => {
    fs.writeFile(_file, JSON.stringify(_json), 'utf8', ()=>{});
}


/**
 * save data to csv file
 * @param {String} _file path and full file name incl. extension
 * @param {Object} _data key-value-object, not stringified
 */
saveToCSV = (_file, _data) => {
    const csv = new ObjectsToCsv(_data);
    csv.toDisk(_file);
}



/**
 * get stage info for event
 * not really needed at the moment as stageTitle exist in data.gigs[]
 * @param {*} _stages  array of stagescd
 * @param {*} _stageId
 * @returns Stage
 */
getStage = (_stages, _stageId) => {
    let result = _stages.filter( item => {
        return (item.id == _stageId)
    })
    return result[0]
}


/**
 * get day info for event
 * @param {*} _days array of days
 * @param {*} _dayId
 * @returns Day
 */
getDay = (_days, _dayId) => {
    let result = _days.filter( item => {
        return (item.id == _dayId)
    })
    return result[0]
}


/**
 * transform single gig into event-data as needed for csv import into google cal
 * @param {*} _gig
 * @returns
 */
createCalendarEvent = (_gig) => {
    return {
        'Subject': _gig.title + ' @ ' + _gig.stageName,
        'Location': _gig.stageName,
        'Description': _gig.title + ' @ ' + _gig.stageName + ' (Airbeat-Day: ' +  _gig.dayName + ')',
        'startDate': _gig.startDate,
        'endDate': _gig.endDate,
        'startTime': _gig.startTime,
        'endTime': _gig.endTime
    };
}


/**
 * add additional info to gig data
 * @param {Array} _data gigs
 * @returns {Array} transformed data
 */
transformData = ( _data ) => {
    let result={'data': [] }

    _data.gigs.forEach(gig => {
        // console.log(gig);
        // console.log(gig.stageId);

        day   = getDay(_data.days, gig.dayId);
        stage = getStage(_data.stages, gig.stageId);

        gig['stageName'] = stage.title;
        gig['dayName']   = day.title;
        gig['dayOrder']  = day.sortOrder;
        gig['startTime'] = new Date(gig.startTimestamp * 1000).format('H:i:s');
        gig['endTime']   = new Date(gig.endTimestamp * 1000).format('H:i:s');
        gig['startDate'] = new Date(gig.startTimestamp * 1000).format('Y-m-d');
        gig['endDate']   = new Date(gig.endTimestamp * 1000).format('Y-m-d');

        result.data.push(gig);
    })

    saveToFile(CONF.outFile, result);
    saveToCSV(CONF.outFileCSV, result.data);
    return result;
}

/**
 * writes csv file per stage to disk
 * @param {Array} _stages
 * @param {Array} _transformedData.data
 */
createStageCalFiles = (_stages, _transformedData) => {
    console.log(_stages);

    _stages.forEach( stage => {
        // filter gigs on this stage
        let stageGigs=[];
        let filteredGigs = _transformedData.filter( item => {
            return (item.stageTitle == stage.title)
        })

        // we only need specific columns with defined col names in our csvs
        filteredGigs.forEach(_gig => {
            if (_gig.startDate != "1970-01-01") {
                stageGigs.push( createCalendarEvent(_gig) );
            }
        })

        // write to csv-file
        let filename = CONF.stageCalendarCSVFileNames + stage.title + '.csv';
        saveToCSV(filename, stageGigs)

        // const csv = new ObjectsToCsv(stageGigs);
        // csv.toDisk(filename);
        // console.log(csv.toString());
    }) // walk to the next stage
}

/**
 * Main
 */
let data;
if (CONF.useAPICall) {
    // grab data from tmsqr api  -> somehow undefined
    console.log('calling TMSQR Api...');+

    fetch(CONF.tmsqrApiUrl, {
            method: "GET"
        })
    .then( response => console.log(response.status) || response )
    .then( response => response.json() )
    .then( response => {
        console.log('received data from API');
        data = response.data;
        let transformedData = transformData(data);
        createStageCalFiles(data.stages, transformedData.data);
        console.log('Done using TMSQR API');
        // @todo cache data.json and archive old file
        // @todo show diff to previous version
    })

} else {
    // use local data.json file
    data = require(CONF.dataFile).data;
    let transformedData = transformData(data);
    createStageCalFiles(data.stages, transformedData.data);
    console.log('Done using local data');
}