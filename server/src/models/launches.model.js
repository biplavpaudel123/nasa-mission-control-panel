const axios = require('axios');
const planets = require('./planets.mongo');
const launchesDatabase = require('./launches.mongo')

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function existsLaunchWithID(checkFlightNumber) {
    if (await launchesDatabase.findOne({ flightNumber: checkFlightNumber })) {
        return true;
    }
}

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDatabase.findOne({}).sort('-flightNumber');
    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}

async function getAllLaunches() {
    return await launchesDatabase.find({}, { '_id': 0, '__v': 0 });
}

async function saveLaunch(launch) {
    await launchesDatabase.findOneAndUpdate({ flightNumber: launch.flightNumber }, launch, { upsert: true })
}

async function addNewLaunch(launch) {
    const planet = await planets.findOne({ kepler_name: launch.target });
    if (!planet) {
        throw new Error("No matching target was found");
    }

    const latestFlightNumber = (await getLatestFlightNumber()) + 1;
    Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['Biplav', 'Nasa'],
        flightNumber: latestFlightNumber,
    })
    await saveLaunch(launch);
}

async function abortLaunchById(launchId) {
    const aborted = await launchesDatabase.findOne({ flightNumber: launchId })
    aborted.upcoming = false;
    aborted.success = false;
    await saveLaunch(aborted);
    return aborted;
}

async function findLaunch(filter){
        return await launchesDatabase.findOne(filter);
}

async function populateLaunches(){
     const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                }, {
                    path: 'payloads',
                    select: {
                        'customers': 1
                    }
                }
            ]
        }
    });

    if (response.status!==200){
        console.log('Problem downloading launch data');
        throw new Error('Launch data download failed');
    }

    const launchDataDoc = response.data.docs;
    for (const launchData of launchDataDoc) {
        const payloads = launchData.payloads;
        const customers = payloads.flatMap((payload) => {
            return payload.customers;
        });
        const launch = {
            flightNumber: launchData.flight_number,
            rocket: launchData.rocket.name,
            mission: launchData.name,
            launchDate: launchData.date_local,
            upcoming: launchData.upcoming,
            success: launchData.success,
            customers,
        }
        console.log(`${launch.flightNumber},${launch.mission}`);
        await saveLaunch(launch);
    }
    //TODO: populate launches collection
}
// flightNumber :flight_number 
// rocket :rocket.name
// mission :name
// launchDate :date_local
// target :not available
// upcoming :upcoming
// success :success
//customers :payload.customers for each payload
async function loadLaunchesData() {
   const firstLaunch= await findLaunch({
    flightNumber:1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
   });
   if (firstLaunch){
    console.log(`Launches has already been loaded`);
   }else{
    await populateLaunches();
   }
}



module.exports = {
    loadLaunchesData,
    existsLaunchWithID,
    getAllLaunches,
    addNewLaunch,
    abortLaunchById,
}
