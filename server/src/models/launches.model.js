const planets = require('./planets.mongo');
const launchesDatabase = require('./launches.mongo')

const DEFAULT_FLIGHT_NUMBER = 100;

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
    const planet = await planets.findOne({ kepler_name: launch.target });
    if (!planet) {
        throw new Error("No matching target was found");
    }
    await launchesDatabase.findOneAndUpdate({ flightNumber: launch.flightNumber }, launch, { upsert: true })
}

async function addNewLaunch(launch) {
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

async function loadLaunchesData() {

}


module.exports = {
    loadLaunchesData,
    existsLaunchWithID,
    getAllLaunches,
    addNewLaunch,
    abortLaunchById,
}
