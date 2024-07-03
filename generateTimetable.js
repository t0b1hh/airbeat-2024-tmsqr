require ('./inc/dateformat.js');
const fs = require('fs');
const ObjectsToCsv = require('objects-to-csv');

/* CONFIG */
let useAPICall = false;
let tmsqrApiUrl = 'https://api.tmsqr.app/api/v1/festival/festivalAirbeatOne/dashboard';
let outFile = 'output/transformedData.json';
let stageCalendarCSVFileName = 'output/stageCal--';

// let data;
let data = require('./data.json').data;

/* /CONFIG */



/**
 * writes and stringifies the object into file‚
 * @param {object} _json object
 */
const saveToFile = (_file, _json) => {
    fs.writeFile(_file, JSON.stringify(_json), 'utf8', ()=>{});
}

/**
 *
 * @param {*} _stages  array of stagescd
 * @param {*} _stageId
 * @returns Stage
 */
const getStagename = (_stages, _stageId) => {
    let result = _stages.filter( item => {
        return (item.id == _stageId)
    })
    return result[0]
}

/**
 *
 * @param {*} _days array of days
 * @param {*} _dayId
 * @returns Day
 */
const getDay = (_days, _dayId) => {
    let result = _days.filter( item => {
        return (item.id == _dayId)
    })
    return result[0]
}

const createCalendarEvent = (_gig) => {
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


const transformData = ( _data ) => {

    let result={'data': [] }
    let calData={'data': [] }

    _data.gigs.forEach(gig => {
        // console.log(gig);
        // console.log(gig.stageId);

        day   = getDay(_data.days, gig.dayId);
        stage = getStagename(_data.stages, gig.stageId);

        gig['stageName'] = stage.title;
        gig['dayName']   = day.title;
        gig['dayOrder']   = day.sortOrder;
        gig['startTime'] = new Date(gig.startTimestamp * 1000).format('H:i:s');
        gig['endTime']   = new Date(gig.endTimestamp * 1000).format('H:i:s');
        gig['startDate'] = new Date(gig.startTimestamp * 1000).format('Y-m-d');
        gig['endDate']   = new Date(gig.endTimestamp * 1000).format('Y-m-d');

        result.data.push(gig);
        // calData.data.push( createCalendarEvent(gig) );
    })

    saveToFile(outFile, result);
    return result;
}



createStageCalFiles = (_stages, _transformedData) => {
    console.log(_stages);

    _stages.forEach( stage => {
        // filter
        let stageGigs=[];

        let filteredGigs = _transformedData.filter( item => {
            return (item.stageTitle == stage.title)
        })

        filteredGigs.forEach(_gig => {
            if (_gig.startDate != "1970-01-01") {
                stageGigs.push( createCalendarEvent(_gig) );
            }
        })

        // write to csv-file
        let filename = stageCalendarCSVFileName + stage.title + '.csv';
        const csv = new ObjectsToCsv(stageGigs);
        csv.toDisk(filename);
        console.log(csv.toString());


    }) // next stage

}






if (useAPICall) {

    fetch(tmsqrApiUrl, {
            method: "GET"
        })
    .then( response => console.log(response.status) || response )
    .then( response => response.text.data )
    .then( data => {
        let transformedData = transformData(data.data);
        createStageCalFiles(data.stages, transformedData.data);
    })

} else {
    let transformedData = transformData(data);
    createStageCalFiles(data.stages, transformedData.data);
}

